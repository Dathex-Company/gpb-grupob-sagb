import { METODOLOGIAS_MOCK } from '../data/metodologiasMock';
import { ENTRADAS_METODOLOGICAS_BRUTAS_MOCK } from '../data/entradasMetodologicasMock';
import type {
  AtivoEmEstruturacao,
  AtivoEmEstruturacaoPatch,
  AtivoMetodologicoEstadoGovernanca,
  AtivoMetodologicoHistoricoEventoTipo,
  AtivoMetodologicoPapelGovernanca,
  AtivoMetodologicoRelacaoTipo,
  AtivoMetodologicoTaxonomiaItem,
  AtivoMetodologicoTipo,
  AtivoMetodologicoVersaoStatus,
  ConversaoAssistidaResultado,
  ConversaoAssistidaAtivoPreview,
  ConversaoAssistidaStatusResultado,
  DiagnosticoEstruturacao,
  EntradaMetodologicaBruta,
  EntradaMetodologicaStatusEstruturacao,
  EntradaMetodologicaTipoDeEntrada,
  EstruturacaoAssistidaLeitura,
  EstruturacaoAssistidaPergunta,
  LacunaEstruturacao,
  LeituraVisualEstruturacao,
  MetodologiaMaturidadePratica,
  Metodologia,
  ProjecaoOperacionalTipo,
  MetodologiaStatusEditorial
} from '../types';

const TAXONOMIA_OFICIAL_ATIVOS: AtivoMetodologicoTaxonomiaItem[] = [
  {
    tipo: 'metodologia',
    label: 'Metodologia',
    descricao: 'Estrutura principal de método, com identidade, lógica e governança de evolução.'
  },
  {
    tipo: 'processo',
    label: 'Processo',
    descricao: 'Fluxo operacional organizado para conduzir execução em etapas e checkpoints claros.'
  },
  {
    tipo: 'protocolo',
    label: 'Protocolo',
    descricao: 'Regra ou padrão de execução e controle para preservar consistência operacional.'
  },
  {
    tipo: 'checklist',
    label: 'Checklist',
    descricao: 'Itemização prática para conferência, execução e redução de falhas recorrentes.'
  },
  {
    tipo: 'principio',
    label: 'Princípio',
    descricao: 'Fundamento orientador que sustenta decisões, desenho e uso dos demais ativos.'
  },
  {
    tipo: 'aplicacao',
    label: 'Aplicação',
    descricao: 'Uso contextual de um método ou estrutura em cenário real de operação.'
  },
  {
    tipo: 'ativo_derivado',
    label: 'Ativo Derivado',
    descricao: 'Material ou estrutura originada de outro ativo principal para uso especializado.'
  }
];

const STATUS_EDITORIAL_LABEL: Record<MetodologiaStatusEditorial, string> = {
  rascunho: 'Rascunho',
  em_estruturacao: 'Em elaboração',
  em_revisao: 'Em Revisão',
  aprovada: 'Aprovada',
  oficial: 'Oficial publicada',
  arquivada: 'Arquivada'
};

const MATURIDADE_PRATICA_LABEL: Record<MetodologiaMaturidadePratica, string> = {
  conceitual: 'Conceitual',
  modelada: 'Estruturada',
  testada: 'Testada na prática',
  validada: 'Validada pela equipe',
  escalavel: 'Pronta para escalar'
};

const ESTADO_GOVERNANCA_LABEL: Record<AtivoMetodologicoEstadoGovernanca, string> = {
  em_desenvolvimento: 'Em desenvolvimento',
  em_revisao: 'Em Revisão',
  oficial: 'Oficial',
  arquivado: 'Arquivado',
  obsoleto: 'Obsoleto'
};

const PAPEL_GOVERNANCA_LABEL: Record<AtivoMetodologicoPapelGovernanca, string> = {
  responsavel_principal: 'Responsável Principal',
  curador: 'Curador',
  revisor: 'Revisor',
  aprovador: 'Aprovador'
};

