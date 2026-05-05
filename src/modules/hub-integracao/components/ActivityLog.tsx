import React, { useEffect, useState } from 'react';
import { HubActivityLogEntry } from '../types/integration.types';
import { loggerService } from '../services/loggerService';

const ACTION_LABELS: Record<string, string> = {
  test: 'Teste de Conexão',
  send: 'Envio',
  receive: 'Recebimento',
  config: 'Configuração',
  error: 'Erro',
  health: 'Health Check',
};

const ACTION_ICONS: Record<string, string> = {
  test: '🔌',
  send: '📤',
  receive: '📥',
  config: '⚙️',
  error: '⚠️',
  health: '💓',
};

interface ActivityLogProps {
  integrationId?: string;
  limit?: number;
}

export function ActivityLog({ integrationId, limit = 50 }: ActivityLogProps) {
  const [logs, setLogs] = useState<HubActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await loggerService.getLogs(integrationId, limit);
        setLogs(data);
      } catch (err) {
        console.error('[HubLog] Erro ao carregar logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [integrationId, limit]);

  if (loading) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
        Carregando logs...
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-sm text-gray-400 dark:text-gray-500 py-8 text-center italic">
        Nenhuma atividade registrada ainda.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {logs.map((log) => (
        <div
          key={log.id}
          className="flex items-start gap-3 px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <span className="text-sm mt-0.5">{ACTION_ICONS[log.action] || '📋'}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {ACTION_LABELS[log.action] || log.action}
              </span>
              <span
                className={`px-1.5 py-0.5 text-xs font-medium rounded ${
                  log.status === 'success'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {log.status === 'success' ? '✓ Sucesso' : '✗ Falha'}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={log.summary}>
              {log.summary}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {log.integrationName} · {new Date(log.timestamp).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
