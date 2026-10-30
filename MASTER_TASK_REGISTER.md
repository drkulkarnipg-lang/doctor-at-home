# Dr Kulkarni — permanent request and completion register

Updated: 30 October 2026 (India). Covers requests available from the 25–26 October conversation, recovered prior-context requests, and the project's recorded outstanding commitments. This is the current checklist; older completion claims do not override it. Retrieved requests without implementation evidence stay open. This is not a claim to possess a complete archive of every separate conversation.

**Legend:** `[x] LIVE` = released and supported by recorded deployment/source checks; `[ ] PREVIEW` = code saved for review, not live; `[ ] PARTIAL` = only part complete; `[ ] TODO` = unfinished; `[ ] VERIFY` = evidence insufficient. A READY deployment alone does not prove a feature works. Device-only checks are stated separately.

## Your standing instructions — always apply

- [x] Keep a durable record after every completed small step. Synchronize the checkpoint to GitHub before a long operation or ending work. Resume the next unfinished item; do not restart from zero.
- [x] Use one current register. Read this file and WORK_CHECKPOINT.md before work. Update changed rows and include a short completed/pending summary in progress and handoff messages.
- [x] Preserve existing facilities, references and Explore health resources links. Do not silently remove or substitute them.
- [x] Keep only Patient Portal and Doctor Workstation as main tabs. Brain articles belong beside kidney/heart articles in the shared library.
- [x] Keep preview and production separate. Show a concrete preview before publishing a new batch unless that specific release is already authorised. Saving is not publishing.
- [x] Use one active repository editing workflow. Do not overwrite another tool's changes. No repeated password creation, secret requests in chat, invented drug identity or automatic prescribing regimen.
- [ ] Design identity: retain Georgia/care promise; sky-blue versus cream/navy has conflicting earlier notes. Do not apply a fresh global redesign based on the old audit alone.

## A. Contact, navigation, search and language

| ID | Tick / state | What you asked | Evidence or exact remaining action |
| --- | --- | --- | --- |
| A01 | [x] LIVE | Replace 9822594341 everywhere with **9561394341** | Recorded live DOM/source checks cover header, board, links, booking and generated contact templates. |
| A02 | [x] LIVE | Remove **24/7 ICU** and unsupported 24x7 availability wording | Released contact correction; doctor confirms availability. |
| A03 | [ ] PARTIAL | Number on the board opens phone dialler; separate Call and WhatsApp | Native tel link, separate hero Call/WhatsApp and removal of cancelled navigation released. Actual dialler handoff still needs owner's phone check; cloud browser cannot establish it. |
| A04 | [x] LIVE | No separate Brain Care tab; brain articles inside health library | Shared stroke/swallowing guide retained; two main tabs preserved. Broader brain content remains C02/C03. |
| A05 | [x] LIVE | Remove public “international” wording | Explore health resources heading corrected; official source names retained. |
| A06 | [x] LIVE | Optional onscreen password keyboard | Letters/numbers/symbols, Shift, delete/clear/hide; regular keyboard remains. Tests recorded. |
| A07 | [x] LIVE | Separate DOB day/month/year boxes and exact age | Date validation, India date and years/months/days calculation tested. Manual age remains. |
| A08 | [ ] VERIFY | Search button can search “anything in front of it” | Global health search exists in current source; universal cross-module search coverage/intent not established. Do not call every module searchable yet. |
| A09 | [ ] PARTIAL | Native three-language dropdown and patient form language | English/Marathi authored patient fields exist. Full EN/HI/MR authored UI/articles, translation correctness and all language flows not verified. External translation is not indexed Hindi content. |
| A10 | [ ] VERIFY | Header/language menu easy to use on phone | Earlier menu fixes recorded; audit's compact header, readable text and touch-target issues need current visual check. |

## B. Formulary — actual live data, not just reference links

