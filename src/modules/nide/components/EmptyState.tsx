import React, { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
    {icon && <div className="mb-4 text-slate-300 dark:text-slate-600">{icon}</div>}
    <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-2">{title}</h3>
    <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mb-6 leading-relaxed">{description}</p>
    {action}
  </div>
);
