import { ModuleManifest } from '../../core/modules/module.types';

export const manifest: ModuleManifest = {
  id: 'quadro_de_elite',
  internalName: 'Núcleo de Identidades',
  displayName: 'Núcleo de Identidades',
  baseRoute: '/quadro_de_elite',
  icon: 'UsersIcon',
  initialStatus: 'active',
  owner: {
    type: 'agent',
    id: 'helen-dravet',
    displayName: 'Helen Dravet'
  }
};
