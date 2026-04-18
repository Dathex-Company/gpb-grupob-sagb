import { ModuleManifest } from '../../core/modules/module.types';

export const manifest: ModuleManifest = {
  id: 'nucleo_de_agentes',
  internalName: 'Núcleo de Agentes',
  displayName: 'Núcleo de Agentes',
  baseRoute: '/nucleo_de_agentes',
  icon: 'ShieldCheckIcon',
  initialStatus: 'active',
  owner: {
    type: 'agent',
    id: 'brene-sagore',
    displayName: 'Brene Sagore'
  }
};