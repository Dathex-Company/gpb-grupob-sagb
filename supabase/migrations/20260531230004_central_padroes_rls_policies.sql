-- Central de Padrões ET-07 | RLS refinado
-- Políticas conservadoras: leitura autenticada, escrita autenticada; refinamento por roles fica documentado para próxima fase.

do $$
declare
  t text;
begin
  foreach t in array array[
    'central_padroes_areas',
    'central_padroes_standards',
    'central_padroes_standard_dependencies',
    'central_padroes_documents',
    'central_padroes_decisions',
    'central_padroes_checklists',
    'central_padroes_module_links',
    'central_padroes_agent_runs',
    'central_padroes_approval_requests',
    'central_padroes_evidence_records',
    'central_padroes_ingestion_queue',
    'central_padroes_triagem',
    'central_padroes_standard_history',
    'central_padroes_tags',
    'central_padroes_standard_tags',
    'central_padroes_embeddings'
  ]
  loop
    execute format('alter table if exists public.%I enable row level security', t);
    execute format('drop policy if exists "cp_read_authenticated_%s" on public.%I', t, t);
    execute format('create policy "cp_read_authenticated_%s" on public.%I for select using (auth.role() = ''authenticated'')', t, t);
    execute format('drop policy if exists "cp_write_authenticated_%s" on public.%I', t, t);
    execute format('create policy "cp_write_authenticated_%s" on public.%I for all using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'')', t, t);
  end loop;
end $$;

