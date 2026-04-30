import { ModuleManifest } from '../../core/modules/module.types';

export const crmZipliaManifest: ModuleManifest = {
  id: 'crm-ziplia',
  internalName: 'crm_ziplia_modulo_nativo',
  displayName: 'CRM Ziplia',
  baseRoute: '/crm-ziplia',
  icon: 'BriefcaseIcon',
  initialStatus: 'active',
  owner: {
    type: 'human',
    id: 'denic-celmi',
    displayName: 'Denic Celmi'
  }
};

