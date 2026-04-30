-- Migration: Tabela de rastreabilidade de notificações TaskZei
-- Autor: Dani Freitas (TaskZei)
-- Data: 2026-04-20
-- Descrição: Armazena histórico de envios de e-mail automáticos para tarefas, com ciclo de vida completo,
--            deduplicação, tentativas, observabilidade e bloqueio explícito quando assigneeId não vinculado.

create table if not exists public.taskzei_notifications (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  task_id uuid not null references public.taskzei_tasks(id) on delete cascade,
  assignee_id uuid, -- referência ao auth.users.id (se houver vínculo)
  assignee_email text, -- e-mail resolvido (ou null se bloqueado)
  event_type text not null check (event_type in ('task_created', 'status_changed', 'due_reminder')),
  event_subtype text, -- ex: 'status_changed:pendente->em_andamento'
  notification_status text not null default 'pending' check (notification_status in (
    'pending',          -- aguardando processamento
    'resolving',        -- resolvendo destinatário
    'recipient_blocked',-- assigneeId não vinculado a users; bloqueado
    'recipient_resolved',-- destinatário válido encontrado
    'sending',          -- em processo de envio
    'sent',             -- enviado com sucesso
    'delivered',        -- confirmado entrega (se suporte)
    'failed',           -- falha após tentativas
    'skipped'           -- pulado por regra de negócio (ex: janela de deduplicação)
  )),
  deduplication_hash text, -- hash para evitar duplicação (ex: task_id + event_type + window)
  template_key text not null default 'default',
  subject text,
  body_html text,
  body_text text,
  variables jsonb default '{}'::jsonb, -- variáveis dinâmicas usadas no template
  provider_message_id text, -- ID retornado pelo provedor transacional (ex: SendGrid, Resend)
  provider_response jsonb, -- resposta bruta do provedor
  attempt_count int not null default 0,
  last_attempt_at timestamptz,
  last_error text,
  scheduled_for timestamptz, -- quando o envio deve ocorrer (para lembretes agendados)
  sent_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Índices para performance e consultas comuns
create index if not exists idx_taskzei_notifications_workspace
  on public.taskzei_notifications(workspace_id);

create index if not exists idx_taskzei_notifications_task
  on public.taskzei_notifications(task_id);

create index if not exists idx_taskzei_notifications_event_type
  on public.taskzei_notifications(event_type);

create index if not exists idx_taskzei_notifications_status
  on public.taskzei_notifications(notification_status);

create index if not exists idx_taskzei_notifications_deduplication_hash
  on public.taskzei_notifications(deduplication_hash)
  where deduplication_hash is not null;

create index if not exists idx_taskzei_notifications_scheduled_for
  on public.taskzei_notifications(scheduled_for)
  where scheduled_for is not null;

create index if not exists idx_taskzei_notifications_assignee_id
  on public.taskzei_notifications(assignee_id)
  where assignee_id is not null;

-- Trigger para atualizar updated_at automaticamente
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_taskzei_notifications_updated_at on public.taskzei_notifications;
create trigger update_taskzei_notifications_updated_at
before update on public.taskzei_notifications
for each row execute function public.update_updated_at_column();

-- RLS Policies (herda workspace do task via join, mas garantimos segurança explícita)
alter table public.taskzei_notifications enable row level security;

-- Política de SELECT: usuários autenticados podem ver notificações de tarefas que pertencem ao seu workspace
drop policy if exists taskzei_notifications_select on public.taskzei_notifications;
create policy taskzei_notifications_select
on public.taskzei_notifications
for select
using (
  auth.role() = 'authenticated'
  and exists (
    select 1 from public.taskzei_tasks t
    where t.id = taskzei_notifications.task_id
      and exists (
        select 1 from public.workspace_members wm
        where wm.workspace_id = t.workspace_id
          and wm.user_id = auth.uid()
      )
  )
);

-- Política de INSERT: apenas service_role (server-side) pode inserir notificações
drop policy if exists taskzei_notifications_insert on public.taskzei_notifications;
create policy taskzei_notifications_insert
on public.taskzei_notifications
for insert
with check (auth.role() = 'service_role');

-- Política de UPDATE: apenas service_role pode atualizar notificações (ex: status, tentativas)
drop policy if exists taskzei_notifications_update on public.taskzei_notifications;
create policy taskzei_notifications_update
on public.taskzei_notifications
for update
using (auth.role() = 'service_role');

-- Política de DELETE: apenas service_role pode deletar notificações (limpeza administrativa)
drop policy if exists taskzei_notifications_delete on public.taskzei_notifications;
create policy taskzei_notifications_delete
on public.taskzei_notifications
for delete
using (auth.role() = 'service_role');

-- Comentários para documentação
comment on table public.taskzei_notifications is 'Rastreabilidade de notificações automáticas de e‑mail do módulo TaskZei.';
comment on column public.taskzei_notifications.assignee_id is 'ID do usuário no auth.users vinculado à tarefa. Se null, não há vínculo válido.';
comment on column public.taskzei_notifications.assignee_email is 'E‑mail resolvido do destinatário. Null indica bloqueio por falta de vínculo.';
comment on column public.taskzei_notifications.deduplication_hash is 'Hash SHA‑256 para evitar duplicação de notificações dentro de uma janela de tempo.';
comment on column public.taskzei_notifications.notification_status is 'Ciclo de vida da notificação, incluindo estados de bloqueio por falta de vínculo.';
comment on column public.taskzei_notifications.provider_message_id is 'Identificador único retornado pelo provedor transacional para rastreamento externo.';

-- View simplificada para auditoria operacional
create or replace view public.taskzei_notifications_audit as
select
  n.id,
  n.workspace_id,
  n.task_id,
  t.title as task_title,
  n.assignee_id,
  n.assignee_email,
  n.event_type,
  n.event_subtype,
  n.notification_status,
  n.template_key,
  n.subject,
  n.attempt_count,
  n.last_error,
  n.scheduled_for,
  n.sent_at,
  n.created_at,
  n.updated_at
from public.taskzei_notifications n
join public.taskzei_tasks t on t.id = n.task_id;

comment on view public.taskzei_notifications_audit is 'Visão de auditoria de notificações TaskZei com dados da tarefa associada.';