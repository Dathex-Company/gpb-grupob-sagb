/**
 * SalaDevCommands
 *
 * Parser e handler de comandos com contexto para o chat da Sala Dev.
 * Comandos disponíveis:
 *
 *   /help       — Lista todos os comandos disponíveis
 *   /limpar     — Limpa o histórico do chat
 *   /contexto   — Mostra o contexto atual (runId, projeto, etapa)
 *   /analisar   — Analisa um trecho de código ou arquivo
 *   /resumir    — Resume a conversa até aqui
 *   /explicar   — Explica um conceito técnico
 */

import type { SalaDevChatMessage } from './SalaDevLlmService';

export type CommandResult =
  | { type: 'passthrough'; text: string }
  | { type: 'system_message'; content: string }
  | { type: 'override_response'; content: string }
  | { type: 'command_not_found'; text: string };

interface CommandContext {
  runId?: string;
  projectName?: string;
  currentStage?: string;
  messageCount: number;
}

const COMMANDS: Array<{
  name: string;
  aliases: string[];
  description: string;
  usage: string;
  handler: (args: string, ctx: CommandContext) => string;
}> = [
  {
    name: 'help',
    aliases: ['ajuda', 'comandos', '?'],
    description: 'Lista todos os comandos disponíveis.',
    usage: '/help',
    handler: () => buildHelpText(),
  },
  {
    name: 'limpar',
    aliases: ['clear', 'clean', 'reset'],
    description: 'Limpa todo o histórico do chat.',
    usage: '/limpar',
    handler: () => '🗑️ Histórico do chat foi limpo.',
  },
  {
    name: 'contexto',
    aliases: ['context', 'status', 'info'],
    description: 'Exibe o contexto atual da Sala Dev.',
    usage: '/contexto',
    handler: (_args, ctx) => buildContextText(ctx),
  },
  {
    name: 'analisar',
    aliases: ['analise', 'analyze', 'review'],
    description: 'Analisa um trecho de código enviado após o comando.',
    usage: '/analisar\n```\nseu código aqui\n```',
    handler: (args) => {
      if (!args.trim()) {
        return '⚠️ Envie o código após o comando `/analisar`.\n\nExemplo:\n```\n/analisar\nfunction soma(a, b) { return a + b; }\n```';
      }
      return '';
    },
  },
  {
    name: 'resumir',
    aliases: ['sumario', 'summary', 'resume'],
    description: 'Gera um resumo da conversa até agora.',
    usage: '/resumir',
    handler: (_args, ctx) => {
      if (ctx.messageCount <= 2) {
        return '📭 Ainda não há mensagens suficientes para resumir. Continue conversando primeiro.';
      }
      return '';
    },
  },
  {
    name: 'explicar',
    aliases: ['explain', 'o-que-e', 'conceito'],
    description: 'Explica um conceito técnico. Ex: /explicar Zustand',
    usage: '/explicar <termo>',
    handler: (args) => {
      if (!args.trim()) {
        return '⚠️ Diga o que deseja que eu explique.\n\nExemplo: `/explicar o que é Zustand`';
      }
      return '';
    },
  },
];

function buildHelpText(): string {
  const lines = [
    '## 🤖 Comandos da Sala Dev\n',
    '| Comando | Descrição |',
    '|---|---|',
  ];
  for (const cmd of COMMANDS) {
    lines.push(`| \`${cmd.usage}\` | ${cmd.description} |`);
  }
  lines.push(
    '\n> 💡 Dica: comandos também funcionam com apelidos como `/ajuda`, `/clear`, `/analise`.',
    '> 💡 Para comandos que aceitam argumentos, digite o comando e o conteúdo na linha seguinte.',
  );
  return lines.join('\n');
}

function buildContextText(ctx: CommandContext): string {
  const lines = [
    '## 📋 Contexto Atual da Sala Dev\n',
    '| Item | Valor |',
    '|---|---|',
    `| Projeto | ${ctx.projectName || '—'}`,
    `| Run ID | ${ctx.runId || '—'}`,
    `| Etapa | ${ctx.currentStage || '—'}`,
    `| Mensagens no chat | ${ctx.messageCount}`,
    '',
    '> ℹ️  O contexto é atualizado automaticamente sempre que uma nova esteira é iniciada.',
  ];
  return lines.join('\n');
}

/**
 * Detecta se a mensagem começa com um comando conhecido.
 * Se sim, processa o comando e retorna o resultado.
 * Se não, retorna `passthrough` para enviar a mensagem normalmente ao LLM.
 */
export function parseCommand(
  text: string,
  context: CommandContext,
): CommandResult {
  const trimmed = text.trim();

  // Verifica se começa com /
  if (!trimmed.startsWith('/')) {
    return { type: 'passthrough', text: trimmed };
  }

  // Extrai comando e argumentos
  const firstSpace = trimmed.indexOf(' ');
  const cmdRaw = firstSpace === -1 ? trimmed.slice(1).toLowerCase() : trimmed.slice(1, firstSpace).toLowerCase();
  const args = firstSpace === -1 ? '' : trimmed.slice(firstSpace + 1).trim();

  // Procura o comando
  const command = COMMANDS.find(
    (c) => c.name === cmdRaw || c.aliases.includes(cmdRaw),
  );

  if (!command) {
    return {
      type: 'command_not_found',
      text: trimmed,
    };
  }

  if (command.name === 'limpar') {
    return { type: 'system_message', content: command.handler(args, context) };
  }

  if (command.name === 'help' || command.name === 'contexto') {
    return { type: 'override_response', content: command.handler(args, context) };
  }

  // analisar, resumir, explicar — passam para o LLM com contexto aumentado
  if (command.name === 'analisar' && args.trim()) {
    // Envia o código para análise via LLM (a mensagem será processada normalmente)
    return { type: 'passthrough', text: trimmed };
  }

  if (command.name === 'resumir' || command.name === 'explicar') {
    const result = command.handler(args, context);
    if (result) {
      // Se o handler retornou uma mensagem de aviso/instrução, exibe direto
      return { type: 'system_message', content: result };
    }
    // Senão, passa para o LLM responder
    return { type: 'passthrough', text: trimmed };
  }

  // Fallback: passa como texto normal
  return { type: 'passthrough', text: trimmed };
}

/**
 * Retorna a lista de comandos disponíveis (para uso em UI).
 */
export function getAvailableCommands() {
  return COMMANDS.map((c) => ({
    name: c.name,
    usage: c.usage,
    description: c.description,
    aliases: c.aliases,
  }));
}
