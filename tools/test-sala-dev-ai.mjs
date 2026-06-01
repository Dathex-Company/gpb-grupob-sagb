import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const loadEnvFile = (fileName) => {
  const filePath = path.join(rootDir, fileName);
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, '');
  }
};

loadEnvFile('.env');
loadEnvFile('.env.local');

const { handler } = await import(pathToFileURL(path.join(rootDir, 'netlify/functions/ai.mjs')).href);

const callAction = async (action, payload) => {
  const startedAt = Date.now();
  const response = await handler({
    httpMethod: 'POST',
    body: JSON.stringify({ action, ...payload }),
  });
  const body = JSON.parse(response.body || '{}');
  const elapsedMs = Date.now() - startedAt;

  console.log(JSON.stringify({
    action,
    statusCode: response.statusCode,
    ok: body.ok,
    elapsedMs,
    dataKeys: body.data ? Object.keys(body.data) : [],
    error: body.error || null,
  }, null, 2));
};

await callAction('suggestNextSteps', {
  context: 'Teste da Sala Dev: validar Chat IA independente e próximos passos.',
});

await callAction('generateBriefing', {
  projectName: 'Teste Sala Dev IA',
  idea: 'Criar um mini CRUD de usuários para validar o pipeline.',
  objective: 'Validar geração de briefing com IA.',
  audience: 'Equipe interna de desenvolvimento.',
  constraints: 'Sem acessar arquivos ou executar comandos reais.',
});

await callAction('chat', {
  messages: [
    { role: 'user', content: 'Responda em uma frase: a action chat da Sala Dev está operacional?' },
  ],
  temperature: 0.1,
  maxTokens: 80,
});
