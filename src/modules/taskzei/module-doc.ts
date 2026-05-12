import { ModuleDoc } from '../../core/modules/module.types';

export const moduleDoc: ModuleDoc = {
  displayName: 'Agenda Inteligente',
  purpose:
    'Módulo de gestão operacional de tarefas, agenda inteligente, projetos, processos, documentos inteligentes, notificações automáticas e integrações de produtividade.',
  version: '1.16.0',
  boundaries: [
    'não substituir o Hub de Integração',
    'não armazenar credenciais fora dos serviços apropriados',
    'não quebrar contratos de TaskzeiTask, ITaskzeiService e IDocService',
    'não criar integrações externas diretas sem passar pelo Hub de Integrações',
    'documentos utilizam soft delete via deleted_at — não hard delete',
    'links bidirecionais entre entidades usam a tabela taskzei_entity_links — não campos avulsos',
    'notificações usam serviço server-side (Netlify Function + Supabase Edge Function) — nunca o frontend diretamente',
  ],
  integrations: {
    internal: ['src/modules/hub-integracao'],
    external: [
      'ClickUp quando habilitado por feature toggle via Hub',
      'WhatsApp para notificações quando disponível via Hub',
      'Resend / SendGrid para e-mail transactional (notificações TaskZei)',
      'OneSignal para push notifications (notificações TaskZei)',
    ],
  },
  dataDependencies: {
    supabaseTables: [
      'taskzei_tasks',
      'taskzei_doc_nodes',
      'taskzei_doc_contents',
      'taskzei_entity_links',
      'taskzei_doc_attachments',
      'taskzei_notifications',
      'taskzei_push_devices',
    ],
    localStorageKeys: ['taskzei_tasks_cache'],
  },
};
