// ============================================================================
// doc_storage_adapter.ts — ET D15 | Integração de Storage com o CID
// Ponte entre a Central de Documentos do TaskZei e a infraestrutura
// de storage do CID (Centro de Inteligência Documental).
//
// Usa o mesmo bucket compartilhado (cid-assets) e a mesma função de upload
// (uploadBlobToSupabaseStorage) que o CIDView.tsx utiliza, garantindo que
// todo o armazenamento físico passe pela arquitetura canônica do CID.
// ============================================================================

import {
  uploadBlobToSupabaseStorage,
  getSupabasePublicUrl,
} from '../../../../services/storage';
import {
  addDoc,
  collection,
  db,
  deleteDoc,
  doc,
} from '../../../../services/supabase';
import { DocAttachment } from '../types/doc_types';

// ─── Helpers ────────────────────────────────────────────────────────────────

const sanitizePathSegment = (value: string): string => {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
};

const pad = (n: number): string => String(n).padStart(2, '0');

/**
 * Constrói o path de storage no bucket cid-assets, seguindo a mesma
 * convenção do CID mas com namespace taskzei para isolamento:
 *   taskzei/{workspaceId}/{nodeId}/{timestamp}-{safeFileName}
 */
const buildTaskzeiStoragePath = (params: {
  workspaceId: string;
  nodeId: string;
  fileName: string;
}): string => {
  const safeName = sanitizePathSegment(params.fileName) || `file-${Date.now()}`;
  return `taskzei/${params.workspaceId}/${params.nodeId}/${Date.now()}-${safeName}`;
};

// ─── DocStorageAdapter ──────────────────────────────────────────────────────

/**
 * Adapter para upload/download de arquivos no storage do CID.
 *
 * Fluxo:
 * 1. Cliente chama `uploadAttachment(nodeId, file, workspaceId, createdBy?)`
 * 2. O adapter faz upload para o bucket `cid-assets` no Supabase Storage
 * 3. Cria registro em `taskzei_doc_attachments` com storage_key + cid_ref_id
 * 4. Retorna o DocAttachment criado
 */
export const DocStorageAdapter = {
  /**
   * Faz upload de um arquivo para o storage do CID e registra o attachment
   * na tabela taskzei_doc_attachments.
   *
   * @returns O DocAttachment criado (incluindo id e cidRefId)
   */
  async uploadAttachment(params: {
    nodeId: string;
    file: File;
    workspaceId?: string;
    createdBy?: string;
  }): Promise<DocAttachment> {
    const { nodeId, file, workspaceId = 'default', createdBy } = params;
    const now = new Date();
    const fileName = file.name;
    const fileSize = file.size;
    const mimeType = file.type || 'application/octet-stream';

    // 1. Monta o path de storage (namespace taskzei no bucket cid-assets)
    const storagePath = buildTaskzeiStoragePath({
      workspaceId,
      nodeId,
      fileName,
    });

    // 2. Upload físico para o bucket cid-assets (mesmo bucket do CID)
    await uploadBlobToSupabaseStorage({
      bucket: 'cid-assets',
      path: storagePath,
      blob: file,
      mimeType,
    });

    // 3. O storageKey é a referência canônica (cid_ref_id)
    const cidRefId = storagePath;

    // 4. Cria o registro em taskzei_doc_attachments
    const ref = await addDoc(collection(db, 'taskzei_doc_attachments'), {
      node_id: nodeId,
      file_name: fileName,
      file_size: fileSize,
      mime_type: mimeType,
      storage_key: storagePath,
      cid_ref_id: cidRefId,
      created_by: createdBy || null,
      created_at: now.toISOString(),
    });

    return {
      id: ref.id,
      nodeId,
      fileName,
      fileSize,
      mimeType,
      storageKey: storagePath,
      cidRefId,
      createdBy: createdBy || undefined,
      createdAt: now.toISOString(),
    };
  },

  /**
   * Remove um attachment: exclui o arquivo físico do storage e o registro
   * da tabela taskzei_doc_attachments.
   *
   * NOTA: O Supabase Storage via REST não expõe delete diretamente pela
   * API anon key em buckets públicos. Esta função remove o registro no
   * banco; a limpeza do blob físico pode ser feita via função server-side
   * ou manualmente.
   */
  async deleteAttachment(attachmentId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'taskzei_doc_attachments', attachmentId));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Retorna a URL pública de um attachment no bucket cid-assets.
   */
  getAttachmentUrl(storageKey: string): string {
    return getSupabasePublicUrl('cid-assets', storageKey);
  },
};
