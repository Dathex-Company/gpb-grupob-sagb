import React from 'react';
import { Integration } from '../types/integration.types';

interface IntegrationCatalogProps {
  integrations: Integration[];
  onConfigure: (integration: Integration) => void;
  onTest: (integration: Integration) => void;
}

const PROVIDER_ICONS: Record<string, string> = {
  whatsapp: '💬',
  clickup: '📋',
  gmail: '📧',
  titan: '📧',
  meta_facebook: '👍',
  'google-calendar': '📅',
  supabase: '🗄️',
};

export function IntegrationCatalog({ integrations, onConfigure, onTest }: IntegrationCatalogProps) {
  return (
    <div>
      {integrations.length === 0 ? (
        <div className="text-gray-500 text-sm py-8 text-center">
          Nenhuma integração disponível no catálogo.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col justify-between bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{PROVIDER_ICONS[integration.provider] || '🔌'}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{integration.name}</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      integration.status === 'active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : integration.status === 'error'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {integration.status === 'active'
                      ? 'Ativo'
                      : integration.status === 'error'
                      ? 'Erro'
                      : 'Inativo'}
                  </span>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Provedor: <span className="font-mono text-xs">{integration.provider}</span>
                </p>

                {integration.lastTestedAt && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                    Último teste: {new Date(integration.lastTestedAt).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  Usado por: {integration.usedBy.length > 0
                    ? integration.usedBy.join(', ')
                    : 'Nenhum módulo'}
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => onConfigure(integration)}
                    className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors"
                  >
                    Configurar
                  </button>
                  <button
                    onClick={() => onTest(integration)}
                    disabled={integration.status === 'inactive'}
                    className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Testar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
