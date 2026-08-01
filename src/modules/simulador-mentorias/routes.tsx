import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import { SimuladorMentoriasPage } from './pages/SimuladorMentoriasPage';
import { simuladorMentoriasManifest } from './manifest';

export const simuladorMentoriasRoutes: ModuleRoute = {
  path: simuladorMentoriasManifest.baseRoute,
  element: <SimuladorMentoriasPage />,
  fullscreen: true
};
