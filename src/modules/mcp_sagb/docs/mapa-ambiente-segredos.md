# Mapa de Ambientes e Segredos — LOZE-MCP-OPS V1

> Documento oficial de mapeamento de ambientes, variáveis e segredos do ecossistema SagB.
> **Regra absoluta:** Nenhum segredo real, chave de API, token ou credencial verdadeira será registrado neste ou em qualquer documento do projeto.

---

## 1. Definição do Documento

Este documento organiza e classifica todas as variáveis de ambiente, chaves e segredos utilizados pelo ecossistema SagB, discriminando:

- Nome da variável
- Tipo (pública, build, backend crítica, operação/admin)
- Onde está armazenada
- Ambiente aplicável
- Quem pode usar
- Nível de risco
- Regra de rotação
- Responsável

---

## 2. Regra Fundamental

> **🚫 NENHUM VALOR REAL DE SEGREDO SERÁ REGISTRADO AQUI.**
> Use este documento como mapa de referência, não como cofre.
> Segredos reais residem exclusivamente em:
> - **Netlify** (variáveis de ambiente de site)
> - **GitHub Secrets** (Actions, ambientes protegidos)
> - **Supabase** (Dashboard > Settings > API)
> - **Cofre externo** (Bitwarden / 1Password / Vault — quando aplicável)
> - **MCP Internal Ops** (credencial de curta duração para operações)

---

## 3. Grupos de Classificação

### GRUPO 1 — Chaves Públicas de Frontend
Variáveis injetadas no bundle do frontend (Vite). São consideradas públicas pois ficam visíveis no navegador.

| Variável | Tipo | Onde Fica | Ambiente | Quem Pode Usar | Risco | Observação | Responsável | Rotação |
|----------|------|-----------|----------|----------------|-------|-----------|-------------|---------|
| `VITE_SUPABASE_URL` | Pública | Netlify, .env.local | Local, Preview, Produção | Frontend, Agentes | 🟢 Baixo | URL pública do projeto Supabase | Sávio Codare | Não se aplica |
| `VITE_SUPABASE_ANON_KEY` | Pública | Netlify, .env.local | Local, Preview, Produção | Frontend, Agentes | 🟡 Médio | Chave anônima (anon key) — pública pelo design do Supabase, mas deve ser protegida contra abuso via RLS | Sávio Codare | Apenas em caso de vazamento |
| `VITE_SITE_URL` | Pública | Netlify, .env.local | Local, Preview, Produção | Frontend | 🟢 Baixo | URL do site para redirecionamentos | Sávio Codare | Não se aplica |

### GRUPO 2 — Segredos de Build/Deploy
Variáveis usadas durante build e deploy. Não vão para o bundle final, mas são críticas para CI/CD.

| Variável | Tipo | Onde Fica | Ambiente | Quem Pode Usar | Risco | Observação | Responsável | Rotação |
|----------|------|-----------|----------|----------------|-------|-----------|-------------|---------|
| `NETLIFY_AUTH_TOKEN` | Build/Deploy | GitHub Secrets | Preview, Produção | GitHub Actions, Netlify CLI | 🔴 Alto | Token de autenticação Netlify — permite gerenciar sites | Sávio Codare | 90 dias |
| `NETLIFY_SITE_ID` | Build/Deploy | GitHub Secrets, .env | Preview, Produção | GitHub Actions, Netlify CLI | 🟢 Baixo | ID do site Netlify, não é secreto mas evita engano de ambiente | Sávio Codare | Não se aplica |
| `GITHUB_TOKEN` (ou `GH_TOKEN`) | Build/Deploy | GitHub (automático) | Preview, Produção | GitHub Actions | 🟡 Médio | Token automático do GitHub Actions — escopo limitado ao workflow | GitHub | Automática |
| `GITHUB_ACTIONS_SECRET` | Build/Deploy | GitHub Secrets | Preview, Produção | GitHub Actions | 🔴 Alto | Segredo customizado para validação de workflows | Sávio Codare | 90 dias |
| `WEBHOOK_SECRET` | Build/Deploy | GitHub Secrets, Netlify | Preview, Produção | Webhooks | 🔴 Alto | Segredo de validação de webhook — evita chamadas maliciosas | Sávio Codare | 90 dias |
| `MCP_INTERNAL_OPS_TOKEN` | Build/Deploy | GitHub Secrets, Netlify | Preview, Produção | MCP Server, Agentes autorizados | 🔴 Alto | Token de operação interna do MCP — usado pelo MCP para autenticar chamadas de operação | Sávio Codare | 30 dias |

### GRUPO 3 — Segredos Críticos de Backend
Variáveis com acesso a dados, administração de infraestrutura ou operações sensíveis. **NUNCA vão para frontend.**

