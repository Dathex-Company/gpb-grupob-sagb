import {
  NagiEvidence,
  NagiIngestionDestination,
  NagiIngestionDocument,
  NagiIngestionSourceType,
  NagiItem,
  NagiItemType,
} from '../domain/types';
import { nagiIngestionRepository } from '../repository/nagiIngestion.repository';
import { nagiRepository } from '../repository/nagi.repository';
import { classifyIngestionText, reclassifyDocument } from './nagiIngestionClassifier';
import { createAvulso, createFromCatalogo, getCatalogItems } from './nagiService';

/* ──────────────────────────────────────────────
 * NAGI V3 — Serviço de ingestão governada
 * Documento entra → vira candidato → revisão humana → item/evidência
 * ────────────────────────────────────────────── */

let uidCounter = Date.now();
function genId(prefix = 'ing'): string {
  return `${prefix}_${++uidCounter}`;
}

export interface CreateIngestionDocumentInput {
  sourceType: NagiIngestionSourceType;
  sourceLabel?: string;
  fileName?: string;
  originalText: string;
}

export interface IngestionReviewPatch {
  extractedTitle?: string;
  extractedSummary?: string;
  extractedTags?: string[];
  extractedTypeSuggestion?: NagiItemType;
  extractedCategorySuggestion?: string;
  chosenDestination?: Exclude<NagiIngestionDestination, 'revisao_manual'>;
  selectedCatalogItemId?: string;
}

function history(action: string, note: string, by = 'Cássio') {
  return {
    id: genId('hist'),
    at: new Date().toISOString(),
    by,
    action,
    note,
  };
}

function ensureCleanText(text: string): string {
  return text.replace(/\u0000/g, '').trim();
}

export function getIngestionDocuments(): NagiIngestionDocument[] {
  return nagiIngestionRepository
    .getAll()
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
}

export function getIngestionDocumentById(id: string): NagiIngestionDocument | undefined {
  return nagiIngestionRepository.getById(id);
}

export function createIngestionDocument(input: CreateIngestionDocumentInput): NagiIngestionDocument {
  const originalText = ensureCleanText(input.originalText);
  const now = new Date().toISOString();
  const draft = classifyIngestionText(originalText, input.fileName, getCatalogItems());

  const doc: NagiIngestionDocument = {
    id: genId('doc'),
    sourceType: input.sourceType,
    sourceLabel: input.sourceLabel ?? (input.sourceType === 'texto_colado' ? 'Texto colado' : 'Documento recebido'),
    fileName: input.fileName,
    originalText,
    extractedTitle: draft.title,
    extractedSummary: draft.summary,
    extractedTags: draft.tags,
    extractedSignals: draft.signals,
    extractedTypeSuggestion: draft.typeSuggestion,
    extractedCategorySuggestion: draft.categorySuggestion,
    relatedCatalogCandidates: draft.relatedCatalogCandidates,
    classificationStatus: draft.classificationStatus,
    reviewStatus: draft.suggestedDestination === 'revisao_manual' ? 'em_revisao' : 'pronto_para_salvar',
    interpretation: draft.interpretation,
    suggestedDestination: draft.suggestedDestination,
    chosenDestination: draft.suggestedDestination === 'revisao_manual' ? undefined : draft.suggestedDestination,
    selectedCatalogItemId: draft.relatedCatalogCandidates[0]?.confidence >= 45 ? draft.relatedCatalogCandidates[0].itemId : undefined,
    confidence: draft.confidence,
    createdAt: now,
    updatedAt: now,
    history: [history('recebido', 'Documento recebido e lido pelo NAGI.')],
  };

  nagiIngestionRepository.create(doc);
  return doc;
}

export function createIngestionBatch(inputs: CreateIngestionDocumentInput[]): NagiIngestionDocument[] {
  const docs = inputs
    .map((input) => ({ ...input, originalText: ensureCleanText(input.originalText) }))
    .filter((input) => input.originalText.length > 0)
    .map(createIngestionDocument);
  return docs;
}

export function updateIngestionReview(id: string, patch: IngestionReviewPatch, by = 'Cássio'): NagiIngestionDocument | null {
  const doc = nagiIngestionRepository.getById(id);
  if (!doc) return null;

  const updated: NagiIngestionDocument = {
    ...doc,
    ...patch,
    reviewStatus: patch.chosenDestination ? 'pronto_para_salvar' : doc.reviewStatus,
    updatedAt: new Date().toISOString(),
    history: [...doc.history, history('revisado', 'Campos revisados antes de salvar.', by)],
  };

  nagiIngestionRepository.save(updated);
  return updated;
}

export function reclassifyIngestionDocument(id: string, by = 'Cássio'): NagiIngestionDocument | null {
  const doc = nagiIngestionRepository.getById(id);
  if (!doc) return null;
  const reclassified = reclassifyDocument(doc, getCatalogItems());
  reclassified.history = [...doc.history, history('reclassificado', 'Sugestões atualizadas a partir do conteúdo.', by)];
  nagiIngestionRepository.save(reclassified);
  return reclassified;
}

