# Dr Kulkarni — consolidated project status

**Current master checklist:** `MASTER_TASK_REGISTER.md` (26 October 2026). It consolidates the visible and recovered 25–26 October requests, distinguishes LIVE/PREVIEW/PARTIAL/TODO/VERIFY, and supersedes stale status summaries below. `WORK_CHECKPOINT.md` supplies the exact next action. PR19 is now released: ₹500 notice/emergency limitations, article contrast, collapsed payment QR and compact clinical layouts/signoff are LIVE. Full consultation/payment and n8n integrations remain incomplete.

## Current authoritative register — live verified 25 October 2026
This table is the current state. Earlier checkpoint notes below are historical and are superseded where they differ.

| User requirement | Current actual state | Evidence / remaining action |
| --- | --- | --- |
| Contact number must be 9561394341 | LIVE | Main header, clickable contact board, call/WhatsApp links and generated-document contact templates corrected. Live DOM contains no old 9822594341 number. |
| Remove 24/7 ICU | LIVE: REMOVED | Header badge absent in live browser; legacy helper's 24x7 home-visit claim also removed. |
| Clickable number on the board | LIVE: DIRECT CALL FIX RELEASED | Hero now has separate Call 9561394341 and WhatsApp buttons. Header no longer cancels telephone navigation. Footer call retained. Native dialler handoff remains device-dependent and cannot be tested by this browser. |
| No separate Brain Care tab | LIVE | Brain-related stroke/swallowing guide remains in the shared health library. |
| Main layout | LIVE: two main tabs retained | Patient Portal and Doctor Workstation; existing facilities preserved. |
| DOB age calculation and optional password keyboard | LIVE | Previously released in PR12. |
| Minimum 700-drug catalogue | LIVE | 12,081 RxNorm formulations + 45 original entries + 245 requested name records = 12,371 rows on a clean device. Fifteen requested records are review-only and cannot be auto-selected. Not a count of unique approved ingredients or verified Indian products. |
| Fingerprint / Windows Hello | Provider enabled; device enrolment pending | Supabase settings saved for main-site RP ID; live passkey challenge returned 200. Owner must register on their own device before successful biometric sign-in can be claimed. |
| n8n | INCOMPLETE | No verified activated production workflow or successful scheduled agent run. |
| Remaining audit/EMR/payment/domain work | PENDING | No blanket completion claim; retain earlier backlog. |

Contact/availability production release: PR14, commit 026f5336e9efa2f6572b2630fe1e4b7836f1bc4e, deployment dpl_GCthHamkK3d6YqwYXN3fDuwCtMEz READY. Verified live URL https://home-visiting-icu-doctor.vercel.app/ . All 21 test files passed before release. This focused release did not merge PR13.
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

## Correction batch — 25 October 2026, DOB and brain-care navigation
Status: implemented on a review branch; not published to production by this batch.

| Requested correction | Result and verification |
| --- | --- |
| Remove “international” from public resource heading | Heading now reads “Explore health resources”; reference links retained. |
| DOB in separate small day/month/year boxes, no punctuation separators | Added to pre-visit patient history and prescription age entry. Optional; manual age remains. Existing death-report date fields retain their original format. |
| Calculate exact age after complete DOB | Calendar years/months/days using today's India date, with month-end anniversary clamping. Invalid/future dates rejected. Pre-visit history includes DOB and complete age; prescription preserves a pre-existing gender suffix. Verified birthday, leap-year, month-end and newborn cases. |
| Brain care visible | Dedicated navigation/section opens existing complete stroke/swallowing guide and links to pre-visit event history. This is not a complete neurology library; broader brain-health topics remain to be authored and reviewed. |
| A4 documents | Existing A4 print and PDF engine settings preserved. All 18 prebuilt guides, 37 pages, measured as A4. Blank/filled intake print-flow tests pass. Physical printing and every filled certificate length remain unverified. |
| Preserve every facility | All 19 existing/new test files pass, including 935 formula assertions across 30 calculators and the existing-feature-ID inventory. Corrected one stale UI assertion that expected the owner-removed DrugSetu tile. |
| Preview before publication | Local browser preview confirms DOB entry calculates age; production is unchanged. Review branch is the checkpoint for this batch. |

