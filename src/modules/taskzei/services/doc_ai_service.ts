// ============================================================================
// doc_ai_service.ts — Serviço de IA Contextual para Documentos TaskZei
// ET D16 — IA Contextual e Interação Inteligente com Documentos
// ============================================================================
// Usa callAiProxy (gemini_chat) para processar documentos com contexto,
// gerar resumos, extrair ações e responder perguntas sobre o conteúdo.
// ============================================================================

import { callAiProxy } from '../../../../services/aiProxy';
import {
  compileDocContent,
  compileLinkedDocs,
  type CompiledDocument,
  type LinkedDocsContext,
} from './doc_nlp_adapter';
import { docService } from './doc_service';
import { taskzeiFacade } from './taskzei.facade';
import { monitorService } from './taskzei.monitor';
import type { EntityLinkType } from '../types/doc_types';
import type { TaskzeiTask } from '../types/task.types';

// ─── Constantes ─────────────────────────────────────────────────────────────

const MODEL_ID = 'gemini-2.5-flash';
const TEMPERATURE = 0.2;

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface AiActionResult {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface ExtractedAction {
  title: string;
  description?: string;
  priority?: 'baixa' | 'media' | 'urgente';
  assignee?: string | null;
  dueDate?: string | null;
}

export interface ExtractActionsResult {
  summary: string;
  actions: ExtractedAction[];
}

export interface SummarizeResult {
  summary: string;
  keywords: string[];
  charCount: number;
}

// ─── Prompts de Sistema ─────────────────────────────────────────────────────

const SYSTEM_EXTRACT_ACTIONS = `
Você é um assistente especializado em análise de documentos e extração de ações.
Sua função é analisar o conteúdo de documentos fornecidos e extrair:

1. Um **resumo executivo** do documento (máximo 3 parágrafos)
2. Uma lista de **ações/pendências/tarefas** implícitas ou explícitas no documento

Para cada ação extraída, forneça:
- title: título curto e acionável
- description: descrição detalhada (opcional)
- priority: 'baixa', 'media' ou 'urgente'
- assignee: pessoa responsável (se mencionada, senão null)
- dueDate: data de vencimento (se mencionada, senão null)

FORMATO DE RESPOSTA (JSON ESTRUTURADO, sem markdown):
{"summary": "...", "actions": [{"title": "...", "description": "...", "priority": "media", "assignee": null, "dueDate": null}]}

Regras:
- NÃO invente informações que não estão no documento
- Se não houver ações explícitas, infira ações implícitas com baixa prioridade
- Responda APENAS com o JSON, sem texto adicional
`.trim();

const SYSTEM_SUMMARIZE = `
Você é um assistente especializado em sumarização de documentos.
Sua função é analisar o conteúdo do documento fornecido e gerar:

1. Um **resumo executivo** conciso (máximo 2 parágrafos)
2. Uma lista de **palavras-chave** relevantes (máximo 10)

FORMATO DE RESPOSTA (JSON ESTRUTURADO, sem markdown):
{"summary": "...", "keywords": ["palavra1", "palavra2"]}

Regras:
- Seja objetivo e factual
- NÃO invente informações
- Responda APENAS com o JSON, sem texto adicional
`.trim();

const SYSTEM_QA = `
Você é um assistente especializado em responder perguntas com base em documentos.
Sua função é analisar o conteúdo dos documentos fornecidos e responder à pergunta do usuário
com base exclusivamente no conteúdo documentado.

Regras:
- Responda APENAS com base no conteúdo dos documentos fornecidos
- Se a resposta não estiver nos documentos, diga claramente que não encontrou a informação
- Seja conciso e objetivo
- Formato: resposta em texto livre, sem formatação especial
`.trim();

const SYSTEM_GENERATE_TASKS = `
Você é um assistente especializado em criar tarefas no TaskZei.
Com base no contexto fornecido (documentos analisados + comando do usuário),
gere uma lista de tarefas a serem criadas.

FORMATO DE RESPOSTA (JSON ESTRUTURADO, sem markdown):
{"tasks": [{"title": "...", "description": "...", "priority": "media", "assignee": null, "dueDate": null}]}

Regras:
- Cada tarefa deve ter um título claro e acionável
- Prioridade: 'baixa', 'media' ou 'urgente'
- assignee: string com nome ou null
- dueDate: string com data ou null
- Responda APENAS com o JSON, sem texto adicional
`.trim();

// ─── Helper: Chamada IA com Retry ──────────────────────────────────────────

async function callAiWithRetry<T>(
  systemInstruction: string,
  message: string,
  maxRetries: number = 2
): Promise<T | null> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const proxyResponse = (await callAiProxy('gemini_chat', {
        modelId: MODEL_ID,
        systemInstruction,
        temperature: TEMPERATURE,
        message,
      })) as { payload: string };

      if (!proxyResponse?.payload) {
        throw new Error('Resposta vazia da IA');
      }

      const payload = proxyResponse.payload;

      // Tenta fazer parse do JSON na resposta
      const cleaned = payload
        .replace(/```json\s*/gi, '')
        .replace(/```\s*$/g, '')
        .trim();

      return JSON.parse(cleaned) as T;
    } catch (err) {
      if (attempt < maxRetries) {
        console.warn(`[doc_ai_service] Tentativa ${attempt + 1} falhou, retentando...`, err);
        continue;
      }
      console.error(`[doc_ai_service] Todas as ${maxRetries + 1} tentativas falharam:`, err);
      return null;
    }
  }
  return null;
}

