import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import FocoTotalPage from './pages/FocoTotalPage';

export const focoTotalRoutes: ModuleRoute = {
  path: '/foco-total/*',
  element: <FocoTotalPage />
};
