import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import { metodologiasManifest } from './manifest';
import MetodologiasHubPage from './pages/MetodologiasHubPage';

export const metodologiasRoutes: ModuleRoute = {
  path: metodologiasManifest.baseRoute,
  element: React.createElement(MetodologiasHubPage)
};
