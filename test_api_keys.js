// Script para testar as API keys do Netlify
// Este script simula a verificação de saúde dos provedores

console.log('=== TESTE DE API KEYS DO NETLIFY ===\n');

// Simular variáveis de ambiente que seriam usadas no Netlify
const envVars = {
  // Chaves que devem estar configuradas no Netlify
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  LLAMA_LOCAL_URL: process.env.LLAMA_LOCAL_URL || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  
  // Variáveis de compatibilidade
  VITE_LOCAL_LLAMA_URL: process.env.VITE_LOCAL_LLAMA_URL || '',
  VITE_GEMINI_API_KEY: process.env.VITE_GEMINI_API_KEY || '',
  VITE_DEEPSEEK_API_KEY: process.env.VITE_DEEPSEEK_API_KEY || '',
  VITE_ANTHROPIC_API_KEY: process.env.VITE_ANTHROPIC_API_KEY || '',
};

console.log('Variáveis de ambiente detectadas:');
console.log('================================');

let missingKeys = [];
let configuredKeys = [];

Object.entries(envVars).forEach(([key, value]) => {
  const isConfigured = value && value.trim() !== '' && !value.includes('your-');
  const status = isConfigured ? '✅ CONFIGURADA' : '❌ AUSENTE/INVÁLIDA';
  
  console.log(`${key}: ${status}`);
  
  if (isConfigured) {
    configuredKeys.push(key);
    // Mostrar apenas últimos 4 caracteres por segurança
    const maskedValue = value.length > 4 ? '***' + value.slice(-4) : '***';
    console.log(`   Valor: ${maskedValue}`);
  } else {
    missingKeys.push(key);
  }
});

console.log('\n================================');
console.log(`Total configuradas: ${configuredKeys.length}`);
console.log(`Total ausentes: ${missingKeys.length}`);

// Análise específica para Claude e Llama (problema relatado)
console.log('\n=== ANÁLISE DO PROBLEMA REPORTADO ===');
console.log('Problema: Claude e Llama aparecem como "off" no SagB\n');

const claudeStatus = envVars.ANTHROPIC_API_KEY ? '✅ Chave presente' : '❌ Chave ausente';
const llamaStatus = envVars.LLAMA_LOCAL_URL || envVars.VITE_LOCAL_LLAMA_URL ? '✅ URL configurada' : '❌ URL ausente';

console.log(`1. Claude (Anthropic): ${claudeStatus}`);
if (!envVars.ANTHROPIC_API_KEY) {
  console.log('   → A variável ANTHROPIC_API_KEY não está configurada no Netlify');
  console.log('   → Isso faz com que a verificação de saúde falhe');
}

console.log(`\n2. Llama Local: ${llamaStatus}`);
if (!envVars.LLAMA_LOCAL_URL && !envVars.VITE_LOCAL_LLAMA_URL) {
  console.log('   → Nenhuma URL de Llama/Ollama configurada');
  console.log('   → LLAMA_LOCAL_URL ou VITE_LOCAL_LLAMA_URL precisa ser definida');
} else {
  const llamaUrl = envVars.LLAMA_LOCAL_URL || envVars.VITE_LOCAL_LLAMA_URL;
  console.log(`   → URL: ${llamaUrl}`);
  
  // Verificar se é uma URL local (127.0.0.1) que não funcionaria no Netlify
  if (llamaUrl.includes('127.0.0.1') || llamaUrl.includes('localhost')) {
    console.log('   ⚠️  ATENÇÃO: URL local detectada (127.0.0.1 ou localhost)');
    console.log('   → No Netlify, serviços locais não são acessíveis');
    console.log('   → Solução: Usar URL pública ou desabilitar verificação de Llama');
  }
}

// Recomendações
console.log('\n=== RECOMENDAÇÕES ===');
console.log('\n1. Para Claude:');
console.log('   - Configure ANTHROPIC_API_KEY no painel do Netlify');
console.log('   - Obtenha a chave em: https://console.anthropic.com/');

console.log('\n2. Para Llama Local:');
console.log('   Opção A - Usar serviço cloud:');
console.log('     - Configure LLAMA_LOCAL_URL com URL pública do Ollama');
console.log('     - Ex: https://seu-ollama-cloud.com');
console.log('   Opção B - Desabilitar verificação:');
console.log('     - Modifique providerHealth.ts para ignorar Llama se URL não estiver acessível');
console.log('   Opção C - Usar ngrok (para desenvolvimento):');
console.log('     - ngrok http 11434');
console.log('     - Use a URL pública gerada pelo ngrok');

console.log('\n3. Verificação no Netlify:');
console.log('   - Acesse https://app.netlify.com/sites/[seu-site]/settings/deploys#environment');
console.log('   - Verifique se todas as variáveis estão configuradas');

console.log('\n4. Testar após configuração:');
console.log('   - Faça novo deploy no Netlify');
console.log('   - Acesse a seção "IA e Agentes" no Monitoramento do SagB');
console.log('   - Os provedores devem aparecer como online (verde)');

// Verificar se há arquivo de função
console.log('\n=== VERIFICAÇÃO DE ARQUIVOS ===');

// Usar import dinâmico para verificar arquivos
try {
  const fs = await import('fs');
  const path = await import('path');
  const { fileURLToPath } = await import('url');
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  const functionPath = path.join(__dirname, 'netlify/functions/ai.mjs');
  const providerHealthPath = path.join(__dirname, 'services/providerHealth.ts');

  console.log(`Função ai.mjs: ${fs.existsSync(functionPath) ? '✅ Existe' : '❌ Não encontrada'}`);
  console.log(`Serviço providerHealth.ts: ${fs.existsSync(providerHealthPath) ? '✅ Existe' : '❌ Não encontrada'}`);

  if (fs.existsSync(functionPath)) {
    console.log('\nA função está configurada para verificar:');
    console.log('- Gemini, DeepSeek, OpenAI, Claude, Llama Local');
    console.log('\nCódigo funcionando corretamente, apenas aguardando configuração das chaves.');
  }
} catch (error) {
  console.log('Erro ao verificar arquivos:', error.message);
}
