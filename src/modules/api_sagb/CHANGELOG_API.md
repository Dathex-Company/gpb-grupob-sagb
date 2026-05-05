# Changelog da API SagB

Todas as mudanças notáveis na API SagB serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-05-05

### Adicionado

#### System
- `GET /v1/health` — Healthcheck da API

#### TaskZei (Notificações)
- `GET /v1/taskzei/notifications` — Listar notificações por destinatário
- `POST /v1/taskzei/notifications` — Enviar notificação para um ou mais destinatários

#### CRM (Leads)
- `GET /v1/crm/leads` — Listar leads com filtros opcionais
- `POST /v1/crm/leads` — Criar novo lead
- `PUT /v1/crm/leads/{id}` — Atualizar lead existente
- `GET /v1/crm/leads/{id}` — Obter detalhes de um lead

#### Studio (Projetos)
- `GET /v1/studio/projects` — Listar projetos
- `GET /v1/studio/projects/{id}` — Obter detalhes de um projeto

#### Vox (Transcrição)
- `POST /v1/vox/transcriptions` — Enviar áudio para transcrição
- `GET /v1/vox/transcriptions/{id}` — Obter resultado da transcrição
- `GET /v1/vox/transcriptions` — Listar transcrições recentes

#### Segurança
- Autenticação via API Key (header `X-API-Key`)
- Autorização por escopos: `system:read`, `system:write`, `agents:read`, `agents:execute`, `cid:read`, `cid:write`

#### Observabilidade
- `X-Request-Id` para correlação em todas as respostas
- Logs de auditoria em `api_audit_log`
- `X-Response-Time` em todas as respostas

#### Versionamento
- Header `Accept-Version` para controle de versão pelo cliente
- Headers de resposta: `X-API-Version`, `X-API-Version-Prefix`, `Warning`, `Sunset`
- Política de depreciação com 90 dias de aviso prévio

### Notas Técnicas

- Schema OpenAPI: `contracts/openapi_v1.yaml`
- Postman Collection: Disponível no painel do desenvolvedor
- Limite de rate: 1000 requisições/minuto por API Key (fase inicial)
- Timeout padrão dos endpoints: 30 segundos
