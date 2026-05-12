import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TaskzeiTask } from '../../types/task.types';
import { TaskzeiTaskInlineInput } from '../../types/taskzei.contracts';
import { TaskListItem } from './task_list_item';

// ─── Configuração de colunas redimensionáveis ─────────────────────────
export type ColumnKey =
  | 'title_desc'
  | 'priority'
  | 'client'
  | 'collaborator'
  | 'due_date'
  | 'status'
  | 'actions';

export const COLUMN_LABELS: Record<ColumnKey, string> = {
  title_desc: 'Nome / Descrição',
  priority: 'Prioridade',
  client: 'Cliente',
  collaborator: 'Colaborador',
  due_date: 'Vencimento',
  status: 'Status',
  actions: '',
};

export const COLUMN_DEFAULTS: Record<ColumnKey, number> = {
  title_desc: 280,
  priority: 70,
  client: 90,
  collaborator: 120,
  due_date: 110,
  status: 100,
  actions: 28,
};

export const COLUMN_ORDER: ColumnKey[] = [
  'title_desc',
  'priority',
  'client',
  'collaborator',
  'due_date',
  'status',
  'actions',
];

// ─── Min width por coluna (impede colapso) ────────────────────────────
export const COLUMN_MIN_WIDTHS: Record<ColumnKey, number> = {
  title_desc: 120,
  priority: 50,
  client: 50,
  collaborator: 60,
  due_date: 80,
  status: 80,
  actions: 28,
};

const COLUMN_KEYS = COLUMN_ORDER as readonly ColumnKey[];

// ─── Hook: gerenciamento de arrasto de colunas ────────────────────────
function useColumnResize(
  initial: Record<ColumnKey, number>,
): {
  widths: Record<ColumnKey, number>;
  getGridTemplate: () => string;
  startResize: (col: ColumnKey, e: React.MouseEvent) => void;
  isResizing: boolean;
} {
  const [widths, setWidths] = useState<Record<ColumnKey, number>>(initial);
  const activeCol = useRef<ColumnKey | null>(null);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const isResizingRef = useRef(false);
  const [isResizing, setIsResizing] = useState(false);

  const startResize = useCallback((col: ColumnKey, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    activeCol.current = col;
    startX.current = e.clientX;
    startWidth.current = initial[col];
    isResizingRef.current = true;
    setIsResizing(true);
  }, [initial]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current || !activeCol.current) return;
      const col = activeCol.current;
      const minW = COLUMN_MIN_WIDTHS[col];
      const diff = e.clientX - startX.current;
      const next = Math.max(minW, startWidth.current + diff);
      setWidths((prev) => ({ ...prev, [col]: next }));
    };

    const handleMouseUp = () => {
      if (!isResizingRef.current) return;
      isResizingRef.current = false;
      activeCol.current = null;
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const getGridTemplate = useCallback(() => {
    return COLUMN_ORDER.map((col) => `${widths[col]}px`).join(' ');
  }, [widths]);

  return { widths, getGridTemplate, startResize, isResizing };
}

// ─── Componente: Drag Handle ──────────────────────────────────────────
const DragHandle: React.FC<{
  column: ColumnKey;
  onMouseDown: (col: ColumnKey, e: React.MouseEvent) => void;
}> = ({ column, onMouseDown }) => (
  <div
    onMouseDown={(e) => onMouseDown(column, e)}
    className="absolute right-0 top-0 z-10 h-full w-1 cursor-col-resize"
    style={{ opacity: 0.5, backgroundColor: 'transparent' }}
    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-primary)'; }}
    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
  />
);

// ─── Colunas fixas para alinhamento tabular (ClickUp-style) ─────────────
interface TaskListProps {
  tasks: TaskzeiTask[];
  onTaskClick: (task: TaskzeiTask) => void;
  onCompleteTask: (id: string, e: React.MouseEvent) => void;
  onChangeStatus?: (id: string, status: TaskzeiTask['status']) => void;
  onUpdateTask?: (id: string, updates: Partial<TaskzeiTaskInlineInput>) => void;
  onDuplicate?: (id: string) => void;
  onArchive?: (id: string) => void;
  isCreatingRow?: boolean;
  onCreateTask?: (input: TaskzeiTaskInlineInput) => Promise<void> | void;
  onCancelCreate?: () => void;
}

