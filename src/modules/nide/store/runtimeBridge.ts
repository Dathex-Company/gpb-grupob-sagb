import { Agent } from '../../../../types';

export interface NideRuntimeContext {
  workspaceId?: string | null;
  ownerUserId?: string | null;
  agents: Agent[];
  onBack?: () => void;
}

let runtimeContext: NideRuntimeContext = {
  workspaceId: null,
  ownerUserId: null,
  agents: []
};

export const setNideRuntimeContext = (next: Partial<NideRuntimeContext>) => {
  runtimeContext = {
    ...runtimeContext,
    ...next,
    agents: Array.isArray(next.agents) ? next.agents : runtimeContext.agents
  };
};

export const getNideRuntimeContext = (): NideRuntimeContext => runtimeContext;
