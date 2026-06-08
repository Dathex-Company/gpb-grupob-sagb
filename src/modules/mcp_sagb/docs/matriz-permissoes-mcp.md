# Matriz de Permissões MCP — LOZE-MCP-OPS V1

> Documento oficial que define ações permitidas, protegidas e bloqueadas na V1 do LOZE-MCP-OPS.
> Nenhuma ação pode ser executada fora desta matriz sem avaliação prévia de segurança.

---

## 1. Categorias de Permissão

| Categoria | Descrição | Exemplo |
|-----------|-----------|---------|
| ✅ **Permitido** | Ação liberada sem restrições para agentes autorizados | `consultar-status-projeto` |
| 🟡 **Protegido** | Ação permitida, mas exige autorização explícita e gera log obrigatório | `acionar-build-preview` |
| ⛔ **Bloqueado por padrão** | Ação NÃO disponível na V1 — só executada com autorização especial | `deploy-producao` |

---

## 2. Ferramentas Iniciais da V1

### ✅ Ferramentas Permitidas

| # | Ferramenta | Ambiente | Risco | Autorização | Owner | Log |
|---|-----------|----------|-------|-----------|-------|-----|
| 1 | `consultar-status-projeto` | Local, Preview, Produção | 🟢 Baixo | Não | Sávio Codare | ✅ Obrigatório |
| 2 | `listar-variaveis-sem-valores` | Local, Preview, Produção | 🟢 Baixo | Não | Sávio Codare | ✅ Obrigatório |
| 3 | `validar-variaveis-obrigatorias` | Local, Preview, Produção | 🟢 Baixo | Não | Sávio Codare | ✅ Obrigatório |
| 4 | `consultar-status-deploy` | Preview, Produção | 🟢 Baixo | Não | Sávio Codare | ✅ Obrigatório |
| 5 | `consultar-logs-deploy` | Preview, Produção | 🟢 Baixo | Não | Sávio Codare | ✅ Obrigatório |
| 6 | `verificar-github-status` | Local, Preview, Produção | 🟢 Baixo | Não | Sávio Codare | ✅ Obrigatório |
| 7 | `verificar-supabase-status` | Local, Preview, Produção | 🟢 Baixo | Não | Sávio Codare | ✅ Obrigatório |
| 8 | `registrar-evento-operacional` | Local, Preview, Produção | 🟡 Médio | Não | Sávio Codare | ✅ Obrigatório (auto) |

### 🟡 Ferramentas Protegidas

| # | Ferramenta | Ambiente | Risco | Autorização | Owner | Log | Observação |
|---|-----------|----------|-------|-----------|-------|-----|-----------|
| 9 | `acionar-build-preview` | Preview | 🟡 Médio | Sim — owner ou agente autorizado | Sávio Codare | ✅ Obrigatório | Apenas preview. Produção é bloqueada. |
| 10 | `listar-variaveis` (modo detalhado) | Preview, Produção | 🔴 Alto | Sim — owner | Sávio Codare | ✅ Obrigatório | Retorna nomes SEM valores. Produção só com dupla validação. |

### ⛔ Ações Bloqueadas na V1 (sem autorização explícita)

| # | Ação | Motivo do Bloqueio | Ambiente | Risco | Autorização | Owner | Log | Dupla Validação |
|---|------|-------------------|----------|-------|-----------|-------|-----|----------------|
| 1 | `alterar-variavel-producao` | Altera ambiente crítico | Produção | 🔴 Crítico | Sim — owner + dupla validação | Sávio Codare | ✅ Obrigatório | ✅ Sim |
| 2 | `excluir-variavel` | Remove variável de ambiente | Todos | 🔴 Alto | Sim — owner | Sávio Codare | ✅ Obrigatório | ❌ Não |
| 3 | `rotacionar-chave` | Gera novo segredo crítico | Produção | 🔴 Crítico | Sim — owner + cofre | Sávio Codare | ✅ Obrigatório | ✅ Sim |
| 4 | `deploy-producao` | Altera ambiente real de usuários | Produção | 🔴 Crítico | Sim — owner + dupla validação | Sávio Codare | ✅ Obrigatório | ✅ Sim |
| 5 | `alterar-rls` | Modifica segurança do banco | Produção | 🔴 Crítico | Sim — owner + DBA | Sávio Codare | ✅ Obrigatório | ✅ Sim |
| 6 | `alterar-policy` | Modifica política de segurança | Produção | 🔴 Crítico | Sim — owner + DBA | Sávio Codare | ✅ Obrigatório | ✅ Sim |
| 7 | `rodar-migration` | Altera schema do banco | Produção | 🔴 Crítico | Sim — owner + DBA | Sávio Codare | ✅ Obrigatório | ✅ Sim |
| 8 | `reset-banco` | Destrói dados | Todos | 🔴 Crítico | **Bloqueado na V1** | Sávio Codare | ✅ Obrigatório | N/A |
| 9 | `apagar-bucket` | Remove storage | Produção | 🔴 Alto | Sim — owner | Sávio Codare | ✅ Obrigatório | ❌ Não |
| 10 | `push-main` | Altera branch principal | GitHub | 🔴 Alto | Sim — owner + PR | Sávio Codare | ✅ Obrigatório | ✅ Sim (PR) |
| 11 | `force-push` | Sobrescreve histórico | GitHub | 🔴 Crítico | **Bloqueado na V1** | Sávio Codare | ✅ Obrigatório | N/A |

