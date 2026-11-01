# Dr Kulkarni — permanent request and completion register

Updated: 1 November 2026 (application source tree 820219a5a22ce089ae3701f9ac0cfb0920e99e16; documentation-only main commit 27c7f910c56656ca8e500e2a0f153d7d95ae2172; exact-head CI and Vercel status SUCCESS; live visual verification pending).

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
| A09 | [ ] PARTIAL — SOURCE FIX IN REVIEW | Native three-language dropdown and patient form language | Exact review head `1bad3b399c682aba09688366dd1790ab3a41c128` contains the native `details/summary` selector after Patient Portal / Doctor Workstation and an in-flow open-panel override that defeats the global `.language-control>div{position:fixed!important}` rule by overriding position, inset/edges, width, max-height and overflow with `!important`. `tests/mobile-language-header.test.cjs` passed in Actions run `41168638561` (61 files). Actual 320 px / 390 px phone rendering and full authored EN/HI/MR translation correctness remain unverified because Vercel is rate-limited. |
| A10 | [ ] PARTIAL — SOURCE + CI VERIFIED | Header/language menu easy to use on phone and must not hide portal controls | Header is native `details/summary`, placed after Patient Portal / Doctor Workstation; the imported stylesheet's fixed-position override is neutralised for the open menu. The exact-head 61-file CI run passed. Real phone/live layout remains open; no visual verification is claimed. |

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
| D01 | [ ] CODE + TESTED — LIVE/PAYMENT HANDOFF VERIFY | QR hidden inside Payment methods, reveal when tapped; correct UPI payee and amount | Current main `6a7819277baf9d5dacb29d8082f4d3713f590aeb` contains the canonical `drkulkarnipg@upi` payee and dynamic amount-bearing QR logic from PR #75. Source/tests pass; Vercel reports `Deployment rate limited — retry in 24 hours`, so the latest QR build is not confirmed live. Still scan the real QR with a UPI app and verify payee/amount before payment; no settlement, Razorpay activation or refund workflow is claimed. |
| D02 | [x] LIVE | **Online consultation / Telemedicine notice: ₹500** | Implemented 26 Oct: hero link and English/Marathi notice, ₹500 clearly separated from home-visit fee; availability/suitability confirmed by doctor. Clinical regression and focused DOM checks passed; desktop preview inspected. Released PR19; live notice verified. |
| D03 | [x] LIVE | Say who should not rely on online consultation in severe conditions | Prominent English/Marathi warning beside ₹500: severe chest pain, severe breathing difficulty, sudden face/arm weakness or speech problems, collapse/unconsciousness; seek emergency help without waiting for booking/reply/payment. Primary MoHFW guidance checked; local desktop screenshot/hero navigation and focused DOM checks passed. Released PR19; production notice verified. Phone layout check remains. |
| D04 | [ ] TODO | Actual online consultation workflow | Availability confirmation, screening/consent and private access not end-to-end verified. Notice alone is not an operating consultation backend. |
| D05 | [ ] TODO | Razorpay / online payments | No verified merchant/KYC, server order/payment confirmation, webhook, refund flow. QR is not a verified payment gateway. |
| D06 | [ ] TODO | PDF receipt immediately after verified payment | Receipt number, amount/date/reference and authorised delivery with retries/status not implemented. Never issue paid receipt just because QR opened. |
| D07 | [ ] SOURCE + CI PASS — LIVE NOT VERIFIED | Separate service fees in the patient helper | Exact-head run `41168638561` passed the fee regression: ₹100 service-assistant/guided help, ₹500 online consultation and ₹1,200 daytime home-visit base are distinct; guided help is not a consultation; the helper does not collect payment. Doctor confirms availability/final home-visit amount. No payment gateway, billing configuration, secrets or payment collection was enabled. Live wording remains unverified. |

## E. Prescription, requisitions, consent and certificates

| ID | Tick / state | What you asked | Evidence or exact remaining action |
| --- | --- | --- | --- |
| E01 | [x] LIVE | Ordinary prescription/pathology/radiology generally ONE A4 page | Compact layout and isolated print root saved in PR19. Real html2pdf metadata: normal 5-row Rx, path and rad each one A4 page. Browser download completion timed out; owner's final save/print not verified. |
| E02 | [ ] PARTIAL | More pages only for actual longer content; no clipped text | Real PDF engine confirmed two pages for 42 synthetic rows; all rows and final signoff retained in clone. Fitness spacing corrected and one-page result verified; consent one page with both signatories. Broader filled examples/device output remain open. |
| E03 | [x] LIVE | Remove unnecessary date/DOB layout that makes Rx two pages | DOB editor stays onscreen, excluded from document clone; calculated age retained. Dates use compact fields; saved/tested. |
| E04 | [x] LIVE | **Signature, name, date and time** on every clinical document | Signoffs added/tested for Rx/path/rad/referral/consent; certificate issue/verification times and Form2 signatory dates/times. Blank signature lines; no fabricated electronic signatures or event dates. Released PR19; normal fitness/consent visual checks passed. All filled/device examples not claimed. |
| E05 | [x] LIVE | Requisitions actually mention date | Path time and radiology identity/date/time added; existing dates retained. Fresh cloned values tested. |
| E06 | [ ] PARTIAL — SOURCE READY, LIVE/JURISDICTION VERIFY | Fitness/unfitness/leave/Forms 2, 4, 4A all print/save/share properly; Form 2/4/4A separate downloads and languages | Main contains `/api/official-form-pdf?form=2|4|4a`, extracting the corresponding one-page form from the full official CRS PDF, with distinct filenames and synthetic page-extraction tests. The legal-forms panel also already links the **Maharashtra CRS handbook (2026)**, which contains Marathi and English CRS/MCCD material including Form 2, 4 and 4A. This is a full handbook, not a separate one-page state-form bundle; actual prescribed page/version and Maharashtra/Pune Registrar acceptance remain unverified. Reverse-side instructions stay in the full government sources. Current main Vercel status is rate-limited, so latest endpoint/UI is not confirmed live. Still test filled editable forms, actual file save/share/print, Hindi/Marathi guidance and local legal format. Do not present machine translations as official government forms or flatten multi-page official sources. |
| E07 | [x] SOURCE + REGRESSION VERIFIED — LIVE PDF/DEVICE HANDOFF PENDING | Lab choices: lipid profile, ammonia, iron studies | Main source contains separate selectable Lipid Profile (TC/LDL/HDL/TG), Serum Ammonia and Iron Studies (serum iron/ferritin/TIBC). PDF clone converts checked and unchecked boxes into explicit [x]/[ ] values; lab slip has separate A4 export/PDF-share route and clinical signoff. New `tests/requisition-coverage.test.cjs` passed in exact-head run `41326111081`. Actual filled PDF readability, selected-item rendering on a real device and recipient handoff remain pending. |
| E08 | [x] SOURCE + REGRESSION VERIFIED — LIVE PDF/DEVICE HANDOFF PENDING | Radiology: portable/bedside USG, separate arterial/venous Doppler, CT/MRI choices | Main source contains Portable Digital Chest X-Ray, Bedside USG Abdomen & Pelvis, separate Venous and Arterial Color Doppler choices, Bedside 2D Echo, NCCT Brain, CT Chest and MRI Brain/Spine. Radiology requisition has separate A4 export/PDF-share route and date/time/signoff mounting. New `tests/requisition-coverage.test.cjs` passed in exact-head run `41326111081`. Actual filled PDF readability, selected-item rendering on a real device and recipient handoff remain pending. |
| E09 | [ ] PARTIAL | Correct A4 output for every doctor/patient document | Existing 18 guide PDFs measured A4; new clinical normal cases checked. All filled certificates/intake/consent/overflow and physical device printing remain broader verification work. |

