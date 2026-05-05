import type { TaskzeiTask } from '../types/task.types';
import type { TaskOrigin, OriginSystem } from '../types/origin.types';
import type { Meeting, MeetingAgendaItem } from '../types/meeting.types';
import type { InboxItem, SuggestedEntityType } from '../types/inbox.types';

/**
 * Resultado do parse de linguagem natural.
 * Pode produzir args para criar task, meeting, decision, inbox ou um parse livre (raw).
 */
export type NlParseResult =
  | { type: 'task'; data: NlTaskParsed }
  | { type: 'meeting'; data: NlMeetingParsed }
  | { type: 'decision'; data: NlDecisionParsed }
  | { type: 'inbox'; data: NlInboxParsed }
  | { type: 'unknown'; raw: string; confidence: number };

export interface NlTaskParsed {
  title: string;
  description?: string;
  priority?: TaskzeiTask['priority'];
  assignee?: string;
  dueDate?: string;
  relatedDocIds?: string[];
}

export interface NlMeetingParsed {
  title: string;
  description?: string;
  meetingDate?: string;
  startTime?: string;
  durationMinutes?: number;
  agendaItems?: Omit<MeetingAgendaItem, 'id' | 'meetingId' | 'createdAt' | 'updatedAt'>[];
}

export interface NlDecisionParsed {
  title: string;
  description?: string;
  responsible?: string;
  deadline?: string;
}

export interface NlInboxParsed {
  content: string;
  source?: OriginSystem;
  suggestedType?: SuggestedEntityType;
  confidence: number;
}

/**
 * Serviço de parse de linguagem natural para o módulo TaskZei.
 *
 * Converte texto livre em ações estruturadas (tarefas, reuniões, decisões, inbox).
 * Usa padrões regex para identificar intenção e extrair entidades.
 */
export class NlParserService {
  // ─── Padrões de intenção ────────────────────────────────────────────

  private readonly taskPatterns: RegExp[] = [
    /^(criar|crie|nova?|adicionar|add)\s*(tarefa|task)?\s*[:\-]?\s*(.+)$/i,
    /^(preciso|necessito|tenho que|devo)\s+(.+)$/i,
    /^(.+)\s+(ate|até|para|vencimento|deadline)\s+(.+)$/i,
    /^(lembrete|lembrar|to-?do)\s*[:\-]?\s*(.+)$/i,
  ];

  private readonly meetingPatterns: RegExp[] = [
    /^(reunião|reuniao|meeting|sessão|sessao|call)\s*(com|para)?\s*(.+)$/i,
    /^(agendar|marcar|schedule|organizar)\s*(reunião|reuniao|meeting)?\s*(.+)$/i,
    /^(.+)\s+(amanhã|amanha|hoje|segunda|terça|terca|quarta|quinta|sexta|sábado|sabado|domingo)/i,
  ];

  private readonly decisionPatterns: RegExp[] = [
    /^(decidido|decidimos|ficou decidido|decisão|decisao)\s*[:\-]?\s*(.+)$/i,
    /^(.+)\s+(é|e)\s+(responsabilidade|responsavel|responsável)\s+(d[eo])\s+(.+)$/i,
    /^(resolvido|resolvemos|acordado|acordamos|combinado|combinamos)\s*[:\-]?\s*(.+)$/i,
  ];

  private readonly inboxPatterns: RegExp[] = [
    /^(anotação|anotacao|nota|note|ideia|idea|salvar)\s*[:\-]?\s*(.+)$/i,
    /^(lembrete rápido|rapido|quick|só pra constar)\s*[:\-]?\s*(.+)$/i,
  ];

  // ─── Parsers de extração ────────────────────────────────────────────

  private extractPriority(text: string): { cleaned: string; priority?: TaskzeiTask['priority'] } {
    const map: [RegExp, TaskzeiTask['priority']][] = [
      [/(urgent(e|íssimo)?|alta|alta prioridade|crítico|critico)/i, 'urgente'],
      [/(media|média|normal|médio|medio)/i, 'media'],
      [/(baixa|baixo|baixa prioridade|baixo|low)/i, 'baixa'],
    ];
    for (const [pattern, prio] of map) {
      if (pattern.test(text)) {
        return { cleaned: text.replace(pattern, '').trim(), priority: prio };
      }
    }
    return { cleaned: text };
  }

  private extractAssignee(text: string): { cleaned: string; assignee?: string } {
    const match = text.match(/(para|com|responsável|responsavel|assign)\s+([A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇa-záéíóúâêîôûãõç]+(?:\s+[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇa-záéíóúâêîôûãõç]+)?)/i);
    if (match) {
      return { cleaned: text.replace(match[0], '').trim(), assignee: match[2] };
    }
    return { cleaned: text };
  }

