// ============================================================
// Chat Pietro — Página de conversa com IA (T2.3)
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

const ChatPietroPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá! Eu sou o Pietro Carboni, curador da Central de Padrões. Como posso ajudar?\n\nPergunte sobre padrões, documentos, decisões ou peça para encontrar lacunas. Exemplos:\n- "Quais padrões existem sobre segurança?"\n- "Me mostra tudo pendente do Rodrigues"\n- "O que é canônico operacional?"\n- "Quais documentos falam sobre gate visual?"'
    }
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ChatPietroMode>('buscar_documento');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || loading) return;

    const userMessage: Message = { role: 'user', content: question };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const role = centralPadroesPermissionService.getCurrentRole();
      const response: ChatPietroResponse = await centralPadroesChatPietroService.ask({
        question,
        mode,
        userRole: role,
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Desculpe, não consegui processar sua pergunta.\n\n${(err as Error).message}`,
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedAction = async (action: string) => {
    setInput(action);
    // Auto-send after brief delay
    setTimeout(() => {
      const btn = document.querySelector('.cp-chat-send-btn') as HTMLButtonElement;
      btn?.click();
    }, 100);
  };

  return (
    <div className="cp-chat-container">
      <div className="cp-chat-header">
        <div className="cp-chat-header-info">
          <h2>💬 Conversar com Pietro</h2>
          <p className="cp-chat-subtitle">Pergunte sobre padrões, documentos e decisões da Central</p>
        </div>
        <div className="cp-chat-mode-selector">
          <select value={mode} onChange={(e) => setMode(e.target.value as ChatPietroMode)} className="cp-chat-mode-select">
            {MODE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="cp-chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`cp-chat-message cp-chat-message-${msg.role} ${msg.isError ? 'cp-chat-message-error' : ''}`}>
            <div className="cp-chat-message-avatar">
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="cp-chat-message-content">
              <div className="cp-chat-message-text" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="cp-chat-sources">
                  <strong>Fontes encontradas ({msg.sources.length}):</strong>
                  {msg.sources.map((source, sIdx) => (
                    <div key={sIdx} className="cp-chat-source-item" onClick={() => window.dispatchEvent(new CustomEvent('sagb:navigate', { detail: source.route }))}>
                      <div className="cp-chat-source-title">
                        <strong>{source.key}</strong> — {source.title}
                      </div>
                      <div className="cp-chat-source-meta">
                        <span className={`cp-status-badge cp-status-${source.status}`}>{source.status}</span>
                        <span>{source.owner}</span>
                        <span className="cp-chat-source-confidence">{Math.round(source.confidence * 100)}% relevante</span>
                      </div>
                      <div className="cp-chat-source-why">{source.whyMatched}</div>
                      {source.allowedActions.length > 0 && (
                        <div className="cp-chat-source-actions">
                          {source.allowedActions.includes('abrir') && (
                            <button className="cp-chat-source-action-btn" onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('sagb:navigate', { detail: source.route })); }}>Abrir</button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="cp-chat-message cp-chat-message-assistant">
            <div className="cp-chat-message-avatar">🤖</div>
            <div className="cp-chat-message-content">
              <div className="cp-chat-typing">Pietro está pensando...</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="cp-chat-input-area">
        <textarea
          className="cp-chat-input"
          placeholder="Digite sua pergunta para o Pietro..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          disabled={loading}
        />
        <button className="cp-chat-send-btn" onClick={handleSend} disabled={loading || !input.trim()}>
          {loading ? '⏳' : '➤'}
        </button>
      </div>
    </div>
  );
};

export default ChatPietroPage;