## F. Login, cloud data, security and automation

| ID | Tick / state | What you asked | Evidence or exact remaining action |
| --- | --- | --- | --- |
| F01 | [ ] PARTIAL | Fingerprint / Windows Hello should work | Native passkey code and production Supabase provider/RP configured; live challenge returned 200. Actual owner-device enrolment AND subsequent biometric login not verified. |
| F02 | [ ] CODE + CI VERIFIED — PREVIEW/LIVE PENDING | Remember this device 30 days; keep password fallback | Added explicit opt-in checkbox on Doctor login. API sets short-lived 15-minute HttpOnly Secure SameSite=Strict access cookie plus a 30-day HttpOnly Secure SameSite=Strict `__Host-` refresh cookie; refresh tokens rotate via Supabase, and owner ID is re-checked on refresh. Logout clears both cookies. Automated tests cover issuance, rotation, expired-token cleanup and UI opt-in. GitHub Actions run 41025556041 passed all 25 test files. Vercel latest status fails due build-rate-limit, so deployed behaviour is unverified. Mobile OTP remains separate.
| F03 | [ ] VERIFY | Login stuck at CAPTCHA; Supabase login via GitHub suspected | User reported blockage. Do not assume passkey-provider setup resolved CAPTCHA/dashboard OAuth. Reproduce exact remaining sign-in flow before closure. |
| F04 | [ ] TODO | CSP script-src and leaked-password protection | Audit-wide verification/hardening pending. Preserve legitimate dependencies/auth and do not weaken authentication to bypass CAPTCHA. |
| F05 | [ ] PARTIAL | Cloud patient records/registers and longitudinal EMR | Owner-authenticated coded trends exist. Full visits, medicines, labs, consent/certificate/document registers are not complete EMR. |
| F06 | [ ] PARTIAL | n8n actually active, not just a plan | Workflow seen in drkulkarni.app.n8n.cloud, inactive/unconnected endpoint/header credential. Production setup and successful manual + scheduled executions remain. Earlier claim that workspace URL was unknown is superseded. |
| F07 | [ ] PARTIAL | Research → analysis → independent review → writing → proofreading | Source controls, queue/checkpoints and tests exist; actual successful provider inference, spending limit and production flow not verified. No paid top-up authorised. |
| F08 | [ ] TODO | Daily midnight India research / practical evidence across fields | Scheduler execution not verified. Existing 19 feeds do not establish complete coverage or useful clinical benefit. |
| F09 | [ ] TODO | Notify doctor; visuals/videos and platform publication | Private review UI exists; actual finished media, authorised external delivery and automatic destination publication remain. No messages sent by this checklist task. |
| F10 | [ ] PARTIAL | Doctor approval before article publication | Approval-gated code/queue tests exist; complete destination/media approval and publishing flow still pending. |
| F11 | [ ] TODO | Connected patient FAQ/chatbot | Static FAQ exists. Real controlled clinical assistant with evidence/escalation not established. |
| F12 | [ ] CODE + CI VERIFIED — PROVIDER CONFIG/LIVE PENDING | Owner password recovery: email reset link, first-time password creation/reset, secure token handling. | Source implements owner-email-restricted Supabase recovery request and owner-ID-verified password update; token is removed from URL history and held in memory only, with no browser session created by reset. Added `CLOUD_RECORDS_SETUP.md` runbook clarifying first-time owner Auth user creation is a provider-dashboard task, the required `CLINIC_OWNER_EMAIL` environment variable, exact recovery redirect allowlist, SMTP delivery checks, 12-character minimum and invalid/expired/wrong-owner tests. The website cannot create an Auth identity when no user exists; no password or credentials are available to give in chat. Vercel current main is rate-limited; email delivery and live recovery remain unverified. |

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
| H02 | [ ] CI PASS — LIVE PHONE HANDOFF PENDING | Previsit long-history sharing must preserve the complete history and clearly tell the user nothing was shortened or sent automatically. | Exact-head run `41168638561` passed booking-intake checks for repeated symptoms, onset/triggers/relief, medicine rows, consent, complete PDF input, long-message fallback without truncation and no automatic persistence. Actual phone WhatsApp/PDF handoff and recipient-side receipt remain unverified; Vercel is rate-limited. |
| H03 | [x] CI VERIFIED — 61 FILES | Every correction must be tested; do not infer success from code presence. | Latest exact-head Actions run `41168638561` on `1bad3b399c682aba09688366dd1790ab3a41c128` completed **61 regression test files** successfully. Vercel build-rate-limit and device/provider checks are separate blockers. |

| H04 | [x] CI VERIFIED | Homepage must explicitly communicate home visits and bedside care. | Automated regression suite had an outdated expectation for “Thoughtful care” after the hero was changed to “Home visits. Care at your bedside.” Updated the test to verify the current explicit home-visit promise rather than restoring obsolete text. Full suite passes. |

| H05 | [ ] CI PASS — LIVE PENDING | Health Library article reader must have one Back action without duplicate Close/Share/Download tabs, while PDF actions remain available. | Added Share original PDF and Download original PDF to the nine guide cards, outside the reader. Reader retains one Back to Health Library control. Test verifies each of nine guides in authored English and Marathi, checks PDF download naming and compares shared PDF bytes with the expected guide asset. Full 24-file suite passes; live UI remains unverified due Vercel build-rate-limit. |
| H06 | [x] CI VERIFIED | Unavailable translation choices must show an honest status message without altering entered patient text. | Updated the test to check the actual translation-status region instead of looking for the message inside the booking form. Patient-language access test passes in the full green suite. |

| H07 | [ ] CODE + TESTS PASS — PROVIDER CONFIG PENDING | “Password pahilyanda create karta ala pahije… badalta hi pahije”; secure mail/OTP recovery. | Provider-managed email recovery and password update are implemented and tested in PR42. This does not implement mobile OTP or 30-day remember-device; those remain separate. Required external configuration: set Vercel CLINIC_OWNER_EMAIL to the actual owner account email and allowlist the exact reset redirect URL in Supabase Auth. Vercel build-rate-limit blocks preview/live verification, so actual email delivery and token exchange remain unverified. Never share provider secrets in chat. |


### Remembered-device and password recovery follow-up — 30 October 2026
- F02 implementation added on PR42 branch: Doctor login exposes an unchecked-by-default “Remember this device for 30 days (private computer only)” checkbox. The choice is passed to the same-origin API; only the clinic owner may receive an HttpOnly `__Host-clinicRefresh` cookie. Refresh-token rotation is performed server-side through Supabase and owner identity is revalidated. Access cookie remains short-lived; logout clears both cookies. No tokens are written to browser storage.
- Tests added to `tests/clinical-cloud.test.cjs` and `tests/workstation-auth.test.cjs`: 30-day cookie properties, refresh-token rotation, expired refresh cleanup, checkbox forwarding. Full CI run `41025556041` passed all 25 test files on Node 22.
- Latest source commit: `cd1198b800171f34f3ce5e54971647039f49d3f3`. Vercel check is `failure` due `build-rate-limit` (“retry in 24 hours”); do not merge this batch or call it live until a preview can be tested. Supabase `CLINIC_OWNER_EMAIL` and recovery redirect allowlist are external setup requirements. Mobile OTP is still not implemented.


