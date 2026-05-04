import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import { metodologiasManifest } from './manifest';
import MetodologiasHubPage from './pages/MetodologiasHubPage';

const handleBackToSagB = () => {
  window.dispatchEvent(new CustomEvent('sagb:navigate', { detail: 'ecosystem' }));
};

export const metodologiasRoutes: ModuleRoute = {
  path: metodologiasManifest.baseRoute,
  element: <MetodologiasHubPage onBackToSagB={handleBackToSagB} />,
  fullscreen: true
};
