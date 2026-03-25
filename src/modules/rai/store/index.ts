export {};
// O SagB usa Zustand em outros módulos via arquivos store/index.ts
// Para o RAI, deixamos a estrutura preparada.

/*
import { create } from 'zustand';
import { RAIAgent, RAICapture } from '../types';

interface RAIState {
  agents: RAIAgent[];
  captures: RAICapture[];
  setAgents: (agents: RAIAgent[]) => void;
  setCaptures: (captures: RAICapture[]) => void;
}

export const useRAIStore = create<RAIState>((set) => ({
  agents: [],
  captures: [],
  setAgents: (agents) => set({ agents }),
  setCaptures: (captures) => set({ captures }),
}));
*/
