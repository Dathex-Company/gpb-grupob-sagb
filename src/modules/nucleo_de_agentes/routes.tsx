import React from 'react';
import { Navigate } from 'react-router-dom';
import { ModuleRoute } from '../../core/modules/module.types';
import NucleoAgentesPage from './pages/NucleoAgentesPage';

export const routes: ModuleRoute = {
  path: '/nucleo_de_agentes/*',
  element: <NucleoAgentesPage />
};

// Rota de redirect: /quadro_de_elite → /nucleo_de_agentes
// Mantida para compatibilidade com links salvos (bookmarks, históricos, etc.)
export const quadroDeEliteRedirect: ModuleRoute = {
  path: '/quadro_de_elite',
  element: <Navigate to="/nucleo_de_agentes" replace />
};
