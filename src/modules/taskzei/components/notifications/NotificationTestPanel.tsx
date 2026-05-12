// src/modules/taskzei/components/notifications/NotificationTestPanel.tsx
// Painel de teste de notificações TaskZei — permite disparar notificações de teste
// para validar o fluxo: frontend → Netlify Function → Resend/SendGrid/OneSignal

import React, { useState } from 'react';
import { TaskzeiNotificationService, TaskzeiNotificationEvent } from '../../services/taskzei_notification.service';

type TestStatus = 'idle' | 'sending' | 'success' | 'error';

const EVENT_OPTIONS: { value: TaskzeiNotificationEvent; label: string; description: string }[] = [
  { value: 'task_created', label: 'Tarefa Criada', description: 'Dispara notificação de nova tarefa atribuída' },
  { value: 'status_changed', label: 'Status Alterado', description: 'Dispara notificação de mudança de status' },
  { value: 'due_reminder', label: 'Lembrete de Prazo', description: 'Dispara notificação de vencimento próximo' },
];

export const NotificationTestPanel: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<TaskzeiNotificationEvent>('task_created');
  const [overrideEmail, setOverrideEmail] = useState('');
  const [status, setStatus] = useState<TestStatus>('idle');
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [resultDetails, setResultDetails] = useState<string | null>(null);
  const [focusField, setFocusField] = useState<string | null>(null);

  const handleSendTest = async () => {
    setStatus('sending');
    setResultMessage(null);
    setResultDetails(null);

    try {
      const response = await TaskzeiNotificationService.sendTestNotification(
        selectedEvent,
        overrideEmail.trim() || undefined
      );

      if (response.success) {
        setStatus('success');
        setResultMessage('Notificação de teste enviada com sucesso!');
        setResultDetails(
          response.details
            ? JSON.stringify(response.details, null, 2)
            : null
        );
      } else {
        setStatus('error');
        setResultMessage(response.error || 'Falha ao enviar notificação de teste.');
        setResultDetails(
          response.details
            ? JSON.stringify(response.details, null, 2)
            : null
        );
      }
    } catch (err) {
      setStatus('error');
      setResultMessage(err instanceof Error ? err.message : 'Erro inesperado ao enviar notificação.');
    }
  };

  const statusIcon = () => {
    switch (status) {
      case 'sending':
        return (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--sagb-primary)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--sagb-red)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const inputStyle = (fieldName: string): React.CSSProperties => ({
    width: '100%',
    border: `1px solid ${focusField === fieldName ? 'var(--sagb-blue)' : 'var(--sagb-line)'}`,
    borderRadius: 'var(--sagb-radius-lg)',
    padding: '8px 12px',
    fontSize: '13px',
    backgroundColor: 'var(--sagb-surface)',
    color: 'var(--sagb-text)',
    outline: 'none',
    opacity: status === 'sending' ? 0.5 : 1,
    cursor: status === 'sending' ? 'not-allowed' : 'default',
    transition: 'border-color 0.15s ease',
  });

  return (
    <div
      style={{
        border: '1px solid var(--sagb-line)',
        borderRadius: 'var(--sagb-radius-xl)',
        backgroundColor: 'var(--sagb-surface)',
        overflow: 'hidden',
        fontFamily: "'Rubik', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--sagb-line)',
          backgroundColor: 'var(--sagb-bg)',
        }}
      >
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4" style={{ color: 'var(--sagb-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--sagb-primary)' }}>
            Teste de Notificações
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Seletor de Evento */}
        <div>
          <label
            className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: 'var(--sagb-muted)' }}
          >
            Tipo de Evento
          </label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value as TaskzeiNotificationEvent)}
            disabled={status === 'sending'}
            style={{
              ...inputStyle('event'),
              appearance: 'auto',
            }}
          >
            {EVENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <p className="text-[11px] mt-1" style={{ color: 'var(--sagb-muted)' }}>
            {EVENT_OPTIONS.find((o) => o.value === selectedEvent)?.description}
          </p>
        </div>

        {/* Override de E-mail */}
        <div>
          <label
            className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: 'var(--sagb-muted)' }}
          >
            E-mail de Teste (opcional)
          </label>
          <input
            type="email"
            value={overrideEmail}
            onChange={(e) => setOverrideEmail(e.target.value)}
            placeholder="seu@email.com"
            disabled={status === 'sending'}
            style={inputStyle('email')}
            onFocus={() => setFocusField('email')}
            onBlur={() => setFocusField(null)}
          />
          <p className="text-[11px] mt-1" style={{ color: 'var(--sagb-muted)' }}>
            Se vazio, usará o e-mail vinculado ao assignee da tarefa (modo real).
          </p>
        </div>

        {/* Botão de Envio */}
        <button
          onClick={handleSendTest}
          disabled={status === 'sending'}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all"
          style={{
            backgroundColor: status === 'sending' ? 'var(--sagb-muted)' : 'var(--sagb-primary)',
            color: status === 'sending' ? 'var(--sagb-text)' : '#FFFFFF',
            opacity: status === 'sending' ? 0.5 : 1,
            cursor: status === 'sending' ? 'not-allowed' : 'pointer',
            border: 'none',
          }}
        >
          {statusIcon()}
          {status === 'sending' ? 'Enviando...' : 'Enviar Notificação de Teste'}
        </button>

        {/* Resultado */}
        {resultMessage && (
          <div
            className="rounded-lg p-3 text-[12px]"
            style={
              status === 'success'
                ? {
                    border: '1px solid var(--sagb-primary)',
                    backgroundColor: 'color-mix(in srgb, var(--sagb-primary) 6%, transparent)',
                    color: 'var(--sagb-text)',
                  }
                : {
                    border: '1px solid var(--sagb-red)',
                    backgroundColor: 'color-mix(in srgb, var(--sagb-red) 6%, transparent)',
                    color: 'var(--sagb-text)',
                  }
            }
          >
            <div className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0">{statusIcon()}</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{resultMessage}</p>
                {resultDetails && (
                  <pre
                    className="mt-2 text-[11px] whitespace-pre-wrap font-mono overflow-x-auto"
                    style={{ opacity: 0.75, color: 'var(--sagb-text)' }}
                  >
                    {resultDetails}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
