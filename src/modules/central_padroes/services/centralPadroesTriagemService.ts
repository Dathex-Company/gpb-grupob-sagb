import { restFetch } from '../../../../services/supabase';
import { centralPadroesFallbackData } from '../data/fallbackData';
import { CentralIngestionItem } from '../types';

const mapItem = (row: any): CentralIngestionItem => ({
  id: row.id,
  title: row.title,
  sourcePath: row.source_path,
  sourceKind: row.source_kind,
  suggestedAreaId: row.suggested_area_id,
  suggestedDestination: row.suggested_destination || 'apoio',
  confidence: Number(row.confidence || 0),
  status: row.status,
  createdAt: row.created_at
});

export const centralPadroesTriagemService = {
  async listQueue(): Promise<CentralIngestionItem[]> {
    try {
      const query = new URLSearchParams({ select: '*', order: 'created_at.desc' });
      const data = await restFetch('central_padroes_ingestion_queue', { method: 'GET', query });
      return Array.isArray(data) ? data.map(mapItem) : [];
    } catch {
      return centralPadroesFallbackData.documents.map((doc) => ({ id: doc.id, title: doc.title, sourcePath: doc.path, sourceKind: 'fallback', suggestedAreaId: doc.areaId, suggestedDestination: doc.shouldBecome, confidence: 65, status: 'queued', createdAt: new Date().toISOString() }));
    }
  },

  async acceptSuggestion(id: string): Promise<void> {
    const query = new URLSearchParams({ id: `eq.${id}` });
    await restFetch('central_padroes_ingestion_queue', { method: 'PATCH', query, body: { status: 'accepted', updated_at: new Date().toISOString() } });
  },

  async ignore(id: string): Promise<void> {
    const query = new URLSearchParams({ id: `eq.${id}` });
    await restFetch('central_padroes_ingestion_queue', { method: 'PATCH', query, body: { status: 'ignored', updated_at: new Date().toISOString() } });
  }
};

