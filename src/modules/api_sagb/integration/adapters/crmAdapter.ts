import { HttpClient } from '../httpClient';
import { CircuitBreaker } from '../circuitBreaker';
import { AdapterConfig, IAdapter, AdapterResponse, createSuccessResponse, createErrorResponse } from './types';

export interface CrmLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost' | 'won';
  notes?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface CrmCreateLeadPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
}

export interface CrmUpdateLeadPayload {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: CrmLead['status'];
  notes?: string;
  assigned_to?: string;
}

export class CrmAdapter implements IAdapter {
  readonly name = 'crm';
  readonly httpClient: HttpClient;
  readonly circuitBreaker: CircuitBreaker;

  constructor(config: AdapterConfig) {
    this.httpClient = new HttpClient({
      baseUrl: config.baseUrl,
      timeout: config.timeout || 10000,
      headers: config.apiKey ? { 'X-API-Key': config.apiKey } : undefined,
    });

    this.circuitBreaker = new CircuitBreaker({
      name: 'crm',
      failureThreshold: 3,
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
   * Lista leads do CRM com paginação.
   */
  async listLeads(params?: { status?: string; limit?: number; offset?: number }): Promise<AdapterResponse<CrmLead[]>> {
    const start = Date.now();
    try {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.offset) query.set('offset', String(params.offset));

      const response = await this.circuitBreaker.call(() =>
        this.httpClient.get<CrmLead[]>(`/leads?${query.toString()}`)
      );
      return createSuccessResponse(response.data, this.name, Date.now() - start);
    } catch (error) {
      return createErrorResponse('CRM_ERROR', (error as Error).message, this.name);
    }
  }

  /**
   * Cria um novo lead no CRM.
   */
  async createLead(payload: CrmCreateLeadPayload): Promise<AdapterResponse<CrmLead>> {
    const start = Date.now();
    try {
      const response = await this.circuitBreaker.call(() =>
        this.httpClient.post<CrmLead>('/leads', payload)
      );
      return createSuccessResponse(response.data, this.name, Date.now() - start);
    } catch (error) {
      return createErrorResponse('CRM_ERROR', (error as Error).message, this.name);
    }
  }

  /**
   * Atualiza um lead existente no CRM.
   */
  async updateLead(id: string, payload: CrmUpdateLeadPayload): Promise<AdapterResponse<CrmLead>> {
    const start = Date.now();
    try {
      const response = await this.circuitBreaker.call(() =>
        this.httpClient.put<CrmLead>(`/leads/${id}`, payload)
      );
      return createSuccessResponse(response.data, this.name, Date.now() - start);
    } catch (error) {
      return createErrorResponse('CRM_ERROR', (error as Error).message, this.name);
    }
  }

  /**
   * Obtém um lead pelo ID.
   */
  async getLead(id: string): Promise<AdapterResponse<CrmLead>> {
    const start = Date.now();
    try {
      const response = await this.circuitBreaker.call(() =>
        this.httpClient.get<CrmLead>(`/leads/${id}`)
      );
      return createSuccessResponse(response.data, this.name, Date.now() - start);
    } catch (error) {
      return createErrorResponse('CRM_ERROR', (error as Error).message, this.name);
    }
  }
}
