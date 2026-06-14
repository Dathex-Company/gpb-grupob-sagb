import React from 'react';

export const MetricCard: React.FC<{ label: string; value: React.ReactNode; hint?: string }> = ({ label, value, hint }) => (
  <article className="rounded-2xl border border-sagb-line bg-sagb-panel p-5 shadow-sm">
    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sagb-muted">{label}</p>
    <div className="mt-2 text-2xl font-bold text-sagb-text">{value}</div>
    {hint && <p className="mt-2 text-[11px] text-sagb-muted">{hint}</p>}
  </article>
);

