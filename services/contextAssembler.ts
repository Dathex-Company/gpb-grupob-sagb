import {
  Agent,
  AgentArtifact,
  AgentMission,
  AgentMissionBlueprintRole,
  AgentMissionStep,
  ModelProvider
} from '../types';

export type MissionStageBlueprint = {
  stepIndex: number;
  stepName: string;
  roleKey: string;
  roleName?: string;
  requiredSkills: string[];
  selectionRules: Record<string, any>;
  suggestedAgentId?: string | null;
  artifactType: string;
  requiredFields: string[];
  schemaExample: Record<string, any>;
  dependsOnStepIndexes: number[];
  checkpointRequired: boolean;
};

export type ResolvedMissionAgent = {
  agentId: string;
  agentName: string;
  agentRole: string;
  preferredModel: ModelProvider;
  fullPrompt: string;
  source: 'official_registry';
  selectionRuleUsed: string;
  adherenceScore: number;
  adherenceEvidence: string[];
};

type ResolveOfficialAgentOptions = {
  excludedAgentIds?: string[];
};

type AssembleContextParams = {
  mission: AgentMission;
  step: AgentMissionStep;
  blueprint: MissionStageBlueprint;
  steps: AgentMissionStep[];
  artifacts: AgentArtifact[];
  agents: Agent[];
};

const normalize = (value: any) => String(value || '').trim().toLowerCase();

const getAgentSearchText = (agent: Agent): string => {
  return [
    agent.name,
    agent.officialRole,
    agent.shortDescription,
    agent.area,
    agent.functionName,
    agent.baseRoleUniversal,
    agent.unitName,
    agent.sector
  ]
    .map(normalize)
    .filter(Boolean)
    .join(' ');
};

const getLatestArtifactForStep = (artifacts: AgentArtifact[], stepId: string) => {
  return [...artifacts]
    .filter((artifact) => artifact.stepId === stepId)
    .sort((a, b) => {
      if (b.version !== a.version) return b.version - a.version;
      return b.createdAt.getTime() - a.createdAt.getTime();
    })[0] || null;
};

const buildPreviousArtifactText = (artifact?: AgentArtifact | null) => {
  if (!artifact) return 'Nenhum artefato anterior disponível.';
  const json = artifact.contentJson && typeof artifact.contentJson === 'object'
    ? JSON.stringify(artifact.contentJson, null, 2)
    : '{}';
  return `Artefato anterior (${artifact.artifactType}, v${artifact.version}):\n${json}`;
};

const scoreAgentForStage = (
  agent: Agent,
  stage: MissionStageBlueprint,
  options?: ResolveOfficialAgentOptions
) => {
  const evidence: string[] = [];
  const excluded = new Set((options?.excludedAgentIds || []).map((id) => String(id)));
  if (excluded.has(String(agent.id))) {
    return { score: Number.NEGATIVE_INFINITY, evidence: ['Agente já alocado em papel anterior desta missão.'] };
  }

  const status = String(agent.status || '').toUpperCase();
  if (agent.active === false || status === 'BLOCKED') {
    return { score: Number.NEGATIVE_INFINITY, evidence: ['Agente bloqueado/inativo.'] };
  }

  const haystack = getAgentSearchText(agent);
  let score = 0;

  if (stage.suggestedAgentId && String(stage.suggestedAgentId) === String(agent.id)) {
    score += 120;
    evidence.push('Match por suggestedAgentId do blueprint.');
  }

  const preferredAgentIds = Array.isArray(stage.selectionRules?.preferredAgentIds)
    ? stage.selectionRules.preferredAgentIds.map((id: any) => String(id))
    : [];
  if (preferredAgentIds.includes(String(agent.id))) {
    score += 100;
    evidence.push('Match por preferredAgentIds.');
  }

  const requiredSkills = Array.isArray(stage.requiredSkills) ? stage.requiredSkills : [];
  const missingSkills = requiredSkills.filter((skill) => !haystack.includes(normalize(skill)));
  const strictSkills = stage.selectionRules?.strictRequiredSkills !== false;
  if (missingSkills.length > 0 && strictSkills) {
    return {
      score: Number.NEGATIVE_INFINITY,
      evidence: [`Skills ausentes (strict): ${missingSkills.join(', ')}`]
    };
  }
  if (requiredSkills.length > 0) {
    const matched = requiredSkills.length - missingSkills.length;
    score += matched * 20;
    if (matched > 0) evidence.push(`Skills aderentes: ${matched}/${requiredSkills.length}.`);
    if (missingSkills.length > 0) evidence.push(`Skills ausentes (não estritas): ${missingSkills.join(', ')}`);
  }

  const roleTerms = [stage.roleKey, stage.roleName]
    .map(normalize)
    .flatMap((term) => term.split(/\s+/g).filter((w) => w.length > 2));
  const roleHits = roleTerms.filter((term) => haystack.includes(term)).length;
  if (roleHits > 0) {
    score += roleHits * 8;
    evidence.push(`Aderência semântica ao papel (${roleHits} termos).`);
  }

  const mustIncludeTerms = Array.isArray(stage.selectionRules?.mustIncludeTerms)
    ? stage.selectionRules.mustIncludeTerms.map(normalize).filter(Boolean)
    : [];
  const missingMandatoryTerms = mustIncludeTerms.filter((term) => !haystack.includes(term));
  if (missingMandatoryTerms.length > 0) {
    return {
      score: Number.NEGATIVE_INFINITY,
      evidence: [`Termos obrigatórios ausentes: ${missingMandatoryTerms.join(', ')}`]
    };
  }
  if (mustIncludeTerms.length > 0) {
    score += mustIncludeTerms.length * 10;
    evidence.push(`Regras mustIncludeTerms atendidas (${mustIncludeTerms.length}).`);
  }

  const domain = normalize(stage.selectionRules?.domain);
  if (domain) {
    if (haystack.includes(domain)) {
      score += 12;
      evidence.push(`Aderência ao domínio (${domain}).`);
    } else {
      evidence.push(`Domínio não explícito no cadastro (${domain}).`);
    }
  }

  const focus = normalize(stage.selectionRules?.focus);
  if (focus) {
    if (haystack.includes(focus)) {
      score += 10;
      evidence.push(`Aderência ao foco (${focus}).`);
    } else {
      evidence.push(`Foco não explícito no cadastro (${focus}).`);
    }
  }

  if (status === 'ACTIVE') {
    score += 6;
    evidence.push('Status ACTIVE.');
  }

  return { score, evidence };
};

