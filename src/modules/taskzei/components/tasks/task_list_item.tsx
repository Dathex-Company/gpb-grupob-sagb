import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TaskzeiTask } from '../../types/task.types';
import { TaskzeiTaskInlineInput } from '../../types/taskzei.contracts';
import { useFocusWidgetStore } from '../../store/focusWidgetStore';
import { TaskzeiUserOption } from '../../services/taskzei_users.service';

interface TaskListItemProps {
  task: TaskzeiTask;
  onClick: (task: TaskzeiTask) => void;
  onComplete: (id: string, e: React.MouseEvent) => void;
  onChangeStatus?: (id: string, status: TaskzeiTask['status']) => void;
  onUpdateTask?: (id: string, updates: Partial<TaskzeiTaskInlineInput>) => void;
  onDuplicate?: (id: string) => void;
  onArchive?: (id: string) => void;
  onCreateSubtask?: (parentTaskId: string) => void;
  users?: TaskzeiUserOption[];
  variant?: 'table' | 'card';
  gridColumnsStyle?: string;
  isExpanded?: boolean;
  onToggleExpand?: (id: string) => void;
}

// ─── Helpers de cor semântica (Robust Clean) ──────────────────────────
const STATUS_COLORS: Record<string, string> = {
  aberta: 'var(--sagb-blue)',
  em_andamento: 'var(--sagb-primary)',
  concluida: 'var(--sagb-primary)',
};

const PRIORITY_COLORS: Record<string, string> = {
  alta: 'var(--sagb-red)',
  media: 'var(--sagb-amber)',
  baixa: 'var(--sagb-blue)',
};

const PRIORITY_LABELS: Record<string, string> = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

const STATUS_LABELS: Record<string, string> = {
  aberta: 'Aberta',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
};

