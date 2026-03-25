import React from 'react';
import { manifest } from './manifest';

// Lazy loading the page for better performance
const ConfigAmbientePage = React.lazy(() => import('./pages/ConfigAmbientePage'));

export const routes = {
  path: manifest.baseRoute,
  element: React.createElement(ConfigAmbientePage)
};
