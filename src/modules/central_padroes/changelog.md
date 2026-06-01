# CHANGELOG — Central de Padrões

Todas as mudanças relevantes no módulo Central de Padrões serão registradas aqui.

## 1.6.0 — 2026-06-01

- ET-21: Auditoria de Cobertura da Curadoria Geral das Divisões.
- Status geral: Curadoria Geral concluída operacionalmente.
- Canonicidade final mantida como pendente de validação Pietro.
- Relatório criado em docs/07_validacoes/central-padroes-et-21-auditoria-cobertura-curadoria-geral.md.
- Auditoria confirma que os 6 itens por divisão são suficientes como carga inicial operacional, mas não como extração normativa completa.

## 1.5.0 — 2026-06-01

- Curadoria Geral das Divisões iniciada e carregada operacionalmente (ET-10 a ET-20).
- Documentos-mãe cadastrados para Pietro, Alice, Pedro, Pierre, Klaus, Yuri, Noah, Dante, Nilo, Júlio e César; Sávio reconciliado com ET-09.
- Itens atômicos adicionados por área: CP-GOV, CP-UX, CP-SEG, CP-AGT, CP-IA, CP-PROC, CP-NAM, CP-IDEIA, CP-MET, CP-ACADB e CP-STARTYB.
- Checklists, matrizes, registros/evidências e decisões propostas adicionados por divisão.
- Relatórios ET-10 a ET-20 criados em docs/07_validacoes/.
- Nada foi marcado como canônico final; canonicidade pendente de validação Pietro.

## 1.4.0 — 2026-06-01

- ET-09B: Complementação Técnica Sávio.
- 5 matrizes técnicas cadastradas: App x Módulo x Adaptação (CP-TEC-016), Reaproveitamento Técnico (CP-TEC-017), Gravidade de Erros (CP-TEC-018), Status de Módulos (CP-TEC-019), Validação Cruzada (CP-TEC-020).
- 6 registros/evidências técnicas cadastrados: Erro Técnico (CP-TEC-021), Incidente Técnico (CP-TEC-022), Log de Deploy (CP-TEC-023), Rollback (CP-TEC-024), Refatoração (CP-TEC-025), Evidência de Validação (CP-TEC-026).
- Decisões propostas (dec-003 a dec-008) vinculadas ao documento-mãe doc-006 com responsáveis sugeridos e dependências.
- Nomenclatura normativa corrigida: CP-TEC-001 como política (tipo) com versão v2 (campo separado); CP-TEC-026 como registro/evidência.
- Módulos central_padroes, sala-dev e audit_logs_core atualizados com novos padrões vinculados.
- Relatório ET-09B criado em docs/07_validacoes/.
- ET-09 concluída operacionalmente. Canonicidade pendente de validação Pietro.

## 1.3.0 — 2026-06-01

- ET-09: Curadoria Técnica Sávio incorporada ao módulo.
- Documento-mãe "Checklist Total — Sistemas, Programação e Arquitetura Técnica / Loze — v1.1" cadastrado como candidato a canônico.
- Padrões atômicos CP-TEC-001 a CP-TEC-015 extraídos e cadastrados na área savio.
- CP-TEC-001 atualizado: "Loze como camada oficial de tecnologia aplicada" (política, v2).
- CP-MOD-001 criado com conteúdo do antigo "Padrão de Módulos Plugáveis SagB".
- Checklists técnicos expandidos: criar sistema, repositório, API, deploy, biblioteca, refatorar legado e preparar produto técnico.
- Decisões propostas registradas: stack técnica, padrão de produtos, separação interno x cliente, módulos Loze, documentação e observabilidade.
- Fallback data atualizado com todos os registros.
- Dependências com Alice, Pedro, Pierre, Klaus, Yuri, Pietro e Kane/Rodrigues vinculadas nos padrões.
- Arquivo de origem movido para `/plans/` (plano operacional, não documento de divisão).

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
