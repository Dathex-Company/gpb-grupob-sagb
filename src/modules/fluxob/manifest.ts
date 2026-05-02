import { ModuleManifest } from '../../core/modules/module.types';

export const fluxobManifest: ModuleManifest = {
  id: 'fluxob',
  internalName: 'fluxob',
  displayName: 'FluxoB',
  baseRoute: '/fluxob',
  icon: 'NetworkIcon',
  initialStatus: 'inactive',
  owner: {
    type: 'agent',
    id: 'alan_flow',
    displayName: 'Alan Flow'
  }
};
