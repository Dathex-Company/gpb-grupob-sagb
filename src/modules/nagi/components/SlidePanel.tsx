import React, { useEffect, useRef } from 'react';

/* ── SlidePanel ───────────────────────────────────────
 * Painel lateral deslizante (substitui modal overlay)
 * Alice UI: animação suave, backdrop-blur, scroll interno
 * ────────────────────────────────────────────────── */

interface SlidePanelProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const SlidePanel: React.FC<SlidePanelProps> = ({ open, onClose, title, children }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity duration-200"
        style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative h-full overflow-y-auto custom-scrollbar"
        style={{
          width: 'min(480px, 85vw)',
          backgroundColor: 'var(--nagi-surface)',
          borderLeft: `1px solid var(--nagi-line)`,
          boxShadow: '-4px 0 20px rgba(0,0,0,0.08)',
          animation: 'slideIn 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: `1px solid var(--nagi-line-soft)` }}
        >
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-[0.06em] transition-opacity hover:opacity-70"
            style={{ fontSize: 'var(--nagi-micro)', color: 'var(--nagi-brand)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Voltar
          </button>
          {title && (
            <span className="font-semibold" style={{ fontSize: 'var(--nagi-micro)', color: 'var(--nagi-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {title}
            </span>
          )}
          <button
            onClick={onClose}
            className="transition-opacity hover:opacity-70"
            style={{ color: 'var(--nagi-muted)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default SlidePanel;
