/**
 * Schemas de validação para os endpoints do Studio.
 */

export interface StudioListProjectsParams {
  status?: string;
  clientId?: string;
}

export function validateListProjectsParams(params: Record<string, string>): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];
  const validStatuses = ['draft', 'active', 'archived'];
  if (params.status && !validStatuses.includes(params.status)) {
    errors.push(`status must be one of: ${validStatuses.join(', ')}`);
  }
  return { valid: errors.length === 0, errors: errors.length ? errors : undefined };
}

export function validateProjectId(id: string | undefined): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];
  if (!id) errors.push('project_id is required');
  return { valid: errors.length === 0, errors: errors.length ? errors : undefined };
}
