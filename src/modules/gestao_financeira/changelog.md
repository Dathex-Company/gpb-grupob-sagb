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