## I. Owner's full 30 October instruction file — sentence-by-sentence reconciliation

- Authoritative matrix: [AUDIT_SENTENCE_BY_SENTENCE_2026-10-30.md](AUDIT_SENTENCE_BY_SENTENCE_2026-10-30.md). It maps each atomic requirement from the owner-supplied 166-line file to source evidence, required correction, verification criteria and status.
- Owner explicitly resumed the website work on 30 October. The earlier 26 October pause is superseded for the newly requested audit/correction work; it still prohibits treating preview code as production or bypassing explicit release approval.
- Active editing workflow remains PR42 branch `fix/upi-payee-single-source-20261030`. Audit matrix added in commit `4047831dbf1230b8264d63b26fa15a5a623dd2ba`; it is not a production deployment.
- Current CI evidence: run `41025556041` passed 25 test files on commit `cd1198b800171f34f3ce5e54971647039f49d3f3`. It must not be described as testing later commits unless a newer successful run explicitly names that exact head.
- Current deployment blocker: Vercel returned `build-rate-limit` for the review head; preview and production behaviour cannot be certified from that result. Retry after the provider's stated rate-limit interval; do not bypass the provider limit or merge without preview verification and owner release approval.
- First correction batch to finish: (1) confirm exact current branch/head and run CI on the latest head, (2) reconcile stale UPI payee paths, converters and diet preset rendering, (3) inspect requisition/document share output, (4) test login recovery code and record external configuration requirements, (5) test patient/death/stock register UI and migration/RLS separately.
- Keep each matrix row open until its own verification is complete. Record completed/preview/pending/blocked counts in each handoff. Never put bank credentials, authentication secrets or real patient data into repository files.


### Prescription safety correction — 30 October 2026
| ID | State | Original request | Current evidence / remaining action |
|---|---|---|---|
| H08 | [ ] CI PASS — PREVIEW BLOCKED | Add medicine rows; preserve work and avoid unintentional data loss. | The active `preserved-features.js` override had drifted from the eight-column prescription table: its five-argument helper omitted separate strength and timing-select cells. Corrected it to the six-argument medicine/strength/timing/frequency/duration/instructions structure with a blank timing select and delete control. `drug-catalogue` and `prescription-initialization` passed in exact-head run `41168638561`. Live PDF, long-row and phone checks remain pending. |


| H09 | [ ] CI PASS — LIVE DATABASE TEST NOT RUN | Doctor Workstation Daily Patient / Death / Stock Register must open and render its fields. | Exact-head run `41168638561` passed register API, migration-static and UI checks. No Supabase migration was applied; live owner/non-owner RLS, backup/restore and production persistence remain unverified. |


| H10 | [ ] CI PASS — PREVIEW BLOCKED | Prescription and requisition PDFs must use clear document-specific filenames, not the doctor's name. | `tests/document-filenames.test.cjs` passed in exact-head run `41168638561`. Actual device download names and PDF readability remain pending. |


| H11 | [ ] CI PASS — PREVIEW BLOCKED | Do not assume the patient has no known drug allergies unless verified. | Blank allergy status and the explicit confirmation prompt are covered by the clinical-document regression group; exact-head run `41168638561` passed. Live prescription review remains pending. |


| H12 | [ ] CI PASS — LIVE DEVICE PENDING | Health Library articles should open in a clean reader with normal browser Back/Forward behaviour, not redundant share/download controls on patient guide cards. | Reader-exit, patient-education and article/PDF preservation tests passed in exact-head run `41168638561`. Real device navigation and rendered PDF output remain pending. |


Correction to previous audit note: guide-card PDF Share/Download actions are intentionally retained because they are separate from the article reader. The requested uncluttered reading flow applies to the reader itself; browser Back/Forward support is being tested. Latest test-driven adjustment: c516719d896653ca1924d3b7fe07f0f716bbf7cf.


## Release and audit update — 30 October 2026 (after owner instruction)

- Owner's latest instruction: treat the attached `Pasted text(20261030-092936).txt` as controlling; read every request, implement without asking the owner to repeat it, continue through the backlog, and report the exact request / verified action / remaining work. This does **not** authorize inventing clinical guidance or claiming unverified functionality.
- PR #42 was merged to `main` as `233040e281ff975e151d98f77bb606768074d54f`. The pre-merge regression run `41033185988` passed on branch head `a33dff87a6068a54f6085d758d3f9df9b403fb96`; post-merge regression run `41033995852` completed successfully on the exact main commit `233040e281ff975e151d98f77bb606768074d54f`.
- Vercel commit status for `233040e281ff975e151d98f77bb606768074d54f` reports **success — deployment completed**. This confirms deployment status, not every user journey, real-device share, physical print, third-party email delivery, or payment settlement.
- The merged batch includes UPI payee URI consistency, temperature/weight conversion wiring, prescription blank-row/allergy safety, document-specific filenames, article-reader browser history, workstation register UI/API source, password-recovery UI/API source, and their regression tests. Live verification remains separate.
- **Still blocked / not claimed complete:** the Supabase register migration must be reviewed and applied in the correct project; recovery email requires owner-email environment configuration and the Supabase redirect allowlist; Razorpay merchant/KYC/order/webhook/refund and payment settlement are not established; real device OTP/passkey, native phone/WhatsApp share, PDF save/print, filled government forms, and physical layout need actual-device checks. Do not expose bank account details in public HTML or logs.
- The companion `ATTACHMENT_LINE_RECONCILIATION_2026-10-30.md` maps every non-empty source line of the newly attached requirements to the existing task IDs and unresolved work. Composite source lines are explicitly broken into requirement clusters; unresolved rows remain open.


## Latest implementation batch — 30 October 2026

- **PR #43 — calculator reference guidance:** merged as `5bea88738cd68475c38449b6eb4415416de47e46`. All 30 calculator cards now include substantive reference/interpretation text and a source link. CI passed on the exact feature-branch head (`41034480738`); main regression subsequently passed on `7391f48fb1d0aad3a82914a5294997a3ec8624dc`. Ranges are not universal where patient/lab context governs.
- **PR #44 — Article Manager:** merged as `7391f48fb1d0aad3a82914a5294997a3ec8624dc`. Fixed the pager's visible class-name text; Refresh/Load controls have consistent action styling; Start a new cloud article now confirms before clearing editor text and then resets the entire editor while preserving saved cloud articles/backups. Regression passed on feature head (`41034945701`) and main (`41035145290`).
- **PR #45 — prescription PDF footer:** merged as `cde9f74684036f556100d1e514240d4f57278673`. Prescription PDF now omits the website URL/provenance footer and per-page website/legal stamp, with compact 8 mm margins. Other clinical documents retain provenance. Feature-branch regression passed (`41035676332`); main regression passed on this merge (`41035831773`).
- **Deployment blocker:** Vercel reports `Deployment rate limited — retry in 24 hours` for main commits after `233040e281ff975e151d98f77bb606768074d54f`. Therefore the calculator, article-manager and prescription-footer changes are merged and tested in source but **not confirmed live**. Do not claim them deployed until Vercel reports success and the actual website/PDF output is checked.
- **Next critical work:** finish end-to-end live/device checks after deployment access returns; resolve Supabase register migration/RLS and owner recovery-email configuration; verify exact government Form 2/4/4A exports and separate official originals; test payment gateway/settlement; continue auditing intake, navigation, article imports, RSS execution and all other open rows.


## Navigation, intake and registration corrections — 30 October 2026

