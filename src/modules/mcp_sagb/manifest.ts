import { ModuleManifest } from '../../core/modules/module.types';

export const mcpSagbManifest: ModuleManifest = {
  id: 'mcp_sagb',
  internalName: 'mcp_sagb',
  displayName: 'MCP SagB',
  baseRoute: '/mcp_sagb',
  icon: 'TerminalIcon',
  initialStatus: 'inactive',
  owner: {
    type: 'agent',
    id: 'savio_codare',
    displayName: 'Sávio Codare'
  }
};
