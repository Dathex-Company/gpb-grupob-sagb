import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useTaskzeiStore } from '../../store/taskzei.store';
import { taskzeiFacade } from '../../services/taskzei.facade';
import { TaskzeiTask } from '../../types/task.types';
import { TaskzeiTaskInlineInput } from '../../types/taskzei.contracts';
import { TaskList } from '../../components/tasks/task_list';
import { TaskFilters, TaskStatusFilter } from '../../components/tasks/task_filters';
import { TaskModal } from '../../components/tasks/TaskModal';
import { taskzeiUsersService, TaskzeiUserOption } from '../../services/taskzei_users.service';

export const AgendaInteligenteTasksPage: React.FC = () => {
  const { tasks, isLoading } = useTaskzeiStore();
  const [activeFilter, setActiveFilter] = useState<TaskStatusFilter>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [users, setUsers] = useState<TaskzeiUserOption[]>([]);
  const [createParentTaskId, setCreateParentTaskId] = useState<string | null>(null);

  useEffect(() => {
    taskzeiFacade.loadTasks();
    taskzeiUsersService.loadUsers().then(setUsers).catch(() => setUsers([]));
  }, []);

  const handleOpenCreate = useCallback(() => {
    setCreateParentTaskId(null);
    setShowCreateModal(true);
  }, []);

  const handleCloseCreate = useCallback(() => {
    if (!saving) setShowCreateModal(false);
  }, [saving]);

  const handleCreateTask = useCallback(async (input: TaskzeiTaskInlineInput) => {
    setSaving(true);
    try {
      await taskzeiFacade.createTask(input);
      setShowCreateModal(false);
      setCreateParentTaskId(null);
    } finally {
      setSaving(false);
    }
  }, []);

  const handleCompleteTask = useCallback(async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await taskzeiFacade.completeTask(id);
  }, []);

  const handleChangeStatus = useCallback(async (id: string, status: TaskzeiTask['status']) => {
    await taskzeiFacade.updateTaskStatus(id, status);
  }, []);

  const handleUpdateTask = useCallback(async (id: string, updates: Partial<TaskzeiTaskInlineInput>) => {
    await taskzeiFacade.updateTask(id, updates);
  }, []);

  const handleTaskClick = useCallback((_task: TaskzeiTask) => {
    // Interação via linha inline; modal de edição futuro.
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const isDemoTask = useCallback((task: TaskzeiTask) => {
    const title = (task.title || '').toLowerCase();
    const description = (task.description || '').toLowerCase();
    return title.includes('demonstra') || description.includes('demonstra');
  }, []);

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => !isDemoTask(task));
  }, [tasks, isDemoTask]);

  const handleOpenCreateSubtask = useCallback((parentTaskId: string) => {
    const byId = new Map(visibleTasks.map((t) => [t.id, t] as const));
    let depth = 0;
    let cursor = byId.get(parentTaskId);
    while (cursor?.parentTaskId) {
      depth += 1;
      cursor = byId.get(cursor.parentTaskId);
      if (depth > 10) break;
    }
    if (depth >= 4) return; // raiz=0 ... nível 5 permitido (depth 4 para o pai)
    setCreateParentTaskId(parentTaskId);
    setShowCreateModal(true);
  }, [visibleTasks]);

  const taskCounts = useMemo(() => {
    const aberta = visibleTasks.filter((task) => task.status === 'aberta').length;
    const em_andamento = visibleTasks.filter((task) => task.status === 'em_andamento').length;
    const concluida = visibleTasks.filter((task) => task.status === 'concluida').length;

    return {
      todas: visibleTasks.length,
      aberta,
      em_andamento,
      concluida
    };
  }, [visibleTasks]);

  const filteredTasks = useMemo(() => {
    return visibleTasks.filter((task) => {
      const matchesStatus = activeFilter === 'todas' ? true : task.status === activeFilter;

      const matchesSearch =
        normalizedSearch.length === 0
          ? true
          : task.title.toLowerCase().includes(normalizedSearch) ||
            (task.description ?? '').toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [visibleTasks, activeFilter, normalizedSearch]);

  const visibleTreeRows = useMemo(() => {
    const byParent = new Map<string | null, TaskzeiTask[]>();
    for (const task of filteredTasks) {
      const key = task.parentTaskId || null;
      const bucket = byParent.get(key) || [];
      bucket.push(task);
      byParent.set(key, bucket);
    }

    for (const bucket of byParent.values()) {
      bucket.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }

    const rows: TaskzeiTask[] = [];
    const walk = (parentId: string | null, depth: number) => {
      const children = byParent.get(parentId) || [];
      for (const item of children) {
        const hasChildren = (byParent.get(item.id) || []).length > 0;
        rows.push({ ...item, depth, hasChildren });
        if (hasChildren && expandedIds.has(item.id)) {
          walk(item.id, depth + 1);
        }
      }
    };

    walk(null, 0);
    return rows;
  }, [filteredTasks, expandedIds]);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const hasNoTasks = visibleTasks.length === 0;
  const hasNoFilterResults = !isLoading && !hasNoTasks && filteredTasks.length === 0;

  const clearFilters = useCallback(() => {
    setActiveFilter('todas');
    setSearchTerm('');
  }, []);

  return (
    <div className="relative flex h-full flex-col overflow-hidden" style={{ borderRadius: 'var(--sagb-radius-xl)', border: '1px solid var(--sagb-line)', backgroundColor: 'var(--sagb-surface)', boxShadow: 'var(--sagb-shadow)' }}>
      <div className="h-14 shrink-0 px-5" style={{ borderBottom: '1px solid var(--sagb-line)', backgroundColor: 'var(--sagb-surface)' }}>
        <div className="flex h-full items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2 text-[11px]" style={{ color: 'var(--sagb-muted)' }}>
            <span className="inline-flex h-6 items-center rounded-full px-2.5" style={{ border: '1px solid var(--sagb-line)', backgroundColor: 'var(--sagb-surface)' }}>Operacional</span>
            <span>/</span>
            <span className="inline-flex h-6 items-center rounded-full px-2.5" style={{ border: '1px solid var(--sagb-line)', backgroundColor: 'var(--sagb-surface)' }}>Demandas</span>
            <span>/</span>
            <span className="truncate" style={{ color: 'var(--sagb-text)' }}>Demandas | Geral</span>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button className="inline-flex h-7 items-center rounded-[var(--sagb-radius-sm)] border border-transparent px-2.5 text-[11px] font-semibold transition-colors" style={{ backgroundColor: 'var(--sagb-bg)', color: 'var(--sagb-text)' }}>
              Status
            </button>
            <button className="inline-flex h-7 items-center rounded-[var(--sagb-radius-sm)] border border-transparent px-2.5 text-[11px] font-semibold transition-colors hover:bg-[var(--sagb-bg)]" style={{ color: 'var(--sagb-muted)' }}>
              Lista
            </button>
            <button className="inline-flex h-7 items-center rounded-[var(--sagb-radius-sm)] border border-transparent px-2.5 text-[11px] font-semibold transition-colors hover:bg-[var(--sagb-bg)]" style={{ color: 'var(--sagb-muted)' }}>
              Calendário
            </button>
          </div>
        </div>
      </div>

      <div className="h-14 shrink-0 px-5" style={{ borderBottom: '1px solid var(--sagb-line)', backgroundColor: 'var(--sagb-surface)' }}>
        <div className="flex h-full items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-[17px] font-semibold tracking-tight" style={{ color: 'var(--sagb-text)' }}>Tarefas</h1>
            <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ border: '1px solid var(--sagb-line)', backgroundColor: 'var(--sagb-bg)', color: 'var(--sagb-muted)' }}>
              {filteredTasks.length}
            </span>
            {taskzeiFacade.isHubClickUpEnabled() ? (
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ border: '1px solid var(--sagb-primary-soft)', backgroundColor: 'var(--sagb-primary-soft)', color: 'var(--sagb-primary)' }}>
                ClickUp via Hub
              </span>
            ) : (
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ border: '1px solid var(--sagb-line)', backgroundColor: 'var(--sagb-bg)', color: 'var(--sagb-muted)' }}>
                Backend local
              </span>
            )}
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex h-8 items-center gap-1.5 rounded-[var(--sagb-radius-sm)] border border-transparent px-3 text-xs font-semibold text-white transition-colors"
            style={{ backgroundColor: 'var(--sagb-primary)' }}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Tarefa
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto p-4" style={{ backgroundColor: 'var(--sagb-bg)' }}>
        <TaskFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          counts={taskCounts}
          onClearFilters={clearFilters}
        />

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center text-sm font-medium" style={{ color: 'var(--sagb-muted)' }}>Carregando tarefas...</div>
        ) : hasNoTasks ? (
          <div className="mx-auto mt-12 flex max-w-md flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center" style={{ borderRadius: 'var(--sagb-radius-xl)', border: '1px solid var(--sagb-primary-soft)', backgroundColor: 'var(--sagb-primary-soft)' }}>
              <svg className="h-8 w-8" style={{ color: 'var(--sagb-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="mb-2 text-lg font-semibold" style={{ color: 'var(--sagb-text)' }}>Nenhuma tarefa criada ainda</h2>
            <p className="mb-6 text-sm" style={{ color: 'var(--sagb-muted)' }}>
              O TaskZei é o seu centro de execução. Crie sua primeira tarefa para organizar seu fluxo de trabalho e ter clareza sobre seus próximos passos.
            </p>
            <button
              onClick={handleOpenCreate}
              className="rounded-[var(--sagb-radius-sm)] px-5 py-2.5 text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: 'var(--sagb-primary)' }}
            >
              Adicionar primeira tarefa
            </button>
          </div>
        ) : hasNoFilterResults ? (
          <div className="mx-auto mt-12 flex max-w-md flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center" style={{ borderRadius: 'var(--sagb-radius-xl)', border: '1px solid var(--sagb-line)', backgroundColor: 'var(--sagb-bg)' }}>
              <svg className="h-8 w-8" style={{ color: 'var(--sagb-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="mb-2 text-lg font-semibold" style={{ color: 'var(--sagb-text)' }}>Nenhum resultado encontrado</h2>
            <p className="mb-6 text-sm" style={{ color: 'var(--sagb-muted)' }}>
              Ajuste os filtros ou limpe a busca para visualizar outras tarefas.
            </p>
            <button onClick={clearFilters} className="rounded-[var(--sagb-radius-sm)] px-5 py-2.5 text-sm font-semibold transition-colors" style={{ border: '1px solid var(--sagb-line)', backgroundColor: 'var(--sagb-surface)', color: 'var(--sagb-muted)' }}>
              Limpar filtros
            </button>
          </div>
        ) : (
        <TaskList
            tasks={visibleTreeRows}
            onTaskClick={handleTaskClick}
            onCompleteTask={handleCompleteTask}
            onChangeStatus={handleChangeStatus}
            onUpdateTask={handleUpdateTask}
            onCreateSubtask={handleOpenCreateSubtask}
            users={users}
            expandedIds={expandedIds}
            onToggleExpand={toggleExpanded}
          />
        )}
      </div>

      {/* Modal de criação */}
      {showCreateModal && (
        <TaskModal
          mode="create"
          onSave={(input) => handleCreateTask({ ...input, parentTaskId: createParentTaskId })}
          onClose={handleCloseCreate}
          saving={saving}
          users={users}
        />
      )}
    </div>
  );
};
