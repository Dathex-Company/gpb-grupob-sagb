import {
  getSalaDevMockAgents,
  getSalaDevMockDomainSnapshot,
  getSalaDevMockFileTree,
  getSalaDevMockFlowEvents,
  getSalaDevMockRun
} from './salaDevMockService';
import { AgentFlowEvent, DevAgent, DevFileNode, DevRun, SalaDevDomainSnapshot } from '../types/salaDev.types';
import {
  ArtifactEntity,
  ArtifactVersionEntity,
  DevRunEntity,
  FinalAuditEntity,
  GateEntity,
  GateChecklistEntity,
  HandoffEntity,
  MacroLayerEntity,
  RunDecisionEntity,
  RunLogEntity
} from '../types/salaDev.domain';
import { SalaDevSupabaseRepository } from './salaDevSupabaseRepository';

export interface SalaDevRepositoryPayload {
  run: DevRun;
  agents: DevAgent[];
  events: AgentFlowEvent[];
  files: DevFileNode[];
  domain: SalaDevDomainSnapshot;
}

export interface ISalaDevRepository {
  getInitialRunPayload(): Promise<SalaDevRepositoryPayload>;
  saveRunState(
    run: DevRunEntity,
    macroLayers: MacroLayerEntity[],
    handoffs: HandoffEntity[],
    gates: GateEntity[],
    artifacts: ArtifactEntity[],
    artifactVersions: ArtifactVersionEntity[],
    logs: RunLogEntity[],
    decisions: RunDecisionEntity[],
    gateChecklists: GateChecklistEntity[],
    finalAudit: FinalAuditEntity
  ): Promise<void>;
}

export class SalaDevMockRepository implements ISalaDevRepository {
  async getInitialRunPayload(): Promise<SalaDevRepositoryPayload> {
    return {
      run: getSalaDevMockRun(),
      agents: getSalaDevMockAgents(),
      events: getSalaDevMockFlowEvents(),
      files: getSalaDevMockFileTree(),
      domain: getSalaDevMockDomainSnapshot()
    };
  }

  async saveRunState(
    _run: DevRunEntity,
    _macroLayers: MacroLayerEntity[],
    _handoffs: HandoffEntity[],
    _gates: GateEntity[],
    _artifacts: ArtifactEntity[],
    _artifactVersions: ArtifactVersionEntity[],
    _logs: RunLogEntity[],
    _decisions: RunDecisionEntity[],
    _gateChecklists: GateChecklistEntity[],
    _finalAudit: FinalAuditEntity
  ): Promise<void> {
    // mock-only: persistência intencionalmente desativada
  }
}

export class SalaDevRepositoryAdapter {
  private static instance: ISalaDevRepository;
  private static fallback = new SalaDevMockRepository();
  private static _activeProviderName: 'mock' | 'supabase' = 'mock';

  private static resolveProviderFromEnv(): 'mock' | 'supabase' {
    const configured = String(import.meta.env.VITE_SALA_DEV_DATA_PROVIDER || 'mock').toLowerCase();
    return configured === 'supabase' ? 'supabase' : 'mock';
  }

  static getProvider(): ISalaDevRepository {
    if (!this.instance) {
      this._activeProviderName = this.resolveProviderFromEnv();
      this.instance = this._activeProviderName === 'supabase'
        ? new SalaDevSupabaseRepository(this.fallback)
        : this.fallback;
    }
    return this.instance;
  }

  /**
   * Retorna o nome do provider ativo ('mock' | 'supabase').
   * Útil para componentes e serviços que precisam exibir o status.
   */
  static getActiveProviderName(): string {
    return this._activeProviderName;
  }

  /**
   * Força a recriação do provider (útil para testes ou troca em runtime).
   */
  static resetProvider(): void {
    this.instance = undefined as unknown as ISalaDevRepository;
  }
}
