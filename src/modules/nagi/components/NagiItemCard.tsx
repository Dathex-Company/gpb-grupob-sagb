import React from 'react';
import {
  NagiItem,
  ITEM_TYPE_LABELS,
  OPERATIONAL_STATUS_LABELS,
} from '../domain/types';

/* ── NagiItemCard ─────────────────────────────────────
 * Card de item do NAGI com 3 variantes de tamanho
 * Alice UI: radius 22px, hover sutil, semântica clara
 * ────────────────────────────────────────────────── */

type CardVariant = 'compact' | 'default' | 'highlight';

interface NagiItemCardProps {
  item: NagiItem;
  variant?: CardVariant;
  onClick?: () => void;
}

const NagiItemCard: React.FC<NagiItemCardProps> = ({ item, variant = 'default', onClick }) => {
  const isCompact = variant === 'compact';
  const isHighlight = variant === 'highlight';

  const scoreColor = item.score.final >= 80
    ? 'var(--nagi-success)'
    : item.score.final >= 50
      ? 'var(--nagi-warning)'
      : 'var(--nagi-muted)';

  const priorityColor = item.priority === 'alta'
    ? 'var(--nagi-danger)'
    : item.priority === 'media'
      ? 'var(--nagi-warning)'
      : 'var(--nagi-muted-light)';

  return (
    <button
      onClick={onClick}
      className="group text-left transition-all hover:-translate-y-[1px]"
      style={{
        width: '100%',
        borderRadius: 'var(--nagi-radius-xl)',
        border: `1px solid var(--nagi-line)`,
        backgroundColor: 'var(--nagi-surface)',
        padding: isCompact ? '12px' : isHighlight ? '20px' : '16px',
        minHeight: isCompact ? 'auto' : isHighlight ? '180px' : '124px',
        boxShadow: 'var(--nagi-shadow-sm)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--nagi-shadow-md)';
        e.currentTarget.style.borderColor = 'var(--nagi-muted-light)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--nagi-shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--nagi-line)';
      }}
    >
      {/* Top badges line */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className="inline-flex items-center gap-1 font-semibold uppercase tracking-[0.04em]"
          style={{
            fontSize: isCompact ? '8px' : 'var(--nagi-micro)',
            borderRadius: 'var(--nagi-radius-sm)',
            padding: '0 8px',
            height: isCompact ? 18 : 24,
            backgroundColor: 'var(--nagi-success-soft)',
            color: 'var(--nagi-success)',
            border: `1px solid var(--nagi-success-line)`,
          }}
        >
          {ITEM_TYPE_LABELS[item.itemType]}
        </span>
        <span style={{
          fontSize: 'var(--nagi-micro)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: priorityColor,
        }}>
          {item.priority === 'alta' ? 'Alta' : item.priority === 'media' ? 'Média' : 'Baixa'}
        </span>
      </div>

      {/* Title */}
      {!isCompact && (
        <h3 className="font-semibold tracking-[-0.01em] line-clamp-2 mb-1"
          style={{
            fontSize: isHighlight ? '18px' : 'var(--nagi-module-title)',
            color: 'var(--nagi-text)',
          }}
        >
          {item.title}
        </h3>
      )}
      {isCompact && (
        <h4 className="font-semibold tracking-[-0.01em] line-clamp-1"
          style={{
            fontSize: 'var(--nagi-body)',
            color: 'var(--nagi-text)',
          }}
        >
          {item.title}
        </h4>
      )}

      {/* Description */}
      {!isCompact && (
        <p className="leading-5 line-clamp-2 mb-3"
          style={{
            fontSize: 'var(--nagi-muted-size)',
            color: 'var(--nagi-muted)',
          }}
        >
          {item.summary}
        </p>
      )}

      {/* Footer */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5"
          style={{
            fontSize: isCompact ? '9px' : 'var(--nagi-muted-size)',
            color: 'var(--nagi-muted)',
          }}
        >
          <span style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            display: 'inline-block',
            backgroundColor: item.operationalStatus === 'concluido'
              ? 'var(--nagi-success)'
              : item.operationalStatus === 'em_execucao' || item.operationalStatus === 'em_teste'
                ? 'var(--nagi-warning)'
                : 'var(--nagi-muted-light)',
          }} />
          {OPERATIONAL_STATUS_LABELS[item.operationalStatus]}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold"
            style={{
              fontSize: isCompact ? '9px' : 'var(--nagi-micro)',
              color: 'var(--nagi-brand)',
            }}
          >
            {item.category}
          </span>
          {item.handoffRecord && (
            <span style={{
              fontSize: isCompact ? '9px' : 'var(--nagi-muted-size)',
              color: 'var(--nagi-muted)',
            }}>
              → {item.handoffRecord.targetModuleLabel}
            </span>
          )}
          {item.score.final > 0 && !isCompact && (
            <span className="font-semibold" style={{ fontSize: 'var(--nagi-micro)', color: scoreColor }}>
              {item.score.final}/100
            </span>
          )}
        </div>
      </div>

      {/* Score bar for highlight variant */}
      {isHighlight && item.score.final > 0 && (
        <div className="mt-3">
          <div style={{
            height: 6,
            borderRadius: 3,
            backgroundColor: 'var(--nagi-neutral-soft)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${item.score.final}%`,
              borderRadius: 3,
              background: `linear-gradient(90deg, var(--nagi-brand), var(--nagi-success))`,
              transition: 'width var(--nagi-transition-slow)',
            }} />
          </div>
        </div>
      )}
    </button>
  );
};

export default NagiItemCard;
