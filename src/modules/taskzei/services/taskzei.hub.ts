import type { TaskzeiTask } from '../types/task.types';
import type { Meeting } from '../types/meeting.types';
import type { InboxItem } from '../types/inbox.types';

/**
 * Tipo de entidade que pode ser publicada no hub.
 */
export type HubEntityType = 'task' | 'meeting' | 'decision' | 'inbox';

/**
 * Payload padrao para publicacao no hub de integracoes.
 */
export interface HubPublication {
  entityType: HubEntityType;
  entityId: string;
  action: 'created' | 'updated' | 'deleted' | 'completed' | 'archived';
  title: string;
  summary: string;
  metadata: Record<string, unknown>;
  source: 'taskzei';
  timestamp: string;
}

/**
 * Status de uma publicacao no hub.
 */
export interface HubPublicationResult {
  success: boolean;
  publicationId?: string;
  error?: string;
}

/**
 * Servico de integracao do modulo TaskZei com o Hub de Integracoes do SagB.
 *
 * Toda publicacao externa (ClickUp, WhatsApp, e-mail) deve passar por este servico,
 * que por sua vez delega ao hub-integracao. Nenhuma conexao direta com servicos
 * externos deve ser feita sem passar por este fluxo, conforme decisao_013.
 *
 * ATENCAO: Este servico e um placeholder de integracao. O hub-integracao
 * ainda nao esta implementado no core do SagB. Quando estiver, basta
 * substituir as chamadas `console.log` por chamadas reais ao hub.
 */
export class HubIntegrationService {
  private readonly source = 'taskzei' as const;

  /**
   * Publica uma entidade no hub de integracoes.
   * Atualmente loga no console; quando o hub-integracao estiver pronto,
   * esta funcao fara a chamada HTTP/evento real.
   */
  async publish(publication: HubPublication): Promise<HubPublicationResult> {
    try {
      // TODO: Substituir por chamada real ao hub-integracao quando disponivel
      // Exemplo: await hubClient.publish('/api/hub/events', publication);
      console.log('[HubIntegration] Publicando no hub:', {
        entityType: publication.entityType,
        entityId: publication.entityId,
        action: publication.action,
        title: publication.title,
      });

      // Simula sucesso com ID gerado
      return {
        success: true,
        publicationId: `pub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('[HubIntegration] Erro ao publicar:', errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Publica uma tarefa criada.
   */
  async publishTaskCreated(task: TaskzeiTask): Promise<HubPublicationResult> {
    return this.publish({
      entityType: 'task',
      entityId: task.id,
      action: 'created',
      title: task.title,
      summary: `Tarefa criada: ${task.title} (${task.status}, ${task.priority})`,
      metadata: {
        status: task.status,
        priority: task.priority,
        assignee: task.assignee,
        dueDate: task.dueDate,
        origin: task.origin,
      },
      source: this.source,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Publica uma tarefa atualizada.
   */
  async publishTaskUpdated(task: TaskzeiTask): Promise<HubPublicationResult> {
    return this.publish({
      entityType: 'task',
      entityId: task.id,
      action: 'updated',
      title: task.title,
      summary: `Tarefa atualizada: ${task.title}`,
      metadata: {
        status: task.status,
        priority: task.priority,
        assignee: task.assignee,
      },
      source: this.source,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Publica uma tarefa concluida.
   */
  async publishTaskCompleted(task: TaskzeiTask): Promise<HubPublicationResult> {
    return this.publish({
      entityType: 'task',
      entityId: task.id,
      action: 'completed',
      title: task.title,
      summary: `Tarefa concluída: ${task.title}`,
      metadata: {
        completedAt: task.updatedAt,
        priority: task.priority,
      },
      source: this.source,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Publica uma reuniao criada.
   */
  async publishMeetingCreated(meeting: Meeting): Promise<HubPublicationResult> {
    return this.publish({
      entityType: 'meeting',
      entityId: meeting.id,
      action: 'created',
      title: meeting.title,
      summary: `Reunião agendada: ${meeting.title}${meeting.meetingDate ? ` em ${meeting.meetingDate}` : ''}`,
      metadata: {
        meetingDate: meeting.meetingDate,
        startTime: meeting.startTime,
        durationMinutes: meeting.durationMinutes,
        agendaCount: meeting.agendaItems?.length || 0,
        decisionCount: meeting.decisions?.length || 0,
      },
      source: this.source,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Publica um item de inbox convertido em entidade.
   */
  async publishInboxConverted(
    inboxItem: InboxItem,
    targetType: string,
    targetId: string
  ): Promise<HubPublicationResult> {
    return this.publish({
      entityType: 'inbox',
      entityId: inboxItem.id,
      action: 'completed',
      title: inboxItem.content.slice(0, 60),
      summary: `Item de inbox convertido em ${targetType}: ${inboxItem.content.slice(0, 80)}`,
      metadata: {
        convertedToType: targetType,
        convertedToId: targetId,
        source: inboxItem.source,
        suggestedType: inboxItem.suggestedType,
      },
      source: this.source,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Sincroniza o estado atual do modulo com o hub.
   * Chamado apos grandes operacoes (batch imports, recovery).
   */
  async syncState(tasks: TaskzeiTask[], meetings: Meeting[]): Promise<HubPublicationResult[]> {
    const results: HubPublicationResult[] = [];

    for (const task of tasks) {
      if (task.status === 'concluida') {
        results.push(await this.publishTaskCompleted(task));
      } else {
        results.push(await this.publishTaskUpdated(task));
      }
    }

    for (const meeting of meetings) {
      results.push(await this.publishMeetingCreated(meeting));
    }

    return results;
  }
}

/** Singleton do servico de integracao com hub */
export const hubIntegration = new HubIntegrationService();
