/**
 * Importador Supabase-First — consulta real ao Supabase via REST API.
 * Uso: npm run cp:docs:dry-run  (compara local com Supabase)
 *       npm run cp:docs:import   (importa documentos para o Supabase)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';

const DOCS_ROOT = join(import.meta.dirname!, '..', 'docs');
const GLOB_PATTERN = /\.md$/i;

// Carrega variáveis do .env manualmente (evita dependência extra)
function loadEnv() {
  try {
    const envPath = join(import.meta.dirname!, '..', '..', '..', '..', '.env');
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const match = line.match(/^\s*VITE_SUPABASE_(URL|ANON_KEY)\s*=\s*(.+)/);
      if (match) process.env[`VITE_SUPABASE_${match[1]}`] = match[2].trim();
    }
  } catch { /* .env optional */ }
}
loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ SUPABASE_URL ou SUPABASE_ANON_KEY não configurados no .env');
  process.exit(1);
}

interface ScanItem {
  sourcePath: string;
  absolutePath: string;
  content: string;
  hash: string;
  title: string;
  summary: string;
  domain: string;
}

interface SupabaseDoc {
  id: string;
  title: string;
  source_path: string | null;
  path_relative: string | null;
  source_hash: string | null;
}

function hashContent(content: string) { return createHash('sha256').update(content, 'utf-8').digest('hex'); }
function extractTitle(content: string) { const m = content.match(/^#\s+(.+)/m); return m?.[1]?.trim() || 'Sem título'; }
function extractSummary(content: string, max = 200) {
  const lines = content.split('\n'); let start = false, s = '';
  for (const l of lines) {
    if (!start) { if (l.startsWith('# ')) start = true; continue; }
    if (l.startsWith('#') || l.startsWith('---')) break;
    if (l.trim()) s += l.trim() + ' ';
    if (s.length > max) break;
  }
  return s.trim().slice(0, max);
}
const DOMAINS: Record<string, string> = {
  '00-governanca': 'Governança', '01-padroes': 'Técnico', '02-processos': 'Processos',
  '03-seguranca': 'Segurança', '04-ux': 'UX/UI', '05-agentes': 'Agentes',
  '06-modelos': 'Modelos IA', '07-naming': 'Naming', '08-exploracao': 'Exploração',
  '09-metodologias': 'Metodologias', '10-educacao': 'Educação', '11-marcas': 'Negócios',
  '98-fontes': 'Fontes Originais', '99-curadoria': 'Curadoria',
};

function scanDirectory(dir: string, basePath = ''): ScanItem[] {
  const items: ScanItem[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fp = join(dir, entry.name);
    const rp = relative(DOCS_ROOT, fp).replace(/\\/g, '/');
    if (entry.isDirectory()) { items.push(...scanDirectory(fp, rp)); }
    else if (GLOB_PATTERN.test(entry.name)) {
      const c = readFileSync(fp, 'utf-8');
      items.push({ sourcePath: `docs/${rp}`, absolutePath: fp, content: c, hash: hashContent(c), title: extractTitle(c), summary: extractSummary(c), domain: Object.entries(DOMAINS).find(([k]) => rp.includes(k))?.[1] || 'Documentos' });
    }
  }
  return items;
}

async function fetchSupabaseDocs(): Promise<SupabaseDoc[]> {
  const docs: SupabaseDoc[] = [];
  const limit = 500;
  let offset = 0;
  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/central_padroes_documents?select=id,title,source_path,path_relative,source_hash&limit=${limit}&offset=${offset}`;
    const res = await fetch(url, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
    if (!res.ok) {
      console.error(`❌ Supabase query failed: ${res.status} ${res.statusText}`);
      break;
    }
    const batch = await res.json() as SupabaseDoc[];
    if (!batch.length) break;
    docs.push(...batch);
    offset += limit;
  }
  return docs;
}

async function importSingle(item: ScanItem, action: string, index: number, total: number) {
  const url = `${SUPABASE_URL}/rest/v1/rpc/cp_import_document`;
  const body = {
    p_title: item.title,
    p_content: item.content,
    p_source_path: item.sourcePath,
    p_content_format: 'markdown',
    p_source_kind: 'local_md',
    p_domain: item.domain,
    p_summary: item.summary,
    p_official_status: item.officialStatus || (item.sourcePath.includes('98-fontes') ? 'fonte_bruta' : item.sourcePath.includes('99-curadoria') ? 'curadoria' : item.sourcePath.includes('-previsto') ? 'rascunho' : 'oficial_ativo'),
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  console.log(`  [${index + 1}/${total}] ${res.ok ? '✅' : '❌'} ${action} ${item.title.slice(0, 60)} — ${JSON.stringify(data)}`);
  return { ok: res.ok, data };
}

async function main() {
  const args = process.argv.slice(2);
  const isImport = args.includes('--import');

  console.log('📂 Escaneando:', DOCS_ROOT);
  const local = scanDirectory(DOCS_ROOT);
  console.log(`📊 Locais: ${local.length} .md`);

  console.log('🔍 Consultando Supabase...');
  const remote = await fetchSupabaseDocs();
  console.log(`📊 Supabase: ${remote.length} documentos`);

  // Comparação
  const remoteByPath = new Map<string, SupabaseDoc>();
  for (const d of remote) {
    const key = d.source_path || d.path_relative || '';
    if (key) remoteByPath.set(key, d);
  }

  let create = 0, update = 0, skip = 0;
  const actions: { item: ScanItem; action: string }[] = [];

  for (const item of local) {
    const existing = remoteByPath.get(item.sourcePath);
    if (existing) {
      if (existing.source_hash === item.hash) { skip++; }
      else { update++; actions.push({ item, action: 'update' }); }
    } else { create++; actions.push({ item, action: 'create' }); }
  }

  console.log(`\n📊 Comparação:`);
  console.log(`   Criar:  ${create}`);
  console.log(`   Atualizar: ${update}`);
  console.log(`   Pular:  ${skip}`);
  console.log(`   Total:  ${local.length}`);
  console.log(`   Supabase: ${remote.length}`);
  console.log(`   Divergência: ${local.length - remote.length}`);

  if (isImport) {
    console.log(`\n📥 Importando ${actions.length} documentos...`);
    for (let i = 0; i < actions.length; i++) {
      await importSingle(actions[i].item, actions[i].action, i, actions.length);
    }
    console.log('\n✅ Importação concluída.');
  } else {
    console.log('\n💡 Dry-run concluído. Use --import para executar.');
  }
}

main().catch(err => { console.error('❌', err); process.exit(1); });
