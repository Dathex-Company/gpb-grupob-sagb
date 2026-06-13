// ============================================================
// Central de Padrões — Tipos expandidos (v3)
// ============================================================

// ——— Status expandido (11 níveis de canonicidade) ———
export type CentralStandardStatus =
  | 'bruto'
  | 'rascunho'
  | 'em_revisao'
  | 'em_curadoria'
  | 'homologado'
  | 'canonico_operacional'
  | 'canonico_oficial'
  | 'publicado'
  | 'obsoleto'
  | 'arquivado'
  | 'bloqueado'
  | 'previsto'
  | 'registro';

// ——— Perfis da Central (7 papéis) ———
export type CentralProfileRole =
  | 'leitor'
  | 'editor'
  | 'curador'
  | 'aprovador'
  | 'administrador'
  | 'agente_autorizado'
  | 'auditor';

// ——— Ações possíveis ———
export type CentralAction =
  | 'visualizar'
  | 'criar_rascunho'
  | 'editar_rascunho_proprio'
  | 'editar_padrao_oficial'
  | 'aprovar_padrao'
  | 'publicar_padrao'
  | 'excluir_padrao'
  | 'criar_documento'
  | 'editar_documento_metadata'
  | 'editar_documento_conteudo'
  | 'publicar_documento'
  | 'arquivar_documento'
  | 'restaurar_documento'
  | 'enviar_documento_curadoria'
  | 'ver_logs'
  | 'executar_agente';

// ——— Tipos normativos ———
export type CentralNormativeType =
  | 'principio'
  | 'politica'
  | 'regra'
  | 'padrao'
  | 'protocolo'
  | 'processo'
  | 'procedimento'
  | 'checklist'
  | 'matriz'
  | 'registro'
  | 'decisao'
  | 'excecao'
  | 'evidencia'
  | 'template'
  | 'guia'
  | 'manual'
  | 'documentacao_tecnica'
  | 'documentacao_externa'
  | 'prompt_canonico'
  | 'contrato_modulo'
  | 'contrato_agente';

// ——— Níveis de risco ———
export type CentralRiskLevel = 'baixo' | 'medio' | 'alto' | 'critico';

// ——— Contrato Document Hub V1 ———
export type CentralDocumentStatus = 'canonico' | 'revisao' | 'bruto' | 'legado' | 'externo' | 'registro' | 'previsto' | 'arquivado' | 'bloqueado';

export type CentralDocumentType =
  | 'documento_mestre'
  | 'padrao'
  | 'plano'
  | 'relatorio'
  | 'auditoria'
  | 'checklist'
  | 'evidencia'
  | 'registro'
  | 'guia'
  | 'template'
  | 'externo'
  | 'apoio'
  | 'desconhecido';

export type CentralDocumentSource =
  | 'supabase_live'
  | 'md_indexado'
  | 'governance_report'
  | 'governance_audit'
  | 'governance_curadoria'
  | 'trace_log'
  | 'fallback'
  | 'manual'
  | 'external';

export type CentralCanonicalLevel = 'nao_canonico' | 'candidato' | 'operacional' | 'oficial' | 'legado' | 'previsto';

export type CentralDocumentContentAvailability = 'available' | 'missing' | 'external' | 'storage_only' | 'not_loaded';

// ——— Tipos de evento de auditoria ———
export type AuditEventType =
  | 'CREATE' | 'UPDATE' | 'DELETE' | 'SOFT_DELETE' | 'RESTORE'
  | 'STATUS_CHANGE' | 'APPROVE' | 'REJECT' | 'PUBLISH' | 'ARCHIVE'
  | 'OWNER_CHANGE' | 'CANONICAL_EDIT' | 'AGENT_QUERY' | 'CHAT_RESPONSE'
  | 'RECONCILIATION_DRIFT' | 'SEARCH_FAILURE' | 'PERMISSION_DENIED';

export type AuditEntityType =
  | 'standard' | 'document' | 'decision' | 'checklist'
  | 'module' | 'agent' | 'base_module' | 'evidence' | 'approval';

