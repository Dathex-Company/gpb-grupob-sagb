import { UserProfile } from '../../../../types';

export interface KaraokeRuntimeContext {
  workspaceId?: string | null;
  ownerUserId?: string | null;
  userProfile?: UserProfile | null;
  onBack?: () => void;
}

let runtimeContext: KaraokeRuntimeContext = {
  workspaceId: null,
  ownerUserId: null,
  userProfile: null,
  onBack: undefined
};

export const setKaraokeRuntimeContext = (next: Partial<KaraokeRuntimeContext>) => {
  runtimeContext = {
    ...runtimeContext,
    ...next
  };
};

export const getKaraokeRuntimeContext = (): KaraokeRuntimeContext => runtimeContext;

