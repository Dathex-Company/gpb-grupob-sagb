import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import { cidManifest } from './manifest';
import CIDPage from './pages/CIDPage';

export const cidRoutes: ModuleRoute = {
  path: cidManifest.baseRoute,
  element: React.createElement(CIDPage)
};
