import React, { useState, useEffect } from 'react';
import { TaskzeiTask } from '../types/task.types';
import { TaskKanbanBoard } from '../components/tasks/task_kanban_board';
import { TaskFilters } from '../components/tasks/task_filters';
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

  return (
    <div className="flex-1 flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden m-4 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Agenda Inteligente (TaskZei)</h1>
          <p className="text-gray-500 mt-1 font-medium">
            Visualização {viewMode === 'kanban' ? 'em Kanban' : 'em Lista'} • {tasks.length} tarefas
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white text-gray-800 shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-800 shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Lista
            </button>
          </div>
          
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-cyan-600 text-white text-sm font-bold rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
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
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-600 mb-2"></div>
            <p className="text-gray-500">Carregando tarefas...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium">Erro ao carregar tarefas</p>
            <p className="text-gray-500 text-sm mt-1">{error}</p>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Nenhuma tarefa ainda</h3>
          <p className="text-gray-500 mb-6 max-w-md">
            Comece criando sua primeira tarefa para organizar suas atividades.
          </p>
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 transition-colors"
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
          <div className="space-y-2">
            {tasks.map(task => (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow hover:border-gray-200 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-medium ${task.status === 'concluida' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium px-2 py-1 rounded border bg-gray-50 text-gray-600">
                      {task.priority === 'alta' ? 'Alta' : task.priority === 'media' ? 'Média' : 'Baixa'}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 rounded border bg-gray-50 text-gray-600">
                      {task.status === 'aberta' ? 'Aberta' : task.status === 'em_andamento' ? 'Em Andamento' : 'Concluída'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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