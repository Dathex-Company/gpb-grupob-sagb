import { ModuleRoute, PluggableModule } from './module.types';
import { taskzeiManifest, taskzeiRoutes } from '../../modules/taskzei';
import { nicManifest, nicRoutes } from '../../modules/nic';
import { raiManifest, raiRoutes } from '../../modules/rai';
import { mentoriasManifest, mentoriasRoutes } from '../../modules/mentorias';
import { manifest as configManifest, routes as configRoutes } from '../../modules/configuracoes-ambiente';
import { manifest as telasAvancadasManifest, routes as telasAvancadasRoutes } from '../../modules/telas-avancadas';
import { monitoramentoManifest, monitoramentoRoutes } from '../../modules/monitoramento';
import { metodologiasManifest, metodologiasRoutes } from '../../modules/metodologias';
import { missoesManifest, missoesRoutes } from '../../modules/missoes';
import { cadastroEmpresasManifest, cadastroEmpresasRoutes } from '../../modules/cadastro-empresas';
import { videosIaManifest, videosIaRoutes } from '../../modules/videos-ia';
import { nagiManifest, nagiRoutes } from '../../modules/nagi';
import { centralPadroesManifest, centralPadroesRoutes } from '../../modules/central_padroes';
import { orquestracaoPrincipalManifest, orquestracaoPrincipalRoutes } from '../../modules/_orquestracao-principal';

import { cidManifest, cidRoutes } from '../../modules/cid';
import { manifest as nucleoAgentesManifest, routes as nucleoAgentesRoutes } from '../../modules/nucleo_de_agentes';
import { manifest as quadroDeEliteManifest, routes as quadroDeEliteRoutes } from '../../modules/quadro_de_elite';
import { focoTotalManifest, focoTotalRoutes } from '../../modules/foco_total';
import { agentes_comerciais_manifest, agentes_comerciais_routes } from '../../modules/agentes_comerciais';

// Aqui definimos o registry central. Novos módulos devem ser registrados nesta array.

export const moduleRegistry: PluggableModule[] = [
  {
    manifest: cidManifest,
    routes: cidRoutes
  },
  {
    manifest: taskzeiManifest,
    routes: taskzeiRoutes
  },
  {
    manifest: nicManifest,
    routes: nicRoutes
  },
  {
    manifest: nagiManifest,
    routes: nagiRoutes
  },
  {
    manifest: raiManifest,
    routes: raiRoutes
  },
  {
    manifest: mentoriasManifest,
    routes: mentoriasRoutes
  },
  {
    manifest: configManifest,
    routes: configRoutes
  },
  {
    manifest: telasAvancadasManifest,
    routes: telasAvancadasRoutes
  },
  {
    manifest: monitoramentoManifest,
    routes: monitoramentoRoutes
  },
  {
    manifest: metodologiasManifest,
    routes: metodologiasRoutes
  },
  {
    manifest: missoesManifest,
    routes: missoesRoutes
  },
  {
    manifest: cadastroEmpresasManifest,
    routes: cadastroEmpresasRoutes
  },
  {
    manifest: videosIaManifest,
    routes: videosIaRoutes
  },
  {
    manifest: centralPadroesManifest,
    routes: centralPadroesRoutes
  },
  {
    manifest: orquestracaoPrincipalManifest,
    routes: orquestracaoPrincipalRoutes
  },
  {
    manifest: nucleoAgentesManifest,
    routes: nucleoAgentesRoutes
  },
  {
    manifest: quadroDeEliteManifest,
    routes: quadroDeEliteRoutes
  },
  {
    manifest: focoTotalManifest,
    routes: focoTotalRoutes
  },
  {
    manifest: agentes_comerciais_manifest,
    routes: agentes_comerciais_routes
  }
];

export function getRegisteredModules(): PluggableModule[] {
  return moduleRegistry;
}

export function getModuleRoutes(): Record<string, ModuleRoute> {
  return moduleRegistry.reduce((acc, mod) => {
    acc[mod.manifest.id] = mod.routes;
    return acc;
  }, {} as Record<string, ModuleRoute>);
}
