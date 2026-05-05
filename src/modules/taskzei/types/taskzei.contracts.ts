import { TaskzeiTask, TaskChecklistItem, TaskComment } from './task.types';
import { Meeting, MeetingAgendaItem, Decision } from './meeting.types';
import { InboxItem } from './inbox.types';
import { TaskOrigin } from './origin.types';

export interface TaskzeiTaskInlineInput {
  title: string;
  priority: TaskzeiTask['priority'];
  status: TaskzeiTask['status'];
  assigneeName?: string;
  dueDate?: string;
}

export interface ITaskzeiRepository {
  // === Tasks (existing) ===
  getTasks(): Promise<TaskzeiTask[]>;
  getTaskById(id: string): Promise<TaskzeiTask | null>;
  createTask(task: Omit<TaskzeiTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<TaskzeiTask>;
  updateTask(id: string, updates: Partial<TaskzeiTask>): Promise<TaskzeiTask>;
  deleteTask(id: string): Promise<boolean>;

  // Checklist
  addChecklistItem(taskId: string, title: string): Promise<TaskChecklistItem>;
  toggleChecklistItem(taskId: string, itemId: string): Promise<TaskChecklistItem>;
  removeChecklistItem(taskId: string, itemId: string): Promise<boolean>;

  // Comments
  addComment(taskId: string, authorName: string, content: string): Promise<TaskComment>;

  // Duplicate & Archive
  duplicateTask(id: string): Promise<TaskzeiTask>;
  archiveTask(id: string): Promise<TaskzeiTask>;

  // === Origin (F5) ===
  createTaskFromOrigin(
    data: Omit<TaskzeiTask, 'id' | 'createdAt' | 'updatedAt'> & { origin: TaskOrigin }
  ): Promise<TaskzeiTask>;

  // === Meetings (F7) ===
  getMeetings(): Promise<Meeting[]>;
  getMeetingById(id: string): Promise<Meeting | null>;
  createMeeting(data: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meeting>;
  updateMeeting(id: string, updates: Partial<Meeting>): Promise<Meeting>;
  deleteMeeting(id: string): Promise<boolean>;

  // Agenda Items (Pautas)
  addAgendaItem(meetingId: string, data: Omit<MeetingAgendaItem, 'id' | 'meetingId' | 'createdAt' | 'updatedAt'>): Promise<MeetingAgendaItem>;
  updateAgendaItem(id: string, updates: Partial<MeetingAgendaItem>): Promise<MeetingAgendaItem>;
  removeAgendaItem(id: string): Promise<boolean>;
  reorderAgendaItems(meetingId: string, orderedIds: string[]): Promise<MeetingAgendaItem[]>;

  // Decisions
  addDecision(data: Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>): Promise<Decision>;
  updateDecision(id: string, updates: Partial<Decision>): Promise<Decision>;
  removeDecision(id: string): Promise<boolean>;

  // === Inbox (F6) ===
  getInboxItems(): Promise<InboxItem[]>;
  addToInbox(data: Omit<InboxItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InboxItem>;
  classifyInboxItem(id: string, suggestedType: InboxItem['suggestedType'], confidence: number): Promise<InboxItem>;
  dismissInboxItem(id: string): Promise<InboxItem>;
  convertInboxToEntity(
    inboxId: string,
    entityType: NonNullable<InboxItem['convertedToType']>,
    entityId: string
  ): Promise<InboxItem>;

  // === Audit (F10) ===
  auditLog(
    action: string,
    entityType: string,
    entityId: string,
    userId?: string,
    metadata?: Record<string, unknown>
  ): Promise<void>;
}

export interface ITaskzeiService {
  // === Tasks (existing) ===
  loadTasks(): Promise<TaskzeiTask[]>;
  addNewTask(title: string, description?: string): Promise<TaskzeiTask>;
  createTask(input: TaskzeiTaskInlineInput): Promise<TaskzeiTask>;
  updateTask(id: string, updates: Partial<TaskzeiTaskInlineInput>): Promise<TaskzeiTask>;
  completeTask(id: string): Promise<TaskzeiTask>;
  updateTaskStatus(id: string, status: import('./task.types').TaskStatus): Promise<TaskzeiTask>;

  // Checklist
  addChecklistItem(taskId: string, title: string): Promise<TaskChecklistItem>;
  toggleChecklistItem(taskId: string, itemId: string): Promise<TaskChecklistItem>;
  removeChecklistItem(taskId: string, itemId: string): Promise<boolean>;

  // Comments
  addComment(taskId: string, authorName: string, content: string): Promise<TaskComment>;

  // Duplicate & Archive
  duplicateTask(id: string): Promise<TaskzeiTask>;
  archiveTask(id: string): Promise<TaskzeiTask>;

  // === Origin (F5) ===
  createTaskFromOrigin(
    data: Omit<TaskzeiTask, 'id' | 'createdAt' | 'updatedAt'> & { origin: TaskOrigin }
  ): Promise<TaskzeiTask>;

  // === Meetings (F7) ===
  loadMeetings(): Promise<Meeting[]>;
  getMeetingById(id: string): Promise<Meeting | null>;
  createMeeting(data: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meeting>;
  updateMeeting(id: string, updates: Partial<Meeting>): Promise<Meeting>;
  deleteMeeting(id: string): Promise<boolean>;

  // Agenda Items (Pautas)
  addAgendaItem(meetingId: string, data: Omit<MeetingAgendaItem, 'id' | 'meetingId' | 'createdAt' | 'updatedAt'>): Promise<MeetingAgendaItem>;
  updateAgendaItem(id: string, updates: Partial<MeetingAgendaItem>): Promise<MeetingAgendaItem>;
  removeAgendaItem(id: string): Promise<boolean>;
  reorderAgendaItems(meetingId: string, orderedIds: string[]): Promise<MeetingAgendaItem[]>;

  // Decisions
  addDecision(data: Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>): Promise<Decision>;
  updateDecision(id: string, updates: Partial<Decision>): Promise<Decision>;
  removeDecision(id: string): Promise<boolean>;

  // === Inbox (F6) ===
  loadInboxItems(): Promise<InboxItem[]>;
  addToInbox(data: Omit<InboxItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InboxItem>;
  classifyInboxItem(id: string, suggestedType: InboxItem['suggestedType'], confidence: number): Promise<InboxItem>;
  dismissInboxItem(id: string): Promise<InboxItem>;

  // === Audit (F10) ===
  auditLog(
    action: string,
    entityType: string,
    entityId: string,
    userId?: string,
    metadata?: Record<string, unknown>
  ): Promise<void>;
}
