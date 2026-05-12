import React from 'react';

export const AgendaInteligenteProjectsPage: React.FC = () => {
  return (
    <div
      className="flex flex-col h-full overflow-hidden p-8"
      style={{
        backgroundColor: 'var(--sagb-surface)',
        borderRadius: 'var(--sagb-radius-xl)',
        border: '1px solid var(--sagb-line)',
        boxShadow: 'var(--sagb-shadow)',
      }}
    >
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--sagb-text)' }}>
            Projetos
          </h1>
          <p className="mt-2 font-medium" style={{ color: 'var(--sagb-muted)' }}>
            Iniciativas e empreitadas com começo, meio e fim.
          </p>
        </div>

        <div
          className="rounded-xl p-6 flex items-center justify-center h-48 border-dashed"
          style={{
            border: '1px dashed var(--sagb-line)',
            backgroundColor: 'var(--sagb-bg)',
            color: 'var(--sagb-muted)',
          }}
        >
          <p className="font-medium">[ Projetos Kanban / Lista Placeholder ]</p>
        </div>
      </div>
    </div>
  );
};
