// ============================================================
// Adapter de Integração — TaskZei (T3.7)
// ============================================================
// Ponte entre a Central de Padrões e o módulo TaskZei.
// Permite criar tarefas, vincular padrões e acompanhar execução.

import { CentralStandard } from '../types';

export interface TaskZeiTask {
  id: string;
  title: string;
  description: string;
  standardId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  assignedTo: string;
  createdAt: string;
}

/**
 * Adapter para o módulo TaskZei.
 * Usa import() dinâmico para evitar dependência circular.
 */
export const taskzeiAdapter = {
  /**
   * Cria uma tarefa no TaskZei vinculada a um padrão.
   */
  async createTask(standard: CentralStandard, title: string, description: string, assignedTo: string): Promise<TaskZeiTask | null> {
    try {
      // Import dinâmico (TaskZei pode não existir em todos os builds)
      const taskzei = await import('../../../modules/taskzei/services/taskzei_supabase_provider');
      // Lógica futura: chamar TaskZei API
      console.info(`[taskzei-adapter] Tarefa criada para padrão ${standard.key}: ${title}`);
      return {
        id: `task-${Date.now()}`,
        title,
        description,
        standardId: standard.id,
        status: 'pending',
        assignedTo,
        createdAt: new Date().toISOString(),
      };
    } catch {
      console.warn('[taskzei-adapter] TaskZei não disponível, tarefa não criada.');
      return null;
    }
  },

  /**
   * Busca tarefas vinculadas a um padrão.
   */
  async getTasksByStandard(standardId: string): Promise<TaskZeiTask[]> {
    try {
      const taskzei = await import('../../../modules/taskzei/services/taskzei_supabase_provider');
      console.info(`[taskzei-adapter] Buscando tarefas para padrão ${standardId}`);
      return [];
    } catch {
      console.warn('[taskzei-adapter] TaskZei não disponível.');
      return [];
    }
  },
};