Still open: production/provider configuration gates, scheduled automation end-to-end execution, payment/receipt integration, full EMR/registers and broader patient-education coverage remain as listed above. This correction batch does not complete those facilities or claim external integrations are live.

## Follow-up omissions — 25 October 2026
- Optional password on-screen keyboard: added to the existing Doctor login password field. Includes letters, digits, symbols, Shift, Space, Backspace, Clear and Hide. Regular keyboard/password-manager use remains. No credential storage/logging, automatic submission, or security-strength claim. Tested insertion/selection replacement, deletion, Shift, clear and cancellation.
- RxNorm and openFDA: official reference links added to Doctor Workstation → Live RSS & AI Research Agent → Clinical references. These are reference links, not an API integration or a drug catalogue import.
- Removed the remaining “International Reference” heading. The formal university name retains its official wording.
- Earlier conversation claimed 12,081 RxNorm clinical formulations were imported. This is not verified in the present repository; do not claim minimum 700 drugs or a completed imported catalogue until an actual catalogue and count are verified.
- These omissions were missed in the first correction batch. They are now included in the same review PR; production publication is still pending review/approval.

## Preview publication checkpoint — 25 October 2026
Owner requested “preview publish kara”. Vercel preview deployment dpl_ASghn2GmNNDNU3Gr7NX4SaXuSH3R is READY for commit 286a597217e46bc3f68dfe6eb10ac88a2d631240. URL: https://home-visiting-icu-doctor-pune-6wmai5awl-drkulkarnipg-lang.vercel.app/ . Provider metadata confirms review/dob-brain-a4-20261025; build duration approximately 9 seconds. Browser reaches Vercel Authentication, so deployed-page browser QA remains blocked by sign-in. Local browser QA and all 20 test files passed earlier. No share/bypass link created, no protection changed, no production publication.

## Brain-care placement correction — 25 October 2026
Owner clarified: no separate Brain Care tab or section. Removed that extra navigation/section from the review version. The existing complete stroke/swallowing article remains in the same Health library as kidney and heart-failure articles.. No new top-level tab or search feature added. Patient Portal and Doctor Workstation remain the two main tabs. Earlier brain-section completion entries above are superseded by this correction. Preview only; production unchanged.

## Production publication and medicine count — 25 October 2026
Owner approved publication after the brain-placement correction. PR12 merged as 8c63233a41eca4c76d8b9d287ade80078ab24dcc; production deployment dpl_FFDcnWE9gYyQnAMtAF6ThfuKNEQ3 is READY. Live URL https://home-visiting-icu-doctor.vercel.app/ verified in browser: no separate Brain Care navigation; DOB and password-keyboard scripts plus RxNorm/openFDA links present; resource heading is Explore health resources. Supersedes preview-only statements for this batch.

Actual bundled formulary count: 15 repository rows plus 40 restored rows, deduplicated by the same getAllDrugs() logic to 45 unique built-in entries. Some rows combine several strengths. Browser-specific custom/local imports may increase a particular device count but were not inspected. Minimum 700 drugs is NOT achieved. Reference links are not catalogue imports; previous 12,081 claim remains unverified.

## Immediate live contact correction — 25 October 2026
Owner explicitly requested the live number correction and removal of 24/7 ICU, after pointing out that the prior number change was only in preview. This is a separate focused release from PR13's unapproved catalogue work.

| Requirement | Implementation | Release state |
| --- | --- | --- |
| Current contact number 9561394341 | All active HTML/JS contacts, structured data, WhatsApp/booking messages and generated-document contact templates corrected | Production verification pending for this focused release |
| Contact-board number clickable | Explicit Call +91 9561394341 button, tel:+919561394341 | Production verification pending |
| Remove 24/7 ICU | Header badge removed; legacy helper's 24x7 home-visit claim removed | Production verification pending |
| Keep all existing facilities | Catalogue remains original 45 entries in this hotfix; prior public/doctor tabs, calculators, guides, forms and resource links retained | Tests required before merge |

