# Registro de Operações MCP — LOZE-MCP-OPS V1

> Modelo obrigatório de registro operacional para todas as ações executadas pelo MCP no ecossistema SagB.
> **Regra absoluta:** Nenhum valor de segredo, chave, token ou credencial real será registrado em logs.

---

## 1. Definição

O **Registro de Operações MCP** é o documento de log obrigatório que accompany toda ação executada pelo MCP no ambiente SagB. Cada operação gera **um registro imutável** contendo metadados de quem solicitou, o que foi feito, em qual ambiente, qual foi o resultado e qual o `correlation_id` para rastreamento.

---

## 2. Regra Fundamental

> **🚫 VALOR DE SEGREDO NUNCA ENTRA NO LOG.**
> Logs registram **que** uma operação ocorreu, **quem** solicitou, **qual** foi o resultado.
> Logs **nunca** registram o valor de variáveis, chaves, tokens ou credenciais.
> Se uma operação lida com segredo, o log registra apenas o status (sucesso/erro) e metadados.

---

## 3. Modelo de Linha de Log

Cada registro de operação DEVE conter os seguintes campos:

| Campo | Obrigatório | Tipo | Descrição |
|-------|------------|------|-----------|
| `timestamp` | ✅ | ISO 8601 | Data e hora da operação |
| `agent_id` | ✅ | string | Identificador do agente solicitante |
| `user_id` | ⬜ | string | Identificador do usuário humano (quando houver) |
| `project` | ✅ | string | Projeto alvo (ex: `sagb`) |
| `environment` | ✅ | enum | `local`, `preview`, `production` |
| `action` | ✅ | string | Ação solicitada (ex: `consultar-status-projeto`) |
| `tool` | ✅ | string | Ferramenta MCP usada (ex: `mcp-ops-status-projeto`) |
| `result` | ✅ | enum | `success`, `error`, `blocked`, `pending_authorization` |
| `error_message` | ⬜ | string | Mensagem de erro (sem segredo), se houver |
| `risk_level` | ✅ | enum | `low`, `medium`, `high`, `critical` |
| `required_authorization` | ✅ | boolean | Se a ação exigiu autorização explícita |
| `authorized_by` | ⬜ | string | Quem autorizou (quando aplicável) |
| `correlation_id` | ✅ | UUID v4 | ID único para rastreamento fim a fim |
| `deploy_url` | ⬜ | string | Link do deploy, workflow ou operação, se houver |

---

## 4. Formato do Log

### JSON (formato canônico para armazenamento)

```json
{
  "timestamp": "2026-06-07T14:30:00.000Z",
  "agent_id": "savio_codare",
  "user_id": "cassio_mendes",
  "project": "sagb",
  "environment": "preview",
  "action": "consultar-status-projeto",
  "tool": "mcp-ops-status-projeto",
  "result": "success",
  "error_message": null,
  "risk_level": "low",
  "required_authorization": false,
  "authorized_by": null,
  "correlation_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "deploy_url": null
}
```

### Linha de log textual (formato legível)

