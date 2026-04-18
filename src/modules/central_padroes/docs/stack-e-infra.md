# Stack e Infra Padrao - GrupoB

## Aplicacao base

Com base em `package.json`, `netlify.toml`, `.github/workflows/*` e docs tecnicas:

- Frontend: React + TypeScript + Vite.
- UI: Tailwind via CDN (com plugin typography).
- IA: Gemini, DeepSeek, Llama local, OpenAI, Claude e Qwen (via proxy backend).
- Banco/Auth: Supabase.
- Backend serverless: Netlify Functions (`netlify/functions/ai.mjs`).

## Deploy

- Provedor principal: Netlify.
- Config principal: `netlify.toml`.
- Redirect de API: `/api/ai -> /.netlify/functions/ai`.

### Fluxo oficial de publicacao (producao)

1. Desenvolvimento local (branch oficial: `main`).
2. `git add` + `git commit`.
3. `git push origin main`.
4. Netlify (site conectado ao GitHub) detecta push e dispara build automatico.
5. Publicacao em producao na URL oficial.

> Ordem obrigatoria: **local -> commit -> push GitHub -> build/deploy Netlify**.

## CI/CD

- GitHub Actions com build em Node 20:
  - `.github/workflows/deploy.yml`
  - `.github/workflows/netlify-deploy.yml`

## Variaveis de ambiente essenciais

### Frontend (Vite / browser)

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Backend (Netlify Functions)

- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `DEEPSEEK_API_KEY`

### Supabase (producao) - nomes aceitos pelo runtime

- URL: `VITE_SUPABASE_URL` (preferencial) ou `SUPABASE_URL`
- Anon key (validacao de token): `VITE_SUPABASE_ANON_KEY` (preferencial) ou `SUPABASE_ANON_KEY`
- Service role (admin server-side): `SUPABASE_SERVICE_ROLE_KEY` (preferencial) ou `SUPABASE_SERVICE_KEY`

> Padrao recomendado no Netlify: manter os nomes preferenciais para reduzir ambiguidade.

### Observacoes

- `SUPABASE_SERVICE_ROLE_KEY` nunca deve ir para o frontend.
- Se faltar qualquer variavel critica no Netlify, o build pode passar, mas funcoes server-side podem falhar em runtime.

## Guardrails para nao quebrar publicacao

1. Nao alterar `build.command` (`npm run build`) e `publish` (`dist`) sem justificativa tecnica.
2. Nao remover redirects SPA/API do `netlify.toml`.
3. Manter branch oficial de producao consistente (`main`) entre GitHub Actions e Netlify.
4. Sempre validar build local (`npm run build`) antes do push.

## Diretriz para novos sistemas

1. Reaproveitar esse stack por padrao.
2. Se houver desvio (ex.: outro backend/deploy), documentar motivacao e impacto.
3. Manter compatibilidade de integracao com SagB via APIs/contratos definidos.
