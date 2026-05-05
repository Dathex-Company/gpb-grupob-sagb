import { HubActivityLogEntry } from '../types/integration.types';

const STORAGE_KEY = 'sagb_hub_activity_log_v1';

class LoggerService {
  private maxEntries = 200;

  async log(entry: Omit<HubActivityLogEntry, 'id' | 'timestamp'>): Promise<HubActivityLogEntry> {
    const full: HubActivityLogEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    const logs = this.getLogs();
    logs.unshift(full);

    // Mantém apenas os últimos maxEntries
    if (logs.length > this.maxEntries) {
      logs.length = this.maxEntries;
    }

    this.persist(logs);

    // Em produção, também persiste no Supabase
    console.info(`[HubLog] ${entry.action}/${entry.status}: ${entry.summary}`);
    return full;
  }

  async getLogs(integrationId?: string, limit = 50): Promise<HubActivityLogEntry[]> {
    const logs = this.getLogs();
    const filtered = integrationId
      ? logs.filter((l) => l.integrationId === integrationId)
      : logs;
    return filtered.slice(0, limit);
  }

  async clearLogs(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }

  private getLogs(): HubActivityLogEntry[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as HubActivityLogEntry[];
    } catch {
      return [];
    }
  }

  private persist(logs: HubActivityLogEntry[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }
}

export const loggerService = new LoggerService();
