import {
  CentralCanonicalLevel,
  CentralDocument,
  CentralDocumentContentAvailability,
  CentralDocumentOfficialStatus,
  CentralDocumentSource,
  CentralDocumentStatus,
  CentralDocumentType,
  CentralRiskLevel
} from '../types';

const slugify = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'documento';

export const normalizeDocumentStatus = (value?: string | null): CentralDocumentStatus => {
  const normalized = String(value || '').trim().toLowerCase();
  if (['canonico', 'canônico', 'canonical', 'canonico_oficial', 'publicado'].includes(normalized)) return 'canonico';
  if (['revisao', 'revisão', 'em_revisao', 'em revisão', 'review'].includes(normalized)) return 'revisao';
  if (['bruto', 'draft', 'rascunho'].includes(normalized)) return 'bruto';
  if (['legado', 'legacy', 'obsoleto'].includes(normalized)) return 'legado';
  if (['externo', 'external'].includes(normalized)) return 'externo';
  if (['registro', 'record'].includes(normalized)) return 'registro';
  if (['previsto', 'planned'].includes(normalized)) return 'previsto';
  if (['arquivado', 'archive', 'archived'].includes(normalized)) return 'arquivado';
  if (['bloqueado', 'blocked'].includes(normalized)) return 'bloqueado';
  return 'bruto';
};

export const normalizeDocumentType = (value?: string | null): CentralDocumentType => {
  const normalized = String(value || '').trim().toLowerCase().replace(/\s+/g, '_');
  if (['documento_mestre', 'documento-mestre', 'dm'].includes(normalized)) return 'documento_mestre';
  if (['padrao', 'padrão', 'standard'].includes(normalized)) return 'padrao';
  if (['plano', 'plan'].includes(normalized)) return 'plano';
  if (['relatorio', 'relatório', 'report'].includes(normalized)) return 'relatorio';
  if (['auditoria', 'audit'].includes(normalized)) return 'auditoria';
  if (['checklist'].includes(normalized)) return 'checklist';
  if (['evidencia', 'evidência', 'evidence'].includes(normalized)) return 'evidencia';
  if (['registro', 'record'].includes(normalized)) return 'registro';
  if (['guia', 'guide', 'manual'].includes(normalized)) return 'guia';
  if (['template', 'modelo'].includes(normalized)) return 'template';
  if (['externo', 'external'].includes(normalized)) return 'externo';
  if (['apoio', 'support'].includes(normalized)) return 'apoio';
  return 'desconhecido';
};

export const normalizeOfficialStatus = (value?: string | null): CentralDocumentOfficialStatus => {
  const normalized = String(value || '').trim().toLowerCase();
  if (['oficial_ativo', 'oficial ativo', 'ativo', 'active', 'published'].includes(normalized)) return 'oficial_ativo';
  if (['em_revisao', 'em revisão', 'revisao', 'review'].includes(normalized)) return 'em_revisao';
  if (['rascunho', 'draft'].includes(normalized)) return 'rascunho';
  if (['incompleto', 'incomplete'].includes(normalized)) return 'incompleto';
  if (['legado', 'legacy'].includes(normalized)) return 'legado';
  if (['fonte_bruta', 'fonte bruta', 'raw'].includes(normalized)) return 'fonte_bruta';
  if (['curadoria', 'curation'].includes(normalized)) return 'curadoria';
  if (['externo', 'external'].includes(normalized)) return 'externo';
  return 'incompleto';
};

export const officialStatusLabel: Record<CentralDocumentOfficialStatus, string> = {
  oficial_ativo: 'Oficial ativo',
  em_revisao: 'Em revisão',
  rascunho: 'Rascunho',
  incompleto: 'Incompleto',
  legado: 'Legado',
  fonte_bruta: 'Fonte bruta',
  curadoria: 'Curadoria',
  externo: 'Externo'
};