- **PR #46** merged as `757786cb0801ada719909982ab8fb942f148ae59`: Article Manager now shows the existing Live RSS/evidence-review panel as well as the dedicated RSS tab. Regression run `41036276758` passed.
- **PR #48** merged as `1e21b4fe62680f4ce302643b7a31f43b6c1c000a`: registration number uses a dedicated non-wrapping sans-serif baseline style; identifier remains `I-24809-A-1`. Regression run `41036407568` passed.
- **PR #47** merged as `aab1741e32dd1489a8756fb6d44e19f5c9cd6230`: home-visit intake opens only the essential patient/problem sections; detailed symptoms/history remain available but collapsed; attachment and consent controls appear before optional details; LMP and optional measured weight/height/BMI fields are included. Regression run `41036578805` passed.
- Main regression run `41036710598` passed on exact commit `aab1741e32dd1489a8756fb6d44e19f5c9cd6230`.
- Vercel status remains **failure: Deployment rate limited — retry in 24 hours**. These latest changes are merged and tested in source, not confirmed live. Last positively confirmed deployed commit remains `233040e281ff975e151d98f77bb606768074d54f`.
- Keep the current blockers explicit: actual live/mobile checks, secure attachment sharing, exact official Form 2/4/4A outputs, Supabase migration/RLS, recovery email provider setup, and payment gateway settlement.


## Deployment status correction — 30 October 2026

- Vercel status for current main commit `0ba9a434f6a39535fdf3a654b31ec86c16776663`: **success — deployment completed**. The earlier rate-limit blocker is no longer the current status for this commit.
- The deployed code includes the home-visit intake, RSS/Article Manager grouping, registration-number styling, homepage search and mobile-navigation wrapping changes.
- Live interaction, actual device share/print, government form outputs, real payment settlement, Supabase migration/RLS and recovery email remain feature-level verification tasks.


## Latest source/deployment checkpoint — 30 October 2026

- Current main `6b551b4450422978d01683e0474f19047a761cf0` passed regression run `41038198126`.
- Latest successful application-code deployment is still `0ba9a434f6a39535fdf3a654b31ec86c16776663`; Vercel rate-limits current main, so later app-code changes are not confirmed live.
- New source correction: prescription, pathology requisition and radiology requisition PDFs omit website footers; editable government Form 2/4/4A working layouts retain the explicit legal-status disclaimer. Original government PDFs are untouched.
- Keep payment settlement, Supabase migration/RLS, recovery email, native share/print, separate Form 4/4A downloads and live/device checks open.
- Hold additional application merges until Vercel allows a new deployment or a paid upgrade is explicitly authorized.


## Builder-agent checkpoint — 30 October 2026, 10:12 India

- PR #54 merged as `3b053a276111394a1dd212c191d9549e05e67f89`: added `data/external-link-inventory-2026-10-30.json` and `data/feature-preservation-registry-2026-10-30.json`. The initial committed inventory covered ten key files only; this was corrected in the current inventory-refresh branch to scan 86 active source files and 220 unique URL literals/templates. The link scan records source-line evidence and does not imply that every destination has been manually verified.
- PR #56 is open for a test-only guard against duplicate DOM IDs and broken in-page anchor targets. Baseline measured: 478 IDs, no duplicates; 14 explicit hash links, no missing target. Wait for CI before merge.
- Closed PR #33 and #34 because their implementations are already present in current main in newer form. #33: native browser Back/Forward for Health Library. #34: Previsit consent/attachment validation, full PDF sharing for long histories/files, WhatsApp fallback, and manual-send disclosure. Both old branches were 27 commits behind; no feature code was discarded from main.
- Latest source-only checks: Patient Portal language selector has responsive wrapping rules; public “Elderly care” wording is present; patient “Know your numbers” links to `#patientToolsSection`; all in-page anchor targets exist; prescription export uses `Prescription.pdf`; allergy field is blank with a confirmation placeholder; registration number has a no-wrap class.
- Latest verified automated CI is successful on main `af656eb1a6f999182e8cff6b56fcd308a2d2c365` and on PR #54. Current main after PR #54 is `3b053a276111394a1dd212c191d9549e05e67f89`; verify its post-merge deployment independently.
- No production database migrations, payment setup, credentials, paid subscriptions, or destructive operations were changed. The workstation register migration remains manual pending backup, Supabase owner/RLS validation and restore test.
- Next: complete the broader sentence-by-sentence audit; inspect all source files for external destinations and unresolved placeholders; test live desktop/mobile flows and PDFs; verify Form 2/4/4A sources for Maharashtra/Pune; confirm provider configuration and secure media storage; record deployment smoke-test evidence.


## Builder-agent continuation — owner setup and official forms audit, 30 October 2026

- Re-read controlling attachment `Pasted text(10).txt` in full. Its non-negotiables remain: preserve existing code/data/features; explicit sentence-by-sentence mapping; visible, unclipped tabs; secure first-time password setup/recovery; separate Form 2/4/4A downloads; English/Marathi/Hindi form support; article/device/cloud/media import and export; working RSS/evidence workflow; payment QR/gateway; and actual live/device verification.
- PR #79 was intentionally closed as a duplicate after verifying that the official CRS PDF extraction endpoint, `pdf-lib` dependency, one-page output tests, and separate download routes are already present on main. Its stale `index.html` would have overwritten newer language-selector/navigation fixes; no stale branch was merged.
- Added a setup runbook revision on a docs-only branch: exact server environment variable names, provider dashboard first-time owner-account setup, Supabase email recovery redirect allowlist, SMTP delivery checks, token-expiry/wrong-owner tests, optional passkey activation and manual register migration/RLS checks. Added a regression test to keep those security claims aligned with source.
- Current main: `1ccd34769734b30e83d1ce9ab1bad34a221446ec`. Vercel status is **failure: Deployment rate limited — retry in 24 hours**. Therefore code merged after the last successful deployment must not be described as live. No paid Vercel upgrade was purchased or authorised.
- Still open: actual Supabase/Vercel provider configuration cannot be verified from repository source; real email recovery and passkey registration; manual workstation-register migration and RLS/non-owner test; exact Form 2/4/4A local-registrar acceptance and Hindi/Marathi forms; QR scan/payment settlement; real WhatsApp/email attachment handoff; device PDF print/save; global language coverage; cloud media import; complete RSS/AI workflow; full visual/accessibility/performance/SEO audits.


## Builder-agent continuation — inventory refresh and current evidence, 30 October 2026

- **PR #80 merged** as `e138c096b35367a93385ec438c0ff00c0b33a309`: owner password-recovery setup, register activation, current CRS form-source notes and durable checkpoint.
- **PR #81 merged** as `6a7819277baf9d5dacb29d8082f4d3713f590aeb`: fixed invalid trailing literal backslash-n in generated inventory JSON; classified Europe PMC API root as a service endpoint, dynamic Google Translate URLs as runtime templates, and generated Tailwind CSS as non-navigable; audit output now lists unresolved destinations. Regression and external-link audit passed.
- **Current inventory-refresh branch** `audit/run-external-link-check-inventory-refresh-20261030` regenerates the committed link inventory and adds a test that it matches the active source. It scans **86 files / 220 unique destinations**: 172 static external destinations, 25 runtime templates, 3 placeholders, 2 domain allowlist entries, 17 internal routes/assets and 1 service endpoint.
- Fresh audit run `41090111191`: 172 static destinations checked; 130 reachable; 31 blocked/rate-limited; 3 method-not-allowed; 2 timeouts; 4 network errors; 1 HTTP 406 (Radiopaedia; manual browser check); **0 HTTP 404/410 broken destinations**. These results are from the audit runner, not a full human click-through. Blocked, timeout and network-error URLs remain unresolved until browser/manual verification.
- Current main source baseline `6a7819277baf9d5dacb29d8082f4d3713f590aeb`; regression CI passed. Vercel still reports **Deployment rate limited — retry in 24 hours**. The latest application code is not confirmed live. No paid upgrade or hosting change was made.
- Remaining release gates: actual Supabase owner email recovery and passkey ceremony; manual register migrations/RLS and restore test; QR scan and payment settlement; real device WhatsApp/email share and PDF print/save; translated official/local form verification; cloud media import; RSS/evidence provider end-to-end execution; security-header/CSP hardening; remaining visual, accessibility, performance and SEO checks.

