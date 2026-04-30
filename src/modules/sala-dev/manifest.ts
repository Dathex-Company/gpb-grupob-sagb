import { ModuleManifest } from '../../core/modules/module.types';

export const manifest: ModuleManifest = {
  id: 'sala-dev',
  internalName: 'sala-dev',
  displayName: 'Sala Dev',
  baseRoute: '/sala-dev',
  icon: 'TerminalIcon',
  initialStatus: 'active',
  owner: {
    type: 'agent',
    id: 'guardiao-sala-dev',
    displayName: 'Guardião Sala Dev'
  }
};

