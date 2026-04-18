import { ModuleManifest } from '../../core/modules/module.types';

export const manifest: ModuleManifest = {
  id: 'central_padroes',
  internalName: 'Central de Padrões',
  displayName: 'Central de Padrões',
  baseRoute: '/central_padroes',
  icon: 'ShieldCheckIcon',
  initialStatus: 'active',
  owner: {
    type: 'agent',
    id: 'zico-padron',
    displayName: 'Zico Padron'
  }
};
