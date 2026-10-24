begin;
-- Dedicated research-only tables. No changes to patient rows or patient permissions.
create table public.clinic_evidence_runs (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id),
 day date not null, state text not null default 'running' check(state in ('running','done','needs_setup','budget_exhausted')),
 payload jsonb not null default '{"version":1,"stage":"discover","candidates":[],"decisions":[],"screenOffset":0,"items":[],"sourceReport":[]}',
 revision uuid not null default gen_random_uuid(), calls integer not null default 0 check(calls between 0 and 24),
 reserved_tokens integer not null default 0 check(reserved_tokens between 0 and 160000),
 lease uuid, lease_until timestamptz, message text not null default '', updated_at timestamptz not null default now(),
 unique(owner_id,day), check(jsonb_typeof(payload)='object' and octet_length(payload::text)<=500000)
);
create table clinic_private.evidence_requests(id text primary key, run_id uuid not null references public.clinic_evidence_runs(id),created_at timestamptz not null default now());
alter table clinic_private.evidence_requests enable row level security;
revoke all on clinic_private.evidence_requests from public,anon,authenticated;
alter table public.clinic_evidence_runs enable row level security;
revoke all on public.clinic_evidence_runs from public,anon,authenticated;
grant select on public.clinic_evidence_runs to authenticated;
create policy evidence_runs_owner on public.clinic_evidence_runs for select to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create table public.clinic_evidence_decisions (
 id uuid primary key default gen_random_uuid(),run_id uuid not null references public.clinic_evidence_runs(id),
 item_id text not null check(length(item_id)=64),package_hash text not null check(length(package_hash)=64),
 owner_id uuid not null references auth.users(id),decision text not null check(decision in ('approve_content','reject','changes_requested')),
 notes text not null default '' check(length(notes)<=4000),created_at timestamptz not null default now()
);
create index evidence_decisions_owner on public.clinic_evidence_decisions(owner_id,created_at desc);
alter table public.clinic_evidence_decisions enable row level security;
revoke all on public.clinic_evidence_decisions from public,anon,authenticated;
grant select on public.clinic_evidence_decisions to authenticated;
create policy evidence_decisions_owner on public.clinic_evidence_decisions for select to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create function clinic_private.evidence_job(p_secret text,p_action text,p_data jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare cfg clinic_private.research_agent_config%rowtype; r public.clinic_evidence_runs%rowtype; today date:=(now() at time zone 'Asia/Kolkata')::date; issued uuid; amount integer;
begin
 select * into cfg from clinic_private.research_agent_config where singleton;
 if cfg.owner_id is null or p_secret is null or length(p_secret)>200 or cfg.secret_hash<>encode(extensions.digest(p_secret,'sha256'),'hex') then raise exception 'Job denied' using errcode='42501';end if;
 if p_data is null or octet_length(p_data::text)>510000 then raise exception 'Invalid request';end if;
 if p_action='seen' then
  return (select coalesce(jsonb_agg(distinct c->>'key'),'[]') from public.clinic_evidence_runs x cross join lateral jsonb_array_elements(x.payload->'candidates') c where x.owner_id=cfg.owner_id and x.day>today-30 and x.day<today and c->>'key' in(select jsonb_array_elements_text(p_data->'keys')));
 end if;
 if p_action='claim' then
  if coalesce(p_data->>'requestId','')!~'^[A-Za-z0-9:_-]{8,160}$' then raise exception 'Invalid request ID';end if;
  insert into public.clinic_evidence_runs(owner_id,day) values(cfg.owner_id,today) on conflict do nothing;
  select * into r from public.clinic_evidence_runs where owner_id=cfg.owner_id and day=today for update;
  if r.state in ('done','budget_exhausted') then return jsonb_build_object('claimed',false,'state',r.state,'runId',r.id);end if;
  if r.lease_until>now() then return jsonb_build_object('claimed',false,'state','busy','runId',r.id);end if;
  insert into clinic_private.evidence_requests(id,run_id) values(p_data->>'requestId',r.id) on conflict do nothing;
  if not found then return jsonb_build_object('claimed',false,'state','replayed','runId',r.id);end if;
  issued:=gen_random_uuid();update public.clinic_evidence_runs set lease=issued,lease_until=now()+interval '4 minutes',state='running',updated_at=now() where id=r.id returning * into r;
  return jsonb_build_object('claimed',true,'run',to_jsonb(r));
 end if;
 select * into r from public.clinic_evidence_runs where id=(p_data->>'runId')::uuid and owner_id=cfg.owner_id and lease=(p_data->>'lease')::uuid and lease_until>now() and state='running' for update;
 if r.id is null then raise exception 'Lease expired or superseded' using errcode='40001';end if;
 if p_action='reserve' then
  amount:=(p_data->>'tokens')::integer;
  if amount<1 or amount>65000 or r.calls>=24 or r.reserved_tokens+amount>160000 then return jsonb_build_object('allowed',false);end if;
  update public.clinic_evidence_runs set calls=calls+1,reserved_tokens=reserved_tokens+amount where id=r.id;
  return jsonb_build_object('allowed',true);
 elsif p_action='save' then
  if r.revision<>(p_data->>'revision')::uuid then raise exception 'Revision changed' using errcode='40001';end if;
  if p_data->>'state' not in ('running','done','needs_setup','budget_exhausted') or jsonb_typeof(p_data->'payload')<>'object' then raise exception 'Invalid state';end if;
  update public.clinic_evidence_runs set payload=p_data->'payload',state=p_data->>'state',message=left(coalesce(p_data->>'message',''),500),revision=gen_random_uuid(),lease=null,lease_until=null,updated_at=now() where id=r.id returning * into r;
  return jsonb_build_object('saved',true,'state',r.state,'runId',r.id);
 else raise exception 'Unsupported action';end if;
end;$$;
revoke all on function clinic_private.evidence_job(text,text,jsonb) from public;
grant execute on function clinic_private.evidence_job(text,text,jsonb) to anon,authenticated;
create function public.clinic_evidence_job(p_secret text,p_action text,p_data jsonb default '{}') returns jsonb language sql security invoker set search_path='' as $$select clinic_private.evidence_job(p_secret,p_action,p_data);$$;
revoke all on function public.clinic_evidence_job(text,text,jsonb) from public;
grant execute on function public.clinic_evidence_job(text,text,jsonb) to anon,authenticated;
create function clinic_private.evidence_decide(p_run uuid,p_revision uuid,p_item text,p_hash text,p_decision text,p_notes text) returns jsonb language plpgsql security definer set search_path='' as $$
declare r public.clinic_evidence_runs%rowtype; actor uuid:=(select auth.uid()); item jsonb;
begin
 if actor is null or not exists(select 1 from public.clinic_members where user_id=actor) then raise exception 'Owner required' using errcode='42501';end if;
 select * into r from public.clinic_evidence_runs where id=p_run and owner_id=actor for update;
 if r.id is null then raise exception 'Owner required' using errcode='42501';end if;
 if r.revision<>p_revision or r.state<>'done' then raise exception 'Refresh latest completed package' using errcode='40001';end if;
 select x into item from jsonb_array_elements(r.payload->'items') x where x->'candidate'->>'id'=p_item;
 if item is null or item->>'stage'<>'awaiting_physician' or item->>'packageHash' is distinct from p_hash then raise exception 'Exact reviewed package required';end if;
 insert into public.clinic_evidence_decisions(run_id,item_id,package_hash,owner_id,decision,notes) values(p_run,p_item,p_hash,actor,p_decision,coalesce(p_notes,''));
 return jsonb_build_object('recorded',true,'published',false);
end;$$;
revoke all on function clinic_private.evidence_decide(uuid,uuid,text,text,text,text) from public;
grant execute on function clinic_private.evidence_decide(uuid,uuid,text,text,text,text) to authenticated;
create function public.clinic_evidence_decide(p_run uuid,p_revision uuid,p_item text,p_hash text,p_decision text,p_notes text default '') returns jsonb language sql security invoker set search_path='' as $$select clinic_private.evidence_decide(p_run,p_revision,p_item,p_hash,p_decision,p_notes);$$;
revoke all on function public.clinic_evidence_decide(uuid,uuid,text,text,text,text) from public;
grant execute on function public.clinic_evidence_decide(uuid,uuid,text,text,text,text) to authenticated;
commit;