const TIPO_DE_ATIVO_LABEL: Record<AtivoMetodologicoTipo, string> = {
  metodologia: 'Metodologia',
  processo: 'Processo',
  protocolo: 'Protocolo',
  checklist: 'Checklist',
  principio: 'Princípio',
  aplicacao: 'Aplicação',
  ativo_derivado: 'Ativo Derivado'
};

const TIPO_RELACAO_LABEL: Record<AtivoMetodologicoRelacaoTipo, string> = {
  deriva_de: 'Deriva de',
  complementa: 'Complementa',
  depende_de: 'Depende de',
  substitui: 'Substitui',
  especializa: 'Especializa',
  simplifica: 'Simplifica',
  operacionaliza: 'Operacionaliza',
  usa_como_base: 'Usa como base'
};

const TIPO_PROJECAO_OPERACIONAL_LABEL: Record<ProjecaoOperacionalTipo, string> = {
  checklist_operacional: 'Checklist Operacional',
  playbook_operacional: 'Playbook Operacional',
  resumo_executivo: 'Resumo Executivo',
  roteiro_treinamento: 'Roteiro de Treinamento',
  guia_implantacao: 'Guia de Implantação',
  material_apoio: 'Material de Apoio',
  script_aplicacao: 'Script de Aplicação'
};

const VERSAO_STATUS_LABEL: Record<AtivoMetodologicoVersaoStatus, string> = {
  rascunho: 'Rascunho',
  vigente: 'Vigente',
  superada: 'Superada'
};

const HISTORICO_EVENTO_TIPO_LABEL: Record<AtivoMetodologicoHistoricoEventoTipo, string> = {
  criado: 'Criado',
  atualizado: 'Atualizado',
  enviado_para_revisao: 'Enviado para revisão',
  oficializado: 'Oficializado',
  arquivado: 'Arquivado',
  marcado_como_obsoleto: 'Marcado como obsoleto',
  aplicacao_registrada: 'Aplicação registrada',
  derivado_criado: 'Derivado criado',
  ativo_canonico_atualizado: 'Ativo canônico atualizado',
  bloco_canonico_atualizado: 'Bloco canônico atualizado',
  bloco_canonico_criado: 'Bloco canônico criado',
  bloco_canonico_removido: 'Bloco canônico removido',
  versao_canonica_criada: 'Versão canônica criada'
};

const TIPO_ENTRADA_BRUTA_LABEL: Record<EntradaMetodologicaTipoDeEntrada, string> = {
  ideia_crua: 'Ideia inicial',
  rascunho: 'Rascunho',
  texto_livre: 'Texto livre',
  bloco_doutrinario: 'Bloco de referência',
  resumo_pdf: 'Resumo de PDF',
  framework_parcial: 'Framework parcial',
  processo_difuso: 'Processo ainda difuso'
};

const STATUS_ESTRUTURACAO_LABEL: Record<EntradaMetodologicaStatusEstruturacao, string> = {
  bruto: 'Recebido',
  em_analise: 'Em análise',
  estruturado_parcialmente: 'Em construção',
  convertido_em_ativo: 'Virou metodologia'
};

const CONVERSAO_ASSISTIDA_STATUS_LABEL: Record<ConversaoAssistidaStatusResultado, string> = {
  ativo_em_estruturacao: 'Rascunho da metodologia',
  ativo_base_gerado: 'Base criada',
  pronto_para_revisao_manual: 'Pronto para revisão'
};

const LEITURA_VISUAL_ESTRUTURACAO_LABEL: Record<LeituraVisualEstruturacao, string> = {
  base_minima_preenchida: 'Campos obrigatórios preenchidos',
  ainda_faltam_definicoes: 'Ainda faltam informações',
  pronto_para_revisao_manual: 'Pronto para revisão'
};

const isTextoPreenchido = (valor?: string | null): boolean => {
  return typeof valor === 'string' && valor.trim().length > 0;
};

