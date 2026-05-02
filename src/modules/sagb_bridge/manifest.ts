import { ModuleManifest } from '../../core/modules/module.types';

export const sagbBridgeManifest: ModuleManifest = {
  id: 'sagb_bridge',
  internalName: 'sagb_bridge',
  displayName: 'SagB Bridge',
  baseRoute: '/sagb_bridge',
  icon: 'CodeIcon',
  initialStatus: 'active',
  owner: {
    type: 'agent',
    id: 'alan_flow',
    displayName: 'Alan Flow'
  }
};
