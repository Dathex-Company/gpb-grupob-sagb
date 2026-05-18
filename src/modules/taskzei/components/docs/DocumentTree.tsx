// ============================================================================
// DocumentTree.tsx — Central de Documentos Inteligentes (ET D08-D12)
// Árvore hierárquica expansível/colapsável de documentos estilo ClickUp Docs.
// CSS tokens obrigatórios: --sagb-* (sem hex/rgb/hsl hardcoded).
// ============================================================================

import React, { useEffect, useCallback, useState } from 'react';
import { useDocStore } from '../../store/doc_store';
import { docService } from '../../services/doc_service';
import { DocTreeNode, DocNodeInput } from '../../types/doc_types';

interface DocumentTreeProps {
  onSelectNode: (nodeId: string) => void;
  selectedNodeId?: string | null;
  workspaceId?: string;
}

export const DocumentTree: React.FC<DocumentTreeProps> = ({
  onSelectNode,
  selectedNodeId: externalSelectedId,
  workspaceId = 'default',
}) => {
  const {
    tree,
    expandedNodeIds,
    isLoading,
    error,
    selectNode,
    toggleExpanded,
    expandAll,
    collapseAll,
  } = useDocStore();

  const selectedNodeId = externalSelectedId ?? useDocStore((s) => s.selectedNodeId);

  // ─── Confirmação de exclusão inline (não-bloqueante) ──
  const [confirmDeleteNodeId, setConfirmDeleteNodeId] = useState<string | null>(null);

  useEffect(() => {
    docService.loadNodes(workspaceId);
  }, [workspaceId]);

  const handleSelect = useCallback((id: string) => {
    selectNode(id);
    onSelectNode(id);
  }, [selectNode, onSelectNode]);

  const handleCreate = useCallback(async (parentId: string | null, type: 'folder' | 'document') => {
    console.log('[DEBUG-DOC] handleCreate called', { parentId, type });
    const input: DocNodeInput = {
      parentId,
      type,
      title: type === 'folder' ? 'Nova pasta' : 'Novo documento',
      icon: type === 'folder' ? '📁' : '📄',
      workspaceId,
    };
    try {
      const node = await docService.createNode(input);
      console.log('[DEBUG-DOC] node created', { id: node.id, title: node.title });
      // Auto-expand o pai se criar dentro de uma pasta
      if (parentId) {
        const expanded = useDocStore.getState().expandedNodeIds;
        if (!expanded.has(parentId)) {
          toggleExpanded(parentId);
        }
      }
      console.log('[DEBUG-DOC] calling handleSelect', { nodeId: node.id });
      handleSelect(node.id);
      console.log('[DEBUG-DOC] handleSelect completed');
    } catch (err) {
      console.error('[DEBUG-DOC] Erro ao criar nó:', err);
    }
  }, [workspaceId, handleSelect, toggleExpanded]);

  const handleDelete = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteNodeId(id);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    const id = confirmDeleteNodeId;
    if (!id) return;
    try {
      await docService.deleteNode(id);
      if (selectedNodeId === id) {
        selectNode(null);
      }
    } catch (err) {
      console.error('[DocumentTree] Erro ao excluir nó:', err);
    } finally {
      setConfirmDeleteNodeId(null);
    }
  }, [confirmDeleteNodeId, selectedNodeId, selectNode]);

  const handleCancelDelete = useCallback(() => {
    setConfirmDeleteNodeId(null);
  }, []);

  if (isLoading && tree.length === 0) {
    return (
      <div className="flex items-center justify-center p-6" style={{ color: 'var(--sagb-muted)' }}>
        <svg className="h-5 w-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span style={{ fontSize: 12 }}>Carregando...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center" style={{ color: 'var(--sagb-red)', fontSize: 12 }}>
        {error}
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        fontFamily: "'Rubik', sans-serif",
        backgroundColor: 'var(--sagb-bg)',
        position: 'relative',
      }}
    >
      {confirmDeleteNodeId && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}>
          <div
            className="rounded-lg p-4 shadow-xl max-w-[240px] w-full"
            style={{
              backgroundColor: 'var(--sagb-surface)',
              border: '1px solid var(--sagb-line)',
            }}
          >
            <p className="text-[12px] font-medium mb-3" style={{ color: 'var(--sagb-text)' }}>
              Excluir este documento permanentemente?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handleCancelDelete}
                className="px-3 py-1 text-[10px] font-semibold rounded transition-colors"
                style={{ color: 'var(--sagb-muted)' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1 text-[10px] font-bold rounded transition-colors"
                style={{ color: '#fff', backgroundColor: 'var(--sagb-red)' }}
              >
                Confirmar exclusão
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b shrink-0"
        style={{
          borderColor: 'var(--sagb-line)',
          backgroundColor: 'var(--sagb-bg)',
        }}
      >
        <span
          className="font-black uppercase tracking-widest"
          style={{ fontSize: 10, color: 'var(--sagb-muted)' }}
        >
          Documentos
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={expandAll}
            className="p-1 rounded transition-colors"
            style={{ color: 'var(--sagb-muted)' }}
            title="Expandir todos"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
            </svg>
          </button>
          <button
            onClick={collapseAll}
            className="p-1 rounded transition-colors"
            style={{ color: 'var(--sagb-muted)' }}
            title="Recolher todos"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={() => handleCreate(null, 'document')}
            className="p-1 rounded transition-colors"
            style={{ color: 'var(--sagb-primary)' }}
            title="Novo documento"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={() => handleCreate(null, 'folder')}
            className="p-1 rounded transition-colors"
            style={{ color: 'var(--sagb-muted)' }}
            title="Nova pasta"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {tree.length === 0 ? (
          <div className="text-center py-8" style={{ color: 'var(--sagb-muted)', fontSize: 12 }}>
            Nenhum documento ainda.
            <br />
            <button
              onClick={() => handleCreate(null, 'document')}
              className="mt-2 px-3 py-1 rounded font-bold transition-colors"
              style={{
                fontSize: 11,
                color: '#fff',
                backgroundColor: 'var(--sagb-primary)',
              }}
            >
              + Criar primeiro documento
            </button>
          </div>
        ) : (
          <ul className="space-y-0.5">
            {tree.map((node) => (
              <TreeNodeItem
                key={node.id}
                node={node}
                depth={0}
                selectedNodeId={selectedNodeId}
                expandedNodeIds={expandedNodeIds}
                onSelect={handleSelect}
                onToggle={toggleExpanded}
                onCreate={handleCreate}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// ─── TreeNodeItem (recursivo) ──────────────────────────────────────────────

interface TreeNodeItemProps {
  node: DocTreeNode;
  depth: number;
  selectedNodeId: string | null;
  expandedNodeIds: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onCreate: (parentId: string | null, type: 'folder' | 'document') => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const TreeNodeItem: React.FC<TreeNodeItemProps> = ({
  node,
  depth,
  selectedNodeId,
  expandedNodeIds,
  onSelect,
  onToggle,
  onCreate,
  onDelete,
}) => {
  const isFolder = node.type === 'folder';
  const isExpanded = expandedNodeIds.has(node.id);
  const isSelected = selectedNodeId === node.id;
  const hasChildren = node.children.length > 0;

  return (
    <li>
      <div
        onClick={() => onSelect(node.id)}
        className="flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer transition-colors group"
        style={{
          paddingLeft: 8 + depth * 16,
          backgroundColor: isSelected
            ? 'color-mix(in srgb, var(--sagb-primary) 12%, transparent)'
            : 'transparent',
          color: isSelected
            ? 'var(--sagb-text)'
            : 'var(--sagb-text)',
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-bg)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          }
        }}
      >
        {/* Expand/Collapse toggle for folders */}
        {isFolder ? (
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}
            className="p-0.5 rounded transition-transform"
            style={{
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              color: 'var(--sagb-muted)',
            }}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <span className="w-4" />
        )}

        {/* Icon */}
        <span style={{ fontSize: 14, lineHeight: 1 }}>{node.icon || '📄'}</span>

        {/* Title */}
        <span
          className="flex-1 truncate font-medium"
          style={{ fontSize: 12, lineHeight: '1.25rem' }}
        >
          {node.title}
        </span>

        {/* Context actions (show on hover) */}
        <div className="hidden group-hover:flex items-center gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); onCreate(node.id, 'document'); }}
            className="p-0.5 rounded hover:opacity-100 transition-opacity"
            style={{ color: 'var(--sagb-muted)', opacity: 0.6 }}
            title="Adicionar documento aqui"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          {isFolder && (
            <button
              onClick={(e) => { e.stopPropagation(); onCreate(node.id, 'folder'); }}
              className="p-0.5 rounded hover:opacity-100 transition-opacity"
              style={{ color: 'var(--sagb-muted)', opacity: 0.6 }}
              title="Adicionar subpasta"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </button>
          )}
          <button
            onClick={(e) => onDelete(node.id, e)}
            className="p-0.5 rounded hover:opacity-100 transition-opacity"
            style={{ color: 'var(--sagb-red)', opacity: 0.6 }}
            title="Excluir"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Children (recursive) */}
      {isFolder && isExpanded && hasChildren && (
        <ul className="space-y-0.5">
          {node.children.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedNodeId={selectedNodeId}
              expandedNodeIds={expandedNodeIds}
              onSelect={onSelect}
              onToggle={onToggle}
              onCreate={onCreate}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