const TaskCreateRow: React.FC<{
  onCreateTask: (input: TaskzeiTaskInlineInput) => Promise<void> | void;
  onCancelCreate: () => void;
  gridTemplate: string;
}> = ({ onCreateTask, onCancelCreate, gridTemplate }) => {
  const [title, setTitle] = React.useState('');
  const [priority, setPriority] = React.useState<TaskzeiTaskInlineInput['priority']>('media');
  const [status, setStatus] = React.useState<TaskzeiTaskInlineInput['status']>('aberta');
  const [assigneeName, setAssigneeName] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) return;
    setIsSaving(true);
    await onCreateTask({
      title: normalizedTitle,
      priority,
      status,
      assigneeName: assigneeName.trim() || undefined,
      dueDate: dueDate || undefined,
    });
    setIsSaving(false);
  };

  return (
    <div
      className="grid items-center gap-1 border-b px-2 text-[12px]"
      style={{
        gridTemplateColumns: gridTemplate,
        borderColor: 'var(--sagb-line)',
        backgroundColor: 'var(--sagb-bg)',
        height: 32,
      }}
    >
      {/* ── Col 1: Title + Description ───────────── */}
      <div className="flex min-w-0 items-center gap-1.5">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Título da tarefa"
          className="h-6 w-full rounded border px-2 text-[12px] outline-none"
          style={{
            color: 'var(--sagb-muted)',
            backgroundColor: 'var(--sagb-surface)',
            border: '1px solid var(--sagb-line)',
          }}
        />
      </div>

      {/* ── Col 2: Prioridade ────────────────────── */}
      <select
        value={priority}
        onChange={(event) => setPriority(event.target.value as TaskzeiTaskInlineInput['priority'])}
        className="h-6 rounded border px-1.5 text-[10px] font-semibold outline-none"
        style={{
          color: 'var(--sagb-muted)',
          backgroundColor: 'var(--sagb-surface)',
          borderColor: 'var(--sagb-line)',
        }}
      >
        <option value="alta">Alta</option>
        <option value="media">Média</option>
        <option value="baixa">Baixa</option>
      </select>

      {/* ── Col 3: Cliente ───────────────────────── */}
      <span className="truncate text-[12px]" style={{ color: 'var(--sagb-muted)' }}>
        TaskZei
      </span>

      {/* ── Col 4: Colaborador ───────────────────── */}
      <input
        value={assigneeName}
        onChange={(event) => setAssigneeName(event.target.value)}
        placeholder="Responsável"
        className="h-6 w-full rounded border px-2 text-[12px] outline-none"
        style={{
          color: 'var(--sagb-muted)',
          backgroundColor: 'var(--sagb-surface)',
          border: '1px solid var(--sagb-line)',
        }}
      />

      {/* ── Col 5: Vencimento ────────────────────── */}
      <input
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
        className="h-6 w-full rounded border px-2 text-[12px] outline-none"
        style={{
          color: 'var(--sagb-muted)',
          backgroundColor: 'var(--sagb-surface)',
          border: '1px solid var(--sagb-line)',
        }}
      />

      {/* ── Col 6: Status + ações ────────────────── */}
      <div className="flex items-center gap-1">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as TaskzeiTaskInlineInput['status'])}
          className="h-6 min-w-[70px] rounded border px-1.5 text-[10px] font-semibold uppercase tracking-wide outline-none"
          style={{
            color: 'var(--sagb-muted)',
            backgroundColor: 'var(--sagb-surface)',
            borderColor: 'var(--sagb-line)',
          }}
        >
          <option value="aberta">Aberta</option>
          <option value="em_andamento">Em andamento</option>
          <option value="concluida">Concluída</option>
        </select>
        <button
          onClick={handleSave}
          disabled={isSaving || !title.trim()}
          className="h-6 rounded px-2 text-[10px] font-semibold disabled:opacity-50"
          style={{
            color: '#fff',
            backgroundColor: 'var(--sagb-primary)',
          }}
        >
          Salvar
        </button>
        <button
          onClick={onCancelCreate}
          className="h-6 rounded border px-2 text-[10px] font-semibold"
          style={{
            color: 'var(--sagb-muted)',
            backgroundColor: 'var(--sagb-surface)',
            border: '1px solid var(--sagb-line)',
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskClick,
  onCompleteTask,
  onChangeStatus,
  onUpdateTask,
  onDuplicate,
  onArchive,
  isCreatingRow,
  onCreateTask,
  onCancelCreate,
}) => {
  const { widths, getGridTemplate, startResize, isResizing } = useColumnResize(COLUMN_DEFAULTS);
  const gridTemplate = getGridTemplate();

  if (tasks.length === 0 && !isCreatingRow) return null;

  return (
    <div style={{ fontFamily: "'Rubik', sans-serif" }}>
      {/* ── Cabeçalho tabular com divisórias arrastáveis ── */}
      <div
        className="grid items-center gap-1 border-b px-2 text-[10px] font-black uppercase tracking-widest select-none"
        style={{
          gridTemplateColumns: gridTemplate,
          borderColor: 'var(--sagb-line)',
          backgroundColor: 'var(--sagb-bg)',
          color: 'var(--sagb-muted)',
          height: 28,
        }}
      >
        {COLUMN_ORDER.map((col) => (
          <div key={col} className="relative flex items-center truncate">
            <span>{COLUMN_LABELS[col]}</span>
            {col !== 'actions' && (
              <DragHandle column={col} onMouseDown={startResize} />
            )}
          </div>
        ))}
      </div>

      {/* ── Overlay de cursor durante resize ──────────── */}
      {isResizing && (
        <div
          className="fixed inset-0 z-[9999] cursor-col-resize"
          style={{ backgroundColor: 'transparent' }}
        />
      )}

      {/* ── Linhas ─────────────────────────────────────── */}
      <div className="flex flex-col">
        {isCreatingRow && onCreateTask && onCancelCreate ? (
          <TaskCreateRow
            onCreateTask={onCreateTask}
            onCancelCreate={onCancelCreate}
            gridTemplate={gridTemplate}
          />
        ) : null}

        {tasks.map(task => (
          <TaskListItem
            key={task.id}
            task={task}
            onClick={onTaskClick}
            onComplete={onCompleteTask}
            onChangeStatus={onChangeStatus}
            onUpdateTask={onUpdateTask}
            onDuplicate={onDuplicate}
            onArchive={onArchive}
            gridColumnsStyle={gridTemplate}
          />
        ))}
      </div>
    </div>
  );
};
