import React from 'react';
import { MarkdownPreview } from './MarkdownPreview';

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange, disabled }) => {
  const [preview, setPreview] = React.useState(false);
  return (
    <section className="cp-docs-panel cp-markdown-editor-panel">
      <div className="cp-docs-toolbar">
        <p className="cp-docs-kicker">Editor markdown</p>
        <div className="cp-docs-filters">
          <button type="button" className={`cp-docs-filter ${!preview ? 'active' : ''}`} onClick={() => setPreview(false)}>✏️ Editar</button>
          <button type="button" className={`cp-docs-filter ${preview ? 'active' : ''}`} onClick={() => setPreview(true)}>👁️ Preview</button>
        </div>
      </div>
      {preview ? (
        <div className="cp-markdown-editor-preview">
          <MarkdownPreview content={value} emptyMessage="Nada para mostrar. Escreva algo no editor." />
        </div>
      ) : (
        <textarea
          className="cp-markdown-editor-textarea"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          rows={20}
          placeholder="# Título do documento\n\nEscreva o conteúdo markdown aqui...\n\n## Seção\n\n- item 1\n- item 2\n\n**negrito** *itálico* `código`"
        />
      )}
      <div className="cp-markdown-editor-footer">
        <span className="cp-muted-text">{value.length} caracteres | {value.split('\n').length} linhas</span>
        <span className="cp-muted-text">Markdown suportado: títulos, listas, negrito, itálico, código inline</span>
      </div>
    </section>
  );
};
