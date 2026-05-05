/**
 * Nível de severidade de um alerta.
 */
export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Evento de monitoramento.
 */
export interface MonitorEvent {
  type: string;
  message: string;
  severity: AlertSeverity;
  source: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

/**
 * Limiar de alerta configurável.
 */
export interface AlertThreshold {
  metric: string;
  warning: number;
  critical: number;
  operator: 'gt' | 'lt' | 'gte' | 'lte' | 'eq';
}

/**
 * Estado agregado de saúde do módulo.
 */
export interface HealthStatus {
  overall: 'healthy' | 'degraded' | 'critical';
  providerStatus: 'connected' | 'degraded' | 'disconnected';
  lastSyncTimestamp: string | null;
  errorCount: number;
  warningCount: number;
  activeAlerts: MonitorEvent[];
  lastChecked: string;
}

/**
 * Serviço de monitoramento de falhas e alertas para o módulo TaskZei.
 *
 * Mantém um buffer circular de eventos em memória, avalia limiares
 * e expõe métricas de saúde do módulo.
 */
export class MonitorService {
  private events: MonitorEvent[] = [];
  private readonly maxEvents: number = 1000;
  private thresholds: AlertThreshold[] = [];
  private providerConnected: boolean = true;
  private lastSyncTimestamp: string | null = null;

  constructor() {
    this.setupDefaultThresholds();
  }

  // ─── Configuração ──────────────────────────────────────────────────

  private setupDefaultThresholds(): void {
    this.thresholds = [
      { metric: 'error_rate', warning: 5, critical: 20, operator: 'gt' },
      { metric: 'sync_failures', warning: 3, critical: 10, operator: 'gte' },
      { metric: 'response_time_ms', warning: 2000, critical: 5000, operator: 'gt' },
    ];
  }

  /**
   * Define limiares customizados.
   */
  setThresholds(thresholds: AlertThreshold[]): void {
    this.thresholds = thresholds;
  }

  /**
   * Adiciona um limiar individual.
   */
  addThreshold(threshold: AlertThreshold): void {
    const idx = this.thresholds.findIndex(t => t.metric === threshold.metric);
    if (idx >= 0) {
      this.thresholds[idx] = threshold;
    } else {
      this.thresholds.push(threshold);
    }
  }

  // ─── Registro de eventos ───────────────────────────────────────────

  /**
   * Registra um evento de monitoramento.
   * Mantém buffer circular e avalia limiares automaticamente.
   */
  recordEvent(
    type: string,
    message: string,
    severity: AlertSeverity,
    source: string = 'taskzei',
    metadata?: Record<string, unknown>
  ): MonitorEvent {
    const event: MonitorEvent = {
      type,
      message,
      severity,
      source,
      timestamp: new Date().toISOString(),
      metadata,
    };

    this.events.push(event);

    // Buffer circular: descarta eventos mais antigos se exceder máximo
    if (this.events.length > this.maxEvents) {
      this.events.splice(0, this.events.length - this.maxEvents);
    }

    // Avalia limiares baseados na contagem de eventos
    this.evaluateThresholds(type, severity);

    // Se for erro, loga no console também
    if (severity === 'error' || severity === 'critical') {
      console.error(`[MonitorService] [${severity.toUpperCase()}] ${type}: ${message}`, metadata || '');
    } else if (severity === 'warning') {
      console.warn(`[MonitorService] [WARNING] ${type}: ${message}`, metadata || '');
    }

    return event;
  }

  /**
   * Registra um erro de sincronização com o provider.
   */
  recordSyncError(error: Error, context?: string): void {
    this.recordEvent(
      'sync_error',
      `${context || 'Provider sync'}: ${error.message}`,
      'error',
      'taskzei-provider',
      { errorName: error.name, stack: error.stack }
    );
    this.providerConnected = false;
  }

  /**
   * Registra uma operação bem-sucedida de sincronização.
   */
  recordSyncSuccess(): void {
    this.lastSyncTimestamp = new Date().toISOString();
    this.providerConnected = true;
  }

