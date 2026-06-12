# API SagB — Rollback

## Desativar provider WhatsApp

Remover/desativar variáveis WhatsApp no ambiente Netlify e redeployar configuração.

## Revogar API key

Atualizar `api_keys` definindo `active = false` ou `revoked_at = now()`.

## Desativar endpoint

Remover temporariamente rota no router ou bloquear por escopo não concedido.

## Voltar router anterior

Usar rollback de deploy da Netlify para a versão anterior da Function.

## Pausar webhook na Meta

Desativar callback URL no app Meta ou trocar verify token.

## Consultar logs

- `api_audit_log`
- `integration_logs`
- `integration_events`
- `whatsapp_webhook_events`

## Restaurar estado seguro

Manter dados para auditoria, revogar chaves, remover tokens do ambiente e publicar router estável.

