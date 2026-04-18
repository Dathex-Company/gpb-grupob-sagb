export const moduleDoc = {
  nome_oficial: 'Central de Padrões',
  versao: '1.0.0',
  resumo:
    'Módulo oficial para consolidar, validar e publicar padrões de código, design, nomenclatura e arquitetura do SagB.',
  fontes_de_dados: {
    supabase_tabelas: ['A definir (futuro: official_patterns)'],
    storage_buckets: ['N/A'],
    local_storage_keys: ['N/A'],
    indexeddb_stores: ['N/A'],
    arquivos_locais_relevantes: [
      'src/modules/central_padroes/pages/CentralPadroesPage.tsx',
      'src/modules/central_padroes/module-doc.ts',
      'src/modules/central_padroes/docs/',
      'src/modules/central_padroes/agent/persona.md'
    ]
  },
  servicos_e_integracoes: {
    servicos_internos: ['src/core/modules/moduleRegistry.ts'],
    apis_externas: ['AI Proxy (consulta de padrões)', 'Governança']
  },
  ativos_reutilizaveis: [
    {
      modulo_origem: 'central_padroes',
      ativo: 'catalogo_unico_de_padroes',
      tipo: 'documentacao',
      forma_de_uso:
        'Referência única para novos módulos e refatorações, evitando variações não homologadas de contratos e interface.'
    }
  ],
  riscos_de_duplicacao: [
    {
      item: 'Padrões paralelos em docs soltos',
      risco: 'Conflitos de implementação entre módulos e perda de referência oficial.',
      acao_preventiva: 'Centralizar decisões e padrões homologados no módulo `central_padroes`.'
    }
  ],
  ownership: {
    owner_principal: 'Zico Padron',
    owner_backup: 'A DEFINIR'
  }
};
