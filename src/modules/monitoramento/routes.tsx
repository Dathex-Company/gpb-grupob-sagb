import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import { monitoramentoManifest } from './manifest';
import MonitoramentoPage from './pages/MonitoramentoPage';

export const monitoramentoRoutes: ModuleRoute = {
  path: monitoramentoManifest.baseRoute,
  element: React.createElement(MonitoramentoPage)
};