const calcularLacunasEstruturacao = (ativo: AtivoEmEstruturacao): LacunaEstruturacao[] => {
  const lacunas: LacunaEstruturacao[] = [];

  if (!isTextoPreenchido(ativo.definicao)) {
    lacunas.push({
      id: 'lacuna-definicao',
      tipo: 'falta_definicao',
      titulo: 'Falta definição',
      descricao: 'Defina com clareza o que o ativo é e qual fronteira semântica ele possui.',
      criticidade: 'alta'
    });
  }

  if (!isTextoPreenchido(ativo.objetivo)) {
    lacunas.push({
      id: 'lacuna-objetivo',
      tipo: 'falta_objetivo',
      titulo: 'Falta objetivo',
      descricao: 'Declare o resultado prático esperado para orientar revisão e aplicação.',
      criticidade: 'alta'
    });
  }

  if (!isTextoPreenchido(ativo.resumo)) {
    lacunas.push({
      id: 'lacuna-resumo',
      tipo: 'falta_resumo',
      titulo: 'Falta resumo',
      descricao: 'Registre um resumo curto para facilitar leitura rápida no fluxo de estruturação.',
      criticidade: 'media'
    });
  }

  if (!ativo.tipo_de_ativo) {
    lacunas.push({
      id: 'lacuna-tipo',
      tipo: 'falta_classificacao_tipo',
      titulo: 'Falta classificação de tipo',
      descricao: 'Classifique o ativo (metodologia, processo, protocolo, checklist, princípio, aplicação ou derivado).',
      criticidade: 'alta'
    });
  }

  if (!ativo.maturidade_pratica) {
    lacunas.push({
      id: 'lacuna-maturidade',
      tipo: 'falta_maturidade',
      titulo: 'Falta maturidade prática',
      descricao: 'Defina o estágio de maturidade para deixar explícito o nível de evolução do ativo.',
      criticidade: 'media'
    });
  }

  if (!ativo.governanca?.estado) {
    lacunas.push({
      id: 'lacuna-governanca',
      tipo: 'falta_governanca_minima',
      titulo: 'Falta governança mínima',
      descricao: 'Informe ao menos o estado de governança para não confundir estruturação com ativo final.',
      criticidade: 'alta'
    });
  }

  return lacunas;
};

const getProximoPassoEstruturacao = (lacunas: LacunaEstruturacao[]): string => {
  if (lacunas.some((lacuna) => lacuna.tipo === 'falta_definicao' || lacuna.tipo === 'falta_objetivo')) {
    return 'Completar definição e objetivo para consolidar a base semântica mínima do ativo em estruturação.';
  }

  if (lacunas.length > 0) {
    return 'Preencher lacunas pendentes e realizar nova revisão manual da estrutura sugerida.';
  }

  return 'Base mínima preenchida. Siga para revisão manual e refinamento editorial antes da consolidação.';
};

const getLeituraVisualEstruturacao = (
  lacunas: LacunaEstruturacao[],
  baseMinimaPreenchida: boolean
): LeituraVisualEstruturacao => {
  if (!baseMinimaPreenchida) {
    return 'ainda_faltam_definicoes';
  }

  if (lacunas.length > 0) {
    return 'base_minima_preenchida';
  }

  return 'pronto_para_revisao_manual';
};