PR13 is not merged by this release. Its expanded RxNorm catalogue and small audit fixes remain preview-only. Provider passkeys have separately been enabled and the live challenge endpoint returned 200; real-device registration remains pending. n8n remains incomplete. Never describe a preview-only change as live.

## Direct call and formulary release — 25 October 2026
Owner reported that the visible hero board offered only WhatsApp and that number clicks did not open the dialler. Reproduced on production: hero Contact linked only to WhatsApp; header onclick cancelled native tel navigation and opened a chooser. This release adds separate labelled Call 9561394341 and WhatsApp controls to the hero, removes the header cancellation and stops intercepting all tel links (including emergency numbers). Optional contact/copy dialog retained. Native phone-app handling depends on the user device; desktop dialling cannot be claimed proven by a cloud browser.

Owner explicitly approved making the expanded formulary live. Includes the 12,081 source-labelled NLM RxNorm SCD formulations, original 45 entries, lazy loading, full search, 100-row pagination and prescription picker without inferred dosing fields. This focused release does not publish PR15’s unrelated indexing/speed changes. Validation/deployment recorded after verification.

Production verification for direct-call/formulary release: PR16 merged as 24e2e949cc77b355a86214bde0b23dfb97ee881f; deployment dpl_Bb4vPXFZWx3QpFEJoLA33sdSSezv READY and aliased to https://home-visiting-icu-doctor.vercel.app/ . Reloaded live main: separate Call 9561394341 and WhatsApp controls visible. All 22 test files pass, including no preventDefault on telephone links, 935 calculator assertions, preserved IDs and catalogue behaviour. Actual public catalogue returned HTTP200 with 12,081 entries, release 05-Oct-2026, SHA-256 ff8f1f8806a9b4b7c1de4cabf734cbeb6233250b9e528b6024f23f2d9cb5ee85 matching the shipped snapshot. Production doctor-authenticated directory interaction was not independently exercised. The cloud browser refused the native tel: action because only http/https protocols are allowed; no bypass attempted and no actual device dialler success claimed. PR15 indexing/speed changes remain preview-only; future merges must retain PR16 contact fixes.

## Missing ACE inhibitor search repair — 25 October 2026
Owner could not find quinapril, cilazapril or imidapril. Snapshot audit: quinapril has seven RxNorm formulations; cilazapril and imidapril have none. Add three immediate generic identity references (Quinapril C09AA06, Cilazapril C09AA08, Imidapril C09AA16), each linked to the WHO Collaborating Centre ATC index, verified 25 October 2026. No strength, form, brand, availability or prescribing dose inferred from ATC/DDD. Generic references remain distinct from RxNorm formulations, available before download and excluded from personal-data backups. Directory query trims whitespace and triggers missing catalogue load even when opened through another navigation path. Revised total: 45 original + 3 generic references + 12,081 formulations = 12,129 rows after download, before local custom entries. Publication and verification pending below.

ACE-inhibitor release verified: PR17 merged d99f54290d140fa17d43920f7b8a42dd3d9ffff6; production deployment dpl_9NPhuCkupPVpxsnwJwYhu9nq9joR READY. Production formulary-import.js and index.html HTTP200 byte-match the release. Three relevant test files pass (catalogue/search/query-triggered loading, calculator/interface, live-contact). Exact names quinapril, cilazapril, imidapril and case/whitespace searches tested; generic reference prescription fields blank. Directory/picker inputs also handle paste via input events. Real owner-authenticated browser interaction remains unverified; do not claim Indian market availability or a fully comprehensive medicine list.

## Complete owner-requested medicine list — 25 October 2026
Preserved the full comma/newline request in data/requested-cardiovascular-2026-10-25.txt. The audit accounts for all 287 original entries, including duplicates and the split perindopril/amlodipine/indapamide fragment; 245 unique canonical name records. Original spellings map to their reviewed names, without silently resolving ambiguous names. Generic identity references and requested ingredient combinations carry source links; no dose, strength, frequency, duration or local authorisation is inferred.

Sources: existing NLM RxNorm snapshot; exact-name responses from the WHO Collaborating Centre ATC index; FDA/DailyMed labels; HPRA product records; NIH/NCCIH/MeSH; Singapore formulary; PMDA; and explicitly labelled manufacturer/product or original-study references. Cached source checks and conservative overrides are source-controlled. ATC/DDD values were not imported as prescription doses.

