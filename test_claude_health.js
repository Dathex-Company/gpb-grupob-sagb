// Teste específico para verificar por que Claude aparece como "off"
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('=== TESTE ESPECÍFICO DO CLAUDE ===\n');

// Simular ambiente Netlify com chaves configuradas
process.env.ANTHROPIC_API_KEY = 'TEST_KEY_SIMULADA'; // Chave simulada para teste
process.env.ANTHROPIC_MODEL = 'claude-3-5-haiku-latest';

// Carregar a função de verificação do Claude do arquivo ai.mjs
async function testClaudeHealth() {
  try {
    console.log('1. Analisando função checkClaudeHealth do ai.mjs...');
    
    // Ler o arquivo ai.mjs para entender a lógica
    const fs = await import('fs');
    const aiMjsPath = join(__dirname, 'netlify/functions/ai.mjs');
    const aiMjsContent = fs.readFileSync(aiMjsPath, 'utf8');
    
    // Extrair a função checkClaudeHealth
    const claudeHealthMatch = aiMjsContent.match(/const checkClaudeHealth = async \(\) => \{[\s\S]*?\n\}/);
    
    if (claudeHealthMatch) {
      console.log('✅ Função checkClaudeHealth encontrada');
      console.log('\n2. Lógica da verificação:');
      
      // Analisar a lógica
      const funcText = claudeHealthMatch[0];
      if (funcText.includes('pickAnthropicKey()')) {
        console.log('   - Usa pickAnthropicKey() para obter a chave');
      }
      if (funcText.includes('api.anthropic.com')) {
        console.log('   - Faz requisição para https://api.anthropic.com/v1/messages');
      }
      if (funcText.includes('timedFetch')) {
        console.log('   - Usa timedFetch com timeout de 10000ms (10 segundos)');
      }
      
      // Verificar a função pickAnthropicKey
      const pickKeyMatch = aiMjsContent.match(/const pickAnthropicKey = \(\) => \{[\s\S]*?\n\}/);
      if (pickKeyMatch) {
        console.log('\n3. Função pickAnthropicKey:');
        const pickKeyText = pickKeyMatch[0];
        console.log('   - Busca em múltiplas variáveis:');
        if (pickKeyText.includes('ANTHROPIC_API_KEY')) console.log('     • ANTHROPIC_API_KEY');
        if (pickKeyText.includes('ANTROPIC_API_KEY')) console.log('     • ANTROPIC_API_KEY (alternativa)');
        if (pickKeyText.includes('VITE_ANTHROPIC_API_KEY')) console.log('     • VITE_ANTHROPIC_API_KEY');
        if (pickKeyText.includes('VITE_ANTROPIC_API_KEY')) console.log('     • VITE_ANTROPIC_API_KEY');
      }
    }
    
    console.log('\n4. Possíveis problemas:');
    console.log('   a) Chave expirada ou inválida');
    console.log('   b) Timeout na requisição (10 segundos)');
    console.log('   c) Rate limiting da Anthropic');
    console.log('   d) Formato incorreto da chave');
    console.log('   e) Problemas de rede no Netlify → Anthropic');
    
    console.log('\n5. Teste de conectividade simplificado:');
    console.log('   Para testar manualmente a chave do Claude:');
    console.log('   curl -X POST https://api.anthropic.com/v1/messages \\');
    console.log('     -H "x-api-key: SUA_CHAVE_AQUI" \\');
    console.log('     -H "anthropic-version: 2023-06-01" \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"model":"claude-3-5-haiku-latest","max_tokens":1,"messages":[{"role":"user","content":"ping"}]}\'');
    
    console.log('\n6. Verificar logs do Netlify:');
    console.log('   netlify logs --functions ai');
    console.log('   Procure por erros específicos do Claude');
    
    console.log('\n7. Soluções possíveis:');
    console.log('   a) Verificar se a chave tem créditos/está ativa');
    console.log('   b) Testar com curl (acima) para confirmar funcionamento');
    console.log('   c) Aumentar timeout na função timedFetch');
    console.log('   d) Verificar região/restrições da chave Anthropic');
    
  } catch (error) {
    console.error('Erro no teste:', error.message);
  }
}

// Executar teste
await testClaudeHealth();

console.log('\n=== ANÁLISE DA LLAMA ===');
console.log('\nA Llama não está configurada (conforme informado).');
console.log('Soluções para Llama:');
console.log('1. Configurar LLAMA_LOCAL_URL no Netlify (se tiver Ollama cloud)');
console.log('2. Modificar providerHealth.ts para ignorar Llama quando não configurada');
console.log('3. Remover Llama da lista de provedores verificados');

console.log('\n=== PRÓXIMOS PASSOS ===');
console.log('1. Testar a chave do Claude com curl (acima)');
console.log('2. Verificar logs do Netlify Functions');
console.log('3. Testar timeout aumentando para 15-20 segundos');
console.log('4. Verificar status da conta Anthropic');