| ID | Tick / state | What you asked | Evidence or exact remaining action |
| --- | --- | --- | --- |
| B01 | [x] LIVE | Minimum 700-drug formulary, actually published | 12,081 RxNorm formulations + 45 original + 245 requested name rows = **12,371 catalogue rows** on clean device. This is not a unique-molecule, approved-Indian-product or complete-brand count. |
| B02 | [x] LIVE | Find quinapril, cilazapril and imidapril | Query-triggered download and exact/whitespace/case searches tested; release PR17 recorded. |
| B03 | [x] LIVE | Preserve and account for every supplied drug spelling | All **287 original entries / 245 canonical records** retained; aliases and independent catalogue loading tested. Live audit: https://home-visiting-icu-doctor.vercel.app/formulary-coverage.html . |
| B04 | [ ] PARTIAL | Every requested medicine usable with correct identity/form | 230 identity/combination references selectable with blank prescribing fields. **15 remain blocked for review**, listed below. Do not mark the whole request complete. |
| B05 | [x] LIVE | RxNorm and openFDA references | Official links present; RxNorm catalogue imported. No openFDA API-based prescribing integration claimed. |
| B06 | [ ] TODO | Respiratory, gastroenterology and antibiotics coverage | Recovered 25 October request. Catalogue may already contain examples; explicit requested-category completeness/source audit still needed. |
| B07 | [ ] TODO | Reliable local products/brands, forms and strengths | Identity references are not verified Indian market availability. No inferred strength, dose, duration or substitution. |

**B04 — all 15 unresolved records (keep this list):** oravastatin; omega3 fish oils; bitoxolol; fenofibrate plus oravastatin; benfluorex; standardized yeast rice; phytosterol complex; sambong leaf; orazisin; vo-dergocrine; imidapril plus hydrochlorothiazide; losartan plus amlodipine plus hydrochlorothiazide; candesartan plus hydrochlorthalidone; amlodipine plus hydrochlorothiazide; cerebrolysin concentrate. Reasons include ambiguous spelling/product, supplement/composition, combination verification and historical withdrawal. Do not silently replace these names.

## C. Articles, appearance, SEO and audit fixes

| ID | Tick / state | What you asked | Evidence or exact remaining action |
| --- | --- | --- | --- |
| C01 | [x] LIVE | Pale readable Read/Download/Share boxes below heart-failure, coconut-water and skin articles | Explicit pale backgrounds, dark text, borders/focus saved in PR19. Computed browser styles verified on all three action groups; pale backgrounds/dark text, 46–51px controls. Released PR19; live browser verified. |
| C02 | [ ] PARTIAL | Brain-related awareness beside kidney/heart articles | Existing stroke/swallowing guide is live in shared library. Additional brain articles not all authored/reviewed/published. No new main tab. |
| C03 | [ ] TODO | Day 1–13 EN/HI/MR articles on website | Original corpus/import, topic deduplication, review and publication still required; do not replace it with invented text. |
| C04 | [ ] PARTIAL | Separate article URLs, index, canonical/hreflang, sitemap, topic hubs | Some article endpoints/schema exist in main; indexing/speed PR15 is an older unmerged draft. Reconcile onto current main without undoing subsequent fixes. Full multilingual indexing not proven. |
| C05 | [ ] TODO | Author/review date, article medical schema, references and fixed footer | Complete field-by-field audit on real article pages; do not invent clinical review dates or author qualifications. |
| C06 | [ ] TODO | Smaller logo, no logo 404, PDF script loaded only when needed, deferred translator, shorter title | Audit backlog; verify present code and reconcile stale draft before claiming reduced sizes/working changes. |
| C07 | [ ] TODO | Mobile header, 44px targets, readable type, booking labels, skip link, one h1 | Some component fixes exist; audit-wide completion and mobile visual check pending. |
| C08 | [ ] TODO | Doctor photo/about page, pearl infographics, body-system/A–Z browsing | Authentic portrait/content and current implementation audit needed; never fabricate portrait/credentials. |
| C09 | [ ] TODO | Custom domain, canonical/sitemap update and redirects | Domain not selected/purchased/connected. Do not claim shared vercel.app hosting itself causes a proven ranking penalty. |
| C10 | [ ] TODO | Search Console/Bing and performance verification | Ownership/submission/indexing and real speed scores not verified. File-size estimates are not Lighthouse scores. |
| C11 | [ ] VERIFY | Editable patient-education space; cloud sharing/printing | Existing local article editor/read/PDF sharing present; cross-device persistence, author workflow and requested direct cloud sharing/printing not fully verified. |
| C12 | [ ] VERIFY | Stroke-swallow-safety EN/MR visuals (25 Oct), Parkinson's-freezing EN/MR visuals (26 Oct) | Recovered prompt files only; finished assets/review/publication not proven. Keep separate language and exact identity/footer rules. |

