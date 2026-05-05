import { nlParser, type NlParseResult } from './nlParser.service';
import { taskzeiFacade } from './taskzei.facade';
import { monitorService } from './taskzei.monitor';

/**
 * Resultado do processamento de uma mensagem conversacional.
 */
export interface ConversationalResult {
  intent: NlParseResult['type'];
  message: string;
  created?: {
    type: string;
    id: string;
    title: string;
  };
  suggestions?: string[];
}

/**
 * Handler conversacional para o módulo TaskZei.
 *
 * Processa texto livre vindo do núcleo conversacional do SagB,
 * identifica a intenção e executa a ação correspondente.
 *
 * Uso:
 * ```ts
 * const result = await conversationalHandler.processMessage(
 *   'criar tarefa: Comprar insumos para o projeto',
 *   { source: 'sagb_chat', userId: 'user_123' }
 * );
 * ```
 */
export class ConversationalHandler {
  /**
   * Processa uma mensagem de texto livre e retorna o resultado da ação.
   */
  async processMessage(
    text: string,
    context?: { source?: string; userId?: string }
  ): Promise<ConversationalResult> {
    const source = context?.source || 'sagb_chat';
    const userId = context?.userId || 'unknown';

    // 1. Faz o parse da intenção
    const parsed = nlParser.parse(text);

    // 2. Executa de acordo com o tipo
    try {
      switch (parsed.type) {
        case 'task':
          return await this.handleTaskIntent(parsed, source, userId);
        case 'meeting':
          return await this.handleMeetingIntent(parsed, source, userId);
        case 'decision':
          return await this.handleDecisionIntent(parsed, source, userId);
        case 'inbox':
          return await this.handleInboxIntent(parsed, source, userId);
        case 'unknown':
          return await this.handleUnknownIntent(text, source, userId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      monitorService.recordEvent(
        'conversational_error',
        `Erro ao processar mensagem: ${errorMessage}`,
        'error',
        'taskzei-conversational',
        { text, source, userId }
      );
      return {
        intent: 'unknown',
        message: `Não foi possível processar sua solicitação: ${errorMessage}`,
      };
    }
  }

  // ─── Handlers específicos ──────────────────────────────────────────

  private async handleTaskIntent(
    parsed: Extract<NlParseResult, { type: 'task' }>,
    source: string,
    userId: string
  ): Promise<ConversationalResult> {
    const { title, description, priority, assignee, dueDate } = parsed.data;

    // Cria a tarefa com origem
    const task = await taskzeiFacade.createTaskFromOrigin({
      title,
      description: description || '',
      status: 'aberta',
      priority: priority || 'media',
      assignee: assignee || null,
      dueDate: dueDate || null,
      origin: {
        system: 'sagb',
        ref: userId,
        metadata: { source, conversational: true },
      },
    });

    const parts = [`Tarefa criada: **${task.title}**`];
    if (priority) parts.push(`prioridade: ${priority}`);
    if (dueDate) parts.push(`vencimento: ${dueDate}`);
    if (assignee) parts.push(`responsável: ${assignee}`);

    return {
      intent: 'task',
      message: parts.join(' | '),
      created: { type: 'task', id: task.id, title: task.title },
      suggestions: [
        'Ver minhas tarefas',
        'Adicionar checklist',
        'Alterar prioridade',
      ],
    };
  }

  private async handleMeetingIntent(
    parsed: Extract<NlParseResult, { type: 'meeting' }>,
    source: string,
    userId: string
  ): Promise<ConversationalResult> {
    const { title, description, meetingDate, startTime, durationMinutes, agendaItems } = parsed.data;

    const meeting = await taskzeiFacade.createMeeting({
      title,
      description,
      meetingDate,
      startTime,
      durationMinutes: durationMinutes || 60,
      status: 'agendada',
    });

    // Cria agenda items se houver
    if (agendaItems && agendaItems.length > 0) {
      for (const item of agendaItems) {
        await taskzeiFacade.addAgendaItem(meeting.id, item);
      }
    }

    const parts = [`Reunião agendada: **${meeting.title}**`];
    if (meetingDate) parts.push(`data: ${meetingDate}`);
    if (startTime) parts.push(`às ${startTime}`);

    return {
      intent: 'meeting',
      message: parts.join(' | '),
      created: { type: 'meeting', id: meeting.id, title: meeting.title },
      suggestions: [
        'Adicionar pauta',
        'Registrar decisão',
        'Ver reuniões',
      ],
    };
  }

  private async handleDecisionIntent(
    parsed: Extract<NlParseResult, { type: 'decision' }>,
    source: string,
    userId: string
  ): Promise<ConversationalResult> {
    const { title, description, responsible, deadline } = parsed.data;

    // Decision sem meetingId vai para inbox com sugestão de decisão
    const inboxItem = await taskzeiFacade.addToInbox({
      content: `Decisão: ${title}${description ? ` — ${description}` : ''}${responsible ? ` (Resp: ${responsible})` : ''}${deadline ? ` até ${deadline}` : ''}`,
      source: 'sagb_chat',
      status: 'classified',
      suggestedType: 'decision',
      confidence: 0.7,
    });

    return {
      intent: 'decision',
      message: `Decisão registrada no inbox como sugestão: **${title}**. Vincule a uma reunião para formalizar.`,
      created: { type: 'inbox', id: inboxItem.id, title },
      suggestions: [
        'Ver inbox',
        'Criar reunião para formalizar',
        'Converter em tarefa',
      ],
    };
  }

  private async handleInboxIntent(
    parsed: Extract<NlParseResult, { type: 'inbox' }>,
    source: string,
    userId: string
  ): Promise<ConversationalResult> {
    const item = await taskzeiFacade.addToInbox({
      content: parsed.data.content,
      source: 'sagb_chat',
      status: 'pending',
    });

    return {
      intent: 'inbox',
      message: `Anotação salva no inbox: **${item.content}**`,
      created: { type: 'inbox', id: item.id, title: item.content },
      suggestions: [
        'Classificar item',
        'Converter em tarefa',
        'Ver inbox',
      ],
    };
  }

  private async handleUnknownIntent(
    text: string,
    source: string,
    userId: string
  ): Promise<ConversationalResult> {
    // Qualquer texto não reconhecido vai para inbox como fallback
    const item = await taskzeiFacade.addToInbox({
      content: text,
      source: 'sagb_chat',
      status: 'pending',
    });

    return {
      intent: 'unknown',
      message: `Não entendi completamente, mas salvei no inbox para análise: "${text.slice(0, 80)}${text.length > 80 ? '...' : ''}"`,
      created: { type: 'inbox', id: item.id, title: text.slice(0, 60) },
      suggestions: [
        'Tente: "criar tarefa: [descrição]"',
        'Tente: "reunião com [nome] sobre [assunto]"',
        'Ver inbox',
      ],
    };
  }
}

/** Singleton do handler conversacional */
export const conversationalHandler = new ConversationalHandler();
