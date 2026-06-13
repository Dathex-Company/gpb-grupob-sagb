# 🛡️ Auditoria — Histórico Supabase Central de Padrões — 12-06-2026

## 📋 Resumo Executivo

Diagnóstico completo do histórico de migrations Supabase para resolver divergência local/remota e permitir aplicação segura da migration `20260612000101_central_padroes_documents_governance_extension`.

---

## 1. Diagnóstico do Histórico

Comando executado:
```powershell
cd Z:\00_sagb; npx supabase migration list
```

### 1.1 Migrations locais (presentes em `supabase/migrations/`)

| Migration ID | Descrição | Status |
|---|---|---|
| 20240207000101 | governance_audit_members | ✅ Sincronizada |
| 20240207000102 | governance_core | ✅ Sincronizada |
| 20240207000103 | governance_knowledge | ✅ Sincronizada |
| ... | ... (demais sincronizadas) | ✅ |
| 20260603001001 | central_padroes_fix_cp_sync_all_users | ✅ Sincronizada |
| **20260603002001** | **central_padroes_fix_cp_rate_limit** | 🟡 Local-only (não aplicada remoto) |
| **20260612000101** | **central_padroes_documents_governance_extension** | 🟡 Local-only (não aplicada remoto) |

### 1.2 Migrations remotas (presentes no Supabase)

| Migration ID | Descrição | Status |
|---|---|---|
| ... | ... (demais sincronizadas) | ✅ |
| **20260610152455** | **Desconhecida** | 🔴 Remote-only (ausente localmente) |

---

## 2. Migration Ausente Localmente: `20260610152455`

### 2.1 Resultado da busca

| Método | Resultado |
|---|---|
| `search_files` regex `20260610152455` em `Z:\00_sagb` | Apenas referências em relatórios (não é arquivo SQL) |
| `dir /s /b *20260610152455*` em `Z:\00_sagb` | Nenhum arquivo encontrado |
| Verificação em `Z:\00_sagb\supabase\migrations` | Não existe |
| Verificação em `Z:\00_sagb\src` | Não existe |
| Verificação em `Z:\00_sagb` (raiz) | Não existe |

### 2.2 Classificação

> **Migration remota órfã / local ausente.**

A migration `20260610152455` existe APENAS na tabela `supabase_migrations.schema_migrations` do banco remoto. O arquivo SQL correspondente não existe em nenhum local do projeto `Z:\00_sagb`.

### 2.3 Aparece como aplicada no remoto?

**Sim.** A migration list mostra `20260610152455` na coluna "Remote" com timestamp `2026-06-10 15:24:55`, indicando que foi registrada como aplicada.

### 2.4 Existe arquivo correspondente em outro lugar do projeto?

**Não.** A busca exaustiva em todo o diretório `Z:\00_sagb` não encontrou nenhum arquivo SQL com esse ID.

---

## 3. Risco de Repair

### 3.1 `migration repair --status reverted 20260610152455`

| Aspecto | Avaliação |
|---|---|
| O que faz | Remove a linha da tabela `supabase_migrations.schema_migrations` no remoto |
| Impacto no schema | **Nenhum.** Apenas metadata; não executa DROP ou rollback |
| Impacto em dados | **Nenhum.** |
| Risco se migration criou tabelas | **Baixo.** Tabelas permanecem; migrations locais usam `IF NOT EXISTS` |
| Risco de perda de dados | **Nenhum.** Repair não reverte SQL |
| Classificação | **R3** (metadata remoto, sem alteração de schema) |

### 3.2 `db pull`

| Aspecto | Avaliação |
|---|---|
| O que faz | Cria arquivo de migration local com diff remoto→local |
| Risco | **R5** se criar arquivo; pode gerar migration redundante |
| Bloqueio atual | `db pull` também bloqueou com mesmo erro de divergência |
| Classificação | **R4/R5** — não recomendado como primeira opção |

---

## 4. Recomendação Segura

### Estratégia adotada: **A + C híbrida**

```
A. Usar migration repair para marcar órfã como reverted
   (comprovadamente sem arquivo local após busca exaustiva)
C. migration repair justificado: migration remota é órfã comprovada
```

### Sequência de comandos:

```powershell
# Etapa 1: Marcar migration órfã como reverted (apenas metadata)
cd Z:\00_sagb
npx supabase migration repair --status reverted 20260610152455

# Etapa 2: Aplicar migrations locais pendentes
npx supabase db push
```

### Justificativa:

1. **Busca exaustiva comprovou** que `20260610152455` não existe como arquivo em lugar nenhum do projeto
2. **Supabase CLI** recomendou explicitamente `migration repair --status reverted 20260610152455`
3. **Migration `20260612000101`** usa `CREATE TABLE IF NOT EXISTS` — idempotente, seguro mesmo se tabelas já existirem
4. **Migration `20260603002001`** usa `CREATE OR REPLACE FUNCTION` — idempotente
5. **Nenhum dado é perdido** — `repair --status reverted` só altera metadata
6. **Sem service role, sem policy insegura, sem deploy**

### Rollback possível:

Se necessário reverter a decisão:
```powershell
npx supabase migration repair --status applied 20260610152455
```

---

## 5. Tabelas que serão criadas (20260612000101)

| Tabela | RLS | Policies |
|---|---|---|
| `central_padroes_reports` | ✅ Enabled | SELECT authenticated, INSERT authenticated, UPDATE authenticated |
| `central_padroes_audits` | ✅ Enabled | SELECT authenticated, INSERT authenticated, UPDATE authenticated |
| `central_padroes_trace_logs` | ✅ Enabled | SELECT authenticated, INSERT authenticated, UPDATE authenticated |
| `central_padroes_curadoria` | ✅ Enabled | SELECT authenticated, INSERT authenticated, UPDATE authenticated |

- ✅ Sem DELETE policy
- ✅ Sem policy anon
- ✅ Sem service_role no frontend
- ✅ pgcrypto extension (if not exists)

---

## 6. Impacto em dados existentes

**Nenhum.** Todas as tabelas são novas (`CREATE TABLE IF NOT EXISTS`). Nenhum dado existente é alterado ou removido.

---

## 7. Decisão final

| Critério | Decisão |
|---|---|
| Estratégia | `migration repair --status reverted 20260610152455` + `db push` |
| Risco máximo | R3 (repair) + R5 (push) |
| Dados afetados | Nenhum |
| Rollback possível | Sim (repair --status applied) |
| Autorização | Procedimento padrão documentado |