## Builder continuation — source-file disambiguation and exact latest attachment — 30 October 2026

- **Important source correction:** `Pasted text.txt` is the earlier 1,991-line master specification; `data/attachment-line-traceability-2026-10-30.jsonl` and `data/attachment-sentence-traceability-2026-10-30.jsonl` belong to that file. Their metadata has been corrected so they no longer misidentify it as `Pasted text(10).txt`.
- The **actual latest attachment `Pasted text(10).txt`** has 166 total lines and 63 non-empty lines. Added `data/pasted-text-10-line-traceability-2026-10-30.jsonl` with 63 mapped source lines and `data/pasted-text-10-sentence-traceability-2026-10-30.jsonl` with 220 sentence/fragment units. 29 lines contain multiple punctuation-delimited units. Regression tests verify exact reconstruction of each public-safe line and inheritance of evidence pointers/remaining gates.
- One line of the latest attachment contains a bank account number and IFSC identifier. Those identifiers are **redacted only in the public GitHub traceability copies**. The original attachment in the private conversation is unchanged. Do not expose account/IFSC data on the public website; use only the intended public payment identifier and independently verify its payee.
- The earlier master-specification ledger has 1,059 source units across 1,991 source lines; current line-status counts are 591 PARTIAL, 12 OPEN/BLOCKED, 452 CONTEXT RECORDED and 4 INDEXED. These are evidence-map states, not claims that the requirements are complete.
- Current main baseline is `ae4c8d4152f7805f40a074c3d162a300257713e1`; its regression CI run `41090892579` passed. Vercel status on current main remains rate-limited, so the latest source is not confirmed live. This documentation branch still requires its own CI result before merge.
- Remaining external gates include owner email recovery/passkey setup; backup and verified restore; register migration/RLS; real UPI transaction/settlement/refund; secure cloud media; RSS/AI provider execution; official/local form acceptance and language verification; and real desktop/mobile, WhatsApp, PDF save/print and post-deployment smoke tests.


### Calculator label test reconciliation — 30 October 2026

| H13 | [ ] CI PASS — CLINICAL/LIVE REVIEW PENDING | Each calculator must display the standard reference range / threshold / interpretation and linked source. | Exact-head run `41168638561` passed the UI checks for 2 public + 28 clinical calculators and 935 calculation assertions. Individual clinical source/threshold review and live rendering remain separate gates. |


### Document sharing follow-up — 30 October 2026

| H14 | [ ] CI PASS — DEVICE DELIVERY OPEN | Lab/radiology requisition and patient-history sharing must pass the actual PDF/file to a supported app and not leave a stuck share modal. | Exact-head run `41168638561` passed document-sharing checks, including retained original attachments after a failed direct share and successful retry-dialog closure. Real phone share sheet, WhatsApp and recipient-side delivery remain unverified. |


### Article manager import-toolbar follow-up — 30 October 2026

| H15 | [ ] CI PASS — PROVIDER/LIVE QA OPEN | Place article-fetch controls above the content box; make cloud Refresh, Load and Start visibly boxed and functional. | Public article editor and unsaved-content tests passed in exact-head run `41168638561`. Real owner-authenticated cloud refresh/load and cross-device persistence remain unverified. |


### Pre-visit form compactness regression — 30 October 2026

| H16 | [ ] CI PASS — LIVE MOBILE QA OPEN | Keep pre-visit intake short: only essential patient/problem sections open; optional details remain collapsed without removing fields. | Booking-intake test passed in exact-head run `41168638561`; sections 1–2 open, sections 3–6 remain optional/collapsed. Actual 320/390 px phone layout and WhatsApp/PDF handoff remain pending. |


### Settings control preservation / webhook safety — 30 October 2026

| H18 | [ ] CI PASS — EXTERNAL INTEGRATION NOT CONNECTED | Preserve existing interface controls without allowing browser-side webhook secrets. | Exact-head run `41168638561` passed the calculator/UI preservation check for the disabled webhook placeholder. Make/n8n provider execution remains disconnected; no browser-side secret was added. |


### Workstation register security review — 30 October 2026

| H19 | [ ] CI PASS — LIVE DATABASE TEST NOT RUN | Test daily patient, death and stock register UI/API and review RLS separately. | Exact-head run `41168638561` passed register API/UI and static migration checks. The migration was not applied; live Supabase RLS and backup/restore remain open. |


## 31 October 2026 — exact-head continuation (review branch only)

- Main baseline: 12608d35c02b3afe76a10995e95ebb521087eae4. Latest main regression run 41108470448 failed in tests/external-link-inventory-generator.test.cjs because committed source-line evidence was stale. The run had already passed booking-intake, calculator UI and document-sharing tests before the inventory assertion stopped the suite. This is not a full-suite pass.
- Safe inventory regeneration: a dedicated GitHub Actions run regenerated the inventory from the corrected review-branch source snapshot after the language-panel and Article Manager source changes. It records 86 source files, 221 unique destinations and source revision e0eaf16beca69f547c47f482dd3b3fde1d04b59d. Temporary diagnostic logging was removed. Review-branch run 41165663130 then passed all 60 regression test files; main remains unchanged and its run still fails.
- Mobile language overlay: the root cause is a cascade conflict, not simply the HTML element type. The global fixed-position rule is important, but the prior in-flow open-panel override was not. The review branch adds a full in-flow override and a regression test that reads the imported stylesheet. No physical phone or live Vercel screenshot is claimed.
- Article Manager / RSS isolation: the review branch moves the RSS/evidence panel inside Article Manager when articlesHub is selected and restores it to its original workstation position for the dedicated RSS tab. The updated test exercises both directions and confirms no second top-level workstation section remains visible.
- Fees/payment display: the patient-helper answer names ₹100 guided help, ₹500 online consultation and ₹1,200 daytime home-visit base separately; it does not claim payment is collected. The public panel now identifies UPI/QR/gateway/bank-transfer methods; the existing UPI link/QR was retained unchanged, Razorpay and BillDesk remain disabled, and bank-transfer instructions route to the doctor contact chooser without publishing account details. No new gateway backend, merchant credentials, billing configuration or database migration was added; D05/D06 remain open.
- Patient education: the source dataset contains nine detailed authored guides. Four source-linked drafts (COPD, cancer palliative care, diabetes and cirrhosis) are saved under content/clinical-topic-drafts-2026-10-31.md, deliberately outside the public article dataset. A test prevents accidental import/linking. They are drafts only; physician review, local adaptation and qualified Marathi translation remain required.
- Deployment: main Vercel status is build-rate-limit; last successful Vercel status is commit 57d011721e92903c53f76035f43520c296502906. PR #85 head 5d37ae7208e41e30189698b784ecce13733fd223 has a successful Actions run but its Vercel status is rate-limited. Neither fact proves latest source is live.
- Release boundary: all new corrections are review-branch source only. Do not merge, enable payment, alter provider secrets, change hosting configuration, apply database migrations, or publish clinical drafts without the required owner approval. Actual 320 px / 390 px device verification, live navigation, Know Your Numbers cards, booking/BMI, PDF share and WhatsApp recipient-side delivery remain unverified.
- **Patient article reading/PDF actions:** Download PDF and Share PDF now remain on each Health Library card; the article reader retains the standard Back to Health Library path and does not gain extra close/share/download controls. The full article/PDF preservation test passes.
- **Traceability:** the sentence-level test now preserves segment-specific evidence/status rather than forcing every sentence fragment to copy the parent line's roll-up. The affected language-panel source lines and sentence fragments were updated to the current review-branch evidence.

