import {
  addDoc,
  collection,
  db,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from '../../../../services/supabase';
import { ITaskzeiRepository } from '../types/taskzei.contracts';
import { TaskComment, TaskChecklistItem, TaskzeiTask } from '../types/task.types';

type TaskzeiTaskRow = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskzeiTask['status'];
  priority: TaskzeiTask['priority'];
  assignee_name?: string | null;
  due_date?: string | null;
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

const to_iso_string = (value?: unknown): string | undefined => {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as any).toDate === 'function') {
    const date = (value as any).toDate();
    return date instanceof Date && !Number.isNaN(date.getTime()) ? date.toISOString() : undefined;
  }
  const date = new Date(value);
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
  dueDate: to_iso_string(row.due_date),
  checklist,
  comments,
  createdAt: to_iso_string(row.created_at) || new Date().toISOString(),
  updatedAt: to_iso_string(row.updated_at) || new Date().toISOString(),
});

export class SupabaseTaskzeiProvider implements ITaskzeiRepository {
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
    await updateDoc(doc(db, 'taskzei_tasks', id), {
      ...(updates.title !== undefined ? { title: updates.title } : {}),
      ...(updates.description !== undefined ? { description: updates.description || null } : {}),
      ...(updates.status !== undefined ? { status: updates.status } : {}),
      ...(updates.priority !== undefined ? { priority: updates.priority } : {}),
      ...(updates.assigneeName !== undefined ? { assignee_name: updates.assigneeName || null } : {}),
      ...(updates.dueDate !== undefined ? { due_date: updates.dueDate || null } : {}),
    });

    const updated_task = await this.getTaskById(id);
    if (!updated_task) throw new Error('Task not found after update');
    return updated_task;
  }

  async deleteTask(id: string): Promise<boolean> {
    await deleteDoc(doc(db, 'taskzei_tasks', id));
    return true;
  }
}
