import { create } from 'zustand';
import { RAIConfig, RAICapture } from '../types';

interface RAIState {
  /** Configurações de radar carregadas do Supabase (rai_configs) */
  configs: RAIConfig[];
  /** Capturas de inteligência */
  captures: RAICapture[];
  loading: boolean;
  error: string | null;
  setConfigs: (configs: RAIConfig[]) => void;
  setCaptures: (captures: RAICapture[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  configs: [],
  captures: [],
  loading: false,
  error: null,
};

export const useRAIStore = create<RAIState>((set) => ({
  ...initialState,
  setConfigs: (configs) => set({ configs }),
  setCaptures: (captures) => set({ captures }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
