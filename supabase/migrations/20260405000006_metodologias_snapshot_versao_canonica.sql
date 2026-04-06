-- ET 18 | Núcleo de Metodologias
-- Snapshot mínimo por versão canônica para suportar comparação leve entre marcos

alter table if exists public.metodologias_versoes_canonicas
  add column if not exists snapshot jsonb;
