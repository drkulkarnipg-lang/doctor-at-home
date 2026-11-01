-- Private, owner-only clinical document vault.
-- Applied to project xqhhxnehrjkpyffdvxdm via Supabase migration tooling.
begin;
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('clinic-document-vault','clinic-document-vault',false,10485760,
array['application/pdf','image/png','image/jpeg','text/plain','application/json'])
on conflict (id) do update set public=false,file_size_limit=10485760,allowed_mime_types=excluded.allowed_mime_types;
create table if not exists public.clinic_documents (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id),
 title text not null check (length(title) between 1 and 240),
 document_type text not null check (document_type in ('prescription','lab_requisition','radiology_requisition','referral','fitness','unfitness','consent','invoice','death_form','patient_attachment','clinical_note','article_draft','other')),
 mime_type text not null check (mime_type in ('application/pdf','image/png','image/jpeg','text/plain','application/json')),
 byte_size bigint not null check (byte_size between 1 and 10485760),
 storage_path text not null unique,
 sha256 text not null check (sha256 ~ '^[a-f0-9]{64}$'),
 source_ref text not null default '',
 metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata)='object' and pg_column_size(metadata)<=8000),
 created_at timestamptz not null default now()
);
create index if not exists clinic_documents_owner_created on public.clinic_documents(owner_id,created_at desc);
alter table public.clinic_documents enable row level security;
alter table public.clinic_documents force row level security;
revoke all on public.clinic_documents from anon,authenticated;
grant select,insert on public.clinic_documents to authenticated;
drop policy if exists clinic_documents_owner_select on public.clinic_documents;
create policy clinic_documents_owner_select on public.clinic_documents for select to authenticated
using (owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
drop policy if exists clinic_documents_owner_insert on public.clinic_documents;
create policy clinic_documents_owner_insert on public.clinic_documents for insert to authenticated
with check (owner_id=(select auth.uid()) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
drop policy if exists clinic_documents_storage_insert on storage.objects;
create policy clinic_documents_storage_insert on storage.objects for insert to authenticated
with check (bucket_id='clinic-document-vault' and (storage.foldername(name))[1]=(select auth.uid()::text) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
drop policy if exists clinic_documents_storage_select on storage.objects;
create policy clinic_documents_storage_select on storage.objects for select to authenticated
using (bucket_id='clinic-document-vault' and owner_id=(select auth.uid()::text) and exists(select 1 from public.clinic_members where user_id=(select auth.uid())));
commit;
