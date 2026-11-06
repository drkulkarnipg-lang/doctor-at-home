begin;
create table public.clinic_disease_monitoring (
 id uuid primary key,
 owner_id uuid not null references auth.users(id),
 patient_code text not null check (length(patient_code) between 2 and 24 and patient_code ~ '^[A-Za-z0-9][A-Za-z0-9._-]*[0-9][A-Za-z0-9._-]*,
 record jsonb not null check (jsonb_typeof(record)='object' and pg_column_size(record)<=500000),
 revision uuid not null default gen_random_uuid(),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 archived_at timestamptz
);
create unique index clinic_disease_monitoring_active_code on public.clinic_disease_monitoring(owner_id,patient_code) where archived_at is null;
create index clinic_disease_monitoring_owner_updated on public.clinic_disease_monitoring(owner_id,updated_at desc) where archived_at is null;
alter table public.clinic_disease_monitoring enable row level security;
alter table public.clinic_disease_monitoring force row level security;
revoke all on public.clinic_disease_monitoring from anon,authenticated;
grant select,insert,update on public.clinic_disease_monitoring to authenticated;
create policy disease_monitoring_owner_select on public.clinic_disease_monitoring for select to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create policy disease_monitoring_owner_insert on public.clinic_disease_monitoring for insert to authenticated with check(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create policy disease_monitoring_owner_update on public.clinic_disease_monitoring for update to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid()))) with check(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create table public.clinic_disease_monitoring_audit (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id),
 patient_id uuid not null,
 actor_id uuid not null references auth.users(id),
 action text not null check(action in ('created','updated','archived')),
 revision uuid not null,
 snapshot jsonb not null check(jsonb_typeof(snapshot)='object' and pg_column_size(snapshot)<=500000),
 occurred_at timestamptz not null default now()
);
create index clinic_disease_monitoring_audit_patient_time on public.clinic_disease_monitoring_audit(owner_id,patient_id,occurred_at desc);
alter table public.clinic_disease_monitoring_audit enable row level security;
alter table public.clinic_disease_monitoring_audit force row level security;
revoke all on public.clinic_disease_monitoring_audit from anon,authenticated;
grant select,insert on public.clinic_disease_monitoring_audit to authenticated;
create policy disease_monitoring_audit_owner_select on public.clinic_disease_monitoring_audit for select to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create policy disease_monitoring_audit_owner_insert on public.clinic_disease_monitoring_audit for insert to authenticated with check(owner_id=(select auth.uid()) and actor_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create or replace function public.save_clinic_disease_monitoring(p_id uuid,p_expected_revision uuid,p_patient_code text,p_record jsonb)
returns setof public.clinic_disease_monitoring language plpgsql security invoker set search_path='' as $$
declare v_owner uuid:=(select auth.uid()); v_row public.clinic_disease_monitoring; v_before jsonb;
begin
 if v_owner is null or not exists(select 1 from public.clinic_members where user_id=v_owner) then raise exception 'OWNER_ACCESS_REQUIRED'; end if;
 if p_id is null or (length(p_patient_code) not between 2 and 24 or p_patient_code !~ '^[A-Za-z0-9][A-Za-z0-9._-]*[0-9][A-Za-z0-9._-]* or p_record is null or jsonb_typeof(p_record)<>'object' or pg_column_size(p_record)>450000 then raise exception 'INVALID_DISEASE_MONITORING_RECORD'; end if;
 if p_expected_revision is null then
  insert into public.clinic_disease_monitoring(id,owner_id,patient_code,record,revision,updated_at) values(p_id,v_owner,p_patient_code,p_record,pg_catalog.gen_random_uuid(),pg_catalog.now()) returning * into v_row;
  insert into public.clinic_disease_monitoring_audit(owner_id,patient_id,actor_id,action,revision,snapshot) values(v_owner,v_row.id,v_owner,'created',v_row.revision,pg_catalog.jsonb_build_object('patient_code',v_row.patient_code,'record',v_row.record));
 else
  select pg_catalog.jsonb_build_object('patient_code',patient_code,'record',record) into v_before from public.clinic_disease_monitoring where id=p_id and owner_id=v_owner and revision=p_expected_revision and archived_at is null;
  if v_before is null then raise exception 'REVISION_CONFLICT'; end if;
  update public.clinic_disease_monitoring set patient_code=p_patient_code,record=p_record,revision=pg_catalog.gen_random_uuid(),updated_at=pg_catalog.now() where id=p_id and owner_id=v_owner and revision=p_expected_revision and archived_at is null returning * into v_row;
  if v_row.id is null then raise exception 'REVISION_CONFLICT'; end if;
  insert into public.clinic_disease_monitoring_audit(owner_id,patient_id,actor_id,action,revision,snapshot) values(v_owner,v_row.id,v_owner,'updated',v_row.revision,pg_catalog.jsonb_build_object('before',v_before,'after',pg_catalog.jsonb_build_object('patient_code',v_row.patient_code,'record',v_row.record)));
 end if;
 return next v_row;
exception when unique_violation then raise exception 'PATIENT_CODE_EXISTS';
end;$;
create or replace function public.archive_clinic_disease_monitoring(p_id uuid,p_expected_revision uuid)
returns void language plpgsql security invoker set search_path='' as $$
declare v_owner uuid:=(select auth.uid()); v_row public.clinic_disease_monitoring;
begin
 if v_owner is null or not exists(select 1 from public.clinic_members where user_id=v_owner) then raise exception 'OWNER_ACCESS_REQUIRED'; end if;
 update public.clinic_disease_monitoring set archived_at=pg_catalog.now(),revision=pg_catalog.gen_random_uuid(),updated_at=pg_catalog.now() where id=p_id and owner_id=v_owner and revision=p_expected_revision and archived_at is null returning * into v_row;
 if v_row.id is null then raise exception 'REVISION_CONFLICT'; end if;
 insert into public.clinic_disease_monitoring_audit(owner_id,patient_id,actor_id,action,revision,snapshot) values(v_owner,v_row.id,v_owner,'archived',v_row.revision,pg_catalog.jsonb_build_object('patient_code',v_row.patient_code,'record',v_row.record));
end;$$;
revoke all on function public.save_clinic_disease_monitoring(uuid,uuid,text,jsonb) from public,anon;
revoke all on function public.archive_clinic_disease_monitoring(uuid,uuid) from public,anon;
grant execute on function public.save_clinic_disease_monitoring(uuid,uuid,text,jsonb) to authenticated;
grant execute on function public.archive_clinic_disease_monitoring(uuid,uuid) to authenticated;
commit;
),
 record jsonb not null check (jsonb_typeof(record)='object' and pg_column_size(record)<=500000),
 revision uuid not null default gen_random_uuid(),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 archived_at timestamptz
);
create unique index clinic_disease_monitoring_active_code on public.clinic_disease_monitoring(owner_id,patient_code) where archived_at is null;
create index clinic_disease_monitoring_owner_updated on public.clinic_disease_monitoring(owner_id,updated_at desc) where archived_at is null;
alter table public.clinic_disease_monitoring enable row level security;
alter table public.clinic_disease_monitoring force row level security;
revoke all on public.clinic_disease_monitoring from anon,authenticated;
grant select,insert,update on public.clinic_disease_monitoring to authenticated;
create policy disease_monitoring_owner_select on public.clinic_disease_monitoring for select to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create policy disease_monitoring_owner_insert on public.clinic_disease_monitoring for insert to authenticated with check(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create policy disease_monitoring_owner_update on public.clinic_disease_monitoring for update to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid()))) with check(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create table public.clinic_disease_monitoring_audit (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id),
 patient_id uuid not null,
 actor_id uuid not null references auth.users(id),
 action text not null check(action in ('created','updated','archived')),
 revision uuid not null,
 snapshot jsonb not null check(jsonb_typeof(snapshot)='object' and pg_column_size(snapshot)<=500000),
 occurred_at timestamptz not null default now()
);
create index clinic_disease_monitoring_audit_patient_time on public.clinic_disease_monitoring_audit(owner_id,patient_id,occurred_at desc);
alter table public.clinic_disease_monitoring_audit enable row level security;
alter table public.clinic_disease_monitoring_audit force row level security;
revoke all on public.clinic_disease_monitoring_audit from anon,authenticated;
grant select,insert on public.clinic_disease_monitoring_audit to authenticated;
create policy disease_monitoring_audit_owner_select on public.clinic_disease_monitoring_audit for select to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create policy disease_monitoring_audit_owner_insert on public.clinic_disease_monitoring_audit for insert to authenticated with check(owner_id=(select auth.uid()) and actor_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create or replace function public.save_clinic_disease_monitoring(p_id uuid,p_expected_revision uuid,p_patient_code text,p_record jsonb)
returns setof public.clinic_disease_monitoring language plpgsql security invoker set search_path='' as $$
declare v_owner uuid:=(select auth.uid()); v_row public.clinic_disease_monitoring; v_before jsonb;
begin
 if v_owner is null or not exists(select 1 from public.clinic_members where user_id=v_owner) then raise exception 'OWNER_ACCESS_REQUIRED'; end if;
 if p_id is null or p_patient_code !~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,23}$' or p_record is null or jsonb_typeof(p_record)<>'object' or pg_column_size(p_record)>450000 then raise exception 'INVALID_DISEASE_MONITORING_RECORD'; end if;
 if p_expected_revision is null then
  insert into public.clinic_disease_monitoring(id,owner_id,patient_code,record,revision,updated_at) values(p_id,v_owner,p_patient_code,p_record,pg_catalog.gen_random_uuid(),pg_catalog.now()) returning * into v_row;
  insert into public.clinic_disease_monitoring_audit(owner_id,patient_id,actor_id,action,revision,snapshot) values(v_owner,v_row.id,v_owner,'created',v_row.revision,pg_catalog.jsonb_build_object('patient_code',v_row.patient_code,'record',v_row.record));
 else
  select pg_catalog.jsonb_build_object('patient_code',patient_code,'record',record) into v_before from public.clinic_disease_monitoring where id=p_id and owner_id=v_owner and revision=p_expected_revision and archived_at is null;
  if v_before is null then raise exception 'REVISION_CONFLICT'; end if;
  update public.clinic_disease_monitoring set patient_code=p_patient_code,record=p_record,revision=pg_catalog.gen_random_uuid(),updated_at=pg_catalog.now() where id=p_id and owner_id=v_owner and revision=p_expected_revision and archived_at is null returning * into v_row;
  if v_row.id is null then raise exception 'REVISION_CONFLICT'; end if;
  insert into public.clinic_disease_monitoring_audit(owner_id,patient_id,actor_id,action,revision,snapshot) values(v_owner,v_row.id,v_owner,'updated',v_row.revision,pg_catalog.jsonb_build_object('before',v_before,'after',pg_catalog.jsonb_build_object('patient_code',v_row.patient_code,'record',v_row.record)));
 end if;
 return next v_row;
