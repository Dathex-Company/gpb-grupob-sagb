import { TaskOrigin } from './origin.types';

export type TaskStatus = 'aberta' | 'em_andamento' | 'concluida';
export type TaskPriority = 'baixa' | 'media' | 'alta' | 'urgente';

export interface TaskChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface TaskzeiTask {
  id: string;
  parentTaskId?: string | null;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeName?: string;
  assigneeId?: string;
  internalDescription?: string;
  completedAt?: string;
  dueDate?: string;
  checklist?: TaskChecklistItem[];
  comments?: TaskComment[];
  archived?: boolean;
  origin?: TaskOrigin;
  relatedDocIds?: string[];
  depth?: number;
  hasChildren?: boolean;
  createdAt: string;
  updatedAt: string;
}
