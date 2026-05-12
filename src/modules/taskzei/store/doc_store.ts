// ============================================================================
// doc_store.ts — Central de Documentos Inteligentes (ET D08-D12)
// Zustand store com transformação flat → árvore aninhada em memória.
// ============================================================================

import { create } from 'zustand';
import { DocNode, DocContent, DocTreeNode, EntityLink, buildDocTree } from '../types/doc_types';

interface DocState {
  // Nodes
  nodes: DocNode[];
  tree: DocTreeNode[];
  selectedNodeId: string | null;
  expandedNodeIds: Set<string>;

  // Contents
  contents: Record<string, DocContent[]>; // keyed by nodeId

  // Entity Links
  entityLinks: EntityLink[];

  // UI
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Actions — Nodes
  setNodes: (nodes: DocNode[]) => void;
  addNode: (node: DocNode) => void;
  updateNode: (id: string, updates: Partial<DocNode>) => void;
  removeNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  toggleExpanded: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;

  // Actions — Contents
  setContents: (nodeId: string, contents: DocContent[]) => void;
  updateContent: (nodeId: string, contentId: string, updates: Partial<DocContent>) => void;

  // Actions — Entity Links
  setEntityLinks: (links: EntityLink[]) => void;
  addEntityLink: (link: EntityLink) => void;
  removeEntityLink: (id: string) => void;

  // Actions — UI
  setLoading: (isLoading: boolean) => void;
  setSaving: (isSaving: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDocStore = create<DocState>((set) => ({
  // Initial state
  nodes: [],
  tree: [],
  selectedNodeId: null,
  expandedNodeIds: new Set<string>(),
  contents: {},
  entityLinks: [],
  isLoading: false,
  isSaving: false,
  error: null,

  // ── Node actions ──────────────────────────────────────────

  setNodes: (nodes) => set({
    nodes,
    tree: buildDocTree(nodes),
  }),

  addNode: (node) => set((state) => {
    const newNodes = [...state.nodes, node];
    return {
      nodes: newNodes,
      tree: buildDocTree(newNodes),
    };
  }),

  updateNode: (id, updates) => set((state) => {
    const newNodes = state.nodes.map((n) =>
      n.id === id ? { ...n, ...updates } : n
    );
    return {
      nodes: newNodes,
      tree: buildDocTree(newNodes),
    };
  }),

  removeNode: (id) => set((state) => {
    // Soft remove: marca deletedAt ou remove da lista
    const newNodes = state.nodes.filter((n) => n.id !== id && n.parentId !== id);
    return {
      nodes: newNodes,
      tree: buildDocTree(newNodes),
    };
  }),

  selectNode: (id) => set({ selectedNodeId: id }),

  toggleExpanded: (id) => set((state) => {
    const next = new Set(state.expandedNodeIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    return { expandedNodeIds: next };
  }),

  expandAll: () => set((state) => {
    // Expande todos os nós que têm filhos
    const parentIds = new Set(state.nodes.filter(n => n.type === 'folder').map(n => n.id));
    return { expandedNodeIds: parentIds };
  }),

  collapseAll: () => set({ expandedNodeIds: new Set<string>() }),

  // ── Content actions ───────────────────────────────────────

  setContents: (nodeId, contents) => set((state) => ({
    contents: { ...state.contents, [nodeId]: contents },
  })),

  updateContent: (nodeId, contentId, updates) => set((state) => {
    const existing = state.contents[nodeId] || [];
    return {
      contents: {
        ...state.contents,
        [nodeId]: existing.map((c) =>
          c.id === contentId ? { ...c, ...updates } : c
        ),
      },
    };
  }),

  // ── Entity Link actions ───────────────────────────────────

  setEntityLinks: (links) => set({ entityLinks: links }),

  addEntityLink: (link) => set((state) => ({
    entityLinks: [...state.entityLinks, link],
  })),

  removeEntityLink: (id) => set((state) => ({
    entityLinks: state.entityLinks.filter((l) => l.id !== id),
  })),

  // ── UI actions ────────────────────────────────────────────

  setLoading: (isLoading) => set({ isLoading }),
  setSaving: (isSaving) => set({ isSaving }),
  setError: (error) => set({ error }),
}));
