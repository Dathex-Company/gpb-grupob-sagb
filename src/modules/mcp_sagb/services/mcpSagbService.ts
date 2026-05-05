import { McpTool, McpScript, McpConfig, McpToolStatus } from '../types/mcpSagb.types';
import { mcpTools, mcpScripts, mcpConfigs } from '../data/mcpSagbCatalog';
import {
  getClientState,
  startClient,
  stopClient,
  toggleClient,
  onStateChange,
  isClientRunning,
} from './mcpSagbClient';
import type { McpServerState } from '../contracts/mcpSagb.contracts';

/* ============================================================================
 * MCP SagB — Serviço de Ferramentas e Configurações
 * ============================================================================
 * Camada de serviço que abstrai a origem dos dados.
 * - Modo mock: retorna dados do catálogo local (estado atual)
 * - Modo live: futuramente se conectará a um MCP server SDK via HTTP
 *
 * Integrado com mcpSagbClient.ts para gerenciamento de estado do servidor.
 * ============================================================================ */

const STORAGE_CONFIG_KEY = 'sagb:mcp-tools-config';
const STORAGE_PREFS_KEY = 'sagb:mcp-preferences';

/** Simula delay de execução de uma ferramenta MCP */
function simulateDelay(ms = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let toolsState: McpTool[] = [...mcpTools.map((t) => ({ ...t }))];
let scriptsState: McpScript[] = [...mcpScripts.map((s) => ({ ...s }))];
let configsState: McpConfig[] = [...mcpConfigs.map((c) => ({ ...c }))];

/**
 * Carrega preferências salvas do localStorage (mock de persistência).
 */
function loadPersistedConfigs(): void {
  try {
    const raw = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<McpConfig>[];
      for (const saved of parsed) {
        const idx = configsState.findIndex((c) => c.key === saved.key);
        if (idx !== -1 && saved.value !== undefined) {
          configsState[idx] = { ...configsState[idx], ...saved };
        }
      }
    }
  } catch {
    // fallback silencioso
  }
}

loadPersistedConfigs();

/* ─── Ferramentas ─── */

/** Retorna todas as ferramentas MCP disponíveis */
export function getTools(): McpTool[] {
  return [...toolsState];
}

/** Retorna todos os scripts de automação */
export function getScripts(): McpScript[] {
  return [...scriptsState];
}

/** Retorna todas as configurações */
export function getConfigs(): McpConfig[] {
  return [...configsState];
}

/** Executa uma ferramenta MCP pelo ID (simulação) */
export async function runTool(toolId: string): Promise<{ success: boolean; output: string }> {
  const tool = toolsState.find((t) => t.id === toolId);
  if (!tool) return { success: false, output: `Ferramenta ${toolId} não encontrada.` };
  if (!tool.enabled) return { success: false, output: `Ferramenta ${tool.name} está desabilitada.` };

  // Atualiza status para running
  tool.status = 'running';
  toolsState = [...toolsState];

  await simulateDelay();

  // Simula resultado
  const success = Math.random() > 0.2; // 80% de chance de sucesso
  tool.status = success ? 'success' : 'error';
  tool.lastRun = new Date().toISOString();
  toolsState = [...toolsState];

  const output = success
    ? `[MCP OK] ${tool.name} executado com sucesso. Comando: ${tool.command || 'N/A'}`
    : `[MCP ERROR] ${tool.name} falhou. Verifique os pré-requisitos.`;

  return { success, output };
}

/** Atualiza o valor de uma configuração */
export function updateConfig(key: string, value: string): boolean {
  const idx = configsState.findIndex((c) => c.key === key);
  if (idx === -1) return false;

  configsState[idx] = { ...configsState[idx], value };
  configsState = [...configsState];

  // Persiste no localStorage
  try {
    const toPersist = configsState.map(({ key, value }) => ({ key, value }));
    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(toPersist));
  } catch {
    // fallback silencioso
  }

  return true;
}

/** Alterna estado enabled de uma ferramenta */
export function toggleTool(toolId: string): boolean {
  const tool = toolsState.find((t) => t.id === toolId);
  if (!tool) return false;
  tool.enabled = !tool.enabled;
  toolsState = [...toolsState];
  return true;
}

/** Reseta todas as ferramentas para estado idle */
export function resetToolsStatus(): void {
  toolsState = toolsState.map((t) => ({ ...t, status: 'idle' as McpToolStatus }));
}

/* ─── Gerenciamento do Servidor MCP ─── */

/** Retorna o estado atual do servidor MCP */
export function getServerState(): McpServerState {
  return getClientState();
}

/** Verifica se o servidor MCP está em execução */
export function isServerRunning(): boolean {
  return isClientRunning();
}

/** Inicia o servidor MCP */
export async function startMcpServer(): Promise<boolean> {
  return startClient();
}

/** Para o servidor MCP */
export async function stopMcpServer(): Promise<boolean> {
  return stopClient();
}

/** Alterna estado do servidor MCP */
export async function toggleMcpServer(): Promise<boolean> {
  return toggleClient();
}

/** Registra callback para mudanças de estado do servidor */
export function onServerStateChange(callback: (state: McpServerState) => void): () => void {
  return onStateChange(callback);
}
