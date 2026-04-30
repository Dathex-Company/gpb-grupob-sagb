import {
  addDoc,
  collection,
  db,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where
} from './supabase';
import {
  Agent,
  AgentArtifact,
  AgentHandoff,
  AgentMission,
  AgentMissionBlueprint,
  AgentMissionBlueprintRole,
  AgentMissionEvent,
  AgentMissionParticipant,
  AgentMissionStep,
  AgentMissionBlueprintStepConfig
} from '../types';
import {
  MissionStageBlueprint,
  resolveOfficialAgentForStage
} from './contextAssembler';
import { resolveWorkspaceId } from '../utils/supabaseChat';

type CreateMissionParams = {
  workspaceId?: string | null;
  blueprintId?: string | null;
  title?: string;
  initialInput: string;
  missionMode?: AgentMission['missionMode'];
  createdBy?: string | null;
  agents: Agent[];
};

type PatchMissionParams = {
  missionId: string;
  patch: Partial<AgentMission>;
};

type PatchMissionStepParams = {
  stepId: string;
  patch: Partial<AgentMissionStep>;
};

type CreateMissionHandoffParams = {
  workspaceId?: string | null;
  missionId: string;
  fromStepId: string;
  toStepId?: string | null;
  fromAgentId?: string | null;
  toAgentId?: string | null;
  artifactId?: string | null;
  status: AgentHandoff['status'];
  note?: string | null;
  payload?: Record<string, any>;
};

export type MissionBundle = {
  mission: AgentMission | null;
  steps: AgentMissionStep[];
  artifacts: AgentArtifact[];
  handoffs: AgentHandoff[];
  participants: AgentMissionParticipant[];
};

const toDate = (value: any): Date => {
  if (value instanceof Date) return value;
  const parsed = new Date(value || Date.now());
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const createMissionTitle = (initialInput: string) => {
  const clean = String(initialInput || '').replace(/\s+/g, ' ').trim();
  if (!clean) return 'Missao de Orquestracao';
  const short = clean.length > 72 ? `${clean.slice(0, 72).trim()}...` : clean;
  return `Missao | ${short}`;
};

const runOnce = <T,>(ref: any, mapper: (snapshot: any) => T, fallback: T): Promise<T> => {
  return new Promise((resolve) => {
    let settled = false;
    let unsubscribe = () => undefined;
    const timeoutId = setTimeout(() => {
      if (settled) return;
      settled = true;
      unsubscribe();
      resolve(fallback);
    }, 7000);

    unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        unsubscribe();
        resolve(mapper(snapshot));
      },
      () => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        unsubscribe();
        resolve(fallback);
      }
    );
  });
};

const buildMissionBlueprintStages = (
  flowConfig: AgentMissionBlueprintStepConfig[],
  roles: AgentMissionBlueprintRole[]
): MissionStageBlueprint[] => {
  return [...flowConfig]
    .sort((a, b) => Number(a.stepIndex || 0) - Number(b.stepIndex || 0))
    .map((step) => {
      const role = roles.find((item) => item.roleKey === step.roleKey);
      return {
        stepIndex: Number(step.stepIndex || 0),
        stepName: String(step.stepName || `Etapa ${step.stepIndex}`),
        roleKey: String(step.roleKey || ''),
        roleName: role?.roleName || undefined,
        requiredSkills: role?.requiredSkills || [],
        selectionRules: step.selectionRules || role?.metadata || {},
        suggestedAgentId: role?.suggestedAgentId || null,
        artifactType: String(step.artifactType || 'artifact'),
        requiredFields: Array.isArray(step.requiredFields) ? step.requiredFields : [],
        schemaExample: step.schemaExample && typeof step.schemaExample === 'object'
          ? step.schemaExample
          : {},
        dependsOnStepIndexes: Array.isArray(step.dependsOnStepIndexes)
          ? step.dependsOnStepIndexes.map(Number).filter((n) => Number.isFinite(n))
          : [],
        checkpointRequired: Boolean(step.checkpointRequired)
      } as MissionStageBlueprint;
    })
    .filter((item) => item.stepIndex > 0 && Boolean(item.roleKey));
};

