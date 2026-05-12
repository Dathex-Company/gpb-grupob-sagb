import React from 'react';

export const AgendaInteligenteProcessesPage: React.FC = () => {
  return (
    <div
      className="flex flex-col h-full overflow-hidden p-8"
      style={{
        backgroundColor: 'var(--sagb-surface)',
        borderRadius: 'var(--sagb-radius-xl)',
        border: '1px solid var(--sagb-line)',
        boxShadow: 'var(--sagb-shadow)',
        fontFamily: "'Rubik', sans-serif",
      }}
    >
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--sagb-text)' }}>
            Processos
          </h1>
          <p className="mt-2 font-medium" style={{ color: 'var(--sagb-muted)' }}>
            Rotinas e fluxos recorrentes do dia a dia.
          </p>
        </div>

        <div
          className="flex items-center justify-center h-48"
          style={{
            backgroundColor: 'var(--sagb-bg)',
            border: '1px dashed var(--sagb-line)',
            borderRadius: 'var(--sagb-radius-xl)',
          }}
        >
          <p className="font-medium" style={{ color: 'var(--sagb-muted)' }}>
            [ Modelagem de Processos Placeholder ]
          </p>
        </div>
      </div>
    </div>
  );
};
