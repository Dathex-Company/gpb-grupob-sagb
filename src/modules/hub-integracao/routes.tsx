import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import { HubIntegracaoPage } from './pages/HubIntegracaoPage';

export const hubIntegracaoRoutes: ModuleRoute = {
  path: '/hub-integracao',
  element: <HubIntegracaoPage />
};
