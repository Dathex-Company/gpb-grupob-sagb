// ── Status da sessão ──────────────────────────────────────────────
export type SessionStatus = 'idle' | 'running' | 'paused' | 'completed';

// ── Sessão ativa ──────────────────────────────────────────────────
export interface FocusSession {
  id: string;
  task: string;
  durationMinutes: number;
  timeRemainingSeconds: number;
  status: SessionStatus;
  /** Timestamp de criação (Date.now) */
  createdAt: number;
  /** Timestamp de início efetivo (Date.now) */
  startedAt: number;
  /** Timestamp da última pausa (null se não pausada) */
  pausedAt: number | null;
  /** Timestamp de conclusão (null se não concluída) */
  completedAt: number | null;
  /** Timestamp alvo de encerramento (startedAt + durationMinutes * 60000) */
  targetEndAt: number;
  /** Segundos acumulados em pausa */
  pauseAccumulatedSeconds: number;
  /** Logs da sessão */
  logs: SessionLog[];
}

// ── Log individual ────────────────────────────────────────────────
export interface SessionLog {
  id: string;
  timestamp: number;
  type: 'start' | 'pause' | 'resume' | 'stop' | 'checkpoint' | 'agent_message';
  message: string;
  /** Checkpoints disparados (evita repetição) */
  checkpointKey?: string;
}

// ── Payload de fechamento obrigatório ─────────────────────────────
export interface FocusSessionClosePayload {
  /** Resumo do que foi realizado */
  resultSummary: string;
  /** Score de progresso auto-avaliado (0-100) */
  progressScore: number;
  /** Bloqueadores encontrados */
  blockers: string;
  /** Próximo passo planejado */
  nextStep: string;
  /** Quem completou (usuário ou 'auto' para encerramento técnico) */
  completedBy: 'user' | 'auto';
}

// ── Item de histórico (sessão encerrada) ──────────────────────────
export interface FocusSessionHistoryItem extends FocusSession {
  closePayload: FocusSessionClosePayload;
}

// ── Modos de voz ──────────────────────────────────────────────────
export type VoiceMode = 'muted' | 'browser' | 'gemini_tts';

export interface VoiceState {
  mode: VoiceMode;
  /** Se o usuário já ativou explicitamente a voz */
  userActivated: boolean;
  /** Cache de frases comuns para evitar chamadas repetidas ao TTS */
  phraseCache: Map<string, string>;
}
