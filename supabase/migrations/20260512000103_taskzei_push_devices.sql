-- Migration: Tabela de device tokens para push notifications TaskZei
-- Autor: Dani Freitas (TaskZei)
-- Data: 2026-05-12
-- Descrição: Armazena tokens de dispositivos para envio de push notifications via OneSignal.
-- Relacionamento: user_id → auth.users.id (cada usuário pode ter múltiplos dispositivos)

create table if not exists public.taskzei_push_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  device_token text not null,
  platform text not null check (platform in ('web', 'ios', 'android')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Um usuário não pode registrar o mesmo token duas vezes
  unique(user_id, device_token)
);

-- Índices para consultas comuns
create index if not exists idx_taskzei_push_devices_user
  on public.taskzei_push_devices(user_id);

create index if not exists idx_taskzei_push_devices_token
  on public.taskzei_push_devices(device_token);

-- Trigger para atualizar updated_at automaticamente
drop trigger if exists update_taskzei_push_devices_updated_at on public.taskzei_push_devices;
create trigger update_taskzei_push_devices_updated_at
before update on public.taskzei_push_devices
for each row execute function public.update_updated_at_column();

-- RLS Policies
alter table public.taskzei_push_devices enable row level security;

-- Política de SELECT: usuários autenticados podem ver apenas seus próprios devices
drop policy if exists taskzei_push_devices_select on public.taskzei_push_devices;
create policy taskzei_push_devices_select
on public.taskzei_push_devices
for select
using (
  auth.role() = 'authenticated'
  and user_id = auth.uid()
);

-- Política de INSERT: usuários autenticados podem inserir seus próprios devices
drop policy if exists taskzei_push_devices_insert on public.taskzei_push_devices;
create policy taskzei_push_devices_insert
on public.taskzei_push_devices
for insert
with check (
  auth.role() = 'authenticated'
  and user_id = auth.uid()
);

-- Política de DELETE: usuários autenticados podem remover seus próprios devices
drop policy if exists taskzei_push_devices_delete on public.taskzei_push_devices;
create policy taskzei_push_devices_delete
on public.taskzei_push_devices
for delete
using (
  auth.role() = 'authenticated'
  and user_id = auth.uid()
);

-- Comentários para documentação
comment on table public.taskzei_push_devices is 'Tokens de dispositivos para push notifications do módulo TaskZei.';
comment on column public.taskzei_push_devices.user_id is 'ID do usuário no auth.users.';
comment on column public.taskzei_push_devices.device_token is 'Token único do dispositivo fornecido pelo OneSignal.';
comment on column public.taskzei_push_devices.platform is 'Plataforma do dispositivo: web, ios ou android.';
