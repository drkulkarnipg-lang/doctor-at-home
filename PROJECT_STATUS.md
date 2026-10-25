# Dr Kulkarni — consolidated project status
Updated: 25 October 2026, India time. This is the single working register for this project. Update it when work changes; do not ask the owner to repeat previously recorded requirements.

## Release rule and identity
Preserve every existing facility and the original Georgia identity/care promise. Show preview before publication. Save code to the existing GitHub repository. A saved/READY preview is not a production release or a proven live integration.
Current production feature release: ee799ac6761234393af950ac0656603daa133032 (PRs 11 and 10 explicitly approved and merged on 25 October 2026; production deployment READY).
PR 11 (isolated backend) and PR 10 (full previously reviewed preview) are merged. Their website changes are now published; a live deployment does not imply live provider integrations.
Stable working preview: https://home-visiting-icu-doctor-pune-git-prev-de07c9-drkulkarnipg-lang.vercel.app/
Main website: https://home-visiting-icu-doctor.vercel.app/

## Completed or implemented; evidence and limits
| Requirement | Actual state |
| --- | --- |
| Keep all clinical/site features | Existing source retained; calculator/patient guidance/intake/privacy tests passed. Not every external link/device interaction independently tested. |
| Patient design with light sky blue, warm hopeful accents | Implemented in preview across patient canvas/header/library/booking/FAQ/footer; white reading areas and mint/peach/lavender accents. Core contrast calculated. No claim that colours treat depression. |
| Article cannot be exited after scrolling | Fixed in preview: non-scrolling header Close, persistent bottom return, Escape and backdrop close; focus/background scroll restoration tested. Browser/Android Back interception not implemented. |
| Contained language menu | Preview: bounded positioning, outside-click/Escape/hash-change close. |
| Patient form in Marathi and preferred-language input | Authored Marathi labels/options, dynamic rows and unchanged user answers tested. English default. Other Indian languages request the external translator and report unsupported/unavailable states honestly. Not all automatic medical translations verified. |
| Complete article reading and PDF sharing | Main release has 9 expanded English/Marathi guides and 18 prebuilt PDFs; complete-byte share tests passed. Actual recipient delivery and every third-language PDF are not claimed verified. |
| Pre-visit history | Main has symptom timing/triggers/relief pattern, illnesses, all medicines, allergies, previous care/operations/substances. Optional seizure example, not a seizure-only form. Explicit review/share; no automatic cloud intake save. |
| Separate medication reconciliation form | Delivered 3-page fillable PDF, 138 fields; preserved in the prior conversation. |
| Patient-specific cloud trends | Main has owner-authenticated coded patient trend saving with consent and deletion. Existing older records not silently renamed. Not a complete EMR for every clinical module. |
| All 30 calculators | 935 formula assertions previously passed, plus UI tests. Physician interpretation still required. |
| Diet presets and conversion tools | Existing features preserved; prior diabetes/renal/DASH/protein diet guidance and temperature/weight conversions are not to be removed. |
| SEO | Main: appropriate service/person/site schema, social card, published-article URLs and sitemap. Search Console submission/rankings not verified. |
| No repeated creation of new doctor passwords | Preview configuration repaired; missing configuration now fails closed instead of asking for a new browser passphrase. Same owner account/password. Short session expiry means re-login, not password change. |
| Fingerprint / Windows Hello / passkey | NOW IMPLEMENTED IN CODE: Supabase native WebAuthn registration + verification, owner-only enrolment, verified owner session cookie. API tests pass. NOT YET ACTIVE: Supabase Passkeys/RP settings, production release approval and real-device enrolment/login remain required. Provider feature is experimental. Preview origins cannot register main-site credentials. |

## Automation — roles and integration, not just a diagram
| Requirement | Actual state / remaining work |
| --- | --- |
| RSS discovery | 19 existing allowlisted feeds; bounded fetches, recency and DOI/URL deduplication implemented in preview. Not every international source/medical field is covered automatically. |
| Select practically useful new evidence | Separate screening/analysis/review stages implemented; no guarantee of benefit or savings from a title. Empty qualified digest allowed. |
| Read actual source | Exact DOI Europe PMC lookup; available open body/abstract/excerpt labelled. Full text above bounded context is marked partial. Missing DOI/full text needs physician source review. |
| Research → analysis → independent review → patient writer → editorial checker | Code and tests implemented; cloud checkpoints, fenced lease, replay protection, request/context budget. Real Gateway inference has not yet passed in this build. |
| Private cloud review queue | Additive schema applied; owner isolation, concurrency, budget and exact-package approval transaction tests passed and rolled back. No patient rows edited by workflow tests. |
| n8n daily midnight India | Inactive import workflows/n8n-evidence-daily.json exists. Workspace URL/access and managed credential are still missing; account email is drkulkarnipg@gmail.com. Not imported/activated. No scheduled run claimed. |
| Gateway | Last observed earlier result required customer verification. One real authenticated success and provider spending limits still needed. No paid top-ups authorised. |
| Notify doctor | Private queue UI implemented. External WhatsApp/email delivery not connected or sent. |
| Visuals/videos | Concepts, labels, video script and scene briefs only. Actual assets/narration/captions, inspection, translation and final asset approval/publishing remain. |
| Approval before publication | Workflow cannot auto-publish. Exact package content approvals recorded; main article editor has separate explicit reviewed publish. Automatic destination publishing and asset-hash approval are pending. |

