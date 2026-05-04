/**
 * RAI — RSS Fetch Function
 *
 * Executa o pipeline de captura para um agente do SagB:
 * 1. Busca a config RAI do agente em rai_configs (por agent_id)
 * 2. Busca dados do agente em agents (tabela canônica do SagB)
 * 3. Fetch RSS de cada fonte configurada
 * 4. Parse XML e extrai itens (RSS 2.0 e Atom)
 * 5. Classifica relevância (TF-IDF zero-cost)
 * 6. Persiste capturas no Supabase (rai_captures)
 * 7. Atualiza last_run_at da config
 *
 * POST /api/rai-rss-fetch
 * Body: { agentId: string, workspaceId: string }
 *   agentId = ID do Agent no SagB (agents.id)
 *   workspaceId = workspace de escopo
 */

import { createClient } from '@supabase/supabase-js';

// --------------- Helpers ---------------

const json = (statusCode, payload) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(payload),
});

const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL or service role key is missing.');
  }
  return createClient(supabaseUrl, supabaseServiceKey);
};

// --------------- RSS Parser (zero dep) ---------------

const parseRSS = (xmlText, sourceName, sourceUrl) => {
  const items = [];
  const isAtom = xmlText.includes('<feed') && xmlText.includes('xmlns="http://www.w3.org/2005/Atom"');

  if (isAtom) {
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi;
    let match;
    while ((match = entryRegex.exec(xmlText)) !== null) {
      const entry = match[1];
      const title = extractTag(entry, 'title');
      const link = extractAtomLink(entry);
      const summary = extractTag(entry, 'summary') || extractTag(entry, 'content');
      const published = extractTag(entry, 'published') || extractTag(entry, 'updated');

      if (title) {
        items.push({
          title: decodeHtmlEntities(title.trim()),
          link: link || sourceUrl,
          summary: summary ? decodeHtmlEntities(summary.trim()).slice(0, 2000) : '',
          sourceName,
          sourceUrl: link || sourceUrl,
          publishedAt: published ? new Date(published).toISOString() : new Date().toISOString(),
        });
      }
    }
  } else {
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const item = match[1];
      const title = extractTag(item, 'title');
      const link = extractTag(item, 'link');
      const description = extractTag(item, 'description');
      const pubDate = extractTag(item, 'pubDate') || extractTag(item, 'dc:date');

      if (title) {
        items.push({
          title: decodeHtmlEntities(title.trim()),
          link: link || sourceUrl,
          summary: description ? decodeHtmlEntities(description.trim()).slice(0, 2000) : '',
          sourceName,
          sourceUrl: link || sourceUrl,
          publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        });
      }
    }
  }

  return items;
};

const extractTag = (xml, tag) => {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = regex.exec(xml);
  return match ? match[1].trim() : null;
};

const extractAtomLink = (xml) => {
  const regex = /<link[^>]*href="([^"]*)"[^>]*\/?>/i;
  const match = regex.exec(xml);
  return match ? match[1] : null;
};

const decodeHtmlEntities = (text) => {
  return text
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#\d+;/g, (m) => String.fromCharCode(m.slice(2, -1)));
};

// --------------- TF-IDF Classifier (zero-cost) ---------------

const classifyRelevance = (title, summary, theme, objective) => {
  const keywords = (theme + ' ' + (objective || ''))
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .map((w) => w.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));

  if (keywords.length === 0) return 50;

  const text = ((title || '') + ' ' + (summary || ''))
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  let matches = 0;
  for (const kw of keywords) {
    if (text.includes(kw)) matches++;
  }

  const ratio = matches / keywords.length;
  return Math.min(100, Math.round(ratio * 100));
};

// --------------- Helpers ---------------