## D. Payment and online consultation

| ID | Tick / state | What you asked | Evidence or exact remaining action |
| --- | --- | --- | --- |
| D01 | [ ] PARTIAL | QR hidden inside Payment methods, reveal when tapped; correct UPI payee and amount | QR disclosure behaviour was previously released, but a current-main source audit found that clinical-documents.js still overrode the requested `drkulkarnipg@upi` with the stale `9561394341@sbi` value and rebuilt the payment URI. Fix is on review branch `fix/upi-payee-single-source-20261030`: one canonical payee, amount-bearing INR URI, stale override removed, regression assertions added. The repository regression workflow now passes all 24 test files after correcting the stale long-history assertion. UPI URI/payee assertions passed in tests/clinical-documents.test.cjs. Vercel build-rate-limit still blocks preview deployment; actual QR/payment-link behaviour and production release remain unverified. Do not mark live until preview and live payment-link behaviour are verified. Razorpay/verified settlement remains D05. |
| D02 | [x] LIVE | **Online consultation / Telemedicine notice: ₹500** | Implemented 26 Oct: hero link and English/Marathi notice, ₹500 clearly separated from home-visit fee; availability/suitability confirmed by doctor. Clinical regression and focused DOM checks passed; desktop preview inspected. Released PR19; live notice verified. |
| D03 | [x] LIVE | Say who should not rely on online consultation in severe conditions | Prominent English/Marathi warning beside ₹500: severe chest pain, severe breathing difficulty, sudden face/arm weakness or speech problems, collapse/unconsciousness; seek emergency help without waiting for booking/reply/payment. Primary MoHFW guidance checked; local desktop screenshot/hero navigation and focused DOM checks passed. Released PR19; production notice verified. Phone layout check remains. |
| D04 | [ ] TODO | Actual online consultation workflow | Availability confirmation, screening/consent and private access not end-to-end verified. Notice alone is not an operating consultation backend. |
| D05 | [ ] TODO | Razorpay / online payments | No verified merchant/KYC, server order/payment confirmation, webhook, refund flow. QR is not a verified payment gateway. |
| D06 | [ ] TODO | PDF receipt immediately after verified payment | Receipt number, amount/date/reference and authorised delivery with retries/status not implemented. Never issue paid receipt just because QR opened. |

## E. Prescription, requisitions, consent and certificates

