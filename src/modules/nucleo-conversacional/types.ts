// ============================================================
// Tipos locais do módulo Núcleo Conversacional
// Cópia das interfaces essenciais do types.ts raiz para
// permitir que o módulo seja vendido como produto standalone.
// ============================================================

export enum Sender {
  User = 'user',
  Bot = 'bot',
  System = 'system'
}

export type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

export interface ChatAttachment {
  localId?: string;
  data: string;
  storagePath?: string;
  url?: string;
  mimeType: string;
  preview: string;
  name?: string;
  sizeBytes?: number;
  durationSec?: number;
  uploadStatus?: UploadStatus;
  uploadError?: string;
}

export type AgentTier = 'ESTRATÉGICO' | 'TÁTICO' | 'OPERACIONAL' | 'CONTROLE';

export type AgentStatus = 'PLANNED' | 'STAGING' | 'ACTIVE' | 'MAINTENANCE' | 'BLOCKED';

export type ModelProvider = 'gemini' | 'deepseek' | 'llama_local' | 'openai' | 'claude' | 'qwen';

export interface Agent {
  id: string;
  universalId?: string;
  canonicalId?: string;
  name: string;
  version: string;
  company: string;
  buId?: string;
  ventureId?: string;
  officialRole: string;
  fullPrompt: string;
  active: boolean;
  status: AgentStatus;
  sector: string;
  tier: AgentTier;
  knowledgeBase?: string[];

  globalDocuments?: { id: string; title: string; content: string; tags: string[] }[];
  learnedMemory?: string[];
  dnaIndividualPrompt?: string;
  effectivePrompt?: string;

  division?: string;
  collaboratorType?: string;
  salary?: string;
  startDate?: string;
  docCount?: number;

  entityType?: 'HUMANO' | 'AGENTE' | 'HIBRIDO';
  shortDescription?: string;
  origin?: string;
  unitName?: string;
  area?: string;
  functionName?: string;
  baseRoleUniversal?: string;
  roleType?: 'LIDERANCA' | 'CONSULTORIA' | 'AUDITORIA' | 'EXECUCAO' | 'MENTORIA' | 'APOIO';
  structuralStatus?: 'ESTRUTURAL' | 'EM_CONFIGURACAO' | 'HOMOLOGACAO' | 'ATIVO' | 'ARQUIVADO';
  operationalStatus?: 'ESTRUTURAL' | 'DISPONIVEL' | 'ATIVO';
  operationalActivation?: 'ATIVO_NASCIMENTO' | 'PREVISTO_GATILHO' | 'RESERVADO_FUTURO' | 'COMPARTILHADO';
  dnaStatus?: 'SEM_DNA' | 'DNA_BASE' | 'DNA_PARCIAL' | 'DNA_COMPLETO' | 'REVISAR';
  operationalClass?: 'ECONOMICA' | 'BALANCEADA' | 'PREMIUM' | 'CRITICA';
  allowedStacks?: ModelProvider[];
  preferredModel?: ModelProvider;
  aiMentor?: string;
  humanOwner?: string;
  email?: string;
  usesEmail?: boolean;
  authUserId?: string;
  customFields?: Record<string, string>;

  projectId?: string;
  memoryLayersReady?: boolean;
  taskzeiReady?: boolean;

  avatarUrl?: string;
  ambientPhotoUrl?: string;

  modelProvider?: ModelProvider;
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
  buId: string;
  isStreaming?: boolean;
  isDecision?: boolean;
  participantName?: string;
  attachment?: ChatAttachment;
  attachments?: ChatAttachment[];
  payload?: Record<string, any>;
}

export interface PersonaConfig {
  id: string;
  name: string;
  baseRole: string;
  tier: AgentTier;
  contextInfo: string;
  tone: string;
  welcomeMessage: string;
  avatarColor: string;
  imageUrl?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  nickname: string;
  role: string;
  company: string;
  workspaceId?: string;
  avatarUrl?: string;
  tier: AgentTier;
  createdAt: Date;
}
