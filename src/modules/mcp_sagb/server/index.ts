/* ============================================================================
 * MCP SagB — Server Barrel
 * ============================================================================
 * Re-exporta os símbolos do servidor MCP.
 *
 * ATENÇÃO: Este módulo usa Node.js (StdioServerTransport) e NÃO deve ser
 * importado por código de frontend. Use apenas via CLI (runner.ts).
 * ============================================================================ */

export { startServer, stopServer, getStatus } from './mcpServer.js';
export type { McpServerConfig, McpServerStatus } from './mcpServer.js';
