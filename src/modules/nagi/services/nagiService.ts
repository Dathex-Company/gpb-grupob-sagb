import { TabId } from '../../../../types';
import {
  NagiItem,
  NagiOriginType,
  NagiItemType,
  NagiMaturityStage,
  NagiPriority,
  NagiOperationalStatus,
  NagiGovernanceStatus,
  NagiScore,
  NagiDecisionAction,
  NagiEvidence,
  NagiDecisionEntry,
  MATURITY_STAGES,
  calculateFinalScore,
  isEligibleForPromotion,
} from '../domain/types';
import { nagiRepository } from '../repository/nagi.repository';
import { CATALOG_ITEMS, TRIAGE_ITEMS } from '../data/nagiBlueprint';

/* ──────────────────────────────────────────────
 * NAGI V2 — Serviço central de governança
 * ────────────────────────────────────────────── */

let uidCounter = Date.now();
function genId(): string {
  return `nagi_${++uidCounter}`;
}

/* ── Inicialização: carrega dados blueprint se vazio ─── */

function ensureSeeded(): void {
  const existing = nagiRepository.getAll();
  if (existing.length === 0) {
    nagiRepository.saveAll([...CATALOG_ITEMS, ...TRIAGE_ITEMS]);
  }
}

/* ── CRUD ─────────────────────────────────────── */

export function getAllItems(): NagiItem[] {
  ensureSeeded();
  return nagiRepository.getAll();
}

export function getCatalogItems(): NagiItem[] {
  ensureSeeded();
  return nagiRepository.getAll().filter((i) => i.isCatalog);
}

export function getTriageItems(): NagiItem[] {
  ensureSeeded();
  return nagiRepository.getAll().filter((i) => !i.isCatalog);
}

export function getItemById(id: string): NagiItem | undefined {
  ensureSeeded();
  return nagiRepository.getById(id);
}

/* ── Criar item avulso ────────────────────────── */

export function createAvulso(params: {
  title: string;
  summary: string;
  itemType: NagiItemType;
  category: string;
  tags?: string[];
  ownerName?: string;
  ownerUserId?: string;
}): NagiItem {
  const now = new Date().toISOString();
  const item: NagiItem = {
    id: genId(),
    title: params.title,
    summary: params.summary,
    createdAt: now,
    updatedAt: now,
    originType: 'avulsa',
    itemType: params.itemType,
    category: params.category,
    tags: params.tags ?? [],
    maturityStage: 'entrada',
    priority: 'media',
    score: {
      impact: 0,
      effort: 0,
      risk: 0,
      alignment: 0,
      final: 0,
      updatedAt: now,
    },
    operationalStatus: 'nao_iniciado',
    governanceStatus: 'em_triagem',
    promotionStatus: 'nao_elegivel',
    evidences: [],
    decisionHistory: [],
    isCatalog: false,
    ownerName: params.ownerName,
    ownerUserId: params.ownerUserId,
  };
  nagiRepository.create(item);
  return item;
}

/* ── Criar item diretamente no catálogo ───────── */

export function createFromCatalogo(params: {
  title: string;
  summary: string;
  itemType: NagiItemType;
  category: string;
  tags?: string[];
  originRefId?: string;
}): NagiItem {
  const now = new Date().toISOString();
  const item: NagiItem = {
    id: genId(),
    title: params.title,
    summary: params.summary,
    createdAt: now,
    updatedAt: now,
    originType: 'catalogo',
    originRefId: params.originRefId,
    itemType: params.itemType,
    category: params.category,
    tags: params.tags ?? [],
    maturityStage: 'catalogada',
    priority: 'media',
    score: {
      impact: 0,
      effort: 0,
      risk: 0,
      alignment: 0,
      final: 0,
      updatedAt: now,
    },
    operationalStatus: 'nao_iniciado',
    governanceStatus: 'aprovada',
    promotionStatus: 'promovida',
    evidences: [],
    decisionHistory: [],
    isCatalog: true,
  };
  nagiRepository.create(item);
  return item;
}

/* ── Classificar ──────────────────────────────── */

export function classifyItem(
  id: string,
  updates: {
    itemType?: NagiItemType;
    category?: string;
    tags?: string[];
  },
  by: string,
  byUserId?: string,
): NagiItem | null {
  const item = nagiRepository.getById(id);
  if (!item) return null;

  if (updates.itemType) item.itemType = updates.itemType;
  if (updates.category) item.category = updates.category;
  if (updates.tags) item.tags = updates.tags;
  item.maturityStage = 'classificacao';
  item.governanceStatus = 'em_analise';
  item.updatedAt = new Date().toISOString();
  item.decisionHistory.push({
    id: genId(),
    at: new Date().toISOString(),
    by,
    byUserId,
    action: 'classificar',
    rationale: `Classificado como ${updates.itemType ?? item.itemType}`,
    toStage: 'classificacao',
  });

  nagiRepository.save(item);
  return item;
}

