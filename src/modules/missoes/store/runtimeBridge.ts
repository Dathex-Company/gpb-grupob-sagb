import { Agent } from '../../../../types';

export interface MissoesRuntimeContext {
  workspaceId?: string | null;
  ownerUserId?: string | null;
  agents: Agent[];
  onBack?: () => void;
}

let runtimeContext: MissoesRuntimeContext = {
  workspaceId: null,
  ownerUserId: null,
  agents: []
};

export const setMissoesRuntimeContext = (next: Partial<MissoesRuntimeContext>) => {
  runtimeContext = {
    ...runtimeContext,
    ...next,
    agents: Array.isArray(next.agents) ? next.agents : runtimeContext.agents
  };
};

export const getMissoesRuntimeContext = (): MissoesRuntimeContext => runtimeContext;
