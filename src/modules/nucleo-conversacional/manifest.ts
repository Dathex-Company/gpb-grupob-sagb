import { ModuleManifest } from '../../core/modules/module.types';

export const manifest: ModuleManifest = {
  id: 'nucleo-conversacional',
  internalName: 'Núcleo Conversacional',
  displayName: 'Núcleo Conversacional',
  baseRoute: '/nucleo-conversacional',
  icon: 'ChatBubbleOvalLeftEllipsisIcon',
  initialStatus: 'active',
  owner: {
    type: 'human',
    id: 'cassio-mendes',
    displayName: 'Cássio Mendes'
  }
};
