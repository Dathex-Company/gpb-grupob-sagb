// src/modules/taskzei/services/taskzei_notification.service.ts
// Serviço front‑side para disparo de notificações TaskZei via função server‑side
// Integração com netlify/functions/taskzei‑send‑notification.mjs

import { TaskzeiTask, TaskzeiTaskInlineInput } from '../types/taskzei.contracts';

export type TaskzeiNotificationEvent =
  | 'task_created'
  | 'status_changed'
  | 'due_reminder';

export interface TaskzeiNotificationRequest {
  taskId: string;
  workspaceId: string;
  assigneeId?: string | null; // auth.users.id (se houver vínculo)
  eventType: TaskzeiNotificationEvent;
  eventSubtype?: string; // ex: 'status_changed:pendente->em_andamento'
  deduplicationWindow?: string; // janela de deduplicação (ex: '24h', 'default')
  templateKey?: string;
  variables?: Record<string, any>;
  scheduledFor?: string; // ISO string para envio agendado
  overrideEmail?: string; // override de e-mail para testes (testMode)
}

export interface TaskzeiNotificationResponse {
  success: boolean;
  notificationId?: string;
  message?: string;
  error?: string;
  details?: any;
}

export class TaskzeiNotificationService {
  private static readonly FUNCTION_ENDPOINT =
    import.meta.env.VITE_TASKZEI_NOTIFICATION_ENDPOINT ||
    '/.netlify/functions/taskzei-send-notification';

