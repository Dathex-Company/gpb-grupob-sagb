import { ModuleManifest } from '../../core/modules/module.types';

export const focoTotalManifest: ModuleManifest = {
  id: 'foco-total',
  internalName: '.foco_total',
  displayName: 'Zen Folk | Foco AI',
  baseRoute: '/foco-total',
  icon: 'BotIcon',
  initialStatus: 'active',
  owner: {
    type: 'agent',
    id: 'zen-folk',
    displayName: 'Zen Folk'
  }
};