- **Review PR:** draft PR #86 is open at https://github.com/drkulkarnipg-lang/doctor-at-home/pull/86 on head b4e52c1daa248fc43dca6d674013bf273e64667c. It is review-only and must not be merged without owner approval.
- **Latest checks:** Actions run 41165663130 passed all 60 regression test files on that exact head. Vercel status for both main and the review head is build-rate-limit; no preview URL or live rendering is verified.


## 31 October 2026 — exact-head verification update

- Main remains unchanged at `12608d35c02b3afe76a10995e95ebb521087eae4`. Its Actions run [41108470448](https://github.com/drkulkarnipg-lang/doctor-at-home/actions/runs/41108470448) fails at `tests/external-link-inventory-generator.test.cjs`: the committed link inventory has stale source-line evidence. Booking-intake, calculator UI and document-sharing tests passed before the failure. No main-source change is represented as complete.
- Draft PR [#86](https://github.com/drkulkarnipg-lang/doctor-at-home/pull/86), branch `fix/mobile-language-article-fee-20261031`, exact source head `88d20e746a1a8de9eb37ea0062686ccfdad51658`: Actions run [41165836847](https://github.com/drkulkarnipg-lang/doctor-at-home/actions/runs/41165836847) completed successfully on that exact SHA. The job log confirms **60 regression test files**, with no failed test groups. This is review-branch CI evidence, not a merge or production release.
- The inventory refresh records 86 active source files and 221 unique extracted destinations, with source revision `e0eaf16beca69f547c47f482dd3b3fde1d04b59d`. The generator regression compares destinations, classifications and exact source-line evidence against a fresh scan. Automated inventory coverage is not a live HTTP or clinical-source validation.
- The phone language-panel root cause is the global `.language-control>div{position:fixed!important;...}` rule in `international-portal.css`. Its fixed positioning defeated the earlier lower-specificity in-flow override. The review branch now overrides position, every viewport edge, width, max-height and overflow with `!important`, and the regression test inspects the imported stylesheet. The 320 px / 390 px rendered-phone check is still pending.
- Article Manager now reparents the RSS/evidence panel inside its own section, and restores it to the original workstation position for the dedicated RSS tab. Both switching directions and ordinary-tab isolation are covered by the regression test.
- The patient helper explicitly distinguishes ₹100 service-assistant/guided help, ₹500 online consultation and ₹1,200 daytime home-visit base; it says guided help is not a medical consultation and the helper does not collect payment. No payment was enabled or collected. Existing UPI/QR behavior is unchanged; Razorpay/BillDesk remain disabled.
- Four source-linked clinical drafts (COPD, cancer palliative care, diabetes and cirrhosis) are kept outside the public article dataset. They remain unpublished pending physician review, India-specific adaptation and qualified Marathi translation.
- Vercel reports `build-rate-limit` for main and the review head. The last positively confirmed Vercel success remains commit `57d011721e92903c53f76035f43520c296502906`. No current preview, 320 px / 390 px rendering, PDF/WhatsApp recipient-side delivery or live booking journey is verified. No secrets, billing configuration, hosting settings, database migrations or clinical publication were changed.
- Keep PR #86 as a draft and do not merge/deploy until the owner approves and the live/device release checks can be completed.


## 31 October 2026 — review-preview deployment verification

- Review branch `fix/mobile-language-article-fee-20261031` commit `65c482a986e44d81452d58c09c98469447cdd837` has a successful full regression run: [Actions 41166510024](https://github.com/drkulkarnipg-lang/doctor-at-home/actions/runs/41166510024), **60 test files, zero failures**.
- Vercel status for that review-branch commit is **success — Deployment has completed**. Preview: https://home-visiting-icu-doctor-pune-git-fix-8f4b2e-drkulkarnipg-lang.vercel.app . This is a branch preview, not a production deployment.
- Main remains at `12608d35c02b3afe76a10995e95ebb521087eae4`; its run `41108470448` still fails at the stale external-link inventory source-line assertion. Main's Vercel status remains build-rate-limited; last confirmed production success is still `57d011721e92903c53f76035f43520c296502906`.
- The preview URL was obtained from Vercel's deployment-completed status. A connected browser/device renderer is unavailable in this run, so no visual/interaction claim is made for 320 px, 390 px, navigation, booking/BMI, PDF or WhatsApp recipient delivery. These remain release checks, not CI results.
- PR #86 remains a draft and unmerged. Do not promote the preview to production or merge the branch without the owner's release approval and the required live/device checks.


## 1 November 2026 — merged-main CI and deployment checkpoint

- **Main source head:** `fe09009b3bd3e0f2a561fe7ca854ebe52d16956d`. The owner's approved PR [#86](https://github.com/drkulkarnipg-lang/doctor-at-home/pull/86) is merged into `main`; the earlier entries describing PR #86 as draft/open/unmerged are historical and are superseded by this checkpoint. The merge includes the final approved replacement signature asset at `assets/doctor-signature.svg`.
- **Latest exact-main regression:** GitHub Actions [run 41206419688](https://github.com/drkulkarnipg-lang/doctor-at-home/actions/runs/41206419688), run #1090, completed successfully on this exact commit. The `node-regression` job passed and its log states **Completed 61 regression test files**. The log specifically confirms:
  - `tests/external-link-inventory-generator.test.cjs`: full-source inventory generation and valid on-disk JSON output passed; the prior stale-source-line inventory failure is no longer reproduced on this main head.
  - Article Manager / RSS grouping passed in both switching directions; the mobile language/header and responsive-navigation regression checks passed.
  - Patient helper fee clarity passed for ₹100 guided help, ₹500 online consultation and ₹1,200 daytime home-visit base, without claiming that payment is collected.
  - Patient education checks passed for the nine existing guides; COPD, palliative-cancer, diabetes and cirrhosis topic drafts remain unpublished behind the physician-review gate.
  - Prescription initialization/row preservation, document sharing, public navigation, booking intake, BMI/calculator UI, payment-method disclosure and PDF-related software checks passed. The calculator suite reports 935 assertions across 30 calculators.
- **CI log caution:** the otherwise-successful run contains jsdom uncaught console output in test execution (including missing `tailwind` and `render` references in the workstation-register UI test). The test file and overall job still report success; this is recorded as a test-harness warning for later review, not as evidence of a failed regression assertion or of a live-browser defect.
- **Vercel:** the GitHub `Vercel` status context for this exact `main` commit is now **success**. Deployment record: [Vercel deployment](https://vercel.com/drkulkarnipg-lang/home-visiting-icu-doctor-pune/5wHU33jxeuhy5GZBBfZz1E35FRv2). This supersedes the earlier build-rate-limit/pending status recorded for previous commits. It confirms Vercel's successful deployment status only; it does not establish a manual visual walkthrough or recipient-side delivery.
- **Still open — real rendered/device checks:** no evidence in this run establishes the actual page rendering at 320 px and 390 px, physical-device navigation/target operation, public Know Your Numbers cards, a live booking/BMI journey, PDF save/print/share on a real device, or native WhatsApp handoff and recipient receipt. Keep each item open until directly exercised and evidenced. The connected browser/device context was unavailable for this run, and external page retrieval was not successful.
- **Clinical and financial release boundaries:** the four new topic drafts remain unpublished for physician review, India-specific adaptation and qualified Marathi translation. No payment gateway was enabled, no payment collection is claimed, and no billing configuration, secrets, hosting configuration or database migration was changed.
- **Inventory evidence boundary:** the regenerated committed inventory is now covered by a passing exact-main regression. This is repository/source evidence; it is not a live HTTP reachability audit of every external destination.


## J. 1 November 2026 — current verified main status (supersedes older 31 October head references)

| Item | Current evidence | Exact remaining work |
|---|---|---|
| Main release head | `8666b92d69fe80638f2185ea0f5cf5943f4c6762`. Vercel status for this exact commit: SUCCESS. GitHub Actions run `41325633145`: completed SUCCESS; `node-regression` and “Run every repository regression test” passed. | This verifies CI and Vercel build/deployment status, not every real-device/provider workflow. |
| Registration number | Owner-approved format is `I24809-A-1` (no extra hyphen after I). Main HTML and clinical document output use this format. Updated the stale `tests/prescription-registration-layout.test.cjs` expectation to the owner-approved value; full suite then passed. | Preserve this exact format in future documents/tests. |
| External link inventory | Inventory mismatch corrected across the active source file set. The generator regression test passed in the final green run. | Full destination reachability and user-click verification remain a separate audit. |
| Protected original | Branch `backup/baseline-2026-10-31-pre-stitch` still points to exact original commit `ab8855374d376cca6e2158417385f10bebcb4965` (verified via Git refs API). | Never move, rewrite, merge into, or delete this branch. |
| Doctor login | Current main UI is email/password (owner email prefilled); server supports owner-restricted email recovery. Passkey is optional and provider-gated. | Username login and mobile OTP are NOT implemented. Do not claim OTP or fingerprint sign-in active. Do not weaken existing auth or create a local PIN. Requires verified Supabase phone factor/provider configuration and owner approval/testing. |
| Cloud patient records/registers | `CLOUD_RECORDS_SETUP.md` explicitly states no database was provisioned and no patient record uploaded during development. Owner-authenticated API/schema code exists. Register migration `20261030_workstation_registers.sql` is manual and has not been applied. | Supabase/Vercel account connection, correct environment variables, owner Auth UUID/member row, migrations, RLS tests, synthetic two-device save/reload and restore test are all pending. No real patient data until verified. |
| Passkeys | API/UI code exists; `PASSKEY_SETUP.md` states Supabase passkey activation and actual device registration/login are not complete. | Owner must register and test a passkey on the real main-site domain; retain password fallback. |
| Stamp images | Owner supplied original round and rectangular stamp photos on 1 Nov and explicitly said use as-is, no artwork/redraw. Local images were inspected and identified, but no binary asset has been committed to GitHub. | Add exact original images, not redrawn versions; integrate only into the intended doctor-signed documents. Keep patient/relative/witness signature areas blank. |
| Live visual audit | Vercel reports SUCCESS for the exact green main commit. Browser connector was not available in this desktop session; public site fetch could not be independently rendered here. | Actual 320/390px mobile, desktop, phone dialler, WhatsApp/PDF handoff and print/download checks remain open. |

**Release truth rule:** CI SUCCESS + Vercel SUCCESS is not proof of Supabase connectivity, SMTP delivery, OTP/passkey activation, register persistence, stamp integration, payment settlement or device rendering. Keep those rows open until directly tested. Updated after the exact-head green run; do not reuse the older `1bad3b3...`/61-file claim as evidence for later commits.


**E07/E08 follow-up — 1 November 2026:** Added `tests/requisition-coverage.test.cjs` to lock the requested pathology/imaging options, separate arterial/venous Doppler identifiers, A4 export routes, PDF-share mapping, checkbox preservation and requisition signoff. Exact-head commit `faba5316844107d68b826b5a99497f50242c99ac`; Actions run `41326111081` passed the full repository regression suite; Vercel status SUCCESS. This is source/CI evidence only, not owner-device PDF/share confirmation.

| H20 | [ ] NOT IMPLEMENTED — SOURCE AUDIT | Death Form should auto-populate the Death Register once, without duplicate manual entry. | `exportCurrentDeathFormPdf()` exists in `index.html`; `workstation-registers.js` has an independent Death Register form/save flow. No linkage, event bridge or auto-population found in current source. Must design a safe one-time handoff with explicit save confirmation, owner identity and duplicate protection; preserve correction/revision audit. |

**1 November 2026 — death-form/register linkage audit:** inspected `index.html` and `workstation-registers.js`. The Death Form PDF export and Death Register currently remain separate workflows. Owner requirement for automatic register population is not implemented. Keep H20 open; do not state death form auto-populates the register.


## K. 1 November 2026 — latest exact-main monitoring checkpoint

## 1 November 2026 — latest exact-main monitoring checkpoint (supersedes earlier main-head and deployment entries)

- **Current main:** 820219a5a22ce089ae3701f9ac0cfb0920e99e16. The prior base source head 12608d35c02b3afe76a10995e95ebb521087eae4 is an ancestor, not the current branch head.
- **Latest GitHub regression:** [Actions run 41333482047]( https://github.com/drkulkarnipg-lang/doctor-at-home/actions/runs/41333482047 ), run #1264, completed SUCCESS on this exact main SHA. The node-regression job and its “Run every repository regression test” step both completed successfully. The current repository tree contains 64 regression-test files. This is exact-head CI evidence, not live-site or device evidence.
- **Vercel for current main:** status is FAILURE with build-rate-limit. [Vercel status]( https://vercel.com/drkulkarnipg-lang?upgradeToPro=build-rate-limit ). The latest main head is therefore **not confirmed deployed**. The last confirmed production-success commit remains 57d011721e92903c53f76035f43520c296502906. An earlier success on a prior commit does not supersede this newer failure.
- **External-link inventory:** data/external-link-inventory-2026-10-30.json currently covers 90 active source files and 243 extracted destinations. The full-suite run passes tests/external-link-inventory-generator.test.cjs; its generated file list, destinations/classifications and source-line evidence are compared with a fresh source scan. The stored source_revision label is 5f374c9adbe24c94c81ad98fd3f54bd1247b2928; the test uses that label as the generator input and does not assert that the label equals HEAD. This is static inventory parity, not live HTTP reachability.
- **Fee wording:** patient-helper.js now distinguishes ₹100 service-assistant/guided help, ₹500 online consultation and ₹1,200 daytime home-visit base. It says guided help is not a medical consultation, the home-visit total may vary, the doctor confirms the final amount, and the helper does not collect payment. No payment collection or gateway activation is claimed.
- **Article Manager / RSS isolation:** index.html moves viewJournalsHub inside viewArticlesHub only for the Article Manager tab, then restores it to its original workstation position for the dedicated RSS tab. tests/article-manager-rss-grouping.test.cjs checks both switching directions and isolation from other workstation tabs.
- **Mobile language panel:** current CSS contains the responsive menu positioning overrides and the mobile-language regression is included in the full suite. Actual 320 px and 390 px phone rendering remains unverified.
- **Patient education:** the public dataset retains nine detailed guides. content/clinical-topic-drafts-2026-10-31.md contains source-linked COPD, cancer palliative-care, diabetes and cirrhosis drafts, with a test preventing their import/linkage into public content. They remain unpublished pending physician review, India-specific adaptation and qualified Marathi translation.
- **Compact pre-visit / booking / BMI / PDF:** current source and dedicated regression checks cover the compact intake, attachment/consent ordering, booking flow, calculator UI and document-sharing logic; the exact-head full regression job passes. No live-page, real-phone, PDF recipient or WhatsApp recipient verification is available because the latest Vercel deployment is rate-limited.
- **Still open:** once Vercel reports success for a new main deployment, verify 320 px / 390 px language panel, navigation targets, public Know Your Numbers cards, booking/BMI on the live page, PDF download/save/print/share, and native WhatsApp handoff. Keep recipient-side receipt unverified until actually received.
- **Release boundaries:** this monitoring run changed no application code, billing, payment gateway, secrets, hosting configuration or database migration; no clinical draft was published. Existing SQL migration files remain source artifacts and must not be applied without separate authorization.



## L. 1 November 2026 — successful exact-main check after documentation synchronization

## 1 November 2026 — follow-up status after documentation synchronization

- **Application source tree:** 820219a5a22ce089ae3701f9ac0cfb0920e99e16. The current main commit 27c7f910c56656ca8e500e2a0f153d7d95ae2172 was a documentation-only synchronization; it changed the five audit/checkpoint records and no application source.
- **Exact-current-main regression:** GitHub Actions [run 41333816068](https://github.com/drkulkarnipg-lang/doctor-at-home/actions/runs/41333816068), run #1266, completed SUCCESS on exact main commit 27c7f910c56656ca8e500e2a0f153d7d95ae2172. The node-regression job and full repository regression step both passed.
- **Vercel:** the Vercel status context for exact main commit 27c7f910c56656ca8e500e2a0f153d7d95ae2172 is now SUCCESS. [Open deployment record](https://vercel.com/drkulkarnipg-lang/home-visiting-icu-doctor-pune/86f7SMcymUdeNEz36gnz4YSQzVun). This supersedes the build-rate-limit failure on the preceding application commit 820219a5a22ce089ae3701f9ac0cfb0920e99e16 at the status-check level. The deployment record could not be independently rendered here and does not prove that the custom production alias is serving the expected build.
- **Live verification remains open:** attempts to retrieve the public domains through the available browser/web context were unsuccessful. No claim is made for actual 320 px / 390 px rendering, production-alias correctness, live navigation, Know Your Numbers, booking/BMI, PDF download/print/share, WhatsApp handoff or recipient receipt.
- **Unchanged boundaries:** this follow-up changed documentation only. No application code, billing, payment gateway, secrets, hosting configuration, database migration or clinical publication was changed.

## E09. Prescription save, download and PDF export reliability — 1 November 2026

| ID | State | Requirement | Evidence / next action |
| --- | --- | --- | --- |
| E09 | [ ] PREVIEW — CI rerun pending | Prescription Save, Download Text, Export PDF and Share must work reliably without clearing the live editor or silently uploading patient data. | `prescription-actions.js` provides native Save dialog where supported and browser-download fallback; Text Copy uses an attached temporary download link; PDF Export/Share opens the ready-PDF panel so the user explicitly taps Download or Share after generation. Inventory synchronisation is refreshed. Focused test now awaits the asynchronous Share action and stubs the long-lived URL cleanup timer. Await full-suite rerun and preview verification before marking live. No cloud save is implied. |


## Share Desk release evidence — 2 November 2026

- **Merged application head:** `4227021263c80805bbc9cd0bc72412ddc4676ff0` (PR #96); PR #95 base Share Desk merge: `a3a1b9f4ad5ea831aa8394b18b75edc9bfef4051`. The current main branch was rechecked against the exact PR #96 merge commit.
- **GitHub CI:** push run [41339869885, run #1309](https://github.com/drkulkarnipg-lang/doctor-at-home/actions/runs/41339869885) completed successfully on the exact main head. The `node-regression` job and “Run every repository regression test” step both passed.
- **Vercel:** PR #95 base deployment record [Gxe7ZQs19RiuRKBU6aRSjeV6SEht](https://vercel.com/drkulkarnipg-lang/home-visiting-icu-doctor-pune/Gxe7ZQs19RiuRKBU6aRSjeV6SEht) reports success for `a3a1b9f4ad5ea831aa8394b18b75edc9bfef4051`. The current PR #96/main commit `4227021263c80805bbc9cd0bc72412ddc4676ff0` still reports Vercel `failure` with `build-rate-limit`. Do not retry, create a deployment-trigger commit, upgrade the plan, or alter hosting/DNS while the limit remains active.
- **Share Desk action routing inspected in current source:** prescription → `rxSheet`; laboratory → `pathSlipSheet`; radiology → `radSlipSheet`; invoice → `invoiceSheet`; referral → `cdoc-referral`; consent → `cdoc-consent`; fitness → `cdoc-fitness`; unfitness → `cdoc-leave`; Forms 2/4/4A → `cert-form2` / `cert-form4` / `cert-form4a`; patient articles → validated `publicArticle_*` cards. The arbitrary local-file handler uses the selected File and `navigator.share({files:[file], title:file.name})`; if file sharing is unsupported it instructs the user to attach manually and explicitly says the file has not been uploaded or sent.
- **Privacy boundary:** the inspected Share Desk paths create no public link and perform no automatic upload. PDF creation uses a local Blob or a same-origin published guide PDF; the native share sheet is opened only after a user action. The user must choose the app/recipient and confirm sending there. Website code cannot confirm recipient receipt.
- **Automated coverage gap identified:** `tests/document-sharing.test.cjs` routes all named clinical documents, forms and articles, but before this checkpoint it did not invoke `shareDeskAnyFile()`. A focused local-file success/unsupported-browser/no-file test is added on this audit branch; its CI result is pending and is not yet a main-branch test result.
- **Live verification:** browser extension access requires its originating browser context, which was unavailable in this run. Web retrieval returned internal errors and container DNS resolution could not resolve `drkulkarnipg.com`. Therefore HTTP status, custom-domain release identity, desktop/mobile UI, 320 px/390 px layout, and actual Share Desk/native-share interactions remain unverified; these failures do not prove the public site is down.
- **Lab reference table:** `LAB_NORMAL_REFERENCE_CHECK_TABLE_PLAN.md` records a 27-entry source-attributed adult baseline and a 750-entry target. No new numerical ranges were added in this run. Do not represent the target as complete; do not copy/adapt LabQAR's CC BY-NC-ND data. Add only independently sourced, method/specimen/population-partitioned intervals after physician review.
- **Work email:** `emergencyspecialistdoctor@drkulkarnipg.com` is not yet an active mailbox. Await the owner's Google Workspace signup confirmation or provider-generated DNS TXT value. No Cloudflare records were read-modified or changed; preserve existing MX and root/www Vercel records.
- **Release decision:** keep release open until the current-main Vercel deployment succeeds, the custom domain is confirmed serving the expected release, and real browser/device checks are completed. No billing, secrets, hosting configuration, DNS, database migration, or physician-review clinical draft was changed/published.
