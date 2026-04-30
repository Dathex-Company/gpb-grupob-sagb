# Changelog | Módulo Gestão Financeira

## [1.0.0] - 2026-04-18
### Adicionado
- Fundação completa do módulo em `src/modules/gestao_financeira`.
- Governança da agente **Yasmin Rangel** (Persona, Owner, Activation).
- Infraestrutura para Webhooks e Integração Bancária (serviços placeholder).
- Configuração de UX Imersivo (Full Screen) integrada ao core do SagB.
- Expansão do Plano de Contas baseada em análise de mercado e referências do usuário.

## [2.0.0] - 2026-04-18
### Adicionado
- Migração SQL do core financeiro em `supabase/migrations/20260418000101_finance_core.sql` com esquema `finance` e tabelas: `plano_de_contas`, `transacoes`, `configuracoes_api` e `conciliacoes`.
- Tipagem de domínio para transações, integrações, plano de contas e conciliação em `types/finance.types.ts`.
- Novo serviço `financeService.ts` para cadastro manual, listagem em tempo real, sincronização bancária e rastreabilidade de conciliação.
- Tela operacional v2 de Gestão Financeira com formulário de cadastro de despesas/pagamentos, painel de totais e listagem de transações conectadas ao Supabase.

### Alterado
- `bankIntegrationService.ts` evoluído para conexão real de provider, registro de webhook e sincronização baseada em configuração persistida.
- `webhookHandler.ts` evoluído para conciliação automática por referência externa e escrita de trilha de auditoria na tabela `finance.conciliacoes`.
- `services/supabase.ts` atualizado para suportar acesso a tabelas com schema (`finance.<tabela>`) via headers `Accept-Profile`/`Content-Profile`.

## [3.0.0] - 2026-04-19
### Adicionado
- Sistema completo de webhook com validação HMAC-SHA256 em `webhookValidator.ts`.
- Endpoint HTTP `/api/finance/webhook` para recebimento de notificações em `webhookEndpoint.ts`.
- Suporte a idempotência via `event_id` para prevenir processamento duplicado.
- Mock server para desenvolvimento em `tools/webhook-mock-server.js` com geração de assinaturas.
- Proxy configurado no `vite.config.ts` para roteamento de endpoints de desenvolvimento.
- Documentação completa em `docs/webhook-usage-guide.md` e `docs/webhook-implementation-plan.md`.

### Alterado
- `financeService.ts` ampliado com métodos `findConciliacaoByEventId`, `getWebhookSecret`, `logWebhookAttempt`.
- `webhookHandler.ts` corrigido para conformidade com tipos TypeScript e melhor tratamento de erros.
- Interface `ConciliacaoFinanceira` atualizada para status restritos: `processado`, `ignorado`, `erro`.

### Testado
- Fluxo completo de webhook testado com curl através do mock server.
- Validação de assinatura HMAC funcionando com proteção contra replay attacks.
- Processamento de eventos `payment.confirmed` e `transfer.failed` com conciliação automática.

## [3.1.0] - 2026-04-19
### Adicionado
- Tipagens de relatório financeiro em [`FinanceDashboardReport`](src/modules/gestao_financeira/types/finance.types.ts:123), [`FinanceKpis`](src/modules/gestao_financeira/types/finance.types.ts:93), [`FinanceDreLine`](src/modules/gestao_financeira/types/finance.types.ts:101), [`FinanceSeriePoint`](src/modules/gestao_financeira/types/finance.types.ts:107) e [`FinanceCategoriaResumo`](src/modules/gestao_financeira/types/finance.types.ts:114).
- Filtro de período (data inicial/final) na tela [`GestaoFinanceiraPage`](src/modules/gestao_financeira/pages/GestaoFinanceiraPage.tsx:36) para análise gerencial.
- Blocos de relatório na UI com DRE simplificado, série mensal e ranking de categorias de despesa.

### Alterado
- [`FinanceService.getDashboardReport()`](src/modules/gestao_financeira/services/financeService.ts:119) para agregações por período (KPIs, DRE, série mensal e top categorias).
- [`FinanceService.listTransacoesByRange()`](src/modules/gestao_financeira/services/financeService.ts:108) para consulta de transações por data de competência.
- [`GestaoFinanceiraPage`](src/modules/gestao_financeira/pages/GestaoFinanceiraPage.tsx:78) passou a consumir métricas agregadas do serviço para os cards de resumo.

### Observações
- Build de produção falhou por erro de proxy inline de HTML no Vite ([`index.html?html-proxy`](index.html)), sem indicação de erro de tipagem nas alterações deste módulo.
