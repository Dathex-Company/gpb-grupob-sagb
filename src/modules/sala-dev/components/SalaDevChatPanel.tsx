import React, { FormEvent, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { createSalaDevLlmService, SalaDevChatMessage } from '../services/SalaDevLlmService';

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

export const SalaDevChatPanel: React.FC<SalaDevChatPanelProps> = ({ context }) => {
  const llmService = useMemo(() => createSalaDevLlmService(), []);
  const [messages, setMessages] = useState<LocalChatMessage[]>(() => [
    {
      id: createId('assistant'),
      role: 'assistant',
      content: `Olá. Sou o chat IA independente da Sala Dev. Posso ajudar a transformar o projeto **${context?.projectName || 'atual'}** em plano técnico, mapear riscos, estruturar tarefas e preparar próximos passos.`,
      createdAt: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const buildContextMessage = (): SalaDevChatMessage => ({
    role: 'system',
    content: [
      'Contexto atual da Sala Dev:',
      `- Run ID: ${context?.runId || 'não iniciado'}`,
      `- Projeto: ${context?.projectName || 'não informado'}`,
      `- Etapa atual: ${context?.currentStage || 'não informado'}`,
    ].join('\n'),
  });

  const handleSubmit = async (event?: FormEvent, forcedText?: string) => {
    event?.preventDefault();
    const text = (forcedText || input).trim();
    if (!text || isLoading) return;

    setInput('');
    setError(null);

    const userMessage: LocalChatMessage = {
      id: createId('user'),
      role: 'user',
      content: text,
      createdAt: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const result = await llmService.sendMessage([
        buildContextMessage(),
        ...nextMessages.map((message) => ({ role: message.role, content: message.content })),
      ]);

      const assistantMessage: LocalChatMessage = {
        id: createId('assistant'),
        role: 'assistant',
        content: result.content,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      try {
        const aiSuggestions = await llmService.suggestNextSteps(
          [...nextMessages, assistantMessage].map((message) => `${message.role}: ${message.content}`).join('\n\n'),
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

  return (
    <div className="flex h-full flex-col bg-[#0F172A] text-white">
      <div className="border-b border-slate-800 bg-[#0B1121] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">Chat IA</p>
            <h3 className="text-sm font-black text-white">Assistente independente da Sala Dev</h3>
          </div>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-300">
            Local
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
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

      <div className="border-t border-slate-800 bg-[#0B1121] p-3">
        {suggestions.length > 0 && (
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
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                void handleSubmit();
              }
            }}
            className="min-h-[44px] flex-1 resize-none rounded-xl border border-slate-700 bg-[#0F172A] px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
            placeholder="Digite um comando ou pergunta para a Sala Dev..."
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
