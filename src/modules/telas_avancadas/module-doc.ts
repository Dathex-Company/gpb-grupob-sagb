export const moduleDoc = {
  nome_oficial: 'Telas Avançadas',
  versao: '1.1.0',
  resumo:
    'Módulo oficial para cadastro, organização e visualização de telas avançadas em múltiplos formatos (URL externa, arquivo HTML e código HTML).',
  fontes_de_dados: {
    supabase_tabelas: ['N/A (versão atual sem persistência em Supabase)'],
    storage_buckets: ['N/A'],
    local_storage_keys: ['sagb_telas_avancadas_v2', 'sagb_telas_avancadas'],
    indexeddb_stores: ['N/A'],
    arquivos_locais_relevantes: [
      'src/modules/telas_avancadas/services/telasAvancadas.service.ts',
      'src/modules/telas_avancadas/store/telasAvancadas.store.ts',
      'src/modules/telas_avancadas/pages/TelasAvancadasPage.tsx',
      'src/modules/telas_avancadas/types/telasAvancadas.types.ts'
    ]
  },
  servicos_e_integracoes: {
    servicos_internos: [
      'src/modules/telas_avancadas/services/telasAvancadas.service.ts',
      'src/modules/telas_avancadas/store/telasAvancadas.store.ts'
    ],
    apis_externas: ['N/A']
  },
  ativos_reutilizaveis: [
    {
      modulo_origem: 'telas_avancadas',
      ativo: 'viewer-html-seguro-em-iframe-sandbox',
      tipo: 'componente-ui',
      forma_de_uso:
        'Reutilizar o `TelaAvancadaViewer` para renderizar HTML de forma controlada quando houver necessidade de preview em outros módulos.'
    }
  ],
  riscos_de_duplicacao: [
    {
      item: 'Persistência local de estruturas semelhantes em múltiplos módulos',
      risco: 'Fragmentação de estado e inconsistência de comportamento entre listas de telas e catálogos internos.',
      acao_preventiva:
        'Centralizar o cadastro e a governança de telas avançadas neste módulo e expor contratos tipados para consumo interno.'
    }
  ],
  ownership: {
    owner_principal: 'Cley Scrini',
    owner_backup: 'A DEFINIR',
    agente_operacional: 'Cley Devis'
  }
};
