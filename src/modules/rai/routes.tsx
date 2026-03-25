import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import RAIPage from './pages/RAIPage';

export const raiRoutes: ModuleRoute = {
  path: '/rai',
  element: React.createElement(RAIPage)
};
