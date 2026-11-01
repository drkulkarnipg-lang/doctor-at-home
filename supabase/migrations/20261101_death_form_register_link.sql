begin;
alter table public.clinic_workstation_registers
  add column if not exists source_form_key text;
create unique index if not exists clinic_workstation_registers_owner_source_form_key
  on public.clinic_workstation_registers(owner_id, source_form_key)
  where source_form_key is not null;
commit;
