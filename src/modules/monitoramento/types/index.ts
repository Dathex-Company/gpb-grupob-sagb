export type MonitoramentoSubmodulo = {
  id: string;
  label: string;
  slug: string;
  items: string[];
};

/**
 * Contrato de Observabilidade do SagB.
 *
 * Regra de fronteira: módulos de origem geram eventos, métricas, alertas,
 * status e incidentes; a Central de Monitoramento consolida resumo, índice,
 * status e link para detalhe, sem virar depósito bruto infinito.
 */
export type ObservabilitySeverity = 'info' | 'baixo' | 'médio' | 'alto' | 'crítico';

export type ObservabilitySource = {
  moduleId: string;
  moduleName?: string;
  submoduleId?: string;
  originType?: 'module' | 'agent' | 'service' | 'workflow' | 'external';
  detailUrl?: string;
};

export type ObservabilityRecommendedAction = {
  title: string;
  description?: string;
  taskZeiTarget?: string;
  suggestedOwner?: string;
  dueAt?: string;
};

export type ObservabilityBasePacket = {
  id: string;
  title: string;
  summary?: string;
  source: ObservabilitySource;
  timestamp: string;
  detailUrl?: string;
  recommendedAction?: ObservabilityRecommendedAction;
};

export type ObservabilityEvent = ObservabilityBasePacket & {
  kind: 'evento';
  eventName: string;
  status?: ObservabilityStatus['state'];
};

export type ObservabilityMetric = ObservabilityBasePacket & {
  kind: 'métrica';
  metricName: string;
  value: number;
  unit?: string;
  threshold?: number;
};

export type ObservabilityAlert = ObservabilityBasePacket & {
  kind: 'alerta';
  severity: ObservabilitySeverity;
  responsibleSuggested?: string;
  responsibleGap: boolean;
  status?: 'novo' | 'em_triagem' | 'encaminhado' | 'resolvido' | 'ignorado';
};

export type ObservabilityStatus = ObservabilityBasePacket & {
  kind: 'status';
  state: 'operacional' | 'atenção' | 'degradado' | 'indisponível' | 'desconhecido';
  severity?: ObservabilitySeverity;
};

export type ObservabilityIncident = ObservabilityBasePacket & {
  kind: 'incidente';
  severity: ObservabilitySeverity;
  owner: string;
  followUpRequired: true;
  openedAt: string;
  closedAt?: string;
  closureSummary?: string;
  status: 'aberto' | 'em_acompanhamento' | 'mitigado' | 'fechado';
};

export type ObservabilityPacket =
  | ObservabilityEvent
  | ObservabilityMetric
  | ObservabilityAlert
  | ObservabilityStatus
  | ObservabilityIncident;

export const observabilityContractRules = [
  'Todo alerta deve ter severidade.',
  'Todo alerta deve ter origem.',
  'Todo alerta deve ter responsável sugerido ou lacuna de responsável.',
  'Evento não é a mesma coisa que alerta.',
  'Alerta não é a mesma coisa que incidente.',
  'Incidente exige acompanhamento e fechamento.',
  'Logs brutos não devem entupir a Central de Monitoramento.',
  'A Central deve guardar resumo, índice, status e link para detalhe.',
  'Ação corretiva deve ser encaminhada para o TaskZei, não virar gestão paralela dentro do Monitoramento.',
  'A Central de Padrões define critérios e limites; a Central de Monitoramento observa desvios.'
] as const;

export * from './monitoringDashboard.types';
