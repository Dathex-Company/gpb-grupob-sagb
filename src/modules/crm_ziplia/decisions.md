# Decisions - CRM Ziplia

## 2026-04-20 — Migração total para módulo nativo SagB

- **Contexto:** integração por iframe dependia de servidor externo instável no ambiente local.
- **Decisão:** migrar frontend e serviços para dentro de [`src/modules/crm_ziplia`](src/modules/crm_ziplia), consumindo Supabase direto via [`restFetch()`](services/supabase.ts:137).
- **Impacto esperado:** eliminar dependência operacional de runtime externo para uso padrão do CRM.

## 2026-04-20 — Substituição da rota principal para página nativa

- **Contexto:** experiência atual tinha fallback de URL e estados de indisponibilidade do iframe.
- **Decisão:** rota principal passa a renderizar [`CrmZipliaNativePage`](src/modules/crm_ziplia/pages/CrmZipliaNativePage.tsx:17).
- **Impacto esperado:** UX integrada ao shell SagB e menor fricção de acesso.

## 2026-04-20 — Desativação controlada do legado iframe/gateway

- **Contexto:** páginas legadas [`CrmZipliaFullscreenPage.tsx`](src/modules/crm_ziplia/pages/CrmZipliaFullscreenPage.tsx) e [`CrmZipliaGatewayPage.tsx`](src/modules/crm_ziplia/pages/CrmZipliaGatewayPage.tsx) ainda existem para contingência.
- **Decisão:** manter código legado por uma janela curta de segurança, porém fora da rota principal.
- **Plano de limpeza:**
  1. Monitorar uso e estabilidade da rota nativa por 1 ciclo operacional.
  2. Remover páginas legadas e referências residuais.
  3. Consolidar documentação final com arquitetura nativa como única via.

