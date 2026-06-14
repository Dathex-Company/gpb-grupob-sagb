import React from 'react';

export const FormField: React.FC<{ label: string; value: string; onChange: (value: string) => void; placeholder?: string; textarea?: boolean }> = ({ label, value, onChange, placeholder, textarea }) => (
  <label className="block">
    <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-sagb-muted">{label}</span>
    {textarea ? (
      <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={4} className="w-full rounded-2xl border border-sagb-line bg-sagb-bg-2 px-4 py-3 text-[13px] text-sagb-text outline-none" />
    ) : (
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-sagb-line bg-sagb-bg-2 px-4 py-3 text-[13px] text-sagb-text outline-none" />
    )}
  </label>
);

