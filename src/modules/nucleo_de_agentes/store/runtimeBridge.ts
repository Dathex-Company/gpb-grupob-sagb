import { Agent, BusinessUnit, Venture, UserProfile } from '../../../../types';

/**
 * Contexto de runtime injetado pelo host (App.tsx) no módulo Núcleo de Agentes.
 */
export interface NucleoDeAgentesRuntimeContext {
  workspaceId?: string | null;
  ownerUserId?: string | null;
  userProfile?: UserProfile | null;
  agents: Agent[];
  businessUnits: BusinessUnit[];
  ventures: Venture[];
  activeBU?: BusinessUnit | null;
  activeWorkspaceId?: string | null;
  authUsersByEmail?: Record<string, { id: string; email: string }>;
  activeSessionEmail?: string | null;
  onNavigateToEcosystem?: () => void;
  onActivate?: (agentData: any) => void;
  onRemove?: (agentId: string) => void;
  onManageIntelligence?: (agent: Agent) => void;
}

let runtimeContext: NucleoDeAgentesRuntimeContext = {
  workspaceId: null,
  ownerUserId: null,
  userProfile: null,
  agents: [],
  businessUnits: [],
  ventures: [],
  activeBU: null,
  activeWorkspaceId: null,
  authUsersByEmail: {},
  activeSessionEmail: null,
  onNavigateToEcosystem: undefined,
  onActivate: undefined,
  onRemove: undefined,
  onManageIntelligence: undefined
};

export const setNucleoDeAgentesRuntimeContext = (next: Partial<NucleoDeAgentesRuntimeContext>) => {
  runtimeContext = {
    ...runtimeContext,
    ...next,
    agents: Array.isArray(next.agents) ? next.agents : runtimeContext.agents,
    businessUnits: Array.isArray(next.businessUnits) ? next.businessUnits : runtimeContext.businessUnits,
    ventures: Array.isArray(next.ventures) ? next.ventures : runtimeContext.ventures
  };
};

export const getNucleoDeAgentesRuntimeContext = (): NucleoDeAgentesRuntimeContext => runtimeContext;

/**
 * Retorna o perfil completo de runtime de um agente, pronto para consumo
 * pelo Núcleo Conversacional ou outros módulos.
 *
 * Este é o CONTRATO ÚNICO de perfil de agente.
 * Antes: 2 módulos + banco direto.
 * Depois: 1 chamada → perfil completo.
 */
export const getAgentRuntimeProfile = (agentId: string, workspaceId?: string | null) => {
  const ctx = getNucleoDeAgentesRuntimeContext();
  const agent = ctx.agents.find((a) => a.id === agentId);
  if (!agent) return null;

  return {
    identity: {
      id: agent.id,
      name: agent.name,
      canonicalId: agent.canonicalId,
      entityType: agent.entityType,
      email: agent.email,
      avatarUrl: agent.avatarUrl,
      origin: agent.origin
    },
    organizational: {
      ventureId: agent.ventureId,
      unitName: agent.unitName,
      area: agent.area,
      functionName: agent.functionName,
      baseRoleUniversal: agent.baseRoleUniversal
    },
    status: {
      level: agent.level,
      tier: agent.tier,
      status: agent.status,
      structuralStatus: agent.structuralStatus,
      operationalStatus: agent.operationalStatus,
      operationalClass: agent.operationalClass
    },
    model: {
      preferredModel: agent.modelProvider,
      allowedStacks: agent.allowedStacks
    },
    profile: {
      effectivePrompt: agent.effectivePrompt,
      officialRole: agent.officialRole,
      shortDescription: agent.shortDescription
    },
    // DNA reference — será populado via Central de Padrões futuramente
    dna: {
      status: agent.dnaStatus,
      standardVersion: (agent as any).dnaStandardVersion || null,
      layers: null // TODO: consultar Central de Padrões via getDnaStandards(version)
    },
    workspaceId: workspaceId || ctx.activeWorkspaceId || null
  };
};
