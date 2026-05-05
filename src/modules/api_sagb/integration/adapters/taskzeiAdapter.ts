import { HttpClient } from '../httpClient';
import { CircuitBreaker } from '../circuitBreaker';
import { AdapterConfig, IAdapter, AdapterResponse, createSuccessResponse, createErrorResponse } from './types';

export interface TaskzeiNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  recipient_id: string;
  read: boolean;
  created_at: string;
}

export interface TaskzeiSendPayload {
  title: string;
  message: string;
  type: TaskzeiNotification['type'];
  recipient_ids: string[];
}

export class TaskzeiAdapter implements IAdapter {
  readonly name = 'taskzei';
  readonly httpClient: HttpClient;
  readonly circuitBreaker: CircuitBreaker;

  constructor(config: AdapterConfig) {
    this.httpClient = new HttpClient({
      baseUrl: config.baseUrl,
      timeout: config.timeout || 8000,
      headers: config.apiKey ? { 'X-API-Key': config.apiKey } : undefined,
    });

    this.circuitBreaker = new CircuitBreaker({
      name: 'taskzei',
      failureThreshold: 5,
      successThreshold: 2,
      timeout: 30000,
    });
  }

  async healthCheck(): Promise<{ status: string; service: string }> {
    return this.circuitBreaker.call(async () => {
      const response = await this.httpClient.get('/health');
      return { status: response.data?.status || 'unknown', service: this.name };
    });
  }

  /**
   * Lista notificações do TaskZei.
   */
  async listNotifications(recipientId: string): Promise<AdapterResponse<TaskzeiNotification[]>> {
    const start = Date.now();
    try {
      const response = await this.circuitBreaker.call(() =>
        this.httpClient.get<TaskzeiNotification[]>(`/notifications?recipient_id=${recipientId}`)
      );
      return createSuccessResponse(response.data, this.name, Date.now() - start);
    } catch (error) {
      return createErrorResponse('TASKZEI_ERROR', (error as Error).message, this.name);
    }
  }

  /**
   * Envia uma notificação via TaskZei.
   */
  async sendNotification(payload: TaskzeiSendPayload): Promise<AdapterResponse<TaskzeiNotification>> {
    const start = Date.now();
    try {
      const response = await this.circuitBreaker.call(() =>
        this.httpClient.post<TaskzeiNotification>('/notifications', payload)
      );
      return createSuccessResponse(response.data, this.name, Date.now() - start);
    } catch (error) {
      return createErrorResponse('TASKZEI_ERROR', (error as Error).message, this.name);
    }
  }
}
