// ============================================================================
// EditorCanvas.tsx — Central de Documentos Inteligentes (ET D08-D12)
// Editor de blocos rich text (TipTap headless) com auto-save debounce.
// CSS tokens obrigatórios: --sagb-* (sem hex/rgb/hsl hardcoded).
// ============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDocStore } from '../../store/doc_store';
import { docService } from '../../services/doc_service';
import { docAiService } from '../../services/doc_ai_service';
import { DocStorageAdapter } from '../../services/doc_storage_adapter';
import {
  DocNode,
  DocBlockType,
  DocContentInput,
  DocContentInline,
  SaveStatus,
} from '../../types/doc_types';

interface EditorCanvasProps {
  nodeId: string | null;
}

// ─── Save Indicator ────────────────────────────────────────────────────────

const SaveIndicator: React.FC<{ status: SaveStatus }> = ({ status }) => {
  if (status === 'idle') return null;
  return (
    <span
      className="inline-flex items-center gap-1 font-semibold transition-opacity"
      style={{ fontSize: 10, opacity: status === 'saving' ? 1 : 0.8 }}
    >
      {status === 'saving' && (
        <>
          <svg className="h-3 w-3 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            style={{ color: 'var(--sagb-amber)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span style={{ color: 'var(--sagb-amber)' }}>Salvando alterações...</span>
        </>
      )}
      {status === 'saved' && (
        <>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            style={{ color: 'var(--sagb-primary)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span style={{ color: 'var(--sagb-primary)' }}>Documento salvo</span>
        </>
      )}
      {status === 'error' && (
        <>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            style={{ color: 'var(--sagb-red)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span style={{ color: 'var(--sagb-red)' }}>Erro ao salvar</span>
        </>
      )}
    </span>
  );
};

// ─── Block Toolbar ─────────────────────────────────────────────────────────

const BLOCK_TYPES: { type: DocBlockType; label: string; icon: string }[] = [
  { type: 'paragraph', label: 'Texto', icon: '¶' },
  { type: 'heading', label: 'Título', icon: 'H' },
  { type: 'bulletList', label: 'Lista', icon: '•' },
  { type: 'orderedList', label: 'Numerada', icon: '1.' },
  { type: 'checkList', label: 'Checklist', icon: '☑' },
  { type: 'blockquote', label: 'Citação', icon: '"' },
  { type: 'codeBlock', label: 'Código', icon: '</>' },
  { type: 'divider', label: 'Divisor', icon: '—' },
  { type: 'image', label: 'Imagem', icon: '🖼' },
];

// ─── Editor Canvas ─────────────────────────────────────────────────────────

export const EditorCanvas: React.FC<EditorCanvasProps> = ({ nodeId }) => {
  const { nodes, contents, setContents } = useDocStore();
  console.log('[DEBUG-EDITOR] EditorCanvas render', { nodeId, nodesCount: nodes.length });
  const [localBlocks, setLocalBlocks] = useState<DocContentInput[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [uploadingFiles, setUploadingFiles] = useState<{
    id: string;
    fileName: string;
    status: 'uploading' | 'error';
    errorMessage?: string;
  }[]>([]);
  const [aiProcessing, setAiProcessing] = useState<'idle' | 'extracting' | 'summarizing' | 'error'>('idle');
  const [aiResultMessage, setAiResultMessage] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const currentNode = nodeId ? nodes.find((n) => n.id === nodeId) : null;
  const currentContents = nodeId ? contents[nodeId] : undefined;

  // Load contents when node changes
  useEffect(() => {
    if (!nodeId) return;
    docService.loadContents(nodeId);
  }, [nodeId]);

  // Sync local blocks from store
  useEffect(() => {
    if (currentContents) {
      setLocalBlocks(
        currentContents.map((c) => ({
          nodeId: c.nodeId,
          blockType: c.blockType,
          attrs: c.attrs,
          content: c.content,
          sortOrder: c.sortOrder,
        }))
      );
    } else if (nodeId) {
      // Initialize with empty paragraph
      setLocalBlocks([
        {
          nodeId,
          blockType: 'paragraph',
          attrs: {},
          content: [{ text: '' }],
          sortOrder: 0,
        },
      ]);
    }
  }, [currentContents, nodeId]);

  // Auto-save with debounce (1000ms)
  const triggerAutoSave = useCallback(
    (blocks: DocContentInput[]) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        if (!nodeId) return;
        setSaveStatus('saving');
        try {
          await docService.saveContents(nodeId, blocks);
          setSaveStatus('saved');
        } catch {
          setSaveStatus('error');
        }
        setTimeout(() => {
          setSaveStatus((prev) => (prev === 'saved' ? 'idle' : prev));
        }, 2000);
      }, 1000);
    },
    [nodeId]
  );

  // Update block content
  const updateBlock = useCallback(
    (index: number, updates: Partial<DocContentInput>) => {
      setLocalBlocks((prev) => {
        const next = prev.map((b, i) => (i === index ? { ...b, ...updates } : b));
        triggerAutoSave(next);
        return next;
      });
    },
    [triggerAutoSave]
  );

  // Add new block
  const addBlock = useCallback(
    (afterIndex: number, blockType: DocBlockType = 'paragraph') => {
      if (!nodeId) return;
      setLocalBlocks((prev) => {
        const newBlock: DocContentInput = {
          nodeId,
          blockType,
          attrs: blockType === 'heading' ? { level: 2 } : {},
          content: [{ text: '' }],
          sortOrder: afterIndex + 1,
        };
        const next = [
          ...prev.slice(0, afterIndex + 1),
          newBlock,
          ...prev.slice(afterIndex + 1).map((b, i) => ({
            ...b,
            sortOrder: afterIndex + 2 + i,
          })),
        ];
        triggerAutoSave(next);
        return next;
      });
    },
    [nodeId, triggerAutoSave]
  );

  // Remove block
  const removeBlock = useCallback(
    (index: number) => {
      if (localBlocks.length <= 1) return; // keep at least one block
      setLocalBlocks((prev) => {
        const next = prev.filter((_, i) => i !== index);
        triggerAutoSave(next);
        return next;
      });
    },
    [localBlocks.length, triggerAutoSave]
  );

  // Change block type
  const changeBlockType = useCallback(
    (index: number, blockType: DocBlockType) => {
      const attrs: Record<string, unknown> = {};
      if (blockType === 'heading') attrs.level = 2;
      updateBlock(index, { blockType, attrs });
    },
    [updateBlock]
  );

  // Inline text change
  const handleTextChange = useCallback(
    (index: number, text: string) => {
      updateBlock(index, { content: [{ text }] });
    },
    [updateBlock]
  );

  // Handle keyboard: Enter adds new block, Backspace on empty removes
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addBlock(index);
      }
      if (e.key === 'Backspace') {
        const block = localBlocks[index];
        const text = getBlockText(block);
        if (!text && localBlocks.length > 1) {
          e.preventDefault();
          removeBlock(index);
        }
      }
    },
    [localBlocks, addBlock, removeBlock]
  );

  // ─── Upload handler (ET D15) ─────────────────────────────────────
  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!nodeId) return;
      const uploadId = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      setUploadingFiles((prev) => [
        ...prev,
        { id: uploadId, fileName: file.name, status: 'uploading' },
      ]);

      try {
        // Verifica se é imagem (suportado) ou binário
        const isImage = file.type.startsWith('image/');

        // Upload via DocStorageAdapter → CID bucket
        const attachment = await DocStorageAdapter.uploadAttachment({
          nodeId,
          file,
        });

        // Obtém a URL pública do storage
        const publicUrl = DocStorageAdapter.getAttachmentUrl(attachment.storageKey);

        if (isImage) {
          // Cria um bloco image com a URL do CID
          setLocalBlocks((prev) => {
            const newBlock: DocContentInput = {
              nodeId: nodeId!,
              blockType: 'image',
              attrs: { src: publicUrl, alt: file.name, attachmentId: attachment.id },
              content: [],
              sortOrder: prev.length,
            };
            const next = [...prev, newBlock];
            triggerAutoSave(next);
            return next;
          });
        } else {
          // Para binários, cria um parágrafo com link
          setLocalBlocks((prev) => {
            const newBlock: DocContentInput = {
              nodeId: nodeId!,
              blockType: 'paragraph',
              attrs: {},
              content: [
                {
                  text: file.name,
                  marks: [
                    {
                      type: 'link',
                      attrs: { href: publicUrl, target: '_blank' },
                    },
                  ],
                },
              ],
              sortOrder: prev.length,
            };
            const next = [...prev, newBlock];
            triggerAutoSave(next);
            return next;
          });
        }

        // Marca como concluído
        setUploadingFiles((prev) =>
          prev.map((u) =>
            u.id === uploadId ? { ...u, status: 'uploading' as const } : u
          )
        );
        // Remove após 2s
        setTimeout(() => {
          setUploadingFiles((prev) => prev.filter((u) => u.id !== uploadId));
        }, 2000);
      } catch (error) {
        console.error('Erro no upload:', error);
        setUploadingFiles((prev) =>
          prev.map((u) =>
            u.id === uploadId
              ? {
                  ...u,
                  status: 'error' as const,
                  errorMessage:
                    error instanceof Error
                      ? error.message
                      : 'Falha ao enviar arquivo.',
                }
              : u
          )
        );
        // Remove após 5s
        setTimeout(() => {
          setUploadingFiles((prev) => prev.filter((u) => u.id !== uploadId));
        }, 5000);
      }
    },
    [nodeId, triggerAutoSave]
  );

  // ─── Drag & Drop handler ─────────────────────────────────────────
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files || []);
      const imageFiles = files.filter((f) => f.type.startsWith('image/'));
      if (imageFiles.length === 0) return;

      // Faz upload da primeira imagem arrastada
      handleFileUpload(imageFiles[0]);
    },
    [handleFileUpload]
  );

  // ─── Paste handler (colar imagem da área de transferência) ──────
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = Array.from(e.clipboardData?.items || []);
      const imageItem = items.find(
        (item) => item.type.startsWith('image/')
      );
      if (!imageItem) return;

      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // ─── Handlers de IA ──────────────────────────────────────────────────────
  const handleExtractActions = useCallback(async () => {
    if (!nodeId || aiProcessing !== 'idle') return;
    setAiProcessing('extracting');
    setAiResultMessage(null);
    let hasError = false;
    try {
      const result = await docAiService.extractActionsFromDoc(nodeId);
      setAiResultMessage(result.message);
      if (result.success) {
        setAiProcessing('idle');
      } else {
        setAiProcessing('error');
        hasError = true;
      }
    } catch {
      setAiResultMessage('Erro ao extrair ações. Tente novamente.');
      setAiProcessing('error');
      hasError = true;
    }
    setTimeout(() => {
      setAiResultMessage(null);
      if (hasError) setAiProcessing('idle');
    }, hasError ? 8000 : 4000);
  }, [nodeId, aiProcessing]);

  const handleSummarize = useCallback(async () => {
    if (!nodeId || aiProcessing !== 'idle') return;
    setAiProcessing('summarizing');
    setAiResultMessage(null);
    let hasError = false;
    try {
      const result = await docAiService.summarizeDoc(nodeId);
      setAiResultMessage(result.message);
      if (result.success) {
        setAiProcessing('idle');
      } else {
        setAiProcessing('error');
        hasError = true;
      }
    } catch {
      setAiResultMessage('Erro ao gerar resumo. Tente novamente.');
      setAiProcessing('error');
      hasError = true;
    }
    setTimeout(() => {
      setAiResultMessage(null);
      if (hasError) setAiProcessing('idle');
    }, hasError ? 8000 : 4000);
  }, [nodeId, aiProcessing]);

  if (!nodeId) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{
          fontFamily: "'Rubik', sans-serif",
          backgroundColor: 'var(--sagb-bg)',
          color: 'var(--sagb-muted)',
        }}
      >
        <div className="text-center p-8">
          <span style={{ fontSize: 48 }}>📝</span>
          <p style={{ fontSize: 14, fontWeight: 600, marginTop: 12 }}>
            Selecione um documento
          </p>
          <p style={{ fontSize: 12, marginTop: 4 }}>
            Escolha um documento na árvore ao lado ou crie um novo.
          </p>
        </div>
      </div>
    );
  }

  if (!currentNode) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{
          fontFamily: "'Rubik', sans-serif",
          backgroundColor: 'var(--sagb-bg)',
          color: 'var(--sagb-muted)',
          fontSize: 12,
        }}
      >
        Documento não encontrado.
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        fontFamily: "'Rubik', sans-serif",
        backgroundColor: 'var(--sagb-bg)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b shrink-0"
        style={{
          borderColor: 'var(--sagb-line)',
          backgroundColor: 'var(--sagb-surface)',
        }}
      >
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 18 }}>{currentNode.icon || '📄'}</span>
          <h2
            className="font-black truncate max-w-md"
            style={{ fontSize: 16, color: 'var(--sagb-text)' }}
          >
            {currentNode.title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Botões de IA ✨ */}
          {aiProcessing === 'extracting' ? (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: 'var(--sagb-primary)' }}>
              <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Extraindo ações...
            </div>
          ) : aiProcessing === 'summarizing' ? (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: 'var(--sagb-primary)' }}>
              <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Gerando resumo...
            </div>
          ) : (
            <>
              <button
                onClick={handleExtractActions}
                disabled={aiProcessing !== 'idle'}
                className="flex items-center gap-1 px-2 py-1 rounded transition-colors text-[11px] font-semibold"
                style={{
                  color: 'var(--sagb-primary)',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-primary-soft)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                title="Extrair ações e criar tarefas"
              >
                ✨ Extrair Ações
              </button>
              <button
                onClick={handleSummarize}
                disabled={aiProcessing !== 'idle'}
                className="flex items-center gap-1 px-2 py-1 rounded transition-colors text-[11px] font-semibold"
                style={{
                  color: 'var(--sagb-primary)',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-primary-soft)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                title="Gerar resumo executivo do documento"
              >
                ✨ Gerar Resumo
              </button>
            </>
          )}
          <SaveIndicator status={saveStatus} />
        </div>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        className="flex-1 overflow-y-auto px-8 py-6"
        style={{
          backgroundColor: 'var(--sagb-surface)',
          position: 'relative',
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
      >
        <div className="max-w-3xl mx-auto space-y-1">
          {localBlocks.map((block, index) => (
            <div
              key={`block-${index}`}
              className="group flex items-start gap-1 px-2 py-0.5 rounded transition-colors"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-bg)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            >
              {/* Block type selector (shows on hover) */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 pt-1">
                <select
                  value={block.blockType}
                  onChange={(e) => changeBlockType(index, e.target.value as DocBlockType)}
                  className="rounded border-0 bg-transparent cursor-pointer outline-none"
                  style={{
                    fontSize: 10,
                    color: 'var(--sagb-muted)',
                    width: 20,
                  }}
                >
                  {BLOCK_TYPES.map((bt) => (
                    <option key={bt.type} value={bt.type}>
                      {bt.icon}
                    </option>
                  ))}
                </select>
              </div>

              {/* Block content */}
              <div className="flex-1 min-w-0">
                {block.blockType === 'heading' && (
                  <input
                    type="text"
                    value={getBlockText(block)}
                    onChange={(e) => handleTextChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-full bg-transparent border-none outline-none font-black"
                    style={{
                      fontSize: (block.attrs?.level as number) === 1 ? 24 : 20,
                      color: 'var(--sagb-text)',
                      lineHeight: 1.3,
                    }}
                    placeholder="Título..."
                  />
                )}
                {block.blockType === 'paragraph' && (
                  <textarea
                    value={getBlockText(block)}
                    onChange={(e) => handleTextChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-full bg-transparent border-none outline-none resize-none overflow-hidden"
                    style={{
                      fontSize: 14,
                      color: 'var(--sagb-text)',
                      lineHeight: 1.6,
                      minHeight: 24,
                      fontFamily: "'Rubik', sans-serif",
                    }}
                    placeholder="Digite '/' para comandos, ou comece a digitar..."
                    rows={1}
                  />
                )}
                {block.blockType === 'bulletList' && (
                  <div className="flex items-start gap-2">
                    <span style={{ color: 'var(--sagb-muted)', fontSize: 14 }}>•</span>
                    <input
                      type="text"
                      value={getBlockText(block)}
                      onChange={(e) => handleTextChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="flex-1 bg-transparent border-none outline-none"
                      style={{
                        fontSize: 14,
                        color: 'var(--sagb-text)',
                        fontFamily: "'Rubik', sans-serif",
                      }}
                      placeholder="Item da lista..."
                    />
                  </div>
                )}
                {block.blockType === 'orderedList' && (
                  <div className="flex items-start gap-2">
                    <span style={{ color: 'var(--sagb-muted)', fontSize: 14, minWidth: 16 }}>
                      {index + 1}.
                    </span>
                    <input
                      type="text"
                      value={getBlockText(block)}
                      onChange={(e) => handleTextChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="flex-1 bg-transparent border-none outline-none"
                      style={{
                        fontSize: 14,
                        color: 'var(--sagb-text)',
                        fontFamily: "'Rubik', sans-serif",
                      }}
                      placeholder="Item numerado..."
                    />
                  </div>
                )}
                {block.blockType === 'checkList' && (
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      className="mt-1 rounded cursor-pointer"
                      style={{
                        accentColor: 'var(--sagb-primary)',
                      }}
                    />
                    <input
                      type="text"
                      value={getBlockText(block)}
                      onChange={(e) => handleTextChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="flex-1 bg-transparent border-none outline-none"
                      style={{
                        fontSize: 14,
                        color: 'var(--sagb-text)',
                        fontFamily: "'Rubik', sans-serif",
                      }}
                      placeholder="Item do checklist..."
                    />
                  </div>
                )}
                {block.blockType === 'blockquote' && (
                  <div
                    className="pl-4 py-1"
                    style={{
                      borderLeftWidth: 3,
                      borderLeftColor: 'var(--sagb-primary)',
                      borderLeftStyle: 'solid',
                    }}
                  >
                    <textarea
                      value={getBlockText(block)}
                      onChange={(e) => handleTextChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-full bg-transparent border-none outline-none resize-none overflow-hidden"
                      style={{
                        fontSize: 14,
                        color: 'var(--sagb-muted)',
                        fontStyle: 'italic',
                        fontFamily: "'Rubik', sans-serif",
                        minHeight: 24,
                      }}
                      placeholder="Citação..."
                      rows={1}
                    />
                  </div>
                )}
                {block.blockType === 'codeBlock' && (
                  <div
                    className="rounded p-3"
                    style={{
                      backgroundColor: 'var(--sagb-bg)',
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    }}
                  >
                    <textarea
                      value={getBlockText(block)}
                      onChange={(e) => handleTextChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-full bg-transparent border-none outline-none resize-none overflow-hidden"
                      style={{
                        fontSize: 13,
                        color: 'var(--sagb-text)',
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        minHeight: 24,
                      }}
                      placeholder="Código..."
                      rows={1}
                    />
                  </div>
                )}
                {block.blockType === 'divider' && (
                  <hr
                    className="my-4"
                    style={{
                      borderColor: 'var(--sagb-line)',
                      borderStyle: 'dashed',
                    }}
                  />
                )}
                {block.blockType === 'image' && (
                  <div className="my-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={(block.attrs?.src as string) || ''}
                      alt={(block.attrs?.alt as string) || ''}
                      className="max-w-full rounded-lg"
                      style={{
                        maxHeight: 400,
                        border: '1px solid var(--sagb-line)',
                      }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Remove button */}
              {localBlocks.length > 1 && (
                <button
                  onClick={() => removeBlock(index)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-all shrink-0 mt-1"
                  style={{ color: 'var(--sagb-muted)' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ─── Upload indicator ─────────────────────────────────────── */}
        {uploadingFiles.length > 0 && (
          <div className="mt-4 space-y-1">
            {uploadingFiles.map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded text-xs"
                style={{
                  backgroundColor: 'var(--sagb-bg)',
                  color: 'var(--sagb-muted)',
                }}
              >
                {u.status === 'uploading' ? (
                  <svg
                    className="h-3 w-3 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    style={{ color: 'var(--sagb-primary)' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <span style={{ color: 'var(--sagb-red)' }}>⚠</span>
                )}
                <span>
                  {u.status === 'uploading'
                    ? `Enviando ${u.fileName}...`
                    : `Erro: ${u.errorMessage || u.fileName}`}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ─── Drag-drop overlay ────────────────────────────────────── */}
        {isDragOver && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-lg"
            style={{
              backgroundColor: 'var(--sagb-primary-soft)',
              border: '2px dashed var(--sagb-primary)',
            }}
          >
            <div className="text-center">
              <span style={{ fontSize: 32 }}>📸</span>
              <p
                className="font-semibold mt-2"
                style={{ fontSize: 14, color: 'var(--sagb-primary)' }}
              >
                Solte a imagem para anexar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Helper ────────────────────────────────────────────────────────────────

function getBlockText(block: DocContentInput): string {
  if (!block.content || block.content.length === 0) return '';
  const first = block.content[0];
  return (first.text as string) || '';
}
