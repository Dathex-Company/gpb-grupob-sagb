-- ET 19 | Núcleo de Metodologias
-- Backfill, integridade e gestão formal de snapshots canônicos

alter table if exists public.metodologias_versoes_canonicas
  add column if not exists snapshot_status text,
  add column if not exists snapshot_validado_em timestamptz;

alter table if exists public.metodologias_versoes_canonicas
  drop constraint if exists metodologias_versoes_canonicas_snapshot_status_check;

alter table if exists public.metodologias_versoes_canonicas
  add constraint metodologias_versoes_canonicas_snapshot_status_check check (
    snapshot_status in ('ausente', 'integro', 'incompleto', 'incompativel')
  );

create index if not exists idx_metodologias_versoes_snapshot_status
  on public.metodologias_versoes_canonicas(snapshot_status);
