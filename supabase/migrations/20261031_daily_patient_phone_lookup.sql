-- Efficient owner-scoped lookup for returning patients entered through the prescription pad.
-- Apply only after 20261030_workstation_registers.sql has been reviewed and applied.
begin;
create index if not exists clinic_workstation_registers_daily_phone_lookup
  on public.clinic_workstation_registers(owner_id, (data->>'phone'), entry_date desc, created_at desc)
  where register_type='daily' and coalesce(data->>'phone','')<>'';
commit;
