# Procedimento de Rollback — API SagB

## Níveis de Rollback

### 🟢 Nível 1 — Rollback de Função Netlify
**Ação:** Reverter para versão estável anterior da função serverless.

**Procedimento:**
1. Acessar dashboard Netlify > Functions
2. Identificar última versão estável (tag `stable` no deploy)
3. Executar: `netlify deploy --prod --alias stable`
4. Verificar healthcheck: `GET /v1/health`

**Tempo Estimado:** 3 minutos
**Impacto:** Downtime de ~30 segundos (troca de deploy)

### 🟡 Nível 2 — Rollback de Migração Supabase
**Ação:** Reverter migração de banco (tabela `api_audit_log`).

**Procedimento:**
1. Conectar ao Supabase SQL Editor
2. Executar script de reversão:
```sql
-- Reversão da migração api_audit_log
DROP TABLE IF EXISTS api_audit_log CASCADE;
-- Nota: RLS policies são removidas em cascata
```
3. Verificar se tabela foi removida: `SELECT * FROM information_schema.tables WHERE table_name = 'api_audit_log';`

**Tempo Estimado:** 2 minutos
**Impacto:** Perda de logs de auditoria não persistidos. Dados na tabela são perdidos.

### 🟠 Nível 3 — Desativação de Endpoint Específico
**Ação:** Remover rota específica do roteador sem afetar outros endpoints.

**Procedimento:**
1. Editar `netlify/functions/api-sagb-router.mjs`
2. Remover entrada da `ROUTE_TABLE`
3. Fazer deploy: `netlify deploy --prod`
4. Verificar se rota removida retorna 404

**Tempo Estimado:** 5 minutos
**Impacto:** Endpoint específico fica indisponível

### 🔴 Nível 4 — Rollback Total
**Ação:** Desativar toda a API SagB e remover exposição pública.

**Procedimento:**
1. Remover rota `/api-sagb/*` do `netlify.toml`
2. Fazer deploy: `netlify deploy --prod`
3. Verificar se todas as rotas retornam 404
4. Notificar consumidores via canal de comunicação oficial
5. Remover API Keys de produção (manter apenas as de sandbox)

**Tempo Estimado:** 10 minutos
**Impacto:** API SagB completamente indisponível

## Gatilhos para Rollback

| Gatilho | Nível | Descrição |
|---------|-------|-----------|
| Taxa de erro > 5% por 5 minutos | 🟢 Nível 1 | Erro generalizado nos endpoints |
| Latência p99 > 10s por 3 minutos | 🟢 Nível 1 | Degradação severa de performance |
| Falha em adapter upstream > 50% das chamadas | 🟡 Nível 2 | Dependência externa comprometida |
| Dados corrompidos ou violação de segurança | 🟡 Nível 2 | Risco de integridade |
| Vazamento confirmado de API Key | 🟠 Nível 3 | Rotação imediata de chaves |
| Incidente de segurança crítico | 🔴 Nível 4 | Risco sistêmico |

## Pós-Rollback

Após qualquer rollback:
1. **Investigação**: Root cause analysis (RCA) em até 24h
2. **Correção**: Implementar fix e testar em sandbox
3. **Nova tentativa**: Repetir rollout seguindo mesmas ondas
4. **Comunicação**: Reportar incidente para consumidores afetados

## Checklist de Rollback

- [ ] Identificar nível de rollback
- [ ] Notificar equipe (Discord #api-sagb-incidents)
- [ ] Executar procedimento do nível correspondente
- [ ] Verificar reversão (healthcheck + testes)
- [ ] Notificar consumidores (se Nível 3 ou 4)
- [ ] Iniciar RCA
