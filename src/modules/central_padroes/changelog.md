# CHANGELOG — Central de Padrões

Todas as mudanças relevantes no módulo Central de Padrões serão registradas aqui.

## 1.0.0 — 2026-04-13

- Criação inicial da estrutura modular plugável.
- Criação do agente guardião Zico Padron.
- Migração dos padrões da pasta legada para o novo formato de módulo.
- Alinhamento ao padrão consolidado de módulos: `owner` no manifesto, `module-doc` no formato vigente.
- Migração de naming técnico para underscore: módulo movido de `central-padroes` para `central_padroes`.

## 1.1.0 — 2026-05-05

- Fase 1 do plano SagB-first implementada com Supabase como fonte primária de regras de governança.
- Nova migration com tabela `public.governance_rules` (versionamento, checksum, sync_status e last_sync_error).
- Criação do serviço `governanceRulesService.ts` para listar, editar rascunho e publicar regras.
- Evolução da `CentralPadroesPage.tsx` para editor Markdown + preview + publicação.
- Criação da função serverless `governance-sync-doc.mjs` para materializar cópia fiel em `docs/governanca_sagb/*.md`.
- Fluxo de falha de sync preserva regra válida no Supabase com `sync_status='failed'` e erro persistido.
