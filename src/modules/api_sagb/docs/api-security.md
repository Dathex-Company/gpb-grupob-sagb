# API SagB — Segurança

## Autenticação

API Key via header `X-API-Key` ou `Authorization: Bearer ...`.

O valor plano nunca deve ser salvo. A tabela `api_keys` armazena apenas SHA-256 em `key_hash`.

No PR #4, a migration cria `key_hash_sha256` como coluna auxiliar opcional, mas não converte valores existentes automaticamente. Qualquer rotação/conversão deve ser feita manualmente após auditoria da tabela real, backup e geração segura de nova chave fora do código.

## Produção

- Mock key é bloqueada em produção.
- Mock key só é aceita em `development`, `test` ou `sandbox`.
- Chaves inativas retornam 401.
- Chaves revogadas retornam 401.
- Chaves expiradas retornam 401.
- Escopo insuficiente retorna 403.
- Erros de chave são genéricos para reduzir enumeração de credenciais.

## Logs

Headers sensíveis são mascarados.

Payloads com `token`, `secret`, `key`, `password` ou `authorization` são redigidos antes de logs/eventos.

## Webhook WhatsApp

O POST do webhook Meta valida `X-Hub-Signature-256` com HMAC SHA-256 e `META_APP_SECRET` antes do processamento em produção. Sem `META_APP_SECRET` ou com assinatura inválida, a API retorna erro seguro e audita a tentativa sem salvar assinatura completa.

## CORS

Produção deve usar `API_SAGB_ALLOWED_ORIGINS` ou `CORS_ALLOWED_ORIGINS` com domínios explícitos.

Domínio oficial de produção: `https://sagb.grupob.com.br`.
