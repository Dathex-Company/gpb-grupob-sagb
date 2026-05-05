import { auth, restFetch } from '../../../../services/supabase';

export type GovernanceRuleDomain = 'normas' | 'operacional' | 'templates' | string;
export type GovernanceRuleSyncStatus = 'pending' | 'synced' | 'failed';

export interface GovernanceRule {
  id: string;
  rule_key: string;
  domain: GovernanceRuleDomain;
  title: string;
  content_md: string;
  version: number;
  checksum_sha256: string;
  source_of_truth: string;
  sync_target_path: string;
  sync_status: GovernanceRuleSyncStatus;
  last_sync_error: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

const encoder = new TextEncoder();

export const sha256Hex = async (input: string): Promise<string> => {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Crypto API indisponível para cálculo de checksum SHA-256.');
  }
  const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', encoder.encode(input));
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const currentUserLabel = (): string => {
  const user = auth.currentUser as { id?: string; email?: string } | null;
  return user?.email || user?.id || 'unknown';
};

export const listGovernanceRules = async (): Promise<GovernanceRule[]> => {
  const query = new URLSearchParams();
  query.set('select', '*');
  query.set('order', 'domain.asc,rule_key.asc');
  const data = await restFetch('governance_rules', { method: 'GET', query });
  return Array.isArray(data) ? data : [];
};

export const saveGovernanceRuleDraft = async (rule: GovernanceRule, contentMd: string): Promise<GovernanceRule> => {
  const checksum = await sha256Hex(contentMd);
  const query = new URLSearchParams();
  query.set('id', `eq.${rule.id}`);

  const payload = {
    content_md: contentMd,
    checksum_sha256: checksum,
    sync_status: 'pending',
    last_sync_error: null,
    updated_by: currentUserLabel()
  };

  const data = await restFetch('governance_rules', {
    method: 'PATCH',
    query,
    body: payload,
    headers: { Prefer: 'return=representation' }
  });

  if (!Array.isArray(data) || !data[0]) throw new Error('Falha ao salvar rascunho da regra.');
  return data[0] as GovernanceRule;
};

export const publishGovernanceRule = async (rule: GovernanceRule, contentMd: string) => {
  const checksum = await sha256Hex(contentMd);
  const query = new URLSearchParams();
  query.set('id', `eq.${rule.id}`);

  const data = await restFetch('governance_rules', {
    method: 'PATCH',
    query,
    body: {
      content_md: contentMd,
      checksum_sha256: checksum,
      version: Number(rule.version || 0) + 1,
      source_of_truth: 'supabase',
      sync_status: 'pending',
      last_sync_error: null,
      updated_by: currentUserLabel()
    },
    headers: { Prefer: 'return=representation' }
  });

  if (!Array.isArray(data) || !data[0]) {
    throw new Error('Falha ao publicar regra no Supabase.');
  }

  const updatedRule = data[0] as GovernanceRule;
  const syncResponse = await fetch('/.netlify/functions/governance-sync-doc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: updatedRule.id })
  });

  const syncPayload = await syncResponse.json().catch(() => ({}));
  if (!syncResponse.ok) {
    throw new Error(syncPayload?.error || 'Falha na sincronização documental.');
  }

  const refreshQuery = new URLSearchParams();
  refreshQuery.set('select', '*');
  refreshQuery.set('id', `eq.${updatedRule.id}`);
  const refreshed = await restFetch('governance_rules', { method: 'GET', query: refreshQuery });
  const finalRule = Array.isArray(refreshed) ? refreshed[0] : null;

  return {
    rule: (finalRule || updatedRule) as GovernanceRule,
    sync: syncPayload
  };
};

