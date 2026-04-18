import { ITaskzeiService } from '../types/taskzei.contracts';
import { TaskzeiTask } from '../types/task.types';
import { TaskzeiAdapter } from './taskzei.adapters';
import { useTaskzeiStore } from '../store/taskzei.store';

export class TaskzeiFacade implements ITaskzeiService {
  private provider = TaskzeiAdapter.getProvider();

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
    const store = useTaskzeiStore.getState();
    try {
      const newTask = await this.provider.createTask({
        title,
        description,
        status: 'aberta',
        priority: 'media',
        assigneeName: 'Você',
        checklist: [],
        comments: []
      });
      store.addTask(newTask);
      return newTask;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Error adding task');
      throw error;
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
