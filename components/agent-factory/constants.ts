import { AgentStatus, AgentTier, ModelProvider } from '../../types';
import {
  DnaStatus,
  EntityType,
  OperationalActivation,
  OperationalClass,
  OperationalStatus,
  RoleType,
  StructuralStatus
} from './types';

export const DEFAULT_WORKSPACE_ID = '00000000-0000-0000-0000-000000000000';

export const ENTITY_TYPE_OPTIONS: Array<{ value: EntityType; label: string }> = [
  { value: 'HUMANO', label: 'Humano' },
  { value: 'AGENTE', label: 'Agente' }
];

export const LEVEL_OPTIONS: Array<{ value: AgentTier; label: string }> = [
  { value: 'ESTRATÉGICO', label: 'Estrategico' },
  { value: 'TÁTICO', label: 'Tatico' },
  { value: 'OPERACIONAL', label: 'Operacional' }
];

export const ROLE_TYPE_OPTIONS: Array<{ value: RoleType; label: string }> = [
  { value: 'LIDERANCA', label: 'Lideranca' },
  { value: 'CONSULTORIA', label: 'Consultoria' },
  { value: 'AUDITORIA', label: 'Auditoria' },
  { value: 'EXECUCAO', label: 'Execucao' },
  { value: 'MENTORIA', label: 'Mentoria' },
  { value: 'APOIO', label: 'Apoio' }
];

export const STRUCTURAL_STATUS_OPTIONS: Array<{ value: StructuralStatus; label: string }> = [
  { value: 'ESTRUTURAL', label: 'Estrutural' },
  { value: 'EM_CONFIGURACAO', label: 'Em configuracao' },
  { value: 'HOMOLOGACAO', label: 'Homologacao' },
  { value: 'ATIVO', label: 'Ativo' },
  { value: 'ARQUIVADO', label: 'Arquivado' }
];

export const OPERATIONAL_ACTIVATION_OPTIONS: Array<{ value: OperationalActivation; label: string }> = [
  { value: 'ATIVO_NASCIMENTO', label: 'Ativo no nascimento' },
  { value: 'PREVISTO_GATILHO', label: 'Previsto por gatilho' },
  { value: 'RESERVADO_FUTURO', label: 'Reservado para futuro' },
  { value: 'COMPARTILHADO', label: 'Compartilhado' }
];

export const OPERATIONAL_STATUS_OPTIONS: Array<{ value: OperationalStatus; label: string }> = [
  { value: 'ESTRUTURAL', label: 'Estrutural' },
  { value: 'DISPONIVEL', label: 'Disponível' },
  { value: 'ATIVO', label: 'Ativo' }
];

export const DNA_STATUS_OPTIONS: Array<{ value: DnaStatus; label: string }> = [
  { value: 'SEM_DNA', label: 'Sem DNA' },
  { value: 'DNA_BASE', label: 'DNA base' },
  { value: 'DNA_PARCIAL', label: 'DNA parcial' },
  { value: 'DNA_COMPLETO', label: 'DNA completo' },
  { value: 'REVISAR', label: 'Revisar' }
];

export const OPERATIONAL_CLASS_OPTIONS: Array<{ value: OperationalClass; label: string }> = [
  { value: 'ECONOMICA', label: 'Economica' },
  { value: 'BALANCEADA', label: 'Balanceada' },
  { value: 'PREMIUM', label: 'Premium' },
  { value: 'CRITICA', label: 'Critica' }
];

export const STACK_OPTIONS: Array<{ value: ModelProvider; label: string }> = [
  { value: 'llama_local', label: 'Llama' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'deepseek', label: 'Deepseek' },
  { value: 'openai', label: 'Openai' },
  { value: 'claude', label: 'Claude' },
  { value: 'qwen', label: 'Qwen' }
];

export const STRUCTURAL_TO_AGENT_STATUS: Record<StructuralStatus, AgentStatus> = {
  ESTRUTURAL: 'PLANNED',
  EM_CONFIGURACAO: 'PLANNED',
  HOMOLOGACAO: 'STAGING',
  ATIVO: 'ACTIVE',
  ARQUIVADO: 'BLOCKED'
};