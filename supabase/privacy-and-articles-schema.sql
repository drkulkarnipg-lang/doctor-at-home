begin;
alter table public.clinic_patient_trends add column if not exists cloud_consent jsonb;
alter table public.clinic_patient_trends add constraint clinic_consent_shape check(cloud_consent is null or (jsonb_typeof(cloud_consent)='object' and cloud_consent->>'status'='granted' and cloud_consent->>'purpose'='private-cloud-trend-storage'));
grant delete on public.clinic_patient_trends to authenticated;
create policy owner_deletes on public.clinic_patient_trends for delete to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create table public.clinic_privacy_events (
 id uuid primary key default gen_random_uuid(),owner_id uuid not null,patient_id text not null,
 event text not null check(event in ('cloud_created','permission_updated','cloud_deleted')),
 notice_version text,permission_method text,occurred_at timestamptz not null default now()
);
create index clinic_privacy_events_owner on public.clinic_privacy_events(owner_id,occurred_at desc);
alter table public.clinic_privacy_events enable row level security;
revoke all on public.clinic_privacy_events from public,anon,authenticated;
grant select on public.clinic_privacy_events to authenticated;
create policy privacy_events_owner on public.clinic_privacy_events for select to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create schema if not exists clinic_private;
create function clinic_private.log_trend_privacy() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if TG_OP='DELETE' then insert into public.clinic_privacy_events(owner_id,patient_id,event,notice_version,permission_method) values(old.owner_id,old.id,'cloud_deleted',old.cloud_consent->>'noticeVersion',old.cloud_consent->>'method');return old;
 elsif TG_OP='INSERT' then insert into public.clinic_privacy_events(owner_id,patient_id,event,notice_version,permission_method) values(new.owner_id,new.id,'cloud_created',new.cloud_consent->>'noticeVersion',new.cloud_consent->>'method');
 elsif old.cloud_consent is distinct from new.cloud_consent then insert into public.clinic_privacy_events(owner_id,patient_id,event,notice_version,permission_method) values(new.owner_id,new.id,'permission_updated',new.cloud_consent->>'noticeVersion',new.cloud_consent->>'method');end if;return new;
end;$$;
revoke all on function clinic_private.log_trend_privacy() from public,anon,authenticated;
create trigger trend_privacy_events after insert or update or delete on public.clinic_patient_trends for each row execute function clinic_private.log_trend_privacy();
create table public.site_articles (
 slug text primary key check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) between 3 and 100),
 owner_id uuid not null references auth.users(id),
 title text not null check(length(title) between 3 and 200),
 description text not null check(length(description) between 20 and 300),
 body text not null check(length(body) between 100 and 60000),
 language text not null check(language in ('en','mr','hi')),
 translation_group text not null check(length(translation_group) between 3 and 100),
 sources jsonb not null default '[]' check(jsonb_typeof(sources)='array' and jsonb_array_length(sources) between 1 and 30),
 status text not null default 'draft' check(status in ('draft','published')),
 revision uuid not null default gen_random_uuid(),
 reviewed_by text,reviewed_at timestamptz,published_at timestamptz,updated_at timestamptz not null default now(),
 check(status<>'published' or (reviewed_by='Dr. Pramod G. Kulkarni' and reviewed_at is not null and published_at is not null))
);
create index site_articles_owner on public.site_articles(owner_id,updated_at desc);
create unique index site_article_language_version on public.site_articles(translation_group,language) where status='published';
create index site_articles_public on public.site_articles(status,published_at desc);
alter table public.site_articles enable row level security;
revoke all on public.site_articles from public,anon,authenticated;
grant select on public.site_articles to anon,authenticated;
grant insert,update on public.site_articles to authenticated;
create policy articles_public_read on public.site_articles for select to anon,authenticated using(status='published');
create policy articles_owner_read on public.site_articles for select to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create policy articles_owner_create on public.site_articles for insert to authenticated with check(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
create policy articles_owner_update on public.site_articles for update to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid()))) with check(owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
commit;
-- No existing names are changed and no article is published by this schema change.
