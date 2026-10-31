-- Idempotent source linkage for automatically generated practice-register rows.
begin;
alter table public.clinic_workstation_registers add column if not exists source_event_id text;
create unique index if not exists clinic_workstation_registers_source_event_unique
on public.clinic_workstation_registers(owner_id, register_type, source_event_id)
where source_event_id is not null;
commit;
