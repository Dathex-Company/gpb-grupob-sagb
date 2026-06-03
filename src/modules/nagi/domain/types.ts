import { TabId } from '../../../../types';

/* ──────────────────────────────────────────────
 * NAGI V2 — Tipos centrais de domínio
 * ────────────────────────────────────────────── */

/* Origem do item */
export type NagiOriginType = 'avulsa' | 'nic' | 'catalogo';

/* Tipo classificatório do item */
export type NagiItemType =
  | 'empresa'
  | 'venture'
  | 'metodologia'
  | 'programa'
  | 'framework'
  | 'plano'
  | 'iniciativa'
  | 'ideia'
  | 'treinamento'
  | 'mentoria'
  | 'produto'
  | 'sistema'
  | 'outro';

/* Estágio de maturidade dentro do pipeline NAGI */
export type NagiMaturityStage =
  | 'entrada'
  | 'classificacao'
  | 'qualificacao'
  | 'priorizacao'
  | 'decisao'
  | 'encaminhada'
  | 'catalogada';

/* Prioridade */
export type NagiPriority = 'alta' | 'media' | 'baixa';

/* Status operacional (o que o item faz) */
export type NagiOperationalStatus =
  | 'nao_iniciado'
  | 'em_execucao'
  | 'em_teste'
  | 'pausado'
  | 'concluido';

/* Status de governança (decisão do NAGI) */
export type NagiGovernanceStatus =
  | 'em_triagem'
  | 'em_analise'
  | 'aprovada'
  | 'rejeitada'
  | 'incubada'
  | 'arquivada';

/* Status de promoção (triagem → catálogo) */
export type NagiPromotionStatus =
  | 'nao_elegivel'
  | 'elegivel'
  | 'promovida'
  | 'rejeitada_catalogo';

/* Status de handoff (encaminhamento para especialista) */
export type NagiHandoffStatus =
  | 'nao_encaminhado'
  | 'encaminhado'
  | 'recebido'
  | 'processado'
  | 'finalizado';

/* Tipo de evidência */
export type NagiEvidenceType = 'doc' | 'audio' | 'link' | 'nota';

/* Ações do histórico de decisão */
export type NagiDecisionAction =
  | 'classificar'
  | 'qualificar'
  | 'priorizar'
  | 'aprovar'
  | 'rejeitar'
  | 'incubar'
  | 'arquivar'
  | 'encaminhar'
  | 'promover'
  | 'receber_handoff'
  | 'processar_handoff'
  | 'finalizar_handoff';

/* ── Sub-tipos ───────────────────────────────── */

export interface NagiEvidence {
  id: string;
  type: NagiEvidenceType;
  label: string;
  uri?: string;
  excerpt?: string;
  createdAt: string; /* ISO */
}

export interface NagiDecisionEntry {
  id: string;
  at: string; /* ISO */
  by: string;
  byUserId?: string;
  action: NagiDecisionAction;
  rationale: string;
  fromStage?: NagiMaturityStage;
  toStage?: NagiMaturityStage;
  fromGovernance?: NagiGovernanceStatus;
  toGovernance?: NagiGovernanceStatus;
}

export interface NagiScore {
  impact: number;      /* 0-5 */
  effort: number;      /* 0-5 */
  risk: number;        /* 0-5 */
  alignment: number;   /* 0-5 */
  final: number;       /* 0-100 (calculado) */
  updatedAt: string;   /* ISO */
}

export interface NagiTarget {
  tab: TabId;
  label: string;
  routingReason: string;
  routedAt?: string;
}

/* ── Handoff tracking ─────────────────────────── */

export interface NagiHandoffRecord {
  targetModuleTab: TabId;
  targetModuleLabel: string;
  routedAt: string;
  status: NagiHandoffStatus;
  receivedAt?: string;
  processedAt?: string;
  specialistNote?: string;
}

/* ── Ingestão de documentos ───────────────────── */

export type NagiIngestionSourceType = 'upload' | 'texto_colado' | 'nic' | 'catalogo' | 'outro';

export type NagiIngestionClassificationStatus =
  | 'aguardando'
  | 'classificado'
  | 'baixa_clareza'
  | 'duplicata_possivel'
  | 'vinculo_sugerido'
  | 'descartado';