  private static async callServerFunction(
    payload: TaskzeiNotificationRequest
  ): Promise<TaskzeiNotificationResponse> {
    try {
      const response = await fetch(this.FUNCTION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('[TaskzeiNotificationService] Server function error:', data);
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
          details: data,
        };
      }

      return {
        success: true,
        notificationId: data.notificationId,
        message: data.message,
        details: data,
      };
    } catch (error) {
      console.error('[TaskzeiNotificationService] Network error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network failure',
      };
    }
  }

  private static async getAuthToken(): Promise<string> {
    // Em ambiente real, obter token do usuário autenticado
    // Por enquanto, retornar token vazio (a função server‑side usa service_role)
    return '';
  }

  // Disparo de notificação de criação de tarefa
  static async notifyTaskCreated(
    task: TaskzeiTask,
    assigneeId?: string | null,
    workspaceId: string = 'default'
  ): Promise<TaskzeiNotificationResponse> {
    const request: TaskzeiNotificationRequest = {
      taskId: task.id,
      workspaceId,
      assigneeId: assigneeId || null,
      eventType: 'task_created',
      templateKey: 'task_created',
      variables: {
        task_title: task.title,
        priority_label: this.mapPriorityLabel(task.priority),
        priority_color: this.mapPriorityColor(task.priority),
        status_label: this.mapStatusLabel(task.status),
        due_date_formatted: task.dueDate
          ? new Date(task.dueDate).toLocaleDateString('pt-BR')
          : 'Sem data definida',
        task_url: `${window.location.origin}/taskzei/tasks/${task.id}`,
      },
    };

    return this.callServerFunction(request);
  }

  // Disparo de notificação de mudança de status
  static async notifyStatusChanged(
    taskId: string,
    previousStatus: string,
    newStatus: string,
    assigneeId?: string | null,
    updatedBy: string = 'Sistema',
    workspaceId: string = 'default'
  ): Promise<TaskzeiNotificationResponse> {
    const request: TaskzeiNotificationRequest = {
      taskId,
      workspaceId,
      assigneeId: assigneeId || null,
      eventType: 'status_changed',
      eventSubtype: `status_changed:${previousStatus}->${newStatus}`,
      deduplicationWindow: '1h', // evitar múltiplos envios para mesma transição em curto período
      templateKey: 'status_changed',
      variables: {
        task_title: `Tarefa ${taskId.slice(0, 8)}`, // título será resolvido server‑side
        previous_status: this.mapStatusLabel(previousStatus),
        new_status: this.mapStatusLabel(newStatus),
        new_status_color: this.mapStatusColor(newStatus),
        updated_by: updatedBy,
        task_url: `${window.location.origin}/taskzei/tasks/${taskId}`,
      },
    };

    return this.callServerFunction(request);
  }

  // Disparo de notificação de lembrete de vencimento
  static async notifyDueReminder(
    task: TaskzeiTask,
    assigneeId?: string | null,
    dueInDays: string = 'hoje',
    workspaceId: string = 'default'
  ): Promise<TaskzeiNotificationResponse> {
    const request: TaskzeiNotificationRequest = {
      taskId: task.id,
      workspaceId,
      assigneeId: assigneeId || null,
      eventType: 'due_reminder',
      deduplicationWindow: '24h', // apenas um lembrete por dia por tarefa
      templateKey: 'due_reminder',
      variables: {
        task_title: task.title,
        priority_label: this.mapPriorityLabel(task.priority),
        status_label: this.mapStatusLabel(task.status),
        due_date_formatted: task.dueDate
          ? new Date(task.dueDate).toLocaleDateString('pt-BR')
          : 'Sem data definida',
        due_in_days: dueInDays,
        task_url: `${window.location.origin}/taskzei/tasks/${task.id}`,
      },
    };

    return this.callServerFunction(request);
  }

  // Disparo de notificação de teste (para UI NotificationTestPanel)
  static async sendTestNotification(
    eventType: TaskzeiNotificationEvent,
    overrideEmail?: string
  ): Promise<TaskzeiNotificationResponse> {
    const now = new Date().toISOString();
    const testTaskId = `test-${Date.now()}`;

    const request: TaskzeiNotificationRequest = {
      taskId: testTaskId,
      workspaceId: 'default',
      assigneeId: null,
      eventType,
      templateKey: eventType,
      variables: {
        task_title: '[TESTE] Notificação TaskZei',
        priority_label: 'Média',
        priority_color: '#f59e0b',
        status_label: 'Em andamento',
        due_date_formatted: new Date(Date.now() + 86400000).toLocaleDateString('pt-BR'),
        task_url: `${window.location.origin}/taskzei/tasks/${testTaskId}`,
        ...(eventType === 'status_changed' ? {
          previous_status: 'Pendente',
          new_status: 'Em andamento',
          new_status_color: '#f59e0b',
          updated_by: 'Painel de Testes'
        } : {}),
        ...(eventType === 'due_reminder' ? {
          due_in_days: '2 dias'
        } : {})
      },
      scheduledFor: now,
      deduplicationWindow: 'test',
    };

    // Envia para a função server-side que tratará o testMode
    return this.callServerFunction({
      ...request,
      taskId: testTaskId,
      overrideEmail: overrideEmail || undefined,
    } as TaskzeiNotificationRequest);
  }

  // Utilitários de mapeamento
  private static mapPriorityLabel(priority: string): string {
    switch (priority) {
      case 'alta': return 'Alta';
      case 'media': return 'Média';
      case 'baixa': return 'Baixa';
      default: return priority;
    }
  }

  private static mapPriorityColor(priority: string): string {
    switch (priority) {
      case 'alta': return '#C85E62';   // sagb-red
      case 'media': return '#D4953A';  // sagb-amber
      case 'baixa': return '#2FA99C';  // sagb-primary
      default: return '#8892A0';       // sagb-muted
    }
  }

  private static mapStatusLabel(status: string): string {
    switch (status) {
      case 'aberta': return 'Aberta';
      case 'em_andamento': return 'Em andamento';
      case 'pendente': return 'Pendente';
      case 'concluida': return 'Concluída';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  }

  private static mapStatusColor(status: string): string {
    switch (status) {
      case 'aberta': return '#5D86BC';   // sagb-blue
      case 'em_andamento': return '#D4953A';  // sagb-amber
      case 'pendente': return '#8892A0';      // sagb-muted
      case 'concluida': return '#2FA99C';     // sagb-primary
      case 'cancelada': return '#C85E62';     // sagb-red
      default: return '#8892A0';              // sagb-muted
    }
  }
}

export const taskzeiNotificationService = new TaskzeiNotificationService();