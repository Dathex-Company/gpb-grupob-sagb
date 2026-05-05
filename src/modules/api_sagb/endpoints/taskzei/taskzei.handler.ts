import { AuthContext } from '../../security/auth.types';
import { ApiRequest, ApiResponse, ok, created, apiError } from '../endpoints.types';
import { requireScopes } from '../../security/authMiddleware';
import { TaskzeiAdapter } from '../../integration/adapters/taskzeiAdapter';
import { validateListNotificationsParams, validateSendNotificationPayload } from './taskzei.schema';

/**
 * Handler: GET /v1/taskzei/notifications
 * Escopo requerido: system:read
 */
export async function handleListNotifications(request: ApiRequest, auth: AuthContext): Promise<ApiResponse> {
  try {
    requireScopes(auth, ['system:read']);

    const validation = validateListNotificationsParams(request.query);
    if (!validation.valid) {
      return apiError(400, 'VALIDATION_ERROR', 'Invalid parameters', validation.errors);
    }

    const adapter = new TaskzeiAdapter({ baseUrl: process.env.TASKZEI_API_URL || 'http://localhost:4000' });
    const result = await adapter.listNotifications(request.query.recipient_id);

    if (!result.success) {
      return apiError(502, 'UPSTREAM_ERROR', result.error?.message || 'TaskZei upstream error');
    }

    return ok({ notifications: result.data });
  } catch (error) {
    if ((error as Error).name === 'ForbiddenError') {
      return apiError(403, 'FORBIDDEN', (error as Error).message);
    }
    return apiError(500, 'INTERNAL_ERROR', 'Internal server error');
  }
}

/**
 * Handler: POST /v1/taskzei/notifications
 * Escopo requerido: system:write
 */
export async function handleSendNotification(request: ApiRequest, auth: AuthContext): Promise<ApiResponse> {
  try {
    requireScopes(auth, ['system:write']);

    const validation = validateSendNotificationPayload(request.body);
    if (!validation.valid) {
      return apiError(400, 'VALIDATION_ERROR', 'Invalid payload', validation.errors);
    }

    const adapter = new TaskzeiAdapter({ baseUrl: process.env.TASKZEI_API_URL || 'http://localhost:4000' });
    const result = await adapter.sendNotification(validation.data!);

    if (!result.success) {
      return apiError(502, 'UPSTREAM_ERROR', result.error?.message || 'TaskZei upstream error');
    }

    return created({ notification: result.data });
  } catch (error) {
    if ((error as Error).name === 'ForbiddenError') {
      return apiError(403, 'FORBIDDEN', (error as Error).message);
    }
    return apiError(500, 'INTERNAL_ERROR', 'Internal server error');
  }
}