const loadBlueprintById = async (blueprintId: string): Promise<AgentMissionBlueprint | null> => {
  const q = query(collection(db, 'agent_mission_blueprints'), where('id', '==', blueprintId));
  return runOnce(q, (snapshot) => {
    const row = snapshot.docs[0];
    if (!row) return null;
    const data = row.data() as any;
    return {
      id: String(data.id || row.id),
      workspaceId: String(data.workspaceId || data.workspace_id || ''),
      title: String(data.title || 'Blueprint'),
      description: data.description || null,
      category: String(data.category || 'general'),
      flowConfig: Array.isArray(data.flowConfig || data.flow_config) ? (data.flowConfig || data.flow_config) : [],
      isActive: Boolean(data.isActive ?? data.is_active ?? true),
      createdAt: toDate(data.createdAt || data.created_at),
      updatedAt: toDate(data.updatedAt || data.updated_at)
    } as AgentMissionBlueprint;
  }, null);
};

export const loadMissionBlueprintRoles = async (blueprintId: string): Promise<AgentMissionBlueprintRole[]> => {
  const q = query(
    collection(db, 'agent_mission_blueprint_roles'),
    where('blueprintId', '==', blueprintId),
    orderBy('createdAt', 'asc')
  );

  return runOnce(q, (snapshot) => snapshot.docs.map((row: any) => {
    const data = row.data() as any;
    return {
      id: String(data.id || row.id),
      blueprintId: String(data.blueprintId || data.blueprint_id || blueprintId),
      roleKey: String(data.roleKey || data.role_key || ''),
      roleName: String(data.roleName || data.role_name || 'Papel'),
      requiredSkills: Array.isArray(data.requiredSkills || data.required_skills) ? (data.requiredSkills || data.required_skills) : [],
      suggestedAgentId: data.suggestedAgentId || data.suggested_agent_id || null,
      metadata: data.metadata || {},
      createdAt: toDate(data.createdAt || data.created_at)
    } as AgentMissionBlueprintRole;
  }), []);
};

const safeCreateMissionParticipants = async (rows: Omit<AgentMissionParticipant, 'id' | 'linkedAt'>[]) => {
  const created: AgentMissionParticipant[] = [];
  for (const row of rows) {
    try {
      const linkedAt = new Date();
      const ref = await addDoc(collection(db, 'agent_mission_participants'), {
        workspaceId: row.workspaceId,
        missionId: row.missionId,
        blueprintRoleKey: row.blueprintRoleKey,
        blueprintRoleName: row.blueprintRoleName,
        agentId: row.agentId,
        agentName: row.agentName,
        agentRole: row.agentRole || null,
        linkedAt,
        payload: row.payload || {}
      });
      created.push({ id: ref.id, linkedAt, ...row });
    } catch (error) {
      console.warn('agent_mission_participants indisponivel, mantendo participantes no payload/eventos.', error);
      return [];
    }
  }
  return created;
};

