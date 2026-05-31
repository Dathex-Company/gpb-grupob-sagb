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

## 1.2.0 — 2026-05-31

- Implantado padrão de módulo full screen com sidebar própria em [`CentralPadroesLayout.tsx`](00_sagb/src/modules/central_padroes/layout/CentralPadroesLayout.tsx).
- Atualizado [`routes.tsx`](00_sagb/src/modules/central_padroes/routes.tsx) para renderizar layout com shell próprio do módulo.
- Atualizado [`App.tsx`](00_sagb/App.tsx) para ocultar sidebar global do SagB quando `activeTab === 'central_padroes'`.
- Adicionado botão "Voltar ao SagB" no rodapé da sidebar do módulo usando evento `sagb:navigate`.
- Padrão alinhado ao Alice UI Standard v1.0 (Module Full Screen) com referência técnica no taskzei.
# 1.1.0 — Central de Padrões V1 (ET 01 a ET 08)

- Implantado portal V1 com sidebar própria e áreas de governança.
- Adicionadas páginas para dashboard, padrões, documentos, responsáveis, módulos, checklists, auditorias, decisões, modo dev, modo agente, busca, relacionamentos, aprovações e configurações.
- Adicionado repository compatível com `governance_rules` e fallback local.
- Adicionada migration `central_padroes_v1` com schema expandido `central_padroes_*`.
- Preservados `governanceRulesService.ts`, `governance_rules` e `governance-sync-doc.mjs`.

# 1.2.0 — Central de Padrões Completa (ET-02 a ET-08)

- ET-02: CRUD real, migration V2, sync, validation, storage service e UI de criação/edição/exclusão.
- ET-03: Approval workflow com service, trigger, ApprovalsPage, badge e métrica no dashboard.
- ET-04: Relacionamentos com service, grafo visual e análise de impacto.
- ET-05: Triagem/ingestão com spec, script e aba no Modo Dev.
- ET-06: Busca híbrida com migration pgvector, search service e SearchPage com abas/score.
- ET-07: RLS refinado, QA, code review e observabilidade.
- ET-08: Runbook, release notes, checklist final, deploy e versionamento.
