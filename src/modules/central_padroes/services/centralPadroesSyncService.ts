import { officialDocumentsIndex } from '../data/officialDocumentsIndex';
import { centralPadroesFallbackData } from '../data/fallbackData';
import { centralDocumentsManifest } from '../data/centralDocumentsManifest';
import { centralPadroesCrudService } from './centralPadroesCrudService';

export interface SyncStatus {
  supabaseConnected: boolean;
  supabaseDocumentCount: number;
  localIndexCount: number;
  fallbackCount: number;
  manifestCount: number;
  canonicalSource: 'supabase' | 'fallback';
  fallbackActive: boolean;
  estimatedDivergent: number;
  lastImport: string | null;
  conflicts: number;
  pendingCreations: number;
  pendingUpdates: number;
}

export const centralPadroesSyncService = {
  async getSyncStatus(): Promise<SyncStatus> {
    let supabaseCount = 0;
    let supabaseConnected = false;

    try {
      const docs = await centralPadroesCrudService.listDocuments();
      supabaseCount = docs.length;
      supabaseConnected = supabaseCount > 0;
    } catch { /* offline */ }

    const localCount = officialDocumentsIndex.length;
    const fallbackCount = centralPadroesFallbackData.documents.length;
    const manifestCount = centralDocumentsManifest.length;

    return {
      supabaseConnected,
      supabaseDocumentCount: supabaseCount,
      localIndexCount: localCount,
      fallbackCount,
      manifestCount,
      canonicalSource: supabaseConnected ? 'supabase' : 'fallback',
      fallbackActive: !supabaseConnected,
      estimatedDivergent: Math.abs(supabaseCount - localCount),
      lastImport: null,
      conflicts: 0,
      pendingCreations: Math.max(0, localCount - supabaseCount),
      pendingUpdates: 0,
    };
  },
};
