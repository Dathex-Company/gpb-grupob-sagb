import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import ApiSagbPage from './pages/ApiSagbPage';

export const apiSagbRoutes: ModuleRoute = {
  path: '/api-sagb/*',
  element: <ApiSagbPage />
};
