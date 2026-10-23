-- Run in a dedicated clinical project. No real patient data belongs in source control.
begin;
create table public.clinic_members (user_id uuid primary key references auth.users(id));
alter table public.clinic_members enable row level security;
revoke all on public.clinic_members from anon,authenticated;
grant select on public.clinic_members to authenticated;
create policy member_reads_self on public.clinic_members for select to authenticated
using (user_id=(select auth.uid()));

create table public.clinic_patient_trends (
 owner_id uuid not null references auth.users(id),
 id text not null check (id ~ '^pt-[0-9a-fA-F-]{36}$'),
 name text not null check (length(name) between 1 and 120),
 readings jsonb not null default '[]'::jsonb check (jsonb_typeof(readings)='array' and jsonb_array_length(readings)<=2000),
 revision uuid not null default gen_random_uuid(),
 updated_at timestamptz not null default now(),
 primary key(owner_id,id)
);
alter table public.clinic_patient_trends enable row level security;
alter table public.clinic_patient_trends force row level security;
revoke all on public.clinic_patient_trends from anon,authenticated;
grant select,insert,update on public.clinic_patient_trends to authenticated;
create policy owner_reads on public.clinic_patient_trends for select to authenticated
using (owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create policy owner_inserts on public.clinic_patient_trends for insert to authenticated
with check (owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create policy owner_updates on public.clinic_patient_trends for update to authenticated
using (owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())))
with check (owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
commit;
-- Add ONLY the doctor's verified auth.users UUID using the administrative SQL editor:
-- insert into public.clinic_members(user_id) values ('VERIFIED_OWNER_UUID');
-- No public signup, no anonymous access, no DELETE permission in this version.
