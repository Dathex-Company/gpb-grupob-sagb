import { ModuleManifest } from '../../core/modules/module.types';

export const simuladorMentoriasManifest: ModuleManifest = {
  id: 'simulador-mentorias',
  internalName: 'simulador-mentorias',
  displayName: 'Simulador de Mentorias',
  baseRoute: '/simulador-mentorias',
  icon: 'CurrencyDollarIcon',
  initialStatus: 'active',
  owner: {
    type: 'agent',
    id: 'cassio-mendelec',
    displayName: 'Cássio Mendelec'
  }
};
