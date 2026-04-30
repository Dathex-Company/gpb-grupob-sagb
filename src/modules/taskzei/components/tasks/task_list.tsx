import React from 'react';
import { TaskzeiTask } from '../../types/task.types';
import { TaskzeiTaskInlineInput } from '../../types/taskzei.contracts';
import { TaskListItem } from './task_list_item';

interface TaskListProps {
  tasks: TaskzeiTask[];
  onTaskClick: (task: TaskzeiTask) => void;
  onCompleteTask: (id: string, e: React.MouseEvent) => void;
  onChangeStatus?: (id: string, status: TaskzeiTask['status']) => void;
  onUpdateTask?: (id: string, updates: Partial<TaskzeiTaskInlineInput>) => void;
  isCreatingRow?: boolean;
  onCreateTask?: (input: TaskzeiTaskInlineInput) => Promise<void> | void;
  onCancelCreate?: () => void;
}

const TaskCreateRow: React.FC<{
  onCreateTask: (input: TaskzeiTaskInlineInput) => Promise<void> | void;
  onCancelCreate: () => void;
}> = ({ onCreateTask, onCancelCreate }) => {
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
    <div className="grid grid-cols-[minmax(230px,2.6fr)_minmax(90px,1fr)_minmax(120px,1.2fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(110px,1fr)] items-center gap-3 border-b border-[#e8ecf1] bg-[#fcfcfd] px-3 py-2.5 text-xs">
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Título da tarefa"
        className="h-8 w-full rounded-md border border-[#d9dee5] bg-white px-2 text-[12px] text-[#414854] focus:border-[#87a8cf] focus:outline-none"
      />

      <select
        value={priority}
        onChange={(event) => setPriority(event.target.value as TaskzeiTaskInlineInput['priority'])}
        className="h-8 rounded-md border border-[#d9dee5] bg-white px-2 text-[11px] text-[#6f7887] focus:border-[#87a8cf] focus:outline-none"
      >
        <option value="alta">Alta</option>
        <option value="media">Média</option>
        <option value="baixa">Baixa</option>
      </select>

      <span className="text-[11px] text-[#6f7887]">TaskZei</span>

      <input
        value={assigneeName}
        onChange={(event) => setAssigneeName(event.target.value)}
        placeholder="Responsável"
        className="h-8 w-full rounded-md border border-[#d9dee5] bg-white px-2 text-[11px] text-[#6f7887] focus:border-[#87a8cf] focus:outline-none"
      />

      <input
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
        className="h-8 w-full rounded-md border border-[#d9dee5] bg-white px-2 text-[11px] text-[#6f7887] focus:border-[#87a8cf] focus:outline-none"
      />

      <div className="flex items-center gap-1">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as TaskzeiTaskInlineInput['status'])}
          className="h-8 min-w-[90px] rounded-md border border-[#d9dee5] bg-white px-2 text-[10px] font-semibold uppercase tracking-wide text-[#6f7887] focus:border-[#87a8cf] focus:outline-none"
        >
          <option value="aberta">Aberta</option>
          <option value="em_andamento">Em andamento</option>
          <option value="concluida">Concluída</option>
        </select>
        <button
          onClick={handleSave}
          disabled={isSaving || !title.trim()}
          className="h-8 rounded-md bg-[#68c7be] px-2 text-[10px] font-semibold text-white disabled:opacity-50"
        >
          Salvar
        </button>
        <button
          onClick={onCancelCreate}
          className="h-8 rounded-md border border-[#d9dee5] bg-white px-2 text-[10px] font-semibold text-[#6f7887]"
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
  isCreatingRow,
  onCreateTask,
  onCancelCreate,
}) => {
  if (tasks.length === 0 && !isCreatingRow) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-[#d9dee5] bg-[#ffffff]">
      <div className="grid grid-cols-[minmax(230px,2.6fr)_minmax(90px,1fr)_minmax(120px,1.2fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(110px,1fr)] items-center gap-3 border-b border-[#e8ecf1] bg-[#fafbfc] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#95a0b1]">
        <span>Nome</span>
        <span>Prioridade</span>
        <span>Cliente</span>
        <span>Colaborador</span>
        <span>Vencimento</span>
        <span>Status</span>
      </div>

      <div className="flex flex-col">
      {isCreatingRow && onCreateTask && onCancelCreate ? (
        <TaskCreateRow onCreateTask={onCreateTask} onCancelCreate={onCancelCreate} />
      ) : null}

      {tasks.map(task => (
        <TaskListItem 
          key={task.id} 
          task={task} 
          onClick={onTaskClick} 
          onComplete={onCompleteTask} 
          onChangeStatus={onChangeStatus}
          onUpdateTask={onUpdateTask}
        />
      ))}
      </div>
    </div>
  );
};
