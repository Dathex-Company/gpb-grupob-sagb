export const moduleDoc = {
  name: 'taskzei',
  title: 'Agenda Inteligente',
  status: 'active',
  purpose: 'Módulo de gestão operacional de tarefas, agenda inteligente, projetos, processos e integrações de produtividade.',
  boundaries: [
    'não substituir o Hub de Integração',
    'não armazenar credenciais fora dos serviços apropriados',
    'não quebrar contratos de TaskzeiTask e ITaskzeiService',
    'não criar integrações externas diretas sem passar pelo Hub de Integrações'
  ],
  integrations: [
    'src/modules/hub-integracao',
    'ClickUp quando habilitado por feature toggle via Hub',
    'WhatsApp para notificações quando disponível via Hub'
  ],
  requiredDocs: [
    'plano_modulo.md',
    'changelog.md',
    'decisions.md',
    'agent/prompt_ativacao_cline.md',
    'agent/persona.md',
    'agent/session_log.md',
    'agent/falas_user.md'
  ]
};
