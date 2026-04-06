export type MetodologiaStatusEditorial =
  | 'rascunho'
  | 'em_estruturacao'
  | 'em_revisao'
  | 'aprovada'
  | 'oficial'
  | 'arquivada';

export type MetodologiaMaturidadePratica =
  | 'conceitual'
  | 'modelada'
  | 'testada'
  | 'validada'
  | 'escalavel';

export type AtivoMetodologicoEstadoGovernanca =
  | 'em_desenvolvimento'
  | 'em_revisao'
  | 'oficial'
  | 'arquivado'
  | 'obsoleto';

export type AtivoMetodologicoPapelGovernanca =
  | 'responsavel_principal'
  | 'curador'
  | 'revisor'
  | 'aprovador';

export type AtivoMetodologicoVersaoStatus = 'rascunho' | 'vigente' | 'superada';

export interface AtivoMetodologicoVersaoOficial {
  id: string;
  ativo_id: string;
  numero_versao: string;
  titulo?: string;
  resumo_da_versao: string;
  status_da_versao: AtivoMetodologicoVersaoStatus;
  publicada_em: string;
  observacao?: string;
}

export type AtivoMetodologicoHistoricoEventoTipo =
  | 'criado'
  | 'atualizado'
  | 'enviado_para_revisao'
  | 'oficializado'
  | 'arquivado'
  | 'marcado_como_obsoleto'
  | 'aplicacao_registrada'
  | 'derivado_criado'
  | 'ativo_canonico_atualizado'
  | 'bloco_canonico_atualizado'
  | 'bloco_canonico_criado'
  | 'bloco_canonico_removido'
  | 'versao_canonica_criada';

export interface AtivoMetodologicoHistoricoEvento {
  id: string;
  ativo_id: string;
  tipo_de_evento: AtivoMetodologicoHistoricoEventoTipo;
  descricao: string;
  ocorrido_em: string;
  observacao?: string;
}

export type AtivoMetodologicoTipo =
  | 'metodologia'
  | 'processo'
  | 'protocolo'
  | 'checklist'
  | 'principio'
  | 'aplicacao'
  | 'ativo_derivado';

export type ProjecaoOperacionalTipo =
  | 'checklist_operacional'
  | 'playbook_operacional'
  | 'resumo_executivo'
  | 'roteiro_treinamento'
  | 'guia_implantacao'
  | 'material_apoio'
  | 'script_aplicacao';

export const PROJECAO_OPERACIONAL_TIPOS: ProjecaoOperacionalTipo[] = [
  'checklist_operacional',
  'playbook_operacional',
  'resumo_executivo',
  'roteiro_treinamento',
  'guia_implantacao',
  'material_apoio',
  'script_aplicacao'
];

export const ATIVO_METODOLOGICO_TIPOS: AtivoMetodologicoTipo[] = [
  'metodologia',
  'processo',
  'protocolo',
  'checklist',
  'principio',
  'aplicacao',
  'ativo_derivado'
];

export interface AtivoMetodologicoTaxonomiaItem {
  tipo: AtivoMetodologicoTipo;
  label: string;
  descricao: string;
}

export type MetodologiaBlocoTipo = 'essencia' | 'estrutura' | 'aplicacao' | 'governanca';

export interface MetodologiaBlocoBase {
  id: string;
  tipo: MetodologiaBlocoTipo;
  titulo: string;
  resumo: string;
}

export interface MetodologiaRelacaoRef {
  metodologia_id: string;
  tipo_relacao: string;
}

export type AtivoMetodologicoRelacaoTipo =
  | 'deriva_de'
  | 'complementa'
  | 'depende_de'
  | 'substitui'
  | 'especializa'
  | 'simplifica'
  | 'operacionaliza'
  | 'usa_como_base';

export interface AtivoMetodologicoRelacao {
  id: string;
  tipo_de_relacao: AtivoMetodologicoRelacaoTipo;
  ativo_origem_id: string;
  ativo_destino_id: string;
  observacao?: string;
}

