import { AuthContext } from '../../security/auth.types';
import { ApiRequest, ApiResponse, ok, apiError } from '../endpoints.types';
import { requireScopes } from '../../security/authMiddleware';
import { StudioAdapter } from '../../integration/adapters/studioAdapter';
import { validateListProjectsParams, validateProjectId } from './studio.schema';

/**
 * Handler: GET /v1/studio/projects
 * Escopo requerido: system:read
 */
export async function handleListProjects(request: ApiRequest, auth: AuthContext): Promise<ApiResponse> {
  try {
    requireScopes(auth, ['system:read']);

    const validation = validateListProjectsParams(request.query);
    if (!validation.valid) {
      return apiError(400, 'VALIDATION_ERROR', 'Invalid parameters', validation.errors);
    }

    const adapter = new StudioAdapter({ baseUrl: process.env.STUDIO_API_URL || 'http://localhost:4003' });
    const result = await adapter.listProjects({
      status: request.query.status,
      clientId: request.query.client_id,
    });

    if (!result.success) {
      return apiError(502, 'UPSTREAM_ERROR', result.error?.message || 'Studio upstream error');
    }

    return ok({ projects: result.data });
  } catch (error) {
    if ((error as Error).name === 'ForbiddenError') {
      return apiError(403, 'FORBIDDEN', (error as Error).message);
    }
    return apiError(500, 'INTERNAL_ERROR', 'Internal server error');
  }
}

/**
 * Handler: GET /v1/studio/projects/:id
 * Escopo requerido: system:read
 */
export async function handleGetProject(request: ApiRequest, auth: AuthContext): Promise<ApiResponse> {
  try {
    requireScopes(auth, ['system:read']);

    const projectId = request.params.id;
    const validation = validateProjectId(projectId);
    if (!validation.valid) {
      return apiError(400, 'VALIDATION_ERROR', 'Invalid project ID', validation.errors);
    }

    const adapter = new StudioAdapter({ baseUrl: process.env.STUDIO_API_URL || 'http://localhost:4003' });
    const result = await adapter.getProject(projectId!);

    if (!result.success) {
      return apiError(404, 'NOT_FOUND', 'Project not found');
    }

    return ok({ project: result.data });
  } catch (error) {
    if ((error as Error).name === 'ForbiddenError') {
      return apiError(403, 'FORBIDDEN', (error as Error).message);
    }
    return apiError(500, 'INTERNAL_ERROR', 'Internal server error');
  }
}
