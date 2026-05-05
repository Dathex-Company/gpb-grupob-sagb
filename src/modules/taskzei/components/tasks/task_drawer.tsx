import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TaskzeiTask } from '../../types/task.types';
import { taskzeiFacade } from '../../services/taskzei.facade';

interface TaskDrawerProps {
  task: TaskzeiTask | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (id: string) => void;
  onChangeStatus: (id: string, status: TaskzeiTask['status']) => void;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const priorityColors: Record<string, string> = {
  baixa: 'bg-[#87a8cf]',
  media: 'bg-[#e6c06d]',
  alta: 'bg-[#d78484]',
  urgente: 'bg-[#c0392b]',
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
          <svg className="h-3 w-3 animate-pulse text-[#e6c06d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[#e6c06d]">Salvando...</span>
        </>
      )}
      {status === 'saved' && (
        <>
          <svg className="h-3 w-3 text-[#68c7be]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-[#68c7be]">Salvo</span>
        </>
      )}
      {status === 'error' && (
        <>
          <svg className="h-3 w-3 text-[#d78484]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className="text-[#d78484]">Erro ao salvar</span>
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

  const titleStatus = useAutoSave();
  const descStatus = useAutoSave();
  const assigneeStatus = useAutoSave();
  const dueDateStatus = useAutoSave();

  useEffect(() => {
    setLocalTask(task);
  }, [task]);

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

      <div className="fixed right-0 top-0 h-full w-[500px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out border-l border-[#d9dee5]">
        {/* ── Header ─────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8ecf1]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onComplete(localTask.id)}
              className={`px-3 py-1.5 text-[12px] font-bold rounded-md flex items-center gap-1.5 transition-colors ${
                isCompleted
                  ? 'bg-[#eaf7f5] text-[#4ea79e] hover:bg-[#d7ece8]'
                  : 'bg-[#f0f2f4] text-[#6f7887] hover:bg-[#e8ecf1]'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {isCompleted ? 'Concluída' : 'Concluir'}
            </button>
            <select
              value={localTask.status}
              onChange={(e) => onChangeStatus(localTask.id, e.target.value as TaskzeiTask['status'])}
              className="text-[12px] font-bold bg-white border border-[#d9dee5] rounded-md px-3 py-1.5 text-[#414854] hover:bg-[#f5f6f7] outline-none focus:ring-2 focus:ring-[#87a8cf]/20 focus:border-[#87a8cf]"
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
              className="p-2 text-[#95a0b1] hover:bg-[#f0f2f4] hover:text-[#414854] rounded-lg transition-colors"
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
                className="w-full text-2xl font-black text-[#414854] bg-transparent border-none outline-none placeholder:text-[#95a0b1]"
                placeholder="Título da tarefa"
              />
            </div>

            {/* Grid: Responsável, Prazo, Prioridade, Status */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              {/* Responsável */}
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-[#95a0b1] mb-1">Responsável</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#f0f2f4] flex items-center justify-center text-[10px] font-bold text-[#6f7887]">
                    {localTask.assigneeName?.charAt(0) || '?'}
                  </div>
                  <input
                    type="text"
                    value={localTask.assigneeName || ''}
                    onChange={(e) => updateField('assigneeName', e.target.value || undefined)}
                    onBlur={handleAssigneeBlur}
                    className="flex-1 text-[12px] font-medium text-[#414854] bg-transparent border-b border-transparent focus:border-[#87a8cf] outline-none placeholder:text-[#95a0b1]"
                    placeholder="Não atribuído"
                  />
                  <SaveIndicator status={assigneeStatus.status} />
                </div>
              </div>

              {/* Prazo */}
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-[#95a0b1] mb-1">Prazo</span>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={localTask.dueDate || ''}
                    onChange={(e) => handleDueDateChange(e.target.value)}
                    className="text-[12px] font-medium text-[#414854] bg-transparent border border-[#d9dee5] rounded-md px-2 py-1 outline-none focus:border-[#87a8cf]"
                  />
                  <SaveIndicator status={dueDateStatus.status} />
                </div>
              </div>

              {/* Prioridade */}
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-[#95a0b1] mb-1">Prioridade</span>
                <select
                  value={localTask.priority}
                  onChange={(e) => {
                    const newPriority = e.target.value as TaskzeiTask['priority'];
                    updateField('priority', newPriority);
                    taskzeiFacade.updateTask(localTask.id, { priority: newPriority } as any).catch(console.error);
                  }}
                  className="text-[12px] font-medium bg-white border border-[#d9dee5] rounded-md px-2 py-1 text-[#414854] outline-none focus:border-[#87a8cf]"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              {/* Status (readonly aqui, muda pelo header) */}
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-[#95a0b1] mb-1">Status</span>
                <span className="inline-block text-[12px] font-semibold text-[#414854] bg-[#f0f2f4] px-2 py-1 rounded-md">
                  {statusLabels[localTask.status]}
                </span>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <span className="block text-[10px] font-black uppercase tracking-widest text-[#95a0b1] mb-2">Descrição</span>
              <div className="flex items-start gap-2">
                <textarea
                  value={localTask.description || ''}
                  onChange={(e) => updateField('description', e.target.value || undefined)}
                  onBlur={handleDescriptionBlur}
                  className="w-full min-h-[80px] max-h-[300px] text-[12px] text-[#414854] bg-[#fafbfc] border border-[#d9dee5] rounded-lg p-3 outline-none resize-y focus:border-[#87a8cf] focus:ring-1 focus:ring-[#87a8cf]/20 placeholder:text-[#95a0b1]"
                  placeholder="Adicione uma descrição..."
                />
                <SaveIndicator status={descStatus.status} />
              </div>
            </div>

            {/* ── Checklist ───────────────────────────── */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#95a0b1] mb-3 flex items-center gap-2">
                Checklist
                {checklistCount > 0 && (
                  <span className="text-[10px] font-semibold text-[#6f7887] bg-[#f0f2f4] px-2 py-0.5 rounded-full">
                    {checklistCompleted}/{checklistCount}
                  </span>
                )}
              </h3>

              <div className="space-y-1">
                {(localTask.checklist || []).map((item) => (
                  <div key={item.id} className="group flex items-center gap-2 px-1 py-0.5 rounded hover:bg-[#f5f6f7]">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleChecklist(item.id)}
                      className="w-4 h-4 rounded border-[#d9dee5] text-[#68c7be] focus:ring-[#68c7be] cursor-pointer"
                    />
                    <span
                      className={`flex-1 text-[12px] ${
                        item.completed ? 'text-[#95a0b1] line-through' : 'text-[#414854]'
                      }`}
                    >
                      {item.title}
                    </span>
                    <button
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-[#95a0b1] hover:text-[#d78484] transition-all"
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
                  className="flex-1 text-[12px] text-[#414854] bg-transparent border-b border-[#d9dee5] outline-none focus:border-[#87a8cf] placeholder:text-[#95a0b1] py-1"
                />
                <button
                  onClick={handleAddChecklistItem}
                  disabled={!newChecklistTitle.trim()}
                  className="text-[10px] font-bold text-white bg-[#68c7be] rounded-md px-2 py-1 disabled:opacity-40 hover:bg-[#4ea79e] transition-colors"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* ── Comentários ──────────────────────────── */}
            <div className="border-t border-[#e8ecf1] pt-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#95a0b1] mb-4">
                Comentários
                {(localTask.comments?.length || 0) > 0 && (
                  <span className="ml-2 text-[10px] font-semibold text-[#68c7be]">
                    ({localTask.comments?.length})
                  </span>
                )}
              </h3>

              {/* Add comment */}
              <div className="flex gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#eaf7f5] flex items-center justify-center text-[#68c7be] font-bold shrink-0 text-[12px]">
                  V
                </div>
                <div className="flex-1">
                  <div className="border border-[#d9dee5] rounded-lg focus-within:border-[#87a8cf] focus-within:ring-1 focus-within:ring-[#87a8cf]/20 overflow-hidden">
                    <textarea
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="w-full p-3 text-[12px] outline-none resize-none bg-transparent min-h-[60px] text-[#414854] placeholder:text-[#95a0b1]"
                      placeholder="Adicione um comentário..."
                    />
                    <div className="bg-[#fafbfc] px-3 py-2 flex justify-end border-t border-[#e8ecf1]">
                      <button
                        onClick={handleAddComment}
                        disabled={!newCommentText.trim() || isAddingComment}
                        className="px-3 py-1.5 bg-[#68c7be] text-white text-[10px] font-bold rounded hover:bg-[#4ea79e] transition-colors disabled:opacity-40"
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
                      <div className="w-8 h-8 rounded-full bg-[#f0f2f4] flex items-center justify-center text-[#6f7887] text-[10px] font-bold shrink-0">
                        {comment.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-[12px] text-[#414854]">{comment.authorName}</span>
                          <span className="text-[10px] text-[#95a0b1]">
                            {new Date(comment.createdAt).toLocaleDateString('pt-BR')} às{' '}
                            {new Date(comment.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="text-[12px] text-[#6f7887] bg-[#fafbfc] p-3 rounded-lg rounded-tl-none border border-[#e8ecf1]">
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-[#95a0b1] text-center py-4">Nenhum comentário ainda.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
