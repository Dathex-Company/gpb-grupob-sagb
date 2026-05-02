import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import SagbBridgePage from './pages/SagbBridgePage';

export const sagbBridgeRoutes: ModuleRoute = {
  path: '/sagb_bridge/*',
  element: <SagbBridgePage />
};