export const resolveOfficialAgentForStage = (
  agents: Agent[],
  stage: MissionStageBlueprint,
  options?: ResolveOfficialAgentOptions
): ResolvedMissionAgent => {
  if (!Array.isArray(agents) || agents.length === 0) {
    throw new Error('Nenhum agente oficial foi fornecido para resolver o papel da missão.');
  }

  const candidates = agents
    .map((agent) => ({ agent, ...scoreAgentForStage(agent, stage, options) }))
    .filter((item) => Number.isFinite(item.score))
    .sort((a, b) => b.score - a.score);

  const best = candidates[0];
  if (!best) {
    throw new Error(`Nenhum agente oficial aderente ao papel ${stage.roleKey} (etapa ${stage.stepIndex}).`);
  }

  const model = (best.agent.preferredModel || best.agent.modelProvider || 'gemini') as ModelProvider;
  const fullPrompt = String(best.agent.effectivePrompt || best.agent.dnaIndividualPrompt || best.agent.fullPrompt || '').trim();
  if (!fullPrompt) {
    throw new Error(`Agente oficial ${best.agent.name} (${best.agent.id}) sem DNA/prompt válido para execução.`);
  }

  const selectionRuleUsed = stage.suggestedAgentId
    ? 'suggestedAgentId'
    : Array.isArray(stage.selectionRules?.preferredAgentIds) && stage.selectionRules.preferredAgentIds.length > 0
      ? 'preferredAgentIds'
      : Array.isArray(stage.requiredSkills) && stage.requiredSkills.length > 0
        ? 'requiredSkills'
        : 'semantic_role_adherence';

  return {
    agentId: String(best.agent.id),
    agentName: best.agent.name,
    agentRole: best.agent.officialRole || stage.roleName || stage.roleKey,
    preferredModel: model,
    fullPrompt,
    source: 'official_registry',
    selectionRuleUsed,
    adherenceScore: best.score,
    adherenceEvidence: best.evidence
  };
};