export const createMissionWithSteps = async ({
  workspaceId,
  blueprintId,
  title,
  initialInput,
  missionMode = 'autonomous',
  createdBy,
  agents
}: CreateMissionParams): Promise<{ mission: AgentMission; steps: AgentMissionStep[]; participants: AgentMissionParticipant[] }> => {
  const scopedWorkspaceId = resolveWorkspaceId(workspaceId);
  const now = new Date();

  let selectedBlueprint: AgentMissionBlueprint | null = null;
  let blueprintRoles: AgentMissionBlueprintRole[] = [];
  let stageBlueprints: MissionStageBlueprint[] = [];

  if (blueprintId) {
    selectedBlueprint = await loadBlueprintById(blueprintId);
    if (!selectedBlueprint) throw new Error('Blueprint selecionado nao encontrado.');
    blueprintRoles = await loadMissionBlueprintRoles(selectedBlueprint.id);
    stageBlueprints = buildMissionBlueprintStages(selectedBlueprint.flowConfig || [], blueprintRoles);
  }

  if (!selectedBlueprint) {
    throw new Error('A missão exige blueprint oficial ativo para definir papéis e fluxo.');
  }

  if (!stageBlueprints.length) {
    throw new Error('Blueprint sem etapas válidas. Defina flowConfig com papel/ordem/dependências/checkpoints.');
  }

  const missionData: Partial<AgentMission> = {
    workspaceId: scopedWorkspaceId,
    blueprintId: blueprintId || null,
    title: title || createMissionTitle(initialInput),
    initialInput,
    status: 'queued',
    currentStepIndex: 1,
    missionMode,
    createdBy: createdBy || null,
    startedAt: null,
    finishedAt: null,
    createdAt: now,
    updatedAt: now,
    payload: {
      missionType: 'blueprint_based',
      stageCount: stageBlueprints.length,
      blueprintTitle: selectedBlueprint?.title || null
    }
  };

  const missionRef = await addDoc(collection(db, 'agent_missions'), missionData);

  const mission: AgentMission = {
    id: missionRef.id,
    ...missionData
  } as AgentMission;

  await createMissionEvent({
    missionId: mission.id,
    eventType: 'mission_created',
    actorId: createdBy || 'system',
    actorName: createdBy ? 'Operador' : 'Mission Runner',
    actorType: createdBy ? 'human' : 'system',
    content: `Missao criada com ${stageBlueprints.length} etapa(s).`,
    payload: {
      blueprintId: blueprintId || null,
      stageCount: stageBlueprints.length,
      workspaceId: scopedWorkspaceId
    }
  });

  const participantSeed = new Map<string, Omit<AgentMissionParticipant, 'id' | 'linkedAt'>>();

  const usedAgentIds = new Set<string>();
  const steps: AgentMissionStep[] = [];

  for (const stage of stageBlueprints) {
    if (!Array.isArray(agents) || agents.length === 0) {
      throw new Error('Nenhum agente oficial disponível para resolver os papéis da missão.');
    }

    const allowAgentReuse = Boolean(stage.selectionRules?.allowAgentReuse);
    const resolved = resolveOfficialAgentForStage(agents, stage, {
      excludedAgentIds: allowAgentReuse ? [] : Array.from(usedAgentIds)
    });
    const resolvedAgent = agents.find((agent) => String(agent.id) === String(resolved.agentId));
    if (!resolvedAgent) {
      throw new Error(`Agente oficial resolvido não encontrado no cadastro para papel ${stage.roleKey}.`);
    }
    usedAgentIds.add(String(resolvedAgent.id));

    const stepNow = new Date();
    const status = stage.stepIndex === 1 ? 'ready' : 'pending';

    const stepPayload = {
      roleKey: stage.roleKey,
      roleName: stage.roleName || stage.roleKey,
      requiredSkills: stage.requiredSkills || [],
      selectionRules: stage.selectionRules || {},
      suggestedAgentId: stage.suggestedAgentId || null,
      dependsOnStepIndexes: stage.dependsOnStepIndexes || [],
      checkpointRequired: Boolean(stage.checkpointRequired),
      requiredFields: stage.requiredFields || [],
      schemaExample: stage.schemaExample || {},
      agentRole: resolvedAgent.officialRole || stage.roleName || stage.roleKey,
      agentSource: 'official_registry',
      preferredModel: resolved.preferredModel,
      selectionMode: 'automatic_blueprint_role',
      selectionRuleUsed: resolved.selectionRuleUsed,
      adherenceScore: resolved.adherenceScore,
      adherenceEvidence: resolved.adherenceEvidence,
      allowAgentReuse,
      manualSelectionReady: true,
      manualCandidateAgentIds: Array.isArray(stage.selectionRules?.manualAgentIds)
        ? stage.selectionRules.manualAgentIds
        : []
    };

    const stepRef = await addDoc(collection(db, 'agent_mission_steps'), {
      workspaceId: scopedWorkspaceId,
      missionId: mission.id,
      stepIndex: stage.stepIndex,
      agentId: resolvedAgent.id,
      agentName: resolvedAgent.name,
      stepName: stage.stepName,
      artifactType: stage.artifactType,
      status,
      validationStatus: null,
      retryCount: 0,
      promptSnapshot: null,
      contextSnapshot: null,
      errorMessage: null,
      startedAt: null,
      finishedAt: null,
      createdAt: stepNow,
      updatedAt: stepNow,
      payload: stepPayload
    });

    participantSeed.set(`${stage.roleKey}:${resolvedAgent.id}`, {
      workspaceId: scopedWorkspaceId,
      missionId: mission.id,
      blueprintRoleKey: stage.roleKey,
      blueprintRoleName: stage.roleName || stage.roleKey,
      agentId: resolvedAgent.id,
      agentName: resolvedAgent.name,
      agentRole: resolvedAgent.officialRole || stage.roleName || stage.roleKey,
      payload: {
        preferredModel: resolved.preferredModel,
        selectionMode: 'automatic_blueprint_role',
        selectionRuleUsed: resolved.selectionRuleUsed,
        adherenceScore: resolved.adherenceScore,
        adherenceEvidence: resolved.adherenceEvidence,
        allowAgentReuse,
        manualSelectionReady: true,
        manualCandidateAgentIds: Array.isArray(stage.selectionRules?.manualAgentIds)
          ? stage.selectionRules.manualAgentIds
          : []
      }
    });

    steps.push({
      id: stepRef.id,
      workspaceId: scopedWorkspaceId,
      missionId: mission.id,
      stepIndex: stage.stepIndex,
      agentId: resolvedAgent.id,
      agentName: resolvedAgent.name,
      stepName: stage.stepName,
      artifactType: stage.artifactType,
      status,
      validationStatus: null,
      retryCount: 0,
      promptSnapshot: null,
      contextSnapshot: null,
      errorMessage: null,
      startedAt: null,
      finishedAt: null,
      createdAt: stepNow,
      updatedAt: stepNow,
      payload: stepPayload
    } as AgentMissionStep);
  }

  const participants = await safeCreateMissionParticipants(Array.from(participantSeed.values()));
  for (const participant of participants) {
    await createMissionEvent({
      missionId: mission.id,
      eventType: 'agent_linked',
      actorId: participant.agentId,
      actorName: participant.agentName,
      actorType: 'agent',
      content: `Agente vinculado ao papel ${participant.blueprintRoleKey}.`,
      payload: {
        participantId: participant.id,
        roleKey: participant.blueprintRoleKey,
        agentId: participant.agentId,
        agentName: participant.agentName
      }
    });
  }

  return { mission, steps, participants };
};

