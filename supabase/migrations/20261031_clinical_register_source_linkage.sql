-- Private clinic registers and idempotent source linkage.
-- Additive migration: creates only the register storage required by the clinical workspace.
begin;

create table if not exists public.clinic_workstation_registers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id),
  register_type text not null check (register_type in ('daily', 'death', 'stock')),
  entry_date date not null,
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object' and pg_column_size(data) <= 20000),
  source_event_id text,
  revision uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.clinic_workstation_registers
  add column if not exists source_event_id text;

create index if not exists clinic_workstation_registers_owner_type_date
  on public.clinic_workstation_registers(owner_id, register_type, entry_date desc, created_at desc);

create unique index if not exists clinic_workstation_registers_source_event_unique
  on public.clinic_workstation_registers(owner_id, register_type, source_event_id)
  where source_event_id is not null;

alter table public.clinic_workstation_registers enable row level security;
alter table public.clinic_workstation_registers force row level security;

revoke all on table public.clinic_workstation_registers from public, anon, authenticated;
grant select, insert, update on table public.clinic_workstation_registers to authenticated;

drop policy if exists clinic_register_owner_reads on public.clinic_workstation_registers;
create policy clinic_register_owner_reads
  on public.clinic_workstation_registers for select to authenticated
  using (owner_id = (select auth.uid()) and exists (select 1 from public.clinic_members where user_id = (select auth.uid())));

drop policy if exists clinic_register_owner_inserts on public.clinic_workstation_registers;
create policy clinic_register_owner_inserts
  on public.clinic_workstation_registers for insert to authenticated
  with check (owner_id = (select auth.uid()) and exists (select 1 from public.clinic_members where user_id = (select auth.uid())));

drop policy if exists clinic_register_owner_updates on public.clinic_workstation_registers;
create policy clinic_register_owner_updates
  on public.clinic_workstation_registers for update to authenticated
  using (owner_id = (select auth.uid()) and exists (select 1 from public.clinic_members where user_id = (select auth.uid())))
  with check (owner_id = (select auth.uid()) and exists (select 1 from public.clinic_members where user_id = (select auth.uid())));

-- Merge only non-empty incoming values for one explicit source event.
-- SECURITY INVOKER preserves authenticated RLS enforcement.
create or replace function public.upsert_clinic_register_source_event(
  p_register_type text,
  p_entry_date date,
  p_data jsonb,
  p_source_event_id text
) returns setof public.clinic_workstation_registers
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_owner_id uuid := auth.uid();
  v_data jsonb;
begin
  if v_owner_id is null then
    raise exception 'Authenticated clinic owner required' using errcode = '28000';
  end if;
  if p_register_type not in ('daily', 'death', 'stock')
     or p_entry_date is null
     or p_data is null
     or jsonb_typeof(p_data) <> 'object'
     or p_source_event_id is null
     or length(p_source_event_id) < 1
     or length(p_source_event_id) > 80 then
    raise exception 'Invalid register source event' using errcode = '22023';
  end if;

  select coalesce(jsonb_object_agg(key, value), '{}'::jsonb)
    into v_data
    from jsonb_each(p_data)
   where value <> '""'::jsonb
     and value <> 'null'::jsonb;

  return query
    insert into public.clinic_workstation_registers
      (owner_id, register_type, entry_date, data, source_event_id, revision, updated_at)
    values
      (v_owner_id, p_register_type, p_entry_date, v_data, p_source_event_id, gen_random_uuid(), now())
    on conflict (owner_id, register_type, source_event_id)
      where source_event_id is not null
    do update set
      entry_date = excluded.entry_date,
      data = public.clinic_workstation_registers.data || excluded.data,
      revision = gen_random_uuid(),
      updated_at = now()
    returning *;
end;
$$;

revoke all on function public.upsert_clinic_register_source_event(text, date, jsonb, text) from public, anon;
grant execute on function public.upsert_clinic_register_source_event(text, date, jsonb, text) to authenticated;

commit;
