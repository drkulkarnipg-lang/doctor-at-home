begin;
create schema if not exists clinic_private;
revoke all on schema clinic_private from public;
create table clinic_private.research_agent_config (
 singleton boolean primary key default true check(singleton),
 owner_id uuid not null references auth.users(id),
 secret_hash text not null check(length(secret_hash)=64)
);
revoke all on clinic_private.research_agent_config from public,anon,authenticated;
create table public.clinic_research_runs (
 day date primary key,
 id uuid not null unique default gen_random_uuid(),
 owner_id uuid not null references auth.users(id),
 state text not null default 'running' check(state in ('running','completed','partial','needs_setup','failed')),
 sources jsonb not null default '[]',
 processed integer not null default 0 check(processed between 0 and 6),
 message text not null default '',
 attempts integer not null default 1 check(attempts between 1 and 3),
 attempt_history jsonb not null default '[]',
 started_at timestamptz not null default now(),
 finished_at timestamptz
);
create index clinic_research_runs_owner on public.clinic_research_runs(owner_id,day desc);
alter table public.clinic_research_runs enable row level security;
revoke all on public.clinic_research_runs from public,anon,authenticated;
grant select on public.clinic_research_runs to authenticated;
create policy research_runs_owner on public.clinic_research_runs for select to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create table public.clinic_research_items (
 id text primary key check(length(id)=64),
 owner_id uuid not null references auth.users(id),
 run_id uuid not null references public.clinic_research_runs(id),
 title text not null check(length(title) between 1 and 800),
 url text not null unique check(url like 'https://%' and length(url)<=2000),
 source text not null check(length(source)<=200),
 published text not null default '',
 content_scope text not null default 'rss_excerpt' check(content_scope='rss_excerpt'),
 excerpt text not null check(length(excerpt)<=5000),
 draft jsonb not null default '{}' check(jsonb_typeof(draft)='object'),
 ai_status text not null check(ai_status in ('ready','needs_source','needs_setup','error')),
 model text not null default '',
 review_notes text not null default '' check(length(review_notes)<=12000),
 created_at timestamptz not null default now()
);
create index clinic_research_items_owner on public.clinic_research_items(owner_id,created_at desc);
create index clinic_research_items_run on public.clinic_research_items(run_id);
alter table public.clinic_research_items enable row level security;
revoke all on public.clinic_research_items from public,anon,authenticated;
grant select on public.clinic_research_items to authenticated;
grant update(review_notes) on public.clinic_research_items to authenticated;
create policy research_items_owner_read on public.clinic_research_items for select to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create policy research_items_owner_notes on public.clinic_research_items for update to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid()))) with check(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
-- A separate job credential can ONLY append bounded research drafts and run reports.
-- It grants no access to patient tables, auth data or general SQL.
create function clinic_private.research_job(p_secret text,p_action text,p_payload jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare cfg clinic_private.research_agent_config%rowtype; r public.clinic_research_runs%rowtype; item jsonb; today date := (now() at time zone 'Asia/Kolkata')::date;
begin
 select * into cfg from clinic_private.research_agent_config where singleton;
 if cfg.owner_id is null or p_secret is null or length(p_secret)>200 or cfg.secret_hash<>encode(extensions.digest(p_secret,'sha256'),'hex') then raise exception 'Job access denied' using errcode='42501'; end if;
 if octet_length(p_payload::text)>150000 then raise exception 'Payload too large'; end if;
 if p_action='claim' then
  insert into public.clinic_research_runs(day,owner_id) values(today,cfg.owner_id) on conflict do nothing returning * into r;
  if r.id is null then
   select * into r from public.clinic_research_runs where day=today for update;
   if r.state='needs_setup' and r.processed=0 and r.attempts<3 then
    update public.clinic_research_runs set attempt_history=attempt_history||jsonb_build_array(jsonb_build_object('state',state,'message',message,'sources',sources,'started_at',started_at,'finished_at',finished_at)),attempts=attempts+1,state='running',started_at=now(),finished_at=null,message='',sources='[]' where id=r.id returning * into r;
   else return jsonb_build_object('claimed',false,'state',r.state,'runId',r.id); end if;
  end if;
  return jsonb_build_object('claimed',true,'runId',r.id,'day',today);
 elsif p_action='seen' then
  return (select coalesce(jsonb_agg(url),'[]') from public.clinic_research_items where url in (select jsonb_array_elements_text(p_payload->'urls')));
 end if;
 select * into r from public.clinic_research_runs where id=(p_payload->>'runId')::uuid and day=today and state='running' for update;
 if r.id is null then raise exception 'No active run'; end if;
 if p_action='store' then
  item:=p_payload->'item';
  if (select count(*) from public.clinic_research_items where run_id=r.id)>=6 then raise exception 'Daily draft limit reached'; end if;
  insert into public.clinic_research_items(id,owner_id,run_id,title,url,source,published,excerpt,draft,ai_status,model)
  values(encode(extensions.digest(item->>'url','sha256'),'hex'),cfg.owner_id,r.id,item->>'title',item->>'url',item->>'source',left(coalesce(item->>'published',''),80),item->>'excerpt',item->'draft',item->>'aiStatus',left(coalesce(item->>'model',''),100)) on conflict(url) do nothing;
  return jsonb_build_object('stored',true);
 elsif p_action='finish' then
  update public.clinic_research_runs set state=p_payload->>'state',sources=p_payload->'sources',processed=(select count(*) from public.clinic_research_items where run_id=r.id),message=left(coalesce(p_payload->>'message',''),500),finished_at=now() where id=r.id;
  return jsonb_build_object('finished',true);
 else raise exception 'Unsupported job operation'; end if;
end; $$;
revoke all on function clinic_private.research_job(text,text,jsonb) from public;
grant usage on schema clinic_private to anon,authenticated;
grant execute on function clinic_private.research_job(text,text,jsonb) to anon,authenticated;
create function public.clinic_research_job(p_secret text,p_action text,p_payload jsonb default '{}') returns jsonb language sql security invoker set search_path='' as $$select clinic_private.research_job(p_secret,p_action,p_payload);$$;
revoke all on function public.clinic_research_job(text,text,jsonb) from public;
grant execute on function public.clinic_research_job(text,text,jsonb) to anon,authenticated;
commit;
