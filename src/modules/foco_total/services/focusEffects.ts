/**
 * Orquestrador de side effects: voz, checkpoints e mensagens do Zen Folk.
 *
 * Separa as chamadas de áudio e mensagens da store pura (FT-007),
 * permitindo que a store seja testável sem dependência de áudio.
 */

import { zenVoice } from './zenVoice';
import {
  calcProgress,
  calcRemainingSeconds,
  SESSION_CHECKPOINTS,
  ZEN_FOLK_MESSAGES,
} from './focusSessionClock';
import type { FocusSession } from '../types';

interface CheckpointState {
  firedKeys: Set<string>;
}

/** Estado interno de checkpoints disparados (por sessão) */
let checkpointState: CheckpointState = { firedKeys: new Set() };

/** Reseta os checkpoints ao iniciar nova sessão */
export function resetCheckpoints(): void {
  checkpointState = { firedKeys: new Set() };
}

/**
 * Processa checkpoints da sessão: dispara mensagem + voz se o checkpoint
 * ainda não foi acionado.
 *
 * @returns Mensagens de checkpoint disparadas (para adicionar aos logs)
 */
export function processCheckpoints(session: FocusSession): Array<{ type: 'checkpoint' | 'agent_message'; message: string; checkpointKey: string }> {
  const results: Array<{ type: 'checkpoint' | 'agent_message'; message: string; checkpointKey: string }> = [];

  if (session.status !== 'running') return results;

  const remaining = calcRemainingSeconds(session.targetEndAt, session.pauseAccumulatedSeconds);
  const progress = calcProgress(session.durationMinutes, remaining);

  for (const cp of SESSION_CHECKPOINTS) {
    if (cp.percent === 0) continue; // start é tratado separadamente
    if (checkpointState.firedKeys.has(cp.key)) continue;

    if (progress >= cp.percent) {
      checkpointState.firedKeys.add(cp.key);
      const message = ZEN_FOLK_MESSAGES[cp.key] || cp.label;
      results.push({ type: 'checkpoint', message, checkpointKey: cp.key });
      results.push({ type: 'agent_message', message: `🧘 ${message}`, checkpointKey: cp.key });
    }
  }

  return results;
}

/**
 * Dispara voz para uma mensagem, respeitando modo mudo.
 * Deve ser chamada fora da store (em componentes ou effects).
 */
export function speakEffect(message: string): void {
  zenVoice.speak(message);
}

/**
 * Hook-friendly: processa checkpoints + voz para a sessão atual.
 * Retorna os logs a serem adicionados à store.
 */
export function tickEffects(session: FocusSession): Array<{
  type: 'checkpoint' | 'agent_message';
  message: string;
  checkpointKey: string;
}> {
  const checkpointLogs = processCheckpoints(session);

  // Dispara voz para cada mensagem de checkpoint
  for (const log of checkpointLogs) {
    if (log.type === 'agent_message') {
      speakEffect(log.message.replace('🧘 ', ''));
    }
  }

  return checkpointLogs;
}