export const normalizeRiskLevel = (value?: string | null): CentralRiskLevel => {
  const normalized = String(value || '').trim().toLowerCase();
  if (['critico', 'crítico', 'critical'].includes(normalized)) return 'critico';
  if (['alto', 'high'].includes(normalized)) return 'alto';
  if (['medio', 'médio', 'medium'].includes(normalized)) return 'medio';
  return 'baixo';
};

export const normalizeDocumentSource = (value?: string | null): CentralDocumentSource => {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'supabase_live') return 'supabase_live';
  if (normalized === 'md_indexado') return 'md_indexado';
  if (normalized === 'governance_report') return 'governance_report';
  if (normalized === 'governance_audit') return 'governance_audit';
  if (normalized === 'governance_curadoria') return 'governance_curadoria';
  if (normalized === 'trace_log') return 'trace_log';
  if (normalized === 'manual') return 'manual';
  if (normalized === 'external') return 'external';
  return 'fallback';
};

export const normalizeCanonicalLevel = (value?: string | null, status?: CentralDocumentStatus): CentralCanonicalLevel => {
  const normalized = String(value || '').trim().toLowerCase();
  if (['oficial', 'canonico_oficial', 'canônico oficial'].includes(normalized) || status === 'canonico') return 'oficial';
  if (['operacional', 'canonico_operacional'].includes(normalized)) return 'operacional';
  if (['candidato', 'candidate'].includes(normalized) || status === 'revisao') return 'candidato';
  if (['legado', 'legacy'].includes(normalized) || status === 'legado') return 'legado';
  if (['previsto', 'planned'].includes(normalized) || status === 'previsto') return 'previsto';
  return 'nao_canonico';
};

export const resolveContentAvailability = (document: Pick<CentralDocument, 'content' | 'path' | 'pathRelative' | 'pathAbsolute' | 'source'>): CentralDocumentContentAvailability => {
  if (document.content?.trim()) return 'available';
  if (document.source === 'external') return 'external';
  if ((document.path || document.pathRelative || document.pathAbsolute || '').includes('storage/')) return 'storage_only';
  return 'missing';
};

export const enrichDocument = (document: CentralDocument): CentralDocument => {
  const status = normalizeDocumentStatus(document.status);
  const officialStatus = document.officialStatus || normalizeOfficialStatus(document.status);
  const type = normalizeDocumentType(document.type || document.shouldBecome || document.category);
  const riskLevel = normalizeRiskLevel(document.riskLevel);
  const source = normalizeDocumentSource(document.source);
  const canonicalLevel = normalizeCanonicalLevel(document.canonicalLevel, status);
  const pathRelative = document.pathRelative || document.path || null;
  const tags = Array.isArray(document.tags) ? document.tags.filter(Boolean) : [];
  const contentAvailability = document.contentAvailability || resolveContentAvailability({ ...document, source, pathRelative });
  const incompleteReasons = [
    !document.owner ? 'sem_owner' : null,
    !document.summary ? 'sem_resumo' : null,
    !tags.length ? 'sem_tags' : null,
    contentAvailability === 'missing' ? 'sem_conteudo' : null,
    !pathRelative && !document.pathAbsolute ? 'sem_caminho' : null
  ].filter(Boolean) as string[];

  return {
    ...document,
    slug: document.slug || slugify(document.title),
    status,
    officialStatus,
    type,
    riskLevel,
    source,
    canonicalLevel,
    pathRelative,
    path: document.path || pathRelative || '',
    tags,
    contentAvailability,
    isIncomplete: incompleteReasons.length > 0,
    incompleteReasons
  };
};

export const buildDocumentSearchText = (document: CentralDocument) => [
  document.title,
  document.summary,
  document.category,
  document.areaId,
  document.owner,
  document.type,
  document.status,
  document.riskLevel,
  document.source,
  document.canonicalLevel,
  document.path,
  document.pathRelative,
  document.pathAbsolute,
  ...(document.tags || [])
].filter(Boolean).join(' ').toLowerCase();