export interface AtivoMetodologicoEvidenciaAplicacao {
  id: string;
  ativo_id: string;
  contexto: string;
  aplicado_em: string;
  descricao: string;
  resultado_percebido: string;
  aprendizados: string;
  validou_ativo?: boolean;
  observacao?: string;
}

export interface AtivoDerivado {
  id: string;
  ativo_origem_id: string;
  tipo_de_projecao: ProjecaoOperacionalTipo;
  nome: string;
  resumo: string;
  objetivo: string;
  status_editorial?: MetodologiaStatusEditorial;
  versao_atual: string;
  created_at: string;
  updated_at: string;
  observacao?: string;
}

export interface MetodologiaAgenteRef {
  agente_id: string;
  papel: string;
}

export interface AtivoMetodologicoResponsavelGovernanca {
  id: string;
  nome: string;
  papel: AtivoMetodologicoPapelGovernanca;
}

export interface AtivoMetodologicoGovernanca {
  estado_ciclo_vida: AtivoMetodologicoEstadoGovernanca;
  responsaveis: AtivoMetodologicoResponsavelGovernanca[];
  oficializado_em?: string;
  arquivado_em?: string;
  motivo_arquivamento?: string;
  substituido_por_ativo_id?: string;
  observacao?: string;
}

export interface Metodologia {
  id: string;
  tipo_de_ativo: AtivoMetodologicoTipo;
  nome: string;
  slug: string;
  resumo: string;
  definicao: string;
  objetivo: string;
  status_editorial: MetodologiaStatusEditorial;
  maturidade_pratica: MetodologiaMaturidadePratica;
  governanca: AtivoMetodologicoGovernanca;
  versao_atual: string;
  created_at: string;
  updated_at: string;
  blocos_base: MetodologiaBlocoBase[];
  blocos_canonicos?: AtivoCanonicoBloco[];

  versoes_oficiais?: AtivoMetodologicoVersaoOficial[];
  historico_estruturado?: AtivoMetodologicoHistoricoEvento[];

  // Preparação para evolução futura (ETs seguintes)
  /** @deprecated substituído por versoes_oficiais */
  versoes_ids?: string[];
  /** @deprecated substituído por historico_estruturado */
  historico_ids?: string[];
  /** @deprecated manter apenas por compatibilidade transitória */
  aplicacoes_ids?: string[];
  /** @deprecated substituído por relacoes_ativos */
  relacoes?: MetodologiaRelacaoRef[];
  relacoes_ativos?: AtivoMetodologicoRelacao[];
  evidencias_aplicacao?: AtivoMetodologicoEvidenciaAplicacao[];
  ativos_derivados?: AtivoDerivado[];
  agentes_vinculados?: MetodologiaAgenteRef[];
}

export interface MetodologiasOverview {
  titulo: string;
  subtitulo: string;
  descricao: string;
  taxonomia_oficial: AtivoMetodologicoTaxonomiaItem[];
  metodologias: Metodologia[];
  entradas_brutas: EntradaMetodologicaBruta[];
  metodologia_destaque: Metodologia | null;
}

export type EntradaMetodologicaTipoDeEntrada =
  | 'ideia_crua'
  | 'rascunho'
  | 'texto_livre'
  | 'bloco_doutrinario'
  | 'resumo_pdf'
  | 'framework_parcial'
  | 'processo_difuso';

export type EntradaMetodologicaStatusEstruturacao =
  | 'bruto'
  | 'em_analise'
  | 'estruturado_parcialmente'
  | 'convertido_em_ativo';

export interface EntradaMetodologicaBruta {
  id: string;
  titulo: string;
  tipo_de_entrada: EntradaMetodologicaTipoDeEntrada;
  conteudo_bruto: string;
  origem: string;
  status_de_estruturacao: EntradaMetodologicaStatusEstruturacao;
  created_at: string;
  updated_at: string;
}