## Remaining requested facilities — retain and finish after current workflow
- Online consultation: INR 500 proposed, appropriate screening/consent, appointment availability and private consultation access. Needs applicable registration/prescribing scope review; not enabled.
- Razorpay: merchant KYC and settlement verification, server-created orders, signature and captured-status verification, signed/deduplicated payment webhook, cancellations/refunds. Not connected.
- Immediate PDF payment receipt after verified payment: unique receipt, booking/payment reference, amount/date, download, automatic authorised delivery with retry/status. Not implemented. WhatsApp automatic delivery needs an authorised API channel.
- Fitness/unfitness/leave and Forms 2, 4, 4A: existing editable/print facilities preserved. Verify current authoritative jurisdictional originals before claiming legal compliance; original-download/type/print/share journey remains on the review list.
- DrugSetu removed from the preview UI on 24 October 2026 at owner request: official pricing offers a 7-day trial, not an ongoing free plan (Starter INR 1499/month plus GST). Drugs.com, CIMS reference links, existing medicines and authorised bulk imports remain. No DrugSetu subscription or API integration. Approximately 1000-drug licensed catalogue completeness remains pending.
- Patient interactive FAQ/chatbot: existing FAQ retained. A genuinely connected clinical chatbot, evidence controls and escalation remain distinct from static FAQ; no autonomous treatment advice.
- Existing direct resource tiles (AI services, PubMed, Scholar, MSD, WebMD, NICE, journals, Medical Xpress): preserve; subscriptions/embedded provider access are not implied by links.
- Full longitudinal cloud EMR, consent/certificate/visit registers, labs and signed documents beyond current patient-trend scope require their own implementation and testing. Do not call present trends a completed full EMR.

## One-time configuration/enrolment gates — do not repeatedly ask for passwords
1. n8n: actual workspace URL and configured Header Auth credential, entered directly in settings. No secrets in chat.
2. AI Gateway: successful verification and real small request, spending limit; then one manual and one observed scheduled run.
3. Passkey: enable native Supabase Passkeys, RP ID home-visiting-icu-doctor.vercel.app, allowed origin https://home-visiting-icu-doctor.vercel.app; keep existing password. The owner enrols through the secure device prompt after an approved main-site release. Do not register against changing previews or the public suffix vercel.app.
4. Paid consultation later: verified merchant/payment account and authorised delivery channel.

## What must not be claimed complete
No blanket banking-grade/security/medical/legal/Google-ranking certification. No live n8n, final media, biometric sign-in, payment gateway, automatic receipt delivery or social publication until the corresponding actual end-to-end check succeeds.

## Release checkpoint — 25 October 2026
The owner explicitly instructed publishing all reviewed changes. Production deployment dpl_AMJZeXmp6yXKwCqek1Z5Gc8gVS4b is READY at feature commit ee799ac. Existing published UI files were retained or updated by approved PR10; backend PR11 changes no UI. No public Vercel share link or preview-protection bypass was created.

Actual n8n workspace: drkulkarni.app.n8n.cloud. The imported workflow was visibly found in the signed-in cloud browser as ‘Dr Kulkarni — Daily evidence research (approval gated)’. Its checkpoint URL was still undefined and Header Auth was not connected. No real or scheduled execution is claimed.

EVIDENCE_WEBHOOK_SECRET and AI_GATEWAY_MODEL were configured only for preview/evidence-automation-workflow; the existing RESEARCH_JOB_SECRET was moved from the obsolete readability preview to that branch. These have NOT been provisioned for production. The generated preview secret is not assumed recoverable after runtime cleanup. Production auth integrations, n8n credential handling, Gateway success and passkey provider/device activation remain pending. Do not mark them completed merely because the scripts are published.
