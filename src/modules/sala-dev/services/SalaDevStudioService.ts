/**
 * SalaDevStudioService — Serviço de operações da Sala Dev
 *
 * Responsabilidades:
 * - Encapsular a lógica de negócio da Sala Dev (criar run, aprovar gate, etc.)
 * - Decidir automaticamente se usa api_sagb, Supabase direto, ou mock
 * - Fornecer uma API limpa para o hook useSalaDevRun
 * - Emitir eventos de auditoria para cada operação
 *
 * Uso:
 *   const studio = SalaDevStudioService.getInstance();
 *   const run = await studio.createRun({ title: 'Meu Projeto', ... });
 *
 * Integração com a store:
 *   As funções aqui chamam SalaDevRepositoryAdapter por baixo dos panos,
 *   que já sabe alternar entre Supabase e mock via env var.
 */

import { SalaDevRepositoryAdapter } from './salaDevRepository';
import { ApiSagbAdapter, createApiSagbAdapter } from './adapters/ApiSagbAdapter';
import { SalaDevAdapterService } from './SalaDevAdapterService';
import type { DevRunEntity } from '../types/salaDev.domain';
import type { SalaDevRepositoryPayload } from './salaDevRepository';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface CreateRunInput {
  title: string;
  projectId?: string;
  briefingSummary?: string;
}

export interface StudioOperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  provider: 'api_sagb' | 'supabase' | 'mock';
  durationMs: number;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export class SalaDevStudioService {
  private static instance: SalaDevStudioService;

  private readonly adapterService: SalaDevAdapterService;
  private readonly apiSagb: ApiSagbAdapter;

  private constructor() {
    this.adapterService = SalaDevAdapterService.getInstance();
    this.apiSagb = createApiSagbAdapter();
  }

  static getInstance(): SalaDevStudioService {
    if (!SalaDevStudioService.instance) {
      SalaDevStudioService.instance = new SalaDevStudioService();
    }
    return SalaDevStudioService.instance;
  }

  // ─── Run Operations ──────────────────────────────────────────────────────

  /**
   * Carrega o payload inicial da run (do provider configurado: Supabase ou mock).
   */
  async loadInitialRunPayload(): Promise<StudioOperationResult<SalaDevRepositoryPayload>> {
    const start = Date.now();
    try {
      const repository = SalaDevRepositoryAdapter.getProvider();
      const payload = await repository.getInitialRunPayload();
      const provider = SalaDevRepositoryAdapter.getActiveProviderName();

      return {
        success: true,
        data: payload,
        provider: provider as 'supabase' | 'mock',
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        provider: 'mock',
        durationMs: Date.now() - start,
      };
    }
  }

  /**
   * Salva o estado completo da run (usa Supabase ou mock conforme provider configurado).
   */
  async saveRunState(
    run: DevRunEntity,
    context: {
      macroLayers: unknown[];
      handoffs: unknown[];
      gates: unknown[];
      artifacts: unknown[];
      artifactVersions: unknown[];
      logs: unknown[];
      decisions: unknown[];
      gateChecklists: unknown[];
      finalAudit: unknown;
    },
  ): Promise<StudioOperationResult<void>> {
    const start = Date.now();
    try {
      const repository = SalaDevRepositoryAdapter.getProvider();
      await repository.saveRunState(
        run,
        context.macroLayers as Parameters<typeof repository.saveRunState>[1],
        context.handoffs as Parameters<typeof repository.saveRunState>[2],
        context.gates as Parameters<typeof repository.saveRunState>[3],
        context.artifacts as Parameters<typeof repository.saveRunState>[4],
        context.artifactVersions as Parameters<typeof repository.saveRunState>[5],
        context.logs as Parameters<typeof repository.saveRunState>[6],
        context.decisions as Parameters<typeof repository.saveRunState>[7],
        context.gateChecklists as Parameters<typeof repository.saveRunState>[8],
        context.finalAudit as Parameters<typeof repository.saveRunState>[9],
      );
      const provider = SalaDevRepositoryAdapter.getActiveProviderName();

      return {
        success: true,
        provider: provider as 'supabase' | 'mock',
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        provider: 'mock',
        durationMs: Date.now() - start,
      };
    }
  }

  /**
   * Cria uma nova run (gera ID, persiste no provider configurado).
   * Útil para o NewProjectEntryPanel.
   */
  async createRun(input: CreateRunInput): Promise<StudioOperationResult<DevRunEntity>> {
    const start = Date.now();
    try {
      const now = new Date();
      const run: DevRunEntity = {
        id: `run-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        projectId: input.projectId || `proj-${Date.now()}`,
        title: input.title,
        status: 'pending',
        currentMacroLayerId: '',
        riskLevel: 'low',
        progress: 0,
        startedAt: now,
        updatedAt: now,
        executionEnvironment: 'sagb_ui',
      };

      const repository = SalaDevRepositoryAdapter.getProvider();
      await repository.saveRunState(
        run, [], [], [], [], [], [], [], [], {
          id: `audit-${run.id}`,
          runId: run.id,
          status: 'draft',
          risksFound: 0,
          gatesApproved: 0,
          gatesPending: 0,
          officialArtifacts: 0,
          finalNotes: '',
          finalDecision: 'revisao_necessaria',
        },
      );

      return {
        success: true,
        data: run,
        provider: SalaDevRepositoryAdapter.getActiveProviderName() as 'supabase' | 'mock',
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        provider: 'mock',
        durationMs: Date.now() - start,
      };
    }
  }

  // ─── API SagB Health ─────────────────────────────────────────────────────

  /**
   * Testa conectividade com a API SagB (health check).
   */
  async checkApiSagbConnection(): Promise<StudioOperationResult<{ version: string; status: string }>> {
    const start = Date.now();
    try {
      const result = await this.apiSagb.healthCheck();
      if (result.success && result.data) {
        return {
          success: true,
          data: {
            version: (result.data as { version?: string })?.version || 'unknown',
            status: (result.data as { status?: string })?.status || 'unknown',
          },
          provider: 'api_sagb',
          durationMs: Date.now() - start,
        };
      }
      return {
        success: false,
        error: result.error?.message || 'API SagB não respondeu',
        provider: 'api_sagb',
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        provider: 'api_sagb',
        durationMs: Date.now() - start,
      };
    }
  }

  /**
   * Obtém o snapshot completo de saúde da integração.
   */
  async getIntegrationHealth() {
    return this.adapterService.checkAllHealth();
  }
}

// ─── Hook factory ────────────────────────────────────────────────────────────

export function useSalaDevStudio(): SalaDevStudioService {
  return SalaDevStudioService.getInstance();
}
