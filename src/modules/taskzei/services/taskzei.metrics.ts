import type { TaskzeiTask, TaskStatus, TaskPriority } from '../types/task.types';
import type { Meeting, Decision } from '../types/meeting.types';
import type { InboxItem } from '../types/inbox.types';

/**
 * Métricas de tarefas.
 */
export interface TaskMetrics {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
  completionRate: number; // 0–1
  averageCompletionDays: number;
  overdueCount: number;
  withChecklist: number;
  withComments: number;
}

/**
 * Métricas de reuniões.
 */
export interface MeetingMetrics {
  total: number;
  byStatus: Record<string, number>;
  averageDurationMinutes: number;
  totalDecisions: number;
  decisionsByStatus: Record<string, number>;
  averageAgendaItemsPerMeeting: number;
}

/**
 * Métricas de inbox.
 */
export interface InboxMetrics {
  total: number;
  bySource: Record<string, number>;
  byStatus: Record<string, number>;
  conversionRate: number; // 0–1
  averageClassificationConfidence: number;
}

/**
 * Métricas gerais do módulo.
 */
export interface OverallMetrics {
  tasks: TaskMetrics;
  meetings: MeetingMetrics;
  inbox: InboxMetrics;
  totalAuditEvents: number;
  lastUpdated: string;
}

/**
 * Serviço de cálculo de métricas para o módulo TaskZei.
 *
 * Opera exclusivamente em memória sobre os dados fornecidos,
 * sem depender de provider ou store específicos.
 */
export class MetricsService {
  /**
   * Calcula métricas de tarefas a partir de um array de tarefas.
   */
  computeTaskMetrics(tasks: TaskzeiTask[]): TaskMetrics {
    const byStatus: Record<string, number> = { aberta: 0, em_andamento: 0, concluida: 0 };
    const byPriority: Record<string, number> = { baixa: 0, media: 0, alta: 0, urgente: 0 };
    let completedCount = 0;
    let totalCompletionDays = 0;
    let overdueCount = 0;
    let withChecklist = 0;
    let withComments = 0;

    const now = new Date();

    for (const task of tasks) {
      // Contagem por status
      const status = task.status as TaskStatus;
      if (byStatus[status] !== undefined) byStatus[status]++;
      else byStatus[status] = 0;

      // Contagem por prioridade
      const priority = task.priority as TaskPriority;
      if (byPriority[priority] !== undefined) byPriority[priority]++;
      else byPriority[priority] = 0;

      // Checklist e comentários
      if (task.checklist && task.checklist.length > 0) withChecklist++;
      if (task.comments && task.comments.length > 0) withComments++;

      // Concluídas: calcula dias até conclusão
      if (task.status === 'concluida' && task.updatedAt && task.createdAt) {
        completedCount++;
        const created = new Date(task.createdAt).getTime();
        const updated = new Date(task.updatedAt).getTime();
        totalCompletionDays += (updated - created) / (1000 * 60 * 60 * 24);
      }

      // Atrasadas (ainda abertas/andamento e com dueDate passada)
      if ((task.status === 'aberta' || task.status === 'em_andamento') && task.dueDate) {
        const due = new Date(task.dueDate);
        if (due < now) overdueCount++;
      }
    }

    return {
      total: tasks.length,
      byStatus: byStatus as Record<TaskStatus, number>,
      byPriority: byPriority as Record<TaskPriority, number>,
      completionRate: tasks.length > 0 ? completedCount / tasks.length : 0,
      averageCompletionDays: completedCount > 0 ? totalCompletionDays / completedCount : 0,
      overdueCount,
      withChecklist,
      withComments,
    };
  }

  /**
   * Calcula métricas de reuniões a partir de um array de meetings (com decisions embarcadas).
   */
  computeMeetingMetrics(meetings: Meeting[]): MeetingMetrics {
    const byStatus: Record<string, number> = {};
    let totalDurationMinutes = 0;
    let meetingsWithDuration = 0;
    let totalDecisions = 0;
    const decisionsByStatus: Record<string, number> = {};
    let totalAgendaItems = 0;
    let meetingsWithAgenda = 0;

    for (const meeting of meetings) {
      // Status
      byStatus[meeting.status] = (byStatus[meeting.status] || 0) + 1;

      // Duração
      if (meeting.durationMinutes) {
        totalDurationMinutes += meeting.durationMinutes;
        meetingsWithDuration++;
      }

      // Decisões
      const decisions = meeting.decisions || [];
      totalDecisions += decisions.length;
      for (const decision of decisions) {
        decisionsByStatus[decision.status] = (decisionsByStatus[decision.status] || 0) + 1;
      }

      // Itens de pauta
      const agendaItems = meeting.agendaItems || [];
      if (agendaItems.length > 0) {
        totalAgendaItems += agendaItems.length;
        meetingsWithAgenda++;
      }
    }

    return {
      total: meetings.length,
      byStatus,
      averageDurationMinutes: meetingsWithDuration > 0 ? totalDurationMinutes / meetingsWithDuration : 0,
      totalDecisions,
      decisionsByStatus,
      averageAgendaItemsPerMeeting: meetingsWithAgenda > 0 ? totalAgendaItems / meetingsWithAgenda : 0,
    };
  }

  /**
   * Calcula métricas de inbox a partir de um array de inbox items.
   */
  computeInboxMetrics(items: InboxItem[]): InboxMetrics {
    const bySource: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    let convertedCount = 0;
    let totalConfidence = 0;
    let classifiedCount = 0;

    for (const item of items) {
      bySource[item.source] = (bySource[item.source] || 0) + 1;
      byStatus[item.status] = (byStatus[item.status] || 0) + 1;

      if (item.status === 'converted') convertedCount++;
      if (item.confidence !== undefined && item.confidence !== null) {
        totalConfidence += item.confidence;
        classifiedCount++;
      }
    }

    return {
      total: items.length,
      bySource,
      byStatus,
      conversionRate: items.length > 0 ? convertedCount / items.length : 0,
      averageClassificationConfidence: classifiedCount > 0 ? totalConfidence / classifiedCount : 0,
    };
  }

  /**
   * Calcula métricas gerais combinadas.
   */
  computeOverall(
    tasks: TaskzeiTask[],
    meetings: Meeting[],
    inboxItems: InboxItem[],
    totalAuditEvents: number = 0
  ): OverallMetrics {
    return {
      tasks: this.computeTaskMetrics(tasks),
      meetings: this.computeMeetingMetrics(meetings),
      inbox: this.computeInboxMetrics(inboxItems),
      totalAuditEvents,
      lastUpdated: new Date().toISOString(),
    };
  }
}

/** Singleton do serviço de métricas */
export const metricsService = new MetricsService();
