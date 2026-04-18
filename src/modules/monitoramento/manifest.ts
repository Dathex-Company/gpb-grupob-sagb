import { ModuleManifest } from '../../core/modules/module.types';

export const monitoramentoManifest: ModuleManifest = {
  id: 'monitoramento',
  internalName: 'monitoramento',
  displayName: 'Monitoramento',
  baseRoute: '/monitoramento',
  icon: 'MicIcon',
  initialStatus: 'active',
  owner: {
    displayName: 'Noali Kessler',
    role: 'Agente Responsável pelo Monitoramento',
    email: 'noali@dathex.company',
    backup: 'Pierre Zanulli (Agente Mestre da Orquestração)'
  }
};
