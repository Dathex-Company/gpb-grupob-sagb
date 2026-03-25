import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import NICPage from './pages/NICPage';

export const nicRoutes: ModuleRoute = {
  path: '/nic',
  element: React.createElement(NICPage)
};
