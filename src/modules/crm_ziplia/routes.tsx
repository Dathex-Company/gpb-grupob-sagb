import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import { crmZipliaManifest } from './manifest';
import { CrmZipliaNativePage } from './pages/CrmZipliaNativePage';

export const crmZipliaRoutes: ModuleRoute = {
  path: crmZipliaManifest.baseRoute,
  element: <CrmZipliaNativePage />,
  fullscreen: true
};

