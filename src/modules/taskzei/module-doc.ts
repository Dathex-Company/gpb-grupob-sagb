import { ModuleDoc } from '../../core/modules/module.types';

export const moduleDoc: ModuleDoc = {
  displayName: 'Agenda Inteligente',
  purpose:
    'Módulo de gestão operacional de tarefas, agenda inteligente, projetos, processos e integrações de produtividade.',
  version: '1.6.0',
  boundaries: [
    'não substituir o Hub de Integração',
    'não armazenar credenciais fora dos serviços apropriados',
    'não quebrar contratos de TaskzeiTask e ITaskzeiService',
    'não criar integrações externas diretas sem passar pelo Hub de Integrações',
  ],
  integrations: {
    internal: ['src/modules/hub-integracao'],
    external: [
      'ClickUp quando habilitado por feature toggle via Hub',
      'WhatsApp para notificações quando disponível via Hub',
    ],
  },
  dataDependencies: {
    supabaseTables: ['taskzei_tasks'],
    localStorageKeys: ['taskzei_tasks_cache'],
  },
};
