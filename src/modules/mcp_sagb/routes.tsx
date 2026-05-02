import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import { McpSagbPage } from './pages/McpSagbPage';

export const mcpSagbRoutes: ModuleRoute = {
  path: '/mcp_sagb/*',
  element: <McpSagbPage />
};
