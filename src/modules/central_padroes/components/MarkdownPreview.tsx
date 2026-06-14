import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MermaidRenderer } from './MermaidRenderer';

type MarkdownPreviewProps = {
  content?: string | null;
  emptyMessage?: string;
};

/**
 * Detecta se um bloco de código parece Mermaid mesmo sem language-mermaid.
 * Padrões: flowchart, graph, sequenceDiagram, classDiagram, stateDiagram, gantt, pie, erDiagram, journey, mindmap, timeline
 */
const isMermaidCode = (code: string): boolean => {
  const trimmed = code.trim();
  return /^(flowchart|graph\s+(TB|BT|RL|LR|TD)|sequenceDiagram|classDiagram|stateDiagram(-v2)?|gantt|pie\b|erDiagram|journey|mindmap|timeline|quadrantChart|requirementDiagram|C4Context|C4Container|C4Component|C4Dynamic|C4Deployment|sankey-beta|xychart-beta|block-beta|packet|architecture|kanban)\b/i.test(trimmed);
};

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, emptyMessage = 'Nenhum conteúdo markdown disponível.' }) => {
  if (!content?.trim()) {
    return <div className="cp-markdown-empty">{emptyMessage}</div>;
  }

  return (
    <div className="cp-markdown-preview">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, node, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match?.[1];
            const codeStr = String(children).replace(/\n$/, '');

            // Inline code (no className, no language)
            if (!className && !lang && !codeStr.includes('\n')) {
              return <code className="cp-inline-code" {...props}>{children}</code>;
            }

            // Mermaid explícito ou detectado automaticamente
            if (lang === 'mermaid' || (!lang && codeStr.includes('\n') && isMermaidCode(codeStr))) {
              return <MermaidRenderer code={codeStr} />;
            }

            // Bloco de código normal
            const langLabel = lang ? <span className="cp-code-lang">{lang}</span> : null;
            return (
              <div className="cp-code-block">
                {langLabel}
                <pre><code className={className} {...props}>{children}</code></pre>
              </div>
            );
          },
          // Checkboxes
          input({ checked, disabled, ...props }) {
            return <input type="checkbox" checked={checked} disabled={disabled} readOnly className="cp-checkbox" {...props} />;
          },
          // Tabelas
          table({ children }) {
            return <div className="cp-table-wrap"><table>{children}</table></div>;
          },
          // Blockquote estilizado
          blockquote({ children }) {
            return <blockquote className="cp-blockquote">{children}</blockquote>;
          },
          // Headings com hierarquia visual
          h1({ children }) { return <h1 className="cp-h1">{children}</h1>; },
          h2({ children }) { return <h2 className="cp-h2">{children}</h2>; },
          h3({ children }) { return <h3 className="cp-h3">{children}</h3>; },
          h4({ children }) { return <h4 className="cp-h4">{children}</h4>; },
          // Listas
          ul({ children }) { return <ul className="cp-ul">{children}</ul>; },
          ol({ children }) { return <ol className="cp-ol">{children}</ol>; },
          // Links externos abrem em nova aba
          a({ href, children, ...props }) {
            const isExternal = href?.startsWith('http');
            return <a href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined} className="cp-link" {...props}>{children}</a>;
          },
          // Imagens responsivas
          img({ src, alt, ...props }) {
            return <img src={src} alt={alt} className="cp-img" loading="lazy" {...props} />;
          },
          // Linha horizontal
          hr() { return <hr className="cp-hr" />; },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