const PERGUNTAS_ESTRUTURACAO_ASSISTIDA_BASE: EstruturacaoAssistidaPergunta[] = [
  {
    id: 'pergunta-01',
    titulo: 'O que isso parece ser?',
    descricao: 'Classifique provisoriamente entre metodologia, processo, protocolo, checklist, princípio, aplicação ou derivado.'
  },
  {
    id: 'pergunta-02',
    titulo: 'Qual é a essência disso?',
    descricao: 'Identifique a ideia central que precisa permanecer mesmo após evoluções de formato.'
  },
  {
    id: 'pergunta-03',
    titulo: 'Qual é o objetivo?',
    descricao: 'Defina o resultado prático esperado caso essa estrutura seja aplicada.'
  },
  {
    id: 'pergunta-04',
    titulo: 'Isso é fonte canônica ou desdobramento?',
    descricao: 'Diferencie se é um ativo-base do núcleo ou uma projeção operacional derivada.'
  },
  {
    id: 'pergunta-05',
    titulo: 'O que já está claro?',
    descricao: 'Liste elementos já identificados: contexto, hipótese, blocos, regras ou evidências.'
  },
  {
    id: 'pergunta-06',
    titulo: 'O que ainda falta definir?',
    descricao: 'Aponte lacunas de escopo, governança, critérios de sucesso e fronteiras semânticas.'
  },
  {
    id: 'pergunta-07',
    titulo: 'Próximo passo sugerido',
    descricao: 'Escolha a próxima ação mais simples para transformar material cru em ativo em estruturação.'
  }
];

const extrairTipoProvavel = (conteudoBruto: string): AtivoMetodologicoTipo | 'indefinido' => {
  const conteudo = conteudoBruto.toLowerCase();

  if (conteudo.includes('checklist')) return 'checklist';
  if (conteudo.includes('protocolo')) return 'protocolo';
  if (conteudo.includes('processo') || conteudo.includes('fluxo')) return 'processo';
  if (conteudo.includes('princípio') || conteudo.includes('principio')) return 'principio';
  if (conteudo.includes('aplicação') || conteudo.includes('aplicacao')) return 'aplicacao';
  if (conteudo.includes('derivado')) return 'ativo_derivado';
  if (conteudo.includes('metodologia') || conteudo.includes('framework')) return 'metodologia';

  return 'indefinido';
};

const extrairNatureza = (conteudoBruto: string): 'ativo_fonte' | 'desdobramento' | 'indefinido' => {
  const conteudo = conteudoBruto.toLowerCase();

  if (
    conteudo.includes('derivado') ||
    conteudo.includes('resumo') ||
    conteudo.includes('adaptação') ||
    conteudo.includes('adaptacao') ||
    conteudo.includes('operacional')
  ) {
    return 'desdobramento';
  }

  if (conteudo.includes('canônica') || conteudo.includes('canonica') || conteudo.includes('fonte') || conteudo.includes('base')) {
    return 'ativo_fonte';
  }

  return 'indefinido';
};

