-- Cria bucket de anexos do chat do Núcleo Conversacional
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'storage'
      and table_name = 'buckets'
  ) then
    insert into storage.buckets (id, name, public, file_size_limit)
    values ('sagb_chat_attachments', 'sagb_chat_attachments', false, 104857600)
    on conflict (id) do nothing;
  end if;
end $$;

