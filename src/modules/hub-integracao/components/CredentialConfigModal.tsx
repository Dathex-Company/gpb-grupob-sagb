import React, { useState } from 'react';
import { Integration, ConnectionConfig } from '../types/integration.types';

interface CredentialConfigModalProps {
  integration: Integration;
  onSave: (config: ConnectionConfig) => Promise<void>;
  onRunTest: (integrationId: string) => Promise<boolean>;
  onClose: () => void;
}

const CREDENTIAL_FIELDS: Record<string, { key: string; label: string; type: string }[]> = {
  whatsapp: [
    { key: 'accessToken', label: 'Access Token (Meta)', type: 'password' },
    { key: 'phoneNumberId', label: 'Phone Number ID', type: 'text' },
    { key: 'webhookVerifyToken', label: 'Webhook Verify Token', type: 'text' },
  ],
  clickup: [
    { key: 'apiToken', label: 'API Token', type: 'password' },
    { key: 'listId', label: 'List ID (padrão)', type: 'text' },
  ],
  gmail: [
    { key: 'clientId', label: 'Client ID (Google)', type: 'text' },
    { key: 'clientSecret', label: 'Client Secret', type: 'password' },
    { key: 'refreshToken', label: 'Refresh Token', type: 'password' },
    { key: 'accountEmail', label: 'E-mail da Conta', type: 'text' },
  ],
  titan: [
    { key: 'apiKey', label: 'API Key (Titan)', type: 'password' },
    { key: 'accountEmail', label: 'E-mail da Conta', type: 'text' },
  ],
  meta_facebook: [
    { key: 'accessToken', label: 'Access Token (Meta)', type: 'password' },
    { key: 'pageId', label: 'Page ID', type: 'text' },
  ],
};

export function CredentialConfigModal({ integration, onSave, onRunTest, onClose }: CredentialConfigModalProps) {
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [advanced, setAdvanced] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [resultType, setResultType] = useState<'success' | 'error' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fields = CREDENTIAL_FIELDS[integration.provider] || [];

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setResultMessage(null);
    setResultType(null);
    try {
      const provider = integration.provider;
      let payload = { ...credentials };

      // UX simplificado (Outlook-like): e-mail + senha como modo rápido
      // Mantém compatibilidade com contratos existentes do Hub.
      if (provider === 'gmail') {
        payload = {
          ...payload,
          accountEmail: payload.accountEmail || payload.email || '',
          password: payload.password || '',
          // compatibilidade com pipeline antigo
          clientId: payload.clientId || '',
          clientSecret: payload.clientSecret || '',
          refreshToken: payload.refreshToken || '',
        };
      }

      if (provider === 'titan') {
        payload = {
          ...payload,
          accountEmail: payload.accountEmail || payload.email || '',
          password: payload.password || payload.apiKey || '',
          apiKey: payload.apiKey || payload.password || '',
        };
      }

      await onSave({
        integrationId: integration.id,
        credentials: payload,
      });

      setTesting(true);
      const connected = await onRunTest(integration.id);

      if (connected) {
        setResultType('success');
        setResultMessage('Conectado com sucesso.');
        onClose();
      } else {
        setResultType('error');
        setResultMessage('Credenciais salvas, mas a conexão falhou no teste. Revise os dados e tente novamente.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar credenciais');
    } finally {
      setTesting(false);
      setSaving(false);
    }
  };

  const isEmailProvider = integration.provider === 'gmail' || integration.provider === 'titan';

  const isComplete = isEmailProvider
    ? Boolean((credentials.accountEmail || credentials.email || '').trim() && (credentials.password || '').trim())
    : fields.every((f) => credentials[f.key]?.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Configurar: {integration.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {!isEmailProvider && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Provedor: <span className="font-mono text-xs">{integration.provider}</span>
          </p>
        )}

        {isEmailProvider ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                E-mail da conta
              </label>
              <input
                type="email"
                value={credentials.accountEmail || credentials.email || ''}
                onChange={(e) =>
                  setCredentials((prev) => ({ ...prev, accountEmail: e.target.value, email: e.target.value }))
                }
                placeholder="seuemail@empresa.com"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={credentials.password || ''}
                onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Digite sua senha"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={() => setAdvanced((v) => !v)}
              className="text-xs text-blue-600 hover:underline"
            >
              {advanced ? 'Ocultar configuração avançada' : 'Configuração avançada (IMAP/SMTP)'}
            </button>

            {advanced && (
              <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                {[
                  { key: 'imapHost', label: 'IMAP Host', type: 'text' },
                  { key: 'imapPort', label: 'IMAP Porta', type: 'text' },
                  { key: 'smtpHost', label: 'SMTP Host', type: 'text' },
                  { key: 'smtpPort', label: 'SMTP Porta', type: 'text' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={credentials[field.key] || ''}
                      onChange={(e) => setCredentials((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={`Insira ${field.label.toLowerCase()}`}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={credentials[field.key] || ''}
                  onChange={(e) =>
                    setCredentials((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  placeholder={`Insira ${field.label.toLowerCase()}`}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">
            {error}
          </p>
        )}

        {resultMessage && (
          <p className={`mt-3 text-sm px-3 py-2 rounded-md ${
            resultType === 'success'
              ? 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20'
              : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
          }`}>
            {resultMessage}
          </p>
        )}

        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!isComplete || saving || testing}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Salvando...' : testing ? 'Testando conexão...' : 'Salvar e Testar Conexão'}
          </button>
        </div>
      </div>
    </div>
  );
}
