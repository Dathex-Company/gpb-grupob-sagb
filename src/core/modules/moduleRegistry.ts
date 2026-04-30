import { PluggableModule } from './module.types';

// Módulos do core
import { cidManifest, cidRoutes } from '../../modules/cid';
import { taskzeiManifest, taskzeiRoutes } from '../../modules/taskzei';
import { gestaoFinanceiraManifest, gestaoFinanceiraRoutes } from '../../modules/gestao_financeira';
import { studioManifest, studioRoutes } from '../../modules/studio';
import { karaokeManifest, karaokeRoutes } from '../../modules/karaoke';
import { manifest as telasAvancadasManifest, routes as telasAvancadasRoutes } from '../../modules/telas_avancadas';
import { videosIaManifest, videosIaRoutes } from '../../modules/videos-ia';
import { focoTotalManifest, focoTotalRoutes } from '../../modules/foco_total';
import { orquestracaoPrincipalManifest, orquestracaoPrincipalRoutes } from '../../modules/_orquestracao-principal';
import { nucleoConversacionalManifest, nucleoConversacionalRoutes } from '../../modules/nucleo-conversacional';

import { hubIntegracaoManifest, hubIntegracaoRoutes } from '../../modules/hub-integracao';

// Aqui definimos o registry central. Novos módulos devem ser registrados nesta array.

export const moduleRegistry: PluggableModule[] = [
  {
    manifest: hubIntegracaoManifest,
    routes: hubIntegracaoRoutes
  },
  {
    manifest: nucleoConversacionalManifest,
    routes: nucleoConversacionalRoutes
  },
  {
    manifest: karaokeManifest,
    routes: karaokeRoutes
  },
  {
    manifest: studioManifest,
    routes: studioRoutes
  },
  {
    manifest: cidManifest,
    routes: cidRoutes
  },
  {
    manifest: taskzeiManifest,
    routes: taskzeiRoutes
  },
  {
    manifest: gestaoFinanceiraManifest,
    routes: gestaoFinanceiraRoutes
  },
  {
    manifest: telasAvancadasManifest,
    routes: telasAvancadasRoutes
  },
  {
    manifest: videosIaManifest,
    routes: videosIaRoutes
  },
  {
    manifest: focoTotalManifest,
    routes: focoTotalRoutes
  },
  {
    manifest: orquestracaoPrincipalManifest,
    routes: orquestracaoPrincipalRoutes
  }
];

export function getRegisteredModules(): PluggableModule[] {
  return moduleRegistry;
}

export function getModuleRoutes(): Record<string, { path: string; element: PluggableModule['routes']['element'] }> {
  return moduleRegistry.reduce((acc, mod) => {
    acc[mod.manifest.id] = mod.routes;
    return acc;
  }, {} as Record<string, { path: string; element: PluggableModule['routes']['element'] }>);
}
