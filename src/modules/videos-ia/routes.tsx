import React from 'react';
import { ModuleRoute } from '../../core/modules/module.types';
import { videosIaManifest } from './manifest';
import VideosIaPage from './pages/VideosIaPage';

export const videosIaRoutes: ModuleRoute = {
  path: videosIaManifest.baseRoute,
  element: React.createElement(VideosIaPage)
};
