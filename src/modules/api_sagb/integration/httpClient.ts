/**
 * Cliente HTTP genérico para a API SagB.
 * Suporta retry com exponential backoff, timeout configurável e propagação de tracing.
 */
export interface HttpClientConfig {
  baseUrl: string;
  timeout?: number; // ms, default 10000
  retry?: {
    maxAttempts: number; // default 3
    baseDelayMs: number; // default 100
  };
  headers?: Record<string, string>;
}

export interface HttpClientResponse<T = unknown> {
  status: number;
  data: T;
  headers: Record<string, string>;
}

export class HttpClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly details?: string[],
  ) {
    super(message);
    this.name = 'HttpClientError';
  }
}

export class TimeoutError extends Error {
  constructor(message = 'Request timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class HttpClient {
  private config: Required<HttpClientConfig>;

  constructor(config: HttpClientConfig) {
    this.config = {
      timeout: 10000,
      retry: { maxAttempts: 3, baseDelayMs: 100 },
      headers: {},
      ...config,
    };
  }

  async get<T = unknown>(
    path: string,
    options?: { headers?: Record<string, string>; requestId?: string },
  ): Promise<HttpClientResponse<T>> {
    return this.request<T>('GET', path, undefined, options);
  }

  async post<T = unknown>(
    path: string,
    body?: unknown,
    options?: { headers?: Record<string, string>; requestId?: string },
  ): Promise<HttpClientResponse<T>> {
    return this.request<T>('POST', path, body, options);
  }

  async put<T = unknown>(
    path: string,
    body?: unknown,
    options?: { headers?: Record<string, string>; requestId?: string },
  ): Promise<HttpClientResponse<T>> {
    return this.request<T>('PUT', path, body, options);
  }

  async patch<T = unknown>(
    path: string,
    body?: unknown,
    options?: { headers?: Record<string, string>; requestId?: string },
  ): Promise<HttpClientResponse<T>> {
    return this.request<T>('PATCH', path, body, options);
  }

  async delete<T = unknown>(
    path: string,
    options?: { headers?: Record<string, string>; requestId?: string },
  ): Promise<HttpClientResponse<T>> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: { headers?: Record<string, string>; requestId?: string },
    attempt = 1,
  ): Promise<HttpClientResponse<T>> {
    const url = `${this.config.baseUrl}${path}`;
    const controller = new AbortController();

    // Agenda o abort do sinal via setTimeout tradicional
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...options?.headers,
      };

      if (options?.requestId) {
        headers['X-Request-Id'] = options.requestId;
      }

      // fetch com AbortSignal: rejeitará com AbortError quando o controller
      // abortar — desde que o runtime/mock suporte AbortSignal.
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const responseHeaders: Record<string, string> = {};
      // response.headers pode ser undefined em mocks de teste
      if (response.headers && typeof response.headers.forEach === 'function') {
        response.headers.forEach((value: string, key: string) => {
          responseHeaders[key] = value;
        });
      }

      // Guard para response.headers.get() undefined em mocks de teste
      const contentType = response.headers && typeof response.headers.get === 'function'
        ? (response.headers.get('content-type') || '')
        : '';

      let data: T;
      if (contentType.includes('application/json') || !contentType) {
        // Sem content-type, assume JSON (compatível com mocks que têm .json())
        data = await response.json();
      } else {
        data = (await response.text()) as unknown as T;
      }

      if (!response.ok) {
        throw new HttpClientError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          (data as any)?.error?.code || 'HTTP_ERROR',
          (data as any)?.error?.details,
        );
      }

      return { status: response.status, data, headers: responseHeaders };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof HttpClientError) {
        throw error;
      }

      if ((error as Error).name === 'AbortError') {
        throw new TimeoutError(`Request timed out after ${this.config.timeout}ms`);
      }

      // TimeoutError não deve ser retentado
      if (error instanceof TimeoutError) {
        throw error;
      }

      // Retry logic with exponential backoff (apenas para erros de rede/fetch)
      if (attempt < this.config.retry.maxAttempts) {
        const delay = this.config.retry.baseDelayMs * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.request<T>(method, path, body, options, attempt + 1);
      }

      throw error;
    }
  }
}
