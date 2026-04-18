import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import { missoesManifest } from './manifest';
import MissoesPage from './pages/MissoesPage';

export const missoesRoutes: ModuleRoute = {
  path: missoesManifest.baseRoute,
  element: React.createElement(MissoesPage)
};
