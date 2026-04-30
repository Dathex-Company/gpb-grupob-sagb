import React, { useState } from 'react';
import { TaskzeiTask, TaskStatus } from '../../types/task.types';
import { TaskListItem } from './task_list_item';

interface TaskKanbanBoardProps {
  tasks: TaskzeiTask[];
  onTaskClick: (task: TaskzeiTask) => void;
  onCompleteTask: (id: string, e: React.MouseEvent) => void;
  onTaskMove?: (taskId: string, newStatus: TaskStatus) => void;
}

const statusConfig: Record<TaskStatus, { title: string; color: string; bgColor: string }> = {
  aberta: {
    title: 'Abertas',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-100',
  },
  em_andamento: {
    title: 'Em Andamento',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 border-yellow-100',
  },
  concluida: {
    title: 'Concluídas',
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-100',
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
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      {Object.entries(statusConfig).map(([status, config]) => {
        const statusKey = status as TaskStatus;
        const columnTasks = tasksByStatus[statusKey];
        const taskCount = columnTasks.length;

        return (
          <div
            key={status}
            className={`flex-1 min-w-0 rounded-xl border ${config.bgColor} p-4 flex flex-col`}
            onDrop={() => handleDrop(statusKey)}
            onDragOver={handleDragOver}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className={`font-bold text-sm ${config.color}`}>{config.title}</h3>
                <span className="text-xs font-medium bg-white px-2 py-0.5 rounded-full border">
                  {taskCount}
                </span>
              </div>
              {onTaskMove && (
                <div className="text-xs text-gray-500">
                  Arraste tarefas aqui
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3 min-h-[200px]">
              {columnTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="w-10 h-10 rounded-full bg-white border border-dashed border-gray-300 flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500">Nenhuma tarefa</p>
                </div>
              ) : (
                columnTasks.map(task => (
                  <div
                    key={task.id}
                    draggable={!!onTaskMove}
                    onDragStart={() => handleDragStart(task.id)}
                    className="cursor-move"
                  >
                    <TaskListItem
                      task={task}
                      onClick={onTaskClick}
                      onComplete={onCompleteTask}
                      variant="card"
                    />
                  </div>
                ))
              )}
            </div>

            {onTaskMove && columnTasks.length === 0 && (
              <div className="mt-4 text-center">
                <div className="text-xs text-gray-500 border border-dashed border-gray-300 rounded-lg p-3">
                  Solte aqui para mover
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
