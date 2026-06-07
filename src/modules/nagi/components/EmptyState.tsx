import React from 'react';

/* ── EmptyState ───────────────────────────────────────
 * Estado vazio reutilizável do NAGI
 * Alice UI: icon SVG, título, descrição, CTA opcional
 * ────────────────────────────────────────────────── */

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  compact?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action, compact }) => (
  <div className={`rounded-[var(--nagi-radius-xl)] border border-dashed border-[var(--nagi-line)] ${
    compact ? 'p-6' : 'p-10'
  } text-center`}
    style={{ backgroundColor: 'var(--nagi-surface-soft)' }}
  >
    {icon && (
      <div className="mb-3 text-[var(--nagi-muted)] flex justify-center">
        {icon}
      </div>
    )}
    <p className="font-semibold" style={{
      fontSize: 'var(--nagi-body)',
      color: 'var(--nagi-text-secondary)',
    }}>
      {title}
    </p>
    {description && (
      <p className="mt-1" style={{
        fontSize: 'var(--nagi-muted-size)',
        color: 'var(--nagi-muted)',
      }}>
        {description}
      </p>
    )}
    {action && (
      <button
        onClick={action.onClick}
        className="mt-3 inline-flex items-center gap-1.5 font-semibold uppercase tracking-[0.06em] transition-all hover:opacity-80"
        style={{
          fontSize: 'var(--nagi-micro)',
          color: 'var(--nagi-text-inverse)',
          backgroundColor: 'var(--nagi-primary)',
          borderRadius: 'var(--nagi-radius-md)',
          padding: '8px 16px',
          height: 37,
        }}
      >
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;
