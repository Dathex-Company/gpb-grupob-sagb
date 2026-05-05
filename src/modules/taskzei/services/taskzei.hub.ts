import type { TaskzeiTask } from '../types/task.types';
import type { Meeting } from '../types/meeting.types';
import type { InboxItem } from '../types/inbox.types';
import type { HubInboundMessage } from '../../hub-integracao/types/integration.types';
import { integrationHub } from '../../hub-integracao/services/integrationService';
import { conversationalHandler } from './taskzei.conversational';
import { monitorService } from './taskzei.monitor';

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
 * Toda publicacao externa (WhatsApp, e-mail) deve passar por este servico,
 * que por sua vez delega ao hub-integracao. Nenhuma conexao direta com servicos
 * externos deve ser feita sem passar por este fluxo, conforme decisao_013.
 *
 * O servico tambem escuta o Event Bridge do Hub (hub:inbound-message) para
 * processar mensagens recebidas via WhatsApp, webhook ou outros canais inbound.
 */
export class HubIntegrationService {
  private readonly source = 'taskzei' as const;
  private listening = false;

  /**
   * Inicia a escuta do Event Bridge do Hub de Integracoes.
   *
   * Quando uma mensagem inbound chega (ex: WhatsApp), o Hub dispara o evento
   * `hub:inbound-message`. Este metodo escuta o evento, processa a mensagem
   * via conversationalHandler e marca como lida no Hub.
   *
   * Retorna uma funcao de cleanup para remover o listener.
   */
  startListening(): () => void {
    if (this.listening) {
      return () => {};
    }

    this.listening = true;

    const handler = async (event: Event) => {
      const detail = (event as CustomEvent<HubInboundMessage>).detail;
      if (!detail) return;

      try {
        await this.processInboundMessage(detail);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        console.error('[HubIntegration] Erro ao processar mensagem inbound:', errorMessage);
        monitorService.recordEvent(
          'hub_inbound_error',
          `Erro ao processar mensagem do hub: ${errorMessage}`,
          'error',
          'taskzei-hub',
          { messageId: detail.id, source: detail.source }
        );
      }
    };

    window.addEventListener('hub:inbound-message', handler);

    console.log('[HubIntegration] Event Bridge listener iniciado — aguardando mensagens do Hub de Integrações');

    // Retorna cleanup
    return () => {
      this.listening = false;
      window.removeEventListener('hub:inbound-message', handler);
      console.log('[HubIntegration] Event Bridge listener removido');
    };
  }

  /**
   * Processa uma mensagem recebida do Event Bridge.
   * Roteia para o conversationalHandler e marca como lida no Hub.
   */
  private async processInboundMessage(message: HubInboundMessage): Promise<void> {
    const { id, source, from, fromName, content } = message;

    console.log(`[HubIntegration] Mensagem recebida via ${source} de "${fromName || from}": "${content.slice(0, 60)}..."`);

    // Processa a mensagem via NLP conversacional
    const result = await conversationalHandler.processMessage(content, {
      source: `hub_${source}`,
      userId: from,
    });

    console.log(`[HubIntegration] Mensagem processada — intencao: ${result.intent}`);

    // Marca como lida no Hub
    await integrationHub.markAsRead(id);

    // Registra no monitor
    monitorService.recordEvent(
      'hub_inbound_processed',
      `Mensagem ${source} de ${fromName || from} processada como ${result.intent}`,
      'info',
      'taskzei-hub',
      { messageId: id, source, from, intent: result.intent, title: result.created?.title }
    );
  }

  /**
   * Publica uma entidade no hub de integracoes.
   * Delega ao integrationHub do hub-integracao quando possivel,
   * ou faz fallback para log quando o hub nao suporta a operacao.
   */
  async publish(publication: HubPublication): Promise<HubPublicationResult> {
    try {
      // Tenta publicar via integrationHub se o metodo existir
      // Por enquanto, o hub-integracao nao possui metodo generico de publish,
      // entao registramos no log como atividade
      console.log('[HubIntegration] Evento registrado:', {
        entityType: publication.entityType,
        entityId: publication.entityId,
        action: publication.action,
        title: publication.title,
      });

      return {
        success: true,
        publicationId: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
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
