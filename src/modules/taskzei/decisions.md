# decisions — modulo taskzei

## 2026_04_17

### decisao_001
- modulo `taskzei` passa a operar tambem como `agenda_inteligente`.

### decisao_002
- responsavel oficial do modulo: `dani_freitas`.
- agente diretor oficial: `dani_freitas_diretora`.

### decisao_003
- padrao de nomenclatura do modulo e agentes: lowercase com `_`.

### decisao_004
- fluxo de ativacao autonoma sera iniciado por `agent/prompt_ativacao_cline.md`.

### decisao_005
- persistencia oficial do taskzei sera feita via supabase com provider dedicado selecionado por env (`VITE_TASKZEI_PROVIDER`).

### decisao_006
- enquanto o taskzei estiver no banco compartilhado do SagB, toda a estrutura de dados deve permanecer identificada por prefixo `taskzei_` e com plano formal de migracao futura documentado.

## 2026_05_02

### decisao_007
- owner oficial do modulo declarado em `manifest.ts` no campo `owner`, conforme padrao canonico `padrao_modulos_plugaveis.md` secao 1.1.1.
- `agent/owner.md` nao deve ser criado e foi removido de toda referencia de governanca.

### decisao_008
- displayName do modulo alterado de `taskzei` para `Agenda Inteligente` para alinhar branding com a interface do SagB.
- O nome `TaskZei` permanece como `internalName` (engine/produto destacavel).

### decisao_009
- `module-doc.ts` atualizado: requiredDocs agora lista 7 documentos canonicos (sem `agent/owner.md`, com `plano_modulo.md`).

### decisao_010
- persona do agente atualizada de "Guardiao do Modulo" para "Dani Freitas — Produto TaskZei" com autoridade de decisao de produto.

### decisao_011
- provider mock definido como fallback permanente de desenvolvimento, nao como divida tecnica temporaria.
- Em producao, o padrao sera `VITE_TASKZEI_PROVIDER=supabase`.
- Componente `<MockModeBanner />` deve ser criado para alertar quando em modo mock.

### decisao_012
- `plano_modulo.md` criado como documento oficial de planejamento executivo do modulo, com 10 fases, 28 ETs, KPIs e riscos.

### decisao_013
- Integracoes externas (ClickUp, WhatsApp, e-mail) devem obrigatoriamente passar pelo `hub-integracao`, nunca por conexao direta.

## 2026_05_04

### decisao_014
- `module-doc.ts` reescrito para implementar a interface `ModuleDoc` com tipagem TypeScript, alinhado ao contrato `src/core/modules/module.types.ts`.
- `README.md` criado como documento oficial de identidade do modulo.
- Relatorio de conformidade (ET-04) gerado e documentado no `changelog.md` v1.6.1.
- Nao conformidade visual (hex inline, tipografia fora da tabela canonica, header canonico ausente) documentada como pendencia para fase futura de refatoracao de design tokens.

### decisao_015
- Provider Supabase promovido a default de producao (`VITE_TASKZEI_PROVIDER=supabase`).
- Mock mantido como fallback explicito de desenvolvimento, ativado via `VITE_TASKZEI_PROVIDER=mock`.
- `MockModeBanner` criado para alertar visualmente quando em modo mock.
- Enquanto nao houver projeto Supabase dedicado, usa-se o banco compartilhado do SagB (shared pool).

### decisao_016
- FASE 4 (CRUD Completo de Tarefas) implementada em lote unico: ET-09 (drawer editavel), ET-10 (checklist), ET-11 (comentarios), ET-12 (acoes rapidas).
- `task_drawer.tsx` reescrito integralmente com edicao em todos os 6 campos, auto-save por blur, checklist funcional e comentarios.
- `task_list_item.tsx` ganhou menu de contexto com "Duplicar" e "Arquivar" via callbacks `onDuplicate`/`onArchive`.
- `AgendaInteligentePage.tsx` migrou list-view manual para componente `TaskList`, garantindo que edicao inline e menu de contexto funcionem.
- Todos os 6 novos metodos adicionados em ambas as interfaces (ITaskzeiRepository, ITaskzeiService) e implementados nos dois providers (mock e supabase) e no facade.
- Prioridade `'urgente'` adicionada ao tipo `TaskPriority`.
- Build validado: 701 modulos, 24.09s.

### decisao_017
- Fases 5, 6, 7 e 10 (origem, meetings, inbox, auditoria) implementadas em Batch unico (1+2) para acelerar entrega, conforme plano_execucao_unificada.md.
- `origin.types.ts`, `meeting.types.ts`, `inbox.types.ts` criados como tipos independentes e reaproveitaveis.
- MeetingStore e InboxStore criadas como Zustand stores separadas para evitar poluicao da TaskStore original.
- `autoAudit` implementado no facade como metodo privado silencioso (try/catch, nunca bloqueia operacao principal).
- Auditoria e logs usam o banco compartilhado do SagB ate que o projeto Supabase dedicado seja criado.
- Integracoes externas (ClickUp, WhatsApp, e-mail) continuam obrigadas a passar pelo hub-integracao (conforme decisao_013).

### decisao_018
- Todos os 5 Batches do plano_execucao_unificada.md implementados em lote unico apos aprovacao "pode fazer".
- Batch 3 (servicos de logica): nlParser.service.ts (regex NLP), taskzei.audit.ts, taskzei.metrics.ts, taskzei.monitor.ts — servicos modulares com singletons.
- Batch 4 (UI): InboxPage reescrita com fluxo completo (add, classificar, converter, descartar); MeetingsPage criada com criacao inline e modal de detalhe com pauta/decisoes; MonitorPage criada com metricas em tempo real e saude do modulo; navegacao lateral expandida com icones de reunioes e monitor.
- Batch 5 (Integracoes): conversationalHandler (parse + acao + sugestoes), hubIntegration (placeholder para hub-integracao real).
- Nenhuma integracao externa direta foi implementada — todas passarao pelo hub-integracao quando disponivel (conforme decisao_013).
- FASE 2 (Infraestrutura propria Supabase) permanece pendente ate decisao financeira do orcamento TaskZei/GrupoB.
