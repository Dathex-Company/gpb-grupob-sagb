import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TaskzeiTask } from '../../types/task.types';
import { taskzeiFacade } from '../../services/taskzei.facade';
import { docService } from '../../services/doc_service';
import { EntityLink, DocNode } from '../../types/doc_types';
import { docAiService } from '../../services/doc_ai_service';

interface TaskDrawerProps {
  task: TaskzeiTask | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (id: string) => void;
  onChangeStatus: (id: string, status: TaskzeiTask['status']) => void;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const priorityColors: Record<string, string> = {
  baixa: 'var(--sagb-blue)',
  media: 'var(--sagb-amber)',
  alta: 'var(--sagb-red)',
  urgente: '#C85E62',
};

const priorityLabels: Record<string, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  urgente: 'Urgente',
};

const statusLabels: Record<string, string> = {
  aberta: 'Aberta',
  em_andamento: 'Em Andamento',
  concluida: 'Concluída',
};

/** Hook: auto-save com debounce e indicador de status */
function useAutoSave() {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(async (saveFn: () => Promise<void>) => {
    setStatus('saving');
    try {
      await saveFn();
      setStatus('saved');
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return { status, save };
}

const SaveIndicator: React.FC<{ status: SaveStatus }> = ({ status }) => {
  if (status === 'idle') return null;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold">
      {status === 'saving' && (
        <>
          <svg className="h-3 w-3 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            style={{ color: 'var(--sagb-amber)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span style={{ color: 'var(--sagb-amber)' }}>Salvando...</span>
        </>
      )}
      {status === 'saved' && (
        <>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            style={{ color: 'var(--sagb-primary)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span style={{ color: 'var(--sagb-primary)' }}>Salvo</span>
        </>
      )}
      {status === 'error' && (
        <>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            style={{ color: 'var(--sagb-red)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span style={{ color: 'var(--sagb-red)' }}>Erro ao salvar</span>
        </>
      )}
    </span>
  );
};

export const TaskDrawer: React.FC<TaskDrawerProps> = ({
  task,
  isOpen,
  onClose,
  onComplete,
  onChangeStatus,
}) => {
  const [localTask, setLocalTask] = useState<TaskzeiTask | null>(null);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  // ─── Documentos de Apoio ──────────────────────────────
  const [linkedDocs, setLinkedDocs] = useState<DocNode[]>([]);
  const [allDocs, setAllDocs] = useState<DocNode[]>([]);
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [isDocSearchOpen, setIsDocSearchOpen] = useState(false);
  const [isLoadingLinks, setIsLoadingLinks] = useState(false);

  // ─── Hover states para Documentos de Apoio (--sagb-*) ─
  const [hoveredLinkedDocId, setHoveredLinkedDocId] = useState<string | null>(null);
  const [hoveredSearchItemId, setHoveredSearchItemId] = useState<string | null>(null);
  const [isCancelBtnHovered, setIsCancelBtnHovered] = useState(false);
  const [isLinkBtnHovered, setIsLinkBtnHovered] = useState(false);
  const [isDocInputFocused, setIsDocInputFocused] = useState(false);

  // ─── IA para Documentos ────────────────────────────────
  const [aiProcessing, setAiProcessing] = useState<'idle' | 'extracting' | 'summarizing' | 'error'>('idle');
  const [aiResultMessage, setAiResultMessage] = useState<string | null>(null);

  const titleStatus = useAutoSave();
  const descStatus = useAutoSave();
  const assigneeStatus = useAutoSave();
  const dueDateStatus = useAutoSave();

  useEffect(() => {
    setLocalTask(task);
  }, [task]);

  // Carrega documentos vinculados quando a task muda
  useEffect(() => {
    if (!task?.id) return;
    let cancelled = false;
    setIsLoadingLinks(true);
    (async () => {
      try {
        // Carrega todos os nós de documentos
        const allNodes = await docService.loadNodes();
        if (cancelled) return;
        setAllDocs(allNodes);

        // Busca links onde esta task é source
        const links = await docService.getLinksForEntity('task', task.id);
        if (cancelled) return;
        const docs = links
          .filter((l) => l.targetType === 'document')
          .map((l) => allNodes.find((n) => n.id === l.targetId))
          .filter((n): n is DocNode => n !== undefined);
        setLinkedDocs(docs);
      } catch (err) {
        console.error('[TaskDrawer] Erro ao carregar documentos vinculados:', err);
      } finally {
        if (!cancelled) setIsLoadingLinks(false);
      }
    })();
    return () => { cancelled = true; };
  }, [task?.id]);

  // Busca documentos para vincular
  const availableDocsToLink = allDocs.filter(
    (doc) =>
      doc.type === 'document' &&
      !linkedDocs.some((l) => l.id === doc.id) &&
      !doc.deletedAt &&
      (doc.title.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
        docSearchQuery === '')
  );

  const handleLinkDoc = async (docId: string) => {
    if (!task?.id) return;
    try {
      const metadata = {
        intent: 'execution_support',
        linked_from: 'task_drawer',
        timestamp: new Date().toISOString(),
      };
      await docService.createLink({
        sourceType: 'task',
        sourceId: task.id,
        targetType: 'document',
        targetId: docId,
        relationship: 'related',
        metadata,
      });
      const doc = allDocs.find((n) => n.id === docId);
      if (doc) setLinkedDocs((prev) => [...prev, doc]);
    } catch (err) {
      console.error('[TaskDrawer] Erro ao vincular documento:', err);
    }
  };

  const handleUnlinkDoc = async (docId: string) => {
    if (!task?.id) return;
    try {
      const links = await docService.getLinksForEntity('task', task.id);
      const linkToRemove = links.find(
        (l) => l.targetType === 'document' && l.targetId === docId
      );
      if (linkToRemove) {
        await docService.deleteLink(linkToRemove.id);
        setLinkedDocs((prev) => prev.filter((d) => d.id !== docId));
      }
    } catch (err) {
      console.error('[TaskDrawer] Erro ao desvincular documento:', err);
    }
  };

  // ─── Handlers de IA para Documentos ────────────────────
  const handleExtractActionsFromDocs = useCallback(async () => {
    if (!localTask?.id || aiProcessing !== 'idle' || linkedDocs.length === 0) return;
    setAiProcessing('extracting');
    setAiResultMessage(null);
    let hasError = false;
    try {
      const result = await docAiService.extractActionsFromLinkedDocs('task', localTask.id);
      setAiResultMessage(result.message);
      if (result.success) {
        setAiProcessing('idle');
      } else {
        setAiProcessing('error');
        hasError = true;
      }
    } catch {
      setAiResultMessage('Erro ao extrair ações dos documentos. Tente novamente.');
      setAiProcessing('error');
      hasError = true;
    }
    setTimeout(() => {
      setAiResultMessage(null);
      if (hasError) setAiProcessing('idle');
    }, hasError ? 8000 : 4000);
  }, [localTask?.id, aiProcessing, linkedDocs.length]);

  const handleSummarizeFromDocs = useCallback(async () => {
    if (!localTask?.id || aiProcessing !== 'idle' || linkedDocs.length === 0) return;
    setAiProcessing('summarizing');
    setAiResultMessage(null);
    let hasError = false;
    try {
      const docIds = linkedDocs.map(d => d.id);
      const summaries: string[] = [];
      for (const nodeId of docIds) {
        const result = await docAiService.summarizeDoc(nodeId);
        if (result.success && result.data) {
          const data = result.data as { summary: string; keywords: string[] };
          summaries.push(data.summary);
        }
      }
      setAiResultMessage(`✅ Resumo de ${summaries.length} documento(s) gerado com sucesso.`);
      setAiProcessing('idle');
    } catch {
      setAiResultMessage('Erro ao gerar resumo dos documentos. Tente novamente.');
      setAiProcessing('error');
      hasError = true;
    }
    setTimeout(() => {
      setAiResultMessage(null);
      if (hasError) setAiProcessing('idle');
    }, hasError ? 8000 : 4000);
  }, [localTask?.id, aiProcessing, linkedDocs]);

  if (!isOpen || !localTask) return null;

  const isCompleted = localTask.status === 'concluida';

  const updateField = (field: keyof TaskzeiTask, value: unknown) => {
    setLocalTask(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const saveField = async (field: string, value: unknown, saveFn: ReturnType<typeof useAutoSave>) => {
    updateField(field as keyof TaskzeiTask, value);
    await saveFn.save(() => taskzeiFacade.updateTask(localTask.id, { [field]: value } as any));
  };

  const handleTitleBlur = async () => {
    if (localTask.title !== task?.title) {
      await saveField('title', localTask.title, titleStatus);
    }
  };

  const handleDescriptionBlur = async () => {
    if (localTask.description !== task?.description) {
      await saveField('description', localTask.description, descStatus);
    }
  };

  const handleAssigneeBlur = async () => {
    if (localTask.assigneeName !== task?.assigneeName) {
      await saveField('assigneeName', localTask.assigneeName, assigneeStatus);
    }
  };

  const handleDueDateChange = async (value: string) => {
    updateField('dueDate', value || undefined);
    if (value !== (task?.dueDate || '')) {
      await dueDateStatus.save(() =>
        taskzeiFacade.updateTask(localTask.id, { dueDate: value || undefined } as any)
      );
    }
  };

  // ─── Checklist ─────────────────────────────────────────────

  const handleAddChecklistItem = async () => {
    const title = newChecklistTitle.trim();
    if (!title) return;
    setNewChecklistTitle('');
    try {
      await taskzeiFacade.addChecklistItem(localTask.id, title);
      const updated = await taskzeiFacade['provider'].getTaskById(localTask.id);
      if (updated) setLocalTask(updated);
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
    }
  };

  const handleToggleChecklist = async (itemId: string) => {
    try {
      await taskzeiFacade.toggleChecklistItem(localTask.id, itemId);
      const updated = await taskzeiFacade['provider'].getTaskById(localTask.id);
      if (updated) setLocalTask(updated);
    } catch (err) {
      console.error('Erro ao alternar item:', err);
    }
  };

  const handleRemoveChecklistItem = async (itemId: string) => {
    try {
      await taskzeiFacade.removeChecklistItem(localTask.id, itemId);
      setLocalTask(prev => prev ? {
        ...prev,
        checklist: (prev.checklist || []).filter(c => c.id !== itemId)
      } : prev);
    } catch (err) {
      console.error('Erro ao remover item:', err);
    }
  };

  // ─── Comments ──────────────────────────────────────────────

  const handleAddComment = async () => {
    const text = newCommentText.trim();
    if (!text) return;
    setIsAddingComment(true);
    setNewCommentText('');
    try {
      await taskzeiFacade.addComment(localTask.id, 'Você', text);
      const updated = await taskzeiFacade['provider'].getTaskById(localTask.id);
      if (updated) setLocalTask(updated);
    } catch (err) {
      console.error('Erro ao adicionar comentário:', err);
    } finally {
      setIsAddingComment(false);
    }
  };

  const checklistCount = (localTask.checklist || []).length;
  const checklistCompleted = (localTask.checklist || []).filter(c => c.completed).length;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 transition-opacity" onClick={onClose} />

      <div
        className="fixed right-0 top-0 h-full w-[500px] z-50 flex flex-col transform transition-transform duration-300 ease-in-out shadow-2xl"
        style={{ backgroundColor: 'var(--sagb-surface)', borderLeft: '1px solid var(--sagb-line)' }}
      >
        {/* ── Header ─────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--sagb-line)' }}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onComplete(localTask.id)}
              className={`px-3 py-1.5 text-[12px] font-bold rounded-md flex items-center gap-1.5 transition-colors ${
                isCompleted
                  ? 'text-[var(--sagb-primary)]'
                  : ''
              }`}
              style={{
                backgroundColor: isCompleted ? 'var(--sagb-primary-soft)' : 'var(--sagb-bg)',
                color: isCompleted ? 'var(--sagb-primary)' : 'var(--sagb-muted)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = isCompleted ? 'color-mix(in srgb, var(--sagb-primary) 20%, transparent)' : 'color-mix(in srgb, var(--sagb-text) 8%, transparent)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = isCompleted ? 'var(--sagb-primary-soft)' : 'var(--sagb-bg)';
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {isCompleted ? 'Concluída' : 'Concluir'}
            </button>
            <select
              value={localTask.status}
              onChange={(e) => onChangeStatus(localTask.id, e.target.value as TaskzeiTask['status'])}
              className="text-[12px] font-bold rounded-md px-3 py-1.5 outline-none"
              style={{
                backgroundColor: 'var(--sagb-surface)',
                border: '1px solid var(--sagb-line)',
                color: 'var(--sagb-text)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-bg)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-surface)'; }}
            >
              <option value="aberta">Aberta</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluida">Concluída</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <SaveIndicator status={titleStatus.status} />
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--sagb-muted)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-bg)';
                (e.currentTarget as HTMLElement).style.color = 'var(--sagb-text)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'var(--sagb-muted)';
              }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Body ───────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Título */}
            <div>
              <input
                type="text"
                value={localTask.title}
                onChange={(e) => updateField('title', e.target.value)}
                onBlur={handleTitleBlur}
                className="w-full text-2xl font-black bg-transparent border-none outline-none"
                style={{ color: 'var(--sagb-text)' }}
                placeholder="Título da tarefa"
              />
            </div>

            {/* Grid: Responsável, Prazo, Prioridade, Status */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              {/* Responsável */}
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--sagb-muted)' }}>Responsável</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ backgroundColor: 'var(--sagb-bg)', color: 'var(--sagb-muted)' }}
                  >
                    {localTask.assigneeName?.charAt(0) || '?'}
                  </div>
                  <input
                    type="text"
                    value={localTask.assigneeName || ''}
                    onChange={(e) => updateField('assigneeName', e.target.value || undefined)}
                    onBlur={handleAssigneeBlur}
                    className="flex-1 text-[12px] font-medium bg-transparent border-b border-transparent outline-none"
                    style={{ color: 'var(--sagb-text)' }}
                    placeholder="Não atribuído"
                  />
                  <SaveIndicator status={assigneeStatus.status} />
                </div>
              </div>

              {/* Prazo */}
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--sagb-muted)' }}>Prazo</span>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={localTask.dueDate || ''}
                    onChange={(e) => handleDueDateChange(e.target.value)}
                    className="text-[12px] font-medium rounded-md px-2 py-1 outline-none"
                    style={{
                      color: 'var(--sagb-text)',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--sagb-line)',
                    }}
                  />
                  <SaveIndicator status={dueDateStatus.status} />
                </div>
              </div>

              {/* Prioridade */}
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--sagb-muted)' }}>Prioridade</span>
                <select
                  value={localTask.priority}
                  onChange={(e) => {
                    const newPriority = e.target.value as TaskzeiTask['priority'];
                    updateField('priority', newPriority);
                    taskzeiFacade.updateTask(localTask.id, { priority: newPriority } as any).catch(console.error);
                  }}
                  className="text-[12px] font-medium rounded-md px-2 py-1 outline-none"
                  style={{
                    backgroundColor: 'var(--sagb-surface)',
                    border: '1px solid var(--sagb-line)',
                    color: 'var(--sagb-text)',
                  }}
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              {/* Status (readonly aqui, muda pelo header) */}
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--sagb-muted)' }}>Status</span>
                <span
                  className="inline-block text-[12px] font-semibold px-2 py-1 rounded-md"
                  style={{ color: 'var(--sagb-text)', backgroundColor: 'var(--sagb-bg)' }}
                >
                  {statusLabels[localTask.status]}
                </span>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <span className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--sagb-muted)' }}>Descrição</span>
              <div className="flex items-start gap-2">
                <textarea
                  value={localTask.description || ''}
                  onChange={(e) => updateField('description', e.target.value || undefined)}
                  onBlur={handleDescriptionBlur}
                  className="w-full min-h-[80px] max-h-[300px] text-[12px] rounded-lg p-3 outline-none resize-y"
                  style={{
                    color: 'var(--sagb-text)',
                    backgroundColor: 'var(--sagb-bg)',
                    border: '1px solid var(--sagb-line)',
                  }}
                  placeholder="Adicione uma descrição..."
                />
                <SaveIndicator status={descStatus.status} />
              </div>
            </div>

            {/* ── Checklist ───────────────────────────── */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: 'var(--sagb-muted)' }}>
                Checklist
                {checklistCount > 0 && (
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ color: 'var(--sagb-muted)', backgroundColor: 'var(--sagb-bg)' }}
                  >
                    {checklistCompleted}/{checklistCount}
                  </span>
                )}
              </h3>

              <div className="space-y-1">
                {(localTask.checklist || []).map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center gap-2 px-1 py-0.5 rounded transition-colors"
                    style={{ backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-bg)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleChecklist(item.id)}
                      className="w-4 h-4 rounded cursor-pointer"
                      style={{
                        borderColor: 'var(--sagb-line)',
                        accentColor: 'var(--sagb-primary)',
                      }}
                    />
                    <span
                      className={`flex-1 text-[12px] ${
                        item.completed ? 'line-through' : ''
                      }`}
                      style={{
                        color: item.completed ? 'var(--sagb-muted)' : 'var(--sagb-text)',
                      }}
                    >
                      {item.title}
                    </span>
                    <button
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 transition-all"
                      style={{ color: 'var(--sagb-muted)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--sagb-red)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--sagb-muted)'; }}
                      title="Remover item"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Add checklist item */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={newChecklistTitle}
                  onChange={(e) => setNewChecklistTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddChecklistItem(); }}
                  placeholder="Adicionar item..."
                  className="flex-1 text-[12px] bg-transparent outline-none py-1"
                  style={{
                    color: 'var(--sagb-text)',
                    borderBottom: '1px solid var(--sagb-line)',
                  }}
                />
                <button
                  onClick={handleAddChecklistItem}
                  disabled={!newChecklistTitle.trim()}
                  className="text-[10px] font-bold text-white rounded-md px-2 py-1 transition-colors disabled:opacity-40"
                  style={{ backgroundColor: 'var(--sagb-primary)' }}
                  onMouseEnter={(e) => {
                    if (newChecklistTitle.trim()) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'color-mix(in srgb, var(--sagb-primary) 80%, black)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-primary)';
                  }}
                >
                  + Add
                </button>
              </div>
            </div>

            {/* ── Comentários ──────────────────────────── */}
            <div className="pt-6" style={{ borderTop: '1px solid var(--sagb-line)' }}>
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: 'var(--sagb-muted)' }}>
                Comentários
                {(localTask.comments?.length || 0) > 0 && (
                  <span className="ml-2 text-[10px] font-semibold" style={{ color: 'var(--sagb-primary)' }}>
                    ({localTask.comments?.length})
                  </span>
                )}
              </h3>

              {/* Add comment */}
              <div className="flex gap-3 mb-6">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 text-[12px]"
                  style={{ backgroundColor: 'var(--sagb-primary-soft)', color: 'var(--sagb-primary)' }}
                >
                  V
                </div>
                <div className="flex-1">
                  <div
                    className="rounded-lg overflow-hidden"
                    style={{ border: '1px solid var(--sagb-line)' }}
                  >
                    <textarea
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="w-full p-3 text-[12px] outline-none resize-none bg-transparent min-h-[60px]"
                      style={{ color: 'var(--sagb-text)' }}
                      placeholder="Adicione um comentário..."
                    />
                    <div
                      className="px-3 py-2 flex justify-end"
                      style={{ backgroundColor: 'var(--sagb-bg)', borderTop: '1px solid var(--sagb-line)' }}
                    >
                      <button
                        onClick={handleAddComment}
                        disabled={!newCommentText.trim() || isAddingComment}
                        className="px-3 py-1.5 text-white text-[10px] font-bold rounded transition-colors disabled:opacity-40"
                        style={{ backgroundColor: 'var(--sagb-primary)' }}
                        onMouseEnter={(e) => {
                          if (newCommentText.trim()) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'color-mix(in srgb, var(--sagb-primary) 80%, black)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-primary)';
                        }}
                      >
                        {isAddingComment ? 'Enviando...' : 'Comentar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment list */}
              {localTask.comments && localTask.comments.length > 0 ? (
                <div className="space-y-4">
                  {localTask.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={{ backgroundColor: 'var(--sagb-bg)', color: 'var(--sagb-muted)' }}
                      >
                        {comment.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-[12px]" style={{ color: 'var(--sagb-text)' }}>{comment.authorName}</span>
                          <span className="text-[10px]" style={{ color: 'var(--sagb-muted)' }}>
                            {new Date(comment.createdAt).toLocaleDateString('pt-BR')} às{' '}
                            {new Date(comment.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div
                          className="text-[12px] p-3 rounded-lg rounded-tl-none"
                          style={{
                            color: 'var(--sagb-text)',
                            backgroundColor: 'var(--sagb-bg)',
                            border: '1px solid var(--sagb-line)',
                          }}
                        >
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-center py-4" style={{ color: 'var(--sagb-muted)' }}>Nenhum comentário ainda.</p>
              )}
            </div>

            {/* ── Documentos de Apoio ────────────────────── */}
            <div className="pt-6" style={{ borderTop: '1px solid var(--sagb-line)' }}>
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: 'var(--sagb-muted)' }}>
                Documentos de Apoio
                {linkedDocs.length > 0 && (
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ color: 'var(--sagb-primary)', backgroundColor: 'var(--sagb-primary-soft)' }}
                  >
                    {linkedDocs.length}
                  </span>
                )}
              </h3>

              {isLoadingLinks ? (
                <p className="text-[12px] text-center py-4" style={{ color: 'var(--sagb-muted)' }}>Carregando...</p>
              ) : (
                <>
                  {/* Lista de documentos vinculados */}
                  {linkedDocs.length > 0 && (
                    <div className="space-y-1 mb-4">
                      {linkedDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-2 px-2 py-1.5 rounded transition-colors"
                          onMouseEnter={() => setHoveredLinkedDocId(doc.id)}
                          onMouseLeave={() => setHoveredLinkedDocId(null)}
                          style={{ backgroundColor: hoveredLinkedDocId === doc.id ? 'var(--sagb-bg)' : 'transparent' }}
                        >
                          <span style={{ fontSize: 14 }}>{doc.icon || '📄'}</span>
                          <span className="flex-1 text-[12px] font-medium truncate" style={{ color: 'var(--sagb-text)' }}>
                            {doc.title}
                          </span>
                          <button
                            onClick={() => handleUnlinkDoc(doc.id)}
                            className="p-0.5 transition-all"
                            style={{
                              opacity: hoveredLinkedDocId === doc.id ? 1 : 0,
                              color: hoveredLinkedDocId === doc.id ? 'var(--sagb-red)' : 'var(--sagb-muted)',
                            }}
                            title="Desvincular"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Ações de IA para Documentos */}
                  {linkedDocs.length > 0 && aiProcessing === 'idle' && (
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={handleExtractActionsFromDocs}
                        className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition-colors"
                        style={{ color: 'var(--sagb-primary)' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-primary-soft)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                        title="Extrair ações de todos os documentos vinculados"
                      >
                        ✨ Extrair Ações
                      </button>
                      <button
                        onClick={handleSummarizeFromDocs}
                        className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition-colors"
                        style={{ color: 'var(--sagb-primary)' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-primary-soft)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                        title="Gerar resumo de todos os documentos vinculados"
                      >
                        ✨ Gerar Resumo
                      </button>
                    </div>
                  )}
                  {aiProcessing !== 'idle' && (
                    <div className="flex items-center gap-1.5 mb-3 text-[11px] font-semibold" style={{ color: 'var(--sagb-primary)' }}>
                      <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {aiProcessing === 'extracting' ? 'Extraindo ações...' : 'Gerando resumo...'}
                    </div>
                  )}
                  {aiResultMessage && aiProcessing === 'idle' && (
                    <div className="mb-3 text-[11px] p-2 rounded" style={{
                      color: 'var(--sagb-text)',
                      backgroundColor: 'var(--sagb-primary-soft)',
                      border: '1px solid var(--sagb-primary)',
                    }}>
                      {aiResultMessage}
                    </div>
                  )}

                  {/* Seção de busca/vincular */}
                  <div>
                    {isDocSearchOpen ? (
                      <div className="relative">
                        <input
                          type="text"
                          value={docSearchQuery}
                          onChange={(e) => setDocSearchQuery(e.target.value)}
                          placeholder="Buscar documentos para vincular..."
                          className="w-full text-[12px] rounded-lg p-2 outline-none"
                          style={{
                            color: 'var(--sagb-text)',
                            backgroundColor: 'var(--sagb-bg)',
                            border: isDocInputFocused ? '1px solid var(--sagb-blue)' : '1px solid var(--sagb-line)',
                          }}
                          onFocus={() => setIsDocInputFocused(true)}
                          onBlur={() => setIsDocInputFocused(false)}
                          autoFocus
                        />
                        {docSearchQuery && availableDocsToLink.length > 0 && (
                          <div
                            className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
                            style={{
                              backgroundColor: 'var(--sagb-surface)',
                              border: '1px solid var(--sagb-line)',
                            }}
                          >
                            {availableDocsToLink.slice(0, 10).map((doc) => (
                              <button
                                key={doc.id}
                                onClick={() => {
                                  handleLinkDoc(doc.id);
                                  setDocSearchQuery('');
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors"
                                onMouseEnter={() => setHoveredSearchItemId(doc.id)}
                                onMouseLeave={() => setHoveredSearchItemId(null)}
                                style={{ backgroundColor: hoveredSearchItemId === doc.id ? 'var(--sagb-bg)' : 'transparent' }}
                              >
                                <span style={{ fontSize: 14 }}>{doc.icon || '📄'}</span>
                                <span className="text-[12px] truncate" style={{ color: 'var(--sagb-text)' }}>{doc.title}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {docSearchQuery && availableDocsToLink.length === 0 && (
                          <p className="text-[12px] mt-1 px-1" style={{ color: 'var(--sagb-muted)' }}>
                            Nenhum documento encontrado.
                          </p>
                        )}
                        <button
                          onClick={() => { setIsDocSearchOpen(false); setDocSearchQuery(''); }}
                          className="mt-1 text-[10px] font-semibold"
                          style={{
                            color: isCancelBtnHovered ? 'var(--sagb-muted)' : 'var(--sagb-muted)',
                          }}
                          onMouseEnter={() => setIsCancelBtnHovered(true)}
                          onMouseLeave={() => setIsCancelBtnHovered(false)}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsDocSearchOpen(true)}
                        className="flex items-center gap-1.5 text-[12px] font-semibold transition-colors"
                        style={{
                          color: isLinkBtnHovered ? 'var(--sagb-primary)' : 'var(--sagb-primary)',
                        }}
                        onMouseEnter={() => setIsLinkBtnHovered(true)}
                        onMouseLeave={() => setIsLinkBtnHovered(false)}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Vincular documento
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