export type NagiIngestionReviewStatus =
  | 'em_revisao'
  | 'pronto_para_salvar'
  | 'salvo'
  | 'descartado';

export type NagiIngestionDestination = 'catalogo' | 'triagem' | 'revisao_manual';

export type NagiIngestionInterpretation =
  | 'item_existente_catalogo'
  | 'nova_ideia_triagem'
  | 'expansao_item_existente'
  | 'sem_clareza_suficiente'
  | 'duplicata_provavel'
  | 'documento_de_apoio';

export interface NagiRelatedCatalogCandidate {
  itemId: string;
  title: string;
  reason: string;
  confidence: number;
}

export interface NagiIngestionHistoryEntry {
  id: string;
  at: string;
  by: string;
  action: string;
  note: string;
}

export interface NagiIngestionDocument {
  id: string;
  sourceType: NagiIngestionSourceType;
  sourceLabel: string;
  fileName?: string;
  originalText: string;
  extractedTitle: string;
  extractedSummary: string;
  extractedTags: string[];
  extractedSignals: string[];
  extractedTypeSuggestion: NagiItemType;
  extractedCategorySuggestion: string;
  relatedCatalogCandidates: NagiRelatedCatalogCandidate[];
  classificationStatus: NagiIngestionClassificationStatus;
  reviewStatus: NagiIngestionReviewStatus;
  interpretation: NagiIngestionInterpretation;
  suggestedDestination: NagiIngestionDestination;
  chosenDestination?: Exclude<NagiIngestionDestination, 'revisao_manual'>;
  selectedCatalogItemId?: string;
  createdItemId?: string;
  confidence: number;
  createdAt: string;
  updatedAt: string;
  history: NagiIngestionHistoryEntry[];
}

/* ── Item central ─────────────────────────────── */

export interface NagiItem {
  /* Identidade */
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  updatedAt: string;

  /* Origem */
  originType: NagiOriginType;
  originRefId?: string;
  originSnapshot?: string;

  /* Classificação */
  itemType: NagiItemType;
  category: string;
  tags: string[];

  /* Maturidade */
  maturityStage: NagiMaturityStage;
  maturityNote?: string;

  /* Prioridade */
  priority: NagiPriority;

  /* Score */
  score: NagiScore;

  /* Status operacional */
  operationalStatus: NagiOperationalStatus;

  /* Status de governança */
  governanceStatus: NagiGovernanceStatus;

  /* Status de promoção (triagem → catálogo) */
  promotionStatus: NagiPromotionStatus;
  promotedAt?: string;
  promotedBy?: string;

  /* Destino especialista (legado, mantido para compatibilidade) */
  specialistTarget?: NagiTarget;

  /* Handoff tracking */
  handoffRecord?: NagiHandoffRecord;

  /* Responsável */
  ownerUserId?: string;
  ownerName?: string;

  /* Evidências */
  evidences: NagiEvidence[];

  /* Histórico de decisão */
  decisionHistory: NagiDecisionEntry[];

  /* Se o item pertence ao catálogo oficial */
  isCatalog: boolean;
}

/* ── Constantes auxiliares ────────────────────── */

export const MATURITY_STAGES: NagiMaturityStage[] = [
  'entrada',
  'classificacao',
  'qualificacao',
  'priorizacao',
  'decisao',
  'encaminhada',
  'catalogada',
];

export const GOVERNANCE_STATUS_LABELS: Record<NagiGovernanceStatus, string> = {
  em_triagem: 'Em triagem',
  em_analise: 'Em análise',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
  incubada: 'Incubada',
  arquivada: 'Arquivada',
};

export const GOVERNANCE_SUBTEXT: Record<NagiGovernanceStatus, string> = {
  em_triagem: 'Aguardando classificação inicial',
  em_analise: 'Em processo de qualificação',
  aprovada: 'Pronto para seguir ao catálogo ou especialista',
  rejeitada: 'Não seguiu adiante',
  incubada: 'Em observação para maturação',
  arquivada: 'Arquivado para referência futura',
};

