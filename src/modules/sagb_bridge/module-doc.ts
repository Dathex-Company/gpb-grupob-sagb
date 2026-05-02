export const moduleDoc = {
  nome_oficial: 'SagB Bridge',
  versao: '1.0.0',
  status: 'active',
  resumo: 'Ponte oficial entre o SagB e o VS Code. Permite abrir tasks do SagB diretamente no VS Code via deep link, com resolução de projeto local, criação de task runs, sincronização de status e envio de relatório final.',
  responsavel: {
    tipo: 'agente',
    id: 'alan_flow',
    nome: 'Alan Flow'
  },
  assets_existentes: [
    'data/sagbBridgeBlueprint.ts — blueprint completo com tipos, cards, endpoints, riscos, sprints',
    'components/ProgrammersRoomView.tsx — view avulsa com 5 seções (visão, execução, contratos, operação, qualidade)',
    'supabase/migrations/20260313000103_sagb_bridge_core.sql — migrations com 5 tabelas: dev_projects, dev_tasks, dev_task_runs, dev_developer_sessions, dev_task_launches',
    'docs/modular-map/modules/13-sagb-bridge.md — documentação no mapa modular'
  ],
  etapas_evolucao: [
    { id: 'ET-01', titulo: 'Definir arquitetura e contratos da ponte SagB x VS Code', status: 'concluida' },
    { id: 'ET-02', titulo: 'Criar extensão VS Code base', status: 'pendente' },
    { id: 'ET-03', titulo: 'Implementar deep link, pending launch e operação de runs', status: 'pendente' },
    { id: 'ET-04', titulo: 'Criar backend mínimo e Sala dos Programadores', status: 'pendente' }
  ],
  endpoints_api: [
    { method: 'POST', path: '/api/dev/auth/validate', desc: 'Validar token da extensão' },
    { method: 'GET', path: '/api/dev/projects', desc: 'Listar projetos disponíveis' },
    { method: 'GET', path: '/api/dev/tasks', desc: 'Listar tasks para a Sala dos Programadores' },
    { method: 'GET', path: '/api/dev/tasks/{taskId}', desc: 'Detalhar task por ID' },
    { method: 'POST', path: '/api/dev/task-launches', desc: 'Gerar launchToken e deep link' },
    { method: 'POST', path: '/api/dev/task-launches/consume', desc: 'Consumir launchToken e recuperar payload real' },
    { method: 'POST', path: '/api/dev/task-runs', desc: 'Criar ou retomar task run' },
    { method: 'PATCH', path: '/api/dev/task-runs/{runId}/status', desc: 'Atualizar status ou bloqueio da run' },
    { method: 'POST', path: '/api/dev/task-runs/{runId}/report', desc: 'Enviar resumo final da run' },
    { method: 'POST', path: '/api/dev/developer-sessions', desc: 'Registrar sessão do VS Code' }
  ],
  fontes_de_dados: {
    supabase_tabelas: [
      'dev_projects',
      'dev_tasks',
      'dev_task_runs',
      'dev_developer_sessions',
      'dev_task_launches'
    ],
    storage_buckets: [],
    local_storage_keys: []
  },
  servicos_e_integracoes: {
    servicos_internos: ['SagB API', 'Extensão VS Code (grupob.sagb-bridge)'],
    apis_externas: ['VS Code URI handler (vscode://)']
  },
  decisoes_imutaveis: [
    'Não embutir o VS Code completo no SagB na V1.',
    'Usar API HTTP do SagB + extensão oficial do VS Code.',
    'Usar launchToken temporário no deep link.',
    'Resolver projeto local por project binding, não por localPath fixo vindo da API.',
    'Persistir pendingLaunch antes de qualquer openFolder.',
    'Armazenar token apenas em SecretStorage.',
    'Não controlar a interface do Codex na V1.'
  ]
};
