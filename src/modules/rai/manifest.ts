import { ModuleManifest } from '../../core/modules/module.types';

export const raiManifest: ModuleManifest = {
  id: 'rai',
  internalName: 'rai',
  displayName: 'RAI',
  baseRoute: '/rai',
  icon: 'RadarIcon', // O shell deve mapear isso para um ícone Lucide ou similar
  initialStatus: 'active'
};
