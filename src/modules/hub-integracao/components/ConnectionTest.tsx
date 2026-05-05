import React, { useState } from 'react';
import { Integration } from '../types/integration.types';

interface ConnectionTestProps {
  integration: Integration;
  onRunTest: (integrationId: string) => Promise<boolean>;
  onClose: () => void;
}

export function ConnectionTest({ integration, onRunTest, onClose }: ConnectionTestProps) {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTest = async () => {
    setTesting(true);
    setResult(null);
    try {
      const success = await onRunTest(integration.id);
      setResult({
        success,
        message: success
          ? 'Conexão estabelecida com sucesso!'
          : 'Falha ao conectar. Verifique as credenciais.',
      });
    } catch (err) {
      setResult({
        success: false,
        message: `Erro: ${err instanceof Error ? err.message : 'Erro desconhecido'}`,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Testar Conexão
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Integração: <span className="font-medium">{integration.name}</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Provedor: {integration.provider}
          </p>
        </div>

        {!result ? (
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3">
              <span className="text-2xl">🔌</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
              Clique no botão abaixo para testar a conectividade com o provedor
              <span className="font-mono text-xs block mt-1">{integration.provider}</span>
            </p>
            <button
              onClick={handleTest}
              disabled={testing}
              className="px-6 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {testing ? 'Testando...' : 'Executar Teste'}
            </button>
          </div>
        ) : (
          <div className={`p-4 rounded-md mb-4 ${
            result.success
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{result.success ? '✅' : '❌'}</span>
              <span className={`font-medium text-sm ${
                result.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
              }`}>
                {result.success ? 'Conectado' : 'Falha na Conexão'}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 ml-8">
              {result.message}
            </p>
          </div>
        )}

        <div className="flex gap-3 mt-2">
          {result && (
            <button
              onClick={handleTest}
              disabled={testing}
              className="flex-1 px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Testar Novamente
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
