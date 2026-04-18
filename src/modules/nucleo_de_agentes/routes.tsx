import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import NucleoAgentesPage from './pages/NucleoAgentesPage';

export const routes: ModuleRoute = {
  path: '/nucleo_de_agentes/*',
  element: <NucleoAgentesPage />
};