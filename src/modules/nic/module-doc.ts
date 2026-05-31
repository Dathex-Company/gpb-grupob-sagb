export const moduleDoc = {
  nomeOficial: 'Núcleo de Inteligência Conectiva (NIC)',
  objetivo:
    'Central de curadoria de nomes do ecossistema. Cataloga, classifica, aprova e acompanha todos os nomes oficiais do GrupoB, suas empresas, produtos, métodos e módulos.',
  responsavelTecnico: 'Time de Curadoria',
  status: 'Ativo — Curadoria de Nomes',
  tipo: 'Módulo Oficial',

  tabelasSupabase: [
    'nic_naming_items (catálogo de nomes)',
    'nic_naming_decisions (histórico de decisões)',
    'nic_naming_conflicts (conflitos de nome)',
    'nic_naming_scan (varredura de candidatos)'
  ],

  bucketsStorage: [],

  integracoes: [
    'Catálogo de Governança (fonte de nomes canônicos)',
    'NAGI (destino de decisões de governança)',
    'Varredura de Diretórios (candidatos a novo nome)'
  ],

  estruturasExclusivas: [
    'src/modules/nic/pages/NICPage.tsx',
    'src/modules/nic/data/nicBlueprint.ts',
    'src/modules/nic/naming/namingSchema.ts',
    'src/modules/nic/naming/namingData.ts',
    'src/modules/nic/services/nicNamingService.ts',
    'src/modules/nic/changelog.md'
  ],

  estruturasCompartilhadas: [
    'src/core/modules/module.types.ts',
    'components/Icon.tsx'
  ],

  fluxosPrincipais: [
    '1. Catálogo: visualizar todos os nomes registrados, com status, categoria e aliases.',
    '2. Busca e Filtro: encontrar nomes por termo ou status (aprovado, pendente, em ajuste).',
    '3. Aprovação: revisar nomes pendentes, aprovar ou pedir ajuste com observação.',
    '4. Conflitos: detectar e resolver nomes duplicados ou com grafias divergentes.',
    '5. Varredura: encontrar novos nomes candidatos em pastas do ecossistema.',
    '6. Histórico: registrar e consultar todas as decisões de curadoria.'
  ],

  pendenciasPrincipais: [
    'Persistir dados em Supabase (hoje usa dados mockados).',
    'Implementar varredura real de diretórios (hoje simulado).',
    'Conectar saída de decisões ao NAGI.',
    'Upload e integração com fontes externas de nomes (planilhas, documentos).'
  ]
};
