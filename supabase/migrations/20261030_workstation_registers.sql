-- Owner-only clinical workstation registers. Apply manually in the dedicated Supabase project
-- after reviewing the migration; this file is not run automatically by deployment.
begin;
create table if not exists public.clinic_workstation_registers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id),
  register_type text not null check (register_type in ('daily','death','stock')),
  entry_date date not null,
  data jsonb not null check (jsonb_typeof(data)='object' and pg_column_size(data) <= 20000),
  revision uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists clinic_workstation_registers_owner_type_date
  on public.clinic_workstation_registers(owner_id, register_type, entry_date desc, created_at desc);
alter table public.clinic_workstation_registers enable row level security;
alter table public.clinic_workstation_registers force row level security;
revoke all on public.clinic_workstation_registers from anon, authenticated;
grant select, insert, update on public.clinic_workstation_registers to authenticated;
drop policy if exists clinic_register_owner_reads on public.clinic_workstation_registers;
drop policy if exists clinic_register_owner_inserts on public.clinic_workstation_registers;
drop policy if exists clinic_register_owner_updates on public.clinic_workstation_registers;
create policy clinic_register_owner_reads on public.clinic_workstation_registers for select to authenticated
using (owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create policy clinic_register_owner_inserts on public.clinic_workstation_registers for insert to authenticated
with check (owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create policy clinic_register_owner_updates on public.clinic_workstation_registers for update to authenticated
using (owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())))
with check (owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
commit;
-- No DELETE grant or policy: register entries are retained; correct them with revision-checked updates.
