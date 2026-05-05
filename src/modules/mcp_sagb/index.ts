export { mcpSagbManifest } from './manifest';
export { mcpSagbRoutes } from './routes';
export { moduleDoc as mcpSagbModuleDoc } from './module-doc';
export type { McpTool, McpResource, McpConfig, McpScript, McpEnvironment } from './types/mcpSagb.types';

/* ─── Server (Node.js apenas — NÃO importar do frontend!) ─── */
export type { McpServerConfig, McpServerStatus } from './server';

/* ─── Contracts (SagB Bridge) ─── */
export type {
  McpServerState,
  McpSagbBridgeContract,
  McpBridgeTool,
  McpBridgeToolResult,
  McpBridgeConfig,
  McpSagbEvent,
} from './contracts';
export { MCP_SAGB_EVENTS } from './contracts';