export interface EstruturacaoAssistidaPergunta {
  id: string;
  titulo: string;
  descricao: string;
}

export interface EstruturacaoAssistidaLeitura {
  o_que_parece_ser: string;
  tipo_mais_provavel: AtivoMetodologicoTipo | 'indefinido';
  natureza: 'ativo_fonte' | 'desdobramento' | 'indefinido';
  essencia: string;
  objetivo: string;
  o_que_ja_esta_claro: string[];
  o_que_ainda_falta: string[];
  proximo_passo_sugerido: string;
}

export type ConversaoAssistidaStatusResultado =
  | 'ativo_em_estruturacao'
  | 'ativo_base_gerado'
  | 'pronto_para_revisao_manual';

export interface ConversaoAssistidaSugestoes {
  nome: string;
  resumo: string;
  tipo_de_ativo: AtivoMetodologicoTipo;
  definicao: string;
  objetivo: string;
}

export interface ConversaoAssistidaAtivoPreview {
  id_preview: string;
  origem_entrada_id: string;
  origem_entrada_titulo: string;
  nome: string;
  resumo: string;
  tipo_de_ativo: AtivoMetodologicoTipo;
  definicao: string;
  objetivo: string;
  status_editorial: MetodologiaStatusEditorial;
  maturidade_pratica: MetodologiaMaturidadePratica;
  governanca: {
    estado: AtivoMetodologicoEstadoGovernanca;
  };
}

export interface ConversaoAssistidaResultado {
  entrada_origem: EntradaMetodologicaBruta;
  leitura_inicial: EstruturacaoAssistidaLeitura;
  status_resultado: ConversaoAssistidaStatusResultado;
  sugestoes: ConversaoAssistidaSugestoes;
  ativo_preview: ConversaoAssistidaAtivoPreview;
  observacao_fluxo: string;
}

export type LeituraVisualEstruturacao =
  | 'base_minima_preenchida'
  | 'ainda_faltam_definicoes'
  | 'pronto_para_revisao_manual';

export type AtivoEmEstruturacaoEtapaFluxo =
  | 'preview_gerado'
  | 'edicao_guiada'
  | 'pronto_para_revisao_manual';

export type AtivoEmEstruturacaoBlocoTipo =
  | 'essencia'
  | 'principio'
  | 'etapa'
  | 'regra'
  | 'aplicacao'
  | 'checklist'
  | 'observacao_estrutural';

export const ATIVO_EM_ESTRUTURACAO_BLOCO_TIPOS: AtivoEmEstruturacaoBlocoTipo[] = [
  'essencia',
  'principio',
  'etapa',
  'regra',
  'aplicacao',
  'checklist',
  'observacao_estrutural'
];

export type AtivoEmEstruturacaoBlocoStatus = 'rascunho' | 'ativo' | 'arquivado';

export interface AtivoEmEstruturacaoBlocoInterno {
  id: string;
  ativo_em_estruturacao_id: string;
  tipo_de_bloco: AtivoEmEstruturacaoBlocoTipo;
  titulo: string;
  conteudo: string;
  ordem: number;
  status_do_bloco: AtivoEmEstruturacaoBlocoStatus;
  created_at: string;
  updated_at: string;
}

export interface AtivoEmEstruturacaoBlocoInternoInput {
  tipo_de_bloco: AtivoEmEstruturacaoBlocoTipo;
  titulo: string;
  conteudo: string;
  ordem?: number;
  status_do_bloco?: AtivoEmEstruturacaoBlocoStatus;
}

export interface AtivoEmEstruturacaoBlocoInternoPatch {
  tipo_de_bloco?: AtivoEmEstruturacaoBlocoTipo;
  titulo?: string;
  conteudo?: string;
  ordem?: number;
  status_do_bloco?: AtivoEmEstruturacaoBlocoStatus;
}

export type AtivoCanonicoBlocoTipo = AtivoEmEstruturacaoBlocoTipo;

