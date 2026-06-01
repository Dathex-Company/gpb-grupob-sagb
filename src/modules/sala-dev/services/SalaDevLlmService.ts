import { callAiProxy } from '../../../../services/aiProxy';

export type SalaDevChatRole = 'user' | 'assistant' | 'system';

export interface SalaDevChatMessage {
  id?: string;
  role: SalaDevChatRole;
  content: string;
  createdAt?: Date;
}

export interface SalaDevChatResult {
  content: string;
  finishReason: 'stop' | 'length' | 'error';
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export interface SalaDevBriefingInput {
  projectName: string;
  idea: string;
  objective: string;
  audience: string;
  constraints: string;
}

export interface SalaDevGeneratedBriefingAiResult {
  summary: string;
  scope: string[];
  risks: string[];
  firstSteps: string[];
}

export interface SalaDevLlmOptions {
  model?: string;
  temperature?: number;
  systemPrompt?: string;
}

const DEFAULT_SYSTEM_PROMPT = `Você é o Assistente IA da Sala Dev do SagB.

Sua função é ajudar a transformar uma ideia de projeto em plano técnico executável.
Responda em português do Brasil, seja objetivo, técnico e orientado a próximos passos.
Não afirme que executou arquivos, comandos ou deploys. Quando uma ação real depender de ferramenta externa, diga que ela precisa ser aprovada/executada na esteira da Sala Dev.
Organize respostas com markdown, bullets e, quando útil, blocos de código.`;

export class SalaDevLlmService {
  private readonly systemPrompt: string;

  constructor(options: SalaDevLlmOptions = {}) {
    this.systemPrompt = options.systemPrompt || DEFAULT_SYSTEM_PROMPT;
  }

  async sendMessage(
    messages: SalaDevChatMessage[],
    options: SalaDevLlmOptions = {},
  ): Promise<SalaDevChatResult> {
    const result = await callAiProxy<Partial<SalaDevChatResult> | string>('chat', {
      messages: [
        { role: 'system', content: options.systemPrompt || this.systemPrompt },
        ...messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
      model: options.model || 'gpt-4o-mini',
      temperature: options.temperature ?? 0.7,
      source: 'sala-dev',
    });

    if (typeof result === 'string') {
      return { content: result, finishReason: 'stop' };
    }

    return {
      content: result.content || 'Não consegui gerar uma resposta agora.',
      finishReason: result.finishReason || 'stop',
      usage: result.usage,
    };
  }

  async generateBriefing(input: SalaDevBriefingInput): Promise<SalaDevGeneratedBriefingAiResult> {
    const result = await callAiProxy<Partial<SalaDevGeneratedBriefingAiResult> | string>('generateBriefing', {
      ...input,
      source: 'sala-dev',
    });

    if (typeof result === 'string') {
      return this.parseBriefingText(input.projectName, result);
    }

    return {
      summary: result.summary || this.buildFallbackSummary(input),
      scope: this.ensureList(result.scope, [
        `Projeto: ${input.projectName || 'Novo Projeto'}`,
        `Objetivo principal: ${input.objective || 'Definir objetivo operacional.'}`,
        `Público alvo: ${input.audience || 'Público em definição.'}`,
      ]),
      risks: this.ensureList(result.risks, [
        'Escopo precisa ser validado antes da construção.',
        'Dependências técnicas precisam ser mapeadas na arquitetura.',
      ]),
      firstSteps: this.ensureList(result.firstSteps, [
        'Revisar briefing gerado pela IA.',
        'Validar premissas de negócio e restrições.',
        'Iniciar a esteira de planejamento da Sala Dev.',
      ]),
    };
  }

  async analyzeCode(fileContent: string, context?: string): Promise<string> {
    return callAiProxy<string>('analyzeCode', {
      fileContent,
      context,
      source: 'sala-dev',
    });
  }

  async suggestNextSteps(context: string): Promise<string[]> {
    const result = await callAiProxy<string[] | { suggestions?: string[] }>('suggestNextSteps', {
      context,
      source: 'sala-dev',
    });

    if (Array.isArray(result)) return result;
    return result.suggestions || [];
  }

  async healthCheck(): Promise<boolean> {
    try {
      await callAiProxy<string[] | { suggestions?: string[] }>('suggestNextSteps', {
        context: 'health-check sala-dev',
        source: 'sala-dev',
      });
      return true;
    } catch {
      return false;
    }
  }

  private buildFallbackSummary(input: SalaDevBriefingInput): string {
    return `${input.projectName || 'Novo Projeto'}: ${input.idea || 'Escopo em definição.'} Objetivo: ${input.objective || 'Definir objetivo operacional.'} Público: ${input.audience || 'Público em definição.'}.`;
  }

  private parseBriefingText(projectName: string, text: string): SalaDevGeneratedBriefingAiResult {
    return {
      summary: text,
      scope: [
        `Projeto: ${projectName || 'Novo Projeto'}`,
        'Escopo extraído da resposta textual da IA.',
      ],
      risks: ['Resposta textual precisa ser revisada antes de iniciar a esteira.'],
      firstSteps: ['Revisar briefing.', 'Ajustar campos se necessário.', 'Iniciar pipeline.'],
    };
  }

  private ensureList(value: unknown, fallback: string[]): string[] {
    if (Array.isArray(value) && value.every((item) => typeof item === 'string') && value.length > 0) {
      return value;
    }
    return fallback;
  }
}

export function createSalaDevLlmService(options?: SalaDevLlmOptions): SalaDevLlmService {
  return new SalaDevLlmService(options);
}
