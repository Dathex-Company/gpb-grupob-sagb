// ============================================================================
// AgendaInteligenteDocumentsPage.tsx — Central de Documentos Inteligentes
// Painel dividido: árvore à esquerda, editor à direita.
// Tokens Robust Clean: --sagb-* (sem hex/rgb/hsl hardcoded).
// ============================================================================

import React, { useState, useCallback } from 'react';
import { DocumentTree } from '../../components/docs/DocumentTree';
import { EditorCanvas } from '../../components/docs/EditorCanvas';
import { ExportActions } from '../../components/docs/ExportActions';
import { DocumentErrorBoundary } from '../../components/docs/DocumentErrorBoundary';

export const AgendaInteligenteDocumentsPage: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleSelectNode = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  return (
    <div
      className="flex h-full overflow-hidden"
      style={{
        fontFamily: "'Rubik', sans-serif",
        backgroundColor: 'var(--sagb-bg)',
      }}
    >
      {/* ─── Painel esquerdo: árvore de documentos ───────────────── */}
      <aside
        className="flex w-72 shrink-0 flex-col overflow-hidden border-r"
        style={{
          borderColor: 'var(--sagb-line)',
          backgroundColor: 'var(--sagb-surface)',
        }}
      >
        {/* Header da árvore */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b shrink-0"
          style={{
            borderColor: 'var(--sagb-line)',
          }}
        >
          <h2
            className="font-semibold truncate"
            style={{ fontSize: 13, color: 'var(--sagb-text)' }}
          >
            Documentos
          </h2>
          {selectedNodeId && (
            <ExportActions nodeId={selectedNodeId} />
          )}
        </div>

        {/* Árvore */}
        <div className="flex-1 overflow-y-auto">
          <DocumentTree
            onSelectNode={handleSelectNode}
            selectedNodeId={selectedNodeId}
          />
        </div>
      </aside>

      {/* ─── Painel direito: editor ───────────────────────────────── */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <DocumentErrorBoundary>
          <EditorCanvas nodeId={selectedNodeId} />
        </DocumentErrorBoundary>
      </main>
    </div>
  );
};