  /**
   * Avalia limiares baseados na taxa de ocorrência de eventos.
   */
  private evaluateThresholds(type: string, severity: AlertSeverity): void {
    // Conta ocorrências do mesmo tipo nos últimos 5 minutos
    const fiveMinAgo = Date.now() - 5 * 60 * 1000;
    const recentCount = this.events.filter(
      e => e.type === type && new Date(e.timestamp).getTime() > fiveMinAgo
    ).length;

    for (const threshold of this.thresholds) {
      if (threshold.metric === 'error_rate' && (type.includes('error') || severity === 'error' || severity === 'critical')) {
        this.checkThreshold('error_rate', recentCount, threshold);
      }
    }
  }

  private checkThreshold(metric: string, value: number, threshold: AlertThreshold): void {
    let triggered = false;
    switch (threshold.operator) {
      case 'gt': triggered = value > threshold.critical; break;
      case 'lt': triggered = value < threshold.critical; break;
      case 'gte': triggered = value >= threshold.critical; break;
      case 'lte': triggered = value <= threshold.critical; break;
      case 'eq': triggered = value === threshold.critical; break;
    }

    if (triggered) {
      this.recordEvent(
        'threshold_breach',
        `Threshold '${metric}' breached: ${value} (critical: ${threshold.critical})`,
        'critical',
        'taskzei-monitor',
        { metric, value, threshold: threshold.critical }
      );
    }
  }

  // ─── Consultas ─────────────────────────────────────────────────────

  /**
   * Retorna eventos recentes filtrados por severidade.
   */
  getRecentEvents(severity?: AlertSeverity, limit: number = 50): MonitorEvent[] {
    let filtered = this.events;
    if (severity) {
      filtered = filtered.filter(e => e.severity === severity);
    }
    return filtered.slice(-limit).reverse();
  }

  /**
   * Retorna alertas ativos (críticos e erros recentes).
   */
  getActiveAlerts(): MonitorEvent[] {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    return this.events.filter(
      e =>
        (e.severity === 'critical' || e.severity === 'error') &&
        new Date(e.timestamp).getTime() > oneHourAgo
    );
  }

  /**
   * Retorna o estado de saúde atual do módulo.
   */
  getHealthStatus(): HealthStatus {
    const activeAlerts = this.getActiveAlerts();
    const criticalCount = activeAlerts.filter(e => e.severity === 'critical').length;
    const errorCount = activeAlerts.filter(e => e.severity === 'error').length;
    const warningCount = this.events.filter(
      e => e.severity === 'warning' && new Date(e.timestamp).getTime() > Date.now() - 60 * 60 * 1000
    ).length;

    let providerStatus: HealthStatus['providerStatus'] = 'connected';
    if (!this.providerConnected) {
      providerStatus = 'disconnected';
    } else if (errorCount > 0) {
      providerStatus = 'degraded';
    }

    let overall: HealthStatus['overall'] = 'healthy';
    if (criticalCount > 0 || providerStatus === 'disconnected') {
      overall = 'critical';
    } else if (errorCount > 0 || warningCount > 3) {
      overall = 'degraded';
    }

    return {
      overall,
      providerStatus,
      lastSyncTimestamp: this.lastSyncTimestamp,
      errorCount,
      warningCount,
      activeAlerts,
      lastChecked: new Date().toISOString(),
    };
  }

  /**
   * Limpa eventos antigos (mais de 24h).
   */
  cleanOldEvents(): number {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const before = this.events.length;
    this.events = this.events.filter(e => new Date(e.timestamp).getTime() > oneDayAgo);
    return before - this.events.length;
  }

  /**
   * Reseta todos os eventos e estado.
   */
  reset(): void {
    this.events = [];
    this.providerConnected = true;
    this.lastSyncTimestamp = null;
  }
}

/** Singleton do serviço de monitoramento */
export const monitorService = new MonitorService();
