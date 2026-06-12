# Deploy SagB - Ambientes, Preview e Esteira Oficial

## 1) Ambientes oficiais

### Local (desenvolvimento)
- Objetivo: desenvolvimento diário e testes rápidos.
- Origem: máquina do desenvolvedor.
- Execução: `npm run dev` ou `netlify dev`.
- URL local típica:
  - `http://localhost:5173` (Vite)
  - `http://localhost:8888` (Netlify Dev, quando usado)

### Preview
- Objetivo: validar mudanças antes de produção.
- Origem: Pull Request (PR) para `main`.
- Geração:
  - Netlify Deploy Preview (integração nativa com GitHub).
  - Backup opcional: workflow `.github/workflows/netlify-deploy.yml` (job de PR).
- URL: fornecida pelo Netlify por PR (subdomínio de preview do site).

### Produção
- Objetivo: ambiente oficial de operação.
- Branch oficial: `main`.
- Trigger oficial: push/merge em `main`.
- URL oficial: `https://sagb.piblo.com.br`.

---

## 2) Fluxo oficial de publicação (padrão SagB)

1. Desenvolver localmente.
2. Validar local (`npm run build` obrigatório antes de publicar).
3. Commit no Git.
4. Push para GitHub.
5. Se for PR para `main`: gerar/revisar Deploy Preview.
6. Merge em `main`.
7. Netlify publica produção automaticamente.
8. Rodar checklist pós-deploy.

> Ordem mandatória: **local -> commit -> push -> (preview quando aplicável) -> produção**.

---

## 3) Estratégia de branch e gatilhos

- **Produção publica a partir de:** `main`.
- **Preview entra quando:** existir PR aberto com mudanças para `main`.
- **Produção entra quando:** PR for mergeado em `main` ou push direto autorizado na `main`.
- **Push direto em `main`:** permitido apenas para hotfix crítico com validação pós-deploy reforçada.

---

## 4) URLs oficiais por ambiente

- Local (Vite): `http://localhost:5173`
- Local (Netlify Dev): `http://localhost:8888`
- Preview (Netlify): URL dinâmica por PR (subdomínio gerado automaticamente)
- Produção: `https://sagb.piblo.com.br`

---

## 5) Variáveis de ambiente por contexto

## 5.1 Local

Obrigatórias para fluxo mínimo com Supabase:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Se usar funções admin/local com privilégios:
- `SUPABASE_SERVICE_ROLE_KEY`

IA (conforme funcionalidades usadas):
- `GEMINI_API_KEY`
- `DEEPSEEK_API_KEY`

## 5.2 Preview (Netlify)

Obrigatórias:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (funções server-side que exigem admin)

IA (conforme módulos ativos em preview):
- `GEMINI_API_KEY`
- `DEEPSEEK_API_KEY`

## 5.3 Produção (Netlify)

Obrigatórias:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Aliases aceitos pelo runtime (compatibilidade):
- `SUPABASE_URL` (alias de `VITE_SUPABASE_URL`)
- `SUPABASE_ANON_KEY` (alias de `VITE_SUPABASE_ANON_KEY`)
- `SUPABASE_SERVICE_KEY` (alias de `SUPABASE_SERVICE_ROLE_KEY`)

> Padrão oficial recomendado: usar sempre os nomes preferenciais para reduzir risco operacional.

## 5.4 Exclusivas de backend/funções

- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `DEEPSEEK_API_KEY`

**Nunca expor em frontend/browser**.

---

## 6) Checklist oficial pós-deploy

1. Verificar status do deploy no Netlify (build sem erro).
2. Validar URL principal (`https://sagb.piblo.com.br`) com HTTP 200.
3. Validar função crítica:
   - `POST /.netlify/functions/auth-admin` sem token deve retornar `401`.
   - `GET /.netlify/functions/auth-admin` deve retornar `405`.
4. Validar endpoint de IA (`/api/ai`) sem erro de roteamento.
5. Validar login/autenticação no app publicado.
6. Registrar evidências (data, commit, resultado) no histórico técnico.

---

## 7) Procedimento básico de rollback

Quando usar:
- erro crítico em produção após deploy;
- indisponibilidade de função essencial;
- regressão de segurança/compliance.

Passos:
1. Identificar último deploy estável no Netlify.
2. Acionar **Publish deploy** do build estável anterior.
3. Se necessário, executar **Clear cache and deploy site** após correção.
4. Revalidar checklist pós-deploy.
5. Registrar incidente + causa raiz no histórico (`DEV_LOG.md` e/ou `docs/modular-map/HISTORICO_MODULOS.md`).

---

## 8) Segurança e governança operacional

- Não reutilizar `SUPABASE_SERVICE_ROLE_KEY` em cliente/frontend.
- Evitar divergência de env entre Preview e Produção.
- Toda mudança de env crítica deve gerar novo deploy e validação.
- Evitar push direto em `main` fora de hotfix autorizado.
- Se houver mudança de branch oficial de produção, atualizar documentação e automações no mesmo ciclo.

---

## 9) O que já está implementado vs. dependências externas

Implementado no repositório:
- Fluxo com `main` como produção.
- `netlify.toml` com build/publish/redirects.
- Workflow de backup para preview/produção via GitHub Actions.
- Hardening de `auth-admin` para diagnosticar env ausente de forma explícita.

Depende de acesso externo (Netlify/Governança):
- Confirmar no painel qual branch está configurada como Production branch.
- Confirmar política organizacional sobre push direto em `main`.
- Gestão de segredos por ambiente (rotação/expiração/owner).
