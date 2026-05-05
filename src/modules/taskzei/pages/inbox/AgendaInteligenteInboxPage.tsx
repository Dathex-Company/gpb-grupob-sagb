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

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  classified: { label: 'Classificado', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  converted: { label: 'Convertido', className: 'bg-green-100 text-green-700 border-green-200' },
  dismissed: { label: 'Descartado', className: 'bg-gray-100 text-gray-500 border-gray-200' },
};

export const AgendaInteligenteInboxPage: React.FC = () => {
  const { inboxItems, setInboxItems, addInboxItem, updateInboxItem, removeInboxItem } = useInboxStore();
  const [loading, setLoading] = useState(true);
  const [newContent, setNewContent] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'classified' | 'converted' | 'dismissed'>('all');
  const [classifyingId, setClassifyingId] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
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
      // Classifica como task se ainda não classificado
      if (item.status === 'pending') {
        await handleClassify(item.id, 'task', 0.7);
      }
      const updated = await taskzeiFacade.convertInboxToEntity(item.id, 'task');
      updateInboxItem(item.id, updated);
    } catch (err) {
      console.error('[InboxPage] Erro ao converter:', err);
    }
  };

  const filteredItems = filter === 'all'
    ? inboxItems
    : inboxItems.filter(i => i.status === filter);

  const pendingCount = inboxItems.filter(i => i.status === 'pending').length;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#e8ecf1] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#414854] tracking-tight">Inbox</h1>
            <p className="text-[12px] text-[#6f7887] mt-0.5">
              {pendingCount > 0
                ? `${pendingCount} item(ns) pendente(s) de classificação`
                : 'Tudo processado'}
            </p>
          </div>
          <button
            onClick={loadItems}
            className="rounded-lg border border-[#d9dee5] bg-white px-3 py-1.5 text-[12px] font-medium text-[#6f7887] hover:bg-[#f5f6f7] transition-colors"
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
            className="flex-1 rounded-lg border border-[#d9dee5] px-3 py-2 text-[13px] placeholder:text-[#95a0b1] focus:outline-none focus:border-[#87a8cf] focus:ring-1 focus:ring-[#87a8cf]/20"
          />
          <button
            onClick={handleAddItem}
            disabled={!newContent.trim()}
            className="rounded-lg bg-[#68c7be] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#5ab8af] disabled:opacity-40 transition-colors"
          >
            + Adicionar
          </button>
        </div>

        {/* Filter tabs */}
        <div className="mt-3 flex gap-1">
          {(['all', 'pending', 'classified', 'converted', 'dismissed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1 text-[11px] font-medium transition-colors ${
                filter === f
                  ? 'bg-[#eaf7f5] text-[#414854] border border-[#d7ece8]'
                  : 'text-[#6f7887] hover:bg-[#f5f6f7]'
              }`}
            >
              {f === 'all' ? 'Todas' : STATUS_CONFIG[f].label}
              {f !== 'all' && ` (${inboxItems.filter(i => i.status === f).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-[13px] text-[#95a0b1]">
            Carregando...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-[13px] text-[#95a0b1]">
            Nenhum item encontrado
          </div>
        ) : (
          <div className="divide-y divide-[#e8ecf1]">
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
    <div className="px-6 py-3 hover:bg-[#fcfcfd] transition-colors group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-[#414854] leading-relaxed">
            {item.content}
          </p>
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-[#95a0b1]">
            <span>{SOURCE_LABELS[item.source] || item.source}</span>
            <span>•</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${config.className}`}>
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
              className="rounded-md px-2.5 py-1 text-[11px] font-medium text-[#6f7887] hover:bg-[#eaf7f5] hover:text-[#68c7be] transition-colors"
            >
              Classificar
            </button>
          )}

          {item.status === 'pending' && (
            <button
              onClick={onConvertToTask}
              className="rounded-md px-2.5 py-1 text-[11px] font-medium text-[#6f7887] hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              Converter
            </button>
          )}

          {item.status !== 'dismissed' && item.status !== 'converted' && (
            <button
              onClick={onDismiss}
              className="rounded-md px-2.5 py-1 text-[11px] font-medium text-[#6f7887] hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              Descartar
            </button>
          )}
        </div>
      </div>

      {/* Classify inline form */}
      {isClassifying && (
        <div className="mt-2 flex items-center gap-2 pl-0">
          <span className="text-[11px] text-[#6f7887]">Tipo:</span>
          {(['task', 'meeting', 'decision', 'note'] as SuggestedEntityType[]).map(type => (
            <button
              key={type}
              onClick={() => onClassify(type, type === 'task' ? 0.8 : type === 'meeting' ? 0.7 : 0.5)}
              className="rounded-md border border-[#d9dee5] px-2.5 py-1 text-[11px] font-medium text-[#6f7887] hover:bg-[#eaf7f5] hover:border-[#68c7be] transition-colors"
            >
              {type === 'task' ? '📋 Tarefa' : type === 'meeting' ? '📅 Reunião' : type === 'decision' ? '⚖️ Decisão' : '📝 Nota'}
            </button>
          ))}
          <button
            onClick={onCancelClassify}
            className="text-[11px] text-[#95a0b1] hover:text-[#6f7887] ml-2"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};
