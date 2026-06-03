import React from 'react';
import { metodologiasDomainManifest } from './domain-manifest';
import MetodologiasHubPage from './pages/MetodologiasHubPage';

/**
 * Rota interna do domínio Metodologias dentro do NIDE.
 *
 * A rota é renderizada dentro do NideShell, no conteúdo principal.
 * O HubPage mantém sua navegação hash-based interna (MetodologiasInternalMenu)
 * e seu layout próprio de duas colunas (sidebar + main).
 *
 * A rota global /metodologias permanece intacta como fallback.
 */
export const metodologiasDomainRoutes = {
  path: metodologiasDomainManifest.basePath,
  element: <MetodologiasHubPage onBackToSagB={() => {
    // Volta para o ecossistema SagB via navegação global
    window.dispatchEvent(new CustomEvent('sagb:navigate', { detail: { route: 'ecosystem' } }));
  }} />
};
