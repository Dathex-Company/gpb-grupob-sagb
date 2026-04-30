// src/modules/taskzei/services/taskzei_due_reminder.service.ts
// Serviço para rotina de lembrete de vencimento de tarefas TaskZei
// Execução agendada (cron) ou manual, com proteção contra reenvio indevido

import { TaskzeiTask } from '../types/task.types';
import { taskzeiNotificationService } from './taskzei_notification.service';

export interface DueReminderWindow {
  label: string;
  daysBefore: number;
  windowKey: string; // usado para deduplicação
}

export const DEFAULT_REMINDER_WINDOWS: DueReminderWindow[] = [
  { label: '7 dias antes', daysBefore: 7, windowKey: '7d' },
  { label: '3 dias antes', daysBefore: 3, windowKey: '3d' },
  { label: '1 dia antes', daysBefore: 1, windowKey: '1d' },
  { label: 'No dia', daysBefore: 0, windowKey: '0d' },
];

export interface DueReminderCandidate {
  task: TaskzeiTask;
  assigneeId?: string | null;
  dueInDays: number;
  window: DueReminderWindow;
  dueInDaysLabel: string;
}

export class TaskzeiDueReminderService {
  // Verifica tarefas elegíveis para lembrete dentro de uma janela específica
  static getCandidatesForWindow(
    tasks: TaskzeiTask[],
    window: DueReminderWindow,
    today: Date = new Date()
  ): DueReminderCandidate[] {
    const candidates: DueReminderCandidate[] = [];

    for (const task of tasks) {
      // Ignorar tarefas sem data de vencimento
      if (!task.dueDate) continue;

      const dueDate = new Date(task.dueDate);
      const dueInDays = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Verificar se a tarefa está dentro da janela (ex: 3 dias antes ± tolerância de 1 dia)
      const tolerance = 1; // dia de tolerância para evitar falhas por diferenças de hora
      if (
        dueInDays >= window.daysBefore - tolerance &&
        dueInDays <= window.daysBefore + tolerance
      ) {
        // Ignorar tarefas já concluídas ou canceladas
        if (task.status === 'concluida' || task.status === 'cancelada') continue;

        candidates.push({
          task,
          assigneeId: (task as any).assigneeId, // campo opcional, se existir
          dueInDays,
          window,
          dueInDaysLabel: this.formatDueInDaysLabel(dueInDays),
        });
      }
    }

    return candidates;
  }

  // Dispara lembretes para todas as janelas configuradas
  static async triggerDueReminders(
    tasks: TaskzeiTask[],
    windows: DueReminderWindow[] = DEFAULT_REMINDER_WINDOWS,
    workspaceId: string = 'default'
  ): Promise<{ sent: number; skipped: number; errors: any[] }> {
    const results = {
      sent: 0,
      skipped: 0,
      errors: [] as any[],
    };

    const today = new Date();

    for (const window of windows) {
      const candidates = this.getCandidatesForWindow(tasks, window, today);

      for (const candidate of candidates) {
        try {
          // Verificar se já foi enviado lembrete para esta tarefa nesta janela recentemente
          // (a deduplicação final é feita server‑side via hash, mas podemos otimizar)
          const shouldSkip = await this.shouldSkipReminder(candidate.task.id, window.windowKey);
          if (shouldSkip) {
            results.skipped++;
            continue;
          }

          const response = await taskzeiNotificationService.notifyDueReminder(
            candidate.task,
            candidate.assigneeId,
            candidate.dueInDaysLabel,
            workspaceId
          );

          if (response.success) {
            results.sent++;
            // Registrar localmente que enviamos (para otimização futura)
            await this.recordReminderSent(candidate.task.id, window.windowKey);
          } else {
            results.errors.push({
              taskId: candidate.task.id,
              window: window.windowKey,
              error: response.error,
            });
          }
        } catch (error) {
          results.errors.push({
            taskId: candidate.task.id,
            window: window.windowKey,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    }

    return results;
  }

  // Verificação simplificada de duplicação (poderia consultar a tabela de notificações)
  private static async shouldSkipReminder(taskId: string, windowKey: string): Promise<boolean> {
    // Em produção, consultar a tabela taskzei_notifications para ver se já houve
    // envio de due_reminder com a mesma janela nas últimas 23h.
    // Por enquanto, retornar false (não pular) e confiar na deduplicação server‑side.
    return false;
  }

  // Registro local de envio (para otimização)
  private static async recordReminderSent(taskId: string, windowKey: string): Promise<void> {
    // Em produção, poderíamos armazenar em localStorage ou em uma tabela de cache.
    // Por enquanto, apenas log.
    console.log(`[TaskzeiDueReminder] Lembrete enviado para tarefa ${taskId} na janela ${windowKey}`);
  }

  // Formatação amigável para "dueInDays"
  private static formatDueInDaysLabel(dueInDays: number): string {
    if (dueInDays > 0) {
      return `em ${dueInDays} dia${dueInDays > 1 ? 's' : ''}`;
    } else if (dueInDays === 0) {
      return 'hoje';
    } else {
      return `há ${Math.abs(dueInDays)} dia${Math.abs(dueInDays) > 1 ? 's' : ''}`;
    }
  }

  // Rotina agendada (simulação de cron) – pode ser chamada por um job server‑side
  static async runScheduledReminders(
    fetchTasks: () => Promise<TaskzeiTask[]>,
    workspaceId: string = 'default'
  ): Promise<{ sent: number; skipped: number; errors: any[] }> {
    console.log('[TaskzeiDueReminder] Executando rotina agendada de lembretes de vencimento');
    try {
      const tasks = await fetchTasks();
      return await this.triggerDueReminders(tasks, DEFAULT_REMINDER_WINDOWS, workspaceId);
    } catch (error) {
      console.error('[TaskzeiDueReminder] Falha na rotina agendada:', error);
      return { sent: 0, skipped: 0, errors: [{ error: error instanceof Error ? error.message : 'Unknown' }] };
    }
  }
}

export const taskzeiDueReminderService = new TaskzeiDueReminderService();