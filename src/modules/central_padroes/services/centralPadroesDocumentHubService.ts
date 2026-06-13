import { centralDocumentsManifest } from '../data/centralDocumentsManifest';
import { centralPadroesFallbackData } from '../data/fallbackData';
import { CentralDocument, DocumentFilter } from '../types';
import { buildDocumentSearchText, enrichDocument } from '../utils/documentNormalizers';
import { centralPadroesCrudService } from './centralPadroesCrudService';

const byId = (documents: CentralDocument[]) => {
  const map = new Map<string, CentralDocument>();
  documents.forEach((document) => {
    const enriched = enrichDocument(document);
    const existing = map.get(enriched.id);
    map.set(enriched.id, existing ? { ...existing, ...enriched } : enriched);
  });
  return Array.from(map.values());
};

const applyFilter = (documents: CentralDocument[], filter?: DocumentFilter) => {
  const query = filter?.query?.trim().toLowerCase();
  return documents.filter((document) => {
    if (!filter?.includeDeleted && document.deletedAt) return false;
    if (filter?.status && document.status !== filter.status) return false;
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

  async getDocument(id: string): Promise<CentralDocument | null> {
    const documents = await this.listDocuments({ includeDeleted: true });
    return documents.find((document) => document.id === id || document.slug === id) || null;
  },

  summarizeGaps(documents: CentralDocument[]) {
    return {
      total: documents.length,
      incomplete: documents.filter((document) => document.isIncomplete).length,
      withoutOwner: documents.filter((document) => !document.owner).length,
      withoutTags: documents.filter((document) => !(document.tags || []).length).length,
      withoutSummary: documents.filter((document) => !document.summary).length,
      withoutContent: documents.filter((document) => document.contentAvailability === 'missing').length
    };
  }
};

