import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import CentralPadroesPage from './pages/CentralPadroesPage';

export const routes: ModuleRoute = {
  path: '/central_padroes/*',
  element: <CentralPadroesPage />
};
