import React, { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { createSalaDevLlmService, SalaDevChatMessage } from '../services/SalaDevLlmService';
import { saveChatHistory, loadChatHistory, clearChatHistory, getChatHistoryMeta } from '../services/salaDevChatStorage';
import { parseCommand, getAvailableCommands } from '../services/salaDevCommands';

interface SalaDevChatPanelProps {
  context?: {
    runId?: string;
    projectName?: string;
    currentStage?: string;
  };
}

interface LocalChatMessage extends SalaDevChatMessage {
  id: string;
  createdAt: Date;
}

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const DEFAULT_SUGGESTIONS = [
  'Organize um plano técnico para este projeto',
  'Quais riscos técnicos devo validar primeiro?',
  'Que agentes da Sala Dev deveriam participar?',
];

const WELCOME_MESSAGE: LocalChatMessage = {
  id: createId('assistant'),
  role: 'assistant',
  content: `Olá. Sou o chat IA independente da Sala Dev. Posso ajudar a transformar o projeto **atual** em plano técnico, mapear riscos, estruturar tarefas e preparar próximos passos.

Digite \`/help\` para ver os comandos disponíveis.`,
  createdAt: new Date(),
};

export const SalaDevChatPanel: React.FC<SalaDevChatPanelProps> = ({ context }) => {
  const llmService = useMemo(() => createSalaDevLlmService(), []);
  const [messages, setMessages] = useState<LocalChatMessage[]>(() => {
    const saved = loadChatHistory();
    if (saved.length > 0) {
      return saved.map((msg) => ({
        ...msg,
        id: msg.id || createId(msg.role),
        createdAt: msg.createdAt instanceof Date ? msg.createdAt : new Date(),
      })) as LocalChatMessage[];
    }
    return [WELCOME_MESSAGE];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const [showCommands, setShowCommands] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Salva histórico sempre que mudar
  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);

  // Scrolla para o final
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const messageCount = messages.filter((m) => m.role !== 'system').length;

  const buildContextMessage = useCallback((): SalaDevChatMessage => ({
    role: 'system',
    content: [
      'Contexto atual da Sala Dev:',
      `- Run ID: ${context?.runId || 'não iniciado'}`,
      `- Projeto: ${context?.projectName || 'não informado'}`,
      `- Etapa atual: ${context?.currentStage || 'não informado'}`,
    ].join('\n'),
  }), [context]);

  const processAndSendMessage = async (text: string) => {
    const cmdResult = parseCommand(text, {
      runId: context?.runId,
      projectName: context?.projectName,
      currentStage: context?.currentStage,
      messageCount,
    });

    // Comando não encontrado — envia como texto normal com aviso
    if (cmdResult.type === 'command_not_found') {
      const warningMsg: LocalChatMessage = {
        id: createId('system'),
        role: 'assistant',
        content: `❓ Comando não reconhecido. Digite \`/help\` para ver os comandos disponíveis.`,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, warningMsg]);
      return;
    }

    // Comando do tipo system_message (ex: /limpar, /help com validação)
    if (cmdResult.type === 'system_message') {
      if (text.trim() === '/limpar' || text.trim() === '/clear' || text.trim() === '/clean') {
        clearChatHistory();
        setMessages([WELCOME_MESSAGE]);
        setSuggestions(DEFAULT_SUGGESTIONS);
        return;
      }
      const sysMsg: LocalChatMessage = {
        id: createId('system'),
        role: 'assistant',
        content: cmdResult.content,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, sysMsg]);
      return;
    }

    // Comando do tipo override_response (ex: /help, /contexto)
    if (cmdResult.type === 'override_response') {
      const overrideMsg: LocalChatMessage = {
        id: createId('assistant'),
        role: 'assistant',
        content: cmdResult.content,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, overrideMsg]);
      return;
    }

    // Passthrough — envia a mensagem para o LLM
    const textToSend = cmdResult.text || text;

    const userMessage: LocalChatMessage = {
      id: createId('user'),
      role: 'user',
      content: textToSend,
      createdAt: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);
    setError(null);

    try {
      const result = await llmService.sendMessage([
        buildContextMessage(),
        ...nextMessages.map((m) => ({ role: m.role, content: m.content })),
      ]);

      const assistantMessage: LocalChatMessage = {
        id: createId('assistant'),
        role: 'assistant',
        content: result.content,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Gera sugestões automaticamente (apenas para mensagens normais)
      try {
        const aiSuggestions = await llmService.suggestNextSteps(
          [...nextMessages, assistantMessage].map((m) => `${m.role}: ${m.content}`).join('\n\n'),
        );
        if (aiSuggestions.length > 0) setSuggestions(aiSuggestions.slice(0, 3));
      } catch {
        setSuggestions(DEFAULT_SUGGESTIONS);
      }
    } catch (err) {
      setError((err as Error).message || 'Falha ao conversar com a IA.');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = async (event?: FormEvent, forcedText?: string) => {
    event?.preventDefault();
    const text = (forcedText || input).trim();
    if (!text || isLoading) return;

    setInput('');
    await processAndSendMessage(text);
  };

  const handleClear = () => {
    clearChatHistory();
    setMessages([WELCOME_MESSAGE]);
    setSuggestions(DEFAULT_SUGGESTIONS);
    setError(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  };

  const { count: historyCount, lastDate: historyLastDate } = getChatHistoryMeta();

  return (
    <div className="flex h-full flex-col bg-[#0F172A] text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-[#0B1121] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">Chat IA</p>
            <h3 className="text-sm font-black text-white">Assistente independente da Sala Dev</h3>
          </div>
          <div className="flex items-center gap-2">
            {historyCount > 0 && (
              <span className="hidden rounded-full border border-slate-600 bg-slate-800 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-slate-400 sm:inline-block">
                {historyCount} msgs
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowCommands(!showCommands)}
              className="rounded-full border border-slate-700 bg-slate-800 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-cyan-300 transition-colors hover:border-cyan-700 hover:text-cyan-200"
              title="Comandos disponíveis"
            >
              /cmd
            </button>
            {messages.length > 1 && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-full border border-red-800/30 bg-red-900/20 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-red-300 transition-colors hover:border-red-600 hover:text-red-200"
                title="Limpar histórico"
              >
                Limpar
              </button>
            )}
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-300">
              Local
            </span>
          </div>
        </div>

        {/* Painel de comandos */}
        {showCommands && (
          <div className="mt-3 rounded-xl border border-cyan-800/30 bg-cyan-900/10 p-3">
            <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-cyan-400">Comandos disponíveis</p>
            <div className="space-y-1">
              {getAvailableCommands().map((cmd) => (
                <div key={cmd.name} className="flex items-start gap-2 text-[11px]">
                  <code className="whitespace-nowrap rounded bg-slate-800 px-1.5 py-0.5 font-mono text-cyan-300">
                    {cmd.usage}
                  </code>
                  <span className="text-slate-400">{cmd.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lista de mensagens */}
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === 'user'
                ? 'ml-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-3'
                : 'mr-6 rounded-2xl border border-slate-700 bg-slate-800/55 p-3'
            }
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                {message.role === 'user' ? 'Você' : 'Assistente'}
              </span>
              <span className="text-[9px] text-slate-600">
                {message.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="prose prose-invert prose-xs max-w-none text-sm leading-relaxed text-slate-100 prose-pre:border prose-pre:border-slate-700 prose-pre:bg-[#0B1121]">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="mr-6 rounded-2xl border border-slate-700 bg-slate-800/55 p-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              IA pensando...
            </span>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
            {error}
          </div>
        )}
      </div>

      {/* Sugestões + Input */}
      <div className="border-t border-slate-800 bg-[#0B1121] p-3">
        {suggestions.length > 0 && !isLoading && (
          <div className="mb-3 space-y-1.5">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => void handleSubmit(undefined, suggestion)}
                disabled={isLoading}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-left text-[11px] font-bold text-slate-300 transition-colors hover:border-cyan-700 hover:text-cyan-200 disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={(event) => void handleSubmit(event)} className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[44px] flex-1 resize-none rounded-xl border border-slate-700 bg-[#0F172A] px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
            placeholder="Digite um comando ou pergunta... (/help para lista)"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};
