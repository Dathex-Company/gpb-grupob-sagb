import { AuthContext } from '../security/auth.types';
import { ApiRequest, ApiResponse, ok } from './endpoints.types';

/**
 * Handler: GET /v1/health
 * Healthcheck da API SagB.
 * Público (não requer escopo específico, apenas API Key válida).
 */
export async function handleHealth(_request: ApiRequest, _auth: AuthContext): Promise<ApiResponse> {
  return ok({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    module: 'api-sagb',
  });
}
