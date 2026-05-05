/* ============================================================================
 * MCP SagB — Contratos de Integração (SagB Bridge)
 * ============================================================================
 * Contratos públicos que o módulo sagb_bridge (e outros) consomem para
 * interagir com o MCP SagB sem dependência direta de implementação.
 *
 * Uso no sagb_bridge:
 *   import type { McpSagbBridgeContract } from '../mcp_sagb/contracts/mcpSagb.contracts';
 * ============================================================================ */

import type { McpToolStatus, McpToolCategory } from '../types/mcpSagb.types';

/* ─── Status do Servidor MCP ─── */

export interface McpServerState {
  /** Se o servidor MCP está em execução */
  running: boolean;
  /** Timestamp ISO de quando foi iniciado (null se parado) */
  startedAt: string | null;
  /** Ambiente de execução: 'mock' (dev/browser) ou 'live' (Node.js stdio) */
  mode: 'mock' | 'live';
  /** Número de recursos registrados */
  resources: number;
  /** Número de ferramentas registradas */
  tools: number;
  /** Nome do servidor */
  serverName: string;
  /** Versão do servidor */
  serverVersion: string;
}

/* ─── Contrato Bridge ─── */

/**
 * Interface que o SagB Bridge deve implementar para consumir o MCP SagB.
 * O módulo mcp_sagb fornece uma implementação concreta via getBridgeContract().
 */
export interface McpSagbBridgeContract {
  /** Retorna o estado atual do servidor MCP */
  getServerState(): McpServerState;

  /** Inicia o servidor MCP (modo live ou mock) */
  startServer(): Promise<boolean>;

  /** Para o servidor MCP */
  stopServer(): Promise<boolean>;

  /** Alterna o estado do servidor (liga/desliga) */
  toggleServer(): Promise<boolean>;

  /** Retorna lista de ferramentas disponíveis (versão resumida para bridge) */
  listTools(): McpBridgeTool[];

  /** Executa uma ferramenta pelo ID */
  executeTool(toolId: string): Promise<McpBridgeToolResult>;

  /** Escuta mudanças de estado do servidor */
  onStateChange(callback: (state: McpServerState) => void): () => void;
}

/* ─── Tipos Bridge ─── */

/** Versão resumida de McpTool para consumo externo */
export interface McpBridgeTool {
  id: string;
  name: string;
  description: string;
  category: McpToolCategory;
  enabled: boolean;
  status: McpToolStatus;
}

/** Resultado de execução de ferramenta via bridge */
export interface McpBridgeToolResult {
  success: boolean;
  output: string;
  toolId: string;
  duration: number; // ms
  timestamp: string; // ISO
}

/* ─── Eventos ─── */

/** Nomes de eventos emitidos pelo MCP SagB */
export const MCP_SAGB_EVENTS = {
  SERVER_STARTED: 'mcp-sagb:server-started',
  SERVER_STOPPED: 'mcp-sagb:server-stopped',
  TOOL_EXECUTED: 'mcp-sagb:tool-executed',
  STATE_CHANGED: 'mcp-sagb:state-changed',
} as const;

export type McpSagbEvent = (typeof MCP_SAGB_EVENTS)[keyof typeof MCP_SAGB_EVENTS];

/* ─── Tipos de Configuração Remota ─── */

/** Configuração que o bridge pode enviar para o MCP server */
export interface McpBridgeConfig {
  /** Porta para servidor HTTP (se aplicável) */
  httpPort?: number;
  /** Habilitar logging detalhado */
  verbose?: boolean;
  /** Timeout padrão para execução de ferramentas (ms) */
  defaultToolTimeout?: number;
  /** Lista de ferramentas proibidas (não podem ser executadas via bridge) */
  forbiddenTools?: string[];
}
