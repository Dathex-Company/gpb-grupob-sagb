export const moduleDoc = {
  nome_oficial: 'Núcleo de Identidades',
  versao: '1.1.0',
  resumo:
    'Módulo responsável pelo cadastro mestre estrutural de humanos, agentes e híbridos do ecossistema SagB, preservando a compatibilidade técnica do legado quadro_de_elite.',
  fontes_de_dados: {
    supabase_tabelas: ['agents', 'agent_configs', 'agent_dna_profiles', 'agent_dna_effective'],
    storage_buckets: [],
    local_storage_keys: ['sagb_supabase_session_v1'],
    indexeddb_stores: [],
    arquivos_locais_relevantes: ['src/modules/quadro_de_elite/components/AgentFactory.tsx', 'src/modules/quadro_de_elite/components/agent-factory/*']
  },
  servicos_e_integracoes: {
    servicos_internos: ['services/supabase.ts', 'services/agentDna.ts'],
    apis_externas: ['Supabase Auth', 'Supabase PostgREST']
  },
  ativos_reutilizaveis: [
    {
      modulo_origem: 'quadro_de_elite',
      ativo: 'cadastro_central_de_agentes',
      tipo: 'base_operacional',
      forma_de_uso: 'Usar como fonte única de cadastro/identidade de agentes para módulos consumidores.'
    }
  ],
  riscos_de_duplicacao: [
    {
      item: 'Criação de tela paralela de cadastro de agentes em outro módulo',
      risco: 'Divergência de identidade e status operacional dos agentes.',
      acao_preventiva: 'Manter gestão principal no Núcleo de Identidades e consumir dados via agents/agent_configs.'
    },
    {
      item: 'Criação de IDs canônicos fora da convenção oficial',
      risco: 'Colisão de identidade e quebra de rastreabilidade entre cadastros e pastas.',
      acao_preventiva: 'Aplicar validação obrigatória do padrão nome_empresa3_setor3_nivel1_seq3 e bloquear edição pós-criação.'
    }
  ],
  convencao_identidade: {
    campo_canonico: 'canonicalId',
    formato: 'nome_empresa3_setor3_nivel1_seq3',
    exemplo: 'anton_borselli_3fb_mkt_e_001',
    imutabilidade: 'O ID canônico não pode ser alterado após a criação do agente.',
    regras: [
      'apenas minúsculas, números e underscore',
      'empresa3 com 3 caracteres',
      'setor3 com 3 caracteres',
      'nivel1 em {e,t,o}',
      'seq3 de 001 a 999'
    ]
  },
  ownership: {
    owner_principal: 'Helen Dravet',
    owner_backup: 'A DEFINIR'
  }
};
