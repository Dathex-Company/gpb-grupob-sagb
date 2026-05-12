import React, { useEffect, useState } from 'react';
import { useInboxStore } from '../../store/inbox.store';
import { taskzeiFacade } from '../../services/taskzei.facade';
import type { InboxItem, InboxSource, SuggestedEntityType } from '../../types/inbox.types';

const SOURCE_LABELS: Record<InboxSource, string> = {
  manual: 'Manual',
  whatsapp: 'WhatsApp',
  email: 'E-mail',
  clickup: 'ClickUp',
  voice: 'Voz',
  sagb_chat: 'Chat SagB',
};

const STATUS_CONFIG: Record<string, { label: string; style: React.CSSProperties }> = {
  pending: {
    label: 'Pendente',
    style: {
      borderColor: 'var(--sagb-amber)',
      backgroundColor: 'color-mix(in srgb, var(--sagb-amber) 8%, transparent)',
      color: 'var(--sagb-amber)',
    },
  },
  classified: {
    label: 'Classificado',
    style: {
      borderColor: 'var(--sagb-blue)',
      backgroundColor: 'color-mix(in srgb, var(--sagb-blue) 8%, transparent)',
      color: 'var(--sagb-blue)',
    },
  },
  converted: {
    label: 'Convertido',
    style: {
      borderColor: 'var(--sagb-primary)',
      backgroundColor: 'color-mix(in srgb, var(--sagb-primary) 8%, transparent)',
      color: 'var(--sagb-primary)',
    },
  },
  dismissed: {
    label: 'Descartado',
    style: {
      borderColor: 'var(--sagb-line)',
      backgroundColor: 'var(--sagb-bg)',
      color: 'var(--sagb-muted)',
    },
  },
};

