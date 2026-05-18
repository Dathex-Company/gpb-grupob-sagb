import {
  addDoc,
  collection,
  db,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from '../../../../services/supabase';
import { uploadBlobToSupabaseStorage } from '../../../../services/storage';
import { ITaskzeiRepository, TaskAttachment } from '../types/taskzei.contracts';
import { TaskComment, TaskChecklistItem, TaskzeiTask } from '../types/task.types';
import { TaskOrigin } from '../types/origin.types';
import { Meeting, MeetingAgendaItem, Decision } from '../types/meeting.types';
import { InboxItem } from '../types/inbox.types';
import {
  CustomFieldDefinition,
  CustomFieldDefinitionInput,
  CustomFieldValue,
  CustomFieldType,
  DropdownOption,
  extractCustomValue,
} from '../types/customField.types';

// ─── Row Types ──────────────────────────────────────────────

type TaskzeiTaskRow = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskzeiTask['status'];
  priority: TaskzeiTask['priority'];
  assignee_name?: string | null;
  assignee_id?: string | null;
  internal_description?: string | null;
  completed_at?: string | null;
  due_date?: string | null;
  origin_system?: string | null;
  origin_ref?: string | null;
  origin_metadata?: Record<string, unknown> | null;
  related_doc_ids?: string[] | null;
  archived?: boolean | null;
  created_at: string;
  updated_at: string;
};

type TaskzeiChecklistRow = {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
};

type TaskzeiCommentRow = {
  id: string;
  task_id: string;
  author_name: string;
  content: string;
  created_at: string;
};

