# Decisões Arquiteturais | Gestão Financeira

## ADR 001: UX Imersivo (Full Screen)
**Data:** 2026-04-18
**Contexto:** O usuário solicitou que, ao acessar a Gestão Financeira, a interface ganhe foco total, escondendo a Sidebar e a TopBar globais.
**Decisão:** Utilizar a variável `isImmersiveMode` em `App.tsx` para controlar a visibilidade da moldura global.
**Consequência:** Melhora significativa no FOCO para análise de números, mas requer um botão de "Voltar" (Floating Button) interno e intuitivo para restaurar a navegação.

## ADR 002: Base de Dados Supabase (Esquema Finance)
**Data:** 2026-04-18
**Contexto:** Necessidade de persistência robusta e segura para transações financeiras.
**Decisão:** Utilizar o Supabase como fonte da verdade, estruturando os dados em um esquema (ou prefixo de tabela) específico para evitar colisão com outros módulos.
**Consequência:** Facilita a criação de Webhooks via Edge Functions e garante maior segurança nos dados bancários.
