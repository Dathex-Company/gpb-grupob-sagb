/* ============================================================
 *  Dados de demonstração — Catálogo de Nomes do Ecossistema
 *  Apenas para validação visual. Produção usará dados reais.
 * ============================================================ */

import { NamingItem, NamingConflict, NamingDecision, NamingScanResult } from './namingSchema';

export const mockNames: NamingItem[] = [
  {
    id: 'n1',
    nomeOficial: 'GrupoB',
    slugSistema: 'grupob',
    categoria: 'empresa',
    pilar: 'Holding',
    empresaVinculada: 'GrupoB',
    status: 'aprovado',
    aliases: ['GB', 'Grupo B', 'Grupo_B'],
    tags: ['holding', 'governanca', 'ecossistema'],
    origem: 'Documento Fundador',
    anotacoes: 'Nome oficial da holding. Usar sempre GrupoB (sem espaço) em sistemas.',
    dataCriacao: '2024-01-15',
    ultimaAtualizacao: '2026-05-20',
    aprovadoPor: 'Mesa de Decisão'
  },
  {
    id: 'n2',
    nomeOficial: 'StartyB',
    slugSistema: 'startyb',
    categoria: 'empresa',
    pilar: 'Venture Building',
    empresaVinculada: 'StartyB',
    status: 'aprovado',
    aliases: ['Starty B', 'Starty_B', 'SB'],
    tags: ['venture', 'negocios', 'estruturacao'],
    origem: 'Plano de Negócio StartyB',
    anotacoes: 'Venture builder do ecossistema. Evitar usar "Starty B" separado.',
    dataCriacao: '2024-03-10',
    ultimaAtualizacao: '2026-04-18',
    aprovadoPor: 'Cesar Tulli'
  },
  {
    id: 'n3',
    nomeOficial: '3forB',
    slugSistema: '3forb',
    categoria: 'empresa',
    pilar: 'Marketing e Vendas',
    empresaVinculada: '3forB',
    status: 'aprovado',
    aliases: ['3 For B', '3ForB', '3FB'],
    tags: ['marketing', 'vendas', 'performance'],
    origem: 'Documento Comercial',
    anotacoes: 'Marca de marketing e vendas. Sempre usar 3forB com minúsculo e B maiúsculo.',
    dataCriacao: '2024-05-22',
    ultimaAtualizacao: '2026-05-10',
    aprovadoPor: 'Mesa de Decisão'
  },
  {
    id: 'n4',
    nomeOficial: 'AcadB',
    slugSistema: 'acadb',
    categoria: 'empresa',
    pilar: 'Educação',
    empresaVinculada: 'AcadB',
    status: 'aprovado',
    aliases: ['Acad B', 'AcademyB', 'Academia B'],
    tags: ['educacao', 'cursos', 'capacitacao'],
    origem: 'Documento AcadB',
    anotacoes: 'Marca de educação do grupo. Sempre AcadB com d no final.',
    dataCriacao: '2024-08-05',
    ultimaAtualizacao: '2026-03-22',
    aprovadoPor: 'Mesa de Decisão'
  },
  {
    id: 'n5',
    nomeOficial: 'Método T.R.A.T.O.',
    slugSistema: 'trato',
    categoria: 'metodo',
    pilar: 'Metodologias',
    empresaVinculada: '3forB',
    status: 'aprovado',
    aliases: ['TRATO', 'Trato', 'T.R.A.T.O'],
    tags: ['metodo', 'comercial', 'vendas'],
    origem: 'Documento TRATO Oficial V.1',
    anotacoes: 'Metodologia proprietária. Usar sempre T.R.A.T.O. com pontos na versão formal.',
    dataCriacao: '2025-07-03',
    ultimaAtualizacao: '2026-02-14',
    aprovadoPor: 'Time Comercial'
  },
  {
    id: 'n6',
    nomeOficial: 'Núcleo de Inteligência Conectiva',
    slugSistema: 'nic',
    categoria: 'modulo',
    pilar: 'Tecnologia',
    empresaVinculada: 'SagB',
    status: 'aprovado',
    aliases: ['NIC', 'NI Conectiva'],
    tags: ['modulo', 'inteligencia', 'conectividade'],
    origem: 'Arquitetura SagB',
    anotacoes: 'Módulo de inteligência conectiva do SagB. Sigla é NIC.',
    dataCriacao: '2026-01-20',
    ultimaAtualizacao: '2026-05-25',
    aprovadoPor: 'Time de Produto'
  },
  {
    id: 'n7',
    nomeOficial: 'Loze',
    slugSistema: 'loze',
    categoria: 'iniciativa',
    pilar: 'Ventures',
    empresaVinculada: 'StartyB',
    status: 'pendente',
    aliases: ['LOZE', 'Lozé', 'loze.ai'],
    tags: ['venture', 'analise'],
    origem: 'Documento Loze',
    anotacoes: 'Iniciativa em validação. Pendente de aprovação do nome oficial.',
    dataCriacao: '2026-04-01',
    ultimaAtualizacao: '2026-04-01'
  },
  {
    id: 'n8',
    nomeOficial: 'Gluh People',
    slugSistema: 'gluh_people',
    categoria: 'produto',
    pilar: 'Produtos Digitais',
    empresaVinculada: '3forB',
    status: 'em_ajuste',
    aliases: ['Gluh', 'GLUH', 'GluhPeople'],
    tags: ['produto', 'rh', 'pessoas'],
    origem: 'Sistema Gluh',
    anotacoes: 'Sistema de gestão de pessoas. Precisa de ajuste no slug (gluh_people vs gluh-people).',
    dataCriacao: '2025-11-10',
    ultimaAtualizacao: '2026-05-28'
  },
  {
    id: 'n9',
    nomeOficial: 'CID — Central de Inteligência de Dados',
    slugSistema: 'cid',
    categoria: 'modulo',
    pilar: 'Tecnologia',
    empresaVinculada: 'SagB',
    status: 'aprovado',
    aliases: ['C.I.D.', 'CID'],
    tags: ['modulo', 'dados', 'inteligencia'],
    origem: 'Arquitetura SagB',
    anotacoes: 'Módulo de dados do SagB. Sigla oficial: CID.',
    dataCriacao: '2026-02-10',
    ultimaAtualizacao: '2026-05-15',
    aprovadoPor: 'Time de Produto'
  },
  {
    id: 'n10',
    nomeOficial: 'NAGI',
    slugSistema: 'nagi',
    categoria: 'modulo',
    pilar: 'Tecnologia',
    empresaVinculada: 'SagB',
    status: 'aprovado',
    aliases: ['N.A.G.I.', 'Nagi Radar'],
    tags: ['modulo', 'governanca', 'decisao'],
    origem: 'Arquitetura SagB',
    anotacoes: 'Módulo de governança e radar do SagB.',
    dataCriacao: '2026-02-10',
    ultimaAtualizacao: '2026-05-18',
    aprovadoPor: 'Time de Produto'
  }
];

