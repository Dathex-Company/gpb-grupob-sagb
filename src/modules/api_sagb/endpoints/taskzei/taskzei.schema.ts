/**
 * Schemas de validação para os endpoints do TaskZei.
 */

export interface TaskzeiListNotificationsParams {
  recipient_id: string;
  limit?: number;
  offset?: number;
}

export interface TaskzeiSendNotificationPayload {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  recipient_ids: string[];
  metadata?: Record<string, unknown>;
}

export function validateListNotificationsParams(params: Record<string, string>): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];
  if (!params.recipient_id) errors.push('recipient_id is required');
  return { valid: errors.length === 0, errors: errors.length ? errors : undefined };
}

export function validateSendNotificationPayload(body: unknown): { valid: boolean; data?: TaskzeiSendNotificationPayload; errors?: string[] } {
  const errors: string[] = [];
  const payload = body as Record<string, unknown>;

  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Body must be a JSON object'] };
  }

  if (!payload.title || typeof payload.title !== 'string') errors.push('title is required and must be a string');
  if (!payload.message || typeof payload.message !== 'string') errors.push('message is required and must be a string');
  if (!payload.type || !['info', 'warning', 'error', 'success'].includes(payload.type as string)) {
    errors.push('type must be one of: info, warning, error, success');
  }
  if (!payload.recipient_ids || !Array.isArray(payload.recipient_ids) || payload.recipient_ids.length === 0) {
    errors.push('recipient_ids must be a non-empty array');
  }

  if (errors.length > 0) return { valid: false, errors };

  return {
    valid: true,
    data: payload as TaskzeiSendNotificationPayload,
  };
}
