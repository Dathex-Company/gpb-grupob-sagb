// ============================================================================
// doc_types.ts — Central de Documentos Inteligentes (ET D08-D12)
// Contratos TypeScript para documentos hierárquicos estilo ClickUp Docs.
// ============================================================================

// ─── Tipos escalares ───────────────────────────────────────────────────────

export type DocNodeType = 'folder' | 'document';

export type DocBlockType =
  | 'paragraph'
  | 'heading'
  | 'bulletList'
  | 'orderedList'
  | 'checkList'
  | 'blockquote'
  | 'codeBlock'
  | 'image'
  | 'divider';

export type EntityLinkType = 'task' | 'document' | 'meeting' | 'inbox';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// ─── DocNode — nó da árvore ────────────────────────────────────────────────

export interface DocNode {
  id: string;
  workspaceId: string;
  parentId: string | null;
  title: string;
  slug?: string;
  icon: string;
  type: DocNodeType;
  sortOrder: number;
  isPinned: boolean;
  createdBy?: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocNodeInput {
  parentId?: string | null;
  title?: string;
  icon?: string;
  type: DocNodeType;
  sortOrder?: number;
  workspaceId?: string;
}

// ─── DocContent — bloco de conteúdo rich text ───────────────────────────────

export interface DocContent {
  id: string;
  nodeId: string;
  blockType: DocBlockType;
  attrs: Record<string, unknown>;
  content: DocContentInline[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocContentInput {
  nodeId: string;
  blockType: DocBlockType;
  attrs?: Record<string, unknown>;
  content?: DocContentInline[];
  sortOrder: number;
}

export interface DocContentInline {
  type?: string;
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
  content?: DocContentInline[];
  [key: string]: unknown;
}

// ─── EntityLink — link bidirecional ─────────────────────────────────────────

export interface EntityLink {
  id: string;
  sourceType: EntityLinkType;
  sourceId: string;
  targetType: EntityLinkType;
  targetId: string;
  relationship: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface EntityLinkInput {
  sourceType: EntityLinkType;
  sourceId: string;
  targetType: EntityLinkType;
  targetId: string;
  relationship?: string;
  metadata?: Record<string, unknown>;
}

// ─── DocAttachment — anexo ──────────────────────────────────────────────────

export interface DocAttachment {
  id: string;
  nodeId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storageKey: string;
  cidRefId?: string;       // ET D15 — referência ao asset/file no storage do CID
  createdBy?: string;
  createdAt: string;
}

// ─── Árvore em memória ─────────────────────────────────────────────────────

export interface DocTreeNode extends DocNode {
  children: DocTreeNode[];
  content?: DocContent[];
}

// ─── Contrato do serviço de documentos ──────────────────────────────────────

export interface IDocService {
  // Nodes
  loadNodes(workspaceId?: string): Promise<DocNode[]>;
  getNodeById(id: string): Promise<DocNode | null>;
  createNode(input: DocNodeInput): Promise<DocNode>;
  updateNode(id: string, updates: Partial<DocNode>): Promise<DocNode>;
  deleteNode(id: string): Promise<boolean>;
  restoreNode(id: string): Promise<DocNode>;

  // Contents
  loadContents(nodeId: string): Promise<DocContent[]>;
  saveContents(nodeId: string, blocks: DocContentInput[]): Promise<DocContent[]>;

  // Entity Links
  getLinksForEntity(entityType: EntityLinkType, entityId: string): Promise<EntityLink[]>;
  createLink(input: EntityLinkInput): Promise<EntityLink>;
  deleteLink(id: string): Promise<boolean>;

  // Attachments
  getAttachments(nodeId: string): Promise<DocAttachment[]>;
  createAttachment(input: Omit<DocAttachment, 'id' | 'createdAt'>): Promise<DocAttachment>;
  deleteAttachment(id: string): Promise<boolean>;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Transforma lista flat de DocNode em árvore aninhada */
export function buildDocTree(nodes: DocNode[]): DocTreeNode[] {
  const map = new Map<string, DocTreeNode>();
  const roots: DocTreeNode[] = [];

  // Primeiro, cria todos os nós como tree nodes
  for (const node of nodes) {
    if (node.deletedAt) continue; // skip soft-deleted
    map.set(node.id, { ...node, children: [] });
  }

  // Depois, monta a hierarquia
  for (const node of nodes) {
    if (node.deletedAt) continue;
    const treeNode = map.get(node.id)!;
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(treeNode);
    } else {
      roots.push(treeNode);
    }
  }

  // Ordena por sortOrder
  const sortFn = (a: DocTreeNode, b: DocTreeNode) => a.sortOrder - b.sortOrder;
  const sortTree = (nodes: DocTreeNode[]) => {
    nodes.sort(sortFn);
    nodes.forEach(n => sortTree(n.children));
  };
  sortTree(roots);

  return roots;
}

/** Gera slug a partir do título */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || 'documento';
}
