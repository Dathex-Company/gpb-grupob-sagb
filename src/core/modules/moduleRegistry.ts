import { PluggableModule } from './module.types';
import { taskzeiManifest, taskzeiRoutes } from '../../modules/taskzei';
import { nicManifest, nicRoutes } from '../../modules/nic';
import { raiManifest, raiRoutes } from '../../modules/rai';
import { mentoriasManifest, mentoriasRoutes } from '../../modules/mentorias';
import { manifest as configManifest, routes as configRoutes } from '../../modules/configuracoes-ambiente';
import { manifest as telasAvancadasManifest, routes as telasAvancadasRoutes } from '../../modules/telas-avancadas';

// Aqui definimos o registry central. Novos módulos devem ser registrados nesta array.
export const moduleRegistry: PluggableModule[] = [
  {
    manifest: taskzeiManifest,
    routes: taskzeiRoutes
  },
  {
    manifest: nicManifest,
    routes: nicRoutes
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
  }
];

export const getRegisteredModules = (): PluggableModule[] => {
  return moduleRegistry.filter(mod => mod.manifest.initialStatus === 'active');
};

export const getModuleRoutes = (): Record<string, PluggableModule['routes']> => {
  return moduleRegistry.reduce((acc, mod) => {
    acc[mod.manifest.id] = mod.routes;
    return acc;
  }, {} as Record<string, PluggableModule['routes']>);
};
