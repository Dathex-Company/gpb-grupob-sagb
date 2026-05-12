import React, { useState, useEffect } from 'react';
import { TaskzeiTask } from '../types/task.types';
import { TaskzeiTaskInlineInput } from '../types/taskzei.contracts';
import { TaskKanbanBoard } from '../components/tasks/task_kanban_board';
import { TaskFilters } from '../components/tasks/task_filters';
import { TaskList } from '../components/tasks/task_list';
import { TaskDrawer } from '../components/tasks/task_drawer';
import { useTaskzeiStore } from '../store/taskzei.store';
import { taskzeiFacade } from '../services/taskzei.facade';

export const AgendaInteligentePage: React.FC = () => {
  const { tasks, isLoading, error } = useTaskzeiStore();
  const [selectedTask, setSelectedTask] = useState<TaskzeiTask | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  useEffect(() => {
    taskzeiFacade.loadTasks();
  }, []);

  const handleTaskClick = (task: TaskzeiTask) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  const handleCompleteTask = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await taskzeiFacade.completeTask(id);
    } catch (err) {
      console.error('Erro ao completar tarefa:', err);
    }
  };

  const handleTaskMove = async (taskId: string, newStatus: TaskzeiTask['status']) => {
    try {
      await taskzeiFacade.updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Erro ao mover tarefa:', err);
    }
  };

  const handleChangeStatus = async (id: string, status: TaskzeiTask['status']) => {
    try {
      await taskzeiFacade.updateTaskStatus(id, status);
      if (selectedTask?.id === id) {
        setSelectedTask({ ...selectedTask, status });
      }
    } catch (err) {
      console.error('Erro ao alterar status:', err);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedTask(null), 300);
  };

  const handleAddTask = async () => {
    const title = prompt('Título da nova tarefa:');
    if (!title) return;
    try {
      await taskzeiFacade.addNewTask(title, 'Nova tarefa criada');
    } catch (err) {
      console.error('Erro ao criar tarefa:', err);
    }
  };

  const handleDuplicateTask = async (id: string) => {
    try {
      await taskzeiFacade.duplicateTask(id);
    } catch (err) {
      console.error('Erro ao duplicar tarefa:', err);
    }
  };

  const handleArchiveTask = async (id: string) => {
    try {
      await taskzeiFacade.archiveTask(id);
    } catch (err) {
      console.error('Erro ao arquivar tarefa:', err);
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<TaskzeiTaskInlineInput>) => {
    try {
      await taskzeiFacade.updateTask(id, updates);
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
    }
  };

  return (
    <div
      className="flex-1 flex flex-col h-full overflow-hidden m-4 p-6"
      style={{
        backgroundColor: 'var(--sagb-surface)',
        borderRadius: 'var(--sagb-radius-xl)',
        border: '1px solid var(--sagb-line)',
        boxShadow: 'var(--sagb-shadow)',
        fontFamily: "'Rubik', sans-serif",
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--sagb-text)' }}>
            Agenda Inteligente (TaskZei)
          </h1>
          <p className="mt-1 font-medium" style={{ color: 'var(--sagb-muted)' }}>
            Visualização {viewMode === 'kanban' ? 'em Kanban' : 'em Lista'} • {tasks.length} tarefas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center rounded-lg p-1"
            style={{ backgroundColor: 'var(--sagb-bg)' }}
          >
            <button
              onClick={() => setViewMode('kanban')}
              className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
              style={
                viewMode === 'kanban'
                  ? {
                      backgroundColor: 'var(--sagb-surface)',
                      color: 'var(--sagb-text)',
                      border: '1px solid var(--sagb-line)',
                      boxShadow: 'var(--sagb-shadow-sm)',
                    }
                  : {
                      color: 'var(--sagb-muted)',
                      backgroundColor: 'transparent',
                      border: '1px solid transparent',
                    }
              }
              onMouseEnter={(e) => {
                if (viewMode !== 'kanban') {
                  (e.currentTarget as HTMLElement).style.color = 'var(--sagb-text)';
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== 'kanban') {
                  (e.currentTarget as HTMLElement).style.color = 'var(--sagb-muted)';
                }
              }}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
              style={
                viewMode === 'list'
                  ? {
                      backgroundColor: 'var(--sagb-surface)',
                      color: 'var(--sagb-text)',
                      border: '1px solid var(--sagb-line)',
                      boxShadow: 'var(--sagb-shadow-sm)',
                    }
                  : {
                      color: 'var(--sagb-muted)',
                      backgroundColor: 'transparent',
                      border: '1px solid transparent',
                    }
              }
              onMouseEnter={(e) => {
                if (viewMode !== 'list') {
                  (e.currentTarget as HTMLElement).style.color = 'var(--sagb-text)';
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== 'list') {
                  (e.currentTarget as HTMLElement).style.color = 'var(--sagb-muted)';
                }
              }}
            >
              Lista
            </button>
          </div>

          <button
            onClick={handleAddTask}
            className="px-4 py-2 text-sm font-bold rounded-lg text-white transition-colors flex items-center gap-2"
            style={{ backgroundColor: 'var(--sagb-primary)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'color-mix(in srgb, var(--sagb-primary) 80%, black)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-primary)'; }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Nova Tarefa
          </button>
        </div>
      </div>

      <div className="mb-4">
        <TaskFilters />
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div
              className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 mb-2"
              style={{ borderColor: 'var(--sagb-primary)', borderRightColor: 'transparent' }}
            />
            <p style={{ color: 'var(--sagb-muted)' }}>Carregando tarefas...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: 'color-mix(in srgb, var(--sagb-red) 12%, transparent)' }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--sagb-red)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-medium" style={{ color: 'var(--sagb-red)' }}>Erro ao carregar tarefas</p>
            <p className="text-sm mt-1" style={{ color: 'var(--sagb-muted)' }}>{error}</p>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: 'var(--sagb-bg)' }}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--sagb-muted)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--sagb-text)' }}>Nenhuma tarefa ainda</h3>
          <p className="mb-6 max-w-md" style={{ color: 'var(--sagb-muted)' }}>
            Comece criando sua primeira tarefa para organizar suas atividades.
          </p>
          <button
            onClick={handleAddTask}
            className="px-4 py-2 font-bold rounded-lg text-white transition-colors"
            style={{ backgroundColor: 'var(--sagb-primary)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'color-mix(in srgb, var(--sagb-primary) 80%, black)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-primary)'; }}
          >
            Criar Primeira Tarefa
          </button>
        </div>
      ) : viewMode === 'kanban' ? (
        <div className="flex-1 overflow-hidden">
          <TaskKanbanBoard
            tasks={tasks}
            onTaskClick={handleTaskClick}
            onCompleteTask={handleCompleteTask}
            onTaskMove={handleTaskMove}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <TaskList
            tasks={tasks}
            onTaskClick={handleTaskClick}
            onCompleteTask={handleCompleteTask}
            onChangeStatus={handleChangeStatus}
            onUpdateTask={handleUpdateTask}
            onDuplicate={handleDuplicateTask}
            onArchive={handleArchiveTask}
          />
        </div>
      )}

      <TaskDrawer
        task={selectedTask}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onComplete={handleCompleteTask}
        onChangeStatus={handleChangeStatus}
      />
    </div>
  );
};
