/**
 * Schemas de validação para os endpoints do CRM.
 */

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
  status?: 'new' | 'contacted' | 'qualified' | 'lost' | 'won';
  notes?: string;
  assigned_to?: string;
}

export function validateCreateLeadPayload(body: unknown): { valid: boolean; data?: CrmCreateLeadPayload; errors?: string[] } {
  const errors: string[] = [];
  const payload = body as Record<string, unknown>;

  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Body must be a JSON object'] };
  }

  if (!payload.name || typeof payload.name !== 'string') errors.push('name is required and must be a string');
  if (!payload.email || typeof payload.email !== 'string') errors.push('email is required and must be a string');

  if (errors.length > 0) return { valid: false, errors };

  return { valid: true, data: payload as CrmCreateLeadPayload };
}

export function validateUpdateLeadPayload(body: unknown): { valid: boolean; data?: CrmUpdateLeadPayload; errors?: string[] } {
  const errors: string[] = [];
  const payload = body as Record<string, unknown>;

  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Body must be a JSON object'] };
  }

  if (payload.status && !['new', 'contacted', 'qualified', 'lost', 'won'].includes(payload.status as string)) {
    errors.push('status must be one of: new, contacted, qualified, lost, won');
  }

  if (errors.length > 0) return { valid: false, errors };

  return { valid: true, data: payload as CrmUpdateLeadPayload };
}
