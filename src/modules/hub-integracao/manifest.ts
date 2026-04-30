import { ModuleManifest } from '../../core/modules/module.types';

export const hubIntegracaoManifest: ModuleManifest = {
  id: 'hub-integracao',
  internalName: 'hub_integracao',
  displayName: 'Hub de Integrações',
  baseRoute: '/hub-integracao',
  icon: 'NetworkIcon',
  initialStatus: 'active',
  owner: {
    type: 'agent',
    id: 'alan_flow',
    displayName: 'Alan Flow'
  }
};
