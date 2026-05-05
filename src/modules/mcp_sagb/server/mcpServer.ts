/* ============================================================================
 * MCP SagB — Servidor MCP (Node.js)
 * ============================================================================
 * Implementação canônica do servidor MCP usando @modelcontextprotocol/sdk.
 *
 * ATENÇÃO: Este arquivo usa StdioServerTransport (Node.js streams) e NÃO
 * deve ser importado por código de frontend (Vite/React). Use o arquivo
 * runner.ts para executar via CLI com `npx tsx`.
 *
 * Recursos expostos:
 *   - sagb://modules   → Lista de módulos registrados no SagB
 *   - sagb://tools     → Catálogo de ferramentas MCP disponíveis
 *
 * Ferramentas expostas:
 *   - list-modules     → Retorna módulos instalados via moduleRegistry
 *   - mcp-status       → Retorna status atual do servidor MCP e ambiente
 * ============================================================================ */

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

/* ─── Tipos internos ─── */
export interface McpServerConfig {
  name: string;
  version: string;
  modulesEndpoint?: string;
}

export interface McpServerStatus {
  running: boolean;
  startedAt: string | null;
  resources: number;
  tools: number;
  mode: 'mock' | 'live';
}

/* ─── Estado do servidor ─── */
let serverInstance: McpServer | null = null;
let transportInstance: StdioServerTransport | null = null;
let serverStartedAt: string | null = null;
let isRunning = false;

/* ─── Helpers: retornam conteúdo dos resources ─── */

/**
 * Obtém snapshot dos módulos registrados no SagB.
 * NOTA: Em runtime real, isto chamaria getRegisteredModules() do core.
 * Para o server standalone, retorna mock representativo.
 */
function getModulesSnapshot(): string {
  // Em modo live, isto importaria do moduleRegistry:
  // import { getRegisteredModules } from '../../../core/modules/moduleRegistry';
  return JSON.stringify(
    [
      { id: '_orquestracao-principal', displayName: 'Orquestração Principal', active: true },
      { id: 'configuracoes-ambiente', displayName: 'Configurações de Ambiente', active: true },
      { id: 'mcp_sagb', displayName: 'MCP SagB', active: true },
      { id: 'sagb_bridge', displayName: 'SagB Bridge', active: true },
      { id: 'gestao_financeira', displayName: 'Gestão Financeira', active: false },
      { id: 'api_sagb', displayName: 'API SagB', active: true },
      { id: 'hub_integracao', displayName: 'Hub de Integração', active: true },
      { id: 'mentorias', displayName: 'Mentorias', active: false },
    ],
    null,
    2,
  );
}

/**
 * Obtém snapshot das ferramentas MCP do catálogo.
 */
function getToolsSnapshot(): string {
  return JSON.stringify(
    [
      { id: 'workspace-scanner', name: 'Workspace Scanner', category: 'workspace', enabled: true },
      { id: 'terminal-executor', name: 'Terminal Executor', category: 'terminal', enabled: true },
      { id: 'extension-lister', name: 'Extension Lister', category: 'extension', enabled: true },
      { id: 'netlify-deployer', name: 'Netlify Deployer', category: 'deploy', enabled: false },
      { id: 'module-scaffolder', name: 'Module Scaffolder', category: 'scaffold', enabled: true },
      { id: 'git-status', name: 'Git Status', category: 'git', enabled: true },
      { id: 'db-migration-runner', name: 'DB Migration Runner', category: 'database', enabled: false },
      { id: 'system-monitor', name: 'System Monitor', category: 'monitoring', enabled: true },
    ],
    null,
    2,
  );
}

/* ─── Criação e configuração do servidor ─── */

/**
 * Cria e configura uma instância do McpServer com resources e tools.
 */
