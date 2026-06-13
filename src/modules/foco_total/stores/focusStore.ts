import { create } from 'zustand';
import type {
  FocusSession,
  FocusSessionClosePayload,
  FocusSessionHistoryItem,
  SessionLog,
  SessionStatus,
} from '../types';
import { zenVoice } from '../services/zenVoice';
import {
  loadSessionHistory,
  appendSessionToHistory,
  clearSessionHistory,
} from '../services/focusSessionStorage';
import { calcTargetEndAt, calcRemainingSeconds } from '../services/focusSessionClock';
import { resetCheckpoints, tickEffects } from '../services/focusEffects';

// ── Helpers ───────────────────────────────────────────────────────

/** Gera ID único com fallback para ambientes sem crypto (FT-008) */
function createFocusId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback deterministico para ambientes restritos
  return `focus_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function createLog(type: SessionLog['type'], message: string, checkpointKey?: string): SessionLog {
  return {
    id: createFocusId(),
    timestamp: Date.now(),
    type,
    message,
    ...(checkpointKey ? { checkpointKey } : {}),
  };
}

// ── Store ─────────────────────────────────────────────────────────

interface FocusState {
  // Sessão ativa
  currentSession: FocusSession | null;
  /** Payload de fechamento pendente (preenchido pelo modal) */
  closePayload: FocusSessionClosePayload | null;
  /** Se o modal de fechamento está aberto */
  isCloseModalOpen: boolean;

  // Histórico
  sessionsHistory: FocusSessionHistoryItem[];

  // Task pendente (vinda de outros módulos)
  pendingTask: string | null;

  // Voz
  isVoiceMuted: boolean;

  // ── Ações ──
  setPendingTask: (task: string | null) => void;
  startSession: (task: string, durationMinutes: number, userName?: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  /** Solicita fechamento da sessão (abre modal, não completa) */
  requestStopSession: () => void;
  /** Fecha o modal de fechamento sem completar */
  cancelStopSession: () => void;
  /** Completa a sessão com o payload de fechamento */
  completeSession: (payload: FocusSessionClosePayload) => void;
  /** Encerramento técnico automático (quando timer zera) — sem modal */
  autoCompleteSession: () => void;
  tick: () => void;
  addLog: (type: SessionLog['type'], message: string, checkpointKey?: string) => void;
  toggleVoiceMute: () => void;

  // Histórico
  loadHistory: () => void;
  clearHistory: () => void;
}

export const useFocusStore = create<FocusState>((set, get) => ({
  currentSession: null,
  closePayload: null,
  isCloseModalOpen: false,
  sessionsHistory: [],
  pendingTask: null,
  isVoiceMuted: false,

  // ── Task pendente ───────────────────────────────────────────────
  setPendingTask: (task) => set({ pendingTask: task }),

  // ── Voz ─────────────────────────────────────────────────────────
  toggleVoiceMute: () => {
    const newMutedState = !get().isVoiceMuted;
    zenVoice.setMuted(newMutedState);
    set({ isVoiceMuted: newMutedState });
  },

  // ── Ciclo de vida da sessão ─────────────────────────────────────

  startSession: (task, durationMinutes, userName = 'Usuário') => {
    // Cancela qualquer fechamento pendente e reseta checkpoints
    set({ closePayload: null, isCloseModalOpen: false });
    resetCheckpoints();

    const now = Date.now();
    const startMessage = `Vamos começar. Boa sessão e foco total, ${userName}!`;

    // Voz — será extraída para focusEffects na Fase 3
    zenVoice.speak(startMessage);

    const sessionId = createFocusId();
    const newSession: FocusSession = {
      id: sessionId,
      task,
      durationMinutes,
      timeRemainingSeconds: durationMinutes * 60,
      status: 'running',
      createdAt: now,
      startedAt: now,
      pausedAt: null,
      completedAt: null,
      targetEndAt: calcTargetEndAt(durationMinutes, now),
      pauseAccumulatedSeconds: 0,
      logs: [
        createLog('start', `Sessão iniciada: ${task} (${durationMinutes} min)`),
      ],
    };
    set({ currentSession: newSession });
  },

  pauseSession: () => {
    set((state) => {
      if (!state.currentSession || state.currentSession.status !== 'running') return state;

      zenVoice.speak('Sessão pausada. Não demore a voltar.');

      return {
        currentSession: {
          ...state.currentSession,
          status: 'paused' as SessionStatus,
          pausedAt: Date.now(),
          logs: [...state.currentSession.logs, createLog('pause', 'Sessão pausada.')],
        },
      };
    });
  },

  resumeSession: () => {
    set((state) => {
      if (!state.currentSession || state.currentSession.status !== 'paused') return state;

      // Recalcula targetEndAt adicionando o tempo pausado
      const pausedDuration = state.currentSession.pausedAt
        ? Date.now() - state.currentSession.pausedAt
        : 0;
      const newTargetEndAt = state.currentSession.targetEndAt + pausedDuration;
      const newPauseAccumulated =
        state.currentSession.pauseAccumulatedSeconds + Math.floor(pausedDuration / 1000);

      zenVoice.speak('Sessão retomada. Vamos nessa.');

      return {
        currentSession: {
          ...state.currentSession,
          status: 'running' as SessionStatus,
          pausedAt: null,
          targetEndAt: newTargetEndAt,
          pauseAccumulatedSeconds: newPauseAccumulated,
          logs: [...state.currentSession.logs, createLog('resume', 'Sessão retomada.')],
        },
      };
    });
  },

  // ── Novo fluxo de fechamento ────────────────────────────────────

  requestStopSession: () => {
    const { currentSession } = get();
    if (!currentSession) return;
    if (currentSession.status === 'completed') return;

    // Pausa a sessão enquanto o modal está aberto
    if (currentSession.status === 'running') {
      get().pauseSession();
    }

    set({ isCloseModalOpen: true });
  },

  cancelStopSession: () => {
    const { currentSession } = get();
    set({ isCloseModalOpen: false, closePayload: null });

    // Retoma se estava pausada apenas pelo modal
    if (currentSession?.status === 'paused') {
      get().resumeSession();
    }
  },

  completeSession: (payload) => {
    const { currentSession } = get();
    if (!currentSession) return;

    const now = Date.now();
    const elapsed = Math.floor((now - currentSession.startedAt - currentSession.pauseAccumulatedSeconds * 1000) / 1000);

    const completedSession: FocusSession = {
      ...currentSession,
      status: 'completed',
      completedAt: now,
      timeRemainingSeconds: 0,
      logs: [
        ...currentSession.logs,
        createLog('stop', `Sessão concluída. Progresso: ${payload.progressScore}%. Próximo: ${payload.nextStep || '—'}`),
      ],
    };

    const historyItem: FocusSessionHistoryItem = {
      ...completedSession,
      closePayload: payload,
    };

    // Salva no histórico local
    appendSessionToHistory(historyItem);

    set({
      currentSession: null,
      closePayload: null,
      isCloseModalOpen: false,
      sessionsHistory: [...get().sessionsHistory, historyItem],
    });
  },

  autoCompleteSession: () => {
    const { currentSession } = get();
    if (!currentSession) return;

    zenVoice.speak('Tempo esgotado. Sessão finalizada, excelente trabalho.');

    const payload: FocusSessionClosePayload = {
      resultSummary: 'Sessão encerrada automaticamente pelo timer.',
      progressScore: 50,
      blockers: '',
      nextStep: 'Revisar o que foi feito e planejar próxima sessão.',
      completedBy: 'auto',
    };

    const now = Date.now();
    const completedSession: FocusSession = {
      ...currentSession,
      status: 'completed',
      completedAt: now,
      timeRemainingSeconds: 0,
      logs: [
        ...currentSession.logs,
        createLog('stop', 'Tempo esgotado. Sessão finalizada automaticamente.'),
      ],
    };

    const historyItem: FocusSessionHistoryItem = {
      ...completedSession,
      closePayload: payload,
    };

    appendSessionToHistory(historyItem);

    set({
      currentSession: null,
      closePayload: null,
      isCloseModalOpen: false,
      sessionsHistory: [...get().sessionsHistory, historyItem],
    });
  },

  // ── Timer tick (clock-based, drift-free) ────────────────────────

  tick: () => {
    set((state) => {
      if (!state.currentSession || state.currentSession.status !== 'running') return state;

      // Calcula tempo restante por relógio real (FT-006)
      const remaining = calcRemainingSeconds(
        state.currentSession.targetEndAt,
        state.currentSession.pauseAccumulatedSeconds,
      );

      // Tempo esgotado — encerramento automático
      if (remaining <= 0) {
        return {
          currentSession: {
            ...state.currentSession,
            timeRemainingSeconds: 0,
            status: 'completed' as SessionStatus,
            logs: [
              ...state.currentSession.logs,
              createLog('stop', 'Tempo esgotado. Sessão finalizada!'),
            ],
          },
        };
      }

      // Processa checkpoints (FT-005)
      const newLogs = tickEffects({ ...state.currentSession, timeRemainingSeconds: remaining });

      return {
        currentSession: {
          ...state.currentSession,
          timeRemainingSeconds: remaining,
          logs: newLogs.length > 0
            ? [...state.currentSession.logs, ...newLogs.map((l) => createLog(l.type, l.message, l.checkpointKey))]
            : state.currentSession.logs,
        },
      };
    });
  },

  // ── Logs ────────────────────────────────────────────────────────
  addLog: (type, message, checkpointKey) => {
    set((state) => {
      if (!state.currentSession) return state;
      return {
        currentSession: {
          ...state.currentSession,
          logs: [...state.currentSession.logs, createLog(type, message, checkpointKey)],
        },
      };
    });
  },

  // ── Histórico ───────────────────────────────────────────────────
  loadHistory: () => {
    const history = loadSessionHistory();
    set({ sessionsHistory: history });
  },

  clearHistory: () => {
    clearSessionHistory();
    set({ sessionsHistory: [] });
  },
}));
