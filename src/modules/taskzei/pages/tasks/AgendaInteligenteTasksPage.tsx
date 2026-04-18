import React, { useEffect, useState } from 'react';
import { useTaskzeiStore } from '../../store/taskzei.store';
import { taskzeiFacade } from '../../services/taskzei.facade';
import { TaskzeiTask } from '../../types/task.types';
import { TaskList } from '../../components/tasks/task_list';
import { TaskFilters } from '../../components/tasks/task_filters';
import { TaskDrawer } from '../../components/tasks/task_drawer';

export const AgendaInteligenteTasksPage: React.FC = () => {
  const { tasks, isLoading } = useTaskzeiStore();
  const [selectedTask, setSelectedTask] = useState<TaskzeiTask | null>(null);

  useEffect(() => {
    taskzeiFacade.loadTasks();
  }, []);

  // Update selected task when tasks change (e.g. status update)
  useEffect(() => {
    if (selectedTask) {
      const updated = tasks.find(t => t.id === selectedTask.id);
      if (updated) {
        setSelectedTask(updated);
      }
    }
  }, [tasks, selectedTask?.id]);

  const handleAddTask = async () => {
    await taskzeiFacade.addNewTask('Nova Tarefa (Local)', 'Tarefa criada para demonstração na ET 03.');
  };

  const handleCompleteTask = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await taskzeiFacade.completeTask(id);
  };

  const handleChangeStatus = async (id: string, status: TaskzeiTask['status']) => {
    await taskzeiFacade.updateTaskStatus(id, status);
  };

  const handleTaskClick = (task: TaskzeiTask) => {
    setSelectedTask(task);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
      {/* Cabecalho Interno de Tarefas */}
      <div className="h-16 px-6 border-b border-gray-100 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Tarefas</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold">{tasks.length}</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleAddTask}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-bold shadow-sm shadow-cyan-600/20 hover:bg-cyan-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Tarefa
          </button>
        </div>
      </div>

      {/* Area de conteudo */}
      <div className="flex-1 overflow-y-auto bg-gray-50/30 p-6 flex flex-col">
        <TaskFilters />

        {isLoading ? (
          <div className="flex justify-center items-center flex-1 text-gray-500 font-medium">Carregando tarefas...</div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center max-w-md text-center mx-auto mt-12">
            <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mb-4 border border-cyan-100">
              <svg className="w-8 h-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Nenhuma tarefa criada ainda</h2>
            <p className="text-sm text-gray-500 mb-6">
              O TaskZei é o seu centro de execução. Crie sua primeira tarefa para organizar seu fluxo de trabalho e ter clareza sobre seus próximos passos.
            </p>
            <button 
              onClick={handleAddTask}
              className="px-5 py-2.5 bg-cyan-600 text-white rounded-xl text-sm font-bold shadow-md shadow-cyan-600/20 hover:bg-cyan-700 transition-transform active:scale-95"
            >
              Adicionar primeira tarefa
            </button>
          </div>
        ) : (
          <TaskList 
            tasks={tasks} 
            onTaskClick={handleTaskClick} 
            onCompleteTask={handleCompleteTask} 
          />
        )}
      </div>

      <TaskDrawer 
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onComplete={(id) => handleCompleteTask(id)}
        onChangeStatus={handleChangeStatus}
      />
    </div>
  );
};