| ID | Tick / state | What you asked | Evidence or exact remaining action |
| --- | --- | --- | --- |
| E01 | [x] LIVE | Ordinary prescription/pathology/radiology generally ONE A4 page | Compact layout and isolated print root saved in PR19. Real html2pdf metadata: normal 5-row Rx, path and rad each one A4 page. Browser download completion timed out; owner's final save/print not verified. |
| E02 | [ ] PARTIAL | More pages only for actual longer content; no clipped text | Real PDF engine confirmed two pages for 42 synthetic rows; all rows and final signoff retained in clone. Fitness spacing corrected and one-page result verified; consent one page with both signatories. Broader filled examples/device output remain open. |
| E03 | [x] LIVE | Remove unnecessary date/DOB layout that makes Rx two pages | DOB editor stays onscreen, excluded from document clone; calculated age retained. Dates use compact fields; saved/tested. |
| E04 | [x] LIVE | **Signature, name, date and time** on every clinical document | Signoffs added/tested for Rx/path/rad/referral/consent; certificate issue/verification times and Form2 signatory dates/times. Blank signature lines; no fabricated electronic signatures or event dates. Released PR19; normal fitness/consent visual checks passed. All filled/device examples not claimed. |
| E05 | [x] LIVE | Requisitions actually mention date | Path time and radiology identity/date/time added; existing dates retained. Fresh cloned values tested. |
| E06 | [ ] VERIFY | Fitness/unfitness/leave/Forms 2, 4, 4A all print/save/share properly | Facilities and original government PDFs preserved; check filled examples, layout and current jurisdictional forms. Intentional multi-page originals are not forced onto one page. |
| E07 | [ ] VERIFY | Lab choices: lipid profile, ammonia, iron studies | Recovered request. Check exact current list, labels and selected-item output; no completion evidence yet. |
| E08 | [ ] VERIFY | Radiology: portable/bedside USG, separate arterial/venous Doppler, CT/MRI choices | Recovered request. Check exact current items and requisition output before marking complete. |
| E09 | [ ] PARTIAL | Correct A4 output for every doctor/patient document | Existing 18 guide PDFs measured A4; new clinical normal cases checked. All filled certificates/intake/consent/overflow and physical device printing remain broader verification work. |

## F. Login, cloud data, security and automation

| ID | Tick / state | What you asked | Evidence or exact remaining action |
| --- | --- | --- | --- |
| F01 | [ ] PARTIAL | Fingerprint / Windows Hello should work | Native passkey code and production Supabase provider/RP configured; live challenge returned 200. Actual owner-device enrolment AND subsequent biometric login not verified. |
| F02 | [ ] TODO | Remember this device 30 days; keep password fallback | Existing password preserved. Thirty-day refresh/session behaviour not implemented/proven. |
| F03 | [ ] VERIFY | Login stuck at CAPTCHA; Supabase login via GitHub suspected | User reported blockage. Do not assume passkey-provider setup resolved CAPTCHA/dashboard OAuth. Reproduce exact remaining sign-in flow before closure. |
| F04 | [ ] TODO | CSP script-src and leaked-password protection | Audit-wide verification/hardening pending. Preserve legitimate dependencies/auth and do not weaken authentication to bypass CAPTCHA. |
| F05 | [ ] PARTIAL | Cloud patient records/registers and longitudinal EMR | Owner-authenticated coded trends exist. Full visits, medicines, labs, consent/certificate/document registers are not complete EMR. |
| F06 | [ ] PARTIAL | n8n actually active, not just a plan | Workflow seen in drkulkarni.app.n8n.cloud, inactive/unconnected endpoint/header credential. Production setup and successful manual + scheduled executions remain. Earlier claim that workspace URL was unknown is superseded. |
| F07 | [ ] PARTIAL | Research → analysis → independent review → writing → proofreading | Source controls, queue/checkpoints and tests exist; actual successful provider inference, spending limit and production flow not verified. No paid top-up authorised. |
| F08 | [ ] TODO | Daily midnight India research / practical evidence across fields | Scheduler execution not verified. Existing 19 feeds do not establish complete coverage or useful clinical benefit. |
| F09 | [ ] TODO | Notify doctor; visuals/videos and platform publication | Private review UI exists; actual finished media, authorised external delivery and automatic destination publication remain. No messages sent by this checklist task. |
| F10 | [ ] PARTIAL | Doctor approval before article publication | Approval-gated code/queue tests exist; complete destination/media approval and publishing flow still pending. |
| F11 | [ ] TODO | Connected patient FAQ/chatbot | Static FAQ exists. Real controlled clinical assistant with evidence/escalation not established. |
| F12 | [ ] CODE + TESTS COMPLETE — PROVIDER CONFIG/LIVE PENDING | Owner password recovery: email reset link, first-time password creation/reset, secure token handling. | Added owner-email-restricted Supabase recovery request and owner-ID-verified password update to api/clinical-cloud.js; added Doctor login recovery button, password-reset.html and password-recovery.js. Recovery token is scrubbed from URL, held in memory only, and not stored in browser storage; update creates no browser session. API/UI tests pass in the 25-file suite. Requires Vercel CLINIC_OWNER_EMAIL set to the owner email and Supabase redirect allowlist to include https://home-visiting-icu-doctor.vercel.app/password-reset.html. Current Vercel build-rate-limit prevents preview/live verification; no claim of a working email delivery until provider configuration is checked.