  private extractDueDate(text: string): { cleaned: string; dueDate?: string } {
    // "ate|até|para|vencimento|deadline <data>"
    const match = text.match(/(até|ate|para|vencimento|deadline)\s+(.+)$/i);
    if (match) {
      const dateStr = this.parseRelativeDate(match[2].trim());
      if (dateStr) {
        return { cleaned: text.replace(match[0], '').trim(), dueDate: dateStr };
      }
    }
    return { cleaned: text };
  }

  private parseRelativeDate(text: string): string | undefined {
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    // Palavras relativas
    const relativeMap: Record<string, number> = {
      'hoje': 0,
      'amanhã': 1, 'amanha': 1,
      'depois de amanhã': 2, 'depois de amanha': 2,
    };
    if (relativeMap[text.toLowerCase()] !== undefined) {
      const d = new Date(today);
      d.setDate(d.getDate() + relativeMap[text.toLowerCase()]);
      return d.toISOString().split('T')[0];
    }

    // Dias da semana
    const dayMap: Record<string, number> = {
      'domingo': 0, 'segunda': 1, 'segunda-feira': 1,
      'terça': 2, 'terca': 2, 'terça-feira': 2, 'terca-feira': 2,
      'quarta': 3, 'quarta-feira': 3,
      'quinta': 4, 'quinta-feira': 4,
      'sexta': 5, 'sexta-feira': 5,
      'sábado': 6, 'sabado': 6,
    };
    const dayName = Object.keys(dayMap).find(k => text.toLowerCase().includes(k));
    if (dayName) {
      const targetDay = dayMap[dayName];
      const currentDay = today.getDay();
      let diff = targetDay - currentDay;
      if (diff <= 0) diff += 7;
      const d = new Date(today);
      d.setDate(d.getDate() + diff);
      return d.toISOString().split('T')[0];
    }

    // Data numérica DD/MM ou DD/MM/YYYY
    const dateMatch = text.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/);
    if (dateMatch) {
      const day = parseInt(dateMatch[1]);
      const month = parseInt(dateMatch[2]) - 1;
      const year = dateMatch[3] ? parseInt(dateMatch[3]) : today.getFullYear();
      return new Date(year, month, day).toISOString().split('T')[0];
    }