export type AtivoCanonicoBlocoStatus = AtivoEmEstruturacaoBlocoStatus;

export type AtivoCanonicoVersaoStatus = 'vigente' | 'superada' | 'rascunho';

export interface AtivoCanonicoVersaoSnapshotBloco {
  bloco_origem_estruturacao_id: string;
  tipo_de_bloco: AtivoCanonicoBlocoTipo;
  titulo: string;
  conteudo: string;
  ordem: number;
  status_do_bloco: AtivoCanonicoBlocoStatus;
}

export interface AtivoCanonicoVersaoSnapshot {
  nome: string;
  resumo: string;
  definicao: string;
  objetivo: string;
  tipo_de_ativo: AtivoMetodologicoTipo;
  status_editorial: MetodologiaStatusEditorial;
  maturidade_pratica: MetodologiaMaturidadePratica;
  governanca_estado: AtivoMetodologicoEstadoGovernanca;
  blocos: AtivoCanonicoVersaoSnapshotBloco[];
  meta?: {
    formato_versao: string;
    gerado_em: string;
    total_blocos: number;
    total_campos_base: number;
  };
}

export type SnapshotCanonicoStatus = 'ausente' | 'integro' | 'incompleto' | 'incompativel';

export interface IntegridadeSnapshotCanonico {
  status: SnapshotCanonicoStatus;
  possui_snapshot: boolean;
  possui_campos_base_esperados: boolean;
  possui_blocos: boolean;
  estrutura_integra: boolean;
  formato_compativel_comparador: boolean;
  pendencias: string[];
}

export interface SnapshotCanonicoStatusVersao {
  versao_id: string;
  numero_versao: string;
  status: SnapshotCanonicoStatus;
  integridade: IntegridadeSnapshotCanonico;
}

export interface BackfillSnapshotFalha {
  versao_id: string;
  numero_versao: string;
  motivo: string;
}

export interface BackfillSnapshotResultado {
  ativo_canonico_id: string;
  total_sem_snapshot: number;
  total_preenchidas: number;
  total_falhas: number;
  falhas: BackfillSnapshotFalha[];
  versoes_atualizadas: AtivoCanonicoVersao[];
}

export interface AtivoCanonicoVersao {
  id: string;
  ativo_canonico_id: string;
  numero_versao: string;
  titulo?: string;
  resumo_da_versao: string;
  status_da_versao: AtivoCanonicoVersaoStatus;
  publicada_em: string;
  created_at: string;
  snapshot?: AtivoCanonicoVersaoSnapshot;
  snapshot_status?: SnapshotCanonicoStatus;
  snapshot_validado_em?: string;
}

export type CampoBaseCanonicoComparavel =
  | 'nome'
  | 'resumo'
  | 'definicao'
  | 'objetivo'
  | 'tipo_de_ativo'
  | 'status_editorial'
  | 'maturidade_pratica'
  | 'governanca_estado';

export interface MudancaCampoCanonico {
  campo: CampoBaseCanonicoComparavel;
  label: string;
  valor_anterior: string;
  valor_atual: string;
}

export type MudancaBlocoCanonicoTipo = 'criado' | 'removido' | 'alterado';

export interface MudancaBlocoCanonicoResumo {
  tipo: MudancaBlocoCanonicoTipo;
  bloco_origem_estruturacao_id: string;
  titulo_antes?: string;
  titulo_depois?: string;
  tipo_antes?: AtivoCanonicoBlocoTipo;
  tipo_depois?: AtivoCanonicoBlocoTipo;
  alterou_titulo: boolean;
  alterou_tipo: boolean;
  alterou_conteudo: boolean;
}

