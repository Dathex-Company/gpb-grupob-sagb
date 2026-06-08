import { Agent, BusinessUnit, Venture } from '../../types';
import { AgentFormState } from './types';
import { mapImportRowToForm, parseCsvRecords } from './importHelpers';
import { normalizeAgentName, normalizeCanonicalIdInput, normalizeText, validateAgentNameAvailability } from './helpers';

export type BatchPreviewStatus = 'ok' | 'error' | 'warning';

export interface BatchPreviewRow {
  line: number;
  name: string;
  entityType: string;
  status: BatchPreviewStatus;
  errors: string[];
  warnings: string[];
  draft: AgentFormState;
}

export const OFFICIAL_IMPORT_TEMPLATE_COLUMNS = [
  'nome',
  'tipo',
  'email',
  'venture',
  'unidade',
  'area',
  'funcao',
  'nivel',
  'papel',
  'gestor direto',
  'mentor dai',
  'descricao curta',
  'origem',
  'usa email'
];

export const buildOfficialImportTemplateCsv = () => [
  OFFICIAL_IMPORT_TEMPLATE_COLUMNS.join(','),
  'Liora Savini,AGENTE,,GrupoB,Tecnologia,Governança,Curadora de Identidades,TÁTICO,EXECUCAO,,,Cadastro estrutural inicial,Importação oficial,não',
  'Serena Valmont,HUMANO,serena@empresa.com,GrupoB,Operações,Atendimento,Líder de Atendimento,TÁTICO,LIDERANCA,,,Responsável operacional,Importação oficial,sim'
].join('\n');

export const parseBatchImportRows = (fileName: string, content: string): Array<Record<string, string>> => {
  if (fileName.toLowerCase().endsWith('.json')) {
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) throw new Error('JSON de importação precisa ser um array de objetos.');
    return parsed.map((item) => {
      const row: Record<string, string> = {};
      Object.entries(item || {}).forEach(([key, value]) => {
        row[normalizeText(key)] = String(value ?? '');
      });
      return row;
    });
  }

  return parseCsvRecords(content);
};

const slugPart = (value: string, size: number, fallback: string) => {
  const normalized = normalizeAgentName(value).replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  const compact = normalized.replace(/_/g, '');
  if (size <= 0) return normalized || fallback;
  return (compact || fallback).slice(0, size).padEnd(size, fallback[0] || 'x');
};

const levelCode = (level: string) => {
  const normalized = normalizeText(level);
  if (normalized.includes('estrateg')) return 'e';
  if (normalized.includes('opera')) return 'o';
  return 't';
};

const buildCanonicalId = (draft: AgentFormState, ventureName: string, sequence: number) => {
  const nameSlug = normalizeAgentName(draft.name).replace(/\s+/g, '_') || 'identidade';
  const company3 = slugPart(ventureName || draft.ventureId, 3, 'sag');
  const area3 = slugPart(draft.area || draft.unitName || draft.functionName, 3, 'ger');
  const seq3 = String(sequence).padStart(3, '0');
  return `${nameSlug}_${company3}_${area3}_${levelCode(draft.level)}_${seq3}`;
};

const resolveVentureName = (draft: AgentFormState, ventures: Venture[]) => (
  ventures.find((venture) => venture.id === draft.ventureId)?.name || draft.ventureId || ''
);

export const validateBatchImportRows = ({
  rows,
  agents,
  activeBU,
  ventures,
  batchOrigin,
  batchVentureId
}: {
  rows: Array<Record<string, string>>;
  agents: Agent[];
  activeBU: BusinessUnit;
  ventures: Venture[];
  batchOrigin: string;
  batchVentureId: string;
}): BatchPreviewRow[] => {
  const seenNames = new Map<string, number>();
  const usedCanonicalIds = new Set(agents.map((agent) => normalizeCanonicalIdInput(agent.canonicalId || '')).filter(Boolean));
  let sequence = agents.length + 1;

  return rows.map((row, index) => {
    const line = index + 2;
    const draft = mapImportRowToForm({ row, activeBU, ventures, batchOrigin, batchVentureId });
    const errors: string[] = [];
    const warnings: string[] = [];
    const normalizedName = normalizeAgentName(draft.name);

    if (!draft.name.trim()) errors.push('Nome obrigatório ausente.');
    if (!['HUMANO', 'AGENTE', 'HIBRIDO'].includes(draft.entityType)) errors.push('Tipo inválido. Use HUMANO, AGENTE ou HIBRIDO.');
    if (!draft.ventureId) errors.push('Venture obrigatória ausente ou inválida.');
    if (!draft.functionName.trim()) errors.push('Função obrigatória ausente.');
    if ((draft.entityType === 'HUMANO' || draft.entityType === 'HIBRIDO' || draft.usesEmail) && !draft.email.trim()) {
      errors.push('E-mail obrigatório ausente para este tipo.');
    }

    if (normalizedName) {
      const duplicateLine = seenNames.get(normalizedName);
      if (duplicateLine) errors.push(`Nome duplicado dentro do arquivo. Já apareceu na linha ${duplicateLine}.`);
      else seenNames.set(normalizedName, line);

      const validation = validateAgentNameAvailability(draft.name, agents, null);
      if (validation.status === 'duplicate') errors.push(validation.message);
      if (validation.status === 'similar') warnings.push(validation.message);
    }

    if (draft.humanOwner && !agents.some((agent) => normalizeAgentName(agent.name) === normalizeAgentName(draft.humanOwner))) {
      warnings.push('Gestor direto não encontrado nos cadastros atuais. Será salvo como texto.');
    }
    if (draft.aiMentor && !agents.some((agent) => normalizeAgentName(agent.name) === normalizeAgentName(draft.aiMentor))) {
      warnings.push('Mentor DAI não encontrado nos cadastros atuais. Será salvo como texto.');
    }
    if (draft.unitName && normalizeText(draft.unitName) !== normalizeText(activeBU.name)) {
      warnings.push('Unidade será salva como texto livre; confirme padronização.');
    }
    if (draft.area && draft.area.length < 3) warnings.push('Área parece curta ou pouco padronizada.');

    if (!draft.canonicalId.trim()) {
      do {
        draft.canonicalId = buildCanonicalId(draft, resolveVentureName(draft, ventures), sequence);
        sequence += 1;
      } while (usedCanonicalIds.has(normalizeCanonicalIdInput(draft.canonicalId)));
      usedCanonicalIds.add(normalizeCanonicalIdInput(draft.canonicalId));
    }

    draft.dnaStatus = 'SEM_DNA';
    draft.operationalStatus = 'ESTRUTURAL';

    return {
      line,
      name: draft.name,
      entityType: draft.entityType,
      status: errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'ok',
      errors,
      warnings,
      draft
    };
  });
};

