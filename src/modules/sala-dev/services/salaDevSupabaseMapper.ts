import {
  ArtifactEntity,
  ArtifactVersionEntity,
  ChecklistItemEntity,
  DevRunEntity,
  FinalAuditEntity,
  GateChecklistEntity,
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
  DevGateChecklistRow,
  DevHandoffRow,
  DevLogRow,
  DevRunMacroLayerRow,
  DevRunRow
} from '../types/salaDev.persistence';

export const salaDevSupabaseMapper = {
  runRowToDomain(row: DevRunRow): DevRunEntity {
    return {
      id: row.id,
      projectId: row.project_id,
      title: row.title,
      status: row.status,
      currentMacroLayerId: row.current_macro_layer_id,
      currentGateId: row.current_gate_id || undefined,
      activeAgentId: row.active_agent_id || undefined,
      riskLevel: row.risk_level,
      progress: row.progress,
      executionEnvironment: row.execution_environment,
      startedAt: row.started_at ? new Date(row.started_at) : undefined,
      updatedAt: new Date(row.updated_at),
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined
    };
  },

  runDomainToRow(run: DevRunEntity): DevRunRow {
    return {
      id: run.id,
      project_id: run.projectId,
      title: run.title,
      status: run.status,
      current_macro_layer_id: run.currentMacroLayerId,
      current_gate_id: run.currentGateId || null,
      active_agent_id: run.activeAgentId || null,
      risk_level: run.riskLevel,
      progress: run.progress,
      execution_environment: run.executionEnvironment,
      started_at: run.startedAt ? run.startedAt.toISOString() : null,
      updated_at: run.updatedAt.toISOString(),
      completed_at: run.completedAt ? run.completedAt.toISOString() : null
    };
  },

  macroLayerRowToDomain(row: DevRunMacroLayerRow): MacroLayerEntity {
    return {
      id: row.id,
      name: row.name,
      order: row.order_index as 1 | 2 | 3 | 4 | 5 | 6,
      status: row.status,
      progress: row.progress,
      agentsCount: 0,
      handoffsCount: 0,
      gatesCount: 0,
      artifactsCount: 0,
      riskLevel: row.risk_level
    };
  },

  macroLayerDomainToRow(layer: MacroLayerEntity, runId: string): DevRunMacroLayerRow {
    return {
      id: layer.id,
      run_id: runId,
      name: layer.name,
      order_index: layer.order,
      status: layer.status,
      progress: layer.progress,
      risk_level: layer.riskLevel
    };
  },

  executionEnvironmentRowToRunEnvironment(row: DevExecutionEnvironmentRow): DevRunEntity['executionEnvironment'] {
    if (row.environment_type === 'sagb_ui') return 'sagb_ui';
    if (row.environment_type === 'vscode') return 'vscode_future';
    return 'roo_code_future';
  },

  handoffRowToDomain(row: DevHandoffRow): HandoffEntity {
    return {
      id: row.id,
      runId: row.run_id,
      sourceAgentId: row.source_agent_id || undefined,
      targetAgentId: row.target_agent_id || undefined,
      macroLayerId: row.macro_layer_id,
      reason: row.reason,
      inputSummary: row.input_summary,
      expectedOutput: row.expected_output,
      relatedArtifactId: row.related_artifact_id || undefined,
      status: row.status,
      gateId: row.gate_id || undefined,
      riskLevel: row.risk_level,
      createdAt: row.created_at ? new Date(row.created_at) : new Date(),
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined
    };
  },

  handoffDomainToRow(handoff: HandoffEntity): DevHandoffRow {
    return {
      id: handoff.id,
      run_id: handoff.runId,
      macro_layer_id: handoff.macroLayerId,
      source_agent_id: handoff.sourceAgentId || null,
      target_agent_id: handoff.targetAgentId || null,
      reason: handoff.reason,
      input_summary: handoff.inputSummary,
      expected_output: handoff.expectedOutput,
      related_artifact_id: handoff.relatedArtifactId || null,
      gate_id: handoff.gateId || null,
      status: handoff.status,
      risk_level: handoff.riskLevel,
      created_at: handoff.createdAt.toISOString(),
      completed_at: handoff.completedAt ? handoff.completedAt.toISOString() : null
    };
  },

  gateRowToDomain(row: DevGateRow): GateEntity {
    return {
      id: row.id,
      runId: row.run_id,
      macroLayerId: row.macro_layer_id,
      name: row.name,
      status: row.status,
      checklist: [],
      responsibleAgentId: row.responsible_agent_id || undefined,
      riskLevel: row.risk_level,
      decision: row.decision || undefined,
      observations: row.observations || undefined,
      approvedAt: row.approved_at ? new Date(row.approved_at) : undefined,
      rejectedAt: row.rejected_at ? new Date(row.rejected_at) : undefined
    };
  },

  gateDomainToRow(gate: GateEntity): DevGateRow {
    return {
      id: gate.id,
      run_id: gate.runId,
      macro_layer_id: gate.macroLayerId,
      name: gate.name,
      status: gate.status,
      decision: gate.decision || null,
      responsible_agent_id: gate.responsibleAgentId || null,
      risk_level: gate.riskLevel,
      observations: gate.observations || null,
      approved_at: gate.approvedAt ? gate.approvedAt.toISOString() : null,
      rejected_at: gate.rejectedAt ? gate.rejectedAt.toISOString() : null
    };
  },

  artifactDomainToRow(artifact: ArtifactEntity): DevArtifactRow {
    return {
      id: artifact.id,
      run_id: artifact.runId,
      macro_layer_id: artifact.macroLayerId,
      agent_id: artifact.agentId || null,
      handoff_id: artifact.handoffId || null,
      gate_id: artifact.gateId || null,
      title: artifact.title,
      type: artifact.type,
      status: artifact.status,
      version: artifact.version,
      file_path: artifact.filePath || null,
      content_preview: artifact.contentPreview || null,
      created_at: artifact.createdAt.toISOString(),
      updated_at: artifact.updatedAt.toISOString()
    };
  },

  artifactRowToDomain(row: DevArtifactRow): ArtifactEntity {
    return {
      id: row.id,
      runId: row.run_id,
      macroLayerId: row.macro_layer_id,
      agentId: row.agent_id || undefined,
      handoffId: row.handoff_id || undefined,
      gateId: row.gate_id || undefined,
      title: row.title,
      type: row.type,
      status: row.status,
      version: row.version,
      filePath: row.file_path || undefined,
      contentPreview: row.content_preview || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  },

  artifactVersionDomainToRow(version: ArtifactVersionEntity): DevArtifactVersionRow {
    return {
      id: version.id,
      artifact_id: version.artifactId,
      version: version.version,
      author_agent_id: version.authorAgentId || null,
      change_summary: version.changeSummary,
      status: version.status,
      created_at: version.createdAt.toISOString()
    };
  },

  artifactVersionRowToDomain(row: DevArtifactVersionRow): ArtifactVersionEntity {
    return {
      id: row.id,
      artifactId: row.artifact_id,
      version: row.version,
      authorAgentId: row.author_agent_id || undefined,
      changeSummary: row.change_summary,
      status: row.status,
      createdAt: new Date(row.created_at)
    };
  },

  logDomainToRow(log: RunLogEntity): DevLogRow {
    return {
      id: log.id,
      run_id: log.runId,
      macro_layer_id: log.macroLayerId || null,
      agent_id: log.agentId || null,
      event_type: log.eventType,
      severity: log.severity,
      message: log.message,
      created_at: log.createdAt.toISOString()
    };
  },

  logRowToDomain(row: DevLogRow): RunLogEntity {
    return {
      id: row.id,
      runId: row.run_id,
      macroLayerId: row.macro_layer_id || undefined,
      agentId: row.agent_id || undefined,
      eventType: row.event_type,
      severity: row.severity,
      message: row.message,
      createdAt: new Date(row.created_at)
    };
  },

  decisionDomainToRow(decision: RunDecisionEntity): DevDecisionRow {
    return {
      id: decision.id,
      run_id: decision.runId,
      macro_layer_id: decision.macroLayerId || null,
      gate_id: decision.gateId || null,
      responsible_agent_id: decision.responsibleAgentId || null,
      title: decision.title,
      decision: decision.decision,
      reason: decision.reason,
      status: decision.status,
      created_at: decision.createdAt.toISOString()
    };
  },

  decisionRowToDomain(row: DevDecisionRow): RunDecisionEntity {
    return {
      id: row.id,
      runId: row.run_id,
      macroLayerId: row.macro_layer_id || undefined,
      gateId: row.gate_id || undefined,
      responsibleAgentId: row.responsible_agent_id || undefined,
      title: row.title,
      decision: row.decision,
      reason: row.reason,
      status: row.status,
      createdAt: new Date(row.created_at)
    };
  },

  checklistDomainToRow(checklist: GateChecklistEntity): DevGateChecklistRow {
    return {
      id: checklist.id,
      gate_id: checklist.gateId,
      title: checklist.title,
      completion_rate: checklist.completionRate,
      status: checklist.status,
      items_json: JSON.stringify(checklist.items)
    };
  },

  checklistRowToDomain(row: DevGateChecklistRow): GateChecklistEntity {
    return {
      id: row.id,
      gateId: row.gate_id,
      title: row.title,
      completionRate: row.completion_rate,
      status: row.status,
      items: JSON.parse(row.items_json) as ChecklistItemEntity[]
    };
  },

  finalAuditDomainToRow(audit: FinalAuditEntity): DevFinalAuditRow {
    return {
      id: audit.id,
      run_id: audit.runId,
      status: audit.status,
      risks_found: audit.risksFound,
      gates_approved: audit.gatesApproved,
      gates_pending: audit.gatesPending,
      official_artifacts: audit.officialArtifacts,
      final_notes: audit.finalNotes,
      final_decision: audit.finalDecision
    };
  },

  finalAuditRowToDomain(row: DevFinalAuditRow): FinalAuditEntity {
    return {
      id: row.id,
      runId: row.run_id,
      status: row.status,
      risksFound: row.risks_found,
      gatesApproved: row.gates_approved,
      gatesPending: row.gates_pending,
      officialArtifacts: row.official_artifacts,
      finalNotes: row.final_notes,
      finalDecision: row.final_decision
    };
  }
};
