begin;
create table if not exists public.consultation_payments (
 booking_reference uuid primary key,
 provider text not null check(provider='razorpay'),
 order_id text not null unique,
 payment_id text unique,
 amount_paise integer not null check(amount_paise=50000),
 currency text not null check(currency='INR'),
 status text not null check(status in ('created','authorized','captured','failed','refunded')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.consultation_payment_webhook_events (
 event_id text primary key,
 event_type text not null,
 order_id text,
 payment_id text,
 received_at timestamptz not null default now()
);
alter table public.consultation_payments enable row level security;
alter table public.consultation_payment_webhook_events enable row level security;
revoke all on public.consultation_payments from public,anon,authenticated;
revoke all on public.consultation_payment_webhook_events from public,anon,authenticated;
comment on table public.consultation_payments is 'Minimal payment reconciliation only; no patient symptoms, diagnoses, reports or other clinical data.';
comment on table public.consultation_payment_webhook_events is 'Idempotency/audit record for verified Razorpay webhook event IDs; server-side service role only.';
commit;
