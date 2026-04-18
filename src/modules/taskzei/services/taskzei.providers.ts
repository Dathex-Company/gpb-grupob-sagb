import { ITaskzeiRepository } from '../types/taskzei.contracts';
import { TaskzeiTask } from '../types/task.types';

// Mock Provider for early stages. Can be replaced by SupabaseProvider later.
export class MockTaskzeiProvider implements ITaskzeiRepository {
  private tasks: TaskzeiTask[] = [
    {
      id: 'mock-1',
      title: 'Estruturar layout do SagB',
      description: 'Definir o layout principal com menu lateral retrátil e área de conteúdo fluida. Incluir transições suaves.',
      status: 'concluida',
      priority: 'alta',
      assigneeName: 'Dani Freitas',
      dueDate: '2026-04-05',
      checklist: [
        { id: 'c1', title: 'Criar Sidebar', completed: true },
        { id: 'c2', title: 'Configurar rotas base', completed: true }
      ],
      comments: [
        { id: 'com1', authorName: 'Cássio', content: 'Layout aprovado e integrado.', createdAt: '2026-04-05T10:00:00Z' }
      ],
      createdAt: '2026-04-01T08:00:00Z',
      updatedAt: '2026-04-05T10:00:00Z'
    },
    {
      id: 'mock-2',
      title: 'Implementar área de Tarefas (TaskZei)',
      description: 'Criar a listagem funcional e o drawer lateral para visualização detalhada de cada tarefa. Usar dados mockados por enquanto.',
      status: 'em_andamento',
      priority: 'alta',
      assigneeName: 'Cássio',
      dueDate: '2026-04-08',
      checklist: [
        { id: 'c3', title: 'Atualizar Tipagem', completed: true },
        { id: 'c4', title: 'Criar TaskList', completed: false },
        { id: 'c5', title: 'Criar TaskDrawer', completed: false }
      ],
      comments: [
        { id: 'com2', authorName: 'Dani Freitas', content: 'Mantenha o design limpo e inspirado no ClickUp, mas mais direto.', createdAt: '2026-04-07T09:00:00Z' }
      ],
      createdAt: '2026-04-06T14:00:00Z',
      updatedAt: '2026-04-07T09:30:00Z'
    },
    {
      id: 'mock-3',
      title: 'Validar integração Supabase v2',
      description: 'Revisar a documentação do Supabase e preparar os schemas para a próxima etapa (ET 04) onde os dados reais entrarão em cena.',
      status: 'aberta',
      priority: 'media',
      assigneeName: 'Cássio',
      checklist: [
        { id: 'c6', title: 'Criar migrations mockadas', completed: false },
        { id: 'c7', title: 'Mapear relacional das tasks', completed: false }
      ],
      comments: [],
      createdAt: '2026-04-07T11:00:00Z',
      updatedAt: '2026-04-07T11:00:00Z'
    }
  ];

  async getTasks(): Promise<TaskzeiTask[]> {
    return [...this.tasks];
  }

  async getTaskById(id: string): Promise<TaskzeiTask | null> {
    const task = this.tasks.find(t => t.id === id);
    return task ? { ...task } : null;
  }

  async createTask(taskData: Omit<TaskzeiTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<TaskzeiTask> {
    const newTask: TaskzeiTask = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async updateTask(id: string, updates: Partial<TaskzeiTask>): Promise<TaskzeiTask> {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    this.tasks[index] = {
      ...this.tasks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return { ...this.tasks[index] };
  }

  async deleteTask(id: string): Promise<boolean> {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);
    return this.tasks.length < initialLength;
  }
}
