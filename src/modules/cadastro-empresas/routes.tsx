import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import { cadastroEmpresasManifest } from './manifest';
import { CadastroEmpresasPage } from './pages';

export const cadastroEmpresasDetailRoutePattern = `${cadastroEmpresasManifest.baseRoute}/:empresaId`;

export const cadastroEmpresasRoutes: ModuleRoute = {
  path: cadastroEmpresasManifest.baseRoute,
  element: React.createElement(CadastroEmpresasPage)
};