export interface ComparacaoVersaoCanonica {
  ativo_canonico_id: string;
  versao_anterior: Pick<AtivoCanonicoVersao, 'id' | 'numero_versao' | 'status_da_versao' | 'publicada_em'>;
  versao_atual: Pick<AtivoCanonicoVersao, 'id' | 'numero_versao' | 'status_da_versao' | 'publicada_em'>;
  total_campos_alterados: number;
  total_blocos_antes: number;
  total_blocos_depois: number;
  total_blocos_criados: number;
  total_blocos_removidos: number;
  total_blocos_alterados: number;
  mudancas_campos: MudancaCampoCanonico[];
  mudancas_blocos: MudancaBlocoCanonicoResumo[];
  resumo_textual: string;
}

export type AtivoCanonicoEventoManutencaoTipo =
  | 'ativo_canonico_atualizado'
  | 'bloco_canonico_atualizado'
  | 'bloco_canonico_criado'
  | 'bloco_canonico_removido'
  | 'versao_canonica_criada';

export interface AtivoCanonicoEventoManutencao {
  id: string;
  ativo_canonico_id: string;
  bloco_canonico_id?: string;
  tipo_de_evento: AtivoCanonicoEventoManutencaoTipo;
  descricao: string;
  ocorrido_em: string;
  created_at: string;
}

export interface VersionamentoCanonicoInicialResultado {
  ativo_canonico_id: string;
  versao_criada: AtivoCanonicoVersao;
  evento_registrado: AtivoCanonicoEventoManutencao;
}

export interface AtivoCanonicoBloco {
  id: string;
  ativo_canonico_id: string;
  bloco_origem_estruturacao_id: string;
  tipo_de_bloco: AtivoCanonicoBlocoTipo;
  titulo: string;
  conteudo: string;
  ordem: number;
  status_do_bloco: AtivoCanonicoBlocoStatus;
  created_at: string;
  updated_at: string;
}

export interface AtivoCanonicoBlocoInput {
  tipo_de_bloco: AtivoCanonicoBlocoTipo;
  titulo: string;
  conteudo: string;
  ordem?: number;
  status_do_bloco?: AtivoCanonicoBlocoStatus;
  bloco_origem_estruturacao_id?: string;
}

export interface AtivoCanonicoBlocoPatch {
  tipo_de_bloco?: AtivoCanonicoBlocoTipo;
  titulo?: string;
  conteudo?: string;
  ordem?: number;
  status_do_bloco?: AtivoCanonicoBlocoStatus;
}

export interface AtivoEmEstruturacao {
  id_estruturacao: string;
  origem_preview_id: string;
  origem_entrada_id: string;
  origem_entrada_titulo: string;
  etapa_fluxo: AtivoEmEstruturacaoEtapaFluxo;
  nome: string;
  resumo: string;
  tipo_de_ativo: AtivoMetodologicoTipo;
  definicao: string;
  objetivo: string;
  status_editorial: MetodologiaStatusEditorial;
  maturidade_pratica: MetodologiaMaturidadePratica;
  governanca: {
    estado: AtivoMetodologicoEstadoGovernanca;
  };
  blocos_internos?: AtivoEmEstruturacaoBlocoInterno[];
  relacoes_ativos?: AtivoMetodologicoRelacao[];
  created_at: string;
  updated_at: string;
}

export type DiagnosticoPromocaoCriterioCodigo =
  | 'nome_preenchido'
  | 'resumo_preenchido'
  | 'definicao_preenchida'
  | 'objetivo_preenchido'
  | 'tipo_de_ativo_definido'
  | 'maturidade_pratica_definida'
  | 'governanca_minima_definida'
  | 'bloco_interno_persistido';

export interface DiagnosticoPromocaoCriterio {
  id: string;
  codigo: DiagnosticoPromocaoCriterioCodigo;
  titulo: string;
  descricao: string;
  criticidade: 'alta' | 'media';
  atendido: boolean;
}

export interface DiagnosticoPromocaoAssistida {
  pronto_para_promocao: boolean;
  total_criterios: number;
  criterios_atendidos: number;
  criterios_pendentes: number;
  percentual_prontidao: number;
  criterios: DiagnosticoPromocaoCriterio[];
  pendencias: DiagnosticoPromocaoCriterio[];
  recomendacao: string;
}