export const patchMission = async ({ missionId, patch }: PatchMissionParams) => {
  await updateDoc(doc(db, 'agent_missions', missionId), {
    ...patch,
    updatedAt: new Date()
  });
};

export const patchMissionStep = async ({ stepId, patch }: PatchMissionStepParams) => {
  await updateDoc(doc(db, 'agent_mission_steps', stepId), {
    ...patch,
    updatedAt: new Date()
  });
};

export const createMissionHandoff = async ({
  workspaceId,
  missionId,
  fromStepId,
  toStepId,
  fromAgentId,
  toAgentId,
  artifactId,
  status,
  note,
  payload
}: CreateMissionHandoffParams): Promise<AgentHandoff> => {
  const createdAt = new Date();
  const ref = await addDoc(collection(db, 'agent_handoffs'), {
    workspaceId: resolveWorkspaceId(workspaceId),
    missionId,
    fromStepId,
    toStepId: toStepId || null,
    fromAgentId: fromAgentId || null,
    toAgentId: toAgentId || null,
    artifactId: artifactId || null,
    status,
    note: note || null,
    createdAt,
    acceptedAt: status === 'accepted' ? createdAt : null,
    payload: payload || {}
  });

  return {
    id: ref.id,
    workspaceId: resolveWorkspaceId(workspaceId),
    missionId,
    fromStepId,
    toStepId: toStepId || null,
    fromAgentId: fromAgentId || null,
    toAgentId: toAgentId || null,
    artifactId: artifactId || null,
    status,
    note: note || null,
    createdAt,
    acceptedAt: status === 'accepted' ? createdAt : null,
    payload: payload || {}
  };
};

