import { ITaskzeiRepository } from '../types/taskzei.contracts';
import { TaskzeiTask, TaskChecklistItem, TaskComment } from '../types/task.types';
import { TaskOrigin } from '../types/origin.types';
import { Meeting, MeetingAgendaItem, Decision } from '../types/meeting.types';
import { InboxItem } from '../types/inbox.types';

export class MockTaskzeiProvider implements ITaskzeiRepository {
  // ─── In-Memory Data ────────────────────────────────────────
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
      description: 'Revisar a documentação do Supabase e preparar os schemas para a próxima etapa onde os dados reais entrarão em cena.',
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

  private meetings: Meeting[] = [
    {
      id: 'mtg-1',
      title: 'Sprint Planning — TaskZei',
      description: 'Planejamento da sprint corrente.',
      meetingDate: '2026-05-04',
      startTime: '09:00',
      durationMinutes: 60,
      status: 'concluida',
      notes: 'Sprint planejada com 5 tarefas.',
      agendaItems: [
        { id: 'ai-1', meetingId: 'mtg-1', title: 'Revisão do backlog', description: 'Verificar prioridades', sortOrder: 0, status: 'discutido', createdAt: '2026-05-04T08:00:00Z', updatedAt: '2026-05-04T09:00:00Z' },
        { id: 'ai-2', meetingId: 'mtg-1', title: 'Definição de metas', sortOrder: 1, status: 'discutido', createdAt: '2026-05-04T08:00:00Z', updatedAt: '2026-05-04T09:30:00Z' },
      ],
      decisions: [
        { id: 'dec-1', meetingId: 'mtg-1', title: 'Priorizar CRUD de tarefas', description: 'Foco total na FASE 4 antes de começar integrações.', status: 'concluida', createdAt: '2026-05-04T09:00:00Z', updatedAt: '2026-05-04T09:00:00Z' }
      ],
      createdAt: '2026-05-03T10:00:00Z',
      updatedAt: '2026-05-04T10:00:00Z'
    }
  ];

  private inboxItems: InboxItem[] = [
    {
      id: 'inbox-1',
      content: 'Criar relatório mensal de desempenho',
      source: 'manual',
      status: 'pending',
      createdAt: '2026-05-04T08:00:00Z',
      updatedAt: '2026-05-04T08:00:00Z'
    },
    {
      id: 'inbox-2',
      content: 'Reunião com fornecedores na quarta-feira',
      source: 'email',
      status: 'classified',
      suggestedType: 'meeting',
      confidence: 0.85,
      createdAt: '2026-05-03T14:00:00Z',
      updatedAt: '2026-05-03T14:05:00Z'
    }
  ];

  private auditLogs: Array<{ id: string; action: string; entityType: string; entityId: string; userId?: string; metadata?: any; createdAt: string }> = [];

  // ─── Tasks ─────────────────────────────────────────────────

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

  // ─── Checklist ─────────────────────────────────────────────

