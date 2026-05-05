import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import { dispatchNavigate } from '../../core/navigation/sagbNavigate';
import { metodologiasManifest } from './manifest';
import MetodologiasHubPage from './pages/MetodologiasHubPage';

const handleBackToSagB = () => {
  dispatchNavigate('ecosystem');
};

export const metodologiasRoutes: ModuleRoute = {
  path: metodologiasManifest.baseRoute,
  element: <MetodologiasHubPage onBackToSagB={handleBackToSagB} />,
  fullscreen: true
};
