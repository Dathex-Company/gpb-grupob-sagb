import React, { useState, useEffect } from 'react';
import { integrationHub } from '../services/integrationService';
import { Integration } from '../types/integration.types';

export function HubIntegracaoPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    integrationHub.listIntegrations()
      .then(data => {
        setIntegrations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load integrations', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-[#0B0F19]">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hub de Integrações</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gerenciamento centralizado de conexões e credenciais
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Catálogo de Integrações
          </h2>
          
          {loading ? (
            <div className="text-gray-500">Carregando integrações...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.map(integration => (
                <div 
                  key={integration.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-md p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{integration.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        integration.status === 'active' ? 'bg-green-100 text-green-800' : 
                        integration.status === 'error' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {integration.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Provedor: {integration.provider}
                    </p>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    Usado por: {integration.usedBy.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
