# decisions - api_sagb

- **[01/05/2026]**: API do SagB definida como camada oficial para sistemas e produtos.
- **[01/05/2026]**: Hub de Integração mantido como camada interna de conectores e credenciais.
- **[01/05/2026]**: MCP do SagB mantido como camada de ferramentas para agentes, sem confusão com API pública.
- **[05/05/2026]**: Mega Batch autorizado pelo usuário para execução das etapas 4 a 9 em lote único, sem consultas intermediárias.
- **[05/05/2026]**: Roteador Netlify (`api-sagb-router.mjs`) implementado como função auto-contida (fetch + inline handlers) para deploy direto, com versão TypeScript (`router.ts`) para testes locais.
- **[05/05/2026]**: Feature Flags adotadas como mecanismo de rollout progressivo via variáveis de ambiente (`SAGB_FEATURE_*`).
- **[05/05/2026]**: Circuit Breaker implementado por adapter individual, não compartilhado, para isolamento de falhas por integração.
- **[05/05/2026]**: D-005 — Tabela `api_keys` armazena apenas `key_hash` (SHA-256 da chave), nunca o valor plano. Chaves são geradas fora do banco e fornecidas uma única vez ao cliente.
- **[05/05/2026]**: D-006 — Rate Limiting adotado via Token Bucket in-memory (sem Redis) para simplificar deploy inicial. Upgrade para Redis ocorrerá quando houver múltiplas instâncias do router.
- **[05/05/2026]**: D-007 — Mock de `fetch` nos testes de timeout respeita `AbortSignal` via `addEventListener('abort', ...)` em vez de `setTimeout`, eliminando unhandled rejections do Node.js.
