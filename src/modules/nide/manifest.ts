import { ModuleManifest } from '../../core/modules/module.types';

export const nideManifest: ModuleManifest = {
  id: 'nide',
  internalName: 'nide',
  displayName: 'NIDE',
  baseRoute: '/nide',
  icon: 'LayoutIcon',
  initialStatus: 'active',
  owner: {
    type: 'agent',
    id: 'nide-agent',
    displayName: 'Agente NIDE'
  }
};
