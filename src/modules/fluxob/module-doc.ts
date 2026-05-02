export const moduleDoc = {
  nome_oficial: 'FluxoB',
  versao: '0.1.0',
  status: 'pre_alpha',
  resumo: 'Módulo de orquestração de fluxos de trabalho (workflows) do ecossistema GrupoB. FluxoB será o motor de automação de processos de negócio, conectando agentes, sistemas e etapas manuais em fluxos visuais e rastreáveis.',
  responsavel: {
    tipo: 'agente',
    id: 'alan_flow',
    nome: 'Alan Flow'
  },
  observacao: 'Módulo em estágio pré-alpha. Nenhum asset de código existe ainda. O plano_modulo.md contém a definição inicial do domínio e serve como documento fundacional para implementação futura.',
  conceitos_principais: [
    'Workflow — sequência de etapas (steps) que executam uma tarefa de negócio',
    'Step — unidade atômica do workflow (ação de agente, chamada de API, notificação, decisão)',
    'Trigger — evento que inicia um workflow (agendado, webhook, manual, condicional)',
    'Contexto — dados compartilhados entre steps do mesmo workflow',
    'Rastro — log completo de execução com status, duração e resultado de cada step'
  ],
  integracoes_previstas: [
    'Hub de Integração — consumir conectores e credenciais',
    'API SagB — expor endpoints de trigger e consulta',
    'SagB Bridge — disparar workflows a partir de eventos do VS Code',
    'MCP SagB — fornecer contexto de ambiente para steps de desenvolvimento'
  ],
  fontes_de_dados: {
    supabase_tabelas: [],
    storage_buckets: [],
    local_storage_keys: []
  }
};
