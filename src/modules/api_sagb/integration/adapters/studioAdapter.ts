import { HttpClient } from '../httpClient';
import { CircuitBreaker } from '../circuitBreaker';
import { AdapterConfig, IAdapter, AdapterResponse, createSuccessResponse, createErrorResponse } from './types';

export interface StudioProject {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  client_id: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

export interface StudioProjectDetail extends StudioProject {
  assets: StudioAsset[];
  collaborators: string[];
  metadata: Record<string, unknown>;
}

export interface StudioAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  size_bytes: number;
  created_at: string;
}

export class StudioAdapter implements IAdapter {
  readonly name = 'studio';
  readonly httpClient: HttpClient;
  readonly circuitBreaker: CircuitBreaker;

  constructor(config: AdapterConfig) {
    this.httpClient = new HttpClient({
      baseUrl: config.baseUrl,
      timeout: config.timeout || 15000,
      headers: config.apiKey ? { 'X-API-Key': config.apiKey } : undefined,
    });

    this.circuitBreaker = new CircuitBreaker({
      name: 'studio',
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
   * Lista projetos do Studio.
   */
  async listProjects(params?: { status?: string; clientId?: string }): Promise<AdapterResponse<StudioProject[]>> {
    const start = Date.now();
    try {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.clientId) query.set('client_id', params.clientId);

      const response = await this.circuitBreaker.call(() =>
        this.httpClient.get<StudioProject[]>(`/projects?${query.toString()}`)
      );
      return createSuccessResponse(response.data, this.name, Date.now() - start);
    } catch (error) {
      return createErrorResponse('STUDIO_ERROR', (error as Error).message, this.name);
    }
  }

  /**
   * Obtém detalhes de um projeto.
   */
  async getProject(id: string): Promise<AdapterResponse<StudioProjectDetail>> {
    const start = Date.now();
    try {
      const response = await this.circuitBreaker.call(() =>
        this.httpClient.get<StudioProjectDetail>(`/projects/${id}`)
      );
      return createSuccessResponse(response.data, this.name, Date.now() - start);
    } catch (error) {
      return createErrorResponse('STUDIO_ERROR', (error as Error).message, this.name);
    }
  }
}
