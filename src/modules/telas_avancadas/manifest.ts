/**
 * Manifest do módulo Telas Avançadas
 * V2: Suporte a 3 tipos (URL externa, arquivo HTML, código HTML)
 */

import { ModuleManifest } from '../../core/modules/module.types';

export const telasAvancadasManifest: ModuleManifest = {
  id: 'telas-avancadas',
  internalName: 'telas_avancadas',
  displayName: 'Telas Avançadas',
  baseRoute: '/telas-avancadas',
  icon: '🖥️',
  initialStatus: 'active',
  owner: {
    type: 'human',
    id: 'cley-scrini',
    displayName: 'Cley Scrini'
  }
};