export const OPERATIONAL_STATUS_LABELS: Record<NagiOperationalStatus, string> = {
  nao_iniciado: 'Não iniciado',
  em_execucao: 'Em execução',
  em_teste: 'Em teste',
  pausado: 'Pausado',
  concluido: 'Concluído',
};

export const MATURITY_LABELS: Record<NagiMaturityStage, string> = {
  entrada: 'Entrada',
  classificacao: 'Classificação',
  qualificacao: 'Qualificação',
  priorizacao: 'Priorização',
  decisao: 'Decisão',
  encaminhada: 'Encaminhada',
  catalogada: 'Catalogada',
};

export const MATURITY_DESCRIPTIONS: Record<NagiMaturityStage, string> = {
  entrada: 'Ideia acabou de chegar',
  classificacao: 'Definindo tipo e categoria',
  qualificacao: 'Atribuindo pontuação',
  priorizacao: 'Definindo prioridade',
  decisao: 'Aguardando decisão de governança',
  encaminhada: 'Enviada para módulo especialista',
  catalogada: 'Promovida ao catálogo oficial',
};

export const ITEM_TYPE_LABELS: Record<NagiItemType, string> = {
  empresa: 'Empresa',
  venture: 'Venture',
  metodologia: 'Metodologia',
  programa: 'Programa',
  framework: 'Framework',
  plano: 'Plano',
  iniciativa: 'Iniciativa',
  ideia: 'Ideia',
  treinamento: 'Treinamento',
  mentoria: 'Mentoria',
  produto: 'Produto',
  sistema: 'Sistema',
  outro: 'Outro',
};

export const ORIGIN_LABELS: Record<NagiOriginType, string> = {
  avulsa: 'Avulsa',
  nic: 'NIC',
  catalogo: 'Catálogo',
};

export const PRIORITY_LABELS: Record<NagiPriority, string> = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

export const PROMOTION_STATUS_LABELS: Record<NagiPromotionStatus, string> = {
  nao_elegivel: 'Não elegível',
  elegivel: 'Elegível para promoção',
  promovida: 'Promovida ao catálogo',
  rejeitada_catalogo: 'Rejeitada para catálogo',
};

export const HANDOFF_STATUS_LABELS: Record<NagiHandoffStatus, string> = {
  nao_encaminhado: 'Não encaminhado',
  encaminhado: 'Enviado ao especialista',
  recebido: 'Recebido pelo especialista',
  processado: 'Em processo',
  finalizado: 'Finalizado',
};

export const INGESTION_SOURCE_LABELS: Record<NagiIngestionSourceType, string> = {
  upload: 'Arquivo',
  texto_colado: 'Texto colado',
  nic: 'NIC',
  catalogo: 'Catálogo',
  outro: 'Outro',
};

export const INGESTION_CLASSIFICATION_LABELS: Record<NagiIngestionClassificationStatus, string> = {
  aguardando: 'Aguardando leitura',
  classificado: 'Com sugestão',
  baixa_clareza: 'Precisa de revisão',
  duplicata_possivel: 'Possível duplicata',
  vinculo_sugerido: 'Vínculo sugerido',
  descartado: 'Descartado',
};

export const INGESTION_REVIEW_LABELS: Record<NagiIngestionReviewStatus, string> = {
  em_revisao: 'Em revisão',
  pronto_para_salvar: 'Pronto para salvar',
  salvo: 'Salvo',
  descartado: 'Descartado',
};

export const INGESTION_DESTINATION_LABELS: Record<NagiIngestionDestination, string> = {
  catalogo: 'Catálogo',
  triagem: 'Triagem',
  revisao_manual: 'Revisão manual',
};

/* Função utilitária para recalcular score final */
export function calculateFinalScore(s: Pick<NagiScore, 'impact' | 'effort' | 'risk' | 'alignment'>): number {
  const avg = (s.impact + s.effort + s.risk + s.alignment) / 4;
  return Math.round(avg * 20); /* 0-5 → 0-100 */
}

/* Função que determina se um item está elegível para promoção */
export function isEligibleForPromotion(item: NagiItem): boolean {
  if (item.isCatalog) return false;
  if (item.governanceStatus !== 'aprovada') return false;
  if (item.score.final < 50) return false;
  if (item.itemType === 'ideia') return false;
  return true;
}
