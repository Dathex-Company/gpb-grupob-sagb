import { decrypt, encrypt } from '../utils/encryption';

export type IntegrationProvider = 'clickup' | 'whatsapp' | 'gmail' | 'titan' | 'meta_facebook';

export interface CredentialAuditEvent {
  id: string;
  action: 'save' | 'read' | 'rotate' | 'revoke';
  provider: IntegrationProvider;
  integrationId: string;
  actor: string;
  timestamp: string;
  version: number;
}

interface CredentialRecord {
  provider: IntegrationProvider;
  integrationId: string;
  workspaceId: string;
  version: number;
  encryptedCredentials: Record<string, string>;
  updatedAt: string;
  updatedBy: string;
  revokedAt?: string;
}

interface CredentialStorage {
  records: Record<string, CredentialRecord>;
  audit: CredentialAuditEvent[];
}

export class CredentialManager {
  // Mock local; em produção migra para Supabase Vault/Secrets
  private storageKey = 'sagb_hub_credentials_v1';

  async saveCredential(
    provider: IntegrationProvider,
    integrationId: string,
    workspaceId: string,
    credentials: Record<string, string>,
    actor = 'system'
  ): Promise<number> {
    const storage = this.getStorage();
    const recordKey = this.buildRecordKey(provider, integrationId, workspaceId);
    const current = storage.records[recordKey];
    const nextVersion = current ? current.version + 1 : 1;

    const encryptedCredentials = Object.entries(credentials).reduce((acc, [key, value]) => {
      acc[key] = encrypt(value);
      return acc;
    }, {} as Record<string, string>);

    storage.records[recordKey] = {
      provider,
      integrationId,
      workspaceId,
      version: nextVersion,
      encryptedCredentials,
      updatedAt: new Date().toISOString(),
      updatedBy: actor,
      revokedAt: undefined
    };

    storage.audit.unshift(this.buildAudit('save', provider, integrationId, actor, nextVersion));
    this.persist(storage);
    return nextVersion;
  }

  async getCredential(
    provider: IntegrationProvider,
    integrationId: string,
    workspaceId: string,
    actor = 'system'
  ): Promise<Record<string, string> | null> {
    const storage = this.getStorage();
    const record = storage.records[this.buildRecordKey(provider, integrationId, workspaceId)];

    if (!record || record.revokedAt) return null;

    storage.audit.unshift(this.buildAudit('read', provider, integrationId, actor, record.version));
    this.persist(storage);

    return Object.entries(record.encryptedCredentials).reduce((acc, [key, value]) => {
      acc[key] = decrypt(value);
      return acc;
    }, {} as Record<string, string>);
  }

  async revokeCredential(
    provider: IntegrationProvider,
    integrationId: string,
    workspaceId: string,
    actor = 'system'
  ): Promise<void> {
    const storage = this.getStorage();
    const recordKey = this.buildRecordKey(provider, integrationId, workspaceId);
    const current = storage.records[recordKey];
    if (!current) return;

    current.revokedAt = new Date().toISOString();
    current.updatedAt = new Date().toISOString();
    current.updatedBy = actor;

    storage.audit.unshift(this.buildAudit('revoke', provider, integrationId, actor, current.version));
    this.persist(storage);
  }

  async getAuditTrail(limit = 50): Promise<CredentialAuditEvent[]> {
    return this.getStorage().audit.slice(0, limit);
  }

  private buildRecordKey(provider: IntegrationProvider, integrationId: string, workspaceId: string): string {
    return `${workspaceId}::${provider}::${integrationId}`;
  }

  private buildAudit(
    action: CredentialAuditEvent['action'],
    provider: IntegrationProvider,
    integrationId: string,
    actor: string,
    version: number
  ): CredentialAuditEvent {
    return {
      id: crypto.randomUUID(),
      action,
      provider,
      integrationId,
      actor,
      timestamp: new Date().toISOString(),
      version
    };
  }

  private getStorage(): CredentialStorage {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return { records: {}, audit: [] };
    try {
      const parsed = JSON.parse(raw) as Partial<CredentialStorage>;
      return {
        records: parsed.records || {},
        audit: parsed.audit || []
      };
    } catch {
      return { records: {}, audit: [] };
    }
  }

  private persist(data: CredentialStorage): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
}

export const credentialManager = new CredentialManager();
