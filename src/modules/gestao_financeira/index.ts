import { PluggableModule } from '../../core/modules/module.types';
import { gestaoFinanceiraManifest } from './manifest';
import { gestaoFinanceiraRoutes } from './routes';

export { gestaoFinanceiraManifest } from './manifest';
export { gestaoFinanceiraRoutes } from './routes';

export const gestaoFinanceiraModule: PluggableModule = {
  manifest: gestaoFinanceiraManifest,
  routes: gestaoFinanceiraRoutes
};

export default gestaoFinanceiraModule;