const extractSourceName = (url) => {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

const generateTags = (title, summary, theme) => {
  const tags = [theme];
  const words = ((title || '') + ' ' + (summary || '')).toLowerCase().split(/\s+/);
  const significant = words.filter(
    (w) => w.length > 4 && !['para', 'como', 'mais', 'sobre', 'entre', 'apos', 'antes'].includes(w)
  );
  const unique = [...new Set(significant)].slice(0, 5);
  return [...tags, ...unique];
};

const calculateNextRun = (frequency) => {
  const now = new Date();
  switch (frequency) {
    case 'real-time':
      return new Date(now.getTime() + 10 * 60 * 1000).toISOString();
    case 'hourly':
      return new Date(now.getTime() + 60 * 60 * 1000).toISOString();
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  }
};

// --------------- Main Handler ---------------

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, error: 'Invalid JSON body' });
  }

  const { agentId, workspaceId } = payload;
  if (!agentId || !workspaceId) {
    return json(400, { ok: false, error: 'Missing agentId or workspaceId' });
  }

  const supabase = getSupabaseAdmin();

  try {
    // 1. Buscar a config RAI do agente (rai_configs)
    const { data: config, error: configError } = await supabase
      .from('rai_configs')
      .select('*')
      .eq('agent_id', agentId)
      .eq('workspace_id', workspaceId)
      .single();

    if (configError || !config) {
      return json(404, {
        ok: false,
        error: 'RAI config not found for this agent',
        details: configError,
      });
    }

    if (config.status === 'paused') {
      return json(200, { ok: true, data: { agentId, status: 'paused', message: 'Agent is paused, skipping run' } });
    }

    // 2. Buscar dados do agente no SagB (agents)
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('id, name')
      .eq('id', agentId)
      .single();

    if (agentError || !agent) {
      return json(404, { ok: false, error: 'Agent not found in SagB', details: agentError });
    }

    const sources = config.sources_json || [];
    if (!Array.isArray(sources) || sources.length === 0) {
      return json(400, { ok: false, error: 'Agent has no sources configured' });
    }

    // 3. Fetch RSS de cada fonte
    const allItems = [];
    const fetchErrors = [];

    for (const sourceUrl of sources) {
      try {
        const response = await fetch(sourceUrl, {
          headers: { 'User-Agent': 'SagB-RAI/1.0' },
          signal: AbortSignal.timeout(15000),
        });

        if (!response.ok) {
          fetchErrors.push({ source: sourceUrl, error: `HTTP ${response.status}` });
          continue;
        }

        const xmlText = await response.text();
        const sourceName = extractSourceName(sourceUrl);
        const items = parseRSS(xmlText, sourceName, sourceUrl);
        allItems.push(...items);
      } catch (err) {
        fetchErrors.push({ source: sourceUrl, error: err.message || 'Fetch failed' });
      }
    }

    // 4. Classificar e preparar capturas
    const captures = allItems.map((item) => ({
      workspace_id: workspaceId,
      agent_id: agentId,
      config_id: config.id,
      title: item.title,
      content: item.summary,
      summary: item.summary ? item.summary.slice(0, 500) : null,
      source_url: item.sourceUrl,
      source_name: item.sourceName,
      relevance_score: classifyRelevance(item.title, item.summary, config.theme, config.objective),
      captured_at: item.publishedAt,
      status: 'new',
      tags_json: JSON.stringify(generateTags(item.title, item.summary, config.theme)),
      category: config.theme,
    }));

    // 5. Persistir no Supabase (batch insert, ignorando duplicatas por source_url)
    let insertedCount = 0;
    if (captures.length > 0) {
      const batchSize = 50;
      for (let i = 0; i < captures.length; i += batchSize) {
        const batch = captures.slice(i, i + batchSize);
        const { error: insertError } = await supabase
          .from('rai_captures')
          .upsert(batch, {
            onConflict: 'source_url',
            ignoreDuplicates: true,
          });

        if (insertError) {
          console.error('[RAI RSS] Batch insert error:', insertError);
        } else {
          insertedCount += batch.length;
        }
      }
    }

    // 6. Atualizar last_run_at da config
    const now = new Date().toISOString();
    const nextRun = calculateNextRun(config.frequency || 'daily');

    await supabase
      .from('rai_configs')
      .update({
        last_run_at: now,
        next_run_at: nextRun,
        status: 'active',
        updated_at: now,
      })
      .eq('id', config.id);

    return json(200, {
      ok: true,
      data: {
        agentId,
        agentName: agent.name,
        configId: config.id,
        sourcesProcessed: sources.length,
        itemsFound: allItems.length,
        itemsInserted: insertedCount,
        fetchErrors: fetchErrors.length > 0 ? fetchErrors : undefined,
        nextRun,
      },
    });
  } catch (error) {
    console.error('[RAI RSS] Fatal error:', error);
    return json(500, { ok: false, error: error.message || 'Internal Server Error' });
  }
}