function createServer(config: McpServerConfig): McpServer {
  const server = new McpServer(
    {
      name: config.name,
      version: config.version,
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    },
  );

  /* ─── Resource: sagb://modules ─── */
  server.resource(
    'Módulos Instalados',
    'sagb://modules',
    {
      description: 'Lista de todos os módulos registrados no ecossistema SagB',
      mimeType: 'application/json',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: getModulesSnapshot(),
        },
      ],
    }),
  );

  /* ─── Resource: sagb://tools ─── */
  server.resource(
    'Ferramentas MCP',
    'sagb://tools',
    {
      description: 'Catálogo de ferramentas MCP disponíveis no SagB',
      mimeType: 'application/json',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: getToolsSnapshot(),
        },
      ],
    }),
  );

  /* ─── Resource Template: sagb://module/{id} ─── */
  server.resource(
    'Detalhe de Módulo',
    new ResourceTemplate('sagb://module/{id}', { list: undefined }),
    {
      description: 'Detalhes de um módulo específico do SagB',
      mimeType: 'application/json',
    },
    async (uri, variables) => {
      const moduleId = variables.id;
      const modules = JSON.parse(getModulesSnapshot()) as Array<{ id: string; displayName: string; active: boolean }>;
      const found = modules.find((m) => m.id === moduleId);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: found
              ? JSON.stringify(found, null, 2)
              : JSON.stringify({ error: `Módulo "${moduleId}" não encontrado.` }, null, 2),
          },
        ],
      };
    },
  );

  /* ─── Tool: list-modules ─── */
  server.tool(
    'list-modules',
    'Lista todos os módulos registrados no ecossistema SagB, com status de ativação',
    {
      filterByStatus: z.string().optional().describe('Filtrar por status: "active", "inactive"'),
    },
    async ({ filterByStatus }) => {
      const modules = JSON.parse(getModulesSnapshot()) as Array<{ id: string; displayName: string; active: boolean }>;
      let filtered = modules;
      if (filterByStatus === 'active') {
        filtered = modules.filter((m) => m.active);
      } else if (filterByStatus === 'inactive') {
        filtered = modules.filter((m) => !m.active);
      }
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                total: filtered.length,
                modules: filtered,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  /* ─── Tool: mcp-status ─── */
  server.tool(
    'mcp-status',
    'Retorna o status atual do servidor MCP SagB e informações do ambiente',
    {},
    async () => {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                server: config.name,
                version: config.version,
                status: 'running',
                uptime: serverStartedAt,
                environment: {
                  node: process.version,
                  platform: process.platform,
                  cwd: process.cwd(),
                },
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  return server;
}

/* ─── API pública ─── */

/**
 * Inicia o servidor MCP conectando ao transporte stdio.
 * Bloqueia até que a conexão seja encerrada (a menos que force=false).
 */
export async function startServer(config?: Partial<McpServerConfig>): Promise<void> {
  if (isRunning) {
    console.warn('[MCP SagB] Servidor já está em execução.');
    return;
  }

  const finalConfig: McpServerConfig = {
    name: config?.name ?? 'MCP-SagB',
    version: config?.version ?? '1.0.0',
  };

  try {
    serverInstance = createServer(finalConfig);
    transportInstance = new StdioServerTransport();
    await serverInstance.connect(transportInstance);
    isRunning = true;
    serverStartedAt = new Date().toISOString();
    console.error(`[MCP SagB] Servidor conectado via stdio — ${finalConfig.name} v${finalConfig.version}`);
    console.error(`[MCP SagB] Resources: sagb://modules, sagb://tools, sagb://module/{id}`);
    console.error(`[MCP SagB] Tools: list-modules, mcp-status`);
    console.error(`[MCP SagB] Aguardando mensagens do cliente...`);
  } catch (err) {
    isRunning = false;
    serverInstance = null;
    transportInstance = null;
    serverStartedAt = null;
    console.error('[MCP SagB] Erro ao iniciar servidor:', err);
    throw err;
  }
}

/**
 * Para o servidor MCP.
 */
export async function stopServer(): Promise<void> {
  if (!isRunning || !serverInstance) {
    console.warn('[MCP SagB] Servidor não está em execução.');
    return;
  }
  try {
    await serverInstance.close();
  } catch (err) {
    console.error('[MCP SagB] Erro ao fechar servidor:', err);
  }
  isRunning = false;
  serverInstance = null;
  transportInstance = null;
  serverStartedAt = null;
  console.error('[MCP SagB] Servidor desconectado.');
}

/**
 * Retorna o status atual do servidor.
 */
export function getStatus(): McpServerStatus {
  return {
    running: isRunning,
    startedAt: serverStartedAt,
    resources: 3,
    tools: 2,
    mode: 'live',
  };
}

/* ─── Nota ───
 * Para usar este servidor em produção:
 *   1. Compilar com `npx tsc` (configurado para Node.js)
 *   2. Executar: `node dist/modules/mcp_sagb/server/runner.js`
 *   OU em dev:   `npx tsx src/modules/mcp_sagb/server/runner.ts`
 *
 * Para integração com Netlify Functions, veja a documentação em README.md
 * ─── */
