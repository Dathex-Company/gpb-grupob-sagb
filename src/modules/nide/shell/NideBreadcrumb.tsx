import React from 'react';

interface NideBreadcrumbProps {
  items?: Array<{ label: string; href?: string }>;
}

export const NideBreadcrumb: React.FC<NideBreadcrumbProps> = ({ items = [] }) => {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-slate-300 dark:text-slate-600">/</span>}
          {item.href ? (
            <a href={item.href} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {item.label}
            </a>
          ) : (
            <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
