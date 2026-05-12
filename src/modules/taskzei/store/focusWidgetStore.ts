import { create } from 'zustand';

export type FocusWidgetMode = 'hidden' | 'config' | 'active_modal' | 'pip';

interface FocusWidgetState {
  mode: FocusWidgetMode;
  taskTitle: string;
  setMode: (mode: FocusWidgetMode) => void;
  open: (taskTitle: string) => void;
  minimize: () => void;
  expand: () => void;
  close: () => void;
}

export const useFocusWidgetStore = create<FocusWidgetState>((set) => ({
  mode: 'hidden',
  taskTitle: '',

  setMode: (mode) => set({ mode }),

  open: (taskTitle) =>
    set({
      mode: 'config',
      taskTitle,
    }),

  minimize: () => {
    set((state) => {
      // Só permite minimizar se houver sessão ativa
      if (state.mode === 'active_modal') {
        return { mode: 'pip' };
      }
      return state;
    });
  },

  expand: () => {
    set((state) => {
      if (state.mode === 'pip') {
        return { mode: 'active_modal' };
      }
      return state;
    });
  },

  close: () => set({ mode: 'hidden', taskTitle: '' }),
}));
