import { Agent, BusinessUnit, Venture, UserProfile } from '../../../../types';

export interface QuadroDeEliteRuntimeContext {
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

let runtimeContext: QuadroDeEliteRuntimeContext = {
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

export const setQuadroDeEliteRuntimeContext = (next: Partial<QuadroDeEliteRuntimeContext>) => {
  runtimeContext = {
    ...runtimeContext,
    ...next,
    agents: Array.isArray(next.agents) ? next.agents : runtimeContext.agents,
    businessUnits: Array.isArray(next.businessUnits) ? next.businessUnits : runtimeContext.businessUnits,
    ventures: Array.isArray(next.ventures) ? next.ventures : runtimeContext.ventures
  };
};

export const getQuadroDeEliteRuntimeContext = (): QuadroDeEliteRuntimeContext => runtimeContext;