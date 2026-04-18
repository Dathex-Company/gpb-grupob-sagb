# MIGRACAO FUTURA — SUPABASE DEDICADO (taskzei)

## objetivo

Documentar um plano simples, rastreavel e seguro para mover o modulo `taskzei` do banco compartilhado do SagB para um projeto Supabase dedicado, sem perder historico e mantendo compatibilidade de codigo.

## estado atual

- banco atual: projeto Supabase compartilhado do SagB.
- isolamento atual: tabelas exclusivas com prefixo `taskzei_`.
- migration base: `supabase/migrations/20260417000101_taskzei_persistence.sql`.
- provider ativo por env: `VITE_TASKZEI_PROVIDER=supabase`.

## escopo de dados a migrar

1. `taskzei_tasks`
2. `taskzei_task_checklist_items`
3. `taskzei_task_comments`

## estrategia recomendada (1:1)

1. criar novo projeto Supabase dedicado ao taskzei.
2. executar a migration base no novo projeto.
3. exportar dados do banco compartilhado (CSV/SQL) por tabela `taskzei_*`.
4. importar os mesmos dados no novo projeto mantendo os mesmos `id` (uuid).
5. validar integridade referencial:
   - checklist/task_id -> tasks/id
   - comments/task_id -> tasks/id
6. trocar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` para o novo projeto.
7. validar CRUD no app (criar, atualizar, concluir, comentar, excluir).

## checklist de validacao pos-migracao

- [ ] listagem de tarefas carregando
- [ ] criacao de tarefa persistindo
- [ ] refresh mantendo dados
- [ ] alteracao de status persistindo
- [ ] checklist e comentarios vinculados corretamente
- [ ] politicas RLS ativas para `authenticated`

## observacoes

- o desenho atual foi feito para facilitar migracao 1:1.
- manter o prefixo `taskzei_` tambem no projeto dedicado preserva rastreabilidade historica.
