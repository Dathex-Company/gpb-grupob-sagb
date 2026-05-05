import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import { mcpSagbManifest } from './manifest';
import McpSagbPage from './pages/McpSagbPage';

export const mcpSagbRoutes: ModuleRoute = {
  path: mcpSagbManifest.baseRoute + '/*',
  element: <McpSagbPage />
};
