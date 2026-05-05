/* ============================================================================
 * MCP SagB — Tipos e Interfaces
 * ============================================================================
 * Define o contrato de dados para ferramentas MCP, recursos, scripts,
 * configurações e ambientes gerenciados pelo MCP SagB.
 * ============================================================================ */

/** Categoria de ferramenta MCP */
export type McpToolCategory =
  | 'workspace'
  | 'terminal'
  | 'extension'
  | 'deploy'
  | 'scaffold'
  | 'git'
  | 'database'
  | 'monitoring';

/** Status de execução de uma ferramenta MCP */
export type McpToolStatus = 'idle' | 'running' | 'success' | 'error';

/** Tool MCP — representa uma operação que o MCP SagB pode executar */
export interface McpTool {
  id: string;
  name: string;
  description: string;
  category: McpToolCategory;
  icon: string;
  command?: string;
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  enabled: boolean;
  status: McpToolStatus;
  lastRun?: string; // ISO date
}

/** Resource MCP — representa um dado ou configuração que o MCP expõe */
export interface McpResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  content?: string;
}

/** Script de automação gerenciado pelo MCP */
export interface McpScript {
  id: string;
  name: string;
  description: string;
  path: string;
  language: 'powershell' | 'bash' | 'python' | 'typescript';
  category: 'setup' | 'deploy' | 'utility' | 'maintenance';
  parameters?: string[];
  enabled: boolean;
}

/** Configuração de ambiente/tooling */
export interface McpConfig {
  key: string;
  label: string;
  value: string;
  type: 'string' | 'boolean' | 'number' | 'select';
  options?: string[];
  description: string;
  category: 'vs_code' | 'terminal' | 'git' | 'netlify' | 'supabase' | 'general';
}

/** Ambiente de desenvolvimento rastreado */
export interface McpEnvironment {
  id: string;
  name: string;
  type: 'local' | 'staging' | 'production';
  vsCodeVersion?: string;
  nodeVersion?: string;
  npmVersion?: string;
  extensions: string[];
  lastChecked: string; // ISO date
}
