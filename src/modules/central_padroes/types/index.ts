export type CentralStandardStatus = 'rascunho' | 'revisao' | 'curadoria' | 'aprovado' | 'publicado' | 'deprecado' | 'substituido';

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

export type CentralRiskLevel = 'baixo' | 'medio' | 'alto' | 'critico';

export interface CentralArea {
  id: string;
  name: string;
  owner: string;
  focus: string;
}

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
}

export interface CentralDocument {
  id: string;
  title: string;
  path: string;
  status: 'canonico' | 'revisao' | 'bruto' | 'legado' | 'externo';
  category: string;
  areaId: string;
  shouldBecome: 'padrao' | 'checklist' | 'matriz' | 'registro' | 'apoio' | 'arquivo_morto';
}

export interface CentralChecklist {
  id: string;
  title: string;
  context: string;
  owner: string;
  items: string[];
}

export interface CentralDecision {
  id: string;
  title: string;
  status: 'proposta' | 'aceita' | 'deprecada' | 'substituida';
  areaId: string;
  summary: string;
  impacts: string[];
}

export interface CentralModuleLink {
  id: string;
  moduleId: string;
  moduleName: string;
  kind: 'plugavel' | 'base_reutilizavel' | 'produto' | 'interno';
  status: 'conforme' | 'parcial' | 'sem_vinculo' | 'revisar';
  standards: string[];
}

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

export interface CentralAgentRun {
  id: string;
  agentCode: string;
  agentName: string;
  block: string;
  status: 'planejado' | 'executado' | 'validado' | 'bloqueado';
  deliverable: string;
}

export interface CentralDashboardMetrics {
  standards: number;
  documents: number;
  checklists: number;
  decisions: number;
  modulesLinked: number;
  risks: number;
}

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

export interface StandardFilter {
  status?: CentralStandardStatus;
  areaId?: string;
  query?: string;
}

export interface DocumentFilter {
  status?: CentralDocument['status'];
  areaId?: string;
  query?: string;
}

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

export interface CentralOperationState {
  loading: boolean;
  error: string | null;
}
