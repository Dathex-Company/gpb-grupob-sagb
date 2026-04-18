export type TaskStatus = 'aberta' | 'em_andamento' | 'concluida';
export type TaskPriority = 'baixa' | 'media' | 'alta';

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
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeName?: string;
  dueDate?: string;
  checklist?: TaskChecklistItem[];
  comments?: TaskComment[];
  createdAt: string;
  updatedAt: string;
}
