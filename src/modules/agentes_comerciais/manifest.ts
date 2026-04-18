import { ModuleManifest } from '../../core/modules/module.types';

export const agentes_comerciais_manifest: ModuleManifest = {
  id: 'agentes_comerciais',
  internalName: 'agentes_comerciais',
  displayName: 'Agentes Comerciais',
  baseRoute: '/agentes-comerciais',
  icon: 'UserGroupIcon',
  initialStatus: 'active',
  owner: {
    type: 'agent',
    id: 'oton_lacerda_diretor',
    displayName: 'Oton Lacerda (Diretor)'
  }
};