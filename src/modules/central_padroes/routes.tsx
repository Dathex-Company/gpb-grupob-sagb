import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import { CentralPadroesLayout } from './layout/CentralPadroesLayout';

export const routes: ModuleRoute = {
  path: '/central_padroes/*',
  element: <CentralPadroesLayout />
};