export interface AtivoCanonicoPromocaoPreview {
  id_preview_promocao: string;
  slug_sugerido: string;
  nome: string;
  resumo: string;
  definicao: string;
  objetivo: string;
  tipo_de_ativo: AtivoMetodologicoTipo;
  status_editorial: MetodologiaStatusEditorial;
  maturidade_pratica: MetodologiaMaturidadePratica;
  governanca_estado: AtivoMetodologicoEstadoGovernanca;
  versao_atual: string;
  origem_entrada_bruta_id: string;
  origem_ativo_em_estruturacao_id: string;
}

export interface AtivoCanonico {
  id: string;
  slug: string;
  nome: string;
  resumo: string;
  definicao: string;
  objetivo: string;
  tipo_de_ativo: AtivoMetodologicoTipo;
  status_editorial: MetodologiaStatusEditorial;
  maturidade_pratica: MetodologiaMaturidadePratica;
  governanca_estado: AtivoMetodologicoEstadoGovernanca;
  versao_atual: string;
  origem_entrada_bruta_id: string;
  origem_ativo_em_estruturacao_id: string;
  promovido_em: string;
  promovido_por?: string;
  relacoes_ativos?: AtivoMetodologicoRelacao[];
  blocos_canonicos?: AtivoCanonicoBloco[];
  versoes_canonicas?: AtivoCanonicoVersao[];
  eventos_manutencao?: AtivoCanonicoEventoManutencao[];
  created_at: string;
  updated_at: string;
}

export interface AtivoCanonicoPatch {
  nome?: string;
  resumo?: string;
  definicao?: string;
  objetivo?: string;
  tipo_de_ativo?: AtivoMetodologicoTipo;
  status_editorial?: MetodologiaStatusEditorial;
  maturidade_pratica?: MetodologiaMaturidadePratica;
  governanca_estado?: AtivoMetodologicoEstadoGovernanca;
}

export interface PromocaoAssistidaResultado {
  diagnostico: DiagnosticoPromocaoAssistida;
  preview: AtivoCanonicoPromocaoPreview;
  ativo_canonico: AtivoCanonico;
  total_blocos_promovidos: number;
  mensagem: string;
}

export type LacunaEstruturacaoTipo =
  | 'falta_definicao'
  | 'falta_objetivo'
  | 'falta_resumo'
  | 'falta_classificacao_tipo'
  | 'falta_maturidade'
  | 'falta_governanca_minima';

export interface LacunaEstruturacao {
  id: string;
  tipo: LacunaEstruturacaoTipo;
  titulo: string;
  descricao: string;
  criticidade: 'alta' | 'media';
}

export interface DiagnosticoEstruturacao {
  total_campos_monitorados: number;
  campos_preenchidos: number;
  campos_pendentes: number;
  percentual_preenchimento: number;
  base_minima_preenchida: boolean;
  leitura_visual: LeituraVisualEstruturacao;
  lacunas: LacunaEstruturacao[];
  proximo_passo_sugerido: string;
}

export interface AtivoEmEstruturacaoPatch {
  nome?: string;
  resumo?: string;
  tipo_de_ativo?: AtivoMetodologicoTipo;
  definicao?: string;
  objetivo?: string;
  status_editorial?: MetodologiaStatusEditorial;
  maturidade_pratica?: MetodologiaMaturidadePratica;
  governanca?: {
    estado?: AtivoMetodologicoEstadoGovernanca;
  };
}

export type AtivoMetodologicoCamadaLeitura =
  | 'essencia'
  | 'estrutura'
  | 'aplicacao'
  | 'governanca'
  | 'evidencias'
  | 'evolucao';

export interface AtivoMetodologicoCamadaMeta {
  id: AtivoMetodologicoCamadaLeitura;
  label: string;
  descricao: string;
}
