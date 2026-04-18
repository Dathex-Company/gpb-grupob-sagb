export const moduleDoc = {
  nome_oficial: 'Núcleo de Agentes',
  versao: '1.0.0',
  resumo:
    'Módulo base para visualização das 7 camadas dos agentes e para governança de arquitetura cognitiva/operacional no SagB.',
  fontes_de_dados: {
    supabase_tabelas: [
      'agents',
      'governance_global_culture',
      'governance_compliance_rules',
      'vault_items',
      'knowledge_nodes',
      'continuous_memory_sessions',
      'continuous_memory_chunks',
      'continuous_memory_files',
      'continuous_memory_outputs'
    ],
    storage_buckets: ['continuous-memory'],
    local_storage_keys: ['sagb_continuous_memory_v1:*', 'sagb_supabase_session_v1'],
    indexeddb_stores: ['sagb_continuous_memory_audio_v1/audio_blobs'],
    arquivos_locais_relevantes: [
      'src/modules/nucleo_de_agentes/components/BaseDosAgentesView.tsx',
      'services/continuousMemory.ts',
      'services/knowledge.ts',
      'services/contextAssembler.ts'
    ]
  },
  servicos_e_integracoes: {
    servicos_internos: ['services/continuousMemory.ts', 'services/knowledge.ts', 'services/contextAssembler.ts'],
    apis_externas: ['Supabase Auth', 'Supabase PostgREST', 'Supabase Storage']
  },
  ativos_reutilizaveis: [
    {
      modulo_origem: 'nucleo_de_agentes',
      ativo: 'memoria_mentor_continua',
      tipo: 'memoria',
      forma_de_uso:
        'Reuso de sessões/chunks e outputs de memória contínua já existentes para novos módulos (ex: DAI) sem criar tabelas duplicadas.'
    },
    {
      modulo_origem: 'nucleo_de_agentes',
      ativo: 'registro_oficial_de_agentes',
      tipo: 'tabela',
      forma_de_uso: 'Reaproveitar tabela agents como fonte de identidade, função, DNA e status operacional dos agentes.'
    }
  ],
  riscos_de_duplicacao: [
    {
      item: 'Tabelas de memória paralelas por módulo',
      risco: 'Fragmentação de histórico e inconsistência de contexto entre agentes.',
      acao_preventiva: 'Priorizar reuso de continuous_memory_* antes de propor novas tabelas.'
    },
    {
      item: 'Criação de cadastro de agentes paralelo',
      risco: 'Duplicidade de identidade e conflito de status dos agentes.',
      acao_preventiva: 'Usar sempre agents como fonte única de cadastro oficial.'
    }
  ],
  ownership: {
    owner_principal: 'Brene Sagore',
    owner_backup: 'A DEFINIR'
  }
};
