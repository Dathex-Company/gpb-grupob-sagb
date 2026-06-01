/**
 * SalaDevChatStorage
 *
 * Persiste o histórico do chat da Sala Dev em localStorage.
 * Mensagens são salvas automaticamente após cada troca e recarregadas
 * na inicialização do componente.
 */

import type { SalaDevChatMessage } from './SalaDevLlmService';

const STORAGE_KEY = 'sala_dev_chat_history';
const MAX_MESSAGES = 200;

interface StoredMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAtISO: string;
}

function serialize(messages: SalaDevChatMessage[]): StoredMessage[] {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
    createdAtISO: (msg.createdAt instanceof Date ? msg.createdAt : new Date()).toISOString(),
  }));
}

function deserialize(stored: StoredMessage[]): SalaDevChatMessage[] {
  return stored.map((msg, i) => ({
    id: `stored-${i}`,
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.createdAtISO),
  }));
}

/**
 * Salva a lista de mensagens no localStorage.
 * Mantém apenas as últimas MAX_MESSAGES entradas.
 */
export function saveChatHistory(messages: SalaDevChatMessage[]): void {
  try {
    const trimmed = messages.slice(-MAX_MESSAGES);
    const raw = JSON.stringify(serialize(trimmed));
    localStorage.setItem(STORAGE_KEY, raw);
  } catch (err) {
    console.warn('[SalaDevChatStorage] Falha ao salvar histórico:', err);
  }
}

/**
 * Carrega o histórico salvo do localStorage.
 * Retorna array vazio se não houver dados ou em caso de erro.
 */
export function loadChatHistory(): SalaDevChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: StoredMessage[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return deserialize(parsed);
  } catch (err) {
    console.warn('[SalaDevChatStorage] Falha ao carregar histórico:', err);
    return [];
  }
}

/**
 * Remove todo o histórico do chat do localStorage.
 */
export function clearChatHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('[SalaDevChatStorage] Falha ao limpar histórico:', err);
  }
}

/**
 * Retorna metadados do histórico salvo (quantidade de mensagens, data da última).
 */
export function getChatHistoryMeta(): { count: number; lastDate: Date | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, lastDate: null };
    const parsed: StoredMessage[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return { count: 0, lastDate: null };
    const lastDate = new Date(parsed[parsed.length - 1].createdAtISO);
    return { count: parsed.length, lastDate };
  } catch {
    return { count: 0, lastDate: null };
  }
}
