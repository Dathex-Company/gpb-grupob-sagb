/**
 * Rotas do módulo Telas Avançadas
 */

import React from 'react';
import { TelasAvancadasPage } from './pages/TelasAvancadasPage';
import { ModuleRoute } from '../../core/modules/module.types';

export const telasAvancadasRoutes: ModuleRoute = {
  path: '/telas-avancadas',
  element: <TelasAvancadasPage />,
};