| Variável | Tipo | Onde Fica | Ambiente | Quem Pode Usar | Risco | Observação | Responsável | Rotação |
|----------|------|-----------|----------|----------------|-------|-----------|-------------|---------|
| `SUPABASE_SERVICE_ROLE_KEY` | Backend Crítica | GitHub Secrets (protegido), Netlify (backend), Cofre | Preview, Produção | Backend (Edge Functions, API), Admin | 🔴 Crítico | **NUNCA vai para frontend.** Acesso total ao banco. | Sávio Codare | 30 dias |
| `SUPABASE_DB_PASSWORD` | Backend Crítica | Cofre, Supabase Dashboard | Produção | DBA, Admin | 🔴 Crítico | Senha do banco de dados direto | Sávio Codare | 90 dias |
| `SUPABASE_JWT_SECRET` | Backend Crítica | Cofre, Supabase Dashboard | Produção | Admin | 🔴 Crítico | Segredo JWT para validação de tokens | Sávio Codare | 180 dias |
| `OPENAI_API_KEY` | Backend Crítica | GitHub Secrets (protegido), Netlify (backend) | Preview, Produção | Backend, Agentes autorizados | 🔴 Alto | Chave de API OpenAI — uso custeado | Sávio Codare | 90 dias |
| `RESEND_API_KEY` | Backend Crítica | GitHub Secrets (protegido), Netlify (backend) | Preview, Produção | Backend | 🔴 Alto | Chave de API Resend (email) | Sávio Codare | 90 dias |
| `STRIPE_SECRET_KEY` | Backend Crítica | Cofre, GitHub Secrets (protegido) | Produção | Backend, Admin | 🔴 Crítico | Chave secreta Stripe — operações financeiras | Sávio Codare | 90 dias |

---

## 4. Matriz de Ambientes

| Ambiente | Finalidade | Onde Variáveis Residem | Acesso Restrito | Logs |
|----------|-----------|----------------------|----------------|------|
| **Local** | Desenvolvimento individual | `.env.local`, `.env` | Apenas dev local | Opcional |
| **Preview** | Deploy de PR/branch para testes | Netlify (variáveis de site), GitHub Secrets (Actions) | Time + revisores | Sim — registro de operações |
| **Produção** | Ambiente real de usuários | Netlify (variáveis de produção), GitHub Secrets (protegido), Cofre | Apenas admin autorizado | Sim — obrigatório com correlation_id |

---

## 5. Exemplos Seguros (sem valores reais)

```env
# GRUPO 1 — Chaves Públicas de Frontend
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyjanonkey_example_public_fake_key_abcdef
VITE_SITE_URL=https://example.netlify.app

# GRUPO 2 — Segredos de Build/Deploy
NETLIFY_AUTH_TOKEN=nfp_examplefaketoken
NETLIFY_SITE_ID=fake-site-id-12345
GITHUB_ACTIONS_SECRET=ghs_examplefakesecret
WEBHOOK_SECRET=whsec_examplefakesecret
MCP_INTERNAL_OPS_TOKEN=mcp_ops_examplefaketoken

# GRUPO 3 — Segredos Críticos de Backend
SUPABASE_SERVICE_ROLE_KEY=eyjservice_role_example_fake_key
SUPABASE_DB_PASSWORD=fake_password_do_not_use
SUPABASE_JWT_SECRET=fake_jwt_secret_example
OPENAI_API_KEY=sk-fake-openai-api-key-example
RESEND_API_KEY=re_fake_resend_api_key_example
STRIPE_SECRET_KEY=sk_live_fake_stripe_secret_key
```

> ⚠️ **Nota:** Todos os valores acima são **falsos e ilustrativos**. Não use em produção.

---

## 6. Regras de Rotação

| Tipo | Frequência | Gatilho | Observação |
|------|-----------|---------|-----------|
| Service Role Key | 30 dias | Automatizar via script | Coordenar com janela de manutenção |
| NETLIFY_AUTH_TOKEN | 90 dias | Manual | Regenerar no Netlify > Personal Access Tokens |
| MCP_INTERNAL_OPS_TOKEN | 30 dias | Automatizar via MCP | Token de curta duração para operações seguras |
| WEBHOOK_SECRET | 90 dias | Manual | Atualizar nos dois lados (emissor e receptor) |
| Chaves críticas (Stripe, OpenAI) | 90 dias | Imediato se houver suspeita de vazamento | Sempre manter uma chave de backup válida |

---

## 7. Responsabilidades

| Papel | Responsabilidade |
|-------|-----------------|
| **Sávio Codare** (Owner) | Manter este mapa atualizado, definir rotação, auditar acessos |
| **Agentes MCP** | Consultar este mapa para saber onde encontrar variáveis, **nunca** registrar valores reais |
| **GitHub Actions** | Usar Secrets para ações de CI/CD, nunca expor em logs |
| **Netlify** | Manter variáveis por ambiente (Produção vs Preview/Deploy) |

---

## 8. Histórico de Revisões

| Data | Versão | Alteração | Responsável |
|------|--------|-----------|-------------|
| 2026-06-07 | 1.0 | Criação do documento — Mapeamento inicial LOZE-MCP-OPS V1 | Cássio Mendes / Sávio Codare |

---

*Este documento é parte do padrão **LOZE-MCP-OPS | Operações, Ambientes e Segredos**.
Arquivo: `docs/mapa-ambiente-segredos.md`*