---

## 3. Resumo Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                    MATRIZ DE PERMISSÕES V1                       │
├──────────────┬──────────────────┬──────────────────┬────────────┤
│   Ação       │  Local           │  Preview          │ Produção   │
├──────────────┼──────────────────┼──────────────────┼────────────┤
│ Consultar    │ ✅ Permitido     │ ✅ Permitido      │ ✅ Permitido│
│ status       │                  │                   │            │
├──────────────┼──────────────────┼──────────────────┼────────────┤
│ Listar vars  │ ✅ Permitido     │ ✅ Permitido      │ ✅ Permitido│
│ (sem valor)  │                  │                   │            │
├──────────────┼──────────────────┼──────────────────┼────────────┤
│ Validar vars │ ✅ Permitido     │ ✅ Permitido      │ ✅ Permitido│
│ obrigatórias │                  │                   │            │
├──────────────┼──────────────────┼──────────────────┼────────────┤
│ Consultar    │ N/A              │ ✅ Permitido      │ ✅ Permitido│
│ deploy       │                  │                   │            │
├──────────────┼──────────────────┼──────────────────┼────────────┤
│ Acionar      │ N/A              │ 🟡 Protegido      │ ⛔ Bloqueado│
│ build        │                  │                   │            │
├──────────────┼──────────────────┼──────────────────┼────────────┤
│ Alterar var  │ 🟡 Protegido     │ 🟡 Protegido      │ ⛔ Bloqueado│
│              │                  │                   │            │
├──────────────┼──────────────────┼──────────────────┼────────────┤
│ Deploy prod  │ N/A              │ N/A               │ ⛔ Bloqueado│
├──────────────┼──────────────────┼──────────────────┼────────────┤
│ Migration    │ 🟡 Protegido     │ 🟡 Protegido      │ ⛔ Bloqueado│
├──────────────┼──────────────────┼──────────────────┼────────────┤
│ Reset banco  │ ⛔ Bloqueado     │ ⛔ Bloqueado      │ ⛔ Bloqueado│
├──────────────┼──────────────────┼──────────────────┼────────────┤
│ Force push   │ ⛔ Bloqueado     │ ⛔ Bloqueado      │ ⛔ Bloqueado│
└──────────────┴──────────────────┴──────────────────┴────────────┘
```

---

## 4. Regras de Autorização

| Tipo | O que significa | Exemplo |
|------|----------------|---------|
| **Autorização simples** | Um owner ou agente autorizado aprova | Owner confirma `acionar-build-preview` |
| **Dupla validação** | Duas pessoas/agentes distintos aprovam | Owner + Líder técnico aprovam `deploy-producao` |
| **Bloqueado na V1** | Ação não está disponível mesmo com autorização | `reset-banco`, `force-push` |

---

## 5. Evidência e Log por Ação

| Ação | Evidência Gerada | Log Obrigatório | Onde Registra |
|------|-----------------|----------------|---------------|
| Consultar status | JSON com status atual | Sim | `registro-operacoes-mcp.md` |
| Listar variáveis | Lista de nomes (sem valores) | Sim | `registro-operacoes-mcp.md` |
| Validar variáveis | Lista com status (ok/faltando) | Sim | `registro-operacoes-mcp.md` |
| Acionar build preview | Link do deploy | Sim | `registro-operacoes-mcp.md` |
| Bloqueio | Mensagem de ação bloqueada | Sim | `registro-operacoes-mcp.md` |

---

## 6. Fluxo de Autorização para Ações Protegidas

```
Ação Protegida Solicitada
        │
        ▼
┌───────────────────┐
│  Verificar Matriz  │
│  de Permissões     │
└────────┬──────────┘
         │
    ┌────┴────┐
    │         │
  Permitido  Protegido
    │         │
    ▼         ▼
  Executa  ┌──────────────────┐
           │  Solicitar       │
           │  Autorização     │
           └────────┬─────────┘
                    │
              ┌─────┴─────┐
              │           │
          Autorizado   Negado
              │           │
              ▼           ▼
           Executa     Registra
              │        Bloqueio
              ▼
           Gera Log
```

---

## 7. Ações que Exigem Atenção Imediata

Se qualquer uma das ações abaixo for tentada, o sistema DEVE:

1. **Bloquear imediatamente** a execução
2. **Notificar o owner** (Sávio Codare)
3. **Registrar log** com risco `critical`
4. **Manter evidência** da tentativa

| Ação | Gatilho |
|------|---------|
| `deploy-producao` | Qualquer tentativa de deploy em produção |
| `reset-banco` | Qualquer tentativa de reset |
| `force-push` | Qualquer tentativa de force push |
| `alterar-rls` | Tentativa de modificar RLS em produção |
| `rotacionar-chave` | Tentativa sem autorização explícita |

---

## 8. Histórico de Revisões

| Data | Versão | Alteração | Responsável |
|------|--------|-----------|-------------|
| 2026-06-07 | 1.0 | Criação do documento — Matriz de permissões LOZE-MCP-OPS V1 | Cássio Mendes |

---

*Este documento é parte do padrão **LOZE-MCP-OPS | Operações, Ambientes e Segredos**.
Arquivo: `docs/matriz-permissoes-mcp.md`*
