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
    id: 'alan_flow',
    displayName: 'Alan Flow'
  }
};

