import React, { useState } from 'react';
import { TaskzeiTask, TaskStatus } from '../../types/task.types';
import { TaskListItem } from './task_list_item';

interface TaskKanbanBoardProps {
  tasks: TaskzeiTask[];
  onTaskClick: (task: TaskzeiTask) => void;
  onCompleteTask: (id: string, e: React.MouseEvent) => void;
  onTaskMove?: (taskId: string, newStatus: TaskStatus) => void;
}

const statusConfig: Record<TaskStatus, { title: string; style: React.CSSProperties; badgeStyle: React.CSSProperties }> = {
  aberta: {
    title: 'Abertas',
    style: {
      borderColor: 'var(--sagb-blue)',
      backgroundColor: 'color-mix(in srgb, var(--sagb-blue) 6%, transparent)',
    },
    badgeStyle: {
      color: 'var(--sagb-blue)',
    },
  },
  em_andamento: {
    title: 'Em Andamento',
    style: {
      borderColor: 'var(--sagb-amber)',
      backgroundColor: 'color-mix(in srgb, var(--sagb-amber) 6%, transparent)',
    },
    badgeStyle: {
      color: 'var(--sagb-amber)',
    },
  },
  concluida: {
    title: 'Concluídas',
    style: {
      borderColor: 'var(--sagb-primary)',
      backgroundColor: 'color-mix(in srgb, var(--sagb-primary) 6%, transparent)',
    },
    badgeStyle: {
      color: 'var(--sagb-primary)',
    },
  },
};

export const TaskKanbanBoard: React.FC<TaskKanbanBoardProps> = ({
  tasks,
  onTaskClick,
  onCompleteTask,
  onTaskMove,
}) => {
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  const tasksByStatus: Record<TaskStatus, TaskzeiTask[]> = {
    aberta: [],
    em_andamento: [],
    concluida: [],
  };

  tasks.forEach(task => {
    tasksByStatus[task.status].push(task);
  });

  const handleDragStart = (taskId: string) => {
    setDraggingTaskId(taskId);
  };

  const handleDrop = (status: TaskStatus) => {
    if (draggingTaskId && onTaskMove) {
      onTaskMove(draggingTaskId, status);
    }
    setDraggingTaskId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4" style={{ fontFamily: "'Rubik', sans-serif" }}>
      {Object.entries(statusConfig).map(([status, config]) => {
        const statusKey = status as TaskStatus;
        const columnTasks = tasksByStatus[statusKey];
        const taskCount = columnTasks.length;

        return (
          <div
            key={status}
            className="flex-1 min-w-0 rounded-xl p-4 flex flex-col"
            style={config.style}
            onDrop={() => handleDrop(statusKey)}
            onDragOver={handleDragOver}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm" style={config.badgeStyle}>{config.title}</h3>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: 'var(--sagb-surface)',
                    border: '1px solid var(--sagb-line)',
                    color: 'var(--sagb-muted)',
                  }}
                >
                  {taskCount}
                </span>
              </div>
              {onTaskMove && (
                <div className="text-xs" style={{ color: 'var(--sagb-muted)' }}>
                  Arraste tarefas aqui
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3 min-h-[200px]">
              {columnTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                    style={{ backgroundColor: 'var(--sagb-bg)' }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium" style={{ color: 'var(--sagb-muted)' }}>
                    Nenhuma tarefa nesta coluna
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--sagb-muted)' }}>
                    Arraste tarefas ou crie novas
                  </p>
                </div>
              ) : (
                columnTasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                  >
                    <TaskListItem
                      task={task}
                      onClick={onTaskClick}
                      onComplete={onCompleteTask}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