## Next work — resume here, not from zero

**SUPERSEDED — work active, 30 October 2026:** the owner explicitly instructed not to pause and to continue until the original draft has been checked against implementation. The 26 October pause is no longer the current instruction. Continue the register in priority order; do not mark unverified work complete.

1. PR19 released and production checked on 26 October: consultation notice, article controls, collapsed QR/UPI and clinical layout/signoff code are live. Do not reimplement this batch.
2. E02/E06/E09: further filled certificates, phone/native dialler, device PDF-save and physical print checks remain distinct from verified synthetic page counts. Preserve passed results.
3. Continue E07/E08 requisition-list audit, F01–F03 login/device work, F06–F10 n8n/provider automation and C03–C10 article/SEO backlog; keep exact external configuration blockers explicit.
4. Continue pending requisition-list, login/device, automation and audit work using the row IDs. For external access, finish independently available code/review before identifying a precise configuration blocker.

## Evidence pointers and handoff rule

- Released PR19: https://github.com/drkulkarnipg-lang/doctor-at-home/pull/19 . Production implementation commit 1888c3a310ae4305c972d0d34c8ad710809b366c; Vercel dpl_3vbXZvtF8HazQnNmiTUS29SF9yGT READY (production). Live index.html, reading-print-fixes.css and clinical-documents.js returned HTTP200 and matched the release bytes. Live browser verified ₹500 notice, all six article action controls, initially closed QR/payment details and successful secure UPI ID copy. Whole 24-file suite passed after final source change (27.1s). No payment, biometric enrolment or actual recipient delivery executed.
- WORK_CHECKPOINT.md: exact resume point, completed checks and limitations. PROJECT_STATUS.md: deployment history and detailed implementation evidence. Older historical entries may be superseded; this register states present status.
- Never tick a TODO because a plan, prompt, test stub or READY build exists. Update this register after each changed item; include an updated done/preview/pending summary in every substantive project handoff. Do not ask Dr Kulkarni to reconstruct the old list again.

## G. New document usability correction — 26 October 2026

| ID | Tick / state | Request | Current evidence / remaining action |
| --- | --- | --- | --- |
| G01 | [x] LIVE | Prescription, lab/pathology and radiology must close before or after export | Added top Back to tools, always visible bottom Close, Escape and a document chooser; entered data retained. Regression passed on all three forms: preserve entered values, reopen, top/bottom Close and Escape; share Escape closes only overlay. Local browser Close/reopen retained synthetic name. Owner approved publication (“ho”); PR20 released as a110d9c. Live browser confirms all six controls mounted; actual authenticated owner-device interaction remains distinct from the synthetic interaction checks. |
| G02 | [x] LIVE | Sent PDF should use the A4 page, not appear half-size | Full 194mm writing width and 264mm minimum page area, readable clinical type and signoff towards bottom for short documents; natural overflow retained. Real PDF image matrix confirms 194mm×263.76mm writing area on A4; ordinary Rx/lab/radiology each one page. Larger-font 42-row stress case naturally four pages, all rows retained. PR20 released after explicit approval. Production dpl_FaeTguGmF9Qztqqfo45NgjhMaXX7 READY; live JS/CSS returned200 and byte-matched tested source. All24 tests passed before release; real owner-device download/print remains unverified. |