exception when unique_violation then raise exception 'PATIENT_CODE_EXISTS';
end;$;
create or replace function public.archive_clinic_disease_monitoring(p_id uuid,p_expected_revision uuid)
returns void language plpgsql security invoker set search_path='' as $$
declare v_owner uuid:=(select auth.uid()); v_row public.clinic_disease_monitoring;
begin
 if v_owner is null or not exists(select 1 from public.clinic_members where user_id=v_owner) then raise exception 'OWNER_ACCESS_REQUIRED'; end if;
 update public.clinic_disease_monitoring set archived_at=pg_catalog.now(),revision=pg_catalog.gen_random_uuid(),updated_at=pg_catalog.now() where id=p_id and owner_id=v_owner and revision=p_expected_revision and archived_at is null returning * into v_row;
 if v_row.id is null then raise exception 'REVISION_CONFLICT'; end if;
 insert into public.clinic_disease_monitoring_audit(owner_id,patient_id,actor_id,action,revision,snapshot) values(v_owner,v_row.id,v_owner,'archived',v_row.revision,pg_catalog.jsonb_build_object('patient_code',v_row.patient_code,'record',v_row.record));
end;$$;
revoke all on function public.save_clinic_disease_monitoring(uuid,uuid,text,jsonb) from public,anon;
revoke all on function public.archive_clinic_disease_monitoring(uuid,uuid) from public,anon;
grant execute on function public.save_clinic_disease_monitoring(uuid,uuid,text,jsonb) to authenticated;
grant execute on function public.archive_clinic_disease_monitoring(uuid,uuid) to authenticated;
commit;
) or p_record is null or jsonb_typeof(p_record)<>'object' or pg_column_size(p_record)>450000 then raise exception 'INVALID_DISEASE_MONITORING_RECORD'; end if;
 if p_expected_revision is null then
  insert into public.clinic_disease_monitoring(id,owner_id,patient_code,record,revision,updated_at) values(p_id,v_owner,p_patient_code,p_record,pg_catalog.gen_random_uuid(),pg_catalog.now()) returning * into v_row;
  insert into public.clinic_disease_monitoring_audit(owner_id,patient_id,actor_id,action,revision,snapshot) values(v_owner,v_row.id,v_owner,'created',v_row.revision,pg_catalog.jsonb_build_object('patient_code',v_row.patient_code,'record',v_row.record));
 else
  select pg_catalog.jsonb_build_object('patient_code',patient_code,'record',record) into v_before from public.clinic_disease_monitoring where id=p_id and owner_id=v_owner and revision=p_expected_revision and archived_at is null;
  if v_before is null then raise exception 'REVISION_CONFLICT'; end if;
  update public.clinic_disease_monitoring set patient_code=p_patient_code,record=p_record,revision=pg_catalog.gen_random_uuid(),updated_at=pg_catalog.now() where id=p_id and owner_id=v_owner and revision=p_expected_revision and archived_at is null returning * into v_row;
  if v_row.id is null then raise exception 'REVISION_CONFLICT'; end if;
  insert into public.clinic_disease_monitoring_audit(owner_id,patient_id,actor_id,action,revision,snapshot) values(v_owner,v_row.id,v_owner,'updated',v_row.revision,pg_catalog.jsonb_build_object('before',v_before,'after',pg_catalog.jsonb_build_object('patient_code',v_row.patient_code,'record',v_row.record)));
 end if;
 return next v_row;
