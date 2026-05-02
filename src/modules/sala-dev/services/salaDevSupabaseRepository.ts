import { restFetch } from '../../../../services/supabase';
import { createSalaDevState } from '../store/salaDev.store';
import {
  ArtifactEntity,
  ArtifactVersionEntity,
  DevRunEntity,
  GateEntity,
  HandoffEntity,
  MacroLayerEntity,
  RunDecisionEntity,
  RunLogEntity
} from '../types/salaDev.domain';
import {
  DevArtifactRow,
  DevArtifactVersionRow,
  DevDecisionRow,
  DevExecutionEnvironmentRow,
  DevFinalAuditRow,
  DevGateRow,
  DevHandoffRow,
  DevGateChecklistRow,
  DevLogRow,
  DevRunMacroLayerRow,
  DevRunRow
} from '../types/salaDev.persistence';
import {
  ISalaDevRepository,
  SalaDevMockRepository,
  SalaDevRepositoryPayload
} from './salaDevRepository';
import { salaDevSupabaseMapper } from './salaDevSupabaseMapper';

export class SalaDevSupabaseRepository implements ISalaDevRepository {
  constructor(private readonly fallback: ISalaDevRepository = new SalaDevMockRepository()) {}

  private logFallback(reason: string, error?: unknown) {
    console.warn('[sala-dev][fallback->mock]', reason, error);
  }

  private isSupabaseConfigured(): boolean {
    return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
  }

  private async getInitialFromMock(): Promise<SalaDevRepositoryPayload> {
    return this.fallback.getInitialRunPayload();
  }

  async getInitialRunPayload(): Promise<SalaDevRepositoryPayload> {
    if (!this.isSupabaseConfigured()) {
      this.logFallback('Supabase não configurado (env ausente).');
      return this.getInitialFromMock();
    }

    try {
      const mockPayload = await this.getInitialFromMock();

      const runRows = await restFetch('dev_runs', {
        query: new URLSearchParams({
          order: 'updated_at.desc',
          limit: '1'
        })
      }) as DevRunRow[];

      const runRow = runRows?.[0];
      if (!runRow) {
        this.logFallback('Nenhuma run encontrada no Supabase.');
        return mockPayload;
      }

      const macroRows = await restFetch('dev_run_macro_layers', {
        query: new URLSearchParams({
          run_id: `eq.${runRow.id}`,
          order: 'order_index.asc'
        })
      }) as DevRunMacroLayerRow[];

      const envRows = await restFetch('dev_execution_environments', {
        query: new URLSearchParams({
          run_id: `eq.${runRow.id}`,
          order: 'id.asc',
          limit: '1'
        })
      }) as DevExecutionEnvironmentRow[];

      const handoffRows = await restFetch('dev_handoffs', {
        query: new URLSearchParams({
          run_id: `eq.${runRow.id}`
        })
      }) as DevHandoffRow[];

      const gateRows = await restFetch('dev_gates', {
        query: new URLSearchParams({
          run_id: `eq.${runRow.id}`
        })
      }) as DevGateRow[];

      const artifactRows = await restFetch('dev_artifacts', {
        query: new URLSearchParams({
          run_id: `eq.${runRow.id}`
        })
      }) as DevArtifactRow[];

      const artifactVersionRows = await restFetch('dev_artifact_versions', {
        query: new URLSearchParams({
          order: 'created_at.asc'
        })
      }) as DevArtifactVersionRow[];

      const logRows = await restFetch('dev_logs', {
        query: new URLSearchParams({
          run_id: `eq.${runRow.id}`
        })
      }) as DevLogRow[];

      const decisionRows = await restFetch('dev_decisions', {
        query: new URLSearchParams({
          run_id: `eq.${runRow.id}`
        })
      }) as DevDecisionRow[];

      const gateChecklistRows = await restFetch('dev_gate_checklists', {
        query: new URLSearchParams({
          order: 'title.asc'
        })
      }) as DevGateChecklistRow[];

      const finalAuditRows = await restFetch('dev_final_audits', {
        query: new URLSearchParams({
          run_id: `eq.${runRow.id}`,
          limit: '1'
        })
      }) as DevFinalAuditRow[];

      const runDomain = salaDevSupabaseMapper.runRowToDomain(runRow);
      const envRow = envRows?.[0];
      const executionEnvironment = envRow
        ? salaDevSupabaseMapper.executionEnvironmentRowToRunEnvironment(envRow)
        : runDomain.executionEnvironment;

      const nextDomain = {
        ...mockPayload.domain,
        run: {
          ...runDomain,
          executionEnvironment
        },
        macroLayers: (macroRows || []).map((row) => {
          const mockLayer = mockPayload.domain.macroLayers.find((m) => m.id === row.id);
          return {
            ...salaDevSupabaseMapper.macroLayerRowToDomain(row),
            description: mockLayer?.description,
            nextRecommendedAction: mockLayer?.nextRecommendedAction
          };
        }),
        handoffs: (handoffRows || []).map((row) => {
          const mapped = salaDevSupabaseMapper.handoffRowToDomain(row);
          const mockHandoff = mockPayload.domain.handoffs.find((h) => h.id === mapped.id);
          return {
            ...mapped,
            createdAt: mockHandoff?.createdAt || mapped.createdAt
          };
        }),
        gates: (gateRows || []).map((row) => {
          const mapped = salaDevSupabaseMapper.gateRowToDomain(row);
          const mockGate = mockPayload.domain.gates.find((g) => g.id === mapped.id);
          return {
            ...mapped,
            checklist: mockGate?.checklist || []
          };
        }),
        artifacts: (artifactRows || []).map((row) => salaDevSupabaseMapper.artifactRowToDomain(row)),
        artifactVersions: (artifactVersionRows || []).map((row) => salaDevSupabaseMapper.artifactVersionRowToDomain(row)),
        logs: (logRows || []).map((row) => salaDevSupabaseMapper.logRowToDomain(row)),
        decisions: (decisionRows || []).map((row) => salaDevSupabaseMapper.decisionRowToDomain(row)),
        gateChecklists: (gateChecklistRows || []).map((row) => salaDevSupabaseMapper.checklistRowToDomain(row)),
        finalAudit: finalAuditRows?.[0]
          ? salaDevSupabaseMapper.finalAuditRowToDomain(finalAuditRows[0])
          : mockPayload.domain.finalAudit
      };

      const nextState = createSalaDevState({
        ...mockPayload,
        domain: nextDomain
      });

      return {
        ...mockPayload,
        domain: nextState.domain,
        run: nextState.run
      };
    } catch (error) {
      this.logFallback('Falha de conexão/mapeamento no bootstrap do provider Supabase.', error);
      return this.getInitialFromMock();
    }
  }

