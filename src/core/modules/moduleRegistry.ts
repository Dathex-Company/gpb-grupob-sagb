import { PluggableModule } from './module.types';

// Módulos do core
import { cidManifest, cidRoutes } from '../../modules/cid';
import { taskzeiManifest, taskzeiRoutes } from '../../modules/taskzei';
import { gestaoFinanceiraManifest, gestaoFinanceiraRoutes } from '../../modules/gestao_financeira';
import { studioManifest, studioRoutes } from '../../modules/studio';
import { karaokeManifest, karaokeRoutes } from '../../modules/karaoke';

import { hubIntegracaoManifest, hubIntegracaoRoutes } from '../../modules/hub-integracao';
import { acadbCursosManifest, acadbCursosRoutes } from '../../../_qgs/acadb/modules/acadb-cursos';

// Aqui definimos o registry central. Novos módulos devem ser registrados nesta array.

export const moduleRegistry: PluggableModule[] = [
  {
    manifest: acadbCursosManifest,
    routes: acadbCursosRoutes
  },
  {
    manifest: hubIntegracaoManifest,
    routes: hubIntegracaoRoutes
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