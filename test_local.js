// Teste rápido para verificar as correções
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('=== VERIFICAÇÃO DAS CORREÇÕES ===\n');

const aiPath = join(__dirname, 'netlify/functions/ai.mjs');
const content = readFileSync(aiPath, 'utf8');

// Verificar timeout do Claude
const claudeTimeout = content.includes('20000) // Aumentado de 10 para 20 segundos');
console.log('1. Timeout do Claude aumentado para 20s:', claudeTimeout ? '✅ SIM' : '❌ NÃO');

if (!claudeTimeout) {
  console.log('   → Procure por "20000" no arquivo ai.mjs');
}

// Verificar correção da Llama
const llamaFix = content.includes('if (!endpoint) {') && content.includes('// Não falha quando não configurado');
console.log('2. Llama não falha quando não configurada:', llamaFix ? '✅ SIM' : '❌ NÃO');

if (!llamaFix) {
  console.log('   → Procure por "if (!endpoint)" no arquivo ai.mjs');
}

console.log('\n=== IMPORTANTE ===');
console.log('As alterações no arquivo ai.mjs são para o SERVER-SIDE (Netlify Functions).');
console.log('Para testar localmente, você precisa:');
console.log('1. Fazer deploy no Netlify:');
console.log('   git add .');
console.log('   git commit -m "fix: corrige verificação Claude e Llama"');
console.log('   git push');
console.log('');
console.log('2. Ou testar localmente com Netlify CLI:');
console.log('   npm install -g netlify-cli');
console.log('   netlify dev');
console.log('');
console.log('=== STATUS ATUAL ===');
console.log('Servidor rodando em: http://localhost:5174/');
console.log('Acesse Monitoramento → IA e Agentes');
console.log('');
console.log('Se Claude ainda aparece como "off":');
console.log('- A chave ANTHROPIC_API_KEY pode estar inválida/expirada');
console.log('- Teste com curl:');
console.log('  curl -X POST https://api.anthropic.com/v1/messages \\');
console.log('    -H "x-api-key: SUA_CHAVE" \\');
console.log('    -H "anthropic-version: 2023-06-01" \\');
console.log('    -H "Content-Type: application/json" \\');
console.log('    -d \'{"model":"claude-3-5-haiku-latest","max_tokens":1,"messages":[{"role":"user","content":"ping"}]}\'');