# LOZE-MCP-OPS | Operações, Ambientes e Segredos — V1

> **Nome oficial do padrão:** LOZE-MCP-OPS | Operações, Ambientes e Segredos
> **Versão:** 1.0.0
> **Status:** 🟢 Proposta Inicial
> **Módulo:** `mcp_sagb`
> **Arquitetura base:** MCP SagB (`Z:\00_sagb\src\modules\mcp_sagb\`)

---

## 1. Definição Oficial do Padrão

O **LOZE-MCP-OPS** é o padrão operacional que define como o Model Context Protocol (MCP) do ecossistema SagB deve operar sobre **ambientes, deploys, variáveis, segredos e logs** de forma segura, rastreável e autorizada.

Não é um novo módulo — é uma **camada de governança operacional** que se sobrepõe ao MCP existente, definindo:

- O que agentes podem e não podem fazer
- Como ações são autorizadas
- Como segredos são protegidos
- Como operações são registradas
- Como ambientes são segregados

---

## 2. Objetivo Central

Estruturar o MCP para que agentes possam:

- ✅ Consultar status de projetos e ambientes
- ✅ Validar configurações de variáveis obrigatórias
- ✅ Acionar builds/preview permitidos
- ✅ Registrar operações
- ❌ **Nunca** acessar chaves reais, tokens ou credenciais

> **Regra Central:** O MCP **não é um cofre aberto para agentes**. O MCP é uma **camada segura de operação**.

---

## 3. Fluxo Obrigatório de Operação

```
┌──────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────┐     ┌───────────┐
│  Agente   │ ──▶ │   Camada de   │ ──▶ │  Camada de   │ ──▶ │  Camada  │ ──▶ │  Resposta │
│ Solicita  │     │  Validação/   │     │  Execução    │     │ de Log/  │     │ Controlada│
│   Ação    │     │  Autorização  │     │   Segura     │     │ Auditoria │     │           │
└──────────┘     └──────────────┘     └─────────────┘     └──────────┘     └───────────┘
```

1. **Agente solicita ação** — via ferramenta MCP (ex: `consultar-status-projeto`)
2. **MCP valida permissão** — verifica matriz de permissões, ambiente e autorização
3. **MCP executa com credencial protegida** — usa token de curta duração, nunca expõe a chave
4. **Agente recebe apenas o resultado** — status, sucesso/erro, evidência controlada
5. **Toda ação gera log** — com `correlation_id`, sem valores de segredo
6. **Produção tem trava maior** — ações críticas exigem autorização explícita

---

## 4. Papel do MCP no LOZE-MCP-OPS

### O que o MCP FAZ:
- ✅ Consulta status de projetos, deploys e ambientes
- ✅ Lista variáveis de ambiente **sem valores reais**
- ✅ Valida se variáveis obrigatórias estão configuradas
- ✅ Aciona build/preview (não produção) quando autorizado
- ✅ Verifica status de serviços externos (GitHub, Supabase, Netlify)
- ✅ Registra eventos operacionais
- ✅ Retorna evidências controladas (links de deploy, logs de operação)

### O que o MCP NÃO FAZ:
- ❌ **Não expõe valores de segredos** em resposta alguma
- ❌ Não altera variáveis de produção sem autorização explícita
- ❌ Não exclui variáveis de ambiente
- ❌ Não rotaciona chaves automaticamente
- ❌ Não faz deploy de produção
- ❌ Não altera RLS, policies ou migrations
- ❌ Não reseta banco de dados
- ❌ Não apaga buckets de storage
- ❌ Não faz push para branch principal (`main`)
- ❌ Não faz force push

---

## 5. Ambientes Cobertos

| Ambiente | Tipo | Acesso MCP | Autorização | Observação |
|----------|------|-----------|-------------|-----------|
| **Local** | Desenvolvimento | ✅ Leitura e operações seguras | Não exigida | Apenas o dev local |
| **Preview** | Homologação/Testes | ✅ Leitura e build/acição | Autorização simples | Deploy automático de PR |
| **Produção** | Real | ✅ Leitura de status | ⛔ Autorização explícita + dupla validação | Nenhuma ação crítica sem aprovação |

---

## 6. Relação com Serviços Externos

### Netlify
- Deploys de preview são permitidos
- Deploys de produção são bloqueados por padrão
- Variáveis de ambiente são lidas **sem expor valores**
- MCP consulta status de deploys

### GitHub Secrets
- MCP consulta **se** a secret existe, **nunca** seu valor
- MCP pode validar se secrets obrigatórias estão configuradas
- Operações de CI/CD são monitoradas via logs públicos

### Supabase
- MCP consulta status do projeto (online/offline)
- Service role key **nunca** vai para frontend
- MCP valida configuração de RLS e policies (futuro)

### Cofre (Bitwarden / Vault)
- Recomendado para armazenamento de segredos críticos
- MCP não acessa o cofre diretamente na V1
- Owner consulta o cofre para rotação manual

---

## 7. Separação Clara de Responsabilidades

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOZE-MCP-OPS V1                               │
├───────────────┬──────────────┬──────────────┬───────────────────┤
│ Documentação  │  Operação    │ Segredo Real │     Log/Auditoria  │
│ (docs/)       │  (MCP Tools) │ (Netlify,    │   (registro-op)    │
│               │              │  GH Secrets, │                    │
│               │              │  Supabase,   │                    │
│               │              │  Cofre)      │                    │
├───────────────┼──────────────┼──────────────┼───────────────────┤
│ Plano         │ Consultar    │ 🚫 NUNCA     │ Data/hora         │
│ Mapa          │ Validar      │    no        │ Agente            │
│ Permissões    │ Acionar      │    doc       │ Ação              │
│ Checklist     │ Verificar    │    ou no     │ Resultado         │
│               │ Registrar    │    log       │ Correlation ID    │
└───────────────┴──────────────┴──────────────┴───────────────────┘
```

---

## 8. Arquitetura em Camadas

### Camada 1 — Solicitação do Agente
- Agente (humano ou IA) invoca uma ferramenta MCP
- A requisição chega ao MCP Server (ou mock)
- Parâmetros são validados contra schema

### Camada 2 — Validação/Autorização
- Verifica se a ferramenta existe e está habilitada
- Verifica se o ambiente permite a ação
- Verifica se a ação exige autorização explícita
- Se exigir: bloqueia até autorização ser concedida

### Camada 3 — Execução Segura
- MCP obtém credencial de curta duração (`MCP_INTERNAL_OPS_TOKEN`)
- Executa a ação com a credencial protegida
- **Nunca** expõe a credencial ao agente
- Retorna apenas o resultado controlado

### Camada 4 — Log/Auditoria
- Toda operação gera um registro obrigatório
- Log contém: data/hora, agente, ação, resultado, `correlation_id`
- Log **nunca** contém valores de segredos
- Log é armazenado para auditoria futura

### Camada 5 — Resposta Controlada
- Agente recebe apenas:
  - Status da operação (sucesso/erro)
  - Mensagem descritiva
  - Evidência controlada (link, ID, validação)
  - `correlation_id` para rastreamento

---

## 9. Pontos de Controle e Auditoria

| Ponto | O que verifica | Resposta |
|-------|---------------|----------|
| **Entrada** | Parâmetros da ferramenta | Validar schema |
| **Permissão** | Matriz de permissões | Permitir/Bloquear |
| **Ambiente** | Se ação é permitida no ambiente alvo | Autorizar/Negar |
| **Execução** | Se a operação foi bem-sucedida | Sucesso/Erro |
| **Saída** | Se a resposta contém segredo | Sanitizar/Remover |
| **Log** | Se o registro foi persistido | Confirmar |

---

## 10. Travas Obrigatórias

1. **Toda ação crítica exige autorização explícita** — não basta o agente pedir
2. **Produção nunca recebe alteração sem dupla validação** — no mínimo 2 pessoas/agentes
3. **Segredo real nunca sai do MCP** — o agente não recebe a chave, apenas o resultado
4. **Log é obrigatório** — sem log, a operação é considerada não executada
5. **Cada operação tem um `correlation_id` único** — para rastreabilidade fim a fim

---

## 11. Histórico de Revisões

| Data | Versão | Alteração | Responsável |
|------|--------|-----------|-------------|
| 2026-06-07 | 1.0 | Criação do documento — Arquitetura LOZE-MCP-OPS V1 | Cássio Mendes |

---

*Este documento é parte do padrão **LOZE-MCP-OPS | Operações, Ambientes e Segredos**.
Arquivo: `docs/loze-mcp-ops-ambientes.md`*
