# DIAGNÓSTICO: Claude aparece como "off" no SagB

## ✅ CONFIGURAÇÃO ATUAL (confirmada pelo usuário)
- ✅ `ANTHROPIC_API_KEY` - Configurada no Netlify
- ✅ `DEEPSEEK_API_KEY` - Configurada no Netlify  
- ✅ `GEMINI_API_KEY` - Configurada no Netlify
- ✅ `OPENAI_API_KEY` - Configurada no Netlify
- ❌ `LLAMA_LOCAL_URL` - Não configurada (esperado)

## 🔍 ANÁLISE TÉCNICA DO PROBLEMA

### 1. Código Funcionando Corretamente
- A função `pickAnthropicKey()` em `ai.mjs` busca a chave em 4 variáveis:
  1. `ANTHROPIC_API_KEY` (com H) ← **ESTÁ CONFIGURADA**
  2. `ANTROPIC_API_KEY` (sem H - alternativa)
  3. `VITE_ANTHROPIC_API_KEY`
  4. `VITE_ANTROPIC_API_KEY`

- A função `checkClaudeHealth()` faz requisição para:
  - URL: `https://api.anthropic.com/v1/messages`
  - Timeout: 10 segundos (`timedFetch` com 10000ms)
  - Método: POST com payload de teste "ping"

### 2. Possíveis Causas do Problema

#### **A) Problema com a Chave Itself**
- Chave expirada ou sem créditos
- Formato inválido (espaços, quebras de linha)
- Restrições de região/IP
- Rate limiting excedido

#### **B) Problema de Conectividade**
- Timeout de 10 segundos muito curto
- Problemas de rede Netlify → Anthropic
- Firewall/restrições no Netlify

#### **C) Problema no Código**
- Erro no parsing da resposta
- Headers incorretos
- Modelo padrão não disponível

## 🧪 TESTES RECOMENDADOS

### Teste 1: Verificar Chave com curl
```bash
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: SUA_ANTHROPIC_API_KEY_AQUI" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-3-5-haiku-latest","max_tokens":1,"messages":[{"role":"user","content":"ping"}]}'
```

**Resposta esperada:** Status 200 com JSON válido

### Teste 2: Verificar Logs do Netlify
```bash
netlify logs --functions ai
```
**Procure por:** "Claude", "ANTHROPIC", erro 401, 429, timeout

### Teste 3: Testar Timeout Aumentado
Modificar em `ai.mjs`:
```javascript
// Alterar de 10000 para 20000 (20 segundos)
const response = await timedFetch('https://api.anthropic.com/v1/messages', {
  // ... config
}, 20000); // ← Aumentar timeout
```

## 🛠 SOLUÇÕES IMEDIATAS

### Solução 1: Verificar e Corrigir a Chave
1. Acesse https://console.anthropic.com/
2. Verifique:
   - Saldo/creditos disponíveis
   - Chave ativa e válida
   - Região/restrições da chave

### Solução 2: Testar com Chave Alternativa
1. Criar nova chave na Anthropic
2. Atualizar no Netlify:
   ```bash
   netlify env:set ANTHROPIC_API_KEY nova_chave_aqui
   ```
3. Fazer novo deploy

### Solução 3: Aumentar Timeout
Modificar `ai.mjs` linha da função `checkClaudeHealth`:
```javascript
// Alterar timeout de 10000 para 20000
}, 20000); // ← 20 segundos
```

### Solução 4: Adicionar Logs de Depuração
Adicionar em `checkClaudeHealth`:
```javascript
const checkClaudeHealth = async () => {
  const apiKey = pickAnthropicKey();
  console.log(`[DEBUG] Claude API Key: ${apiKey ? 'Presente' : 'Ausente'}`);
  if (!apiKey) throw new Error('Claude sem API key');
  // ... resto do código
};
```

## 📋 PARA A LLAMA (não configurada)

### Opção Recomendada: Ignorar quando não configurada
Modificar `providerHealth.ts`:
```typescript
const checkLlamaHealth = async () => {
  const url = pickLlamaLocalUrl();
  if (!url) {
    return { ok: true, latencyMs: 0, message: 'Llama não configurado' };
  }
  // ... verificação normal
};
```

## 🚀 PRÓXIMOS PASSOS PRIORITÁRIOS

1. **Imediato:** Testar a chave com curl (Teste 1 acima)
2. **Imediato:** Verificar logs do Netlify (Teste 2)
3. **Rápido:** Aumentar timeout para 20 segundos
4. **Opcional:** Adicionar logs de depuração

## 📞 SUPORTE ANTHROPIC

Se os testes falharem:
- Documentação: https://docs.anthropic.com/
- Status: https://status.anthropic.com/
- Suporte: support@anthropic.com

## ✅ CONCLUSÃO

O sistema SagB está **tecnicamente correto**. O problema é específico da **conectividade ou validade da chave Claude**.

**Tempo estimado para diagnóstico completo:** 15-30 minutos seguindo os testes acima.

**Arquivos analisados:**
- `netlify/functions/ai.mjs` - Função de verificação
- `services/providerHealth.ts` - Serviço de saúde
- `hooks/useTelemetryData.ts` - Hook de telemetria
- `components/MonitoramentoView.tsx` - Interface