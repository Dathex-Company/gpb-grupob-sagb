import React, { useEffect, useMemo, useState } from 'react';
import { useTaskzeiStore } from '../../store/taskzei.store';
import { taskzeiFacade } from '../../services/taskzei.facade';
import { TaskzeiTask } from '../../types/task.types';
import { TaskzeiTaskInlineInput } from '../../types/taskzei.contracts';
import { TaskList } from '../../components/tasks/task_list';
import { TaskFilters, TaskStatusFilter } from '../../components/tasks/task_filters';

export const AgendaInteligenteTasksPage: React.FC = () => {
  const { tasks, isLoading } = useTaskzeiStore();
  const [activeFilter, setActiveFilter] = useState<TaskStatusFilter>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingRow, setIsCreatingRow] = useState(false);

  useEffect(() => {
    taskzeiFacade.loadTasks();
  }, []);

  const handleAddTask = async () => {
    setIsCreatingRow(true);
  };

  const handleCreateTask = async (input: TaskzeiTaskInlineInput) => {
    await taskzeiFacade.createTask(input);
    setIsCreatingRow(false);
  };

  const handleCompleteTask = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await taskzeiFacade.completeTask(id);
  };

  const handleChangeStatus = async (id: string, status: TaskzeiTask['status']) => {
    await taskzeiFacade.updateTaskStatus(id, status);
  };

  const handleUpdateTask = async (id: string, updates: Partial<TaskzeiTaskInlineInput>) => {
    await taskzeiFacade.updateTask(id, updates);
  };

  const handleTaskClick = (_task: TaskzeiTask) => {
    // Interação via linha inline; popup desativado por solicitação.
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const taskCounts = useMemo(() => {
    const aberta = tasks.filter((task) => task.status === 'aberta').length;
    const em_andamento = tasks.filter((task) => task.status === 'em_andamento').length;
    const concluida = tasks.filter((task) => task.status === 'concluida').length;

    return {
      todas: tasks.length,
      aberta,
      em_andamento,
      concluida
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = activeFilter === 'todas' ? true : task.status === activeFilter;

      const matchesSearch =
        normalizedSearch.length === 0
          ? true
          : task.title.toLowerCase().includes(normalizedSearch) ||
            (task.description ?? '').toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [tasks, activeFilter, normalizedSearch]);

  const hasNoTasks = tasks.length === 0;
  const hasNoFilterResults = !isLoading && !hasNoTasks && filteredTasks.length === 0;

  const clearFilters = () => {
    setActiveFilter('todas');
    setSearchTerm('');
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-[#d9dee5] bg-[#ffffff] shadow-sm">
      <div className="h-14 shrink-0 border-b border-[#d9dee5] bg-[#fcfcfd] px-5">
        <div className="flex h-full items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2 text-[11px] text-[#6f7887]">
            <span className="inline-flex h-6 items-center rounded-full border border-[#d9dee5] bg-white px-2.5">Operacional</span>
            <span>/</span>
            <span className="inline-flex h-6 items-center rounded-full border border-[#d9dee5] bg-white px-2.5">Demandas</span>
            <span>/</span>
            <span className="truncate text-[#414854]">Demandas | Geral</span>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button className="inline-flex h-7 items-center rounded-md border border-transparent bg-[#f0f2f4] px-2.5 text-[11px] font-semibold text-[#414854]">
              Status
            </button>
            <button className="inline-flex h-7 items-center rounded-md border border-transparent px-2.5 text-[11px] font-semibold text-[#6f7887] hover:bg-[#f0f2f4]">
              Lista
            </button>
            <button className="inline-flex h-7 items-center rounded-md border border-transparent px-2.5 text-[11px] font-semibold text-[#6f7887] hover:bg-[#f0f2f4]">
              Calendário
            </button>
          </div>
        </div>
      </div>

      <div className="h-14 shrink-0 border-b border-[#e8ecf1] bg-[#ffffff] px-5">
        <div className="flex h-full items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-[17px] font-semibold tracking-tight text-[#414854]">Tarefas</h1>
            <span className="rounded-full border border-[#d9dee5] bg-[#f5f6f7] px-2 py-0.5 text-[10px] font-semibold text-[#6f7887]">
              {filteredTasks.length}
            </span>
            {taskzeiFacade.isHubClickUpEnabled() ? (
              <span className="rounded-full border border-[#c9e7df] bg-[#eaf7f5] px-2 py-0.5 text-[10px] font-semibold text-[#2f7f73]">
                ClickUp via Hub
              </span>
            ) : (
              <span className="rounded-full border border-[#d9dee5] bg-[#f5f6f7] px-2 py-0.5 text-[10px] font-semibold text-[#6f7887]">
                Backend local
              </span>
            )}
          </div>

          <button
            onClick={handleAddTask}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-transparent bg-[#a78cc6] px-3 text-xs font-semibold text-white hover:brightness-95"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Tarefa
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto bg-[#f5f6f7] p-4">
        <TaskFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          counts={taskCounts}
          onClearFilters={clearFilters}
        />

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center text-sm font-medium text-[#6f7887]">Carregando tarefas...</div>
        ) : hasNoTasks && !isCreatingRow ? (
          <div className="mx-auto mt-12 flex max-w-md flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d7ece8] bg-[#eaf7f5]">
              <svg className="h-8 w-8 text-[#68c7be]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="mb-2 text-lg font-semibold text-[#414854]">Nenhuma tarefa criada ainda</h2>
            <p className="mb-6 text-sm text-[#6f7887]">
              O TaskZei é o seu centro de execução. Crie sua primeira tarefa para organizar seu fluxo de trabalho e ter clareza sobre seus próximos passos.
            </p>
            <button
              onClick={handleAddTask}
              className="rounded-md bg-[#a78cc6] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-95"
            >
              Adicionar primeira tarefa
            </button>
          </div>
        ) : hasNoFilterResults ? (
          <div className="mx-auto mt-12 flex max-w-md flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d9dee5] bg-[#f0f2f4]">
              <svg className="h-8 w-8 text-[#6f7887]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="mb-2 text-lg font-semibold text-[#414854]">Nenhum resultado encontrado</h2>
            <p className="mb-6 text-sm text-[#6f7887]">
              Ajuste os filtros ou limpe a busca para visualizar outras tarefas.
            </p>
            <button onClick={clearFilters} className="rounded-md border border-[#d9dee5] bg-white px-5 py-2.5 text-sm font-semibold text-[#6f7887] hover:bg-[#f5f6f7]">
              Limpar filtros
            </button>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            onCompleteTask={handleCompleteTask}
            onChangeStatus={handleChangeStatus}
            onUpdateTask={handleUpdateTask}
            isCreatingRow={isCreatingRow}
            onCreateTask={handleCreateTask}
            onCancelCreate={() => setIsCreatingRow(false)}
          />
        )}
      </div>
    </div>
  );
};
