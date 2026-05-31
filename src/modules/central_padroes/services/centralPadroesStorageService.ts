import { restFetch } from '../../../../services/supabase';

export interface CentralPadroesUploadInput {
  title: string;
  sourcePath?: string;
  content?: string;
  sourceKind?: string;
}

export const centralPadroesStorageService = {
  buckets: ['central-padroes-documents', 'central-padroes-evidence', 'central-padroes-templates'],

  async ingestDocument(input: CentralPadroesUploadInput): Promise<string> {
    const data = await restFetch('rpc/central_padroes_ingest_document', {
      method: 'POST',
      body: {
        p_title: input.title,
        p_source_path: input.sourcePath || null,
        p_raw_content: input.content || null,
        p_source_kind: input.sourceKind || 'manual'
      }
    });
    if (typeof data === 'string') return data;
    return String(data || '');
  }
};