  async saveRunState(
    run: DevRunEntity,
    macroLayers: MacroLayerEntity[],
    handoffs: HandoffEntity[],
    gates: GateEntity[],
    artifacts: ArtifactEntity[],
    artifactVersions: ArtifactVersionEntity[],
    logs: RunLogEntity[],
    decisions: RunDecisionEntity[],
    gateChecklists: import('../types/salaDev.domain').GateChecklistEntity[],
    finalAudit: import('../types/salaDev.domain').FinalAuditEntity
  ): Promise<void> {
    if (!this.isSupabaseConfigured()) {
      this.logFallback('Persistência Supabase ignorada: env ausente.');
      return;
    }

    try {
      const runRow = salaDevSupabaseMapper.runDomainToRow(run);
      await restFetch('dev_runs', {
        method: 'POST',
        query: new URLSearchParams({ on_conflict: 'id' }),
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: runRow
      });

      for (const layer of macroLayers) {
        const layerRow = salaDevSupabaseMapper.macroLayerDomainToRow(layer, run.id);
        await restFetch('dev_run_macro_layers', {
          method: 'POST',
          query: new URLSearchParams({ on_conflict: 'id' }),
          headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
          body: layerRow
        });
      }

      for (const handoff of handoffs) {
        const handoffRow = salaDevSupabaseMapper.handoffDomainToRow(handoff);
        await restFetch('dev_handoffs', {
          method: 'POST',
          query: new URLSearchParams({ on_conflict: 'id' }),
          headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
          body: handoffRow
        });
      }

      for (const gate of gates) {
        const gateRow = salaDevSupabaseMapper.gateDomainToRow(gate);
        await restFetch('dev_gates', {
          method: 'POST',
          query: new URLSearchParams({ on_conflict: 'id' }),
          headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
          body: gateRow
        });
      }

      for (const artifact of artifacts) {
        const artifactRow = salaDevSupabaseMapper.artifactDomainToRow(artifact);
        await restFetch('dev_artifacts', {
          method: 'POST',
          query: new URLSearchParams({ on_conflict: 'id' }),
          headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
          body: artifactRow
        });
      }

      for (const version of artifactVersions) {
        const versionRow = salaDevSupabaseMapper.artifactVersionDomainToRow(version);
        await restFetch('dev_artifact_versions', {
          method: 'POST',
          query: new URLSearchParams({ on_conflict: 'id' }),
          headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
          body: versionRow
        });
      }

      for (const log of logs) {
        const logRow = salaDevSupabaseMapper.logDomainToRow(log);
        await restFetch('dev_logs', {
          method: 'POST',
          query: new URLSearchParams({ on_conflict: 'id' }),
          headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
          body: logRow
        });
      }

      for (const decision of decisions) {
        const decisionRow = salaDevSupabaseMapper.decisionDomainToRow(decision);
        await restFetch('dev_decisions', {
          method: 'POST',
          query: new URLSearchParams({ on_conflict: 'id' }),
          headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
          body: decisionRow
        });
      }

      for (const checklist of gateChecklists) {
        const checklistRow = salaDevSupabaseMapper.checklistDomainToRow(checklist);
        await restFetch('dev_gate_checklists', {
          method: 'POST',
          query: new URLSearchParams({ on_conflict: 'id' }),
          headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
          body: checklistRow
        });
      }

      const finalAuditRow = salaDevSupabaseMapper.finalAuditDomainToRow(finalAudit);
      await restFetch('dev_final_audits', {
        method: 'POST',
        query: new URLSearchParams({ on_conflict: 'id' }),
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: finalAuditRow
      });
    } catch (error) {
      this.logFallback('Falha ao persistir run/macro_layers/handoffs/gates/artifacts no Supabase.', error);
      await this.fallback.saveRunState(
        run,
        macroLayers,
        handoffs,
        gates,
        artifacts,
        artifactVersions,
        logs,
        decisions,
        gateChecklists,
        finalAudit
      );
    }
  }
}
