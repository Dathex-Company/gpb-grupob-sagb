/**
 * IntegrationHealthPanel — Painel de saúde da integração da Sala Dev
 *
 * Exibe o status de conexão com:
 * - API SagB (gateway oficial)
 * - Supabase (persistência direta)
 * - MCP SagB (ferramentas)
 * - Núcleo Conversacional (LLM)
 * - Núcleo de Agentes (catálogo)
 * - SagB Bridge (VS Code)
 *
 * Uso:
 *   <IntegrationHealthPanel />
 *
 * Ideal para colocar em:
 *   - SalaDevPage.tsx (sidebar ou footer)
 *   - Modo desenvolvedor
 */

import { useEffect, useState } from 'react';
import { SalaDevAdapterService } from '../services/SalaDevAdapterService';
import { SalaDevRepositoryAdapter } from '../services/salaDevRepository';
import type { AdapterHealthStatus } from '../services/SalaDevAdapterService';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type HealthStatus = 'loading' | 'ready' | 'error';

interface PanelState {
  status: HealthStatus;
  adapters: AdapterHealthStatus[];
  dataProvider: string;
  globalStatus: string;
  apiSagbVersion?: string;
  error?: string;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export function IntegrationHealthPanel() {
  const [panel, setPanel] = useState<PanelState>({
    status: 'loading',
    adapters: [],
    dataProvider: '—',
    globalStatus: 'Verificando...',
  });

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const adapterService = SalaDevAdapterService.getInstance();

        // Data provider ativo (mock ou supabase)
        const dataProvider = SalaDevRepositoryAdapter.getActiveProviderName();

        // Health check de todos os adapters
        const health = await adapterService.checkAllHealth();
        const apiSagbHealth = health.health.find((h) => h.name === 'api_sagb');
        const apiSagbVersion = apiSagbHealth?.message?.match(/v([\d.]+)/)?.[1];

        if (cancelled) return;

        setPanel({
          status: health.globalStatus === 'full' ? 'ready' : 'error',
          adapters: health.health,
          dataProvider,
          globalStatus: health.globalStatus,
          apiSagbVersion,
        });
      } catch (error) {
        if (cancelled) return;
        setPanel({
          status: 'error',
          adapters: [],
          dataProvider: '—',
          globalStatus: 'Falha na verificação',
          error: (error as Error).message,
        });
      }
    };

    void check();

    return () => {
      cancelled = true;
    };
  }, []);

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="integration-health-panel rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-xs font-mono">
      <h3 className="mb-2 text-sm font-semibold text-zinc-300">
        🔌 Integração —{' '}
        <span
          className={
            panel.globalStatus === 'full'
              ? 'text-green-400'
              : panel.globalStatus === 'degraded'
                ? 'text-yellow-400'
                : 'text-red-400'
          }
        >
          {panel.globalStatus === 'full'
            ? 'Completa'
            : panel.globalStatus === 'degraded'
              ? 'Degradada'
              : 'Offline'}
        </span>
      </h3>

      <div className="space-y-1">
        {/* Provider de dados */}
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">provider:</span>
          <span
            className={
              panel.dataProvider === 'supabase'
                ? 'text-green-400'
                : 'text-yellow-400'
            }
          >
            {panel.dataProvider}
          </span>
        </div>

        {/* API SagB */}
        {panel.adapters
          .filter((a) => a.status !== 'not_implemented')
          .map((adapter) => (
            <div key={adapter.name} className="flex items-center gap-2">
              <span className="text-zinc-500">{adapter.name}:</span>
              <span
                className={
                  adapter.status === 'connected'
                    ? 'text-green-400'
                    : adapter.status === 'degraded'
                      ? 'text-yellow-400'
                      : 'text-red-400'
                }
              >
                {adapter.status === 'connected'
                  ? '✅'
                  : adapter.status === 'degraded'
                    ? '⚠️'
                    : '❌'}{' '}
                {adapter.message}
              </span>
            </div>
          ))}

        {/* Módulos pendentes */}
        {panel.adapters
          .filter((a) => a.status === 'not_implemented')
          .map((adapter) => (
            <div key={adapter.name} className="flex items-center gap-2 text-zinc-600">
              <span className="text-zinc-600">{adapter.name}:</span>
              <span>⏳ {adapter.message}</span>
            </div>
          ))}
      </div>

      {panel.error && (
        <div className="mt-2 text-red-400">Erro: {panel.error}</div>
      )}
    </div>
  );
}
