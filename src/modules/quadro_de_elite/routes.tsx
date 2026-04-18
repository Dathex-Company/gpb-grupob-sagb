import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import QuadroDeElitePage from './pages/QuadroDeElitePage';

export const routes: ModuleRoute = {
  path: '/quadro_de_elite/*',
  element: <QuadroDeElitePage />
};
