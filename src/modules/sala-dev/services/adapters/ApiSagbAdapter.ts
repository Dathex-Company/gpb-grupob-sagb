/**
 * ApiSagbAdapter — Ponte entre a Sala Dev e a API SagB
 *
 * Responsabilidades:
 * - Chamar endpoints da api_sagb (health, studio, etc.)
 * - Implementar retry com exponential backoff
 * - Propagar X-Request-Id para rastreabilidade
 * - Fallback para Supabase direto quando api_sagb não disponível
 *
 * Uso:
 *   const adapter = new ApiSagbAdapter({ baseUrl: '/api-sagb' });
 *   const health = await adapter.healthCheck();
 */

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface ApiSagbAdapterConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
  retry?: {
    maxAttempts: number;
    baseDelayMs: number;
  };
}

export interface ApiSagbHealthResponse {
  status: string;
  version: string;
  timestamp: string;
}

export interface ApiSagbStudioProject {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  client_id: string;
  created_at: string;
  updated_at: string;
}

export interface ApiSagbAdapterResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
  durationMs: number;
  requestId?: string;
}

// ─── Erros ───────────────────────────────────────────────────────────────────

export class ApiSagbHttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'ApiSagbHttpError';
  }
}

// ─── Adapter ─────────────────────────────────────────────────────────────────

export class ApiSagbAdapter {
  private config: Required<ApiSagbAdapterConfig>;
  private requestCounter = 0;

  constructor(config: ApiSagbAdapterConfig) {
    this.config = {
      timeout: 10000,
      retry: { maxAttempts: 3, baseDelayMs: 200 },
      ...config,
    };
  }

  // ─── Health ──────────────────────────────────────────────────────────────

  async healthCheck(): Promise<ApiSagbAdapterResponse<ApiSagbHealthResponse>> {
    return this.request<ApiSagbHealthResponse>('GET', '/v1/health');
  }

  // ─── Studio / Projects ──────────────────────────────────────────────────

  async listProjects(params?: {
    status?: string;
    clientId?: string;
  }): Promise<ApiSagbAdapterResponse<ApiSagbStudioProject[]>> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.clientId) query.set('client_id', params.clientId);
    const qs = query.toString();
    return this.request<ApiSagbStudioProject[]>('GET', `/v1/studio/projects${qs ? `?${qs}` : ''}`);
  }

  async getProject(id: string): Promise<ApiSagbAdapterResponse<ApiSagbStudioProject>> {
    return this.request<ApiSagbStudioProject>('GET', `/v1/studio/projects/${encodeURIComponent(id)}`);
  }

  // ─── Método central de request ───────────────────────────────────────────

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<ApiSagbAdapterResponse<T>> {
    const start = Date.now();
    const requestId = `sagb-adapter-${Date.now()}-${++this.requestCounter}`;
    const url = `${this.config.baseUrl.replace(/\/+$/, '')}${path}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Request-Id': requestId,
    };
    if (this.config.apiKey) {
      headers['X-API-Key'] = this.config.apiKey;
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.retry.maxAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Tratar 401/403 como erro de autenticação
        if (response.status === 401 || response.status === 403) {
          throw new ApiSagbHttpError(
            `API SagB: ${response.status} - ${response.statusText}`,
            response.status,
            response.status === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN',
          );
        }

        const data = await response.json();

        if (!response.ok) {
          throw new ApiSagbHttpError(
            data?.error?.message || `API SagB: ${response.status}`,
            response.status,
            data?.error?.code || `HTTP_${response.status}`,
          );
        }

        return {
          success: true,
          data,
          durationMs: Date.now() - start,
          requestId,
        };
      } catch (error) {
        lastError = error as Error;

        // Não retentar erros de autenticação ou validação
        if (error instanceof ApiSagbHttpError) {
          if (error.status === 401 || error.status === 403 || error.status === 400) {
            break;
          }
        }

        // Não retentar se for o último attempt
        if (attempt === this.config.retry.maxAttempts) break;

        // Exponential backoff
        const delay = this.config.retry.baseDelayMs * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    return {
      success: false,
      error: {
        code: lastError instanceof ApiSagbHttpError ? lastError.code : 'NETWORK_ERROR',
        message: lastError?.message || 'Erro desconhecido ao conectar com API SagB',
      },
      durationMs: Date.now() - start,
      requestId,
    };
  }
}

// ─── Factory ─────────────────────────────────────────────────────────────────

/**
 * Cria uma instância do ApiSagbAdapter configurada para o ambiente atual.
 * Se VITE_API_SAGB_URL estiver definido, usa esse valor.
 * Caso contrário, tenta /api-sagb (Netlify proxy local).
 */
export function createApiSagbAdapter(): ApiSagbAdapter {
  const baseUrl =
    import.meta.env.VITE_API_SAGB_URL || '/api-sagb';
  const apiKey = import.meta.env.VITE_API_SAGB_KEY || '';

  return new ApiSagbAdapter({
    baseUrl,
    apiKey: apiKey || undefined,
    timeout: 10000,
    retry: { maxAttempts: 2, baseDelayMs: 200 },
  });
}
