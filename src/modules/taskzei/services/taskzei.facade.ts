import { ITaskzeiService } from '../types/taskzei.contracts';
import { TaskzeiTask } from '../types/task.types';
import { TaskzeiTaskInlineInput } from '../types/taskzei.contracts';
import { TaskzeiAdapter } from './taskzei.adapters';
import { useTaskzeiStore } from '../store/taskzei.store';
import { integrationHub } from '../../hub-integracao/services/integrationService';
import { taskzeiNotificationService } from './taskzei_notification.service';

export class TaskzeiFacade implements ITaskzeiService {
  private provider = TaskzeiAdapter.getProvider();
  private readonly useHubForClickUp = this.resolveHubClickUpToggle();

  private resolveHubClickUpToggle(): boolean {
    const raw = String(import.meta.env.VITE_TASKZEI_CLICKUP_VIA_HUB || '').trim().toLowerCase();
    if (raw === 'true') return true;
    if (raw === 'false') return false;

    // Default: em desenvolvimento, manter POC ativa sem exigir configuração manual
    return import.meta.env.DEV;
  }

  isHubClickUpEnabled(): boolean {
    return this.useHubForClickUp;
  }

  async loadTasks(): Promise<TaskzeiTask[]> {
    const store = useTaskzeiStore.getState();
    store.setLoading(true);
    try {
      const tasks = await this.provider.getTasks();
      store.setTasks(tasks);
      return tasks;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error loading tasks');
      return [];
    } finally {
      store.setLoading(false);
    }
  }

  async addNewTask(title: string, description?: string): Promise<TaskzeiTask> {
    return this.createTask({
      title,
      priority: 'media',
      status: 'aberta',
      assigneeName: 'Você',
      dueDate: undefined,
    });
  }

  async createTask(input: TaskzeiTaskInlineInput): Promise<TaskzeiTask> {
    const store = useTaskzeiStore.getState();
    try {
      if (this.useHubForClickUp) {
        const clickUpResult = await integrationHub.createTaskViaClickUp({
          title: input.title,
          priority: input.priority,
          status: input.status,
          assigneeName: input.assigneeName,
          dueDate: input.dueDate
        });

        const nowIso = new Date().toISOString();
        const hubTask: TaskzeiTask = {
          id: clickUpResult.externalId,
          title: input.title,
          description: `Criada via Hub de Integrações (ClickUp).`,
          status: input.status,
          priority: input.priority,
          assigneeName: input.assigneeName || undefined,
          dueDate: input.dueDate || undefined,
          checklist: [],
          comments: [
            {
              id: crypto.randomUUID(),
              authorName: 'Hub de Integrações',
              content: `POC TaskZei→Hub→ClickUp concluída. Integração: ${clickUpResult.integrationId}`,
              createdAt: nowIso
            }
          ],
          createdAt: nowIso,
          updatedAt: nowIso
        };

        store.addTask(hubTask);
        // Notificação de criação (se houver assigneeId, será resolvido server‑side)
        this.triggerTaskCreatedNotification(hubTask, input.assigneeId);
        return hubTask;
      }

      const newTask = await this.provider.createTask({
        title: input.title,
        description: undefined,
        status: input.status,
        priority: input.priority,
        assigneeName: input.assigneeName || undefined,
        dueDate: input.dueDate || undefined,
        checklist: [],
        comments: []
      });
      store.addTask(newTask);
      // Notificação de criação (se houver assigneeId, será resolvido server‑side)
      this.triggerTaskCreatedNotification(newTask, input.assigneeId);
      return newTask;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error adding task');
      throw error;
    }
  }

  private async triggerTaskCreatedNotification(task: TaskzeiTask, assigneeId?: string | null) {
    try {
      // Notificação assíncrona e não‑bloqueante
      taskzeiNotificationService.notifyTaskCreated(task, assigneeId, 'default')
        .then(response => {
          if (!response.success) {
            console.warn('[TaskzeiFacade] Task creation notification failed:', response.error);
          }
        })
        .catch(err => {
          console.error('[TaskzeiFacade] Unhandled error in notification:', err);
        });
    } catch (err) {
      // Falha silenciosa para não impactar o fluxo principal
      console.error('[TaskzeiFacade] Failed to trigger notification:', err);
    }
  }

  async updateTask(id: string, updates: Partial<TaskzeiTaskInlineInput>): Promise<TaskzeiTask> {
    const store = useTaskzeiStore.getState();
    try {
      // Capturar status anterior se houver mudança de status
      const previousTask = store.tasks.find(t => t.id === id);
      const previousStatus = previousTask?.status;
      const statusChanged = updates.status !== undefined && updates.status !== previousStatus;

      const updatedTask = await this.provider.updateTask(id, {
        ...(updates.title !== undefined ? { title: updates.title } : {}),
        ...(updates.priority !== undefined ? { priority: updates.priority } : {}),
        ...(updates.status !== undefined ? { status: updates.status } : {}),
        ...(updates.assigneeName !== undefined ? { assigneeName: updates.assigneeName || undefined } : {}),
        ...(updates.dueDate !== undefined ? { dueDate: updates.dueDate || undefined } : {}),
      });
      store.updateTask(id, {
        ...(updates.title !== undefined ? { title: updates.title } : {}),
        ...(updates.priority !== undefined ? { priority: updates.priority } : {}),
        ...(updates.status !== undefined ? { status: updates.status } : {}),
        ...(updates.assigneeName !== undefined ? { assigneeName: updates.assigneeName || undefined } : {}),
        ...(updates.dueDate !== undefined ? { dueDate: updates.dueDate || undefined } : {}),
      });

      // Disparar notificação de mudança de status se houver alteração real
      if (statusChanged && previousStatus !== undefined) {
        this.triggerStatusChangedNotification(
          id,
          previousStatus,
          updates.status!,
          previousTask?.assigneeId,
          'Sistema' // TODO: obter usuário atual do contexto de autenticação
        );
      }

      return updatedTask;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error updating task');
      throw error;
    }
  }

  private async triggerStatusChangedNotification(
    taskId: string,
    previousStatus: string,
    newStatus: string,
    assigneeId?: string | null,
    updatedBy: string = 'Sistema'
  ) {
    try {
      taskzeiNotificationService.notifyStatusChanged(
        taskId,
        previousStatus,
        newStatus,
        assigneeId,
        updatedBy,
        'default'
      )
        .then(response => {
          if (!response.success) {
            console.warn('[TaskzeiFacade] Status change notification failed:', response.error);
          }
        })
        .catch(err => {
          console.error('[TaskzeiFacade] Unhandled error in status notification:', err);
        });
    } catch (err) {
      console.error('[TaskzeiFacade] Failed to trigger status notification:', err);
    }
  }

  async completeTask(id: string): Promise<TaskzeiTask> {
    return this.updateTaskStatus(id, 'concluida');
  }

  async updateTaskStatus(id: string, status: import('../types/task.types').TaskStatus): Promise<TaskzeiTask> {
    const store = useTaskzeiStore.getState();
    try {
      const updatedTask = await this.provider.updateTask(id, { status });
      store.updateTask(id, { status });
      return updatedTask;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error updating task status');
      throw error;
    }
  }
}

export const taskzeiFacade = new TaskzeiFacade();