/* ── Qualificar (preencher score) ─────────────── */

export function qualifyItem(
  id: string,
  score: { impact: number; effort: number; risk: number; alignment: number },
  by: string,
  byUserId?: string,
): NagiItem | null {
  const item = nagiRepository.getById(id);
  if (!item) return null;

  const now = new Date().toISOString();
  item.score = {
    ...score,
    final: calculateFinalScore(score),
    updatedAt: now,
  };
  item.maturityStage = 'qualificacao';
  item.updatedAt = now;
  item.decisionHistory.push({
    id: genId(),
    at: now,
    by,
    byUserId,
    action: 'qualificar',
    rationale: `Score: impacto=${score.impact} esforço=${score.effort} risco=${score.risk} alinhamento=${score.alignment} → final=${item.score.final}`,
    toStage: 'qualificacao',
  });

  /* Atualiza elegibilidade */
  item.promotionStatus = isEligibleForPromotion(item) ? 'elegivel' : 'nao_elegivel';

  nagiRepository.save(item);
  return item;
}

/* ── Priorizar ────────────────────────────────── */

export function prioritizeItem(
  id: string,
  priority: NagiPriority,
  by: string,
  byUserId?: string,
): NagiItem | null {
  const item = nagiRepository.getById(id);
  if (!item) return null;

  item.priority = priority;
  item.maturityStage = 'priorizacao';
  item.updatedAt = new Date().toISOString();
  item.decisionHistory.push({
    id: genId(),
    at: new Date().toISOString(),
    by,
    byUserId,
    action: 'priorizar',
    rationale: `Prioridade definida como ${priority}`,
    toStage: 'priorizacao',
  });

  nagiRepository.save(item);
  return item;
}

/* ── Decidir (governança) ─────────────────────── */

export function decideItem(
  id: string,
  decision: {
    governanceStatus: NagiGovernanceStatus;
    rationale: string;
  },
  by: string,
  byUserId?: string,
): NagiItem | null {
  const item = nagiRepository.getById(id);
  if (!item) return null;

  const prevGovernance = item.governanceStatus;
  item.governanceStatus = decision.governanceStatus;
  item.maturityStage = 'decisao';
  item.updatedAt = new Date().toISOString();

  let action: NagiDecisionAction = 'aprovar';
  if (decision.governanceStatus === 'rejeitada') action = 'rejeitar';
  else if (decision.governanceStatus === 'incubada') action = 'incubar';
  else if (decision.governanceStatus === 'arquivada') action = 'arquivar';

  item.decisionHistory.push({
    id: genId(),
    at: new Date().toISOString(),
    by,
    byUserId,
    action,
    rationale: decision.rationale,
    fromGovernance: prevGovernance,
    toGovernance: decision.governanceStatus,
    toStage: 'decisao',
  });

  /* Reavalia elegibilidade após decisão */
  item.promotionStatus = isEligibleForPromotion(item) ? 'elegivel' : 'nao_elegivel';

  nagiRepository.save(item);
  return item;
}

/* ── Encaminhar para especialista ─────────────── */

export function encaminharItem(
  id: string,
  target: { tab: TabId; label: string; routingReason: string },
  by: string,
  byUserId?: string,
): NagiItem | null {
  const item = nagiRepository.getById(id);
  if (!item) return null;

  const now = new Date().toISOString();
  item.specialistTarget = { ...target, routedAt: now };
  item.maturityStage = 'encaminhada';
  item.updatedAt = now;
  item.decisionHistory.push({
    id: genId(),
    at: now,
    by,
    byUserId,
    action: 'encaminhar',
    rationale: `Encaminhado para ${target.label}: ${target.routingReason}`,
    toStage: 'encaminhada',
  });

  nagiRepository.save(item);
  return item;
}

/* ── Adicionar evidência ──────────────────────── */

export function addEvidence(
  id: string,
  evidence: Omit<NagiEvidence, 'id' | 'createdAt'>,
): NagiItem | null {
  const item = nagiRepository.getById(id);
  if (!item) return null;

  item.evidences.push({
    ...evidence,
    id: genId(),
    createdAt: new Date().toISOString(),
  });
  item.updatedAt = new Date().toISOString();
  nagiRepository.save(item);
  return item;
}

/* ── Editar metadados ─────────────────────────── */

export function updateItemMeta(
  id: string,
  updates: Partial<Pick<NagiItem, 'title' | 'summary' | 'category' | 'tags' | 'operationalStatus' | 'ownerName' | 'ownerUserId'>>,
): NagiItem | null {
  const item = nagiRepository.getById(id);
  if (!item) return null;

  Object.assign(item, updates);
  item.updatedAt = new Date().toISOString();
  nagiRepository.save(item);
  return item;
}

/* ── Reset / recarregar dados blueprint ───────── */

export function resetToBlueprint(): void {
  nagiRepository.reset([...CATALOG_ITEMS, ...TRIAGE_ITEMS]);
}
