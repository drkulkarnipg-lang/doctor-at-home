# Planned follow-on: telemedicine and verified consultation payments
Date: 24 October 2026 (Asia/Kolkata)
Status: user suggestion captured for AFTER evidence-agent orchestration; no payment service activated, no live consultation booking/payment code added.
Proposed fee: INR 500 per online consultation, based on the doctor's stated preference. This is not a claim about market rates, consultation duration, taxes, follow-up inclusions or net receipts. Define duration, report review scope, included follow-up, cancellation/no-show/rescheduling and refund terms before launch.

## Clinical service
Add a distinct Online consultation entry to the Patient Portal using the existing pre-visit intake: symptoms/duration/relief, medicines, allergies, illnesses and reports. Record patient identity/age, caregiver authority where applicable, location for emergency escalation, consent and choice of suitable consultation medium. Doctor determines remote suitability and whether in-person/emergency care is needed; no paid booking queue should delay urgent care.
Display verified professional identity and registration. BAMS/Indian Medicine registration must be checked against the currently applicable ASU/NCISM/state rules, training requirements and permitted prescribing scope; generic NMC telemedicine guidance must not be treated as automatic authorisation for allopathic online prescribing or worldwide treatment.
AI may organise submitted information for doctor review; it does not independently diagnose, prescribe or replace the consultation.
Provide a private appointment-specific video link using a suitable provider with evaluated privacy/access settings; do not claim existing embedded calling. No recording by default.
Doctor-reviewed consultation record, prescription where legally appropriate, follow-up advice and separate payment receipt can be exported as complete PDFs. A website label or typed name is not automatically a legally valid digital signature.

## Patient journey
Suitability screening -> appointment availability/temporary slot hold -> pre-visit information and consent -> displayed INR 500 and policy -> gateway checkout -> verified payment -> confirmed appointment/private join instructions -> doctor consultation -> clinical documents and receipt.
Appointment and payment are separate state machines. A payment does not prove consultation completion. Define recovery/refund for payment captured after slot expiry, doctor cancellation, duplicate payment, unsuitable consultation or failed connection. Never label refund successful until verified.

## Gateway recommendation and verification design
Use Razorpay Standard Checkout as the requested provider candidate, subject to provider acceptance, merchant KYC and verified settlement bank account. Integrate an authorised payment provider inside the website; do not build a bank or collect/store card details, CVV, UPI PIN or banking passwords.
A static UPI QR/payment screenshot does not provide reliable automatic booking reconciliation. If QR is offered, prefer a supported order-linked dynamic QR or retain manual pending verification.
Server creates a booking-linked order with trusted INR 50000 paise and currency INR; browser cannot set price or nominate another patient's booking.
Checkout callback: server verifies signature against the server-stored order ID, checks payment belongs to expected order/booking, expected amount and currency, and verifies captured status via provider API. A success screen alone never sets paid=true.
Provider webhook: verify signature over raw body with separate server-side webhook secret; validate event and order/payment association; deduplicate by provider event/payment identifiers; handle retries and out-of-order events without duplicate confirmations.
Store minimal payment identifiers/status and audited transitions in private access-controlled records. Do not place symptoms, diagnoses, reports or patient histories in gateway notes, notification URLs or workflow execution logs.
Keep keys in server credential settings; never chat or commit them. Provider hosted checkout handles sensitive payment entry. Payment correctness remains in the website backend; n8n can coordinate reminders/status notifications only after verified backend events.
Separate automation content webhooks and payment webhooks/secrets. Payment callback is not an approval endpoint.
Track captured payment, refund and settlement separately; gateway acceptance/capture is not proof of bank settlement.

## Launch checks
Merchant KYC, provider service-category approval and bank verification complete; current fees/settlement/refund terms reviewed; no invented zero-fee/free guarantee.
Test mode first: success/failure/cancel/timeout, duplicate and forged webhook, wrong amount/currency/order, callback replay, delayed captured event, slot race/expiry, browser closure before callback, repeat delivery, authorised refund and unauthorised record access.
Verify doctor/caregiver identity and consent workflow, emergency/in-person escalation and accurate visible service scope; confirm applicable professional rules before enabling real bookings.
Show preview to doctor before live activation. Live mode and a controlled real transaction require explicit confirmation; no real payment has been initiated.

## References reviewed
https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/
https://razorpay.com/docs/payments/quickstart
https://nmcn.in/public/assets/pdf/CCIM_Telemedicine_Guidelines_08-04-2020.pdf
The historical ASU guidance is relevant to this registration category but does not establish the doctor's current individual eligibility, state-specific prescribing scope, completion of training or later regulatory changes.
