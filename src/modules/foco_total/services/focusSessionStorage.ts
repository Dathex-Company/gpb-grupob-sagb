import type { FocusSessionHistoryItem } from '../types';

// ── Constantes ────────────────────────────────────────────────────
const STORAGE_KEY = 'sagb:foco_total:sessions:v1';
const DEFAULT_MAX_SESSIONS = 50;

// ── Helpers ───────────────────────────────────────────────────────

/** Parse seguro com fallback para array vazio */
function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

// ── Leitura ───────────────────────────────────────────────────────

/** Lê todas as sessões do histórico local */
export function loadSessionHistory(): FocusSessionHistoryItem[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return safeParse<FocusSessionHistoryItem[]>(raw, []);
}

// ── Escrita ───────────────────────────────────────────────────────

/** Salva o array completo de sessões, truncando se exceder o limite */
export function saveSessionHistory(sessions: FocusSessionHistoryItem[], max = DEFAULT_MAX_SESSIONS): void {
  if (typeof window === 'undefined') return;
  const trimmed = sessions.slice(-max);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage cheio ou inacessível — falha silenciosa
    console.warn('[foco_total] Falha ao salvar histórico no localStorage.');
  }
}

/** Adiciona uma sessão ao histórico (sem sobrescrever tudo) */
export function appendSessionToHistory(session: FocusSessionHistoryItem): void {
  const current = loadSessionHistory();
  saveSessionHistory([...current, session]);
}

/** Remove todas as sessões do histórico */
export function clearSessionHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // falha silenciosa
  }
}
