export type ApiScope =
  | 'system:read'
  | 'system:write'
  | 'api:read'
  | 'api:write'
  | 'api:audit:read'
  | 'events:read'
  | 'events:write'
  | 'integrations:read'
  | 'integrations:execute'
  | 'integrations:admin'
  | 'whatsapp:read'
  | 'whatsapp:write'
  | 'whatsapp:webhook'
  | 'whatsapp:send'
  | 'whatsapp:admin'
  | 'crm:read'
  | 'crm:write'
  | 'messages:read'
  | 'messages:write'
  | 'finance:read'
  | 'finance:write'
  | 'agents:read'
  | 'agents:execute'
  | 'cid:read'
  | 'cid:write';

export interface ApiClient {
  id: string;
  name: string;
  environment: 'production' | 'sandbox';
  status: 'active' | 'revoked' | 'suspended';
  allowedScopes: ApiScope[];
  rateLimit: {
    requestsPerMinute: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiKey {
  keyId: string;
  clientId: string;
  hashedKey: string; // The stored hash of the key (never the plain text)
  prefix: string; // e.g. "sgb_prod_"
  expiresAt: string | null;
  lastUsedAt: string | null;
  revokedAt?: string | null;
}

export interface AuthContext {
  clientId: string;
  environment: 'production' | 'sandbox';
  scopes: ApiScope[];
  requestId: string;
}
