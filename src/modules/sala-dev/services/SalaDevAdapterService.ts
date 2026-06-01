/**
 * SalaDevAdapterService — Orquestrador central de adapters da Sala Dev
 *
 * Responsabilidades:
 * - Gerenciar instâncias de todos os adapters (api_sagb, mcp_sagb, nc_llm, etc.)
 * - Fornecer health check consolidado de todos os módulos conectados
 * - Prover modo degradado (fallback para mock) quando um adapter falha
 * - Rastrear qual adapter está ativo e qual está em fallback
 *
 * Uso:
 *   const service = SalaDevAdapterService.getInstance();
 *   const status = await service.checkAllHealth();
 *   const projects = await service.apiSagb.listProjects();
 *
 * Expansão futura:
 *   - McpSagbAdapter (Fase 3)
 *   - NcLlmAdapter (Fase 2)
 *   - NucleoAgentesAdapter (Fase 5)
 *   - SagbBridgeAdapter (Fase 4)
 *   - MissoesAdapter (Fase 6)
 */

import { ApiSagbAdapter, createApiSagbAdapter, ApiSagbHealthResponse } from './adapters/ApiSagbAdapter';
import { createSalaDevLlmService, SalaDevLlmService } from './SalaDevLlmService';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface AdapterHealthStatus {
  name: string;
  status: 'connected' | 'degraded' | 'disconnected' | 'not_implemented';
  message: string;
  durationMs?: number;
}

export interface SalaDevAdaptersSnapshot {
  /**
   * Quais adapters estão ativos
   */
  activeAdapters: string[];
  /**
   * Status de saúde de cada adapter
   */
  health: AdapterHealthStatus[];
  /**
   * Modo de operação geral
   */
  globalStatus: 'full' | 'degraded' | 'offline';
}

// ─── Service ─────────────────────────────────────────────────────────────────

export class SalaDevAdapterService {
  private static instance: SalaDevAdapterService;

  readonly apiSagb: ApiSagbAdapter;
  readonly salaDevLlm: SalaDevLlmService;
  // Futuros adapters (placeholders para fases seguintes):
  // mcpSagb: McpSagbAdapter | null = null;  // Fase 3
  // ncLlm: NcLlmAdapter | null = null;       // Fase 2
  // nucleoAgentes: NucleoAgentesAdapter | null = null;  // Fase 5
  // sagbBridge: SagbBridgeAdapter | null = null;        // Fase 4
  // missoes: MissoesAdapter | null = null;              // Fase 6

  private constructor() {
    this.apiSagb = createApiSagbAdapter();
    this.salaDevLlm = createSalaDevLlmService();
  }

  static getInstance(): SalaDevAdapterService {
    if (!SalaDevAdapterService.instance) {
      SalaDevAdapterService.instance = new SalaDevAdapterService();
    }
    return SalaDevAdapterService.instance;
  }

  // ─── Health Check ────────────────────────────────────────────────────────

  /**
   * Verifica saúde de todos os adapters disponíveis.
   * Retorna snapshot consolidado do estado da integração.
   */
  async checkAllHealth(): Promise<SalaDevAdaptersSnapshot> {
    const checks: AdapterHealthStatus[] = [];

    // API SagB
    checks.push(await this.checkApiSagbHealth());
    checks.push(await this.checkSalaDevLlmHealth());

    // Placeholders para fases futuras (status: not_implemented)
    checks.push({ name: 'mcp_sagb', status: 'not_implemented', message: 'Fase 3 — pendente' });
    checks.push({ name: 'nucleo_de_agentes', status: 'not_implemented', message: 'Fase 5 — pendente' });
    checks.push({ name: 'sagb_bridge', status: 'not_implemented', message: 'Fase 4 — pendente' });
    checks.push({ name: 'missoes', status: 'not_implemented', message: 'Fase 6 — pendente' });

    const activeAdapters = checks
      .filter((c) => c.status === 'connected')
      .map((c) => c.name);

    const hasFailure = checks.some((c) => c.status === 'disconnected');
    const allConnected = checks.every(
      (c) => c.status === 'connected' || c.status === 'not_implemented',
    );

    const globalStatus: SalaDevAdaptersSnapshot['globalStatus'] = allConnected
      ? 'full'
      : hasFailure
        ? 'degraded'
        : 'offline';

    return {
      activeAdapters,
      health: checks,
      globalStatus,
    };
  }

  private async checkApiSagbHealth(): Promise<AdapterHealthStatus> {
    const start = Date.now();
    try {
      const result = await this.apiSagb.healthCheck();
      if (result.success) {
        return {
          name: 'api_sagb',
          status: 'connected',
          message: `v${(result.data as ApiSagbHealthResponse)?.version || '?'} OK`,
          durationMs: Date.now() - start,
        };
      }
      return {
        name: 'api_sagb',
        status: 'degraded',
        message: result.error?.message || 'Resposta inválida',
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        name: 'api_sagb',
        status: 'disconnected',
        message: (error as Error).message,
        durationMs: Date.now() - start,
      };
    }
  }

  private async checkSalaDevLlmHealth(): Promise<AdapterHealthStatus> {
    const start = Date.now();
    try {
      const ok = await this.salaDevLlm.healthCheck();
      return {
        name: 'sala_dev_llm',
        status: ok ? 'connected' : 'degraded',
        message: ok ? 'AI proxy disponível' : 'AI proxy indisponível ou action não configurada',
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        name: 'sala_dev_llm',
        status: 'disconnected',
        message: (error as Error).message,
        durationMs: Date.now() - start,
      };
    }
  }

  // ─── Utilitários ─────────────────────────────────────────────────────────

  /**
   * Verifica se a API SagB está respondendo.
   * Útil para componentes que precisam saber se podem chamar a API.
   */
  async isApiSagbAvailable(): Promise<boolean> {
    const result = await this.apiSagb.healthCheck();
    return result.success;
  }

  /**
   * Obtém o provider de dados recomendado baseado na disponibilidade.
   * Se api_sagb estiver disponível, usa 'api_sagb'.
   * Caso contrário, retorna 'supabase_direct' (fallback).
   */
  async getRecommendedDataProvider(): Promise<'api_sagb' | 'supabase_direct' | 'mock'> {
    if (await this.isApiSagbAvailable()) {
      return 'api_sagb';
    }
    // Verificar se Supabase está configurado
    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      return 'supabase_direct';
    }
    return 'mock';
  }
}

// ─── Hook-friendly factory ───────────────────────────────────────────────────

/**
 * Hook que retorna o adaptador service.
 * Uso: const adapter = useSalaDevAdapter();
 */
export function useSalaDevAdapter(): SalaDevAdapterService {
  return SalaDevAdapterService.getInstance();
}
