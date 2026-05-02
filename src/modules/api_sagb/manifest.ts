import { ModuleManifest } from '../../core/modules/module.types';

export const apiSagbManifest: ModuleManifest = {
  id: 'api-sagb',
  internalName: 'api_sagb',
  displayName: 'API SagB',
  baseRoute: '/api-sagb',
  icon: 'NetworkIcon',
  initialStatus: 'active',
  owner: {
    type: 'agent',
    id: 'dante_conec',
    displayName: 'Dante Conec'
  }
};
