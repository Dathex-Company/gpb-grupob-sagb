-- ET-01 | Governance Rules (Fase 1)

create table if not exists public.governance_rules (
  id uuid primary key default gen_random_uuid(),
  rule_key text not null unique,
  domain text not null,
  title text not null,
  content_md text not null,
  version int not null default 1,
  checksum_sha256 text not null,
  source_of_truth text not null default 'supabase',
  sync_target_path text not null,
  sync_status text not null default 'pending' check (sync_status in ('pending', 'synced', 'failed')),
  last_sync_error text null,
  updated_by text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_governance_rules_rule_key on public.governance_rules(rule_key);
create index if not exists idx_governance_rules_domain on public.governance_rules(domain);
create index if not exists idx_governance_rules_sync_status on public.governance_rules(sync_status);

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_governance_rules_updated_at on public.governance_rules;
create trigger update_governance_rules_updated_at
before update on public.governance_rules
for each row
execute function public.update_updated_at_column();

alter table public.governance_rules enable row level security;

drop policy if exists "Enable read access for authenticated users" on public.governance_rules;
create policy "Enable read access for authenticated users"
on public.governance_rules
for select
using (auth.role() = 'authenticated');

drop policy if exists "Enable all access for authenticated users" on public.governance_rules;
create policy "Enable all access for authenticated users"
on public.governance_rules
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

