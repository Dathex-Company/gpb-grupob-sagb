export interface AuditEntry {
  request_id: string;
  client_id: string;
  environment: string;
  method: string;
  path: string;
  scopes: string[];
  status_code: number;
  ip_address?: string;
  user_agent?: string;
  duration_ms: number;
  created_at: string;
}

export interface RequestContext {
  requestId: string;
  clientId: string;
  environment: string;
  scopes: string[];
  startedAt: number;
}

export interface AuditFilter {
  clientId?: string;
  method?: string;
  path?: string;
  status_code?: number;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}
