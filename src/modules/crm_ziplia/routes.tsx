import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import { crmZipliaManifest } from './manifest';
import { CrmZipliaGatewayPage } from './pages/CrmZipliaGatewayPage';

export const crmZipliaRoutes: ModuleRoute = {
  path: crmZipliaManifest.baseRoute,
  element: <CrmZipliaGatewayPage />
};

