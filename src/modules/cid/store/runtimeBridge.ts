import { UserProfile, Venture } from '../../../../types';

export interface CidRuntimeContext {
  workspaceId?: string | null;
  ownerUserId?: string | null;
  userProfile?: UserProfile | null;
  ventures: Venture[];
  onBack?: () => void;
}

let runtimeContext: CidRuntimeContext = {
  workspaceId: null,
  ownerUserId: null,
  userProfile: null,
  ventures: [],
  onBack: undefined
};

export const setCidRuntimeContext = (next: Partial<CidRuntimeContext>) => {
  runtimeContext = {
    ...runtimeContext,
    ...next,
    ventures: Array.isArray(next.ventures) ? next.ventures : runtimeContext.ventures
  };
};

export const getCidRuntimeContext = (): CidRuntimeContext => runtimeContext;