    // Data ISO YYYY-MM-DD
    const isoMatch = text.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) return isoMatch[0];

    return undefined;
  }

  private extractMeetingDateTime(text: string): { cleaned: string; meetingDate?: string; startTime?: string } {
    // Horário HH:MM ou Hh
    const timeMatch = text.match(/(\d{1,2})[h:\.](\d{2})?\s*(h|hrs|horas)?/i);
    let startTime: string | undefined;
    if (timeMatch) {
      const hh = timeMatch[1].padStart(2, '0');
      const mm = timeMatch[2] || '00';
      startTime = `${hh}:${mm}`;
    }

    // Data
    const { cleaned, dueDate } = this.extractDueDate(text);
    // Re-parse usando o mesmo extractor de data relativa
    let meetingDate: string | undefined;
    const dateMatch = text.match(/(amanhã|amanha|hoje|segunda|terça|terca|quarta|quinta|sexta|sábado|sabado|domingo|\d{1,2}\/\d{1,2}(?:\/\d{4})?)/i);
    if (dateMatch) {
      meetingDate = this.parseRelativeDate(dateMatch[0]);
    }

    const cleanedText = startTime ? text.replace(timeMatch[0], '').trim() : text;
    return { cleaned: cleanedText, meetingDate, startTime };
  }

  private extractDuration(text: string): { cleaned: string; durationMinutes?: number } {
    const match = text.match(/(\d+)\s*(min|minutos|h|hora|horas)/i);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2].toLowerCase();
      const durationMinutes = unit.startsWith('h') ? value * 60 : value;
      return { cleaned: text.replace(match[0], '').trim(), durationMinutes };
    }
    return { cleaned: text };
  }

  private extractAgendaItems(text: string): { cleaned: string; items: Omit<MeetingAgendaItem, 'id' | 'meetingId' | 'createdAt' | 'updatedAt'>[] } {
    const items: Omit<MeetingAgendaItem, 'id' | 'meetingId' | 'createdAt' | 'updatedAt'>[] = [];
    // Itens separados por ";" ou bullet points (-, *, •)
    const lines = text.split(/[;\n]/).map(l => l.trim()).filter(l => l.length > 0);
    const agendaLines = lines.filter(l => /^[-*\•]\s/.test(l));
    for (const line of agendaLines) {
      const clean = line.replace(/^[-*\•]\s+/, '').trim();
      items.push({
        title: clean,
        description: undefined,
        sortOrder: items.length + 1,
        durationMinutes: undefined,
        status: 'pendente',
      });
    }
    return {
      cleaned: agendaLines.length > 0 ? lines.filter(l => !agendaLines.includes(l)).join('; ') : text,
      items,
    };
  }

  // ─── Métodos públicos ───────────────────────────────────────────────

  /**
   * Interpreta um texto livre e retorna um resultado estruturado.
   * Percorre os padrões de intenção na ordem: task → meeting → decision → inbox → unknown.
   */
  parse(text: string): NlParseResult {
    const trimmed = text.trim();
    if (!trimmed) {
      return { type: 'unknown', raw: text, confidence: 0 };
    }

    // Tenta task primeiro
    for (const pattern of this.taskPatterns) {
      const match = trimmed.match(pattern);
      if (match) {
        const rawTitle = match[match.length - 1].trim();

        // Extrai campos do texto
        const { cleaned: withPri, priority } = this.extractPriority(rawTitle);
        const { cleaned: withAssignee, assignee } = this.extractAssignee(withPri);
        const { cleaned: withDate, dueDate } = this.extractDueDate(withAssignee);
        // Remove conectores residuais
        const title = withDate
          .replace(/^(para|com|de|em)\s+/i, '')
          .replace(/\s+/g, ' ')
          .trim();

        if (title.length > 0) {
          return {
            type: 'task',
            data: {
              title: title.charAt(0).toUpperCase() + title.slice(1),
              priority: priority || 'media',
              assignee,
              dueDate,
            },
          };
        }
      }
    }

    // Tenta meeting
    for (const pattern of this.meetingPatterns) {
      const match = trimmed.match(pattern);
      if (match) {
        const raw = match[match.length - 1].trim();
        const { cleaned: withDt, meetingDate, startTime } = this.extractMeetingDateTime(raw);
        const { cleaned: withDur, durationMinutes } = this.extractDuration(withDt);
        const { cleaned: withAg, items: agendaItems } = this.extractAgendaItems(withDur);

        const title = withAg
          .replace(/^(com|para|sobre|sobre)\s+/i, '')
          .replace(/\s+/g, ' ')
          .trim();

        if (title.length > 0) {
          return {
            type: 'meeting',
            data: {
              title: title.charAt(0).toUpperCase() + title.slice(1),
              meetingDate,
              startTime,
              durationMinutes: durationMinutes || 60,
              agendaItems: agendaItems.length > 0 ? agendaItems : undefined,
            },
          };
        }
      }
    }

    // Tenta decision
    for (const pattern of this.decisionPatterns) {
      const match = trimmed.match(pattern);
      if (match) {
        const raw = match[match.length - 1].trim();
        const { cleaned: withResp, assignee: responsible } = this.extractAssignee(raw);
        const { cleaned: withDate, dueDate: deadline } = this.extractDueDate(withResp);

        const title = withDate
          .replace(/\s+/g, ' ')
          .trim();

        if (title.length > 0) {
          return {
            type: 'decision',
            data: {
              title: title.charAt(0).toUpperCase() + title.slice(1),
              responsible,
              deadline,
            },
          };
        }
      }
    }

    // Tenta inbox
    for (const pattern of this.inboxPatterns) {
      const match = trimmed.match(pattern);
      if (match) {
        const content = match[match.length - 1].trim();
        return {
          type: 'inbox',
          data: {
            content: content.charAt(0).toUpperCase() + content.slice(1),
            source: 'manual',
            confidence: 0.6,
          },
        };
      }
    }

    // Fallback: análise genérica de confiança baixa
    return {
      type: 'unknown',
      raw: trimmed,
      confidence: this.calculateGenericConfidence(trimmed),
    };
  }

  /**
   * Tenta encaixar o texto em um tipo sugerido para inbox.
   * Retorna o tipo com maior confiança ou undefined.
   */
  suggestEntityType(text: string): { suggestedType: SuggestedEntityType; confidence: number } | undefined {
    const result = this.parse(text);

    const confidenceMap: Record<string, number> = {
      task: 0.8,
      meeting: 0.7,
      decision: 0.6,
      inbox: 0.4,
    };

    if (result.type !== 'unknown') {
      return {
        suggestedType: result.type as SuggestedEntityType,
        confidence: confidenceMap[result.type] || 0.5,
      };
    }

    // Análise por palavra-chave
    const lower = text.toLowerCase();
    const keywords: [RegExp, SuggestedEntityType, number][] = [
      [/(tarefa|task|fazer|criar|implementar|desenvolver)/, 'task', 0.5],
      [/(reunião|reuniao|meeting|call|pauta|agenda)/, 'meeting', 0.5],
      [/(decidir|decisão|decisao|resolver|acordar)/, 'decision', 0.4],
      [/(anotar|nota|note|ideia|idea|salvar)/, 'task', 0.3],
    ];

    for (const [pattern, type, conf] of keywords) {
      if (pattern.test(lower)) {
        return { suggestedType: type, confidence: conf };
      }
    }

    return undefined;
  }

  /**
   * Calcula confiança genérica baseada no tamanho e estrutura do texto.
   */
  private calculateGenericConfidence(text: string): number {
    const words = text.split(/\s+/).filter(Boolean).length;
    if (words < 2) return 0.1;
    if (words < 5) return 0.2;
    if (words < 10) return 0.3;
    return 0.4;
  }
}

/** Singleton do parser para uso em toda a aplicação */
export const nlParser = new NlParserService();
