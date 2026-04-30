export const moduleDoc = {
  name: 'sala-dev',
  title: 'Sala Dev',
  status: 'active',
  purpose: 'Cockpit técnico para desenvolvimento assistido, orquestração de agentes técnicos, acompanhamento de execução e documentação operacional do SagB.',
  boundaries: [
    'não substituir o moduleRegistry global',
    'não armazenar segredos',
    'não executar automações sem rastreabilidade'
  ],
  integrations: [
    'components/DevRoomView.tsx',
    'components/dev-room/*',
    'data/sagbBridgeBlueprint.ts'
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