exception when unique_violation then raise exception 'PATIENT_CODE_EXISTS';
end;$;
create or replace function public.archive_clinic_disease_monitoring(p_id uuid,p_expected_revision uuid)
returns void language plpgsql security invoker set search_path='' as $$
declare v_owner uuid:=(select auth.uid()); v_row public.clinic_disease_monitoring;
begin
 if v_owner is null or not exists(select 1 from public.clinic_members where user_id=v_owner) then raise exception 'OWNER_ACCESS_REQUIRED'; end if;
 update public.clinic_disease_monitoring set archived_at=pg_catalog.now(),revision=pg_catalog.gen_random_uuid(),updated_at=pg_catalog.now() where id=p_id and owner_id=v_owner and revision=p_expected_revision and archived_at is null returning * into v_row;
 if v_row.id is null then raise exception 'REVISION_CONFLICT'; end if;
 insert into public.clinic_disease_monitoring_audit(owner_id,patient_id,actor_id,action,revision,snapshot) values(v_owner,v_row.id,v_owner,'archived',v_row.revision,pg_catalog.jsonb_build_object('patient_code',v_row.patient_code,'record',v_row.record));
end;$$;
revoke all on function public.save_clinic_disease_monitoring(uuid,uuid,text,jsonb) from public,anon;
revoke all on function public.archive_clinic_disease_monitoring(uuid,uuid) from public,anon;
grant execute on function public.save_clinic_disease_monitoring(uuid,uuid,text,jsonb) to authenticated;
grant execute on function public.archive_clinic_disease_monitoring(uuid,uuid) to authenticated;
commit;
),
 record jsonb not null check (jsonb_typeof(record)='object' and pg_column_size(record)<=500000),
 revision uuid not null default gen_random_uuid(),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 archived_at timestamptz
);
create unique index clinic_disease_monitoring_active_code on public.clinic_disease_monitoring(owner_id,patient_code) where archived_at is null;
create index clinic_disease_monitoring_owner_updated on public.clinic_disease_monitoring(owner_id,updated_at desc) where archived_at is null;
alter table public.clinic_disease_monitoring enable row level security;
alter table public.clinic_disease_monitoring force row level security;
revoke all on public.clinic_disease_monitoring from anon,authenticated;
grant select,insert,update on public.clinic_disease_monitoring to authenticated;
create policy disease_monitoring_owner_select on public.clinic_disease_monitoring for select to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create policy disease_monitoring_owner_insert on public.clinic_disease_monitoring for insert to authenticated with check(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create policy disease_monitoring_owner_update on public.clinic_disease_monitoring for update to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid()))) with check(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create table public.clinic_disease_monitoring_audit (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id),
 patient_id uuid not null,
 actor_id uuid not null references auth.users(id),
 action text not null check(action in ('created','updated','archived')),
 revision uuid not null,
 snapshot jsonb not null check(jsonb_typeof(snapshot)='object' and pg_column_size(snapshot)<=500000),
 occurred_at timestamptz not null default now()
);
create index clinic_disease_monitoring_audit_patient_time on public.clinic_disease_monitoring_audit(owner_id,patient_id,occurred_at desc);
alter table public.clinic_disease_monitoring_audit enable row level security;
alter table public.clinic_disease_monitoring_audit force row level security;
revoke all on public.clinic_disease_monitoring_audit from anon,authenticated;
grant select,insert on public.clinic_disease_monitoring_audit to authenticated;
create policy disease_monitoring_audit_owner_select on public.clinic_disease_monitoring_audit for select to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create policy disease_monitoring_audit_owner_insert on public.clinic_disease_monitoring_audit for insert to authenticated with check(owner_id=(select auth.uid()) and actor_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create or replace function public.save_clinic_disease_monitoring(p_id uuid,p_expected_revision uuid,p_patient_code text,p_record jsonb)
returns setof public.clinic_disease_monitoring language plpgsql security invoker set search_path='' as $$
declare v_owner uuid:=(select auth.uid()); v_row public.clinic_disease_monitoring; v_before jsonb;
begin
 if v_owner is null or not exists(select 1 from public.clinic_members where user_id=v_owner) then raise exception 'OWNER_ACCESS_REQUIRED'; end if;
 if p_id is null or p_patient_code !~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,23}$' or p_record is null or jsonb_typeof(p_record)<>'object' or pg_column_size(p_record)>450000 then raise exception 'INVALID_DISEASE_MONITORING_RECORD'; end if;
 if p_expected_revision is null then
  insert into public.clinic_disease_monitoring(id,owner_id,patient_code,record,revision,updated_at) values(p_id,v_owner,p_patient_code,p_record,pg_catalog.gen_random_uuid(),pg_catalog.now()) returning * into v_row;
  insert into public.clinic_disease_monitoring_audit(owner_id,patient_id,actor_id,action,revision,snapshot) values(v_owner,v_row.id,v_owner,'created',v_row.revision,pg_catalog.jsonb_build_object('patient_code',v_row.patient_code,'record',v_row.record));
 else
  select pg_catalog.jsonb_build_object('patient_code',patient_code,'record',record) into v_before from public.clinic_disease_monitoring where id=p_id and owner_id=v_owner and revision=p_expected_revision and archived_at is null;
  if v_before is null then raise exception 'REVISION_CONFLICT'; end if;
  update public.clinic_disease_monitoring set patient_code=p_patient_code,record=p_record,revision=pg_catalog.gen_random_uuid(),updated_at=pg_catalog.now() where id=p_id and owner_id=v_owner and revision=p_expected_revision and archived_at is null returning * into v_row;
  if v_row.id is null then raise exception 'REVISION_CONFLICT'; end if;
  insert into public.clinic_disease_monitoring_audit(owner_id,patient_id,actor_id,action,revision,snapshot) values(v_owner,v_row.id,v_owner,'updated',v_row.revision,pg_catalog.jsonb_build_object('before',v_before,'after',pg_catalog.jsonb_build_object('patient_code',v_row.patient_code,'record',v_row.record)));
 end if;
 return next v_row;
