import { Agent } from '../../../../types';

export interface RAIRuntimeContext {
  workspaceId?: string | null;
  agents: Agent[];
}

let runtimeContext: RAIRuntimeContext = {
  workspaceId: null,
  agents: []
};

export const setRAIRuntimeContext = (next: Partial<RAIRuntimeContext>) => {
  runtimeContext = {
    ...runtimeContext,
    ...next,
    agents: Array.isArray(next.agents) ? next.agents : runtimeContext.agents
  };
};

export const getRAIRuntimeContext = (): RAIRuntimeContext => runtimeContext;