type MeetingRow = {
  id: string;
  title: string;
  description?: string | null;
  meeting_date?: string | null;
  start_time?: string | null;
  duration_minutes?: number | null;
  status: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

type AgendaItemRow = {
  id: string;
  meeting_id: string;
  title: string;
  description?: string | null;
  sort_order: number;
  duration_minutes?: number | null;
  status: string;
  created_at: string;
  updated_at: string;
};

type DecisionRow = {
  id: string;
  meeting_id?: string | null;
  agenda_item_id?: string | null;
  title: string;
  description?: string | null;
  responsible?: string | null;
  deadline?: string | null;
  status: string;
  related_task_id?: string | null;
  created_at: string;
  updated_at: string;
};

type InboxRow = {
  id: string;
  content: string;
  source: string;
  status: string;
  suggested_type?: string | null;
  confidence?: number | null;
  converted_to_id?: string | null;
  converted_to_type?: string | null;
  created_at: string;
  updated_at: string;
};

type CustomFieldDefinitionRow = {
  id: string;
  workspace_id: string;
  name: string;
  type: string;
  config: any;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type TaskCustomValueRow = {
  task_id: string;
  field_id: string;
  value: any;
  created_at: string;
  updated_at: string;
};

type TaskAttachmentRow = {
  id: string;
  task_id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  storage_key: string;
  created_by?: string | null;
  created_at: string;
};

// ─── Helpers ────────────────────────────────────────────────

const to_iso_string = (value?: unknown): string | undefined => {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as any).toDate === 'function') {
    const date = (value as any).toDate();
    return date instanceof Date && !Number.isNaN(date.getTime()) ? date.toISOString() : undefined;
  }
  const date = new Date(value as string);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const map_task_row = (
  row: TaskzeiTaskRow,
  checklist: TaskChecklistItem[],
  comments: TaskComment[]
): TaskzeiTask => ({
  id: row.id,
  title: row.title,
  description: row.description || undefined,
  status: row.status,
  priority: row.priority,
  assigneeName: row.assignee_name || undefined,
  assigneeId: row.assignee_id || undefined,
  internalDescription: row.internal_description || undefined,
  completedAt: to_iso_string(row.completed_at),
  dueDate: to_iso_string(row.due_date),
  checklist,
  comments,
  archived: row.archived ?? undefined,
  origin: row.origin_system
    ? { system: row.origin_system as TaskOrigin['system'], ref: row.origin_ref || undefined, metadata: row.origin_metadata || undefined }
    : undefined,
  relatedDocIds: row.related_doc_ids || undefined,
  createdAt: to_iso_string(row.created_at) || new Date().toISOString(),
  updatedAt: to_iso_string(row.updated_at) || new Date().toISOString(),
});

const map_meeting_row = (row: MeetingRow, agendaItems: MeetingAgendaItem[], decisions: Decision[]): Meeting => ({
  id: row.id,
  title: row.title,
  description: row.description || undefined,
  meetingDate: row.meeting_date || undefined,
  startTime: row.start_time || undefined,
  durationMinutes: row.duration_minutes || undefined,
  status: row.status as Meeting['status'],
  notes: row.notes || undefined,
  agendaItems,
  decisions,
  createdAt: to_iso_string(row.created_at) || new Date().toISOString(),
  updatedAt: to_iso_string(row.updated_at) || new Date().toISOString(),
});

const map_decision_row = (row: DecisionRow): Decision => ({
  id: row.id,
  meetingId: row.meeting_id || undefined,
  agendaItemId: row.agenda_item_id || undefined,
  title: row.title,
  description: row.description || undefined,
  responsible: row.responsible || undefined,
  deadline: to_iso_string(row.deadline),
  status: row.status as Decision['status'],
  relatedTaskId: row.related_task_id || undefined,
  createdAt: to_iso_string(row.created_at) || new Date().toISOString(),
  updatedAt: to_iso_string(row.updated_at) || new Date().toISOString(),
});

const map_cf_definition_row = (row: CustomFieldDefinitionRow): CustomFieldDefinition => ({
  id: row.id,
  workspaceId: row.workspace_id,
  name: row.name,
  type: row.type as CustomFieldType,
  config: (Array.isArray(row.config) ? row.config : []) as DropdownOption[],
  sortOrder: row.sort_order,
  isActive: row.is_active,
  createdAt: to_iso_string(row.created_at) || new Date().toISOString(),
  updatedAt: to_iso_string(row.updated_at) || new Date().toISOString(),
});

// ─── Provider ───────────────────────────────────────────────

export class SupabaseTaskzeiProvider implements ITaskzeiRepository {
  // ============ TASKS ============

  async getTasks(): Promise<TaskzeiTask[]> {
    const task_snap = await getDocs(query(collection(db, 'taskzei_tasks'), orderBy('created_at', 'desc')));
    const tasks_rows = task_snap.docs.map((d) => d.data() as TaskzeiTaskRow);

    const checklist_snap = await getDocs(collection(db, 'taskzei_task_checklist_items'));
    const checklist_rows = checklist_snap.docs.map((d) => d.data() as TaskzeiChecklistRow);

    const comment_snap = await getDocs(query(collection(db, 'taskzei_task_comments'), orderBy('created_at', 'asc')));
    const comment_rows = comment_snap.docs.map((d) => d.data() as TaskzeiCommentRow);

    return tasks_rows.map((row) => {
      const checklist = checklist_rows
        .filter((item) => item.task_id === row.id)
        .map((item) => ({ id: item.id, title: item.title, completed: item.completed }));

      const comments = comment_rows
        .filter((item) => item.task_id === row.id)
        .map((item) => ({
          id: item.id,
          authorName: item.author_name,
          content: item.content,
          createdAt: to_iso_string(item.created_at) || new Date().toISOString(),
        }));

      return map_task_row(row, checklist, comments);
    });
  }

  async getTaskById(id: string): Promise<TaskzeiTask | null> {
    const task_snap = await getDocs(query(collection(db, 'taskzei_tasks'), where('id', '==', id)));
    const task_doc = task_snap.docs[0];
    if (!task_doc) return null;
    const row = task_doc.data() as TaskzeiTaskRow;

    const checklist_snap = await getDocs(query(collection(db, 'taskzei_task_checklist_items'), where('task_id', '==', id)));
    const checklist = checklist_snap.docs.map((d) => {
      const item = d.data() as TaskzeiChecklistRow;
      return { id: item.id, title: item.title, completed: item.completed };
    });

    const comment_snap = await getDocs(
      query(collection(db, 'taskzei_task_comments'), where('task_id', '==', id), orderBy('created_at', 'asc'))
    );
    const comments = comment_snap.docs.map((d) => {
      const item = d.data() as TaskzeiCommentRow;
      return {
        id: item.id,
        authorName: item.author_name,
        content: item.content,
        createdAt: to_iso_string(item.created_at) || new Date().toISOString(),
      };
    });

    return map_task_row(row, checklist, comments);
  }

  async createTask(task: Omit<TaskzeiTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<TaskzeiTask> {
    const task_ref = await addDoc(collection(db, 'taskzei_tasks'), {
      title: task.title,
      description: task.description || null,
      status: task.status,
      priority: task.priority,
      assignee_name: task.assigneeName || null,
      assignee_id: task.assigneeId || null,
      internal_description: task.internalDescription || null,
      completed_at: task.completedAt || null,
      due_date: task.dueDate || null,
    });

    if (task.checklist?.length) {
      for (const item of task.checklist) {
        await addDoc(collection(db, 'taskzei_task_checklist_items'), {
          task_id: task_ref.id,
          title: item.title,
          completed: item.completed,
        });
      }
    }

    if (task.comments?.length) {
      for (const comment of task.comments) {
        await addDoc(collection(db, 'taskzei_task_comments'), {
          task_id: task_ref.id,
          author_name: comment.authorName,
          content: comment.content,
        });
      }
    }

    const created_task = await this.getTaskById(task_ref.id);
    if (!created_task) throw new Error('Task not found after creation');
    return created_task;
  }

  async updateTask(id: string, updates: Partial<TaskzeiTask>): Promise<TaskzeiTask> {
    const firestoreData: Record<string, unknown> = {};
    if (updates.title !== undefined) firestoreData.title = updates.title;
    if (updates.description !== undefined) firestoreData.description = updates.description || null;
    if (updates.status !== undefined) firestoreData.status = updates.status;
    if (updates.priority !== undefined) firestoreData.priority = updates.priority;
    if (updates.assigneeName !== undefined) firestoreData.assignee_name = updates.assigneeName || null;
    if (updates.assigneeId !== undefined) firestoreData.assignee_id = updates.assigneeId || null;
    if (updates.internalDescription !== undefined) firestoreData.internal_description = updates.internalDescription || null;
    if (updates.completedAt !== undefined) firestoreData.completed_at = updates.completedAt || null;
    if (updates.dueDate !== undefined) firestoreData.due_date = updates.dueDate || null;
    if (updates.archived !== undefined) firestoreData.archived = updates.archived;
    if (updates.origin !== undefined) {
      firestoreData.origin_system = updates.origin?.system || null;
      firestoreData.origin_ref = updates.origin?.ref || null;
      firestoreData.origin_metadata = updates.origin?.metadata || null;
    }
    if (updates.relatedDocIds !== undefined) firestoreData.related_doc_ids = updates.relatedDocIds;

    await updateDoc(doc(db, 'taskzei_tasks', id), firestoreData);
    const updated_task = await this.getTaskById(id);
    if (!updated_task) throw new Error('Task not found after update');
    return updated_task;
  }

  async deleteTask(id: string): Promise<boolean> {
    await deleteDoc(doc(db, 'taskzei_tasks', id));
    return true;
  }

  // ─── Checklist ──────────────────────────────────────────────

  async addChecklistItem(taskId: string, title: string): Promise<TaskChecklistItem> {
    const ref = await addDoc(collection(db, 'taskzei_task_checklist_items'), {
      task_id: taskId,
      title,
      completed: false,
    });
    return { id: ref.id, title, completed: false };
  }

  async toggleChecklistItem(taskId: string, itemId: string): Promise<TaskChecklistItem> {
    const item_snap = await getDocs(query(collection(db, 'taskzei_task_checklist_items'), where('id', '==', itemId)));
    const item_doc = item_snap.docs[0];
    if (!item_doc) throw new Error('Checklist item not found');
    const current = item_doc.data() as TaskzeiChecklistRow;
    const newCompleted = !current.completed;
    await updateDoc(doc(db, 'taskzei_task_checklist_items', itemId), { completed: newCompleted });
    return { id: itemId, title: current.title, completed: newCompleted };
  }

  async removeChecklistItem(taskId: string, itemId: string): Promise<boolean> {
    await deleteDoc(doc(db, 'taskzei_task_checklist_items', itemId));
    return true;
  }

  // ─── Comments ───────────────────────────────────────────────

  async addComment(taskId: string, authorName: string, content: string): Promise<TaskComment> {
    const ref = await addDoc(collection(db, 'taskzei_task_comments'), {
      task_id: taskId,
      author_name: authorName,
      content,
    });
    return { id: ref.id, authorName, content, createdAt: new Date().toISOString() };
  }

  // ─── Duplicate & Archive ────────────────────────────────────

  async duplicateTask(id: string): Promise<TaskzeiTask> {
    const original = await this.getTaskById(id);
    if (!original) throw new Error('Task not found');
    return this.createTask({
      title: `${original.title} (cópia)`,
      description: original.description,
      status: 'aberta',
      priority: original.priority,
      assigneeName: original.assigneeName,
      dueDate: original.dueDate,
      checklist: (original.checklist || []).map(c => ({ ...c, completed: false })),
      comments: [],
      archived: false,
    });
  }

  async archiveTask(id: string): Promise<TaskzeiTask> {
    return this.updateTask(id, { archived: true } as Partial<TaskzeiTask>);
  }

  // ============ ORIGIN (F5) ============

  async createTaskFromOrigin(
    data: Omit<TaskzeiTask, 'id' | 'createdAt' | 'updatedAt'> & { origin: TaskOrigin }
  ): Promise<TaskzeiTask> {
    const task_ref = await addDoc(collection(db, 'taskzei_tasks'), {
      title: data.title,
      description: data.description || null,
      status: data.status,
      priority: data.priority,
      assignee_name: data.assigneeName || null,
      due_date: data.dueDate || null,
      origin_system: data.origin.system,
      origin_ref: data.origin.ref || null,
      origin_metadata: data.origin.metadata || null,
    });
    const created = await this.getTaskById(task_ref.id);
    if (!created) throw new Error('Task not found after creation');
    return created;
  }

  // ============ MEETINGS (F7) ============

  async getMeetings(): Promise<Meeting[]> {
    const mtg_snap = await getDocs(query(collection(db, 'taskzei_meetings'), orderBy('created_at', 'desc')));
    const mtg_rows = mtg_snap.docs.map((d) => d.data() as MeetingRow);

    const agenda_snap = await getDocs(collection(db, 'taskzei_meeting_agenda_items'));
    const agenda_rows = agenda_snap.docs.map((d) => d.data() as AgendaItemRow);

    const dec_snap = await getDocs(collection(db, 'taskzei_decisions'));
    const dec_rows = dec_snap.docs.map((d) => d.data() as DecisionRow);

    return mtg_rows.map((row) => {
      const agendaItems = agenda_rows
        .filter((a) => a.meeting_id === row.id)
        .map((a) => ({
          id: a.id,
          meetingId: a.meeting_id,
          title: a.title,
          description: a.description || undefined,
          sortOrder: a.sort_order,
          durationMinutes: a.duration_minutes || undefined,
          status: a.status as MeetingAgendaItem['status'],
          createdAt: to_iso_string(a.created_at) || new Date().toISOString(),
          updatedAt: to_iso_string(a.updated_at) || new Date().toISOString(),
        }));

      const decisions = dec_rows
        .filter((d) => d.meeting_id === row.id)
        .map(map_decision_row);

      return map_meeting_row(row, agendaItems, decisions);
    });
  }

  async getMeetingById(id: string): Promise<Meeting | null> {
    const mtg_snap = await getDocs(query(collection(db, 'taskzei_meetings'), where('id', '==', id)));
    const mtg_doc = mtg_snap.docs[0];
    if (!mtg_doc) return null;
    const row = mtg_doc.data() as MeetingRow;

    const agenda_snap = await getDocs(
      query(collection(db, 'taskzei_meeting_agenda_items'), where('meeting_id', '==', id), orderBy('sort_order', 'asc'))
    );
    const agendaItems = agenda_snap.docs.map((d) => {
      const a = d.data() as AgendaItemRow;
      return {
        id: a.id,
        meetingId: a.meeting_id,
        title: a.title,
        description: a.description || undefined,
        sortOrder: a.sort_order,
        durationMinutes: a.duration_minutes || undefined,
        status: a.status as MeetingAgendaItem['status'],
        createdAt: to_iso_string(a.created_at) || new Date().toISOString(),
        updatedAt: to_iso_string(a.updated_at) || new Date().toISOString(),
      } as MeetingAgendaItem;
    });

    const dec_snap = await getDocs(query(collection(db, 'taskzei_decisions'), where('meeting_id', '==', id)));
    const decisions = dec_snap.docs.map((d) => map_decision_row(d.data() as DecisionRow));

    return map_meeting_row(row, agendaItems, decisions);
  }

  async createMeeting(data: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meeting> {
    const ref = await addDoc(collection(db, 'taskzei_meetings'), {
      title: data.title,
      description: data.description || null,
      meeting_date: data.meetingDate || null,
      start_time: data.startTime || null,
      duration_minutes: data.durationMinutes || null,
      status: data.status || 'agendada',
      notes: data.notes || null,
    });
    const created = await this.getMeetingById(ref.id);
    if (!created) throw new Error('Meeting not found after creation');
    return created;
  }

  async updateMeeting(id: string, updates: Partial<Meeting>): Promise<Meeting> {
    const firestoreData: Record<string, unknown> = {};
    if (updates.title !== undefined) firestoreData.title = updates.title;
    if (updates.description !== undefined) firestoreData.description = updates.description || null;
    if (updates.meetingDate !== undefined) firestoreData.meeting_date = updates.meetingDate || null;
    if (updates.startTime !== undefined) firestoreData.start_time = updates.startTime || null;
    if (updates.durationMinutes !== undefined) firestoreData.duration_minutes = updates.durationMinutes;
    if (updates.status !== undefined) firestoreData.status = updates.status;
    if (updates.notes !== undefined) firestoreData.notes = updates.notes || null;

    await updateDoc(doc(db, 'taskzei_meetings', id), firestoreData);
    const updated = await this.getMeetingById(id);
    if (!updated) throw new Error('Meeting not found after update');
    return updated;
  }

  async deleteMeeting(id: string): Promise<boolean> {
    await deleteDoc(doc(db, 'taskzei_meetings', id));
    return true;
  }

  // Agenda Items (Pautas)

  async addAgendaItem(
    meetingId: string,
    data: Omit<MeetingAgendaItem, 'id' | 'meetingId' | 'createdAt' | 'updatedAt'>
  ): Promise<MeetingAgendaItem> {
    const ref = await addDoc(collection(db, 'taskzei_meeting_agenda_items'), {
      meeting_id: meetingId,
      title: data.title,
      description: data.description || null,
      sort_order: data.sortOrder ?? 0,
      duration_minutes: data.durationMinutes || null,
      status: data.status || 'pendente',
    });
    return {
      id: ref.id,
      meetingId,
      title: data.title,
      description: data.description,
      sortOrder: data.sortOrder ?? 0,
      durationMinutes: data.durationMinutes,
      status: data.status || 'pendente',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async updateAgendaItem(id: string, updates: Partial<MeetingAgendaItem>): Promise<MeetingAgendaItem> {
    const firestoreData: Record<string, unknown> = {};
    if (updates.title !== undefined) firestoreData.title = updates.title;
    if (updates.description !== undefined) firestoreData.description = updates.description || null;
    if (updates.sortOrder !== undefined) firestoreData.sort_order = updates.sortOrder;
    if (updates.durationMinutes !== undefined) firestoreData.duration_minutes = updates.durationMinutes;
    if (updates.status !== undefined) firestoreData.status = updates.status;

    await updateDoc(doc(db, 'taskzei_meeting_agenda_items', id), firestoreData);

    // Fetch updated item
    const snap = await getDocs(query(collection(db, 'taskzei_meeting_agenda_items'), where('id', '==', id)));
    const doc_data = snap.docs[0]?.data() as AgendaItemRow | undefined;
    if (!doc_data) throw new Error('Agenda item not found after update');
    return {
      id: doc_data.id,
      meetingId: doc_data.meeting_id,
      title: doc_data.title,
      description: doc_data.description || undefined,
      sortOrder: doc_data.sort_order,
      durationMinutes: doc_data.duration_minutes || undefined,
      status: doc_data.status as MeetingAgendaItem['status'],
      createdAt: to_iso_string(doc_data.created_at) || new Date().toISOString(),
      updatedAt: to_iso_string(doc_data.updated_at) || new Date().toISOString(),
    };
  }

  async removeAgendaItem(id: string): Promise<boolean> {
    await deleteDoc(doc(db, 'taskzei_meeting_agenda_items', id));
    return true;
  }

  async reorderAgendaItems(meetingId: string, orderedIds: string[]): Promise<MeetingAgendaItem[]> {
    const results: MeetingAgendaItem[] = [];
    for (let i = 0; i < orderedIds.length; i++) {
      await updateDoc(doc(db, 'taskzei_meeting_agenda_items', orderedIds[i]), { sort_order: i });
      results.push({
        id: orderedIds[i],
        meetingId,
        title: '',
        sortOrder: i,
        status: 'pendente',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    // Re-fetch to get full data
    return this.getMeetingById(meetingId).then(m => m?.agendaItems || []);
  }

  // Decisions

  async addDecision(data: Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>): Promise<Decision> {
    const ref = await addDoc(collection(db, 'taskzei_decisions'), {
      meeting_id: data.meetingId || null,
      agenda_item_id: data.agendaItemId || null,
      title: data.title,
      description: data.description || null,
      responsible: data.responsible || null,
      deadline: data.deadline || null,
      status: data.status || 'aberta',
      related_task_id: data.relatedTaskId || null,
    });
    return {
      id: ref.id,
      meetingId: data.meetingId,
      agendaItemId: data.agendaItemId,
      title: data.title,
      description: data.description,
      responsible: data.responsible,
      deadline: data.deadline,
      status: data.status || 'aberta',
      relatedTaskId: data.relatedTaskId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async updateDecision(id: string, updates: Partial<Decision>): Promise<Decision> {
    const firestoreData: Record<string, unknown> = {};
    if (updates.title !== undefined) firestoreData.title = updates.title;
    if (updates.description !== undefined) firestoreData.description = updates.description || null;
    if (updates.responsible !== undefined) firestoreData.responsible = updates.responsible || null;
    if (updates.deadline !== undefined) firestoreData.deadline = updates.deadline || null;
    if (updates.status !== undefined) firestoreData.status = updates.status;
    if (updates.relatedTaskId !== undefined) firestoreData.related_task_id = updates.relatedTaskId || null;

    await updateDoc(doc(db, 'taskzei_decisions', id), firestoreData);

    const snap = await getDocs(query(collection(db, 'taskzei_decisions'), where('id', '==', id)));
    const doc_data = snap.docs[0]?.data() as DecisionRow | undefined;
    if (!doc_data) throw new Error('Decision not found after update');
    return map_decision_row(doc_data);
  }

  async removeDecision(id: string): Promise<boolean> {
    await deleteDoc(doc(db, 'taskzei_decisions', id));
    return true;
  }

  // ============ INBOX (F6) ============

  async getInboxItems(): Promise<InboxItem[]> {
    const snap = await getDocs(query(collection(db, 'taskzei_inbox_items'), orderBy('created_at', 'desc')));
    return snap.docs.map((d) => {
      const row = d.data() as InboxRow;
      return {
        id: row.id,
        content: row.content,
        source: row.source as InboxItem['source'],
        status: row.status as InboxItem['status'],
        suggestedType: (row.suggested_type as InboxItem['suggestedType']) || undefined,
        confidence: row.confidence || undefined,
        convertedToId: row.converted_to_id || undefined,
        convertedToType: (row.converted_to_type as InboxItem['convertedToType']) || undefined,
        createdAt: to_iso_string(row.created_at) || new Date().toISOString(),
        updatedAt: to_iso_string(row.updated_at) || new Date().toISOString(),
      } as InboxItem;
    });
  }

  async addToInbox(data: Omit<InboxItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InboxItem> {
    const ref = await addDoc(collection(db, 'taskzei_inbox_items'), {
      content: data.content,
      source: data.source,
      status: data.status || 'pending',
      suggested_type: data.suggestedType || null,
      confidence: data.confidence ?? null,
    });
    return {
      id: ref.id,
      content: data.content,
      source: data.source,
      status: data.status || 'pending',
      suggestedType: data.suggestedType,
      confidence: data.confidence,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async classifyInboxItem(id: string, suggestedType: InboxItem['suggestedType'], confidence: number): Promise<InboxItem> {
    await updateDoc(doc(db, 'taskzei_inbox_items', id), {
      status: 'classified',
      suggested_type: suggestedType,
      confidence,
    });
    const snap = await getDocs(query(collection(db, 'taskzei_inbox_items'), where('id', '==', id)));
    const row = snap.docs[0]?.data() as InboxRow | undefined;
    if (!row) throw new Error('Inbox item not found');
    return {
      id: row.id,
      content: row.content,
      source: row.source as InboxItem['source'],
      status: row.status as InboxItem['status'],
      suggestedType: (row.suggested_type as InboxItem['suggestedType']) || undefined,
      confidence: row.confidence || undefined,
      createdAt: to_iso_string(row.created_at) || new Date().toISOString(),
      updatedAt: to_iso_string(row.updated_at) || new Date().toISOString(),
    } as InboxItem;
  }

  async dismissInboxItem(id: string): Promise<InboxItem> {
    await updateDoc(doc(db, 'taskzei_inbox_items', id), { status: 'dismissed' });
    const snap = await getDocs(query(collection(db, 'taskzei_inbox_items'), where('id', '==', id)));
    const row = snap.docs[0]?.data() as InboxRow | undefined;
    if (!row) throw new Error('Inbox item not found');
    return {
      id: row.id,
      content: row.content,
      source: row.source as InboxItem['source'],
      status: row.status as InboxItem['status'],
      suggestedType: (row.suggested_type as InboxItem['suggestedType']) || undefined,
      confidence: row.confidence || undefined,
      convertedToId: row.converted_to_id || undefined,
      convertedToType: (row.converted_to_type as InboxItem['convertedToType']) || undefined,
      createdAt: to_iso_string(row.created_at) || new Date().toISOString(),
      updatedAt: to_iso_string(row.updated_at) || new Date().toISOString(),
    } as InboxItem;
  }

  async convertInboxToEntity(
    inboxId: string,
    entityType: NonNullable<InboxItem['convertedToType']>,
    entityId: string
  ): Promise<InboxItem> {
    await updateDoc(doc(db, 'taskzei_inbox_items', inboxId), {
      status: 'converted',
      converted_to_type: entityType,
      converted_to_id: entityId,
    });
    const snap = await getDocs(query(collection(db, 'taskzei_inbox_items'), where('id', '==', inboxId)));
    const row = snap.docs[0]?.data() as InboxRow | undefined;
    if (!row) throw new Error('Inbox item not found');
    return {
      id: row.id,
      content: row.content,
      source: row.source as InboxItem['source'],
      status: row.status as InboxItem['status'],
      suggestedType: (row.suggested_type as InboxItem['suggestedType']) || undefined,
      confidence: row.confidence || undefined,
      convertedToId: row.converted_to_id || undefined,
      convertedToType: (row.converted_to_type as InboxItem['convertedToType']) || undefined,
      createdAt: to_iso_string(row.created_at) || new Date().toISOString(),
      updatedAt: to_iso_string(row.updated_at) || new Date().toISOString(),
    } as InboxItem;
  }

  // ============ CUSTOM FIELDS (ET D21) ============

  async getCustomFieldDefinitions(): Promise<CustomFieldDefinition[]> {
    const snap = await getDocs(query(collection(db, 'taskzei_custom_field_definitions'), orderBy('sort_order', 'asc')));
    return snap.docs.map((d) => map_cf_definition_row(d.data() as CustomFieldDefinitionRow));
  }

  async createCustomFieldDefinition(input: CustomFieldDefinitionInput): Promise<CustomFieldDefinition> {
    const ref = await addDoc(collection(db, 'taskzei_custom_field_definitions'), {
      workspace_id: 'default',
      name: input.name,
      type: input.type,
      config: input.config || [],
      sort_order: input.sortOrder ?? 0,
      is_active: true,
    });
    const snap = await getDocs(query(collection(db, 'taskzei_custom_field_definitions'), where('id', '==', ref.id)));
    const row = snap.docs[0]?.data() as CustomFieldDefinitionRow | undefined;
    if (!row) throw new Error('Custom field definition not found after creation');
    return map_cf_definition_row(row);
  }

  async updateCustomFieldDefinition(
    id: string,
    updates: Partial<CustomFieldDefinitionInput>
  ): Promise<CustomFieldDefinition> {
    const firestoreData: Record<string, unknown> = {};
    if (updates.name !== undefined) firestoreData.name = updates.name;
    if (updates.type !== undefined) firestoreData.type = updates.type;
    if (updates.config !== undefined) firestoreData.config = updates.config;
    if (updates.sortOrder !== undefined) firestoreData.sort_order = updates.sortOrder;

    await updateDoc(doc(db, 'taskzei_custom_field_definitions', id), firestoreData);
    const snap = await getDocs(query(collection(db, 'taskzei_custom_field_definitions'), where('id', '==', id)));
    const row = snap.docs[0]?.data() as CustomFieldDefinitionRow | undefined;
    if (!row) throw new Error('Custom field definition not found after update');
    return map_cf_definition_row(row);
  }

  async deleteCustomFieldDefinition(id: string): Promise<boolean> {
    await deleteDoc(doc(db, 'taskzei_custom_field_definitions', id));
    return true;
  }

  // ─── Custom Values (EAV) ────────────────────────────────────

  async getTaskCustomValues(taskId: string): Promise<CustomFieldValue[]> {
    const snap = await getDocs(
      query(collection(db, 'taskzei_task_custom_values'), where('task_id', '==', taskId))
    );
    return snap.docs.map((d) => {
      const row = d.data() as TaskCustomValueRow;
      return {
        taskId: row.task_id,
        fieldId: row.field_id,
        value: extractCustomValue(row.value),
        updatedAt: to_iso_string(row.updated_at) || new Date().toISOString(),
      };
    });
  }

  async setTaskCustomValue(taskId: string, fieldId: string, value: string | number | null): Promise<CustomFieldValue> {
    const compositeId = `${taskId}_${fieldId}`;
    await setDoc(doc(db, 'taskzei_task_custom_values', compositeId), {
      task_id: taskId,
      field_id: fieldId,
      value: value ?? null,
    });
    return {
      taskId,
      fieldId,
      value,
      updatedAt: new Date().toISOString(),
    };
  }

  async deleteTaskCustomValue(taskId: string, fieldId: string): Promise<boolean> {
    const compositeId = `${taskId}_${fieldId}`;
    await deleteDoc(doc(db, 'taskzei_task_custom_values', compositeId));
    return true;
  }

  // ============ ATTACHMENTS (ET D21) ============

  async getTaskAttachments(taskId: string): Promise<TaskAttachment[]> {
    const snap = await getDocs(
      query(collection(db, 'taskzei_task_attachments'), where('task_id', '==', taskId), orderBy('created_at', 'asc'))
    );
    return snap.docs.map((d) => {
      const row = d.data() as TaskAttachmentRow;
      return {
        id: row.id,
        taskId: row.task_id,
        fileName: row.file_name,
        fileSize: row.file_size,
        mimeType: row.mime_type,
        storageKey: row.storage_key,
        createdBy: row.created_by || undefined,
        createdAt: to_iso_string(row.created_at) || new Date().toISOString(),
      };
    });
  }

  async addTaskAttachment(taskId: string, file: File): Promise<TaskAttachment> {
    // 1. Gera path de storage no bucket cid-assets (mesmo padrão do CID)
    const safeName = file.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
    const storagePath = `taskzei/task-attachments/${taskId}/${Date.now()}-${safeName}`;

    // 2. Upload físico para o bucket cid-assets
    await uploadBlobToSupabaseStorage({
      bucket: 'cid-assets',
      path: storagePath,
      blob: file,
      mimeType: file.type || 'application/octet-stream',
    });

    // 3. Cria o registro em taskzei_task_attachments
    const ref = await addDoc(collection(db, 'taskzei_task_attachments'), {
      task_id: taskId,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type || 'application/octet-stream',
      storage_key: storagePath,
    });
    return {
      id: ref.id,
      taskId,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || 'application/octet-stream',
      storageKey: storagePath,
      createdAt: new Date().toISOString(),
    };
  }

  // ============ AUDIT (F10) ============

  async auditLog(
    action: string,
    entityType: string,
    entityId: string,
    userId?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await addDoc(collection(db, 'taskzei_audit_log'), {
      action,
      entity_type: entityType,
      entity_id: entityId,
      user_id: userId || null,
      metadata: metadata || {},
    });
  }
}
