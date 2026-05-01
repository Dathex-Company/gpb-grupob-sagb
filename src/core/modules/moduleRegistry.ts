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
import { nucleoConversacionalManifest, nucleoConversacionalRoutes } from '../../modules/nucleo-conversacional';
import { manifest as nucleoDeAgentesManifest, routes as nucleoDeAgentesRoutes } from '../../modules/nucleo_de_agentes';
import { centralPadroesManifest, centralPadroesRoutes } from '../../modules/central_padroes';
import { monitoramentoManifest, monitoramentoRoutes } from '../../modules/monitoramento';
import { nagiManifest, nagiRoutes } from '../../modules/nagi';
import { nicManifest, nicRoutes } from '../../modules/nic';
import { manifest as quadroDeEliteManifest, routes as quadroDeEliteRoutes } from '../../modules/quadro_de_elite';
import { salaDevManifest, salaDevRoutes } from '../../modules/sala-dev';

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
    manifest: nucleoDeAgentesManifest,
    routes: nucleoDeAgentesRoutes
  },
  {
    manifest: centralPadroesManifest,
    routes: centralPadroesRoutes
  },
  {
    manifest: monitoramentoManifest,
    routes: monitoramentoRoutes
  },
  {
    manifest: nagiManifest,
    routes: nagiRoutes
  },
  {
    manifest: nicManifest,
    routes: nicRoutes
  },
  {
    manifest: quadroDeEliteManifest,
    routes: quadroDeEliteRoutes
  },
  {
    manifest: salaDevManifest,
    routes: salaDevRoutes
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
