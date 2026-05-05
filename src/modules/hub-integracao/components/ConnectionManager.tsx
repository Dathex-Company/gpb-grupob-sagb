import React from 'react';
import { Integration } from '../types/integration.types';
import { ProviderBadge } from './ProviderBadge';

interface ConnectionManagerProps {
  integrations: Integration[];
  onConfigure: (integration: Integration) => void;
  onRevoke: (integration: Integration) => void;
}

export function ConnectionManager({ integrations, onConfigure, onRevoke }: ConnectionManagerProps) {
  const activeIntegrations = integrations.filter((i) => i.status !== 'inactive');
  const inactiveIntegrations = integrations.filter((i) => i.status === 'inactive');

  return (
    <div className="space-y-4">
      {/* Conexões Ativas */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
          Conexões Ativas ({activeIntegrations.length})
        </h3>
        {activeIntegrations.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">
            Nenhuma conexão ativa no momento.
          </p>
        ) : (
          <div className="space-y-2">
            {activeIntegrations.map((integration) => (
              <div
                key={integration.id}
                className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      integration.status === 'active'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {integration.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {integration.provider} · Versão: {integration.usedBy.join(', ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {integration.lastTestedAt
                      ? `Testado: ${new Date(integration.lastTestedAt).toLocaleDateString('pt-BR')}`
                      : 'Não testado'}
                  </span>
                  <button
                    onClick={() => onConfigure(integration)}
                    className="px-3 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onRevoke(integration)}
                    className="px-3 py-1 text-xs font-medium rounded-md bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 transition-colors"
                  >
                    Revogar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conexões Inativas (disponíveis para configurar) */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
          Disponíveis para Configurar ({inactiveIntegrations.length})
        </h3>
        {inactiveIntegrations.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">
            Todas as integrações disponíveis já foram configuradas.
          </p>
        ) : (
          <div className="space-y-2">
            {inactiveIntegrations.map((integration) => (
              <div
                key={integration.id}
                className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {integration.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {integration.provider}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onConfigure(integration)}
                  className="px-3 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 transition-colors"
                >
                  Configurar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