export const loadMissionBlueprints = async (workspaceId?: string | null): Promise<AgentMissionBlueprint[]> => {
  const scopedWorkspaceId = resolveWorkspaceId(workspaceId);
  const buildQuery = (targetWorkspaceId: string) => query(
    collection(db, 'agent_mission_blueprints'),
    where('workspaceId', '==', targetWorkspaceId),
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  );

  const [workspaceBlueprints, globalBlueprints] = await Promise.all([
    runOnce(buildQuery(scopedWorkspaceId), (snapshot) => snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      flowConfig: Array.isArray(doc.data().flowConfig || doc.data().flow_config)
        ? (doc.data().flowConfig || doc.data().flow_config)
        : [],
      createdAt: toDate(doc.data().createdAt || doc.data().created_at),
      updatedAt: toDate(doc.data().updatedAt || doc.data().updated_at)
    }) as AgentMissionBlueprint), []),
    runOnce(buildQuery('00000000-0000-0000-0000-000000000000'), (snapshot) => snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      flowConfig: Array.isArray(doc.data().flowConfig || doc.data().flow_config)
        ? (doc.data().flowConfig || doc.data().flow_config)
        : [],
      createdAt: toDate(doc.data().createdAt || doc.data().created_at),
      updatedAt: toDate(doc.data().updatedAt || doc.data().updated_at)
    }) as AgentMissionBlueprint), [])
  ]);

  const dedup = new Map<string, AgentMissionBlueprint>();
  [...workspaceBlueprints, ...globalBlueprints].forEach((bp) => dedup.set(bp.id, bp));
  return Array.from(dedup.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const createMissionEvent = async (event: Omit<AgentMissionEvent, 'id' | 'createdAt'>): Promise<AgentMissionEvent> => {
  const now = new Date();
  const ref = await addDoc(collection(db, 'agent_mission_events'), {
    ...event,
    createdAt: now
  });

  return {
    id: ref.id,
    ...event,
    createdAt: now
  };
};

export const loadMissionEvents = async (missionId: string): Promise<AgentMissionEvent[]> => {
  const q = query(
    collection(db, 'agent_mission_events'),
    where('missionId', '==', missionId),
    orderBy('createdAt', 'asc')
  );

  return runOnce(q, (snapshot) => snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: toDate(doc.data().createdAt)
  }) as AgentMissionEvent), []);
};

export const loadMissionParticipants = async (missionId: string): Promise<AgentMissionParticipant[]> => {
  try {
    const q = query(
      collection(db, 'agent_mission_participants'),
      where('missionId', '==', missionId),
      orderBy('linkedAt', 'asc')
    );
    return runOnce(q, (snapshot) => snapshot.docs.map((row: any) => {
      const data = row.data() as any;
      return {
        id: String(data.id || row.id),
        workspaceId: String(data.workspaceId || data.workspace_id || ''),
        missionId: String(data.missionId || data.mission_id || missionId),
        blueprintRoleKey: String(data.blueprintRoleKey || data.blueprint_role_key || ''),
        blueprintRoleName: String(data.blueprintRoleName || data.blueprint_role_name || ''),
        agentId: String(data.agentId || data.agent_id || ''),
        agentName: String(data.agentName || data.agent_name || 'Agente'),
        agentRole: data.agentRole || data.agent_role || null,
        linkedAt: toDate(data.linkedAt || data.linked_at),
        payload: data.payload || {}
      } as AgentMissionParticipant;
    }), []);
  } catch {
    return [];
  }
};