// ——— Entrada de log de auditoria ———
export interface AuditLogEntry {
  id: string;
  eventType: AuditEventType;
  entityType: AuditEntityType;
  entityId: string;
  previousState: Record<string, unknown> | null;
  newState: Record<string, unknown> | null;
  diff: Record<string, unknown> | null;
  changedBy: string;
  changedByRole: string | null;
  reason: string | null;
  riskLevel: CentralRiskLevel | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

// ——— Perfil de usuário da Central ———
export interface CentralUserProfile {
  userId: string;
  email: string;
  displayName: string;
  profileRole: CentralProfileRole;
}

// ——— Gate de canonicidade ———
export interface CanonicalGate {
  from: CentralStandardStatus;
  to: CentralStandardStatus;
  requiredRole: CentralProfileRole;
  requiresEvidence: boolean;
  requiresApproval: boolean;
  logMandatory: boolean;
  requiresVisualEvidence?: boolean;
  requiresPietroValidation?: boolean;
}

// ——— Área ———
export interface CentralArea {
  id: string;
  name: string;
  owner: string;
  focus: string;
}

// ——— Padrão normativo ———
export interface CentralStandard {
  id: string;
  key: string;
  title: string;
  type: CentralNormativeType;
  status: CentralStandardStatus;
  areaId: string;
  owner: string;
  summary: string;
  risk: CentralRiskLevel;
  version: number;
  agentAvailable: boolean;
  dependencies: string[];
  relatedModules: string[];
  updatedAt: string;
  // Campos expandidos
  canonicalLevel?: CentralStandardStatus;
  requiresVisualEvidence?: boolean;
  visualEvidenceUrl?: string;
  nextReviewAt?: string;
  lastReviewedBy?: string;
  lastReviewedAt?: string;
  contentMd?: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
}

// ——— Documento ———
export interface CentralDocument {
  id: string;
  title: string;
  path: string;
  status: CentralDocumentStatus;
  category: string;
  areaId: string;
  shouldBecome: 'padrao' | 'checklist' | 'matriz' | 'registro' | 'apoio' | 'arquivo_morto';
  slug?: string | null;
  type?: CentralDocumentType;
  riskLevel?: CentralRiskLevel;
  owner?: string | null;
  tags?: string[];
  summary?: string | null;
  content?: string | null;
  pathAbsolute?: string | null;
  pathRelative?: string | null;
  source?: CentralDocumentSource;
  module?: string | null;
  division?: string | null;
  canonicalLevel?: CentralCanonicalLevel;
  createdBy?: string | null;
  updatedBy?: string | null;
  contentAvailability?: CentralDocumentContentAvailability;
  isIncomplete?: boolean;
  incompleteReasons?: string[];
  updatedAt?: string | null;
  createdAt?: string | null;
  deletedAt?: string | null;
  deletedBy?: string | null;
}

// ——— Checklist ———
export interface CentralChecklist {
  id: string;
  title: string;
  context: string;
  owner: string;
  items: string[];
  deletedAt?: string | null;
  deletedBy?: string | null;
}

// ——— Decisão ———
export interface CentralDecision {
  id: string;
  title: string;
  status: 'proposta' | 'aceita' | 'deprecada' | 'substituida';
  areaId: string;
  summary: string;
  impacts: string[];
  deletedAt?: string | null;
  deletedBy?: string | null;
}

// ——— Link de módulo ———
export interface CentralModuleLink {
  id: string;
  moduleId: string;
  moduleName: string;
  kind: 'plugavel' | 'base_reutilizavel' | 'produto' | 'interno';
  status: 'conforme' | 'parcial' | 'sem_vinculo' | 'revisar';
  standards: string[];
  deletedAt?: string | null;
  deletedBy?: string | null;
}

// ——— Módulo base ———
export interface CentralBaseModule {
  id: string;
  moduleId: string;
  name: string;
  moduleType: 'core' | 'infra' | 'ui' | 'dados' | 'seguranca' | 'automacao' | 'integracao';
  description: string;
  status: 'candidato' | 'revisao' | 'aprovado' | 'deprecado';
  owner: string;
  areaId: string;
  dependencies: string[];
  risks: CentralRiskLevel[];
  recommendedUse: string;
  reuseCriteria: string[];
  linkedStandards: string[];
  linkedProtocols: string[];
  linkedChecklists: string[];
  gateChecklistKey: string;
  source: 'supabase' | 'catalogo_et23' | 'module_link';
}

// ——— Execução de agente ———
export interface CentralAgentRun {
  id: string;
  agentCode: string;
  agentName: string;
  block: string;
  status: 'planejado' | 'executado' | 'validado' | 'bloqueado';
  deliverable: string;
}

// ——— Métricas do dashboard ———
export interface CentralDashboardMetrics {
  standards: number;
  documents: number;
  checklists: number;
  decisions: number;
  modulesLinked: number;
  risks: number;
}

// ——— Snapshot completo do repositório ———
export interface CentralRepositorySnapshot {
  areas: CentralArea[];
  standards: CentralStandard[];
  documents: CentralDocument[];
  checklists: CentralChecklist[];
  decisions: CentralDecision[];
  modules: CentralModuleLink[];
  baseModules: CentralBaseModule[];
  agents: CentralAgentRun[];
  isOnline?: boolean;
}

// ——— Filtros ———
export interface StandardFilter {
  status?: CentralStandardStatus;
  areaId?: string;
  query?: string;
}

export interface DocumentFilter {
  status?: CentralDocument['status'];
  areaId?: string;
  query?: string;
  type?: CentralDocumentType;
  source?: CentralDocumentSource;
  riskLevel?: CentralRiskLevel;
  owner?: string;
  tag?: string;
  includeDeleted?: boolean;
}

// ——— Inputs de CRUD ———
export type CreateStandardInput = Omit<CentralStandard, 'id' | 'updatedAt' | 'version'> & {
  contentMd?: string;
};

export type UpdateStandardInput = Partial<CreateStandardInput> & {
  status?: CentralStandardStatus;
};

export type CreateDocumentInput = Omit<CentralDocument, 'id'>;
export type UpdateDocumentInput = Partial<CreateDocumentInput>;
export type CreateDecisionInput = Omit<CentralDecision, 'id'>;
export type CreateChecklistInput = Omit<CentralChecklist, 'id'>;
export type UpdateModuleInput = Partial<Omit<CentralModuleLink, 'id'>>;

// ——— Item de ingestão ———
export interface CentralIngestionItem {
  id: string;
  title: string;
  sourcePath?: string | null;
  sourceKind: string;
  suggestedAreaId?: string | null;
  suggestedDestination: CentralDocument['shouldBecome'];
  confidence: number;
  status: 'queued' | 'triage' | 'accepted' | 'rejected' | 'ignored';
  createdAt: string;
}

// ——— Estado de operação ———
export interface CentralOperationState {
  loading: boolean;
  error: string | null;
}

// ============================================================
// Busca e resultado
// ============================================================

export type SearchResultEntityType = 'standard' | 'document' | 'decision' | 'baseModule' | 'agentRun' | 'report' | 'audit' | 'curadoria' | 'traceLog';

export interface SearchResult {
  entityType: SearchResultEntityType;
  entity: CentralStandard | CentralDocument | CentralDecision | CentralBaseModule | CentralAgentRun | Record<string, unknown>;
  score: number;
  excerpt: string;
  routeId?: string;
  originLabel?: string;
  meta?: {
    title?: string;
    type?: string;
    category?: string;
    status?: string;
    risk?: string;
    owner?: string;
    tags?: string[];
    pathAbsolute?: string | null;
    pathRelative?: string | null;
    summary?: string | null;
  };
}

// ============================================================
// Índice documental (Chat Pietro)
// ============================================================

export interface DocumentIndexEntry {
  id: string;
  title: string;
  summary: string;
  chunks: string[];
  tags: string[];
  owner: string;
  status: CentralStandardStatus;
  normativeType: CentralNormativeType;
  areaId: string;
  areaName?: string;
  route: string;
  updatedAt: string;
  canonicalLevel: CentralStandardStatus;
  embedding?: number[];
  allowedRoles: CentralProfileRole[];
}

export interface DocumentIndexSnapshot {
  entries: DocumentIndexEntry[];
  builtAt: string;
  totalEntries: number;
}

// ============================================================
// Chat Pietro
// ============================================================

export interface ChatPietroSource {
  key: string;
  title: string;
  type: CentralNormativeType;
  status: CentralStandardStatus;
  owner: string;
  areaId: string;
  route: string;
  documentId: string;
  sectionId?: string;
  updatedAt: string;
  canonicalLevel: string;
  confidence: number;
  whyMatched: string;
  excerpt: string;
  allowedActions: string[];
}

export type ChatPietroMode =
  | 'buscar_documento'
  | 'explicar_padrao'
  | 'comparar_padroes'
  | 'encontrar_lacunas'
  | 'criar_tarefa'
  | 'checar_canonicidade'
  | 'checar_responsavel'
  | 'checar_riscos'
  | 'gerar_relatorio'
  | 'preparar_validacao';

export interface ChatPietroRequest {
  question: string;
  mode?: ChatPietroMode;
  userRole?: CentralProfileRole;
  areaId?: string;
}

export interface ChatPietroResponse {
  answer: string;
  sources: ChatPietroSource[];
  mode: ChatPietroMode;
  totalFound: number;
  hasMoreResults: boolean;
  suggestedActions: string[];
  error?: string;
}

// ============================================================
// Registro de evidência
// ============================================================

export interface CentralEvidenceRecord {
  id: string;
  relatedEntityType: string;
  relatedEntityId: string;
  title: string;
  storagePath: string | null;
  severity: string;
  createdBy: string | null;
  createdAt: string;
}

// ============================================================
// Approval workflow
// ============================================================

export type ApprovalRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface CentralApprovalRequest {
  id: string;
  standardId: string;
  requestedBy: string;
  assignedTo: string;
  status: ApprovalRequestStatus;
  reviewNotes: string | null;
  decidedAt: string | null;
  createdAt: string;
}

// ============================================================
// Matriz de permissões
// ============================================================

export const CENTRAL_PERMISSION_MATRIX: Record<CentralProfileRole, CentralAction[]> = {
  leitor: ['visualizar'],
  editor: ['visualizar', 'criar_rascunho', 'editar_rascunho_proprio', 'criar_documento'],
  curador: ['visualizar', 'criar_rascunho', 'editar_rascunho_proprio', 'editar_padrao_oficial', 'criar_documento', 'editar_documento_metadata', 'editar_documento_conteudo', 'arquivar_documento', 'enviar_documento_curadoria'],
  aprovador: ['visualizar', 'criar_rascunho', 'editar_rascunho_proprio', 'editar_padrao_oficial', 'aprovar_padrao', 'publicar_padrao', 'criar_documento', 'editar_documento_metadata', 'editar_documento_conteudo', 'publicar_documento', 'arquivar_documento', 'enviar_documento_curadoria', 'ver_logs'],
  administrador: ['visualizar', 'criar_rascunho', 'editar_rascunho_proprio', 'editar_padrao_oficial', 'aprovar_padrao', 'publicar_padrao', 'excluir_padrao', 'criar_documento', 'editar_documento_metadata', 'editar_documento_conteudo', 'publicar_documento', 'arquivar_documento', 'restaurar_documento', 'enviar_documento_curadoria', 'ver_logs', 'executar_agente'],
  agente_autorizado: ['visualizar', 'executar_agente'],
  auditor: ['visualizar', 'ver_logs']
};

// ============================================================
// Gates de canonicidade
// ============================================================

export const CANONICAL_GATES: CanonicalGate[] = [
  { from: 'bruto', to: 'rascunho', requiredRole: 'editor', requiresEvidence: false, requiresApproval: false, logMandatory: true },
  { from: 'rascunho', to: 'em_revisao', requiredRole: 'editor', requiresEvidence: false, requiresApproval: false, logMandatory: true },
  { from: 'em_revisao', to: 'em_curadoria', requiredRole: 'curador', requiresEvidence: true, requiresApproval: false, logMandatory: true },
  { from: 'em_curadoria', to: 'homologado', requiredRole: 'aprovador', requiresEvidence: true, requiresApproval: true, logMandatory: true },
  { from: 'homologado', to: 'canonico_operacional', requiredRole: 'administrador', requiresEvidence: true, requiresApproval: true, logMandatory: true },
  { from: 'canonico_operacional', to: 'canonico_oficial', requiredRole: 'administrador', requiresEvidence: true, requiresApproval: true, logMandatory: true, requiresPietroValidation: true },
  { from: 'canonico_oficial', to: 'publicado', requiredRole: 'administrador', requiresEvidence: false, requiresApproval: false, logMandatory: true },
  { from: 'publicado', to: 'obsoleto', requiredRole: 'curador', requiresEvidence: true, requiresApproval: true, logMandatory: true },
  { from: 'obsoleto', to: 'arquivado', requiredRole: 'curador', requiresEvidence: false, requiresApproval: false, logMandatory: true },
  { from: 'bruto', to: 'bloqueado', requiredRole: 'curador', requiresEvidence: false, requiresApproval: false, logMandatory: true },
  { from: 'rascunho', to: 'bloqueado', requiredRole: 'curador', requiresEvidence: false, requiresApproval: false, logMandatory: true },
  { from: 'em_revisao', to: 'bloqueado', requiredRole: 'aprovador', requiresEvidence: false, requiresApproval: false, logMandatory: true },
];

// ============================================================
// Mapa de status (exibição amigável)
// ============================================================

export const CENTRAL_STATUS_LABELS: Record<CentralStandardStatus, string> = {
  bruto: 'Bruto',
  rascunho: 'Rascunho',
  em_revisao: 'Em Revisão',
  em_curadoria: 'Em Curadoria',
  homologado: 'Homologado',
  canonico_operacional: 'Canônico Operacional',
  canonico_oficial: 'Canônico Oficial',
  publicado: 'Publicado',
  obsoleto: 'Obsoleto',
  arquivado: 'Arquivado',
  bloqueado: 'Bloqueado',
  previsto: 'Previsto',
  registro: 'Registro',
};

// ============================================================
// Cores de status
// ============================================================

export const CENTRAL_STATUS_COLORS: Record<CentralStandardStatus, string> = {
  bruto: '#9e9e9e',
  rascunho: '#ff9800',
  em_revisao: '#2196f3',
  em_curadoria: '#9c27b0',
  homologado: '#4caf50',
  canonico_operacional: '#1b5e20',
  canonico_oficial: '#0d47a1',
  publicado: '#00897b',
  obsoleto: '#757575',
  arquivado: '#616161',
  bloqueado: '#d32f2f',
  previsto: '#03a9f4',
  registro: '#00bcd4',
};