  async addChecklistItem(taskId: string, title: string): Promise<TaskChecklistItem> {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) throw new Error('Task not found');
    const item: TaskChecklistItem = { id: crypto.randomUUID(), title, completed: false };
    task.checklist = [...(task.checklist || []), item];
    task.updatedAt = new Date().toISOString();
    return { ...item };
  }

  async toggleChecklistItem(taskId: string, itemId: string): Promise<TaskChecklistItem> {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) throw new Error('Task not found');
    const item = (task.checklist || []).find(c => c.id === itemId);
    if (!item) throw new Error('Checklist item not found');
    item.completed = !item.completed;
    task.updatedAt = new Date().toISOString();
    return { ...item };
  }

  async removeChecklistItem(taskId: string, itemId: string): Promise<boolean> {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) throw new Error('Task not found');
    const initialLength = (task.checklist || []).length;
    task.checklist = (task.checklist || []).filter(c => c.id !== itemId);
    task.updatedAt = new Date().toISOString();
    return (task.checklist || []).length < initialLength;
  }

  // ─── Comments ──────────────────────────────────────────────

  async addComment(taskId: string, authorName: string, content: string): Promise<TaskComment> {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) throw new Error('Task not found');
    const comment: TaskComment = {
      id: crypto.randomUUID(),
      authorName,
      content,
      createdAt: new Date().toISOString()
    };
    task.comments = [comment, ...(task.comments || [])];
    task.updatedAt = new Date().toISOString();
    return { ...comment };
  }

  // ─── Duplicate & Archive ───────────────────────────────────

  async duplicateTask(id: string): Promise<TaskzeiTask> {
    const original = this.tasks.find(t => t.id === id);
    if (!original) throw new Error('Task not found');
    const now = new Date().toISOString();
    const copy: TaskzeiTask = {
      ...original,
      id: crypto.randomUUID(),
      title: `${original.title} (cópia)`,
      status: 'aberta',
      checklist: (original.checklist || []).map(c => ({ ...c, id: crypto.randomUUID(), completed: false })),
      comments: [],
      archived: false,
      createdAt: now,
      updatedAt: now
    };
    this.tasks.push(copy);
    return { ...copy };
  }

  async archiveTask(id: string): Promise<TaskzeiTask> {
    const task = this.tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');
    task.archived = true;
    task.updatedAt = new Date().toISOString();
    return { ...task };
  }

  // ─── Origin (F5) ───────────────────────────────────────────

  async createTaskFromOrigin(
    data: Omit<TaskzeiTask, 'id' | 'createdAt' | 'updatedAt'> & { origin: TaskOrigin }
  ): Promise<TaskzeiTask> {
    const newTask: TaskzeiTask = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  // ─── Meetings (F7) ─────────────────────────────────────────

  async getMeetings(): Promise<Meeting[]> {
    return [...this.meetings];
  }

  async getMeetingById(id: string): Promise<Meeting | null> {
    const meeting = this.meetings.find(m => m.id === id);
    return meeting ? { ...meeting } : null;
  }

  async createMeeting(data: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meeting> {
    const now = new Date().toISOString();
    const meeting: Meeting = {
      ...data,
      id: crypto.randomUUID(),
      agendaItems: [],
      decisions: [],
      createdAt: now,
      updatedAt: now
    };
    this.meetings.push(meeting);
    return { ...meeting };
  }

  async updateMeeting(id: string, updates: Partial<Meeting>): Promise<Meeting> {
    const index = this.meetings.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Meeting not found');
    this.meetings[index] = {
      ...this.meetings[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return { ...this.meetings[index] };
  }

  async deleteMeeting(id: string): Promise<boolean> {
    const initialLength = this.meetings.length;
    this.meetings = this.meetings.filter(m => m.id !== id);
    return this.meetings.length < initialLength;
  }

  // Agenda Items (Pautas)

  async addAgendaItem(
    meetingId: string,
    data: Omit<MeetingAgendaItem, 'id' | 'meetingId' | 'createdAt' | 'updatedAt'>
  ): Promise<MeetingAgendaItem> {
    const meeting = this.meetings.find(m => m.id === meetingId);
    if (!meeting) throw new Error('Meeting not found');
    const now = new Date().toISOString();
    const item: MeetingAgendaItem = {
      ...data,
      id: crypto.randomUUID(),
      meetingId,
      createdAt: now,
      updatedAt: now
    };
    meeting.agendaItems = [...(meeting.agendaItems || []), item];
    meeting.updatedAt = now;
    return { ...item };
  }

  async updateAgendaItem(id: string, updates: Partial<MeetingAgendaItem>): Promise<MeetingAgendaItem> {
    for (const meeting of this.meetings) {
      const index = (meeting.agendaItems || []).findIndex(a => a.id === id);
      if (index !== -1) {
        meeting.agendaItems![index] = { ...meeting.agendaItems![index], ...updates, updatedAt: new Date().toISOString() };
        meeting.updatedAt = new Date().toISOString();
        return { ...meeting.agendaItems![index] };
      }
    }
    throw new Error('Agenda item not found');
  }

  async removeAgendaItem(id: string): Promise<boolean> {
    for (const meeting of this.meetings) {
      const initialLength = (meeting.agendaItems || []).length;
      meeting.agendaItems = (meeting.agendaItems || []).filter(a => a.id !== id);
      if (meeting.agendaItems.length < initialLength) {
        meeting.updatedAt = new Date().toISOString();
        return true;
      }
    }
    return false;
  }

  async reorderAgendaItems(meetingId: string, orderedIds: string[]): Promise<MeetingAgendaItem[]> {
    const meeting = this.meetings.find(m => m.id === meetingId);
    if (!meeting) throw new Error('Meeting not found');
    const items = meeting.agendaItems || [];
    const reordered = orderedIds
      .map((id, idx) => {
        const item = items.find(a => a.id === id);
        if (item) return { ...item, sortOrder: idx, updatedAt: new Date().toISOString() };
        return null;
      })
      .filter(Boolean) as MeetingAgendaItem[];
    meeting.agendaItems = reordered;
    meeting.updatedAt = new Date().toISOString();
    return [...reordered];
  }

  // Decisions

  async addDecision(data: Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>): Promise<Decision> {
    const now = new Date().toISOString();
    const decision: Decision = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    if (data.meetingId) {
      const meeting = this.meetings.find(m => m.id === data.meetingId);
      if (meeting) {
        meeting.decisions = [...(meeting.decisions || []), decision];
        meeting.updatedAt = now;
      }
    }
    return { ...decision };
  }

  async updateDecision(id: string, updates: Partial<Decision>): Promise<Decision> {
    for (const meeting of this.meetings) {
      const index = (meeting.decisions || []).findIndex(d => d.id === id);
      if (index !== -1) {
        meeting.decisions![index] = { ...meeting.decisions![index], ...updates, updatedAt: new Date().toISOString() };
        meeting.updatedAt = new Date().toISOString();
        return { ...meeting.decisions![index] };
      }
    }
    throw new Error('Decision not found');
  }

  async removeDecision(id: string): Promise<boolean> {
    for (const meeting of this.meetings) {
      const initialLength = (meeting.decisions || []).length;
      meeting.decisions = (meeting.decisions || []).filter(d => d.id !== id);
      if (meeting.decisions.length < initialLength) {
        meeting.updatedAt = new Date().toISOString();
        return true;
      }
    }
    return false;
  }

  // ─── Inbox (F6) ────────────────────────────────────────────

  async getInboxItems(): Promise<InboxItem[]> {
    return [...this.inboxItems];
  }

  async addToInbox(data: Omit<InboxItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InboxItem> {
    const now = new Date().toISOString();
    const item: InboxItem = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    this.inboxItems.push(item);
    return { ...item };
  }

  async classifyInboxItem(id: string, suggestedType: InboxItem['suggestedType'], confidence: number): Promise<InboxItem> {
    const index = this.inboxItems.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Inbox item not found');
    this.inboxItems[index] = {
      ...this.inboxItems[index],
      status: 'classified',
      suggestedType,
      confidence,
      updatedAt: new Date().toISOString()
    };
    return { ...this.inboxItems[index] };
  }

  async dismissInboxItem(id: string): Promise<InboxItem> {
    const index = this.inboxItems.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Inbox item not found');
    this.inboxItems[index] = {
      ...this.inboxItems[index],
      status: 'dismissed',
      updatedAt: new Date().toISOString()
    };
    return { ...this.inboxItems[index] };
  }

  async convertInboxToEntity(
    inboxId: string,
    entityType: NonNullable<InboxItem['convertedToType']>,
    entityId: string
  ): Promise<InboxItem> {
    const index = this.inboxItems.findIndex(i => i.id === inboxId);
    if (index === -1) throw new Error('Inbox item not found');
    this.inboxItems[index] = {
      ...this.inboxItems[index],
      status: 'converted',
      convertedToType: entityType,
      convertedToId: entityId,
      updatedAt: new Date().toISOString()
    };
    return { ...this.inboxItems[index] };
  }

  // ─── Audit (F10) ───────────────────────────────────────────

  async auditLog(
    action: string,
    entityType: string,
    entityId: string,
    userId?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    this.auditLogs.push({
      id: crypto.randomUUID(),
      action,
      entityType,
      entityId,
      userId,
      metadata,
      createdAt: new Date().toISOString()
    });
    console.log(`[Audit] ${action} | ${entityType}(${entityId})`, metadata || '');
  }
}
