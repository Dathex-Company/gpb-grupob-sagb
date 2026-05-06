import React, { useState, useEffect, useCallback } from 'react';
import { integrationHub } from '../services/integrationService';
import { Integration, ConnectionConfig, HubWhatsAppQrStatus } from '../types/integration.types';
import { IntegrationCatalog } from '../components/IntegrationCatalog';
import { ConnectionManager } from '../components/ConnectionManager';
import { ConnectionTest } from '../components/ConnectionTest';
import { ActivityLog } from '../components/ActivityLog';
import { CredentialConfigModal } from '../components/CredentialConfigModal';

type ActiveTab = 'catalog' | 'connections' | 'activity';

export function HubIntegracaoPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('catalog');

  // Modals
  const [configuringIntegration, setConfiguringIntegration] = useState<Integration | null>(null);
  const [testingIntegration, setTestingIntegration] = useState<Integration | null>(null);

  // Stats
  const [stats, setStats] = useState({
    active: 0,
    inactive: 0,
    error: 0,
  });

  // WhatsApp QR
  const [qrSessionId] = useState('default');
  const [qrStatus, setQrStatus] = useState<HubWhatsAppQrStatus | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  const fetchIntegrations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await integrationHub.listIntegrations();
      setIntegrations(data);
      setStats({
        active: data.filter((i) => i.status === 'active').length,
        inactive: data.filter((i) => i.status === 'inactive').length,
        error: data.filter((i) => i.status === 'error').length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar integrações');
      console.error('[Hub] Failed to load integrations', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  const refreshQrStatus = useCallback(async () => {
    setQrLoading(true);
    try {
      const status = await integrationHub.getWhatsAppQrStatus(qrSessionId);
      setQrStatus(status);
    } catch (err) {
      console.error('[Hub][QR] Falha ao consultar status:', err);
    } finally {
      setQrLoading(false);
    }
  }, [qrSessionId]);

  useEffect(() => {
    refreshQrStatus();
  }, [refreshQrStatus]);

  const handleConnectQr = async () => {
    setQrLoading(true);
    try {
      const status = await integrationHub.connectWhatsAppQr(qrSessionId);
      setQrStatus(status);
      // Atualiza status após pequeno delay para capturar qr_ready
      setTimeout(() => {
        refreshQrStatus();
      }, 1200);
    } catch (err) {
      console.error('[Hub][QR] Falha ao conectar sessão QR:', err);
    } finally {
      setQrLoading(false);
    }
  };

  const handleLogoutQr = async () => {
    setQrLoading(true);
    try {
      await integrationHub.logoutWhatsAppQr(qrSessionId);
      await refreshQrStatus();
    } catch (err) {
      console.error('[Hub][QR] Falha ao encerrar sessão QR:', err);
    } finally {
      setQrLoading(false);
    }
  };

  const handleConfigure = (integration: Integration) => {
    setConfiguringIntegration(integration);
  };

  const handleTest = (integration: Integration) => {
    setTestingIntegration(integration);
  };

  const handleSaveCredentials = async (config: ConnectionConfig) => {
    await integrationHub.updateIntegrationConfig(config.integrationId, config);
    await fetchIntegrations();
  };

  const handleRunTest = async (integrationId: string): Promise<boolean> => {
    const success = await integrationHub.testConnection(integrationId);
    await fetchIntegrations();
    return success;
  };

  const handleRevoke = async (integration: Integration) => {
    // Revogar credenciais
    const confirmed = window.confirm(
      `Tem certeza que deseja revogar as credenciais de "${integration.name}"?`
    );
    if (!confirmed) return;

    try {
      // Atualiza credenciais para vazio (revoga)
      await integrationHub.updateIntegrationConfig(integration.id, {
        integrationId: integration.id,
        credentials: {},
      });
      await fetchIntegrations();
    } catch (err) {
      console.error('[Hub] Erro ao revogar:', err);
    }
  };

  const tabs: { key: ActiveTab; label: string; icon: string }[] = [
    { key: 'catalog', label: 'Catálogo', icon: '📦' },
    { key: 'connections', label: 'Conexões', icon: '🔗' },
    { key: 'activity', label: 'Atividades', icon: '📋' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-[#0B0F19]">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Hub de Integrações
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gerenciamento centralizado de conexões e credenciais
            </p>
          </div>
          <button
            onClick={fetchIntegrations}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Ativas</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.active}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Inativas</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.inactive}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Erro</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.error}</p>
          </div>
        </div>

        {/* CRM Ziplia WhatsApp — Status em Destaque */}
        {integrations.find((i) => i.id === 'int_crm_ziplia_whatsapp') && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <div>
                  <h3 className="text-sm font-semibold text-green-800 dark:text-green-300">
                    WhatsApp CRM Ziplia
                  </h3>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Conectado · Mensagens inbound/outbound · Canal ativo para o CRM
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                ● Ativo
              </span>
            </div>
          </div>
        )}

        {/* WhatsApp QR Code — Sessão Baileys */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                WhatsApp via QR Code (Baileys)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Sessão: {qrSessionId} · Status: {qrStatus?.status || 'carregando'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleConnectQr}
                disabled={qrLoading}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-40"
              >
                {qrLoading ? 'Conectando...' : 'Gerar QR'}
              </button>
              <button
                onClick={refreshQrStatus}
                disabled={qrLoading}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
              >
                Atualizar Status
              </button>
              <button
                onClick={handleLogoutQr}
                disabled={qrLoading}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-40"
              >
                Logout
              </button>
            </div>
          </div>

          {qrStatus?.qrDataUrl ? (
            <div className="flex flex-col items-center gap-2">
              <img
                src={qrStatus.qrDataUrl}
                alt="QR Code WhatsApp"
                className="w-56 h-56 rounded-md border border-gray-200 dark:border-gray-700 bg-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Abra o WhatsApp no celular → Dispositivos conectados → Conectar dispositivo
              </p>
            </div>
          ) : (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Nenhum QR disponível ainda. Clique em <strong>Gerar QR</strong>.
            </div>
          )}

          {qrStatus?.lastError && (
            <div className="text-xs text-red-600 dark:text-red-400">
              Erro da sessão: {qrStatus.lastError}
            </div>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          {loading && integrations.length === 0 ? (
            <div className="text-gray-500 text-sm py-8 text-center">Carregando integrações...</div>
          ) : activeTab === 'catalog' ? (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Catálogo de Integrações
              </h2>
              <IntegrationCatalog
                integrations={integrations}
                onConfigure={handleConfigure}
                onTest={handleTest}
              />
            </section>
          ) : activeTab === 'connections' ? (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Gerenciar Conexões
              </h2>
              <ConnectionManager
                integrations={integrations}
                onConfigure={handleConfigure}
                onRevoke={handleRevoke}
              />
            </section>
          ) : (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Atividades Recentes
                </h2>
                <span className="text-xs text-gray-400">Últimas 50 entradas</span>
              </div>
              <ActivityLog limit={50} />
            </section>
          )}
        </div>
      </div>

      {/* Modals */}
      {configuringIntegration && (
        <CredentialConfigModal
          integration={configuringIntegration}
          onSave={handleSaveCredentials}
          onClose={() => setConfiguringIntegration(null)}
        />
      )}

      {testingIntegration && (
        <ConnectionTest
          integration={testingIntegration}
          onRunTest={handleRunTest}
          onClose={() => setTestingIntegration(null)}
        />
      )}
    </div>
  );
}
