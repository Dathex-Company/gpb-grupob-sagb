import React from 'react';
import { AgendaInteligenteLayout } from './layout/AgendaInteligenteLayout';
import { ModuleRoute } from '../../core/modules/module.types';
import { taskzeiManifest } from './manifest';

// Rota inicial do módulo, base para futura abstração de router
export const taskzeiRoutes: ModuleRoute = {
  path: taskzeiManifest.baseRoute,
  element: <AgendaInteligenteLayout />
};
