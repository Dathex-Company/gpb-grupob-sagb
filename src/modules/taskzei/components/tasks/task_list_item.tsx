import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TaskzeiTask } from '../../types/task.types';
import { TaskzeiTaskInlineInput } from '../../types/taskzei.contracts';
import { useFocusStore } from '../../../foco_total/stores/focusStore';

interface TaskListItemProps {
  task: TaskzeiTask;
  onClick: (task: TaskzeiTask) => void;
  onComplete: (id: string, e: React.MouseEvent) => void;
  onChangeStatus?: (id: string, status: TaskzeiTask['status']) => void;
  onUpdateTask?: (id: string, updates: Partial<TaskzeiTaskInlineInput>) => void;
  onDuplicate?: (id: string) => void;
  onArchive?: (id: string) => void;
  variant?: 'table' | 'card';
}

export const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  onClick,
  onComplete,
  onChangeStatus,
  onUpdateTask,
  onDuplicate,
  onArchive,
  variant = 'table'
}) => {
  const isCompleted = task.status === 'concluida';
  const [titleDraft, setTitleDraft] = useState(task.title);
  const [assigneeDraft, setAssigneeDraft] = useState(task.assigneeName ?? '');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const contextRef = useRef<HTMLDivElement>(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextRef.current && !contextRef.current.contains(e.target as Node)) {
        setShowContextMenu(false);
      }
    };
    if (showContextMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showContextMenu]);

  const handleFocusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    useFocusStore.getState().setPendingTask(task.title);
    window.dispatchEvent(new CustomEvent('sagb:navigate', { detail: 'foco-total' }));
  };

  const dueDateInput = useMemo(() => {
    if (!task.dueDate) return '';
    const date = new Date(task.dueDate);
    if (Number.isNaN(date.getTime())) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [task.dueDate]);

  const [dueDateDraft, setDueDateDraft] = useState(dueDateInput);

  useEffect(() => {
    setTitleDraft(task.title);
    setAssigneeDraft(task.assigneeName ?? '');
    setDueDateDraft(dueDateInput);
  }, [task.title, task.assigneeName, dueDateInput]);

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'alta': return 'text-red-600 bg-red-50 border-red-200';
      case 'media': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'baixa': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusLabel = () => {
    switch (task.status) {
      case 'aberta': return 'Aberta';
      case 'em_andamento': return 'Em Andamento';
      case 'concluida': return 'Concluída';
      default: return task.status;
    }
  };

  const getPriorityLabel = () => {
    switch (task.priority) {
      case 'alta':
        return 'Alta';
      case 'media':
        return 'Média';
      default:
        return 'Baixa';
    }
  };

  const getPriorityDotColor = () => {
    switch (task.priority) {
      case 'alta':
        return 'bg-[#d78484]';
      case 'media':
        return 'bg-[#e6c06d]';
      default:
        return 'bg-[#87a8cf]';
    }
  };

  if (variant === 'card') {
    return (
      <div
        onClick={() => onClick(task)}
        className="group cursor-pointer rounded-lg border border-[#d9dee5] bg-white p-3 shadow-sm transition-colors hover:bg-[#fafbfc]"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className={`truncate text-[12px] font-medium ${isCompleted ? 'text-[#95a0b1] line-through' : 'text-[#414854]'}`}>
              {task.title}
            </h3>
            {task.description && <p className="mt-1 truncate text-[11px] text-[#95a0b1]">{task.description}</p>}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleFocusClick}
              title="Iniciar Foco Total"
              className="flex h-5 w-5 items-center justify-center rounded border border-[#d9dee5] bg-white text-[12px] transition-colors hover:border-[#87a8cf] hover:bg-[#f0f2f4]"
            >
              🎯
            </button>
            <button
              onClick={(e) => onComplete(task.id, e)}
              className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                isCompleted ? 'border-[#68c7be] bg-[#68c7be] text-white' : 'border-[#d9dee5] hover:border-[#87a8cf]'
              }`}
            >
              {isCompleted && (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[10px] text-[#6f7887]">
          <span className={`rounded-md border px-1.5 py-0.5 ${getPriorityColor()}`}>{getPriorityLabel()}</span>
          <span>{getStatusLabel()}</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onClick(task)}
      className="group grid cursor-pointer grid-cols-[minmax(230px,2.6fr)_minmax(90px,1fr)_minmax(120px,1.2fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(110px,1fr)] items-center gap-3 border-b border-[#e8ecf1] px-3 py-2.5 text-xs transition-colors hover:bg-[#fafbfc]"
    >
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex-shrink-0 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleFocusClick}
            title="Iniciar Foco Total"
            className="flex h-5 w-5 items-center justify-center rounded border border-[#d9dee5] bg-white text-[12px] transition-colors hover:border-[#87a8cf] hover:bg-[#f0f2f4]"
          >
            🎯
          </button>
          <button 
            onClick={(e) => onComplete(task.id, e)}
            className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
              isCompleted 
                ? 'border-[#68c7be] bg-[#68c7be] text-white' 
                : 'border-[#d9dee5] hover:border-[#87a8cf]'
            }`}
          >
            {isCompleted && (
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>

        <div className="min-w-0" onClick={(e) => e.stopPropagation()}>
          <input
            value={titleDraft}
            onChange={(event) => setTitleDraft(event.target.value)}
            onBlur={() => {
              const normalized = titleDraft.trim();
              if (!normalized || normalized === task.title) {
                setTitleDraft(task.title);
                return;
              }
              onUpdateTask?.(task.id, { title: normalized });
            }}
            className={`h-7 w-full rounded-md border border-transparent bg-transparent px-2 text-[12px] font-medium focus:border-[#d9dee5] focus:bg-white focus:outline-none ${isCompleted ? 'text-[#95a0b1] line-through' : 'text-[#414854]'}`}
          />
          {task.description && <p className="mt-0.5 truncate text-[11px] text-[#95a0b1]">{task.description}</p>}
        </div>
      </div>

      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <span className={`h-2 w-2 rounded-sm ${getPriorityDotColor()}`} />
        <select
          value={task.priority}
          onChange={(event) => onUpdateTask?.(task.id, { priority: event.target.value as TaskzeiTask['priority'] })}
          className={`h-7 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold focus:outline-none ${getPriorityColor()} ${isCompleted ? 'opacity-50' : ''}`}
        >
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>
      </div>

      <div className="text-[11px] text-[#6f7887]">TaskZei</div>

      <div className="flex items-center gap-1.5 text-[11px] text-[#6f7887]" onClick={(e) => e.stopPropagation()}>
        <div className="grid h-5 w-5 place-items-center rounded-full border border-[#d9dee5] bg-[#f0f2f4] text-[10px] font-semibold text-[#6f7887]">
          {assigneeDraft ? assigneeDraft.charAt(0).toUpperCase() : '—'}
        </div>
        <input
          value={assigneeDraft}
          onChange={(event) => setAssigneeDraft(event.target.value)}
          onBlur={() => {
            const normalized = assigneeDraft.trim();
            if (normalized === (task.assigneeName ?? '')) return;
            onUpdateTask?.(task.id, { assigneeName: normalized || undefined });
          }}
          placeholder="Responsável"
          className="h-7 w-full rounded-md border border-transparent bg-transparent px-2 text-[11px] text-[#6f7887] focus:border-[#d9dee5] focus:bg-white focus:outline-none"
        />
      </div>

      <div className={`text-[11px] ${isCompleted ? 'text-[#95a0b1]' : 'text-[#6f7887]'}`} onClick={(e) => e.stopPropagation()}>
        <input
          type="date"
          value={dueDateDraft}
          onChange={(event) => setDueDateDraft(event.target.value)}
          onBlur={() => {
            if (dueDateDraft === dueDateInput) return;
            onUpdateTask?.(task.id, { dueDate: dueDateDraft || undefined });
          }}
          className="h-7 w-full rounded-md border border-[#d9dee5] bg-[#fafbfc] px-2 text-[11px] text-[#6f7887] focus:border-[#87a8cf] focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-start" onClick={(e) => e.stopPropagation()}>
        {onUpdateTask || onChangeStatus ? (
          <select
            value={task.status}
            onChange={(event) => {
              const nextStatus = event.target.value as TaskzeiTask['status'];
              if (onUpdateTask) {
                onUpdateTask(task.id, { status: nextStatus });
              } else {
                onChangeStatus?.(task.id, nextStatus);
              }
            }}
            className="h-7 rounded-md border border-[#d9dee5] bg-[#fafbfc] px-2 text-[10px] font-semibold uppercase tracking-wide text-[#6f7887] focus:border-[#87a8cf] focus:outline-none"
          >
            <option value="aberta">Aberta</option>
            <option value="em_andamento">Em andamento</option>
            <option value="concluida">Concluída</option>
          </select>
        ) : (
          <span className="rounded-md border border-[#d9dee5] bg-[#f5f6f7] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#6f7887]">
            {getStatusLabel()}
          </span>
        )}
      </div>

      {/* ── Menu de contexto (⋯) ─────────────────────── */}
      <div className="relative flex items-center justify-center" onClick={(e) => e.stopPropagation()} ref={contextRef}>
        <button
          onClick={() => setShowContextMenu(prev => !prev)}
          className="flex h-6 w-6 items-center justify-center rounded text-[#95a0b1] opacity-0 group-hover:opacity-100 hover:bg-[#f0f2f4] hover:text-[#414854] transition-all"
          title="Mais ações"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01" />
          </svg>
        </button>

        {showContextMenu && (
          <div className="absolute right-0 top-full mt-1 z-50 w-40 rounded-lg border border-[#d9dee5] bg-white shadow-lg py-1">
            <button
              onClick={() => { onDuplicate?.(task.id); setShowContextMenu(false); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-[11px] text-[#414854] hover:bg-[#f5f6f7] transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-[#95a0b1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Duplicar
            </button>
            <button
              onClick={() => { onArchive?.(task.id); setShowContextMenu(false); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-[11px] text-[#414854] hover:bg-[#f5f6f7] transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-[#95a0b1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Arquivar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
