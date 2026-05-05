/* ============================================================================
 * MCP SagB — Client MCP (UI-safe Adapter)
 * ============================================================================
 * Adapter que a UI consome para comunicar-se com o servidor MCP.
 *
 * Funciona em dois modos:
 *   - mock: Simula o servidor MCP in-memory (padrão, para dev browser)
 *   - live: Conecta-se a um servidor MCP remoto via HTTP (futuro)
 *
 * NUNCA importa server/mcpServer.ts (Node.js-only) — esta camada é segura
 * para o bundle Vite/React.
 * ============================================================================ */

import type { McpServerState } from '../contracts/mcpSagb.contracts';
import { MCP_SAGB_EVENTS } from '../contracts/mcpSagb.contracts';

/* ─── Estado interno ─── */
let clientRunning = false;
let clientStartedAt: string | null = null;
let clientMode: 'mock' | 'live' = 'mock';

type StateChangeCallback = (state: McpServerState) => void;
const stateListeners: Set<StateChangeCallback> = new Set();

function notifyStateChange(): void {
  const state = getClientState();
  stateListeners.forEach((cb) => cb(state));
  window.dispatchEvent(
    new CustomEvent(MCP_SAGB_EVENTS.STATE_CHANGED, { detail: state }),
  );
}

function simulateDelay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ─── API pública ─── */

/** Retorna o estado atual do servidor MCP (lado cliente) */
export function getClientState(): McpServerState {
  return {
    running: clientRunning,
    startedAt: clientStartedAt,
    mode: clientMode,
    resources: clientRunning ? 3 : 0,
    tools: clientRunning ? 2 : 0,
    serverName: 'MCP-SagB',
    serverVersion: '1.0.0',
  };
}

/** Inicia o servidor MCP (modo mock) */
export async function startClient(): Promise<boolean> {
  if (clientRunning) return true;

  try {
    await simulateDelay(600);
    clientRunning = true;
    clientStartedAt = new Date().toISOString();
    clientMode = 'mock';

    window.dispatchEvent(new CustomEvent(MCP_SAGB_EVENTS.SERVER_STARTED));
    notifyStateChange();

    console.log('[MCP SagB Client] Servidor MCP iniciado (modo mock).');
    return true;
  } catch (err) {
    console.error('[MCP SagB Client] Erro ao iniciar servidor:', err);
    return false;
  }
}

/** Para o servidor MCP */
export async function stopClient(): Promise<boolean> {
  if (!clientRunning) return true;

  try {
    await simulateDelay(300);
    clientRunning = false;
    clientStartedAt = null;

    window.dispatchEvent(new CustomEvent(MCP_SAGB_EVENTS.SERVER_STOPPED));
    notifyStateChange();

    console.log('[MCP SagB Client] Servidor MCP parado.');
    return true;
  } catch (err) {
    console.error('[MCP SagB Client] Erro ao parar servidor:', err);
    return false;
  }
}

/** Alterna estado do servidor */
export async function toggleClient(): Promise<boolean> {
  return clientRunning ? stopClient() : startClient();
}

/** Registra callback para mudanças de estado */
export function onStateChange(callback: StateChangeCallback): () => void {
  stateListeners.add(callback);
  return () => {
    stateListeners.delete(callback);
  };
}

/** Força atualização do estado (útil após mudanças externas) */
export function refreshState(): McpServerState {
  notifyStateChange();
  return getClientState();
}

/** Verifica se o cliente está conectado */
export function isClientRunning(): boolean {
  return clientRunning;
}
