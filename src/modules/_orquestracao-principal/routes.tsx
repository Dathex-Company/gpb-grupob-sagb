import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import OrquestracaoPrincipalPage from './pages/OrquestracaoPrincipalPage';

export const routes: ModuleRoute = {
  path: '/orquestracao/*',
  element: <OrquestracaoPrincipalPage />
};
