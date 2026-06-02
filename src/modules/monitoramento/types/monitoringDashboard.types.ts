export type MonitoringCardSeverity = 'info' | 'baixo' | 'médio' | 'alto' | 'crítico';

export type MonitoringCardStatus =
  | 'online'
  | 'saudável'
  | 'atenção'
  | 'alerta'
  | 'crítico'
  | 'offline'
  | 'desconhecido'
  | 'pausado'
  | 'em_verificacao';

export type MonitoringCardSize = 'pequeno' | 'médio' | 'grande' | 'destaque';

export type MonitoringDataSource = 'mock' | 'supabase' | 'api' | 'agent' | 'workflow' | 'local' | 'manual';

export type MonitoringIntegrationStatus = 'mock' | 'parcial' | 'real' | 'pendente';

export type MonitoringMetric = {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'stable';
};

export type MonitoringAlertPreview = {
  id: string;
  label: string;
  severity: MonitoringCardSeverity;
};

export type MonitoringResponsible = {
  area: string;
  agent: string;
  backup?: string;
  status?: MonitoringCardStatus;
  lastResponse?: string;
};

export type MonitoringAction = {
  id: string;
  label: string;
  visualOnly: true;
};

export type MonitoringIntegrationMap = {
  integrationStatus: MonitoringIntegrationStatus;
  dataSourceModule?: string;
  dataSourceType: string;
  requiredConnector: string;
  requiredValidationOwner: string;
  canTriggerTaskzei: boolean;
  canNotifyAgent: boolean;
  canOpenIncident: boolean;
};

export type MonitoringNotificationDetail = {
  recipient: string;
  channel: string;
  status: 'enviado' | 'recebido' | 'lido' | 'assumido' | 'resolvido';
  elapsedTime: string;
  shouldEscalate: boolean;
};

export type MonitoringActionFlow = {
  problem: string;
  responsible: string;
  boStatus: string;
  taskZeiStatus: string;
  returnStatus: string;
  averageResponseTime?: string;
  openTasks?: string;
};

export type MonitoringDashboardCard = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  status: MonitoringCardStatus;
  severity: MonitoringCardSeverity;
  mainMetric: MonitoringMetric;
  secondaryMetrics: MonitoringMetric[];
  alerts: MonitoringAlertPreview[];
  responsible: MonitoringResponsible;
  sourceType: MonitoringDataSource;
  relatedSubmoduleSlug?: string;
  defaultSize: MonitoringCardSize;
  allowedSizes: MonitoringCardSize[];
  presetGroups: string[];
  isV1: boolean;
  isCritical: boolean;
  isMock: boolean;
  nextStepSuggestion: string;
  integration: MonitoringIntegrationMap;
  notificationDetail?: MonitoringNotificationDetail;
  actionFlow?: MonitoringActionFlow;
  lastUpdated: string;
  history: string[];
  actions: MonitoringAction[];
};

export type MonitoringPreset = {
  id: string;
  label: string;
  description: string;
  cardIds: string[];
  defaultPanelCount: MonitoringPanelCount;
};

export type MonitoringPanelCount = 1 | 2 | 3 | 4 | 8 | 12 | 16;

export type MonitoringLayoutItem = {
  cardId: string;
  order: number;
  size: MonitoringCardSize;
  userId?: string;
  workspaceId?: string;
  presetId?: string;
  position?: { x: number; y: number };
  visible?: boolean;
  pinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