export const toMissionStageBlueprint = (params: {
  step: AgentMissionStep;
  roles?: AgentMissionBlueprintRole[];
}): MissionStageBlueprint | null => {
  const step = params.step;
  const roleKey = String(step.payload?.roleKey || '').trim();
  if (!roleKey) return null;
  const role = (params.roles || []).find((item) => item.roleKey === roleKey);

  const requiredFields = Array.isArray(step.payload?.requiredFields)
    ? step.payload.requiredFields.filter(Boolean).map(String)
    : [];
  const schemaExample = step.payload?.schemaExample && typeof step.payload.schemaExample === 'object'
    ? step.payload.schemaExample
    : {};
  const requiredSkills = Array.isArray(step.payload?.requiredSkills)
    ? step.payload.requiredSkills.filter(Boolean).map(String)
    : (role?.requiredSkills || []);
  const selectionRules = step.payload?.selectionRules && typeof step.payload.selectionRules === 'object'
    ? step.payload.selectionRules
    : (role?.metadata || {});

  return {
    stepIndex: step.stepIndex,
    stepName: step.stepName || `Etapa ${step.stepIndex}`,
    roleKey,
    roleName: String(step.payload?.roleName || role?.roleName || ''),
    requiredSkills,
    selectionRules,
    suggestedAgentId: String(step.payload?.suggestedAgentId || role?.suggestedAgentId || '') || null,
    artifactType: step.artifactType || 'artifact',
    requiredFields,
    schemaExample,
    dependsOnStepIndexes: Array.isArray(step.payload?.dependsOnStepIndexes)
      ? step.payload.dependsOnStepIndexes.map(Number).filter((n: number) => Number.isFinite(n))
      : [],
    checkpointRequired: Boolean(step.payload?.checkpointRequired)
  };
};

export const buildMissionStageBlueprints = (params: {
  steps: AgentMissionStep[];
  roles?: AgentMissionBlueprintRole[];
}): MissionStageBlueprint[] => {
  return [...params.steps]
    .sort((a, b) => a.stepIndex - b.stepIndex)
    .map((step) => toMissionStageBlueprint({ step, roles: params.roles }))
    .filter((item): item is MissionStageBlueprint => Boolean(item));
};

export const assembleMissionStepContext = ({
  mission,
  step,
  blueprint,
  steps,
  artifacts,
  agents
}: AssembleContextParams) => {
  const resolvedAgent = resolveOfficialAgentForStage(agents, {
    ...blueprint,
    selectionRules: {
      ...(blueprint.selectionRules || {}),
      preferredAgentIds: [
        ...(Array.isArray(blueprint.selectionRules?.preferredAgentIds)
          ? blueprint.selectionRules.preferredAgentIds
          : []),
        ...(step.agentId ? [step.agentId] : [])
      ]
    }
  });

  const previousStep = steps.find((item) => item.stepIndex === step.stepIndex - 1) || null;
  const previousArtifact = previousStep ? getLatestArtifactForStep(artifacts, previousStep.id) : null;
  const objectiveLine = step.stepIndex === 1
    ? `Input inicial da missão:\n${mission.initialInput}`
    : buildPreviousArtifactText(previousArtifact);

  const systemInstruction = [
    resolvedAgent.fullPrompt,
    '',
    `[MISSAO]: ${mission.title}`,
    '[PROTOCOLO DE EXECUCAO DE MISSAO]:',
    `- Etapa ${step.stepIndex} de ${Number(mission.payload?.stageCount || steps.length || 1)}.`,
    `- Papel solicitado: ${blueprint.roleKey}${blueprint.roleName ? ` (${blueprint.roleName})` : ''}.`,
    `- Entregar JSON válido do tipo ${blueprint.artifactType}.`,
    '- Não responder com markdown fora do JSON.',
    `- Campos obrigatórios: ${blueprint.requiredFields.join(', ')}.`
  ].join('\n');

  const message = [
    `Você está executando a etapa "${blueprint.stepName}".`,
    objectiveLine,
    '',
    'Retorne apenas um JSON válido seguindo esta estrutura base:',
    JSON.stringify(blueprint.schemaExample, null, 2)
  ].join('\n');

  return {
    resolvedAgent,
    systemInstruction,
    message,
    contextSnapshot: {
      missionTitle: mission.title,
      stepIndex: step.stepIndex,
      stepName: blueprint.stepName,
      roleKey: blueprint.roleKey,
      roleName: blueprint.roleName,
      artifactType: blueprint.artifactType,
      sourceAgent: resolvedAgent.source,
      selectedAgentId: resolvedAgent.agentId,
      selectedAgentName: resolvedAgent.agentName,
      selectionRuleUsed: resolvedAgent.selectionRuleUsed,
      adherenceScore: resolvedAgent.adherenceScore,
      adherenceEvidence: resolvedAgent.adherenceEvidence,
      previousArtifactId: previousArtifact?.id || null,
      previousArtifactType: previousArtifact?.artifactType || null,
      requiredFields: blueprint.requiredFields
    }
  };
};
