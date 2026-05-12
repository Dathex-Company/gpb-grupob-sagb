import { ITaskzeiService } from '../types/taskzei.contracts';
import { TaskzeiTask, TaskChecklistItem, TaskComment } from '../types/task.types';
import { TaskzeiTaskInlineInput } from '../types/taskzei.contracts';
import { Meeting, MeetingAgendaItem, Decision } from '../types/meeting.types';
import { InboxItem } from '../types/inbox.types';
import { TaskOrigin } from '../types/origin.types';
import { TaskzeiAdapter } from './taskzei.adapters';
import { useTaskzeiStore } from '../store/taskzei.store';
import { useMeetingStore } from '../store/meeting.store';
import { useInboxStore } from '../store/inbox.store';
import { integrationHub } from '../../hub-integracao/services/integrationService';
import { TaskzeiNotificationService, taskzeiNotificationService } from './taskzei_notification.service';

export class TaskzeiFacade implements ITaskzeiService {
  private provider = TaskzeiAdapter.getProvider();
  private readonly useHubForClickUp = this.resolveHubClickUpToggle();

  private resolveHubClickUpToggle(): boolean {
    const raw = String(import.meta.env.VITE_TASKZEI_CLICKUP_VIA_HUB || '').trim().toLowerCase();
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    return import.meta.env.DEV;
  }

  isHubClickUpEnabled(): boolean {
    return this.useHubForClickUp;
  }

  // ─── Utility: auto audit ──────────────────────────────────

  private async autoAudit(
    action: string,
    entityType: string,
    entityId: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    try {
      await this.provider.auditLog(action, entityType, entityId, undefined, metadata);
    } catch {
      // Silent fail — audit nunca bloqueia operação principal
    }
  }

