# Evidence workflow: implemented preview and n8n connection

This is the private evidence pipeline implementation, not a claim that a scheduled workflow has run. The live website remains on main. Do not merge the older AI preview branch wholesale.

## What works in code
- 19 existing allowlisted feeds, four concurrent fetchers; no new paid feed service.
- Canonical URL/DOI deduplication, seven-day discovery window with old correction/retraction exception, previously seen candidate keys over 30 days.
- Up to 60 candidates in bounded screening batches; up to 3 selected topics. It does not cover every international resource or every new paper.
- Exact-DOI Europe PMC lookup; open-access XML body where available, abstract/RSS fallback labelled honestly. Text beyond 14,000 characters is a partial full-text excerpt. No fuzzy identity or paywall bypass. Candidates without an extracted DOI require manual primary-source review.
- Separate structured model calls for screening, clinical analysis, independent source comparison, patient article/media briefs and editorial checking. Verbatim supporting quotes are checked; these checks cannot prove clinical accuracy.
- Only exact verified, dated, complete source bodies with passed reviews can reach a patient draft; everything else remains a physician review/source task. Corrections/retractions still need physician source checks. Current source ingestion does not automatically resolve every correction notice or conflicting guideline.
- English original only in this version. Marathi/other reviewed translations are not generated automatically. Existing patient-library language features are preserved.
- One durable checkpoint per request; four-minute fenced lease; exact revision updates; repeated request IDs ignored; one India-day run. Up to 24 AI calls and 160,000 conservative context/output token reservations per day. Reservation occurs before provider call and remains charged if it fails. These are request/context limits, not a guaranteed currency-denominated spending cap; set a provider budget separately before unattended use.
- Private owner-only cloud queue. Immutable owner decisions refer to exact package hash/revision. Approving content does not publish or generate paid media. Approved complete text can be copied into the existing explicitly reviewed article publisher.
- Visual concept/labels and short video script/scenes only. No final image/video generation or cross-platform publisher is enabled. No external email/WhatsApp notifications have been sent.

## Deployment configuration (no secrets in chat)
Existing SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, CLINIC_OWNER_USER_ID, RESEARCH_JOB_SECRET and Gateway configuration are reused server-side. The existing database job-secret hash is preserved. Model ID must exist in the live model catalogue; openai/gpt-4.1-mini was found during implementation, not a permanent recommendation.
Set a **separate** random EVIDENCE_WEBHOOK_SECRET of at least 32 characters in Vercel environment settings and the corresponding n8n Header Auth credential. Never use a patient token, service-role key or bank/payment webhook secret here. Nothing in the browser receives the secret. Never expose credential values in screenshots.
The webhook uses standard HTTPS Bearer authentication plus database-backed request replay suppression, bounded operations and budget/lease enforcement. Unlike the initial blueprint, this import does not implement raw-body HMAC: using n8n's managed Header Auth credential avoids embedding signing secrets in a Code node. If HMAC is later required, implement/test a credential-backed signer before switching either side.

## n8n import: inactive until configured and tested
1. Log into the intended workspace with drkulkarnipg@gmail.com. The email alone does not identify or connect the workspace.
2. Import workflows/n8n-evidence-daily.json. Verify node compatibility with the actual installed n8n version. The file has active=false and no embedded credentials.
3. Set workflow variable CLINIC_EVIDENCE_URL to the selected deployment's HTTPS /api/evidence-webhook URL. The URL is not a secret. If workspace variables are unavailable in the user's plan, enter the URL directly in the HTTP Request node.
4. Create an HTTP Header Auth credential: Name = Authorization; Value = Bearer followed by the secret entered directly in settings. Select that credential on Run one cloud checkpoint. Do not put it in exported workflow JSON.
5. Set timezone Asia/Kolkata. Confirm Wait unit seconds. Schedule is midnight India. Only this n8n schedule should be activated; there is NO new Vercel cron in this branch.
6. Run Manual test. The HTTP node posts only {action:tick, requestId:n8n:execution-id:node-run-index}. It receives status, not article content or patient histories. True continue responses pause and loop. Stop after 80 node iterations / 30 minutes; investigate rather than extend limits blindly. Source/provider setup errors stop the loop. Do not enable execution-data saving for this workflow; verify instance-level retention settings too.
7. Sign into Doctor Workstation, open Live RSS & AI Research Agent and refresh the new private evidence queue. Open original sources and inspect every package. A single Run/resume step button is available for manual debugging; it does not schedule future steps.
8. Verify Gateway with one real request, observe one manual run and the actual next midnight run. Then, after preview approval, activate on the selected live deployment. Publishing an n8n workflow registers its production trigger; saving alone is not activation.

## Current connection limits
n8n connector discovery returned no available plugin. The user's workspace URL has not been provided; no login/session or live n8n execution is assumed. AI Gateway's last recorded live result before this build required customer verification. No new real inference or media generation has been claimed successful.
The additive private workflow schema was applied to the existing Supabase project. Synthetic transaction tests were rolled back; no patient record or real research package was edited. RLS/concurrent claim/budget/owner exact-package tests passed. The pre-existing Supabase leaked-password protection warning remains; no new public access was granted. Private replay table has intentional default-deny RLS and no client grants.

## Next phases, after this preview and connection
Add doctor-approved topic-to-final-image/video production with provider budget; inspect assets and languages, bind a new final approval to content+asset hashes, then publish to explicitly connected destinations. Persist publication receipts and corrections. Telemedicine INR 500, verified payment receipt generation/delivery and Razorpay are recorded follow-on requirements; not part of this research webhook or an enabled payment service.

## Patient access / language correction (24 October 2026)
Fixed the missing-preview-login downgrade: an unconfigured preview now clearly fails closed instead of demanding a new browser passphrase. The existing owner-login configuration was made available to project previews without changing its credential values or production configuration. Sessions remain short-lived; reauthentication uses the existing owner password. Added bounded/auto-closing language popover, native Marathi pre-visit form labels and stable option values, local language controls and sky-blue styling. Other Indian languages request the existing translation service, with explicit unavailable state rather than an untranslated success claim. No claim of full NIST/OWASP conformance or verified medical translation. Native language, form, login and existing patient-education tests run separately.

Fingerprint/Windows Hello/passkey requested: login offers a capability/setup-information button with an honest not-connected status. Server-side passkey enrolment and authentication code is now implemented; Supabase feature/RP configuration and real-device activation are still pending (see PASSKEY_SETUP.md). No fingerprint data are collected or passwords reset. Stable RP domain and real-device registration/authentication must be implemented and tested before claiming biometric login.

The authoritative consolidated requirements/status register is PROJECT_STATUS.md. Preserve it and update statuses rather than treating an information button or READY preview as a completed live integration.
