# Razorpay consultation gateway — setup and release gate

Status: implementation scaffold saved on the review branch. **Not active for live payments.**

## Implemented in source
- Consultation-specific checkout in the public online-consultation notice, only enabled after the visitor acknowledges the doctor has confirmed the appointment.
- Server-created Razorpay order fixed to INR 500 (50,000 paise); no amount comes from the browser.
- Server-side checkout-signature validation plus a Razorpay payment API lookup; only a matching captured payment updates the private ledger to `captured`.
- HMAC-verified raw-body webhook endpoint at `/api/razorpay-webhook` for `payment.captured`, `payment.failed` and `refund.processed`; it reads the raw request stream with a 1 MiB limit, acknowledges already-recorded event IDs, and distinguishes partial from full refunds.
- Private ledger/event tables in `supabase/migrations/20261031_consultation_payments.sql`.
- Focused regression test in `tests/razorpay-gateway.test.cjs`.

## Required configuration — do not put values in Git or chat
Configure these as server-only environment variables in the Vercel **Preview** environment first:
- `RAZORPAY_KEY_ID` — test key ID
- `RAZORPAY_KEY_SECRET` — test secret
- `RAZORPAY_WEBHOOK_SECRET` — webhook signing secret configured in the Razorpay dashboard
- `SUPABASE_URL` — project URL
- `SUPABASE_SERVICE_ROLE_KEY` — server-only service-role key; never expose to browser code

Apply the SQL migration to the intended Supabase preview project after reviewing its permissions. Do not apply it to production automatically. Set the Razorpay webhook URL to `https://<preview-host>/api/razorpay-webhook` and subscribe to the supported captured, failed and refund-processed events. Use the same webhook secret in the server environment.

## Test gate before production
1. Verify checkout creates only an INR 500 order and a minimal ledger row with no clinical/patient history.
2. Test success, user cancellation, failure, network timeout, browser close before callback, repeated order requests, repeated webhooks, streamed raw webhook bodies, duplicate event IDs, delayed/out-of-order events, partial refunds and full refunds.
3. Verify invalid checkout signatures and invalid webhook signatures are rejected; wrong amount/currency/order never marks the ledger captured.
4. Confirm only provider-verified captured payments are marked captured; refund events cannot be represented as settlement or consultation completion.
5. Check authorized database access, migration, logs and failure handling. No secrets or patient data in logs.
6. Confirm merchant KYC/service category, settlement account, fees/refund terms and applicable professional rules. Test mode first.
7. Verify the preview on desktop/mobile. The latest code-level regression suite passed 60 files in GitHub Actions run 41177912280; this is synthetic test evidence only. Production keys and a controlled real transaction require a separate explicit launch approval.

## Scope limitations
- This gateway is for the fixed ₹500 online consultation only. It does not collect variable home-visit fees because those calculations currently originate in the browser and have not been independently validated server-side.
- The acknowledgement checkbox is a user-side guard against accidental payment, not a secure appointment-management system. The clinic still separately confirms appointment suitability and scheduling.
- A captured payment is not proof of bank settlement, consultation completion or appointment confirmation.
- UPI QR/manual transfer remains separate. Do not disable it or publish private bank account details.
- Razorpay checkout/API credentials are not configured or verified by this code change. Until configuration and end-to-end tests pass, the site must not claim live gateway availability.