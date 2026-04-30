import { TaskzeiTask } from './task.types';

export interface TaskzeiTaskInlineInput {
  title: string;
  priority: TaskzeiTask['priority'];
  status: TaskzeiTask['status'];
  assigneeName?: string;
  dueDate?: string;
}

export interface ITaskzeiRepository {
  getTasks(): Promise<TaskzeiTask[]>;
  getTaskById(id: string): Promise<TaskzeiTask | null>;
  createTask(task: Omit<TaskzeiTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<TaskzeiTask>;
  updateTask(id: string, updates: Partial<TaskzeiTask>): Promise<TaskzeiTask>;
  deleteTask(id: string): Promise<boolean>;
}

export interface ITaskzeiService {
  loadTasks(): Promise<TaskzeiTask[]>;
  addNewTask(title: string, description?: string): Promise<TaskzeiTask>;
  createTask(input: TaskzeiTaskInlineInput): Promise<TaskzeiTask>;
  updateTask(id: string, updates: Partial<TaskzeiTaskInlineInput>): Promise<TaskzeiTask>;
  completeTask(id: string): Promise<TaskzeiTask>;
  updateTaskStatus(id: string, status: import('./task.types').TaskStatus): Promise<TaskzeiTask>;
}
