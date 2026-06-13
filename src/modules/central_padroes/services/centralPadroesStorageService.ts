import { getSupabaseAccessToken, restFetch, supabaseConfig } from '../../../../services/supabase';

export interface CentralPadroesUploadInput {
  title: string;
  sourcePath?: string;
  content?: string;
  sourceKind?: string;
  storageBucket?: 'cp-documents' | 'cp-evidence';
  storagePath?: string;
  owner?: string;
  tags?: string[];
  riskLevel?: string;
  module?: string;
  division?: string;
  createDocument?: boolean;
}

export interface CentralPadroesStorageUploadResult {
  bucket: 'cp-documents' | 'cp-evidence';
  path: string;
  size: number;
  contentType: string;
}

const safeFileName = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9._-]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'arquivo.md';

const uploadToStorage = async (bucket: 'cp-documents' | 'cp-evidence', path: string, file: Blob, contentType: string): Promise<CentralPadroesStorageUploadResult> => {
  if (!supabaseConfig.url || !supabaseConfig.anonKey) throw new Error('Supabase não configurado para upload.');
  const token = getSupabaseAccessToken();
  const response = await fetch(`${supabaseConfig.url}/storage/v1/object/${bucket}/${path}`, {
    method: 'POST',
    headers: {
      apikey: supabaseConfig.anonKey,
      Authorization: `Bearer ${token || supabaseConfig.anonKey}`,
      'Content-Type': contentType,
      'x-upsert': 'true'
    },
    body: file
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Falha no upload para ${bucket}/${path}: ${response.status} ${text}`);
  }
  return { bucket, path, size: file.size, contentType };
};

export const centralPadroesStorageService = {
  buckets: ['cp-documents', 'cp-evidence'],

  async ingestDocument(input: CentralPadroesUploadInput): Promise<string> {
    const data = await restFetch('rpc/central_padroes_ingest_document', {
      method: 'POST',
      body: {
        p_title: input.title,
        p_source_path: input.sourcePath || null,
        p_raw_content: input.content || null,
        p_source_kind: input.sourceKind || 'manual',
        p_storage_bucket: input.storageBucket || null,
        p_storage_path: input.storagePath || null,
        p_owner: input.owner || null,
        p_tags: input.tags || [],
        p_risk_level: input.riskLevel || 'baixo',
        p_module: input.module || null,
        p_division: input.division || null,
        p_create_document: Boolean(input.createDocument)
      }
    });
    if (typeof data === 'string') return data;
    return JSON.stringify(data || {});
  },

  buildDocumentPath(documentId: string, slug: string): string {
    return `documents/${documentId}/${safeFileName(slug).replace(/\.md$/i, '')}.md`;
  },

  buildAttachmentPath(documentId: string, filename: string): string {
    return `documents/${documentId}/attachments/${safeFileName(filename)}`;
  },

  buildEvidencePath(entityType: string, entityId: string, filename: string): string {
    return `evidence/${safeFileName(entityType)}/${safeFileName(entityId)}/${Date.now()}-${safeFileName(filename)}`;
  },

  async uploadMarkdownDocument(documentId: string, slug: string, content: string): Promise<CentralPadroesStorageUploadResult> {
    const path = this.buildDocumentPath(documentId, slug);
    return uploadToStorage('cp-documents', path, new Blob([content], { type: 'text/markdown;charset=utf-8' }), 'text/markdown;charset=utf-8');
  },

  async uploadAttachment(documentId: string, file: File): Promise<CentralPadroesStorageUploadResult> {
    const path = this.buildAttachmentPath(documentId, file.name);
    return uploadToStorage('cp-documents', path, file, file.type || 'application/octet-stream');
  },

  async uploadEvidence(entityType: string, entityId: string, file: File): Promise<CentralPadroesStorageUploadResult> {
    const path = this.buildEvidencePath(entityType, entityId, file.name);
    return uploadToStorage('cp-evidence', path, file, file.type || 'application/octet-stream');
  }
};