// ─── Componente ─────────────────────────────────────────────────────
export const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  onClick,
  onComplete,
  onChangeStatus,
  onUpdateTask,
  onDuplicate,
  onArchive,
  onCreateSubtask,
  users = [],
  variant = 'table',
  gridColumnsStyle,
  isExpanded = false,
  onToggleExpand,
}) => {
  const isCompleted = task.status === 'concluida';
  const isOpen = task.status === 'aberta';
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
    useFocusWidgetStore.getState().open(task.title);
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

  // ─── Variante card (legado) ──────────────────────────
  if (variant === 'card') {
    return (
      <div
        onClick={() => onClick(task)}
        className="group cursor-pointer rounded-[var(--sagb-radius-sm)] p-3 transition-colors"
        style={{
          border: '1px solid var(--sagb-line)',
          backgroundColor: 'var(--sagb-surface)',
          boxShadow: 'var(--sagb-shadow)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-bg)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-surface)';
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3
              className="truncate text-[12px] font-medium"
              style={{
                color: isCompleted ? 'var(--sagb-muted)' : 'var(--sagb-text)',
                textDecoration: isCompleted ? 'line-through' : 'none',
              }}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-1 truncate text-[12px]" style={{ color: 'var(--sagb-muted)' }}>
                {task.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleFocusClick}
              title="Iniciar Foco Total"
              className="flex h-5 w-5 items-center justify-center rounded text-[12px] transition-colors"
              style={{
                border: '1px solid var(--sagb-line)',
                backgroundColor: 'var(--sagb-surface)',
              }}
            >
              🎯
            </button>
            <button
              onClick={(e) => onComplete(task.id, e)}
              className="flex h-4 w-4 items-center justify-center rounded transition-colors"
              style={{
                border: isCompleted
                  ? '1px solid var(--sagb-primary)'
                  : '1px solid var(--sagb-line)',
                backgroundColor: isCompleted ? 'var(--sagb-primary)' : 'transparent',
                color: isCompleted ? '#fff' : 'transparent',
              }}
            >
              {isCompleted && (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[10px]" style={{ color: 'var(--sagb-muted)' }}>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.baixa }}
            />
            {PRIORITY_LABELS[task.priority] || 'Baixa'}
          </span>
          <span className="flex items-center gap-1">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: STATUS_COLORS[task.status] || STATUS_COLORS.aberta }}
            />
            {STATUS_LABELS[task.status] || task.status}
          </span>
        </div>
      </div>
    );
  }

  // ─── Variante table — Densidade Linear Absoluta (Single-Line) ──
  const statusColor = STATUS_COLORS[task.status] || STATUS_COLORS.aberta;
  const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.baixa;
  const rowStyle: React.CSSProperties = {
    gridTemplateColumns: gridColumnsStyle,
    borderColor: 'var(--sagb-line)',
    height: 32,
  };

  return (
    <div
      onClick={() => onClick(task)}
      className="group grid items-center gap-1 border-b px-2 text-[12px] transition-colors cursor-pointer"
      style={rowStyle}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-bg)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
      }}
    >
      {/* ── Col 1: Status Dot + Checkbox + Título + Descrição ── */}
      <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
        {/* Indicador de status (12x12px) — estilo ClickUp */}
        <span
          className="inline-block shrink-0 rounded-sm"
          style={{
            width: 12,
            height: 12,
            backgroundColor: statusColor,
          }}
        />

        <div className="flex-shrink-0 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleFocusClick}
            title="Iniciar Foco Total"
            className="flex h-4 w-4 items-center justify-center rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              border: '1px solid var(--sagb-line)',
              backgroundColor: 'var(--sagb-surface)',
            }}
          >
            🎯
          </button>
          <button
            onClick={(e) => onComplete(task.id, e)}
            className="flex h-3.5 w-3.5 items-center justify-center rounded transition-colors"
            style={{
              border: isCompleted
                ? '1px solid var(--sagb-primary)'
                : '1px solid var(--sagb-line)',
              backgroundColor: isCompleted ? 'var(--sagb-primary)' : 'transparent',
              color: isCompleted ? '#fff' : 'transparent',
            }}
          >
            {isCompleted && (
              <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>

        {/* Título */}
        {task.hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand?.(task.id);
            }}
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded"
            style={{ color: 'var(--sagb-muted)' }}
            title={isExpanded ? 'Recolher subtarefas' : 'Expandir subtarefas'}
          >
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <span className="inline-block h-4 w-4 shrink-0" />
        )}

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
          className="h-6 min-w-0 flex-1 rounded border border-transparent bg-transparent px-1 text-[12px] font-medium outline-none"
          style={{
            paddingLeft: `${Math.min(task.depth || 0, 5) * 12 + 4}px`,
            color: isCompleted
              ? 'var(--sagb-muted)'
              : isOpen
                ? 'var(--sagb-text)'
                : 'var(--sagb-muted)',
            textDecoration: isCompleted ? 'line-through' : 'none',
          }}
        />

        {/* Descrição — truncada ao lado do título, single-line */}
        {task.description && (
          <span
            className="hidden truncate text-[12px] sm:inline"
            style={{ color: 'var(--sagb-muted)' }}
          >
            {task.description}
          </span>
        )}
      </div>

      {/* ── Col 2: Prioridade (dot + select compacto) ─────── */}
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <span
          className="inline-block shrink-0 rounded-sm"
          style={{
            width: 12,
            height: 12,
            backgroundColor: priorityColor,
          }}
        />
        <select
          value={task.priority}
          onChange={(event) => onUpdateTask?.(task.id, { priority: event.target.value as TaskzeiTask['priority'] })}
          className="h-6 min-w-0 flex-1 rounded border bg-transparent px-1 text-[10px] font-semibold outline-none cursor-pointer"
          style={{
            color: 'var(--sagb-muted)',
            borderColor: 'var(--sagb-line)',
          }}
        >
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>
      </div>

      {/* ── Col 3: Cliente ────────────────────────────────── */}
      <div className="truncate text-[12px]" style={{ color: 'var(--sagb-muted)' }}>
        TaskZei
      </div>

      {/* ── Col 4: Colaborador ────────────────────────────── */}
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <div
          className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[9px] font-bold"
          style={{
            border: '1px solid var(--sagb-line)',
            backgroundColor: 'var(--sagb-bg)',
            color: 'var(--sagb-muted)',
          }}
        >
          {assigneeDraft ? assigneeDraft.charAt(0).toUpperCase() : '—'}
        </div>
        <select
          value={task.assigneeId || ''}
          onChange={(event) => {
            const user = users.find((u) => u.id === event.target.value);
            onUpdateTask?.(task.id, {
              assigneeId: user?.id || undefined,
              assigneeName: user?.name || undefined,
            });
          }}
          className="h-6 w-full rounded border border-transparent bg-transparent px-1 text-[12px] outline-none"
          style={{ color: 'var(--sagb-muted)' }}
        >
          <option value="">Sem responsável</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>

      {/* ── Col 5: Vencimento ─────────────────────────────── */}
      <div onClick={(e) => e.stopPropagation()}>
        <input
          type="date"
          value={dueDateDraft}
          onChange={(event) => setDueDateDraft(event.target.value)}
          onBlur={() => {
            if (dueDateDraft === dueDateInput) return;
            onUpdateTask?.(task.id, { dueDate: dueDateDraft || undefined });
          }}
          className="h-6 w-full rounded px-1 text-[12px] outline-none"
          style={{
            color: isCompleted ? 'var(--sagb-muted)' : 'var(--sagb-text)',
            backgroundColor: 'var(--sagb-surface)',
            border: '1px solid var(--sagb-line)',
          }}
        />
      </div>

      {/* ── Col 6: Status ─────────────────────────────────── */}
      <div onClick={(e) => e.stopPropagation()}>
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
            className="h-6 w-full rounded px-1 text-[10px] font-semibold uppercase tracking-wide outline-none cursor-pointer"
            style={{
              color: 'var(--sagb-text)',
              backgroundColor: 'var(--sagb-surface)',
              border: '1px solid var(--sagb-line)',
            }}
          >
            <option value="aberta">Aberta</option>
            <option value="em_andamento">Em andamento</option>
            <option value="concluida">Concluída</option>
          </select>
        ) : (
          <span
            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
            style={{
              color: 'var(--sagb-muted)',
              backgroundColor: 'var(--sagb-surface)',
              border: '1px solid var(--sagb-line)',
            }}
          >
            <span
              className="inline-block rounded-sm"
              style={{ width: 8, height: 8, backgroundColor: statusColor }}
            />
            {STATUS_LABELS[task.status] || task.status}
          </span>
        )}
      </div>

      {/* ── Col 7: Ações (⋯ — visível apenas no hover) ──── */}
      <div className="relative flex items-center justify-center" onClick={(e) => e.stopPropagation()} ref={contextRef}>
        <button
          onClick={() => setShowContextMenu(prev => !prev)}
          className="flex h-5 w-5 items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-all"
          style={{
            color: 'var(--sagb-muted)',
          }}
          title="Mais ações"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01" />
          </svg>
        </button>

        {showContextMenu && (
          <div
            className="absolute right-0 top-full mt-1 z-50 w-40 rounded-lg py-1"
            style={{
              backgroundColor: 'var(--sagb-surface)',
              border: '1px solid var(--sagb-line)',
              boxShadow: 'var(--sagb-shadow)',
            }}
          >
            <button
              onClick={() => { onCreateSubtask?.(task.id); setShowContextMenu(false); }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-[12px] transition-colors"
              style={{ color: 'var(--sagb-text)' }}
              disabled={(task.depth || 0) >= 5}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--sagb-muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Criar subtarefa
            </button>
            <button
              onClick={() => { onDuplicate?.(task.id); setShowContextMenu(false); }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-[12px] transition-colors"
              style={{ color: 'var(--sagb-text)' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--sagb-muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Duplicar
            </button>
            <button
              onClick={() => { onArchive?.(task.id); setShowContextMenu(false); }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-[12px] transition-colors"
              style={{ color: 'var(--sagb-text)' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--sagb-muted)' }}>
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
