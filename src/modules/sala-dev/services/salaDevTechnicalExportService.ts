import { SalaDevState } from '../store/salaDev.store';
import { TechnicalExecutionPackage } from '../types/salaDev.technicalExport';

const DEFAULT_GUARDRAILS = [
  'Execução remota desabilitada',
  'Exige aprovação humana',
  'Não contém segredos/tokens/variáveis de ambiente',
  'Não contém memória privada de agentes',
  'Não contém prompt completo sensível',
  'Uso permitido apenas como referência técnica'
];

const DEFAULT_EXCLUSIONS = [
  'Prompt completo sensível',
  'Memória privada de agentes',
  'Segredos, chaves e tokens',
  'Variáveis de ambiente e credenciais'
];

const checksumFrom = (value: string): string => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return `pkg-${Math.abs(hash)}`;
};

const sanitizeLogs = (logs: SalaDevState['domain']['logs']) => {
  return logs.map((log) => ({
    ...log,
    message: String(log.message || '')
      .replace(/(api[_-]?key|token|secret|password)\s*[:=]\s*[^\s]+/gi, '$1=[REDACTED]')
  }));
};

export const salaDevTechnicalExportService = {
  generatePackage(state: SalaDevState, generatedBy = 'sala-dev-ui'): TechnicalExecutionPackage {
    const generatedAt = new Date().toISOString();
    const packageId = `techpkg-${state.domain.run.id}-${Date.now()}`;

    const pkg: TechnicalExecutionPackage = {
      packageId,
      runId: state.domain.run.id,
      generatedAt,
      generatedBy,
      packageVersion: 'v1.0.0-onda-3b',
      projectTitle: state.domain.run.title,
      runStatus: state.domain.run.status,
      macroLayers: state.domain.macroLayers,
      runAgents: state.domain.runAgents,
      handoffs: state.domain.handoffs,
      gates: state.domain.gates,
      artifacts: state.domain.artifacts,
      artifactVersions: state.domain.artifactVersions,
      logs: sanitizeLogs(state.domain.logs),
      decisions: state.domain.decisions,
      checklists: state.domain.gateChecklists,
      finalAudit: state.domain.finalAudit,
      executionEnvironment: {
        runExecutionEnvironment: state.domain.run.executionEnvironment,
        bridgeSource: state.domain.executionBridge.source,
        bridgeMode: state.domain.executionBridge.mode,
        bridgeNotes: state.domain.executionBridge.notes
      },
      humanInstructions: [
        'Revisar escopo e macrocamadas antes de qualquer ação técnica.',
        'Validar gates, handoffs e auditoria final.',
        'Abrir projeto manualmente no VS Code/Roo (sem automação).',
        'Copiar somente conteúdo aprovado para execução humana.',
        'Não executar comandos sem validação e aprovação humana.',
        'Registrar retorno da execução no SagB após ação técnica.'
      ],
      safetyGuardrails: DEFAULT_GUARDRAILS,
      excludedSensitiveData: DEFAULT_EXCLUSIONS,
      packageChecksum: ''
    };

    const checksumBase = JSON.stringify({ ...pkg, packageChecksum: '' });
    pkg.packageChecksum = checksumFrom(checksumBase);
    return pkg;
  }
};