## H. Source-audit regressions discovered while implementing the original draft — 30 October 2026

| ID | State | Original requirement | Actual source finding, correction and evidence |
| --- | --- | --- | --- |
| H01 | [ ] CI PASS — PREVIEW BLOCKED | Celsius/Fahrenheit and kg/lb converters must automatically work both ways in Patient Portal and Doctor Workstation. | Current HTML already contains `patientCelsius`, `patientFahrenheit`, `patientKilograms`, `patientPounds` and corresponding `doctor*` fields. `release-tools.js` incorrectly expected nonexistent legacy form IDs, threw during DOMContentLoaded, and prevented the seven diet preset cards from rendering. `unit-converters.js` had competing direct handlers that accepted temperatures below absolute zero and negative mass. Review branch now separates diet-card setup from the actual converter module, keeps one converter listener per pair, validates absolute-zero/nonnegative-mass bounds, clears invalid paired values and announces errors. `tests/calculator-ui.test.cjs` now exercises both patient and workstation conversions. All 24 regression test files pass in GitHub Actions, including both Patient Portal and Doctor Workstation conversion tests. Vercel build-rate-limit prevents preview/live confirmation. |
| H02 | [x] CI VERIFIED — LIVE PENDING | Previsit long-history sharing must preserve the complete history and clearly tell the user nothing was shortened or sent automatically. | New CI found that `tests/booking-intake.test.cjs` expected “Nothing has been shortened” while the runtime message only said “Nothing is sent automatically.” Updated the user-facing message to “Nothing has been shortened or sent automatically.” The corrected message passes tests/booking-intake.test.cjs in the full green suite. |
| H03 | [x] CI GREEN — 24 FILES | Every correction must be tested; do not infer success from code presence. | Added `.github/workflows/regression-tests.yml` to run all `tests/*.test.cjs` using Node 22, locked project dependencies and jsdom. The green run 41018433870 completed all 24 tests/*.test.cjs files on Node 22. Vercel build-rate-limit remains a separate preview blocker. This workflow does not bypass or resolve Vercel's separate build-rate-limit failure. |

| H04 | [x] CI VERIFIED | Homepage must explicitly communicate home visits and bedside care. | Automated regression suite had an outdated expectation for “Thoughtful care” after the hero was changed to “Home visits. Care at your bedside.” Updated the test to verify the current explicit home-visit promise rather than restoring obsolete text. Full suite passes. |

| H05 | [ ] CI PASS — LIVE PENDING | Health Library article reader must have one Back action without duplicate Close/Share/Download tabs, while PDF actions remain available. | Added Share original PDF and Download original PDF to the nine guide cards, outside the reader. Reader retains one Back to Health Library control. Test verifies each of nine guides in authored English and Marathi, checks PDF download naming and compares shared PDF bytes with the expected guide asset. Full 24-file suite passes; live UI remains unverified due Vercel build-rate-limit. |
| H06 | [x] CI VERIFIED | Unavailable translation choices must show an honest status message without altering entered patient text. | Updated the test to check the actual translation-status region instead of looking for the message inside the booking form. Patient-language access test passes in the full green suite. |

| H07 | [ ] CODE + TESTS PASS — PROVIDER CONFIG PENDING | “Password pahilyanda create karta ala pahije… badalta hi pahije”; secure mail/OTP recovery. | Provider-managed email recovery and password update are implemented and tested in PR42. This does not implement mobile OTP or 30-day remember-device; those remain separate. Required external configuration: set Vercel CLINIC_OWNER_EMAIL to the actual owner account email and allowlist the exact reset redirect URL in Supabase Auth. Vercel build-rate-limit blocks preview/live verification, so actual email delivery and token exchange remain unverified. Never share provider secrets in chat. |