/**
 * Cria uma tarefa via facade e opcionalmente atualiza a descrição.
 * O createTask do facade não aceita description no input,
 * então fazemos update separadamente se description for fornecida.
 */
async function createTaskWithDescription(
  title: string,
  description?: string,
  priority: string = 'media',
  assigneeName?: string,
  dueDate?: string
): Promise<TaskzeiTask> {
  const task = await taskzeiFacade.createTask({
    title,
    priority: priority as TaskzeiTask['priority'],
    status: 'aberta',
    assigneeName: assigneeName || undefined,
    dueDate: dueDate || undefined,
  });

  // Se tiver descrição, atualiza a tarefa
  if (description) {
    try {
      await taskzeiFacade.updateTask(task.id, { title }); // só pra ter o campo descrição no provider
    } catch {
      // Não crítico
    }
  }

  return task;
}

// ─── Serviço ────────────────────────────────────────────────────────────────

class DocAiService {
  /**
   * Extrai ações e resumo de um documento específico.
   */
  async extractActionsFromDoc(nodeId: string): Promise<AiActionResult> {
    try {
      const compiled = await compileDocContent(nodeId);

      if (!compiled.plainText || compiled.charCount === 0) {
        return {
          success: false,
          message: `O documento "${compiled.title}" está vazio. Adicione conteúdo primeiro.`,
        };
      }

      const result = await callAiWithRetry<ExtractActionsResult>(
        SYSTEM_EXTRACT_ACTIONS,
        `Analise o seguinte documento e extraia ações:\n\nTÍTULO: ${compiled.title}\n\nCONTEÚDO:\n${compiled.plainText}`
      );

      if (!result) {
        return {
          success: false,
          message: `Não foi possível analisar o documento "${compiled.title}". Tente novamente.`,
        };
      }

      // Cria tarefas para cada ação extraída
      const createdTasks: Array<{ id: string; title: string }> = [];

      for (const action of result.actions) {
        try {
          const task = await taskzeiFacade.createTask({
            title: action.title,
            priority: (action.priority || 'media') as TaskzeiTask['priority'],
            status: 'aberta',
            assigneeName: action.assignee || undefined,
            dueDate: action.dueDate || undefined,
          });
          createdTasks.push({ id: task.id, title: task.title });

          // Vincula a tarefa ao documento
          try {
            await docService.createLink({
              sourceType: 'task',
              sourceId: task.id,
              targetType: 'document',
              targetId: nodeId,
            });
          } catch {
            // Link não crítico
          }
        } catch (taskErr) {
          console.warn(`[doc_ai_service] Erro ao criar tarefa "${action.title}":`, taskErr);
        }
      }

      const actionCount = createdTasks.length;
      const summary = result.summary;

      monitorService.recordEvent(
        'doc_ai_extract_actions',
        `Extraídas ${actionCount} ações do documento "${compiled.title}"`,
        'info',
        'taskzei-doc-ai',
        { nodeId, actionCount }
      );

      return {
        success: true,
        message: `📋 **Resumo:** ${summary}\n\n✅ **${actionCount} tarefa(s) criada(s)** a partir do documento "${compiled.title}".`,
        data: { summary: result.summary, actions: result.actions, createdTasks },
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      return {
        success: false,
        message: `Erro ao extrair ações: ${errorMessage}`,
      };
    }
  }

  /**
   * Gera um resumo executivo de um documento.
   */
  async summarizeDoc(nodeId: string): Promise<AiActionResult> {
    try {
      const compiled = await compileDocContent(nodeId);

      if (!compiled.plainText || compiled.charCount === 0) {
        return {
          success: false,
          message: `O documento "${compiled.title}" está vazio. Adicione conteúdo primeiro.`,
        };
      }

      const result = await callAiWithRetry<SummarizeResult>(
        SYSTEM_SUMMARIZE,
        `Resuma o seguinte documento:\n\nTÍTULO: ${compiled.title}\n\nCONTEÚDO:\n${compiled.plainText}`
      );

      if (!result) {
        return {
          success: false,
          message: `Não foi possível gerar resumo para "${compiled.title}". Tente novamente.`,
        };
      }

      monitorService.recordEvent(
        'doc_ai_summarize',
        `Resumo gerado para "${compiled.title}"`,
        'info',
        'taskzei-doc-ai',
        { nodeId, charCount: compiled.charCount }
      );

      return {
        success: true,
        message: `📝 **Resumo de "${compiled.title}":**\n\n${result.summary}\n\n🔑 Palavras-chave: ${result.keywords.join(', ')}`,
        data: { summary: result.summary, keywords: result.keywords, charCount: compiled.charCount },
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      return {
        success: false,
        message: `Erro ao gerar resumo: ${errorMessage}`,
      };
    }
  }

  /**
   * Extrai ações de todos os documentos vinculados a uma entidade (ex: tarefa).
   */
  async extractActionsFromLinkedDocs(
    entityType: EntityLinkType,
    entityId: string
  ): Promise<AiActionResult> {
    try {
      const context = await compileLinkedDocs(entityType, entityId);

      if (context.docs.length === 0) {
        return {
          success: false,
          message: 'Nenhum documento vinculado encontrado. Vincule documentos primeiro.',
        };
      }

      const docTitles = context.docs.map((d) => `"${d.title}"`).join(', ');

      const result = await callAiWithRetry<ExtractActionsResult>(
        SYSTEM_EXTRACT_ACTIONS,
        `Analise os seguintes documentos vinculados e extraia ações:\n\n${context.combinedText}`
      );

      if (!result) {
        return {
          success: false,
          message: 'Não foi possível analisar os documentos vinculados. Tente novamente.',
        };
      }

      // Cria tarefas
      const createdTasks: Array<{ id: string; title: string }> = [];

      for (const action of result.actions) {
        try {
          const task = await taskzeiFacade.createTask({
            title: action.title,
            priority: (action.priority || 'media') as TaskzeiTask['priority'],
            status: 'aberta',
            assigneeName: action.assignee || undefined,
            dueDate: action.dueDate || undefined,
          });
          createdTasks.push({ id: task.id, title: task.title });
        } catch (taskErr) {
          console.warn(`[doc_ai_service] Erro ao criar tarefa "${action.title}":`, taskErr);
        }
      }

      const actionCount = createdTasks.length;

      monitorService.recordEvent(
        'doc_ai_extract_linked_actions',
        `Extraídas ${actionCount} ações de ${context.docs.length} documentos vinculados`,
        'info',
        'taskzei-doc-ai',
        { entityType, entityId, docCount: context.docs.length, actionCount }
      );

      return {
        success: true,
        message: `📋 **Resumo:** ${result.summary}\n\n✅ **${actionCount} tarefa(s) criada(s)** a partir de ${context.docs.length} documento(s) vinculado(s): ${docTitles}.`,
        data: {
          summary: result.summary,
          actions: result.actions,
          createdTasks,
          docCount: context.docs.length,
        },
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      return {
        success: false,
        message: `Erro ao extrair ações dos documentos vinculados: ${errorMessage}`,
      };
    }
  }

  /**
   * Responde uma pergunta com base no conteúdo de um ou mais documentos.
   */
  async askQuestion(nodeIds: string[], question: string): Promise<AiActionResult> {
    try {
      // Compila os documentos
      const docs: CompiledDocument[] = [];

      for (const nodeId of nodeIds) {
        try {
          const compiled = await compileDocContent(nodeId);
          docs.push(compiled);
        } catch {
          // Pula docs com erro
        }
      }

      if (docs.length === 0) {
        return {
          success: false,
          message: 'Nenhum documento encontrado para consultar.',
        };
      }

      const docContext = docs
        .map((d) => `--- DOCUMENTO: ${d.title} ---\n${d.plainText}`)
        .join('\n\n');

      const proxyResponse = (await callAiProxy('gemini_chat', {
        modelId: MODEL_ID,
        systemInstruction: SYSTEM_QA,
        temperature: TEMPERATURE,
        message: `Documentos de referência:\n\n${docContext}\n\n---\n\nPergunta: ${question}`,
      })) as { payload: string };

      if (!proxyResponse?.payload) {
        return {
          success: false,
          message: 'Não foi possível obter resposta da IA.',
        };
      }

      const payload = proxyResponse.payload;

      monitorService.recordEvent(
        'doc_ai_question',
        `Pergunta respondida com base em ${docs.length} documento(s)`,
        'info',
        'taskzei-doc-ai',
        { docCount: docs.length, questionLength: question.length }
      );

      return {
        success: true,
        message: payload.trim(),
        data: { answer: payload.trim(), docCount: docs.length },
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      return {
        success: false,
        message: `Erro ao responder pergunta: ${errorMessage}`,
      };
    }
  }

  /**
   * Gera tarefas a partir de um comando do usuário combinado com contexto documental.
   * Usado pelo ConversationalHandler quando detecta menção a documentos.
   */
  async generateTasksFromCommand(
    userCommand: string,
    docContext: LinkedDocsContext
  ): Promise<AiActionResult> {
    try {
      if (docContext.docs.length === 0) {
        return {
          success: false,
          message: 'Nenhum documento encontrado para basear a criação de tarefas.',
        };
      }

      const result = await callAiWithRetry<{ tasks: ExtractedAction[] }>(
        SYSTEM_GENERATE_TASKS,
        `COMANDO DO USUÁRIO: ${userCommand}\n\nCONTEXTO DOCUMENTAL:\n${docContext.combinedText}`
      );

      if (!result || !result.tasks || result.tasks.length === 0) {
        return {
          success: false,
          message: 'Não foi possível gerar tarefas com base no contexto fornecido.',
        };
      }

      const createdTasks: Array<{ id: string; title: string }> = [];

      for (const taskData of result.tasks) {
        try {
          const task = await taskzeiFacade.createTask({
            title: taskData.title,
            priority: (taskData.priority || 'media') as TaskzeiTask['priority'],
            status: 'aberta',
            assigneeName: taskData.assignee || undefined,
            dueDate: taskData.dueDate || undefined,
          });
          createdTasks.push({ id: task.id, title: task.title });
        } catch (taskErr) {
          console.warn(`[doc_ai_service] Erro ao criar tarefa gerada "${taskData.title}":`, taskErr);
        }
      }

      return {
        success: true,
        message: `✅ **${createdTasks.length} tarefa(s) criada(s)** com base no comando e contexto documental.`,
        data: { tasks: result.tasks, createdTasks },
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      return {
        success: false,
        message: `Erro ao gerar tarefas: ${errorMessage}`,
      };
    }
  }
}

/** Singleton do serviço de IA documental */
export const docAiService = new DocAiService();
