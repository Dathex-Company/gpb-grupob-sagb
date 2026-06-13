import React from 'react';

type MarkdownPreviewProps = {
  content?: string | null;
  emptyMessage?: string;
};

const renderInline = (value: string) => value
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\*([^*]+)\*/g, '<em>$1</em>');

const markdownToHtml = (content: string) => content
  .split('\n')
  .map((line) => {
    if (line.startsWith('### ')) return `<h3>${renderInline(line.slice(4))}</h3>`;
    if (line.startsWith('## ')) return `<h2>${renderInline(line.slice(3))}</h2>`;
    if (line.startsWith('# ')) return `<h1>${renderInline(line.slice(2))}</h1>`;
    if (line.startsWith('- ')) return `<p class="cp-md-bullet">• ${renderInline(line.slice(2))}</p>`;
    if (!line.trim()) return '<br />';
    return `<p>${renderInline(line)}</p>`;
  })
  .join('');

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, emptyMessage = 'Conteúdo markdown não disponível para este documento.' }) => {
  if (!content?.trim()) {
    return (
      <div className="cp-docs-inline-alert">
        {emptyMessage}
      </div>
    );
  }

  return (
    <article
      className="cp-markdown-preview"
      dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
    />
  );
};

