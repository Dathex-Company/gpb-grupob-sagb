import { Agent, AgentStatus, BusinessUnit, ModelProvider, Venture } from '../../types';
import { deriveOperationalStatus } from '../../utils/agentOperational';
import { isHumanStructuralEntity } from '../../utils/humanIdentity';
import {
  AgentFormState,
  DnaStatus,
  EntityType,
  FormCustomField,
  OperationalClass,
  RoleType,
  StructuralStatus
} from './types';
import { STRUCTURAL_TO_AGENT_STATUS } from './constants';

export const normalizeText = (value: string) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

export const toDisplayOption = (value: any) => {
  const raw = String(value ?? '').trim();
  if (!raw || raw === '-') return '-';
  const normalized = raw.replace(/[_-]+/g, ' ').trim().toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

export const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export const toCustomFieldObject = (fields: FormCustomField[]) => {
  const out: Record<string, string> = {};
  fields.forEach((field) => {
    const key = field.key.trim();
    if (!key) return;
    out[key] = field.value.trim();
  });
  return out;
};

export const fromCustomFieldObject = (record?: Record<string, string>) => {
  if (!record || typeof record !== 'object') return [] as FormCustomField[];
  return Object.entries(record).map(([key, value]) => ({ key, value: String(value ?? '') }));
};

export const mapEntityToCollaboratorType = (entityType: EntityType) => {
  if (entityType === 'HUMANO') return 'HUMANO';
  if (entityType === 'HIBRIDO') return 'HIBRIDO';
  return 'AGENTE_IA';
};

export const normalizeModelValue = (value: string): ModelProvider | '' => {
  const normalized = normalizeText(value);
  if (!normalized) return '';
  if (normalized.includes('llama')) return 'llama_local';
  if (normalized.includes('gemini')) return 'gemini';
  if (normalized.includes('deepseek') || normalized.includes('deep')) return 'deepseek';
  if (normalized.includes('openai') || normalized.includes('gpt')) return 'openai';
  if (normalized.includes('claude')) return 'claude';
  if (normalized.includes('qwen') || normalized.includes('quinn')) return 'qwen';
  return '';
};

export const createEmptyForm = (activeBU: BusinessUnit, ventures: Venture[]): AgentFormState => ({
  name: '',
  entityType: 'AGENTE',
  email: '',
  usesEmail: false,
  shortDescription: '',
  avatarUrl: '',
  origin: 'Cadastro manual',
  ventureId: ventures[0]?.id || '',
  unitName: activeBU.name,
  area: '',
  functionName: '',
  baseRoleUniversal: '',
  level: 'TÁTICO',
  roleType: 'EXECUCAO',
  structuralStatus: 'EM_CONFIGURACAO',
  operationalStatus: 'ESTRUTURAL',
  operationalActivation: 'ATIVO_NASCIMENTO',
  dnaStatus: 'SEM_DNA',
  operationalClass: 'BALANCEADA',
  allowedStacks: ['deepseek'],
  preferredModel: 'deepseek',
  aiMentor: '',
  humanOwner: '',
  projectId: '',
  authUserId: '',
  customFields: []
});

export const agentToForm = (agent: Agent, activeBU: BusinessUnit, ventures: Venture[]): AgentFormState => {
  const fallback = createEmptyForm(activeBU, ventures);
  const preferredModel = (agent.preferredModel || agent.modelProvider || '') as ModelProvider | '';
  const collaboratorType = String(agent.collaboratorType || '').toUpperCase();
  const resolvedEntityType: EntityType = ((): EntityType => {
    const entityType = String(agent.entityType || '').toUpperCase();
    if (entityType === 'HUMANO' || entityType === 'HIBRIDO' || entityType === 'AGENTE') {
      return entityType as EntityType;
    }
    if (collaboratorType === 'HUMANO' || collaboratorType === 'HIBRIDO') {
      return collaboratorType as EntityType;
    }
    return 'AGENTE';
  })();

  return {
    ...fallback,
    name: agent.name || '',
    entityType: resolvedEntityType,
    email: agent.email || '',
    usesEmail: isHumanStructuralEntity(agent)
      ? agent.usesEmail !== false
      : Boolean(agent.usesEmail),
    shortDescription: agent.shortDescription || '',
    avatarUrl: agent.avatarUrl || '',
    origin: agent.origin || 'Cadastro manual',
    ventureId: agent.ventureId || fallback.ventureId,
    unitName: agent.unitName || agent.division || activeBU.name,
    area: agent.area || agent.sector || '',
    functionName: agent.functionName || agent.officialRole || '',
    baseRoleUniversal: agent.baseRoleUniversal || agent.officialRole || '',
    level: (agent.tier || 'TÁTICO') as AgentFormState['level'],
    roleType: (agent.roleType || 'EXECUCAO') as RoleType,
    structuralStatus: (agent.structuralStatus || (agent.status === 'ACTIVE' ? 'ATIVO' : agent.status === 'STAGING' ? 'HOMOLOGACAO' : agent.status === 'BLOCKED' ? 'ARQUIVADO' : 'EM_CONFIGURACAO')) as StructuralStatus,
    operationalStatus: deriveOperationalStatus(agent) as AgentFormState['operationalStatus'],
    operationalActivation: (agent.operationalActivation || 'ATIVO_NASCIMENTO') as AgentFormState['operationalActivation'],
    dnaStatus: (agent.dnaStatus || 'SEM_DNA') as DnaStatus,
    operationalClass: (agent.operationalClass || 'BALANCEADA') as OperationalClass,
    allowedStacks: Array.isArray(agent.allowedStacks) && agent.allowedStacks.length > 0
      ? agent.allowedStacks
      : preferredModel ? [preferredModel] : fallback.allowedStacks,
    preferredModel,
    aiMentor: agent.aiMentor || '',
    humanOwner: agent.humanOwner || '',
    projectId: agent.projectId || '',
    authUserId: agent.authUserId || '',
    customFields: fromCustomFieldObject(agent.customFields)
  };
};

export const validateDraft = (draft: AgentFormState) => {
  if (!draft.name.trim()) throw new Error('Nome e obrigatorio.');
  if (!draft.ventureId) throw new Error('Venture e obrigatoria.');
  if (!draft.functionName.trim()) throw new Error('Funcao principal e obrigatoria.');
  const requiresEmail = draft.entityType === 'HUMANO' || draft.entityType === 'HIBRIDO' || (draft.entityType === 'AGENTE' && draft.usesEmail);
  if (requiresEmail && !draft.email.trim()) throw new Error('E-mail é obrigatório para este cadastro.');
  if (draft.allowedStacks.length === 0) throw new Error('Selecione ao menos uma stack permitida.');
  if (draft.preferredModel && !draft.allowedStacks.includes(draft.preferredModel)) {
    throw new Error('Modelo preferencial precisa estar dentro da stack permitida.');
  }
};

export const resolveAgentStatus = (structuralStatus: StructuralStatus): AgentStatus => {
  return STRUCTURAL_TO_AGENT_STATUS[structuralStatus] || 'STAGING';
};
