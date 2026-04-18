import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import { gestaoFinanceiraManifest } from './manifest';
import { GestaoFinanceiraPage } from './pages/GestaoFinanceiraPage';

export const gestaoFinanceiraRoutes: ModuleRoute = {
  path: gestaoFinanceiraManifest.baseRoute,
  element: <GestaoFinanceiraPage />
};
