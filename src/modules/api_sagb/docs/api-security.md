# API SagB — Segurança

## Autenticação

API Key via header `X-API-Key` ou `Authorization: Bearer ...`.

O valor plano nunca deve ser salvo. A tabela `api_keys` armazena apenas SHA-256 em `key_hash`.

## Produção

- Mock key é bloqueada em produção.
- Chaves inativas retornam 401.
- Chaves revogadas retornam 401.
- Chaves expiradas retornam 401.
- Escopo insuficiente retorna 403.

## Logs

Headers sensíveis são mascarados.

Payloads com `token`, `secret`, `key`, `password` ou `authorization` são redigidos antes de logs/eventos.

## CORS

Produção deve usar `API_SAGB_ALLOWED_ORIGINS` ou `CORS_ALLOWED_ORIGINS` com domínios explícitos.

