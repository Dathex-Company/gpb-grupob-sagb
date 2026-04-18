import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import { nagiManifest } from './manifest';
import NAGIPage from './pages/NAGIPage';

export const nagiRoutes: ModuleRoute = {
  path: nagiManifest.baseRoute,
  element: React.createElement(NAGIPage)
};
