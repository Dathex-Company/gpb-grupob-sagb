import { nlParser, type NlParseResult } from './nlParser.service';
import { taskzeiFacade } from './taskzei.facade';
import { monitorService } from './taskzei.monitor';
import { docAiService } from './doc_ai_service';
import { compileLinkedDocs } from './doc_nlp_adapter';

/**
 * Resultado do processamento de uma mensagem conversacional.
 */
export interface ConversationalResult {
  intent: NlParseResult['type'] | 'doc_ai';
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

  /**
   * Processa uma mensagem com contexto documental.
   *
   * Usado quando há documentos vinculados a uma tarefa ou contexto ativo.
   * O conteúdo dos documentos é compilado e injetado no prompt da IA (Gemini)
   * para gerar ações, resumos ou responder perguntas.
   *
   * @param text - Comando do usuário (ex: "Extrair ações", "Resumir pendências")
   * @param linkedDocIds - IDs dos documentos vinculados para contexto
   * @param context - Contexto adicional (source, userId)
   */
  async processMessageWithDocs(
    text: string,
    linkedDocIds: string[],
    context?: { source?: string; userId?: string }
  ): Promise<ConversationalResult> {
    const source = context?.source || 'taskzei_drawer';
    const userId = context?.userId || 'unknown';

    try {
      // Detecta intenção do comando
      const commandType = this.detectDocCommand(text);

      switch (commandType) {
        case 'extract_actions': {
          // Se há um único documento, extrai dele
          if (linkedDocIds.length === 1) {
            const result = await docAiService.extractActionsFromDoc(linkedDocIds[0]);
            if (!result.success) {
              return { intent: 'doc_ai', message: result.message };
            }
            return {
              intent: 'doc_ai',
              message: result.message,
              suggestions: [
                'Ver tarefas criadas',
                'Gerar resumo do documento',
                'Adicionar mais documentos',
              ],
            };
          }

          // Múltiplos documentos — trata como linked docs (task context)
          const entityContext = await this.resolveEntityContext(linkedDocIds);
          if (entityContext) {
            const result = await docAiService.extractActionsFromLinkedDocs(
              entityContext.entityType,
              entityContext.entityId
            );
            return {
              intent: 'doc_ai',
              message: result.success ? result.message : `⚠️ ${result.message}`,
              suggestions: result.success
                ? ['Ver tarefas criadas', 'Gerar resumo', 'Adicionar mais documentos']
                : ['Vincular documentos à tarefa', 'Tentar novamente'],
            };
          }

          // Fallback: compila todos os docs e chama IA
          const result = await docAiService.extractActionsFromDoc(linkedDocIds[0]);
          return {
            intent: 'doc_ai',
            message: result.success ? result.message : `⚠️ ${result.message}`,
            suggestions: ['Gerar resumo', 'Tentar novamente'],
          };
        }

        case 'summarize': {
          if (linkedDocIds.length === 0) {
            return {
              intent: 'doc_ai',
              message: 'Nenhum documento vinculado encontrado para resumir.',
            };
          }

          // Resumo do primeiro documento (ou do conjunto)
          const summaryResult = await docAiService.summarizeDoc(linkedDocIds[0]);
          return {
            intent: 'doc_ai',
            message: summaryResult.success ? summaryResult.message : `⚠️ ${summaryResult.message}`,
            suggestions: summaryResult.success
              ? ['Extrair ações', 'Perguntar sobre o documento', 'Ver documentos']
              : ['Tentar novamente'],
          };
        }

        case 'custom_command': {
          if (linkedDocIds.length === 0) {
            return {
              intent: 'doc_ai',
              message: 'Nenhum documento disponível para processar seu comando.',
            };
          }

          // Comando customizado: passa textos docs + comando para a IA
          const linkedContext = await compileLinkedDocs('task', linkedDocIds[0]);
          const aiResult = await docAiService.generateTasksFromCommand(text, linkedContext);
          return {
            intent: 'doc_ai',
            message: aiResult.success ? aiResult.message : `⚠️ ${aiResult.message}`,
            suggestions: aiResult.success
              ? ['Ver tarefas criadas', 'Fazer outra pergunta', 'Gerenciar documentos']
              : ['Tentar novamente'],
          };
        }

        default: {
          // Fallback: interpreta como texto livre com contexto documental
          return await this.processMessage(text, context);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      monitorService.recordEvent(
        'conversational_doc_ai_error',
        `Erro ao processar mensagem com documentos: ${errorMessage}`,
        'error',
        'taskzei-conversational',
        { text, linkedDocIds, source, userId }
      );
      return {
        intent: 'doc_ai',
        message: `Erro ao processar comando com documentos: ${errorMessage}`,
      };
    }
  }

  /**
   * Detecta o tipo de comando relacionado a documentos.
   */
  private detectDocCommand(text: string): 'extract_actions' | 'summarize' | 'custom_command' {
    const lower = text.toLowerCase().trim();

    // Padrões para extração de ações
    const extractPatterns = [
      /extrair\s+a[cçõo]es/i,
      /criar\s+(sub)?tarefas?/i,
      /extrair\s+(pendências|tarefas|itens)/i,
      /gerar\s+(ações|tarefas)/i,
      /o\s+que\s+precisa\s+ser\s+feito/i,
      /extrair/i,
    ];

    // Padrões para resumo
    const summarizePatterns = [
      /resumi?r?\s+(o\s+)?documento/i,
      /gerar\s+resumo/i,
      /sumarizar/i,
      /resumo\s+executivo/i,
      /do\s+que\s+se\s+trata/i,
      /resumir/i,
    ];

    for (const pattern of extractPatterns) {
      if (pattern.test(lower)) return 'extract_actions';
    }

    for (const pattern of summarizePatterns) {
      if (pattern.test(lower)) return 'summarize';
    }

    return 'custom_command';
  }

  /**
   * Tenta resolver um contexto de entidade a partir de IDs de documentos vinculados.
   * Útil quando múltiplos docs estão vinculados a uma mesma tarefa.
   */
  private async resolveEntityContext(
    docIds: string[]
  ): Promise<{ entityType: 'task' | 'meeting'; entityId: string } | null> {
    // Esta função pode ser expandida no futuro para buscar a entidade
    // que possui os links para estes documentos.
    // Por enquanto, retorna null e o handler usa fallbacks.
    return null;
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
      assigneeName: assignee || undefined,
      dueDate: dueDate || undefined,
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