export const AgendaInteligenteInboxPage: React.FC = () => {
  const { inboxItems, setInboxItems, addInboxItem, updateInboxItem, removeInboxItem } = useInboxStore();
  const [loading, setLoading] = useState(true);
  const [newContent, setNewContent] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'classified' | 'converted' | 'dismissed'>('all');
  const [classifyingId, setClassifyingId] = useState<string | null>(null);
  const [showInboundOnly, setShowInboundOnly] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    const handleInbound = () => {
      loadItems();
    };
    window.addEventListener('hub:inbound-message', handleInbound);
    return () => window.removeEventListener('hub:inbound-message', handleInbound);
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const items = await taskzeiFacade.loadInboxItems();
      setInboxItems(items);
    } catch (err) {
      console.error('[InboxPage] Erro ao carregar inbox:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    const content = newContent.trim();
    if (!content) return;
    try {
      const item = await taskzeiFacade.addToInbox({
        content,
        source: 'manual',
        status: 'pending',
      });
      addInboxItem(item);
      setNewContent('');
    } catch (err) {
      console.error('[InboxPage] Erro ao adicionar item:', err);
    }
  };

  const handleClassify = async (id: string, suggestedType: SuggestedEntityType, confidence: number) => {
    try {
      const updated = await taskzeiFacade.classifyInboxItem(id, suggestedType, confidence);
      updateInboxItem(id, updated);
      setClassifyingId(null);
    } catch (err) {
      console.error('[InboxPage] Erro ao classificar:', err);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      const updated = await taskzeiFacade.dismissInboxItem(id);
      updateInboxItem(id, updated);
    } catch (err) {
      console.error('[InboxPage] Erro ao descartar:', err);
    }
  };

  const handleConvertToTask = async (item: InboxItem) => {
    if (item.status === 'converted') return;
    try {
      if (item.status === 'pending') {
        await handleClassify(item.id, 'task', 0.7);
      }
      const updated = await taskzeiFacade.convertInboxToEntity(item.id, 'task');
      updateInboxItem(item.id, updated);
    } catch (err) {
      console.error('[InboxPage] Erro ao converter:', err);
    }
  };

  const filteredItemsBase = filter === 'all'
    ? inboxItems
    : inboxItems.filter(i => i.status === filter);

  const filteredItems = showInboundOnly
    ? filteredItemsBase.filter(i => i.source === 'whatsapp' || i.source === 'email')
    : filteredItemsBase;

  const pendingCount = inboxItems.filter(i => i.status === 'pending').length;
  const inboundPendingCount = inboxItems.filter(i => (i.source === 'whatsapp' || i.source === 'email') && i.status === 'pending').length;

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        backgroundColor: 'var(--sagb-surface)',
        borderRadius: 'var(--sagb-radius-xl)',
        border: '1px solid var(--sagb-line)',
        boxShadow: 'var(--sagb-shadow)',
        fontFamily: "'Rubik', sans-serif",
      }}
    >
      {/* Header */}
      <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--sagb-line)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{ color: 'var(--sagb-text)' }}>
              Inbox
            </h1>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--sagb-muted)' }}>
              {pendingCount > 0
                ? `${pendingCount} item(ns) pendente(s) de classificação`
                : 'Tudo processado'}
            </p>
          </div>
          <button
            onClick={loadItems}
            className="rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors"
            style={{
              border: '1px solid var(--sagb-line)',
              backgroundColor: 'var(--sagb-surface)',
              color: 'var(--sagb-muted)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-bg)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-surface)'; }}
          >
            ↻ Atualizar
          </button>
        </div>

        {/* Quick add */}
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddItem()}
            placeholder="Adicionar item rapidamente... (Enter para enviar)"
            style={{
              flex: 1,
              borderRadius: 'var(--sagb-radius-lg)',
              border: '1px solid var(--sagb-line)',
              padding: '8px 12px',
              fontSize: 13,
              color: 'var(--sagb-text)',
              outline: 'none',
              backgroundColor: 'var(--sagb-surface)',
            }}
          />
          <button
            onClick={handleAddItem}
            disabled={!newContent.trim()}
            className="rounded-lg px-4 py-2 text-[13px] font-medium text-white disabled:opacity-40 transition-colors"
            style={{ backgroundColor: 'var(--sagb-primary)' }}
            onMouseEnter={(e) => {
              if (!newContent.trim()) return;
              (e.currentTarget as HTMLElement).style.backgroundColor = 'color-mix(in srgb, var(--sagb-primary) 80%, black)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-primary)';
            }}
          >
            + Adicionar
          </button>
        </div>

        {/* Filter tabs */}
        <div className="mt-3 flex gap-1 flex-wrap">
          {(['all', 'pending', 'classified', 'converted', 'dismissed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="rounded-lg px-3 py-1 text-[11px] font-medium transition-colors"
              style={
                filter === f
                  ? {
                      backgroundColor: 'color-mix(in srgb, var(--sagb-primary) 8%, transparent)',
                      color: 'var(--sagb-text)',
                      border: '1px solid var(--sagb-line)',
                    }
                  : {
                      color: 'var(--sagb-muted)',
                      backgroundColor: 'transparent',
                      border: '1px solid transparent',
                    }
              }
              onMouseEnter={(e) => {
                if (filter !== f) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-bg)';
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== f) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }
              }}
            >
              {f === 'all' ? 'Todas' : STATUS_CONFIG[f].label}
              {f !== 'all' && ` (${inboxItems.filter(i => i.status === f).length})`}
            </button>
          ))}
          <button
            onClick={() => setShowInboundOnly(v => !v)}
            className="rounded-lg px-3 py-1 text-[11px] font-medium transition-colors"
            style={
              showInboundOnly
                ? {
                    backgroundColor: 'color-mix(in srgb, var(--sagb-amber) 8%, transparent)',
                    color: 'var(--sagb-amber)',
                    border: '1px solid color-mix(in srgb, var(--sagb-amber) 30%, transparent)',
                  }
                : {
                    color: 'var(--sagb-muted)',
                    border: '1px solid transparent',
                    backgroundColor: 'transparent',
                  }
            }
            onMouseEnter={(e) => {
              if (!showInboundOnly) {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-bg)';
              }
            }}
            onMouseLeave={(e) => {
              if (!showInboundOnly) {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }
            }}
          >
            Inbound Hub {inboundPendingCount > 0 ? `(${inboundPendingCount})` : ''}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-[13px]" style={{ color: 'var(--sagb-muted)' }}>
            Carregando...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-[13px]" style={{ color: 'var(--sagb-muted)' }}>
            Nenhum item encontrado
          </div>
        ) : (
          <div>
            {filteredItems.map(item => (
              <InboxRow
                key={item.id}
                item={item}
                classifyingId={classifyingId}
                onClassify={(type, confidence) => handleClassify(item.id, type, confidence)}
                onStartClassify={() => setClassifyingId(item.id)}
                onCancelClassify={() => setClassifyingId(null)}
                onDismiss={() => handleDismiss(item.id)}
                onConvertToTask={() => handleConvertToTask(item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Sub-componente InboxRow ─────────────────────────────────────────

interface InboxRowProps {
  item: InboxItem;
  classifyingId: string | null;
  onClassify: (type: SuggestedEntityType, confidence: number) => void;
  onStartClassify: () => void;
  onCancelClassify: () => void;
  onDismiss: () => void;
  onConvertToTask: () => void;
}

const InboxRow: React.FC<InboxRowProps> = ({
  item,
  classifyingId,
  onClassify,
  onStartClassify,
  onCancelClassify,
  onDismiss,
  onConvertToTask,
}) => {
  const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
  const isClassifying = classifyingId === item.id;

  return (
    <div
      className="px-6 py-3 transition-colors group"
      style={{ borderBottom: '1px solid var(--sagb-line)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-bg)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium leading-relaxed" style={{ color: 'var(--sagb-text)' }}>
            {item.content}
          </p>
          <div className="mt-1.5 flex items-center gap-2 text-[11px]" style={{ color: 'var(--sagb-muted)' }}>
            <span>{SOURCE_LABELS[item.source] || item.source}</span>
            <span>•</span>
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-medium"
              style={{
                border: '1px solid',
                ...config.style,
              }}
            >
              {config.label}
            </span>
            {item.suggestedType && (
              <>
                <span>•</span>
                <span>Sugestão: {item.suggestedType}</span>
              </>
            )}
            {item.confidence !== undefined && item.confidence !== null && (
              <>
                <span>•</span>
                <span>Confiança: {Math.round(item.confidence * 100)}%</span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {item.status === 'pending' && !isClassifying && (
            <button
              onClick={onStartClassify}
              className="rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors"
              style={{ color: 'var(--sagb-muted)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'color-mix(in srgb, var(--sagb-primary) 8%, transparent)';
                (e.currentTarget as HTMLElement).style.color = 'var(--sagb-primary)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'var(--sagb-muted)';
              }}
            >
              Classificar
            </button>
          )}

          {item.status === 'pending' && (
            <button
              onClick={onConvertToTask}
              className="rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors"
              style={{ color: 'var(--sagb-muted)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'color-mix(in srgb, var(--sagb-blue) 8%, transparent)';
                (e.currentTarget as HTMLElement).style.color = 'var(--sagb-blue)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'var(--sagb-muted)';
              }}
            >
              Converter
            </button>
          )}

          {item.status !== 'dismissed' && item.status !== 'converted' && (
            <button
              onClick={onDismiss}
              className="rounded-md px-2.5 py-1 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-colors"
              style={{ color: 'var(--sagb-muted)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'color-mix(in srgb, var(--sagb-red) 8%, transparent)';
                (e.currentTarget as HTMLElement).style.color = 'var(--sagb-red)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'var(--sagb-muted)';
              }}
            >
              Descartar
            </button>
          )}
        </div>
      </div>

      {/* Classify inline form */}
      {isClassifying && (
        <div className="mt-2 flex items-center gap-2 pl-0">
          <span className="text-[11px]" style={{ color: 'var(--sagb-muted)' }}>Tipo:</span>
          {(['task', 'meeting', 'decision', 'note'] as SuggestedEntityType[]).map(type => (
            <button
              key={type}
              onClick={() => onClassify(type, type === 'task' ? 0.8 : type === 'meeting' ? 0.7 : 0.5)}
              className="rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors"
              style={{
                border: '1px solid var(--sagb-line)',
                color: 'var(--sagb-muted)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'color-mix(in srgb, var(--sagb-primary) 8%, transparent)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--sagb-primary)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--sagb-line)';
              }}
            >
              {type === 'task' ? '📋 Tarefa' : type === 'meeting' ? '📅 Reunião' : type === 'decision' ? '⚖️ Decisão' : '📝 Nota'}
            </button>
          ))}
          <button
            onClick={onCancelClassify}
            className="text-[11px] ml-2 transition-colors"
            style={{ color: 'var(--sagb-muted)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--sagb-text)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--sagb-muted)'; }}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};
