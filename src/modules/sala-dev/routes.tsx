import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import SalaDevPage from './pages/SalaDevPage';

export const routes: ModuleRoute = {
  path: '/sala-dev/*',
  element: <SalaDevPage />
};

