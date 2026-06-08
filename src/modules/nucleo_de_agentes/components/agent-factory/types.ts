import { AgentTier, ModelProvider } from '../../types';

export type EntityType = 'HUMANO' | 'AGENTE' | 'HIBRIDO';
export type RoleType = 'LIDERANCA' | 'CONSULTORIA' | 'AUDITORIA' | 'EXECUCAO' | 'MENTORIA' | 'APOIO';
export type StructuralStatus = 'ESTRUTURAL' | 'EM_CONFIGURACAO' | 'HOMOLOGACAO' | 'ATIVO' | 'ARQUIVADO';
export type OperationalStatus = 'ESTRUTURAL' | 'DISPONIVEL' | 'ATIVO';
export type OperationalActivation = 'ATIVO_NASCIMENTO' | 'PREVISTO_GATILHO' | 'RESERVADO_FUTURO' | 'COMPARTILHADO';
export type DnaStatus = 'SEM_DNA' | 'DNA_BASE' | 'DNA_PARCIAL' | 'DNA_COMPLETO' | 'REVISAR';
export type OperationalClass = 'ECONOMICA' | 'BALANCEADA' | 'PREMIUM' | 'CRITICA';

export interface FormCustomField {
  key: string;
  value: string;
}

export interface AgentFormState {
  canonicalId: string;
  name: string;
  entityType: EntityType;
  email: string;
  usesEmail: boolean;
  shortDescription: string;
  avatarUrl: string;
  origin: string;
  ventureId: string;
  unitName: string;
  area: string;
  functionName: string;
  baseRoleUniversal: string;
  level: AgentTier;
  roleType: RoleType;
  structuralStatus: StructuralStatus;
  operationalStatus: OperationalStatus;
  operationalActivation: OperationalActivation;
  dnaStatus: DnaStatus;
  operationalClass: OperationalClass;
  allowedStacks: ModelProvider[];
  preferredModel: ModelProvider | '';
  aiMentor: string;
  humanOwner: string;
  projectId: string;
  authUserId: string;
  customFields: FormCustomField[];
}

export interface AuthorizationResult {
  success: boolean;
  message: string;
  userId?: string;
}
