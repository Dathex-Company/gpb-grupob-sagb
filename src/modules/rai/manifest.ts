import { ModuleManifest } from '../../core/modules/module.types';

export const raiManifest: ModuleManifest = {
  id: 'rai',
  internalName: 'rai',
  displayName: 'RAI — Radar Avançado de Inteligência',
  baseRoute: '/rai',
  icon: 'RadarIcon',
  initialStatus: 'active',
  owner: {
    type: 'agent',
    id: 'saleh_malu',
    displayName: 'Saleh Malu'
  }
};
