import { create } from 'zustand';
import { FocusSession, SessionLog, SessionStatus } from '../types';
import { zenVoice } from '../services/zenVoice';

interface FocusState {
  currentSession: FocusSession | null;
  pendingTask: string | null;
  isVoiceMuted: boolean;
  setPendingTask: (task: string | null) => void;
  startSession: (task: string, durationMinutes: number, userName?: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  stopSession: () => void;
  tick: () => void;
  addLog: (type: SessionLog['type'], message: string) => void;
  toggleVoiceMute: () => void;
}

export const useFocusStore = create<FocusState>((set, get) => ({
  currentSession: null,
  pendingTask: null,
  isVoiceMuted: false,

  setPendingTask: (task) => set({ pendingTask: task }),

  toggleVoiceMute: () => {
    const newMutedState = !get().isVoiceMuted;
    zenVoice.setMuted(newMutedState);
    set({ isVoiceMuted: newMutedState });
  },

  startSession: (task, durationMinutes, userName = 'Usuário') => {
    const startMessage = `Vamos começar. Boa reunião e foco total, ${userName}!`;
    zenVoice.speak(startMessage);

    const newSession: FocusSession = {
      id: crypto.randomUUID(),
      task,
      durationMinutes,
      timeRemainingSeconds: durationMinutes * 60,
      status: 'running',
      startTime: Date.now(),
      logs: [
        {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          type: 'start',
          message: `Sessão iniciada: ${task} (${durationMinutes} min)`,
        },
      ],
    };
    set({ currentSession: newSession });
  },

  pauseSession: () => {
    set((state) => {
      if (!state.currentSession || state.currentSession.status !== 'running') return state;
      
      zenVoice.speak('Sessão pausada. Não demore a voltar.');

      const logs = [...state.currentSession.logs, {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: 'pause' as const,
        message: 'Sessão pausada.',
      }];
      return {
        currentSession: {
          ...state.currentSession,
          status: 'paused',
          logs,
        },
      };
    });
  },

  resumeSession: () => {
    set((state) => {
      if (!state.currentSession || state.currentSession.status !== 'paused') return state;
      
      zenVoice.speak('Sessão retomada. Vamos nessa.');

      const logs = [...state.currentSession.logs, {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: 'resume' as const,
        message: 'Sessão retomada.',
      }];
      return {
        currentSession: {
          ...state.currentSession,
          status: 'running',
          logs,
        },
      };
    });
  },

  stopSession: () => {
    set((state) => {
      if (!state.currentSession) return state;
      
      zenVoice.speak('Sessão encerrada.');

      const logs = [...state.currentSession.logs, {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: 'stop' as const,
        message: 'Sessão encerrada.',
      }];
      return {
        currentSession: {
          ...state.currentSession,
          status: 'completed',
          timeRemainingSeconds: 0,
          logs,
        },
      };
    });
  },

  tick: () => {
    set((state) => {
      if (!state.currentSession || state.currentSession.status !== 'running') return state;
      
      const newTime = state.currentSession.timeRemainingSeconds - 1;
      if (newTime <= 0) {
        zenVoice.speak('Tempo esgotado. Sessão finalizada, excelente trabalho.');
        return {
          currentSession: {
            ...state.currentSession,
            timeRemainingSeconds: 0,
            status: 'completed',
            logs: [...state.currentSession.logs, {
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              type: 'stop' as const,
              message: 'Tempo esgotado. Sessão finalizada!',
            }],
          },
        };
      }
      
      return {
        currentSession: {
          ...state.currentSession,
          timeRemainingSeconds: newTime,
        },
      };
    });
  },

  addLog: (type, message) => {
    set((state) => {
      if (!state.currentSession) return state;
      return {
        currentSession: {
          ...state.currentSession,
          logs: [...state.currentSession.logs, {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            type,
            message,
          }],
        },
      };
    });
  },
}));
