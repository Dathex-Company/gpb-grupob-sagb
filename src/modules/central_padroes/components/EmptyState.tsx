import React from 'react';

export const EmptyState: React.FC<{ title: string; description: string; action?: React.ReactNode }> = ({ title, description, action }) => (
  <div className="rounded-3xl border border-dashed border-sagb-line bg-sagb-bg-2 p-8 text-center">
    <h3 className="text-lg font-bold text-sagb-text">{title}</h3>
    <p className="mt-2 text-[13px] text-sagb-muted">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

