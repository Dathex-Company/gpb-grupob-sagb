// ============================================================================
// ExportActions.tsx — Central de Documentos Inteligentes (ET D08-D12)
// Exportação de documento nos formatos Markdown (.md) e HTML (.html).
// CSS tokens obrigatórios: --sagb-* (sem hex/rgb/hsl hardcoded).
// ============================================================================

import React, { useState, useCallback } from 'react';
import { useDocStore } from '../../store/doc_store';
import { DocContentInput, DocBlockType } from '../../types/doc_types';

interface ExportActionsProps {
  nodeId: string | null;
}

type ExportFormat = 'markdown' | 'html';
type ExportStatus = 'idle' | 'exporting' | 'done';

export const ExportActions: React.FC<ExportActionsProps> = ({ nodeId }) => {
  const { nodes, contents } = useDocStore();
  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle');
  const [isOpen, setIsOpen] = useState(false);

  const currentNode = nodeId ? nodes.find((n) => n.id === nodeId) : null;
  const currentContents = nodeId ? contents[nodeId] : undefined;

  const buildBlocks = useCallback((): DocContentInput[] => {
    if (!currentContents) return [];
    return currentContents.map((c) => ({
      nodeId: c.nodeId,
      blockType: c.blockType,
      attrs: c.attrs,
      content: c.content,
      sortOrder: c.sortOrder,
    }));
  }, [currentContents]);

  const toMarkdown = useCallback((blocks: DocContentInput[]): string => {
    let md = '';
    for (const block of blocks) {
      const text = extractText(block);
      switch (block.blockType) {
        case 'heading': {
          const level = (block.attrs?.level as number) || 2;
          md += `${'#'.repeat(level)} ${text}\n\n`;
          break;
        }
        case 'paragraph':
          md += `${text}\n\n`;
          break;
        case 'bulletList':
          md += `- ${text}\n`;
          break;
        case 'orderedList':
          // Will be numbered by position; use 1. for simplicity
          md += `1. ${text}\n`;
          break;
        case 'checkList':
          md += `- [ ] ${text}\n`;
          break;
        case 'blockquote':
          md += `> ${text}\n\n`;
          break;
        case 'codeBlock':
          md += '```\n' + text + '\n```\n\n';
          break;
        case 'divider':
          md += '---\n\n';
          break;
        default:
          md += `${text}\n\n`;
      }
    }
    return md.trim() + '\n';
  }, []);

  const toHtml = useCallback((blocks: DocContentInput[]): string => {
    let html = '';
    for (const block of blocks) {
      const text = escapeHtml(extractText(block));
      switch (block.blockType) {
        case 'heading': {
          const level = (block.attrs?.level as number) || 2;
          html += `<h${level}>${text}</h${level}>\n`;
          break;
        }
        case 'paragraph':
          html += `<p>${text}</p>\n`;
          break;
        case 'bulletList':
          html += `<ul>\n  <li>${text}</li>\n</ul>\n`;
          break;
        case 'orderedList':
          html += `<ol>\n  <li>${text}</li>\n</ol>\n`;
          break;
        case 'checkList':
          html += `<ul class="checklist">\n  <li><input type="checkbox" disabled /> ${text}</li>\n</ul>\n`;
          break;
        case 'blockquote':
          html += `<blockquote><p>${text}</p></blockquote>\n`;
          break;
        case 'codeBlock':
          html += `<pre><code>${escapeHtml(text)}</code></pre>\n`;
          break;
        case 'divider':
          html += '<hr />\n';
          break;
        default:
          html += `<p>${text}</p>\n`;
      }
    }
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(currentNode?.title || 'Documento')}</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
      line-height: 1.6;
      color: #333;
    }
    h1, h2, h3 { color: #111; }
    blockquote {
      border-left: 3px solid #68c7be;
      margin-left: 0;
      padding-left: 16px;
      color: #666;
    }
    pre {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
    }
    hr { border: none; border-top: 1px dashed #ddd; }
    ul.checklist { list-style: none; padding-left: 0; }
    ul.checklist li { margin-bottom: 4px; }
  </style>
</head>
<body>
${html}
</body>
</html>`;
  }, [currentNode?.title]);

  const handleExport = useCallback(async (format: ExportFormat) => {
    if (!nodeId || !currentNode) return;
    setExportStatus('exporting');

    try {
      const blocks = buildBlocks();
      let content: string;
      let mimeType: string;
      let extension: string;

      if (format === 'markdown') {
        content = toMarkdown(blocks);
        mimeType = 'text/markdown';
        extension = 'md';
      } else {
        content = toHtml(blocks);
        mimeType = 'text/html';
        extension = 'html';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slugifyFileName(currentNode.title)}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportStatus('done');
      setTimeout(() => setExportStatus('idle'), 2000);
    } catch (err) {
      console.error('[ExportActions] Erro ao exportar:', err);
      setExportStatus('idle');
    }
  }, [nodeId, currentNode, buildBlocks, toMarkdown, toHtml]);

  if (!nodeId || !currentNode) return null;

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded font-bold transition-colors"
        style={{
          fontSize: 11,
          color: 'var(--sagb-muted)',
          backgroundColor: 'var(--sagb-bg)',
          border: '1px solid var(--sagb-line)',
        }}
        title="Exportar documento"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {exportStatus === 'done' ? 'Exportado!' : 'Exportar'}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div
            className="absolute right-0 top-full mt-1 z-20 rounded shadow-lg border overflow-hidden"
            style={{
              minWidth: 180,
              backgroundColor: 'var(--sagb-surface)',
              borderColor: 'var(--sagb-line)',
            }}
          >
            <div
              className="px-3 py-2 font-black uppercase tracking-widest border-b"
              style={{
                fontSize: 10,
                color: 'var(--sagb-muted)',
                borderColor: 'var(--sagb-line)',
              }}
            >
              Exportar como
            </div>
            <button
              onClick={() => { handleExport('markdown'); setIsOpen(false); }}
              disabled={exportStatus === 'exporting'}
              className="w-full flex items-center gap-3 px-3 py-2 text-left transition-colors disabled:opacity-50"
              style={{
                fontSize: 12,
                color: 'var(--sagb-text)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'color-mix(in srgb, var(--sagb-text) 3%, transparent)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }}
            >
              <span style={{ fontSize: 16 }}>📝</span>
              <div className="flex flex-col">
                <span className="font-semibold">Markdown (.md)</span>
                <span style={{ fontSize: 10, color: 'var(--sagb-muted)' }}>
                  Para GitHub, Notion, editores de texto
                </span>
              </div>
            </button>
            <div
              className="border-t"
              style={{ borderColor: 'var(--sagb-line)' }}
            />
            <button
              onClick={() => { handleExport('html'); setIsOpen(false); }}
              disabled={exportStatus === 'exporting'}
              className="w-full flex items-center gap-3 px-3 py-2 text-left transition-colors disabled:opacity-50"
              style={{
                fontSize: 12,
                color: 'var(--sagb-text)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'color-mix(in srgb, var(--sagb-text) 3%, transparent)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }}
            >
              <span style={{ fontSize: 16 }}>🌐</span>
              <div className="flex flex-col">
                <span className="font-semibold">HTML (.html)</span>
                <span style={{ fontSize: 10, color: 'var(--sagb-muted)' }}>
                  Para visualização em navegador
                </span>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function extractText(block: DocContentInput): string {
  if (!block.content || block.content.length === 0) return '';
  return block.content
    .map((item) => (item.text as string) || '')
    .join(' ');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}

function slugifyFileName(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 64) || 'documento';
}
