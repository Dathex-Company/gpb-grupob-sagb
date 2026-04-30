export const moduleDoc = {
  name: 'taskzei',
  title: 'Taskzei',
  status: 'active',
  purpose: 'Módulo de gestão operacional de tarefas, agenda inteligente, projetos, processos e integrações de produtividade.',
  boundaries: [
    'não substituir o Hub de Integração',
    'não armazenar credenciais fora dos serviços apropriados',
    'não quebrar contratos de TaskzeiTask e ITaskzeiService'
  ],
  integrations: [
    'src/modules/hub-integracao',
    'ClickUp quando habilitado por feature toggle',
    'WhatsApp para notificações quando disponível'
  ],
  requiredDocs: [
    'changelog.md',
    'decisions.md',
    'agent/prompt_ativacao_cline.md',
    'agent/persona.md',
    'agent/owner.md',
    'agent/session_log.md',
    'agent/falas_user.md'
  ]
};

