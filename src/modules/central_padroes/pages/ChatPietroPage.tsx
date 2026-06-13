// ============================================================
// Chat Pietro — Assistente IA da Central de Padrões (T2.3)
// Refatoração UI/UX — 12-06-2026
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { centralPadroesChatPietroService } from '../services/centralPadroesChatPietroService';
import { centralPadroesPermissionService } from '../services/centralPadroesPermissionService';
import { ChatPietroMode, ChatPietroResponse, ChatPietroSource } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatPietroSource[];
  isError?: boolean;
}

const MODE_OPTIONS: { value: ChatPietroMode; label: string }[] = [
  { value: 'buscar_documento', label: 'Buscar documento' },
  { value: 'explicar_padrao', label: 'Explicar padrão' },
  { value: 'comparar_padroes', label: 'Comparar padrões' },
  { value: 'encontrar_lacunas', label: 'Encontrar lacunas' },
  { value: 'checar_canonicidade', label: 'Checar canonicidade' },
  { value: 'checar_responsavel', label: 'Checar responsável' },
  { value: 'checar_riscos', label: 'Checar riscos' },
  { value: 'gerar_relatorio', label: 'Gerar relatório' },
  { value: 'criar_tarefa', label: 'Criar tarefa' },
  { value: 'preparar_validacao', label: 'Preparar validação' },
];

const SUGGESTED_QUESTIONS = [
  'Quais padrões existem sobre segurança?',
  'Me mostra tudo pendente do Rodrigues',
  'O que é canônico operacional?',
  'Quais documentos falam sobre gate visual?',
];

type ChatPietroPageProps = {
  onOpenDocument?: (documentId: string) => void;
};

const ChatPietroPage: React.FC<ChatPietroPageProps> = ({ onOpenDocument }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ChatPietroMode>('buscar_documento');
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (text?: string) => {
    const question = (text || input).trim();
    if (!question || loading) return;

    const userMessage: Message = { role: 'user', content: question };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setShowIntro(false);
    setLoading(true);

    try {
      const role = centralPadroesPermissionService.getCurrentRole();
      const response: ChatPietroResponse = await centralPadroesChatPietroService.ask({ question, mode, userRole: role });
      setMessages((prev) => [...prev, { role: 'assistant', content: response.answer, sources: response.sources }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Desculpe, não consegui processar sua pergunta.\n\n${(err as Error).message}`, isError: true }]);
    } finally { setLoading(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="cp-chat-container">
      {showIntro && messages.length === 0 && (
        <div className="cp-chat-intro">
          <div className="cp-chat-intro-avatar">🧠</div>
          <h2 className="cp-chat-intro-title">Pietro Carboni</h2>
          <p className="cp-chat-intro-desc">
            Curador da Central de Padrões. Pergunte sobre padrões, documentos, decisões, pendências e lacunas da Central de Documentos e Padrões do SagB.
          </p>
          <div className="cp-chat-intro-chips">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button key={q} type="button" className="cp-chat-chip" onClick={() => handleSend(q)}>{q}</button>
            ))}
          </div>
        </div>
      )}

      <div className="cp-chat-header">
        <div className="cp-chat-header-info">
          <h2>💬 Pietro Carboni</h2>
          <p className="cp-chat-subtitle">Assistente da Central de Padrões</p>
        </div>
        <div className="cp-chat-mode-selector">
          <select value={mode} onChange={(e) => setMode(e.target.value as ChatPietroMode)} className="cp-chat-mode-select">
            {MODE_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
          </select>
        </div>
      </div>

      <div className="cp-chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`cp-chat-message cp-chat-message-${msg.role}${msg.isError ? ' cp-chat-message-error' : ''}`}>
            <div className="cp-chat-message-avatar">{msg.role === 'user' ? '👤' : '🧠'}</div>
            <div className="cp-chat-message-bubble">
              <div className="cp-chat-message-text">{msg.content}</div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="cp-chat-sources">
                  <div className="cp-chat-sources-label">🔗 Fontes ({msg.sources.length})</div>
                  {msg.sources.map((source, sIdx) => (
                    <div key={sIdx} className="cp-chat-source-item" onClick={() => onOpenDocument?.(source.documentId)}>
                      <div className="cp-chat-source-title">{source.key} — {source.title}</div>
                      <div className="cp-chat-source-meta">
                        <span className={`cp-visual-badge info`}>{source.status}</span>
                        <span>{source.owner}</span>
                        <span>{Math.round(source.confidence * 100)}% relevante</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="cp-chat-message cp-chat-message-assistant">
            <div className="cp-chat-message-avatar">🧠</div>
            <div className="cp-chat-message-bubble">
              <div className="cp-chat-typing"><span /><span /><span /></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="cp-chat-input-area">
        <textarea
          className="cp-chat-input"
          placeholder="Digite sua pergunta... (Enter para enviar)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          disabled={loading}
        />
        <button className="cp-chat-send-btn" onClick={() => handleSend()} disabled={loading || !input.trim()}>
          {loading ? '⏳' : '➤'}
        </button>
      </div>
    </div>
  );
};

export default ChatPietroPage;