export const loadMissionBundle = async ({
  workspaceId,
  missionId
}: {
  workspaceId?: string | null;
  missionId: string;
}): Promise<MissionBundle> => {
  const scopedWorkspaceId = resolveWorkspaceId(workspaceId);
  const missionQuery = query(
    collection(db, 'agent_missions'),
    where('workspaceId', '==', scopedWorkspaceId),
    where('id', '==', missionId),
    orderBy('createdAt', 'desc')
  );
  const stepsQuery = query(
    collection(db, 'agent_mission_steps'),
    where('workspaceId', '==', scopedWorkspaceId),
    where('missionId', '==', missionId),
    orderBy('stepIndex', 'asc')
  );
  const artifactsQuery = query(
    collection(db, 'agent_artifacts'),
    where('workspaceId', '==', scopedWorkspaceId),
    where('missionId', '==', missionId),
    orderBy('createdAt', 'asc')
  );
  const handoffsQuery = query(
    collection(db, 'agent_handoffs'),
    where('workspaceId', '==', scopedWorkspaceId),
    where('missionId', '==', missionId),
    orderBy('createdAt', 'asc')
  );

  const [mission, steps, artifacts, handoffs, participants] = await Promise.all([
    runOnce(
      missionQuery,
      (snapshot) => {
        const row = snapshot.docs[0];
        if (!row) return null;
        const data = row.data() as any;
        return {
          id: String(data.id || row.id),
          workspaceId: String(data.workspaceId || scopedWorkspaceId),
          title: String(data.title || 'Missao'),
          initialInput: String(data.initialInput || ''),
          status: data.status || 'queued',
          currentStepIndex: Number(data.currentStepIndex || 1),
          createdBy: data.createdBy || null,
          startedAt: data.startedAt ? toDate(data.startedAt) : null,
          finishedAt: data.finishedAt ? toDate(data.finishedAt) : null,
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt),
          payload: data.payload || {}
        } as AgentMission;
      },
      null
    ),
    runOnce(
      stepsQuery,
      (snapshot) => snapshot.docs.map((row: any) => {
        const data = row.data() as any;
        return {
          id: String(data.id || row.id),
          workspaceId: String(data.workspaceId || scopedWorkspaceId),
          missionId: String(data.missionId || missionId),
          stepIndex: Number(data.stepIndex || 0),
          agentId: data.agentId || null,
          agentName: String(data.agentName || 'Agente'),
          stepName: String(data.stepName || 'Etapa'),
          artifactType: String(data.artifactType || 'artifact'),
          status: data.status || 'pending',
          validationStatus: data.validationStatus || null,
          retryCount: Number(data.retryCount || 0),
          promptSnapshot: data.promptSnapshot || null,
          contextSnapshot: data.contextSnapshot || null,
          errorMessage: data.errorMessage || null,
          startedAt: data.startedAt ? toDate(data.startedAt) : null,
          finishedAt: data.finishedAt ? toDate(data.finishedAt) : null,
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt),
          payload: data.payload || {}
        } as AgentMissionStep;
      }),
      []
    ),
    runOnce(
      artifactsQuery,
      (snapshot) => snapshot.docs.map((row: any) => {
        const data = row.data() as any;
        return {
          id: String(data.id || row.id),
          workspaceId: String(data.workspaceId || scopedWorkspaceId),
          missionId: String(data.missionId || missionId),
          stepId: String(data.stepId || ''),
          artifactType: String(data.artifactType || 'artifact'),
          status: data.status || 'created',
          version: Number(data.version || 1),
          contentJson: data.contentJson || null,
          contentText: data.contentText || null,
          createdByAgentId: data.createdByAgentId || null,
          createdAt: toDate(data.createdAt),
          payload: data.payload || {}
        } as AgentArtifact;
      }),
      []
    ),
    runOnce(
      handoffsQuery,
      (snapshot) => snapshot.docs.map((row: any) => {
        const data = row.data() as any;
        return {
          id: String(data.id || row.id),
          workspaceId: String(data.workspaceId || scopedWorkspaceId),
          missionId: String(data.missionId || missionId),
          fromStepId: String(data.fromStepId || ''),
          toStepId: data.toStepId || null,
          fromAgentId: data.fromAgentId || null,
          toAgentId: data.toAgentId || null,
          artifactId: data.artifactId || null,
          status: data.status || 'created',
          note: data.note || null,
          createdAt: toDate(data.createdAt),
          acceptedAt: data.acceptedAt ? toDate(data.acceptedAt) : null,
          payload: data.payload || {}
        } as AgentHandoff;
      }),
      []
    ),
    loadMissionParticipants(missionId)
  ]);

  return { mission, steps, artifacts, handoffs, participants };
};
