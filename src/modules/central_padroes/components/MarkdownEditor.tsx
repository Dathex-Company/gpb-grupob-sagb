import React from 'react';
import { MarkdownPreview } from './MarkdownPreview';

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange, disabled }) => {
  const [mode, setMode] = React.useState<'edit' | 'preview'>('edit');
  return (
    <section className="cp-docs-panel">
      <div className="cp-docs-toolbar">
        <p className="cp-docs-kicker">Editor markdown</p>
        <div className="cp-docs-filters">
          <button type="button" className={`cp-docs-filter ${mode === 'edit' ? 'active' : ''}`} onClick={() => setMode('edit')}>Editar</button>
          <button type="button" className={`cp-docs-filter ${mode === 'preview' ? 'active' : ''}`} onClick={() => setMode('preview')}>Preview</button>
        </div>
      </div>
      {mode === 'edit' ? (
        <textarea
          className="cp-markdown-editor"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          rows={18}
          placeholder="# Título\n\nEscreva o conteúdo markdown do documento..."
        />
      ) : (
        <MarkdownPreview content={value} />
      )}
    </section>
  );
};

