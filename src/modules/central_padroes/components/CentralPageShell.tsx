import React from 'react';

export const CentralPageShell: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="h-full overflow-y-auto bg-sagb-bg p-6 text-sagb-text md:p-8">
    <header className="mb-6 rounded-3xl border border-sagb-line bg-sagb-panel p-6 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sagb-muted">Central de Padrões V1</p>
      <h1 className="mt-2 text-2xl font-black tracking-tight text-sagb-text md:text-3xl">{title}</h1>
      <p className="mt-2 max-w-4xl text-[13px] leading-relaxed text-sagb-muted">{subtitle}</p>
    </header>
    <div className="space-y-6">{children}</div>
  </div>
);

