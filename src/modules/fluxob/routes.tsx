import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import { FluxobPage } from './pages/FluxobPage';

export const fluxobRoutes: ModuleRoute = {
  path: '/fluxob/*',
  element: <FluxobPage />
};
