/**
 * Facade pública do módulo Foco Total.
 *
 * Contrato de integração para módulos externos (TaskZei e futuros).
 * Encapsula a store interna, expondo apenas métodos estáveis.
 *
 * Uso:
 *   import { focusSessionFacade } from 'modules/foco_total';
 *   focusSessionFacade.startFocusSession('Minha tarefa', 25);
 */

import { useFocusStore } from '../stores/focusStore';
import type { FocusSession, FocusSessionClosePayload } from '../types';

export const focusSessionFacade = {
  /** Inicia uma nova sessão de foco */
  startFocusSession(task: string, durationMinutes: number, userName?: string): void {
    useFocusStore.getState().startSession(task, durationMinutes, userName);
  },

  /** Pausa a sessão ativa */
  pauseFocusSession(): void {
    useFocusStore.getState().pauseSession();
  },

  /** Retoma a sessão pausada */
  resumeFocusSession(): void {
    useFocusStore.getState().resumeSession();
  },

  /** Solicita encerramento (abre modal de fechamento) */
  requestStopFocusSession(): void {
    useFocusStore.getState().requestStopSession();
  },

  /** Completa a sessão com payload de fechamento */
  completeFocusSession(payload: FocusSessionClosePayload): void {
    useFocusStore.getState().completeSession(payload);
  },

  /** Obtém a sessão ativa (snapshot) */
  getCurrentFocusSession(): FocusSession | null {
    return useFocusStore.getState().currentSession;
  },

  /** Define uma tarefa pendente (abre modal de config ao acessar o módulo) */
  setPendingTask(task: string): void {
    useFocusStore.getState().setPendingTask(task);
  },

  /** Obtém as ações da store para uso em componentes React (hook) */
  useFacade() {
    return useFocusStore((state) => ({
      currentSession: state.currentSession,
      pendingTask: state.pendingTask,
      sessionsHistory: state.sessionsHistory,
      isCloseModalOpen: state.isCloseModalOpen,
      startSession: state.startSession,
      pauseSession: state.pauseSession,
      resumeSession: state.resumeSession,
      requestStopSession: state.requestStopSession,
      cancelStopSession: state.cancelStopSession,
      completeSession: state.completeSession,
      tick: state.tick,
      setPendingTask: state.setPendingTask,
      addLog: state.addLog,
      loadHistory: state.loadHistory,
      clearHistory: state.clearHistory,
      isVoiceMuted: state.isVoiceMuted,
      toggleVoiceMute: state.toggleVoiceMute,
    }));
  },
};
