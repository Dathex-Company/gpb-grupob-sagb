# 🛡️ Registro R5 — Aplicação de Migration Supabase — Central de Padrões — 12-06-2026

## 📌 Status
Preparação concluída. A migration ainda NÃO foi aplicada no Supabase remoto.

## ⚠️ Classificação
| Campo | Valor |
|---|---|
| Risco | R5 |
| Motivo | Alteração de schema no Supabase remoto |
| Ambiente alvo | Supabase remoto vinculado ao projeto Z:\00_sagb, somente se confirmado explicitamente |
| Produção | Não aplicar sem confirmação explícita no momento da execução |
| Service role no frontend | Não usado |
| Secrets expostos | Não |

## 📄 Migration
`Z:\00_sagb\supabase\migrations\20260612000101_central_padroes_documents_governance_extension.sql`

## 🧱 Tabelas que serão criadas se não existirem
| Tabela | Finalidade |
|---|---|
| central_padroes_reports | Relatórios oficiais e registros documentais |
| central_padroes_audits | Auditorias, achados, evidências e planos de ação |
| central_padroes_trace_logs | Execuções LOZE-TRACE com comandos, arquivos, erros e resumo |
| central_padroes_curadoria | Itens de curadoria documental, legado, duplicados e fora do padrão |

## 🧩 Campos criados
### Tabelas documentais: reports, audits, curadoria
`id`, `title`, `slug`, `type`, `category`, `status`, `risk_level`, `path_absolute`, `path_relative`, `summary`, `content`, `tags`, `owner`, `source`, `created_at`, `updated_at`, `created_by`, `updated_by`.

### Tabela LOZE-TRACE
`id`, `execution_id`, `project`, `module`, `executor`, `task_title`, `risk_max`, `status`, `started_at`, `finished_at`, `commands_json`, `files_changed_json`, `errors_json`, `summary`, `created_at`.

## 🔐 RLS e policies
| Recurso | Regra |
|---|---|
| RLS | Habilitado nas 4 tabelas |
| Select | `to authenticated using (true)` |
| Insert | `to authenticated with check (auth.uid() is not null)` |
| Update | `to authenticated using/check auth.uid() is not null` |
| Delete | Não criado nesta migration |
| anon | Não recebe policy específica |

## 🧬 Impacto em dados existentes
| Item | Status |
|---|---|
| Drop de tabela | Não |
| Alteração destrutiva | Não |
| Update/delete em dados existentes | Não |
| Criação idempotente | Sim, `create table if not exists` |
| Índices novos | Sim, apenas se não existirem |
| Comentários em tabelas | Sim |

## ↩️ Rollback
Rollback manual possível removendo apenas as tabelas novas, se não tiverem recebido dados de produção:

```sql
drop table if exists public.central_padroes_curadoria;
drop table if exists public.central_padroes_trace_logs;
drop table if exists public.central_padroes_audits;
drop table if exists public.central_padroes_reports;
```

## ⚙️ Comando planejado
A aplicação remota deve ser feita somente após confirmação explícita:

```powershell
cd Z:\00_sagb; npx supabase db push
```

## ✅ Confirmação exigida
Antes da execução remota, confirmar explicitamente que pode aplicar a migration R5 no Supabase remoto vinculado ao projeto.
