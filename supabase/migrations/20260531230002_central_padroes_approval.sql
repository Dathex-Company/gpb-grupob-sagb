-- Central de Padrões ET-03 | Approval Workflow

alter table if exists public.central_padroes_standards
  add column if not exists approval_status text not null default 'draft',
  add column if not exists approval_requested_at timestamptz null,
  add column if not exists approval_decided_at timestamptz null,
  add column if not exists canonical boolean not null default false;

create or replace function public.central_padroes_check_approval_before_publish()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'publicado' and coalesce(new.approval_status, 'draft') not in ('approved', 'published') then
    raise exception 'Cannot publish standard without approval';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_cp_check_approval_before_publish on public.central_padroes_standards;
create trigger trg_cp_check_approval_before_publish
before update of status on public.central_padroes_standards
for each row execute function public.central_padroes_check_approval_before_publish();

create index if not exists idx_cp_approval_requests_status on public.central_padroes_approval_requests(status);
create index if not exists idx_cp_approval_requests_standard on public.central_padroes_approval_requests(standard_id);

