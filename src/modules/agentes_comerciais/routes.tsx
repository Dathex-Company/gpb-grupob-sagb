import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import { agentes_comerciais_manifest } from './manifest';
import { AgentesComerciaisPage } from './pages';

export const agentes_comerciais_detail_route_pattern = `${agentes_comerciais_manifest.baseRoute}/:agenteId`;

export const agentes_comerciais_routes: ModuleRoute = {
  path: agentes_comerciais_manifest.baseRoute,
  element: React.createElement(AgentesComerciaisPage)
};