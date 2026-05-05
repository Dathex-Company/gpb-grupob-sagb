/**
 * Schemas de validação para os endpoints do Vox (transcrição).
 */

export interface VoxTranscribePayload {
  audio_url: string;
  language?: string;
  webhook_url?: string;
}

export interface VoxListTranscriptionsParams {
  status?: string;
  limit?: number;
}

export function validateTranscribePayload(body: unknown): { valid: boolean; data?: VoxTranscribePayload; errors?: string[] } {
  const errors: string[] = [];
  const payload = body as Record<string, unknown>;

  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Body must be a JSON object'] };
  }

  if (!payload.audio_url || typeof payload.audio_url !== 'string') {
    errors.push('audio_url is required and must be a string');
  } else {
    try {
      new URL(payload.audio_url);
    } catch {
      errors.push('audio_url must be a valid URL');
    }
  }

  if (payload.language && typeof payload.language !== 'string') {
    errors.push('language must be a string');
  }

  if (payload.webhook_url && typeof payload.webhook_url !== 'string') {
    errors.push('webhook_url must be a string');
  } else if (payload.webhook_url) {
    try {
      new URL(payload.webhook_url as string);
    } catch {
      errors.push('webhook_url must be a valid URL');
    }
  }

  if (errors.length > 0) return { valid: false, errors };

  return {
    valid: true,
    data: payload as VoxTranscribePayload,
  };
}

export function validateTranscriptionId(id: string | undefined): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];
  if (!id) errors.push('transcription_id is required');
  return { valid: errors.length === 0, errors: errors.length ? errors : undefined };
}

export function validateListTranscriptionsParams(params: Record<string, string>): { valid: boolean; data?: VoxListTranscriptionsParams; errors?: string[] } {
  const errors: string[] = [];
  const validStatuses = ['pending', 'processing', 'completed', 'failed'];

  if (params.status && !validStatuses.includes(params.status)) {
    errors.push(`status must be one of: ${validStatuses.join(', ')}`);
  }

  if (params.limit) {
    const limitNum = parseInt(params.limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push('limit must be a number between 1 and 100');
    }
  }

  if (errors.length > 0) return { valid: false, errors };

  return {
    valid: true,
    data: {
      status: params.status,
      limit: params.limit ? parseInt(params.limit) : undefined,
    },
  };
}
