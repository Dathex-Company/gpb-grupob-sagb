import { centralDocumentsManifest } from '../data/centralDocumentsManifest';
import { centralPadroesFallbackData } from '../data/fallbackData';
import { CentralDocument, CentralDocumentOfficialStatus, DocumentFilter } from '../types';
import { buildDocumentSearchText, enrichDocument } from '../utils/documentNormalizers';
import { centralPadroesCrudService } from './centralPadroesCrudService';

export interface SourceSummary {
  supabaseCount: number;
  fallbackCount: number;
  manifestCount: number;
  dedupedTotal: number;
  canonicalSource: 'supabase' | 'fallback';
  fallbackActive: boolean;
}

const byId = (documents: CentralDocument[]) => {
  const map = new Map<string, CentralDocument>();
  documents.forEach((document) => {
    const enriched = enrichDocument(document);
    const existing = map.get(enriched.id);
    // Último ganha (Supabase sobrescreve fallback/manifest)
    map.set(enriched.id, existing ? { ...existing, ...enriched } : enriched);
  });
  return Array.from(map.values());
};

const applyFilter = (documents: CentralDocument[], filter?: DocumentFilter) => {
  const query = filter?.query?.trim().toLowerCase();
  return documents.filter((document) => {
    if (!filter?.includeDeleted && document.deletedAt) return false;
    if (filter?.status && document.status !== filter.status) return false;
    if (filter?.officialStatus && document.officialStatus !== filter.officialStatus) return false;
    if (filter?.areaId && document.areaId !== filter.areaId) return false;
    if (filter?.type && document.type !== filter.type) return false;
    if (filter?.source && document.source !== filter.source) return false;
    if (filter?.riskLevel && document.riskLevel !== filter.riskLevel) return false;
    if (filter?.owner && document.owner !== filter.owner) return false;
    if (filter?.tag && !(document.tags || []).includes(filter.tag)) return false;
    if (query && !buildDocumentSearchText(document).includes(query)) return false;
    return true;
  });
};

export const centralPadroesDocumentHubService = {
  async listDocuments(filter?: DocumentFilter): Promise<CentralDocument[]> {
    const [liveDocuments] = await Promise.all([
      centralPadroesCrudService.listDocuments().catch(() => []),
    ]);

    const documents = byId([
      ...centralPadroesFallbackData.documents.map((document) => ({ ...document, source: document.source || 'fallback' as const })),
      ...centralDocumentsManifest,
      ...liveDocuments.map((document) => ({ ...document, source: document.source || 'supabase_live' as const }))
    ]).sort((a, b) => a.title.localeCompare(b.title));

    return applyFilter(documents, filter);
  },

  /** Retorna documentos + resumo da origem dos dados */
  async listDocumentsWithSummary(filter?: DocumentFilter): Promise<{ documents: CentralDocument[]; sourceSummary: SourceSummary }> {
    const [liveDocuments] = await Promise.all([
      centralPadroesCrudService.listDocuments().catch(() => []),
    ]);

    const supabaseCount = liveDocuments.length;
    const fallbackCount = centralPadroesFallbackData.documents.length;
    const manifestCount = centralDocumentsManifest.length;

    const documents = byId([
      ...centralPadroesFallbackData.documents.map((d) => ({ ...d, source: d.source || 'fallback' as const })),
      ...centralDocumentsManifest,
      ...liveDocuments.map((d) => ({ ...d, source: d.source || 'supabase_live' as const }))
    ]).sort((a, b) => a.title.localeCompare(b.title));

    const sourceSummary: SourceSummary = {
      supabaseCount,
      fallbackCount,
      manifestCount,
      dedupedTotal: documents.length,
      canonicalSource: supabaseCount > 0 ? 'supabase' : 'fallback',
      fallbackActive: supabaseCount === 0,
    };

    return { documents: applyFilter(documents, filter), sourceSummary };
  },

  async getDocument(id: string): Promise<CentralDocument | null> {
    const { documents } = await this.listDocumentsWithSummary({ includeDeleted: true });
    return documents.find((d) => d.id === id || d.slug === id) || null;
  },

  summarizeGaps(documents: CentralDocument[]) {
    return {
      total: documents.length,
      incomplete: documents.filter((d) => d.isIncomplete).length,
      withoutOwner: documents.filter((d) => !d.owner).length,
      withoutTags: documents.filter((d) => !(d.tags || []).length).length,
      withoutSummary: documents.filter((d) => !d.summary).length,
      withoutContent: documents.filter((d) => d.contentAvailability === 'missing').length
    };
  }
};