export const mockConflicts: NamingConflict[] = [
  {
    id: 'c1',
    nomeA: 'Gluh People',
    nomeB: 'Gluh',
    tipoConflito: 'alias_duplicado',
    descricao: '"Gluh" é usado como alias e também como nome principal de outro sistema.',
    status: 'aberto',
  },
  {
    id: 'c2',
    nomeA: 'T.R.A.T.O.',
    nomeB: 'Trato',
    tipoConflito: 'grafia_diferente',
    descricao: 'Duas grafias diferentes circulando: T.R.A.T.O. (formal) e Trato (informal).',
    status: 'resolvido',
    resolvidoEm: '2026-04-10',
    resolvidoPor: 'Mesa de Decisão',
    decisao: 'Manter T.R.A.T.O. como oficial e Trato como alias informal aprovado.'
  },
  {
    id: 'c3',
    nomeA: 'StartyB',
    nomeB: 'Starty B',
    tipoConflito: 'nome_repetido',
    descricao: '"Starty B" aparece em documentos comerciais como nome separado.',
    status: 'aberto',
  }
];

export const mockDecisions: NamingDecision[] = [
  {
    id: 'd1',
    itemId: 'n1',
    decisao: 'aprovado',
    justificativa: 'Nome oficial consolidado desde a fundação. Sem necessidade de ajuste.',
    decididoPor: 'Mesa de Decisão',
    data: '2024-01-20'
  },
  {
    id: 'd2',
    itemId: 'n5',
    decisao: 'aprovado',
    justificativa: 'Metodologia registrada com grafia formal T.R.A.T.O. Alias Trato liberado para uso interno.',
    decididoPor: 'Time Comercial',
    data: '2025-07-10'
  },
  {
    id: 'd3',
    itemId: 'n8',
    decisao: 'ajustar',
    justificativa: 'Slug precisa ser padronizado. Recomendo usar hífen (gluh-people) em vez de underscore.',
    decididoPor: 'Time de Produto',
    data: '2026-05-28'
  },
  {
    id: 'd4',
    itemId: 'n7',
    decisao: 'recusado',
    justificativa: 'Nome "Loze" precisa de validação com o venture lead antes de aprovar.',
    decididoPor: 'Mesa de Decisão',
    data: '2026-04-05'
  }
];

export const mockScanResults: NamingScanResult[] = [
  {
    nome: 'PapoB',
    arquivo: '01_empresas_b/papob/README.md',
    projeto: 'PapoB',
    confianca: 'alta',
    sugestaoCategoria: 'empresa',
    jaCatalogado: false
  },
  {
    nome: 'InstitutoB',
    arquivo: '01_empresas_b/institutob/documentos/missao.md',
    projeto: 'InstitutoB',
    confianca: 'alta',
    sugestaoCategoria: 'empresa',
    jaCatalogado: false
  },
  {
    nome: 'SagB',
    arquivo: 'SagB/package.json',
    projeto: 'SagB',
    confianca: 'alta',
    sugestaoCategoria: 'modulo',
    jaCatalogado: false
  },
  {
    nome: 'AceleraB',
    arquivo: '01_empresas_b/acelerab/99_triagem/01_compilado_bruto_existente.md',
    proyecto: 'AceleraB',
    confianca: 'alta',
    sugestaoCategoria: 'empresa',
    jaCatalogado: false
  },
  {
    nome: 'TIVAC',
    arquivo: '03_metodos/tivac/99_triagem/01_compilado_bruto_existente.md',
    projeto: 'TIVAC',
    confianca: 'media',
    sugestaoCategoria: 'metodo',
    jaCatalogado: false
  },
  {
    nome: 'TCADI',
    arquivo: '03_metodos/tcadi/99_triagem/01_compilado_bruto_existente.md',
    projeto: 'TCADI',
    confianca: 'media',
    sugestaoCategoria: 'metodo',
    jaCatalogado: false
  },
  {
    nome: 'TaskZei',
    arquivo: 'SagB/src/modules/taskzei',
    projeto: 'TaskZei',
    confianca: 'alta',
    sugestaoCategoria: 'modulo',
    jaCatalogado: false
  },
  {
    nome: '3forB',
    arquivo: '01_empresas_b/3forb/_clientes_ativos/',
    projeto: '3forB',
    confianca: 'alta',
    sugestaoCategoria: 'empresa',
    jaCatalogado: true
  }
];