exception when unique_violation then raise exception 'PATIENT_CODE_EXISTS';
end;$;
create or replace function public.archive_clinic_disease_monitoring(p_id uuid,p_expected_revision uuid)
returns void language plpgsql security invoker set search_path='' as $$
declare v_owner uuid:=(select auth.uid()); v_row public.clinic_disease_monitoring;
begin
 if v_owner is null or not exists(select 1 from public.clinic_members where user_id=v_owner) then raise exception 'OWNER_ACCESS_REQUIRED'; end if;
 update public.clinic_disease_monitoring set archived_at=pg_catalog.now(),revision=pg_catalog.gen_random_uuid(),updated_at=pg_catalog.now() where id=p_id and owner_id=v_owner and revision=p_expected_revision and archived_at is null returning * into v_row;
 if v_row.id is null then raise exception 'REVISION_CONFLICT'; end if;
 insert into public.clinic_disease_monitoring_audit(owner_id,patient_id,actor_id,action,revision,snapshot) values(v_owner,v_row.id,v_owner,'archived',v_row.revision,pg_catalog.jsonb_build_object('patient_code',v_row.patient_code,'record',v_row.record));
end;$$;
revoke all on function public.save_clinic_disease_monitoring(uuid,uuid,text,jsonb) from public,anon;
revoke all on function public.archive_clinic_disease_monitoring(uuid,uuid) from public,anon;
grant execute on function public.save_clinic_disease_monitoring(uuid,uuid,text,jsonb) to authenticated;
grant execute on function public.archive_clinic_disease_monitoring(uuid,uuid) to authenticated;
commit;