function evidenceFromDocument(doc: NagiIngestionDocument): NagiEvidence {
  return {
    id: genId('ev'),
    type: 'doc',
    label: doc.fileName || doc.sourceLabel || doc.extractedTitle,
    uri: `nagi-ingestion://${doc.id}`,
    excerpt: doc.extractedSummary,
    createdAt: new Date().toISOString(),
  };
}

function appendEvidenceToExistingItem(itemId: string, doc: NagiIngestionDocument, by = 'Cássio'): NagiItem | null {
  const item = nagiRepository.getById(itemId);
  if (!item) return null;
  const now = new Date().toISOString();
  item.evidences.push(evidenceFromDocument(doc));
  item.originSnapshot = item.originSnapshot || doc.originalText.slice(0, 1200);
  item.updatedAt = now;
  item.decisionHistory.push({
    id: genId('dec'),
    at: now,
    by,
    action: 'classificar',
    rationale: `Documento vinculado como evidência a partir da ingestão: ${doc.extractedTitle}`,
  });
  nagiRepository.save(item);
  return item;
}

export function saveIngestionAsItem(id: string, destination?: Exclude<NagiIngestionDestination, 'revisao_manual'>, by = 'Cássio'):
  { success: boolean; reason?: string; item?: NagiItem; doc?: NagiIngestionDocument } {
  const doc = nagiIngestionRepository.getById(id);
  if (!doc) return { success: false, reason: 'Documento não encontrado.' };
  if (doc.reviewStatus === 'salvo') return { success: false, reason: 'Documento já foi salvo como item.' };

  const finalDestination = destination ?? doc.chosenDestination ?? (doc.suggestedDestination === 'catalogo' || doc.suggestedDestination === 'triagem' ? doc.suggestedDestination : undefined);
  if (!finalDestination) return { success: false, reason: 'Escolha Catálogo ou Triagem antes de salvar.' };

  const now = new Date().toISOString();
  let item: NagiItem;

  if (doc.selectedCatalogItemId && finalDestination === 'catalogo') {
    const existing = appendEvidenceToExistingItem(doc.selectedCatalogItemId, doc, by);
    if (!existing) return { success: false, reason: 'Item do catálogo não encontrado.' };
    item = existing;
  } else if (finalDestination === 'catalogo') {
    item = createFromCatalogo({
      title: doc.extractedTitle,
      summary: doc.extractedSummary,
      itemType: doc.extractedTypeSuggestion,
      category: doc.extractedCategorySuggestion,
      tags: doc.extractedTags,
      originRefId: doc.id,
    });
    item.originSnapshot = doc.originalText.slice(0, 1600);
    item.evidences.push(evidenceFromDocument(doc));
    item.decisionHistory.push({
      id: genId('dec'),
      at: now,
      by,
      action: 'promover',
      rationale: `Criado no catálogo a partir de documento recebido no NAGI: ${doc.extractedTitle}`,
      toStage: 'catalogada',
    });
    nagiRepository.save(item);
  } else {
    item = createAvulso({
      title: doc.extractedTitle,
      summary: doc.extractedSummary,
      itemType: doc.extractedTypeSuggestion,
      category: doc.extractedCategorySuggestion,
      tags: doc.extractedTags,
      ownerName: by,
    });
    item.originType = doc.sourceType === 'nic' ? 'nic' : 'avulsa';
    item.originRefId = doc.id;
    item.originSnapshot = doc.originalText.slice(0, 1600);
    item.maturityStage = 'classificacao';
    item.governanceStatus = 'em_analise';
    item.evidences.push(evidenceFromDocument(doc));
    item.decisionHistory.push({
      id: genId('dec'),
      at: now,
      by,
      action: 'classificar',
      rationale: `Criado em triagem a partir de documento recebido no NAGI: ${doc.extractedTitle}`,
      toStage: 'classificacao',
    });
    nagiRepository.save(item);
  }

  const savedDoc: NagiIngestionDocument = {
    ...doc,
    chosenDestination: finalDestination,
    createdItemId: item.id,
    reviewStatus: 'salvo',
    classificationStatus: 'classificado',
    updatedAt: now,
    history: [...doc.history, history('salvo', `Documento salvo como item em ${finalDestination === 'catalogo' ? 'Catálogo' : 'Triagem'}.`, by)],
  };
  nagiIngestionRepository.save(savedDoc);

  return { success: true, item, doc: savedDoc };
}

export function saveManyIngestionDocuments(ids: string[], destination: Exclude<NagiIngestionDestination, 'revisao_manual'>, by = 'Cássio') {
  return ids.map((id) => saveIngestionAsItem(id, destination, by));
}

export function discardIngestionDocument(id: string, note = 'Documento descartado na revisão.', by = 'Cássio'): NagiIngestionDocument | null {
  const doc = nagiIngestionRepository.getById(id);
  if (!doc) return null;
  const updated: NagiIngestionDocument = {
    ...doc,
    classificationStatus: 'descartado',
    reviewStatus: 'descartado',
    updatedAt: new Date().toISOString(),
    history: [...doc.history, history('descartado', note, by)],
  };
  nagiIngestionRepository.save(updated);
  return updated;
}

export function resetIngestionDocuments(): void {
  nagiIngestionRepository.reset();
}