  // ====================================================================
  // TASKS
  // ====================================================================

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
        this.triggerTaskCreatedNotification(hubTask, input.assigneeId);
        this.autoAudit('create_task', 'task', hubTask.id, { source: 'hub_clickup', title: input.title });
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
      this.triggerTaskCreatedNotification(newTask, input.assigneeId);
      this.autoAudit('create_task', 'task', newTask.id, { source: 'direct', title: input.title });
      return newTask;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error adding task');
      throw error;
    }
  }

  private async triggerTaskCreatedNotification(task: TaskzeiTask, assigneeId?: string | null) {
    try {
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
      console.error('[TaskzeiFacade] Failed to trigger notification:', err);
    }
  }

  async updateTask(id: string, updates: Partial<TaskzeiTaskInlineInput>): Promise<TaskzeiTask> {
    const store = useTaskzeiStore.getState();
    try {
      const previousTask = store.tasks.find(t => t.id === id);
      const previousStatus = previousTask?.status;
      const statusChanged = updates.status !== undefined && updates.status !== previousStatus;
      const assigneeChanged = updates.assigneeName !== undefined
        && updates.assigneeName !== previousTask?.assigneeName;

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

      if (statusChanged && previousStatus !== undefined) {
        this.triggerStatusChangedNotification(
          id,
          previousStatus,
          updates.status!,
          previousTask?.assigneeId,
          'Sistema'
        );
      }

      if (assigneeChanged && updates.assigneeName) {
        this.triggerAssigneeChangedNotification(
          updatedTask,
          previousTask?.assigneeName || 'Ninguém',
          updates.assigneeName,
          updates.assigneeId
        );
      }

      this.autoAudit('update_task', 'task', id, { updates: Object.keys(updates) });
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
        taskId, previousStatus, newStatus, assigneeId, updatedBy, 'default'
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

  private async triggerAssigneeChangedNotification(
    task: TaskzeiTask,
    previousAssignee: string,
    newAssignee: string,
    assigneeId?: string | null
  ) {
    try {
      TaskzeiNotificationService.notifyTaskCreated(task, assigneeId, 'default')
        .then((response: { success: boolean; error?: string }) => {
          if (!response.success) {
            console.warn('[TaskzeiFacade] Assignee change notification failed:', response.error);
          }
        })
        .catch((err: unknown) => {
          console.error('[TaskzeiFacade] Unhandled error in assignee notification:', err);
        });
    } catch (err) {
      console.error('[TaskzeiFacade] Failed to trigger assignee notification:', err);
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
      this.autoAudit('update_task_status', 'task', id, { newStatus: status });
      return updatedTask;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error updating task status');
      throw error;
    }
  }

  // ─── Checklist ─────────────────────────────────────────────

  async addChecklistItem(taskId: string, title: string): Promise<TaskChecklistItem> {
    const store = useTaskzeiStore.getState();
    try {
      const item = await this.provider.addChecklistItem(taskId, title);
      store.updateTask(taskId, {
        checklist: [...(store.tasks.find(t => t.id === taskId)?.checklist || []), item]
      });
      this.autoAudit('add_checklist', 'task', taskId, { itemId: item.id, title });
      return item;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error adding checklist item');
      throw error;
    }
  }

  async toggleChecklistItem(taskId: string, itemId: string): Promise<TaskChecklistItem> {
    const store = useTaskzeiStore.getState();
    try {
      const item = await this.provider.toggleChecklistItem(taskId, itemId);
      const task = store.tasks.find(t => t.id === taskId);
      if (task) {
        store.updateTask(taskId, {
          checklist: (task.checklist || []).map(c => c.id === itemId ? item : c)
        });
      }
      return item;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error toggling checklist item');
      throw error;
    }
  }

  async removeChecklistItem(taskId: string, itemId: string): Promise<boolean> {
    const store = useTaskzeiStore.getState();
    try {
      const result = await this.provider.removeChecklistItem(taskId, itemId);
      const task = store.tasks.find(t => t.id === taskId);
      if (task) {
        store.updateTask(taskId, {
          checklist: (task.checklist || []).filter(c => c.id !== itemId)
        });
      }
      this.autoAudit('remove_checklist', 'task', taskId, { itemId });
      return result;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error removing checklist item');
      throw error;
    }
  }

  // ─── Comments ──────────────────────────────────────────────

  async addComment(taskId: string, authorName: string, content: string): Promise<TaskComment> {
    const store = useTaskzeiStore.getState();
    try {
      const comment = await this.provider.addComment(taskId, authorName, content);
      const task = store.tasks.find(t => t.id === taskId);
      if (task) {
        store.updateTask(taskId, {
          comments: [comment, ...(task.comments || [])]
        });
      }
      this.autoAudit('add_comment', 'task', taskId, { commentId: comment.id });
      return comment;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error adding comment');
      throw error;
    }
  }

  // ─── Duplicate & Archive ───────────────────────────────────

  async duplicateTask(id: string): Promise<TaskzeiTask> {
    const store = useTaskzeiStore.getState();
    try {
      const copy = await this.provider.duplicateTask(id);
      store.addTask(copy);
      this.autoAudit('duplicate_task', 'task', id, { copyId: copy.id });
      return copy;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error duplicating task');
      throw error;
    }
  }

  async archiveTask(id: string): Promise<TaskzeiTask> {
    const store = useTaskzeiStore.getState();
    try {
      const archived = await this.provider.archiveTask(id);
      store.updateTask(id, { archived: true });
      this.autoAudit('archive_task', 'task', id);
      return archived;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error archiving task');
      throw error;
    }
  }

  // ====================================================================
  // ORIGIN (F5)
  // ====================================================================

  async createTaskFromOrigin(
    data: Omit<TaskzeiTask, 'id' | 'createdAt' | 'updatedAt'> & { origin: TaskOrigin }
  ): Promise<TaskzeiTask> {
    const store = useTaskzeiStore.getState();
    try {
      const task = await this.provider.createTaskFromOrigin(data);
      store.addTask(task);
      this.autoAudit('create_task_from_origin', 'task', task.id, { origin: data.origin });
      return task;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error creating task from origin');
      throw error;
    }
  }

  // ====================================================================
  // MEETINGS (F7)
  // ====================================================================

  async loadMeetings(): Promise<Meeting[]> {
    const store = useMeetingStore.getState();
    store.setLoading(true);
    try {
      const meetings = await this.provider.getMeetings();
      store.setMeetings(meetings);
      return meetings;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error loading meetings');
      return [];
    } finally {
      store.setLoading(false);
    }
  }

  async getMeetingById(id: string): Promise<Meeting | null> {
    try {
      return await this.provider.getMeetingById(id);
    } catch (error) {
      console.error('[TaskzeiFacade] Error getting meeting:', error);
      return null;
    }
  }

  async createMeeting(data: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meeting> {
    const store = useMeetingStore.getState();
    try {
      const meeting = await this.provider.createMeeting(data);
      store.addMeeting(meeting);
      this.autoAudit('create_meeting', 'meeting', meeting.id, { title: data.title });
      return meeting;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error creating meeting');
      throw error;
    }
  }

  async updateMeeting(id: string, updates: Partial<Meeting>): Promise<Meeting> {
    const store = useMeetingStore.getState();
    try {
      const updated = await this.provider.updateMeeting(id, updates);
      store.updateMeeting(id, updates);
      this.autoAudit('update_meeting', 'meeting', id, { updates: Object.keys(updates) });
      return updated;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error updating meeting');
      throw error;
    }
  }

  async deleteMeeting(id: string): Promise<boolean> {
    const store = useMeetingStore.getState();
    try {
      const result = await this.provider.deleteMeeting(id);
      store.removeMeeting(id);
      this.autoAudit('delete_meeting', 'meeting', id);
      return result;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error deleting meeting');
      throw error;
    }
  }

  // Agenda Items (Pautas)

  async addAgendaItem(
    meetingId: string,
    data: Omit<MeetingAgendaItem, 'id' | 'meetingId' | 'createdAt' | 'updatedAt'>
  ): Promise<MeetingAgendaItem> {
    try {
      const item = await this.provider.addAgendaItem(meetingId, data);
      // Refresh meeting to get updated agenda items
      const meeting = await this.provider.getMeetingById(meetingId);
      if (meeting) {
        useMeetingStore.getState().updateMeeting(meetingId, { agendaItems: meeting.agendaItems });
      }
      this.autoAudit('add_agenda_item', 'meeting', meetingId, { itemId: item.id, title: data.title });
      return item;
    } catch (error) {
      useMeetingStore.getState().setError(error instanceof Error ? error.message : 'Error adding agenda item');
      throw error;
    }
  }

  async updateAgendaItem(id: string, updates: Partial<MeetingAgendaItem>): Promise<MeetingAgendaItem> {
    try {
      const item = await this.provider.updateAgendaItem(id, updates);
      this.autoAudit('update_agenda_item', 'agenda_item', id, { updates: Object.keys(updates) });
      return item;
    } catch (error) {
      useMeetingStore.getState().setError(error instanceof Error ? error.message : 'Error updating agenda item');
      throw error;
    }
  }

  async removeAgendaItem(id: string): Promise<boolean> {
    try {
      const result = await this.provider.removeAgendaItem(id);
      this.autoAudit('remove_agenda_item', 'agenda_item', id);
      return result;
    } catch (error) {
      useMeetingStore.getState().setError(error instanceof Error ? error.message : 'Error removing agenda item');
      throw error;
    }
  }

  async reorderAgendaItems(meetingId: string, orderedIds: string[]): Promise<MeetingAgendaItem[]> {
    try {
      const items = await this.provider.reorderAgendaItems(meetingId, orderedIds);
      const meeting = await this.provider.getMeetingById(meetingId);
      if (meeting) {
        useMeetingStore.getState().updateMeeting(meetingId, { agendaItems: meeting.agendaItems });
      }
      this.autoAudit('reorder_agenda', 'meeting', meetingId);
      return items;
    } catch (error) {
      useMeetingStore.getState().setError(error instanceof Error ? error.message : 'Error reordering agenda items');
      throw error;
    }
  }

  // Decisions

  async addDecision(data: Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>): Promise<Decision> {
    try {
      const decision = await this.provider.addDecision(data);
      if (data.meetingId) {
        useMeetingStore.getState().addDecision(data.meetingId, decision);
      }
      this.autoAudit('add_decision', 'decision', decision.id, { title: data.title, meetingId: data.meetingId });
      return decision;
    } catch (error) {
      useMeetingStore.getState().setError(error instanceof Error ? error.message : 'Error adding decision');
      throw error;
    }
  }

  async updateDecision(id: string, updates: Partial<Decision>): Promise<Decision> {
    try {
      const decision = await this.provider.updateDecision(id, updates);
      useMeetingStore.getState().updateDecision(id, updates);
      this.autoAudit('update_decision', 'decision', id, { updates: Object.keys(updates) });
      return decision;
    } catch (error) {
      useMeetingStore.getState().setError(error instanceof Error ? error.message : 'Error updating decision');
      throw error;
    }
  }

  async removeDecision(id: string): Promise<boolean> {
    try {
      const result = await this.provider.removeDecision(id);
      useMeetingStore.getState().removeDecision(id);
      this.autoAudit('remove_decision', 'decision', id);
      return result;
    } catch (error) {
      useMeetingStore.getState().setError(error instanceof Error ? error.message : 'Error removing decision');
      throw error;
    }
  }

  // ====================================================================
  // INBOX (F6)
  // ====================================================================

  async loadInboxItems(): Promise<InboxItem[]> {
    const store = useInboxStore.getState();
    store.setLoading(true);
    try {
      const items = await this.provider.getInboxItems();
      store.setInboxItems(items);
      return items;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error loading inbox items');
      return [];
    } finally {
      store.setLoading(false);
    }
  }

  async addToInbox(data: Omit<InboxItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InboxItem> {
    const store = useInboxStore.getState();
    try {
      const item = await this.provider.addToInbox(data);
      store.addInboxItem(item);
      this.autoAudit('add_to_inbox', 'inbox', item.id, { source: data.source });
      return item;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error adding to inbox');
      throw error;
    }
  }

  async classifyInboxItem(id: string, suggestedType: InboxItem['suggestedType'], confidence: number): Promise<InboxItem> {
    const store = useInboxStore.getState();
    try {
      const item = await this.provider.classifyInboxItem(id, suggestedType, confidence);
      store.updateInboxItem(id, { status: 'classified', suggestedType, confidence });
      this.autoAudit('classify_inbox', 'inbox', id, { suggestedType, confidence });
      return item;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error classifying inbox item');
      throw error;
    }
  }

  async dismissInboxItem(id: string): Promise<InboxItem> {
    const store = useInboxStore.getState();
    try {
      const item = await this.provider.dismissInboxItem(id);
      store.updateInboxItem(id, { status: 'dismissed' });
      this.autoAudit('dismiss_inbox', 'inbox', id);
      return item;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error dismissing inbox item');
      throw error;
    }
  }

  // ====================================================================
  // AUDIT (F10)
  // ====================================================================

  async auditLog(
    action: string,
    entityType: string,
    entityId: string,
    userId?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    try {
      await this.provider.auditLog(action, entityType, entityId, userId, metadata);
    } catch (error) {
      console.error('[TaskzeiFacade] Audit log error:', error);
    }
  }
}

export const taskzeiFacade = new TaskzeiFacade();
