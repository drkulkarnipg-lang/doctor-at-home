-- Idempotent source linkage for automatically generated practice-register rows.
begin;
alter table public.clinic_workstation_registers add column if not exists source_event_id text;
create unique index if not exists clinic_workstation_registers_source_event_unique
on public.clinic_workstation_registers(owner_id, register_type, source_event_id)
where source_event_id is not null;
-- Atomically merge non-empty form fields for the same source event.
-- SECURITY INVOKER preserves the caller's authenticated role and table RLS policies.
create or replace function public.upsert_clinic_register_source_event(
  p_register_type text,
  p_entry_date date,
  p_data jsonb,
  p_source_event_id text
) returns setof public.clinic_workstation_registers
language sql
security invoker
set search_path = public
as $
  insert into public.clinic_workstation_registers
    (owner_id, register_type, entry_date, data, source_event_id, revision, updated_at)
  values
    (auth.uid(), p_register_type, p_entry_date,
     coalesce((select jsonb_object_agg(key, value) from jsonb_each(p_data) where value <> '""'::jsonb), '{}'::jsonb),
     p_source_event_id, gen_random_uuid(), now())
  on conflict (owner_id, register_type, source_event_id)
    where source_event_id is not null
  do update set
    entry_date = excluded.entry_date,
    data = public.clinic_workstation_registers.data ||
      coalesce((select jsonb_object_agg(key, value) from jsonb_each(excluded.data) where value <> '""'::jsonb), '{}'::jsonb),
    revision = gen_random_uuid(),
    updated_at = now()
  returning *;
$;
revoke all on function public.upsert_clinic_register_source_event(text,date,jsonb,text) from public, anon;
grant execute on function public.upsert_clinic_register_source_event(text,date,jsonb,text) to authenticated;
commit;
