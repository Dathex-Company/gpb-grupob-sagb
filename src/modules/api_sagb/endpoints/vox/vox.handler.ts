import { AuthContext } from '../../security/auth.types';
import { ApiRequest, ApiResponse, ok, created, apiError } from '../endpoints.types';
import { requireScopes } from '../../security/authMiddleware';
import { VoxAdapter } from '../../integration/adapters/voxAdapter';
import {
  validateTranscribePayload,
  validateTranscriptionId,
  validateListTranscriptionsParams,
} from './vox.schema';

/**
 * Handler: POST /v1/vox/transcriptions
 * Escopo requerido: cid:write
 */
export async function handleTranscribe(request: ApiRequest, auth: AuthContext): Promise<ApiResponse> {
  try {
    requireScopes(auth, ['cid:write']);

    const validation = validateTranscribePayload(request.body);
    if (!validation.valid) {
      return apiError(400, 'VALIDATION_ERROR', 'Invalid payload', validation.errors);
    }

    const adapter = new VoxAdapter({ baseUrl: process.env.VOX_API_URL || 'http://localhost:4004' });
    const result = await adapter.transcribe(validation.data!);

    if (!result.success) {
      return apiError(502, 'UPSTREAM_ERROR', result.error?.message || 'Vox upstream error');
    }

    return created({ transcription: result.data });
  } catch (error) {
    if ((error as Error).name === 'ForbiddenError') {
      return apiError(403, 'FORBIDDEN', (error as Error).message);
    }
    return apiError(500, 'INTERNAL_ERROR', 'Internal server error');
  }
}

/**
 * Handler: GET /v1/vox/transcriptions/:id
 * Escopo requerido: cid:read
 */
export async function handleGetTranscription(request: ApiRequest, auth: AuthContext): Promise<ApiResponse> {
  try {
    requireScopes(auth, ['cid:read']);

    const transcriptionId = request.params.id;
    const validation = validateTranscriptionId(transcriptionId);
    if (!validation.valid) {
      return apiError(400, 'VALIDATION_ERROR', 'Invalid transcription ID', validation.errors);
    }

    const adapter = new VoxAdapter({ baseUrl: process.env.VOX_API_URL || 'http://localhost:4004' });
    const result = await adapter.getTranscription(transcriptionId!);

    if (!result.success) {
      return apiError(404, 'NOT_FOUND', 'Transcription not found');
    }

    return ok({ transcription: result.data });
  } catch (error) {
    if ((error as Error).name === 'ForbiddenError') {
      return apiError(403, 'FORBIDDEN', (error as Error).message);
    }
    return apiError(500, 'INTERNAL_ERROR', 'Internal server error');
  }
}

/**
 * Handler: GET /v1/vox/transcriptions
 * Escopo requerido: cid:read
 */
export async function handleListTranscriptions(request: ApiRequest, auth: AuthContext): Promise<ApiResponse> {
  try {
    requireScopes(auth, ['cid:read']);

    const validation = validateListTranscriptionsParams(request.query);
    if (!validation.valid) {
      return apiError(400, 'VALIDATION_ERROR', 'Invalid parameters', validation.errors);
    }

    const adapter = new VoxAdapter({ baseUrl: process.env.VOX_API_URL || 'http://localhost:4004' });
    const result = await adapter.listTranscriptions(validation.data);

    if (!result.success) {
      return apiError(502, 'UPSTREAM_ERROR', result.error?.message || 'Vox upstream error');
    }

    return ok({ transcriptions: result.data });
  } catch (error) {
    if ((error as Error).name === 'ForbiddenError') {
      return apiError(403, 'FORBIDDEN', (error as Error).message);
    }
    return apiError(500, 'INTERNAL_ERROR', 'Internal server error');
  }
}
