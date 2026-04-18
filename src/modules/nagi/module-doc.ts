export const moduleDoc = {
  nomeOficial: 'NAGI (Núcleo de Apoio à Gestão Inteligente)',
  objetivo:
    'Organizar, comunicar e priorizar o portfólio de iniciativas estratégicas relacionadas à inteligência aplicada no ecossistema SagB.',
  responsavelTecnico: 'A DEFINIR',
  status: 'Em estruturação',
  tipo: 'Módulo Oficial',

  tabelasSupabase: [
    'supabase/migrations/20260313000102_nagi_radar_core.sql (base preparada para evolução futura)'
  ],

  bucketsStorage: [
    'Não é storage primário; consome e governa informações produzidas por outras camadas'
  ],

  integracoes: [
    'CID (fonte documental estratégica)',
    'NIC (camada interpretativa)',
    'Memória Contínua (fonte operacional)',
    'Governança (políticas e decisões)',
    'Fluxo de Inteligência (saídas e acompanhamento futuro)'
  ],

  estruturasExclusivas: [
    'src/modules/nagi/pages/NAGIPage.tsx',
    'src/modules/nagi/components/NAGIView.tsx',
    'src/modules/nagi/agent/owner.md',
    'src/modules/nagi/agent/persona.md',
    'src/modules/nagi/changelog.md',
    'src/modules/nagi/docs/inputs/'
  ],

  estruturasCompartilhadas: [
    'types.ts (TabId: nagi)',
    'App.tsx',
    'components/Sidebar.tsx'
  ],

  fluxosPrincipais: [
    '1. Abrir o portfólio NAGI e visualizar iniciativas, status e maturidade.',
    '2. Navegar pelas frentes estratégicas e seus vínculos com módulos reais do SagB.',
    '3. Receber saídas estratégicas de módulos como NIC e CID para priorização futura.',
    '4. Servir como camada de governança e portfólio para iniciativas em teste, estruturação e produto futuro.'
  ],

  pendenciasPrincipais: [
    'Migrar dados estáticos do NAGI para estrutura persistente quando a frente amadurecer.',
    'Definir owner principal e backup com nomeação formal.',
    'Criar integração viva com NIC para recebimento de saídas estratégicas.',
    'Separar com mais clareza iniciativas conceituais de módulos já operacionais.',
    'Definir histórico persistente e critérios formais de maturidade do portfólio.'
  ]
};
