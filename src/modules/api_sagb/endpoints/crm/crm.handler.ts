import { AuthContext } from '../../security/auth.types';
import { ApiRequest, ApiResponse, ok, created, apiError } from '../endpoints.types';
import { requireScopes } from '../../security/authMiddleware';
import { CrmAdapter } from '../../integration/adapters/crmAdapter';
import { validateCreateLeadPayload, validateUpdateLeadPayload } from './crm.schema';

/**
 * Handler: GET /v1/crm/leads
 * Escopo requerido: agents:read
 */
export async function handleListLeads(request: ApiRequest, auth: AuthContext): Promise<ApiResponse> {
  try {
    requireScopes(auth, ['agents:read']);

    const adapter = new CrmAdapter({ baseUrl: process.env.CRM_API_URL || 'http://localhost:4001' });
    const result = await adapter.listLeads({
      status: request.query.status,
      limit: request.query.limit ? parseInt(request.query.limit) : undefined,
      offset: request.query.offset ? parseInt(request.query.offset) : undefined,
    });

    if (!result.success) {
      return apiError(502, 'UPSTREAM_ERROR', result.error?.message || 'CRM upstream error');
    }

    return ok({ leads: result.data });
  } catch (error) {
    if ((error as Error).name === 'ForbiddenError') {
      return apiError(403, 'FORBIDDEN', (error as Error).message);
    }
    return apiError(500, 'INTERNAL_ERROR', 'Internal server error');
  }
}

/**
 * Handler: POST /v1/crm/leads
 * Escopo requerido: agents:execute
 */
export async function handleCreateLead(request: ApiRequest, auth: AuthContext): Promise<ApiResponse> {
  try {
    requireScopes(auth, ['agents:execute']);

    const validation = validateCreateLeadPayload(request.body);
    if (!validation.valid) {
      return apiError(400, 'VALIDATION_ERROR', 'Invalid payload', validation.errors);
    }

    const adapter = new CrmAdapter({ baseUrl: process.env.CRM_API_URL || 'http://localhost:4001' });
    const result = await adapter.createLead(validation.data!);

    if (!result.success) {
      return apiError(502, 'UPSTREAM_ERROR', result.error?.message || 'CRM upstream error');
    }

    return created({ lead: result.data });
  } catch (error) {
    if ((error as Error).name === 'ForbiddenError') {
      return apiError(403, 'FORBIDDEN', (error as Error).message);
    }
    return apiError(500, 'INTERNAL_ERROR', 'Internal server error');
  }
}

/**
 * Handler: PUT /v1/crm/leads/:id
 * Escopo requerido: agents:execute
 */
export async function handleUpdateLead(request: ApiRequest, auth: AuthContext): Promise<ApiResponse> {
  try {
    requireScopes(auth, ['agents:execute']);

    const leadId = request.params.id;
    if (!leadId) {
      return apiError(400, 'VALIDATION_ERROR', 'Lead ID is required');
    }

    const validation = validateUpdateLeadPayload(request.body);
    if (!validation.valid) {
      return apiError(400, 'VALIDATION_ERROR', 'Invalid payload', validation.errors);
    }

    const adapter = new CrmAdapter({ baseUrl: process.env.CRM_API_URL || 'http://localhost:4001' });
    const result = await adapter.updateLead(leadId, validation.data!);

    if (!result.success) {
      return apiError(502, 'UPSTREAM_ERROR', result.error?.message || 'CRM upstream error');
    }

    return ok({ lead: result.data });
  } catch (error) {
    if ((error as Error).name === 'ForbiddenError') {
      return apiError(403, 'FORBIDDEN', (error as Error).message);
    }
    return apiError(500, 'INTERNAL_ERROR', 'Internal server error');
  }
}

/**
 * Handler: GET /v1/crm/leads/:id
 * Escopo requerido: agents:read
 */
export async function handleGetLead(request: ApiRequest, auth: AuthContext): Promise<ApiResponse> {
  try {
    requireScopes(auth, ['agents:read']);

    const leadId = request.params.id;
    if (!leadId) {
      return apiError(400, 'VALIDATION_ERROR', 'Lead ID is required');
    }

    const adapter = new CrmAdapter({ baseUrl: process.env.CRM_API_URL || 'http://localhost:4001' });
    const result = await adapter.getLead(leadId);

    if (!result.success) {
      if (result.error?.code === 'CRM_ERROR') {
        return apiError(404, 'NOT_FOUND', 'Lead not found');
      }
      return apiError(502, 'UPSTREAM_ERROR', result.error?.message || 'CRM upstream error');
    }

    return ok({ lead: result.data });
  } catch (error) {
    if ((error as Error).name === 'ForbiddenError') {
      return apiError(403, 'FORBIDDEN', (error as Error).message);
    }
    return apiError(500, 'INTERNAL_ERROR', 'Internal server error');
  }
}
