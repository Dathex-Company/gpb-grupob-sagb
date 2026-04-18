import { BusinessUnit, ModelProvider, Venture } from '../../types';
import { AgentFormState, DnaStatus, EntityType, StructuralStatus } from './types';
import { createEmptyForm, normalizeModelValue, normalizeText } from './helpers';

export const parseCsvLine = (line: string) => {
  const out: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      out.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  out.push(current);
  return out.map((value) => value.trim());
};

export const parseCsvRecords = (content: string) => {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [] as Array<Record<string, string>>;

  const headers = parseCsvLine(lines[0]).map((header) => normalizeText(header));

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = values[index] ?? '';
      return acc;
    }, {});
  });
};

export const readByAliases = (row: Record<string, string>, aliases: string[]) => {
  const normalizedAliases = aliases.map((alias) => normalizeText(alias));
  for (const alias of normalizedAliases) {
    const value = row[alias];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value).trim();
    }
  }
  return '';
};

export const resolveVentureId = (raw: string, ventures: Venture[]) => {
  const value = raw.trim();
  if (!value) return '';
  const byId = ventures.find((venture) => venture.id === value);
  if (byId) return byId.id;
  const byName = ventures.find((venture) => normalizeText(venture.name) === normalizeText(value));
  if (byName) return byName.id;
  return '';
};

interface MapImportRowArgs {
  row: Record<string, string>;
  activeBU: BusinessUnit;
  ventures: Venture[];
  batchOrigin: string;
  batchVentureId: string;
}

export const mapImportRowToForm = ({
  row,
  activeBU,
  ventures,
  batchOrigin,
  batchVentureId
}: MapImportRowArgs): AgentFormState => {
  const draft = createEmptyForm(activeBU, ventures);
  const typeRaw = readByAliases(row, ['tipo', 'type', 'entity_type']);
  const normalizedType = normalizeText(typeRaw);
  let entityType: EntityType = 'AGENTE';
  if (normalizedType.includes('human')) entityType = 'HUMANO';
  if (normalizedType.includes('hibr') || normalizedType.includes('hybrid')) entityType = 'HIBRIDO';

  const levelRaw = normalizeText(readByAliases(row, ['nivel', 'level', 'tier']));
  const level = levelRaw.includes('estrateg')
    ? 'ESTRATÉGICO'
    : levelRaw.includes('opera')
      ? 'OPERACIONAL'
      : 'TÁTICO';

  const structuralRaw = normalizeText(readByAliases(row, ['status estrutural', 'structural_status', 'structuralstatus']));
  const structuralStatus: StructuralStatus = structuralRaw.includes('ativo')
    ? 'ATIVO'
    : structuralRaw.includes('homo')
      ? 'HOMOLOGACAO'
      : structuralRaw.includes('arquiv')
        ? 'ARQUIVADO'
        : structuralRaw.includes('estrutural')
          ? 'ESTRUTURAL'
          : 'EM_CONFIGURACAO';

  const dnaRaw = normalizeText(readByAliases(row, ['status dna', 'dna_status', 'dnastatus']));
  const dnaStatus: DnaStatus = dnaRaw.includes('completo')
    ? 'DNA_COMPLETO'
    : dnaRaw.includes('parcial')
      ? 'DNA_PARCIAL'
      : dnaRaw.includes('base')
        ? 'DNA_BASE'
        : dnaRaw.includes('revis')
          ? 'REVISAR'
          : 'SEM_DNA';

  const stackRaw = readByAliases(row, ['stack permitida', 'allowed_stacks', 'stack']);
  const parsedStacks = stackRaw
    .split(/[;,|]/)
    .map((part) => normalizeModelValue(part))
    .filter((value): value is ModelProvider => Boolean(value));

  const preferredModel = normalizeModelValue(readByAliases(row, ['modelo preferencial', 'preferred_model', 'model']));
  const ventureRaw = readByAliases(row, ['venture', 'venture_id', 'marca']);
  const roleRaw = normalizeText(readByAliases(row, ['papel', 'role_type'])) || 'execucao';
  const activationRaw = normalizeText(readByAliases(row, ['ativacao operacional', 'operational_activation']));
  const classRaw = normalizeText(readByAliases(row, ['classe operacional', 'operational_class']));

  return {
    ...draft,
    name: readByAliases(row, ['nome', 'name']),
    entityType,
    email: readByAliases(row, ['email', 'e-mail', 'mail']),
    usesEmail: ['HUMANO', 'HIBRIDO'].includes(entityType)
      ? true
      : ['sim', 'yes', 'true', '1'].includes(normalizeText(readByAliases(row, ['usa email', 'uses_email', 'possui email', 'acesso sistema', 'tem acesso']))),
    shortDescription: readByAliases(row, ['descricao', 'descricao curta', 'short_description', 'description']),
    origin: readByAliases(row, ['origem', 'origin']) || batchOrigin,
    ventureId: resolveVentureId(ventureRaw, ventures) || batchVentureId,
    unitName: readByAliases(row, ['unidade', 'unit', 'unit_name']) || activeBU.name,
    area: readByAliases(row, ['area']),
    functionName: readByAliases(row, ['funcao', 'function', 'function_name']),
    baseRoleUniversal: readByAliases(row, ['cargo-base universal', 'base_role_universal', 'base role', 'cargo base']),
    level,
    roleType: roleRaw.includes('lider')
      ? 'LIDERANCA'
      : roleRaw.includes('consult')
        ? 'CONSULTORIA'
        : roleRaw.includes('audit')
          ? 'AUDITORIA'
          : roleRaw.includes('mentor')
            ? 'MENTORIA'
            : roleRaw.includes('apoio')
              ? 'APOIO'
              : 'EXECUCAO',
    structuralStatus,
    operationalActivation: activationRaw.includes('gatilho')
      ? 'PREVISTO_GATILHO'
      : activationRaw.includes('reserv')
        ? 'RESERVADO_FUTURO'
        : activationRaw.includes('compart')
          ? 'COMPARTILHADO'
          : 'ATIVO_NASCIMENTO',
    dnaStatus,
    operationalClass: classRaw.includes('econom')
      ? 'ECONOMICA'
      : classRaw.includes('premium')
        ? 'PREMIUM'
        : classRaw.includes('crit')
          ? 'CRITICA'
          : 'BALANCEADA',
    allowedStacks: parsedStacks.length > 0 ? parsedStacks : draft.allowedStacks,
    preferredModel: preferredModel || (parsedStacks[0] || draft.preferredModel),
    aiMentor: readByAliases(row, ['mentor ia', 'ai_mentor']),
    humanOwner: readByAliases(row, ['responsavel humano', 'human_owner']),
    projectId: readByAliases(row, ['projeto', 'project_id']),
    customFields: []
  };
};
