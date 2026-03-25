import { MentoriasState, Mentoria } from '../types/mentorias.types';

// O SagB usa estrutura baseada em Zustand para outros módulos.
// Este arquivo já nasce preparado para futura extração e integração.

/*
import { create } from 'zustand';

interface MentoriasActions {
  setMentorias: (mentorias: Mentoria[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMentoriasStore = create<MentoriasState & MentoriasActions>((set) => ({
  mentorias: [],
  isLoading: false,
  error: null,
  setMentorias: (mentorias) => set({ mentorias }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
*/

// Estrutura de estado inicial para ser usada em Context ou similar se necessário
export const initialMentoriasState: MentoriasState = {
  mentorias: [],
  isLoading: false,
  error: null,
};
