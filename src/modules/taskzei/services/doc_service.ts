// ============================================================================
// doc_service.ts — Central de Documentos Inteligentes (ET D08-D12)
// Camada de serviço que opera sobre o provider e sincroniza com a DocStore.
// Usa o mesmo padrão Firestore-like do SagB (SagB/services/supabase.ts).
// ============================================================================

import {
  addDoc,
  collection,
  db,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from '../../../../services/supabase';
import { useDocStore } from '../store/doc_store';
import {
  DocAttachment,
  DocNode,
  DocNodeInput,
  DocContent,
  DocContentInput,
  EntityLink,
  EntityLinkInput,
  EntityLinkType,
  IDocService,
} from '../types/doc_types';

// ─── Row Types (snake_case ↔ camelCase mapping) ────────────────────────────

type DocNodeRow = {
  id: string;
  workspace_id: string;
  parent_id?: string | null;
  title: string;
  slug?: string | null;
  icon?: string | null;
  type: string;
  sort_order: number;
  is_pinned: boolean;
  created_by?: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
};

type DocContentRow = {
  id: string;
  node_id: string;
  block_type: string;
  attrs: Record<string, unknown>;
  content: Record<string, unknown>[];
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const VALID_BLOCK_TYPES = new Set([
  'paragraph',
  'heading',
  'bulletList',
  'orderedList',
  'checkList',
  'blockquote',
  'codeBlock',
  'divider',
  'image',
]);

type EntityLinkRow = {
  id: string;
  source_type: string;
  source_id: string;
  target_type: string;
  target_id: string;
  relationship?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
};

// ─── Mappers ───────────────────────────────────────────────────────────────

function mapRowToDocNode(row: DocNodeRow): DocNode {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    parentId: row.parent_id || null,
    title: row.title,
    slug: row.slug || undefined,
    icon: row.icon || '📄',
    type: row.type as DocNode['type'],
    sortOrder: row.sort_order,
    isPinned: row.is_pinned,
    createdBy: row.created_by || undefined,
    deletedAt: row.deleted_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapDocNodeToRow(node: DocNodeInput & { id?: string }): Record<string, unknown> {
  return {
    ...(node.id ? { id: node.id } : {}),
    workspace_id: node.workspaceId || 'default',
    parent_id: node.parentId || null,
    title: node.title || 'Novo documento',
    icon: node.icon || '📄',
    type: node.type,
    sort_order: node.sortOrder ?? 0,
    is_pinned: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function mapRowToDocContent(row: DocContentRow): DocContent {
  const safeBlockType = VALID_BLOCK_TYPES.has(row.block_type)
    ? row.block_type
    : 'paragraph';

  const safeAttrs = row.attrs && typeof row.attrs === 'object' ? row.attrs : {};

  const safeContent = Array.isArray(row.content)
    ? row.content.filter((item) => item && typeof item === 'object')
    : [];

  return {
    id: row.id,
    nodeId: row.node_id,
    blockType: safeBlockType as DocContent['blockType'],
    attrs: safeAttrs,
    content: safeContent as DocContent['content'],
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapDocContentToRow(content: DocContentInput): Record<string, unknown> {
  return {
    node_id: content.nodeId,
    block_type: content.blockType,
    attrs: content.attrs || {},
    content: content.content || [],
    sort_order: content.sortOrder,
  };
}

function mapRowToEntityLink(row: EntityLinkRow): EntityLink {
  return {
    id: row.id,
    sourceType: row.source_type as EntityLinkType,
    sourceId: row.source_id,
    targetType: row.target_type as EntityLinkType,
    targetId: row.target_id,
    relationship: row.relationship || 'related',
    metadata: (row.metadata as Record<string, unknown>) || {},
    createdAt: row.created_at,
  };
}

// ─── DocService ────────────────────────────────────────────────────────────

export class DocService implements IDocService {
  // ====================================================================
  // NODES
  // ====================================================================

  async loadNodes(workspaceId = 'default'): Promise<DocNode[]> {
    const store = useDocStore.getState();
    store.setLoading(true);
    try {
      const q = query(
        collection(db, 'taskzei_doc_nodes'),
        where('workspace_id', '==', workspaceId),
        orderBy('sort_order', 'asc')
      );
      const snapshot = await getDocs(q);
      const nodes = snapshot.docs.map((d: { id: string; data: () => DocNodeRow }) => {
        const row = d.data() as DocNodeRow;
        return mapRowToDocNode({ ...row, id: d.id });
      });
      store.setNodes(nodes);
      return nodes;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Erro ao carregar documentos');
      return [];
    } finally {
      store.setLoading(false);
    }
  }

  async getNodeById(id: string): Promise<DocNode | null> {
    try {
      const ref = doc(db, 'taskzei_doc_nodes', id);
      const snap = await getDoc(ref);
      if (!snap.exists) return null;
      const row = snap.data() as DocNodeRow;
      return mapRowToDocNode({ ...row, id: snap.id });
    } catch {
      return null;
    }
  }

  async createNode(input: DocNodeInput): Promise<DocNode> {
    const store = useDocStore.getState();
    try {
      const row = mapDocNodeToRow(input);
      const ref = await addDoc(collection(db, 'taskzei_doc_nodes'), row);
      const node: DocNode = {
        id: ref.id,
        workspaceId: input.workspaceId || 'default',
        parentId: input.parentId || null,
        title: input.title || 'Novo documento',
        icon: input.icon || '📄',
        type: input.type,
        sortOrder: input.sortOrder ?? 0,
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.addNode(node);
      return node;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Erro ao criar documento');
      throw error;
    }
  }

  async updateNode(id: string, updates: Partial<DocNode>): Promise<DocNode> {
    const store = useDocStore.getState();
    try {
      const row: Record<string, unknown> = {};
      if (updates.title !== undefined) row.title = updates.title;
      if (updates.parentId !== undefined) row.parent_id = updates.parentId;
      if (updates.icon !== undefined) row.icon = updates.icon;
      if (updates.sortOrder !== undefined) row.sort_order = updates.sortOrder;
      if (updates.isPinned !== undefined) row.is_pinned = updates.isPinned;
      if (updates.deletedAt !== undefined) row.deleted_at = updates.deletedAt || null;

      row.updated_at = new Date().toISOString();

      await updateDoc(doc(db, 'taskzei_doc_nodes', id), row);
      store.updateNode(id, updates);

      const updated = store.nodes.find((n) => n.id === id);
      if (!updated) throw new Error('Nó não encontrado após atualização');
      return updated;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Erro ao atualizar documento');
      throw error;
    }
  }

  async deleteNode(id: string): Promise<boolean> {
    const store = useDocStore.getState();
    try {
      // Soft delete: marca deleted_at
      await updateDoc(doc(db, 'taskzei_doc_nodes', id), {
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      store.removeNode(id);
      return true;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Erro ao remover documento');
      return false;
    }
  }

  async restoreNode(id: string): Promise<DocNode> {
    const store = useDocStore.getState();
    try {
      await updateDoc(doc(db, 'taskzei_doc_nodes', id), {
        deleted_at: null,
        updated_at: new Date().toISOString(),
      });
      const restored = await this.getNodeById(id);
      if (!restored) throw new Error('Nó não encontrado após restauração');
      store.addNode(restored);
      return restored;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Erro ao restaurar documento');
      throw error;
    }
  }

  // ====================================================================
  // CONTENTS
  // ====================================================================

  async loadContents(nodeId: string): Promise<DocContent[]> {
    const store = useDocStore.getState();
    try {
      const q = query(
        collection(db, 'taskzei_doc_contents'),
        where('node_id', '==', nodeId),
        orderBy('sort_order', 'asc')
      );
      const snapshot = await getDocs(q);
      const contents = snapshot.docs.map((d: { id: string; data: () => DocContentRow }) => {
        const row = d.data() as DocContentRow;
        return mapRowToDocContent({ ...row, id: d.id });
      });
      store.setContents(nodeId, contents);
      return contents;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Erro ao carregar conteúdo');
      return [];
    }
  }

  async saveContents(nodeId: string, blocks: DocContentInput[]): Promise<DocContent[]> {
    const store = useDocStore.getState();
    store.setSaving(true);
    try {
      // Remove blocos existentes
      const existing = await this.loadContents(nodeId);
      const deletePromises = existing.map((c) =>
        deleteDoc(doc(db, 'taskzei_doc_contents', c.id))
      );
      await Promise.all(deletePromises);

      // Cria novos blocos (transação atômica simulada)
      const created: DocContent[] = [];
      for (const block of blocks) {
        const row = mapDocContentToRow(block);
        const ref = await addDoc(collection(db, 'taskzei_doc_contents'), row);
        created.push({
          id: ref.id,
          nodeId: block.nodeId,
          blockType: block.blockType,
          attrs: block.attrs || {},
          content: block.content || [],
          sortOrder: block.sortOrder,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      store.setContents(nodeId, created);
      return created;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Erro ao salvar conteúdo');
      throw error;
    } finally {
      store.setSaving(false);
    }
  }

  // ====================================================================
  // ENTITY LINKS
  // ====================================================================

  async getLinksForEntity(entityType: EntityLinkType, entityId: string): Promise<EntityLink[]> {
    try {
      const q = query(
        collection(db, 'taskzei_entity_links'),
        where('source_type', '==', entityType),
        where('source_id', '==', entityId)
      );
      const snapshot = await getDocs(q);
      const links = snapshot.docs.map((d: { id: string; data: () => EntityLinkRow }) => {
        const row = d.data() as EntityLinkRow;
        return mapRowToEntityLink({ ...row, id: d.id });
      });
      return links;
    } catch {
      return [];
    }
  }

  async createLink(input: EntityLinkInput): Promise<EntityLink> {
    const store = useDocStore.getState();
    try {
      const ref = await addDoc(collection(db, 'taskzei_entity_links'), {
        source_type: input.sourceType,
        source_id: input.sourceId,
        target_type: input.targetType,
        target_id: input.targetId,
        relationship: input.relationship || 'related',
        metadata: input.metadata || {},
      });
      const link: EntityLink = {
        id: ref.id,
        sourceType: input.sourceType,
        sourceId: input.sourceId,
        targetType: input.targetType,
        targetId: input.targetId,
        relationship: input.relationship || 'related',
        metadata: input.metadata || {},
        createdAt: new Date().toISOString(),
      };
      store.addEntityLink(link);
      return link;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Erro ao criar vínculo');
      throw error;
    }
  }

  async deleteLink(id: string): Promise<boolean> {
    const store = useDocStore.getState();
    try {
      await deleteDoc(doc(db, 'taskzei_entity_links', id));
      store.removeEntityLink(id);
      return true;
    } catch {
      return false;
    }
  }

  // ====================================================================
  // ATTACHMENTS
  // ====================================================================

  async getAttachments(nodeId: string): Promise<DocAttachment[]> {
    try {
      const q = query(
        collection(db, 'taskzei_doc_attachments'),
        where('node_id', '==', nodeId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d: { id: string; data: () => Record<string, unknown> }) => {
        const row = d.data();
        return {
          id: d.id,
          nodeId: row.node_id as string,
          fileName: row.file_name as string,
          fileSize: (row.file_size as number) || 0,
          mimeType: (row.mime_type as string) || 'application/octet-stream',
          storageKey: row.storage_key as string,
          cidRefId: (row.cid_ref_id as string) || undefined,
          createdBy: (row.created_by as string) || undefined,
          createdAt: (row.created_at as string) || new Date().toISOString(),
        };
      });
    } catch {
      return [];
    }
  }

  async createAttachment(input: Omit<DocAttachment, 'id' | 'createdAt'>): Promise<DocAttachment> {
    try {
      const ref = await addDoc(collection(db, 'taskzei_doc_attachments'), {
        node_id: input.nodeId,
        file_name: input.fileName,
        file_size: input.fileSize,
        mime_type: input.mimeType,
        storage_key: input.storageKey,
        cid_ref_id: input.cidRefId || null,
        created_by: input.createdBy || null,
        created_at: new Date().toISOString(),
      });
      return {
        id: ref.id,
        nodeId: input.nodeId,
        fileName: input.fileName,
        fileSize: input.fileSize,
        mimeType: input.mimeType,
        storageKey: input.storageKey,
        cidRefId: input.cidRefId,
        createdBy: input.createdBy,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Erro ao criar attachment:', error);
      throw error;
    }
  }

  async deleteAttachment(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'taskzei_doc_attachments', id));
      return true;
    } catch {
      return false;
    }
  }
}

// ─── Singleton ─────────────────────────────────────────────────────────────

export const docService = new DocService();
