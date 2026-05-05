import { HttpClient } from '../httpClient';
import { CircuitBreaker } from '../circuitBreaker';
import { AdapterConfig, IAdapter, AdapterResponse, createSuccessResponse, createErrorResponse } from './types';

export interface VoxTranscription {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  audio_url: string;
  text?: string;
  language: string;
  duration_seconds: number;
  created_at: string;
  completed_at?: string;
  error?: string;
}

export interface VoxTranscribePayload {
  audio_url: string;
  language?: string;
  webhook_url?: string;
}

export class VoxAdapter implements IAdapter {
  readonly name = 'vox';
  readonly httpClient: HttpClient;
  readonly circuitBreaker: CircuitBreaker;

  constructor(config: AdapterConfig) {
    this.httpClient = new HttpClient({
      baseUrl: config.baseUrl,
      timeout: config.timeout || 30000,
      headers: config.apiKey ? { 'X-API-Key': config.apiKey } : undefined,
    });

    this.circuitBreaker = new CircuitBreaker({
      name: 'vox',
      failureThreshold: 3,
      successThreshold: 2,
      timeout: 60000,
    });
  }

  async healthCheck(): Promise<{ status: string; service: string }> {
    return this.circuitBreaker.call(async () => {
      const response = await this.httpClient.get('/health');
      return { status: response.data?.status || 'unknown', service: this.name };
    });
  }

  /**
   * Envia um áudio para transcrição.
   */
  async transcribe(payload: VoxTranscribePayload): Promise<AdapterResponse<VoxTranscription>> {
    const start = Date.now();
    try {
      const response = await this.circuitBreaker.call(() =>
        this.httpClient.post<VoxTranscription>('/transcriptions', payload)
      );
      return createSuccessResponse(response.data, this.name, Date.now() - start);
    } catch (error) {
      return createErrorResponse('VOX_ERROR', (error as Error).message, this.name);
    }
  }

  /**
   * Consulta o resultado de uma transcrição.
   */
  async getTranscription(id: string): Promise<AdapterResponse<VoxTranscription>> {
    const start = Date.now();
    try {
      const response = await this.circuitBreaker.call(() =>
        this.httpClient.get<VoxTranscription>(`/transcriptions/${id}`)
      );
      return createSuccessResponse(response.data, this.name, Date.now() - start);
    } catch (error) {
      return createErrorResponse('VOX_ERROR', (error as Error).message, this.name);
    }
  }

  /**
   * Lista transcrições recentes.
   */
  async listTranscriptions(params?: { status?: string; limit?: number }): Promise<AdapterResponse<VoxTranscription[]>> {
    const start = Date.now();
    try {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.limit) query.set('limit', String(params.limit));

      const response = await this.circuitBreaker.call(() =>
        this.httpClient.get<VoxTranscription[]>(`/transcriptions?${query.toString()}`)
      );
      return createSuccessResponse(response.data, this.name, Date.now() - start);
    } catch (error) {
      return createErrorResponse('VOX_ERROR', (error as Error).message, this.name);
    }
  }
}