Coverage: {"identity-reference": 181, "needs-name-review": 6, "supplement-review": 3, "composition-reference": 49, "withdrawn-reference": 1, "product-review": 2, "combination-review": 3}. 230 identity/combination references are selectable with blank prescribing fields; 15 records remain visible for review and are blocked from automatic prescription selection in both directory and picker. Pending: oravastatin, omega3 fish oils, bitoxolol, fenofibrate plus oravastatin, benfluorex, standardized yeast rice, phytosterol complex, sambong leaf, orazisin, vo-dergocrine, imidapril plus hydrochlorothiazide, losartan plus amlodipine plus hydrochlorothiazide, candesartan plus hydrochlorthalidone, amlodipine plus hydrochlorothiazide, cerebrolysin concentrate. Ambiguous names have no automatic substitution; benfluorex is historical/withdrawn, not routine selectable therapy. Supplements and branded/herbal mixtures require exact product review. Form-label corrections include alirocumab, evolocumab, evinacumab, cangrelor, clevidipine, fenoldopam and Cerebrolysin.

Added an accessible searchable audit at /formulary-coverage.html, linked inside the existing Formulary, with all original request IDs, corrections, sources, status filters and pagination. No extra main tab. The audit and RxNorm catalogue load independently only on doctor-directory/picker use; an outage in one does not erase the other. Original 45 medicines, direct-call fix and other facilities preserved. Full loaded catalogue is 12,371 rows on a clean device, including 15 review-only records; not 12,371 unique approved molecules.

Validation: exhaustive tests query every original request and all 245 records, aliases, uppercase/whitespace and combination separators, directory/picker blocks, blank prescribing fields, and independent download failures. Browser verified the audit count, alirocumab form note and review filter. Release verification follows.

All 23 test files passed for this release (15.6 seconds), including 935 calculator assertions, preserved feature IDs and exhaustive requested-name coverage.

Production verified for the full requested list: PR18 merged f8eda436b1fbd686c20f140cd9a4cba50cdaa1ac; deployment dpl_B6YVmNsuuXsp7GA9y4uxkBFC7P91 READY. Live /assets/drugs/requested-cardiovascular.json returned HTTP200, byte-matched the release, and contains all 287 requests / 245 rows. Live formulary-import.js also byte-matched. Browser verified /formulary-coverage.html: counts 287 / 245 / 230 references / 15 review, original misspelling bicalirufin resolves to Bivalirudin, and alirocumab shows the injection form correction. Real owner-authenticated directory use remains unverified; exhaustive software tests exercise every directory query, picker safety and the deployed-source code. Keep the fifteen review items explicit; do not claim all 245 are verified local products.

## Reading / QR / clinical document corrections — 26 October 2026
Owner requires: pale, readable heart/coconut-water/skin article actions; QR hidden inside Payment methods; ordinary prescription/pathology/radiology fit one A4 page when content permits, expand only for actual overflow; signature, name, date, time across clinical requisitions, consent, certificates. No inferred event dates or digital signatures. Original government PDFs and intentional two-page Form2 retained. DOB editor removed only from prescription output, age data retained. Added visible radiology identity/date/time, certificate issue/verification time, consent signatory date/time and Form2 informant/Registrar date/time. Private local changes from 25 October were removed by automated workspace maintenance before checkpoint; restored from main 8fada37 and re-applied. Verification and preview release follow.

## PR19 production release — 26 October 2026
Owner requested proceeding without repeated suggestions after review. PR19 merged 1888c3a310ae4305c972d0d34c8ad710809b366c; production dpl_3vbXZvtF8HazQnNmiTUS29SF9yGT READY. Live source byte checks and browser notice/article controls/collapsed QR/secure UPI ID copy verified. All24 tests passed after final fitness/leave spacing fix. Synthetic PDF engine: normal Rx/path/rad one A4 page, long 42-row Rx two pages, normal fitness/consent one page. No claim of owner-device download/printing, payment, live n8n or biometric success. See master register for exact remaining rows.
