import { create } from 'zustand';
import { TaskzeiTask } from '../types/task.types';

interface TaskzeiState {
  tasks: TaskzeiTask[];
  isLoading: boolean;
  error: string | null;
  setTasks: (tasks: TaskzeiTask[]) => void;
  addTask: (task: TaskzeiTask) => void;
  updateTask: (id: string, updates: Partial<TaskzeiTask>) => void;
  removeTask: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTaskzeiStore = create<TaskzeiState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
  })),
  removeTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id),
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
