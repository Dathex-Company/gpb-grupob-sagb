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

export interface CanonicalIdParts {
  full: string;
  nomeAgente: string;
  empresa3: string;
  setor3: string;
  nivel1: 'e' | 't' | 'o';
  seq3: string;
}

export type AgentNameValidationStatus = 'empty' | 'available' | 'duplicate' | 'similar';

export interface AgentNameValidationConflict {
  agentId: string;
  name: string;
  canonicalId?: string;
  score: number;
  reason: string;
}

export interface AgentNameValidationResult {
  status: AgentNameValidationStatus;
  normalizedName: string;
  conflicts: AgentNameValidationConflict[];
  message: string;
}

export const CANONICAL_ID_REGEX = /^[a-z0-9]+(?:_[a-z0-9]+)*_[a-z0-9]{3}_[a-z0-9]{3}_[eto]_[0-9]{3}$/;

export const normalizeText = (value: string) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

export const normalizeAgentName = (value: string) =>
  normalizeText(value)
    .replace(/\b(dr|dra|sr|sra|prof|profa)\.?\b/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenSet = (value: string) => new Set(normalizeAgentName(value).split(' ').filter(Boolean));

const calculateNameSimilarity = (candidateName: string, existingName: string) => {
  const candidateTokens = tokenSet(candidateName);
  const existingTokens = tokenSet(existingName);
  if (candidateTokens.size === 0 || existingTokens.size === 0) return 0;

  const intersection = [...candidateTokens].filter((token) => existingTokens.has(token)).length;
  const union = new Set([...candidateTokens, ...existingTokens]).size;
  const tokenScore = union > 0 ? intersection / union : 0;
  const candidateParts = [...candidateTokens];
  const existingParts = [...existingTokens];
  const firstNameMatch = candidateParts[0] && existingParts[0] && candidateParts[0] === existingParts[0] ? 0.15 : 0;
  const lastNameMatch = candidateParts.at(-1) && existingParts.at(-1) && candidateParts.at(-1) === existingParts.at(-1) ? 0.25 : 0;

  return Math.min(1, tokenScore + firstNameMatch + lastNameMatch);
};

export const validateAgentNameAvailability = (
  candidateName: string,
  agents: Agent[],
  editingAgentId?: string | null
): AgentNameValidationResult => {
  const normalizedName = normalizeAgentName(candidateName);
  if (!normalizedName) {
    return {
      status: 'empty',
      normalizedName,
      conflicts: [],
      message: 'Informe um nome para validar disponibilidade.'
    };
  }

  const comparableAgents = agents.filter((agent) => agent.id !== editingAgentId);
  const exactConflicts = comparableAgents
    .filter((agent) => normalizeAgentName(agent.name) === normalizedName)
    .map((agent) => ({
      agentId: agent.id,
      name: agent.name,
      canonicalId: agent.canonicalId,
      score: 1,
      reason: 'Nome idêntico já cadastrado.'
    }));

  if (exactConflicts.length > 0) {
    return {
      status: 'duplicate',
      normalizedName,
      conflicts: exactConflicts,
      message: `Nome já utilizado por ${exactConflicts[0].name}. Escolha outro nome.`
    };
  }

  const similarConflicts = comparableAgents
    .map((agent) => ({
      agent,
      score: calculateNameSimilarity(candidateName, agent.name)
    }))
    .filter(({ score }) => score >= 0.78)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ agent, score }) => ({
      agentId: agent.id,
      name: agent.name,
      canonicalId: agent.canonicalId,
      score,
      reason: 'Nome muito parecido com cadastro existente.'
    }));

  if (similarConflicts.length > 0) {
    return {
      status: 'similar',
      normalizedName,
      conflicts: similarConflicts,
      message: `Nome parecido com ${similarConflicts[0].name}. Revise antes de salvar.`
    };
  }

  return {
    status: 'available',
    normalizedName,
    conflicts: [],
    message: 'Nome disponível para cadastro.'
  };
};

export const normalizeCanonicalIdInput = (value: string) =>
  String(value || '')
    .trim()
    .toLowerCase();

export const parseCanonicalId = (value: string): CanonicalIdParts | null => {
  const normalized = normalizeCanonicalIdInput(value);
  if (!CANONICAL_ID_REGEX.test(normalized)) return null;

  const tokens = normalized.split('_');
  if (tokens.length < 6) return null;

  const seq3 = tokens[tokens.length - 1];
  const nivel1 = tokens[tokens.length - 2] as CanonicalIdParts['nivel1'];
  const setor3 = tokens[tokens.length - 3];
  const empresa3 = tokens[tokens.length - 4];
  const nomeTokens = tokens.slice(0, -4);
  const nomeAgente = nomeTokens.join('_');

  if (!nomeAgente) return null;
  const seqAsNumber = Number(seq3);
  if (!Number.isInteger(seqAsNumber) || seqAsNumber < 1 || seqAsNumber > 999) return null;

  return {
    full: normalized,
    nomeAgente,
    empresa3,
    setor3,
    nivel1,
    seq3
  };
};

export const validateCanonicalIdOrThrow = (value: string): CanonicalIdParts => {
  const parsed = parseCanonicalId(value);
  if (!parsed) {
    throw new Error('ID canônico inválido. Use o padrão nome_empresa3_setor3_nivel1_seq3 (ex: anton_borselli_3fb_mkt_e_001).');
  }
  return parsed;
};

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
  canonicalId: '',
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
    canonicalId: normalizeCanonicalIdInput(agent.canonicalId || ''),
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
  if (!draft.canonicalId.trim()) throw new Error('ID canônico é obrigatório.');
  validateCanonicalIdOrThrow(draft.canonicalId);
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