const normalizarSlug = (valor: string): string => {
  return valor
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const gerarResumoSugerido = (entrada: EntradaMetodologicaBruta): string => {
  const conteudo = entrada.conteudo_bruto.trim();
  if (conteudo.length <= 180) {
    return conteudo;
  }

  return `${conteudo.slice(0, 177).trim()}...`;
};

const resolveTipoParaConversao = (leitura: EstruturacaoAssistidaLeitura): AtivoMetodologicoTipo => {
  return leitura.tipo_mais_provavel === 'indefinido' ? 'metodologia' : leitura.tipo_mais_provavel;
};

export const gerarConversaoAssistidaDeEntrada = (
  entrada: EntradaMetodologicaBruta,
  modo: 'preview' | 'ativo_em_estruturacao' | 'ativo_base_gerado' = 'preview'
): ConversaoAssistidaResultado => {
  const leitura = getLeituraAssistidaInicial(entrada);
  const tipoDeAtivo = resolveTipoParaConversao(leitura);
  const nomeSugerido = entrada.titulo.trim();
  const resumoSugerido = gerarResumoSugerido(entrada);
  const definicaoSugerida =
    leitura.natureza === 'desdobramento'
      ? 'Estrutura derivada do insumo original para organizar aplicação prática sem perder referência de origem.'
      : 'Estrutura metodológica em consolidação originada de entrada bruta, ainda dependente de revisão manual.';
  const objetivoSugerido = leitura.objetivo;

  const statusResultado: ConversaoAssistidaStatusResultado =
    entrada.status_de_estruturacao === 'convertido_em_ativo'
      ? 'pronto_para_revisao_manual'
      : modo === 'ativo_base_gerado'
      ? 'ativo_base_gerado'
      : 'ativo_em_estruturacao';

  const statusEditorial: MetodologiaStatusEditorial =
    statusResultado === 'pronto_para_revisao_manual'
      ? 'em_revisao'
      : statusResultado === 'ativo_base_gerado'
      ? 'rascunho'
      : 'em_estruturacao';

  const maturidadePratica: MetodologiaMaturidadePratica =
    statusResultado === 'ativo_base_gerado' || statusResultado === 'pronto_para_revisao_manual' ? 'modelada' : 'conceitual';

  const estadoGovernanca: AtivoMetodologicoEstadoGovernanca =
    statusResultado === 'pronto_para_revisao_manual' ? 'em_revisao' : 'em_desenvolvimento';

  return {
    entrada_origem: entrada,
    leitura_inicial: leitura,
    status_resultado: statusResultado,
    sugestoes: {
      nome: nomeSugerido,
      resumo: resumoSugerido,
      tipo_de_ativo: tipoDeAtivo,
      definicao: definicaoSugerida,
      objetivo: objetivoSugerido
    },
    ativo_preview: {
      id_preview: `preview-${entrada.id}-${normalizarSlug(nomeSugerido) || 'ativo'}`,
      origem_entrada_id: entrada.id,
      origem_entrada_titulo: entrada.titulo,
      nome: nomeSugerido,
      resumo: resumoSugerido,
      tipo_de_ativo: tipoDeAtivo,
      definicao: definicaoSugerida,
      objetivo: objetivoSugerido,
      status_editorial: statusEditorial,
      maturidade_pratica: maturidadePratica,
      governanca: {
        estado: estadoGovernanca
      }
    },
    observacao_fluxo:
      statusResultado === 'pronto_para_revisao_manual'
        ? 'A entrada já aponta conversão anterior; o preview atual serve para revisão manual e rastreabilidade de origem.'
        : 'Conversão assistida local/mock: use o preview como base inicial, sem assumir ativo consolidado automaticamente.'
  };
};

export const criarAtivoEmEstruturacaoFromPreview = (
  preview: ConversaoAssistidaAtivoPreview
): AtivoEmEstruturacao => {
  const agora = new Date().toISOString();

  return {
    id_estruturacao: `estr-${preview.id_preview}`,
    origem_preview_id: preview.id_preview,
    origem_entrada_id: preview.origem_entrada_id,
    origem_entrada_titulo: preview.origem_entrada_titulo,
    etapa_fluxo: 'edicao_guiada',
    nome: preview.nome,
    resumo: preview.resumo,
    tipo_de_ativo: preview.tipo_de_ativo,
    definicao: preview.definicao,
    objetivo: preview.objetivo,
    status_editorial: preview.status_editorial,
    maturidade_pratica: preview.maturidade_pratica,
    governanca: {
      estado: preview.governanca.estado
    },
    created_at: agora,
    updated_at: agora
  };
};

export const atualizarAtivoEmEstruturacaoLocal = (
  ativo: AtivoEmEstruturacao,
  patch: AtivoEmEstruturacaoPatch
): AtivoEmEstruturacao => {
  return {
    ...ativo,
    ...patch,
    governanca: {
      estado: patch.governanca?.estado ?? ativo.governanca.estado
    },
    etapa_fluxo: 'edicao_guiada',
    updated_at: new Date().toISOString()
  };
};

export const diagnosticarAtivoEmEstruturacao = (ativo: AtivoEmEstruturacao): DiagnosticoEstruturacao => {
  const checks = [
    { preenchido: isTextoPreenchido(ativo.nome) },
    { preenchido: isTextoPreenchido(ativo.resumo) },
    { preenchido: !!ativo.tipo_de_ativo },
    { preenchido: isTextoPreenchido(ativo.definicao) },
    { preenchido: isTextoPreenchido(ativo.objetivo) },
    { preenchido: !!ativo.status_editorial },
    { preenchido: !!ativo.maturidade_pratica },
    { preenchido: !!ativo.governanca?.estado }
  ];

  const totalCamposMonitorados = checks.length;
  const camposPreenchidos = checks.filter((item) => item.preenchido).length;
  const camposPendentes = totalCamposMonitorados - camposPreenchidos;
  const percentualPreenchimento = Math.round((camposPreenchidos / totalCamposMonitorados) * 100);

  const lacunas = calcularLacunasEstruturacao(ativo);
  const baseMinimaPreenchida =
    lacunas.find((lacuna) => lacuna.tipo === 'falta_definicao') === undefined &&
    lacunas.find((lacuna) => lacuna.tipo === 'falta_objetivo') === undefined &&
    lacunas.find((lacuna) => lacuna.tipo === 'falta_resumo') === undefined &&
    lacunas.find((lacuna) => lacuna.tipo === 'falta_classificacao_tipo') === undefined &&
    lacunas.find((lacuna) => lacuna.tipo === 'falta_maturidade') === undefined &&
    lacunas.find((lacuna) => lacuna.tipo === 'falta_governanca_minima') === undefined;

  const leituraVisual = getLeituraVisualEstruturacao(lacunas, baseMinimaPreenchida);

  return {
    total_campos_monitorados: totalCamposMonitorados,
    campos_preenchidos: camposPreenchidos,
    campos_pendentes: camposPendentes,
    percentual_preenchimento: percentualPreenchimento,
    base_minima_preenchida: baseMinimaPreenchida,
    leitura_visual: leituraVisual,
    lacunas,
    proximo_passo_sugerido: getProximoPassoEstruturacao(lacunas)
  };
};

export const getLeituraVisualEstruturacaoLabel = (leitura: LeituraVisualEstruturacao): string => {
  return LEITURA_VISUAL_ESTRUTURACAO_LABEL[leitura];
};

export const getMetodologias = (): Metodologia[] => {
  return METODOLOGIAS_MOCK;
};

export const getEntradasMetodologicasBrutas = (): EntradaMetodologicaBruta[] => {
  return ENTRADAS_METODOLOGICAS_BRUTAS_MOCK;
};

export const getTaxonomiaOficialAtivos = (): AtivoMetodologicoTaxonomiaItem[] => {
  return TAXONOMIA_OFICIAL_ATIVOS;
};

export const getTipoDeAtivoLabel = (tipo: AtivoMetodologicoTipo): string => {
  return TIPO_DE_ATIVO_LABEL[tipo];
};

export const getTipoEntradaBrutaLabel = (tipo: EntradaMetodologicaTipoDeEntrada): string => {
  return TIPO_ENTRADA_BRUTA_LABEL[tipo];
};

export const getStatusEstruturacaoLabel = (status: EntradaMetodologicaStatusEstruturacao): string => {
  return STATUS_ESTRUTURACAO_LABEL[status];
};

export const getStatusConversaoAssistidaLabel = (status: ConversaoAssistidaStatusResultado): string => {
  return CONVERSAO_ASSISTIDA_STATUS_LABEL[status];
};

export const getPerguntasEstruturacaoAssistida = (): EstruturacaoAssistidaPergunta[] => {
  return PERGUNTAS_ESTRUTURACAO_ASSISTIDA_BASE;
};

export const getLeituraAssistidaInicial = (entrada: EntradaMetodologicaBruta): EstruturacaoAssistidaLeitura => {
  const conteudo = entrada.conteudo_bruto;
  const tipoMaisProvavel = extrairTipoProvavel(conteudo);
  const natureza = extrairNatureza(conteudo);

  return {
    o_que_parece_ser:
      tipoMaisProvavel === 'indefinido'
        ? 'Material metodológico inicial ainda sem tipagem clara, pedindo lapidação semântica.'
        : `Sinal inicial de ${getTipoDeAtivoLabel(tipoMaisProvavel).toLowerCase()} em construção.` ,
    tipo_mais_provavel: tipoMaisProvavel,
    natureza,
    essencia: 'Organizar uma ideia inicial em estrutura metodológica legível, rastreável e governável.',
    objetivo:
      'Sair do material cru para um ativo em estruturação com definição, objetivo, tipagem e próximo passo explícitos.',
    o_que_ja_esta_claro: [
      `Existe insumo registrado com origem: ${entrada.origem}.`,
      `Título inicial definido: ${entrada.titulo}.`,
      'Há conteúdo suficiente para abrir análise guiada por perguntas estruturantes.'
    ],
    o_que_ainda_falta: [
      'Definir fronteira semântica (é metodologia, processo, protocolo, checklist, princípio, aplicação ou derivado).',
      'Determinar se o insumo é ativo-fonte ou desdobramento operacional.',
      'Consolidar critérios mínimos para converter em ativo estruturado no catálogo.'
    ],
    proximo_passo_sugerido:
      entrada.status_de_estruturacao === 'convertido_em_ativo'
        ? 'Mapear vínculo entre a entrada original e o ativo consolidado para rastreabilidade histórica.'
        : 'Conduzir rodada curta de estruturação: essência + objetivo + tipagem + natureza (fonte/desdobramento).'
  };
};

export const getAtivosByTipo = (tipo: AtivoMetodologicoTipo | 'todos'): Metodologia[] => {
  if (tipo === 'todos') {
    return METODOLOGIAS_MOCK;
  }

  return METODOLOGIAS_MOCK.filter((ativo) => ativo.tipo_de_ativo === tipo);
};

export const getAtivoById = (ativoId: string): Metodologia | undefined => {
  return METODOLOGIAS_MOCK.find((ativo) => ativo.id === ativoId);
};

export const getAtivoBySlug = (slug: string): Metodologia | undefined => {
  return METODOLOGIAS_MOCK.find((ativo) => ativo.slug === slug);
};

export const getNomeAtivoById = (ativoId: string): string => {
  return getAtivoById(ativoId)?.nome ?? ativoId;
};

export const getTipoRelacaoLabel = (tipoRelacao: AtivoMetodologicoRelacaoTipo): string => {
  return TIPO_RELACAO_LABEL[tipoRelacao];
};

export const getTipoProjecaoOperacionalLabel = (tipoProjecao: ProjecaoOperacionalTipo): string => {
  return TIPO_PROJECAO_OPERACIONAL_LABEL[tipoProjecao];
};

export const getStatusEditorialLabel = (status: MetodologiaStatusEditorial): string => {
  return STATUS_EDITORIAL_LABEL[status];
};

export const getMaturidadePraticaLabel = (maturidade: MetodologiaMaturidadePratica): string => {
  return MATURIDADE_PRATICA_LABEL[maturidade];
};

export const getEstadoGovernancaLabel = (estado: AtivoMetodologicoEstadoGovernanca): string => {
  return ESTADO_GOVERNANCA_LABEL[estado];
};

export const getPapelGovernancaLabel = (papel: AtivoMetodologicoPapelGovernanca): string => {
  return PAPEL_GOVERNANCA_LABEL[papel];
};

export const getVersaoStatusLabel = (status: AtivoMetodologicoVersaoStatus): string => {
  return VERSAO_STATUS_LABEL[status];
};

export const getHistoricoEventoTipoLabel = (tipo: AtivoMetodologicoHistoricoEventoTipo): string => {
  return HISTORICO_EVENTO_TIPO_LABEL[tipo];
};

export const getVersaoVigente = (ativo: Metodologia) => {
  return ativo.versoes_oficiais?.find((versao) => versao.status_da_versao === 'vigente') ?? null;
};
