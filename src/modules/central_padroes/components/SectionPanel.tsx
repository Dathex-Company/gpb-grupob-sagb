import React from 'react';

export const SectionPanel: React.FC<{ title: string; eyebrow?: string; description?: string; children: React.ReactNode }> = ({ title, eyebrow, description, children }) => (
  <section className="rounded-3xl border border-sagb-line bg-sagb-panel p-5 shadow-sm">
    <div className="mb-4">
      {eyebrow && <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sagb-muted">{eyebrow}</p>}
      <h2 className="mt-1 text-lg font-bold text-sagb-text">{title}</h2>
      {description && <p className="mt-2 text-[12px] leading-relaxed text-sagb-muted">{description}</p>}
    </div>
    {children}
  </section>
);

