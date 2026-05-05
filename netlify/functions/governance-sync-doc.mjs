import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const jsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const normalizeTargetPath = (syncTargetPath) => {
  const cleaned = String(syncTargetPath || '').replace(/\\/g, '/').trim().replace(/^\/+/, '');
  if (!cleaned.startsWith('docs/governanca_sagb/') || !cleaned.endsWith('.md')) {
    throw new Error('sync_target_path inválido. Permitido apenas docs/governanca_sagb/*.md');
  }
  if (cleaned.includes('..')) {
    throw new Error('sync_target_path inválido com path traversal.');
  }
  return cleaned;
};

const sha256 = (value) => createHash('sha256').update(value, 'utf8').digest('hex');

const setSyncStatus = async (id, sync_status, last_sync_error = null) => {
  await supabaseAdmin
    .from('governance_rules')
    .update({ sync_status, last_sync_error })
    .eq('id', id);
};

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return jsonResponse(405, { success: false, error: 'Method not allowed' });
  if (!supabaseUrl || !supabaseServiceKey) {
    return jsonResponse(500, { success: false, error: 'Supabase environment variables are missing.' });
  }

  let payload = {};
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch {
    return jsonResponse(400, { success: false, error: 'Invalid JSON body.' });
  }

  const { id, rule_key } = payload;
  if (!id && !rule_key) {
    return jsonResponse(400, { success: false, error: 'Informe id ou rule_key.' });
  }

  try {
    let query = supabaseAdmin.from('governance_rules').select('*').limit(1);
    query = id ? query.eq('id', id) : query.eq('rule_key', rule_key);
    const { data, error } = await query.maybeSingle();

    if (error) throw error;
    if (!data) return jsonResponse(404, { success: false, error: 'Regra não encontrada.' });

    const targetPath = normalizeTargetPath(data.sync_target_path);
    const checksum = sha256(data.content_md || '');

    const absoluteTarget = path.resolve(process.cwd(), targetPath);
    await mkdir(path.dirname(absoluteTarget), { recursive: true });
    await writeFile(absoluteTarget, data.content_md || '', 'utf8');

    const postWriteHash = sha256(data.content_md || '');
    if (checksum !== postWriteHash) {
      await setSyncStatus(data.id, 'failed', 'Hash mismatch após escrita de arquivo.');
      return jsonResponse(500, { success: false, error: 'Hash mismatch após escrita.' });
    }

    await setSyncStatus(data.id, 'synced', null);
    return jsonResponse(200, {
      success: true,
      id: data.id,
      rule_key: data.rule_key,
      sync_target_path: targetPath,
      checksum_sha256: checksum,
      sync_status: 'synced'
    });
  } catch (error) {
    const message = String(error?.message || error || 'unknown_error');

    try {
      if (id) await setSyncStatus(id, 'failed', message);
      else if (rule_key) {
        const { data } = await supabaseAdmin
          .from('governance_rules')
          .select('id')
          .eq('rule_key', rule_key)
          .limit(1)
          .maybeSingle();
        if (data?.id) await setSyncStatus(data.id, 'failed', message);
      }
    } catch {
      // noop
    }

    return jsonResponse(500, { success: false, error: message });
  }
};

