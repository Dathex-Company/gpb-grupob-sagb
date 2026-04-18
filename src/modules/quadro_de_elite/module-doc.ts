export const moduleDoc = {
  nome_oficial: 'Quadro de Elite',
  versao: '1.0.0',
  resumo:
    'Módulo responsável pela gestão, cadastro e evolução dos agentes oficiais do ecossistema SagB, migrando o legado do AgentFactory para o padrão novo modular.',
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
      acao_preventiva: 'Manter gestão principal no Quadro de Elite e consumir dados via agents/agent_configs.'
    }
  ],
  ownership: {
    owner_principal: 'Helen Dravet',
    owner_backup: 'A DEFINIR'
  }
};