```
[2026-06-07T14:30:00.000Z] agent=savio_codare user=cassio_mendes
project=sagb env=preview action=consultar-status-projeto
tool=mcp-ops-status-projeto result=success risk=low
auth=false correlation_id=a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

---

## 5. Exemplos de Logs Seguros

### Exemplo 1 — Consulta de status (baixo risco)

```json
{
  "timestamp": "2026-06-07T10:00:00.000Z",
  "agent_id": "agente_alan_flow",
  "user_id": null,
  "project": "sagb",
  "environment": "production",
  "action": "verificar-github-status",
  "tool": "mcp-ops-verificar-github-status",
  "result": "success",
  "error_message": null,
  "risk_level": "low",
  "required_authorization": false,
  "authorized_by": null,
  "correlation_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "deploy_url": null
}
```

### Exemplo 2 — Build de preview acionado (risco médio)

```json
{
  "timestamp": "2026-06-07T11:15:00.000Z",
  "agent_id": "savio_codare",
  "user_id": "cassio_mendes",
  "project": "sagb",
  "environment": "preview",
  "action": "acionar-build-preview",
  "tool": "mcp-ops-build-preview",
  "result": "success",
  "error_message": null,
  "risk_level": "medium",
  "required_authorization": true,
  "authorized_by": "cassio_mendes",
  "correlation_id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "deploy_url": "https://deploy-preview-123--sagb.netlify.app"
}
```

### Exemplo 3 — Ação bloqueada (alto risco)

```json
{
  "timestamp": "2026-06-07T14:30:00.000Z",
  "agent_id": "agente_denise_bogado",
  "user_id": null,
  "project": "sagb",
  "environment": "production",
  "action": "deploy-producao",
  "tool": null,
  "result": "blocked",
  "error_message": "Ação 'deploy-producao' bloqueada por padrão na V1. Exige autorização explícita de owner.",
  "risk_level": "critical",
  "required_authorization": true,
  "authorized_by": null,
  "correlation_id": "d4e5f6a7-b8c9-0123-defa-234567890123",
  "deploy_url": null
}
```

---

## 6. Exemplos do que NUNCA Registrar

### 🚫 ERRADO — Log com segredo exposto:

```json
{
  "timestamp": "2026-06-07T14:30:00.000Z",
  "action": "validar-variaveis-obrigatorias",
  "result": "success",
  "variables": {
    "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1NiIs...",  // 🚫 NUNCA!
    "NETLIFY_AUTH_TOKEN": "nfp_abc123def456..."                // 🚫 NUNCA!
  }
}
```

### ✅ CORRETO — Log sem segredo:

```json
{
  "timestamp": "2026-06-07T14:30:00.000Z",
  "action": "validar-variaveis-obrigatorias",
  "result": "success",
  "variables_checked": [
    "SUPABASE_SERVICE_ROLE_KEY",
    "NETLIFY_AUTH_TOKEN"
  ],
  "all_present": true
}
```

---

## 7. Classificação de Risco para Logs

| Risco | Cor | Exige autorização? | Exige correlation_id? | Retenção |
|-------|-----|-------------------|----------------------|----------|
| 🟢 Low | Verde | Não | Sim | 30 dias |
| 🟡 Medium | Amarelo | Opcional | Sim | 90 dias |
| 🔴 High | Vermelho | Sim | Sim | 180 dias |
| ⚫ Critical | Preto/Vermelho | Sim + dupla validação | Sim | 365 dias |

---

## 8. Onde os Logs São Armazenados

| Ambiente | Armazenamento | Observação |
|----------|--------------|-----------|
| **Local** | Console + arquivo local (`logs/mcp-operations.log`) | Apenas para debug |
| **Preview** | Netlify Functions + logs de build | Visível no dashboard |
| **Produção** | Supabase (tabela `mcp_operation_logs`) + Netlify | Persistência obrigatória |

---

## 9. Estrutura da Tabela de Logs (futuro)

```sql
-- Tabela proposta para armazenamento em Supabase
CREATE TABLE mcp_operation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  correlation_id UUID NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  agent_id TEXT NOT NULL,
  user_id TEXT,
  project TEXT NOT NULL,
  environment TEXT NOT NULL CHECK (environment IN ('local', 'preview', 'production')),
  action TEXT NOT NULL,
  tool TEXT,
  result TEXT NOT NULL CHECK (result IN ('success', 'error', 'blocked', 'pending_authorization')),
  error_message TEXT,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  required_authorization BOOLEAN NOT NULL DEFAULT false,
  authorized_by TEXT,
  deploy_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mcp_logs_correlation_id ON mcp_operation_logs(correlation_id);
CREATE INDEX idx_mcp_logs_timestamp ON mcp_operation_logs(timestamp DESC);
CREATE INDEX idx_mcp_logs_agent ON mcp_operation_logs(agent_id);
```

---

## 10. Histórico de Revisões

| Data | Versão | Alteração | Responsável |
|------|--------|-----------|-------------|
| 2026-06-07 | 1.0 | Criação do documento — Modelo de registro operacional LOZE-MCP-OPS V1 | Cássio Mendes |

---

*Este documento é parte do padrão **LOZE-MCP-OPS | Operações, Ambientes e Segredos**.
Arquivo: `docs/registro-operacoes-mcp.md`*
