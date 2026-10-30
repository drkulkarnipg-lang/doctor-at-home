# Dr Kulkarni — permanent request and completion register

Updated: 30 October 2026 (India; sentence-by-sentence audit resumed; language selector markup fix committed). Covers requests available from the 25–26 October conversation, recovered prior-context requests, and the project's recorded outstanding commitments. This is the current checklist; older completion claims do not override it. Retrieved requests without implementation evidence stay open. This is not a claim to possess a complete archive of every separate conversation.

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
| A10 | [ ] PARTIAL | Header/language menu easy to use on phone and must not hide portal controls | Root cause confirmed: header used a generic div although the in-flow open-panel CSS targets details[open]. Commit 0b2e049 converts it to details/summary and places it after Patient Portal/Doctor Workstation controls. Source checks: 483 IDs, zero duplicates; Google Translate mount retained. Live desktop/mobile verification remains blocked by Vercel build-rate-limit. |

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

## E. Prescription, requisitions, consent and certificates

| ID | Tick / state | What you asked | Evidence or exact remaining action |
| --- | --- | --- | --- |
| E01 | [x] LIVE | Ordinary prescription/pathology/radiology generally ONE A4 page | Compact layout and isolated print root saved in PR19. Real html2pdf metadata: normal 5-row Rx, path and rad each one A4 page. Browser download completion timed out; owner's final save/print not verified. |
| E02 | [ ] PARTIAL | More pages only for actual longer content; no clipped text | Real PDF engine confirmed two pages for 42 synthetic rows; all rows and final signoff retained in clone. Fitness spacing corrected and one-page result verified; consent one page with both signatories. Broader filled examples/device output remain open. |
| E03 | [x] LIVE | Remove unnecessary date/DOB layout that makes Rx two pages | DOB editor stays onscreen, excluded from document clone; calculated age retained. Dates use compact fields; saved/tested. |
| E04 | [x] LIVE | **Signature, name, date and time** on every clinical document | Signoffs added/tested for Rx/path/rad/referral/consent; certificate issue/verification times and Form2 signatory dates/times. Blank signature lines; no fabricated electronic signatures or event dates. Released PR19; normal fitness/consent visual checks passed. All filled/device examples not claimed. |
| E05 | [x] LIVE | Requisitions actually mention date | Path time and radiology identity/date/time added; existing dates retained. Fresh cloned values tested. |
| E06 | [ ] PARTIAL — SOURCE READY, LIVE/JURISDICTION VERIFY | Fitness/unfitness/leave/Forms 2, 4, 4A all print/save/share properly; Form 2/4/4A separate downloads and languages | Main contains `/api/official-form-pdf?form=2|4|4a`, extracting the corresponding one-page form from the full official CRS PDF, with distinct filenames and synthetic page-extraction tests. The legal-forms panel also already links the **Maharashtra CRS handbook (2026)**, which contains Marathi and English CRS/MCCD material including Form 2, 4 and 4A. This is a full handbook, not a separate one-page state-form bundle; actual prescribed page/version and Maharashtra/Pune Registrar acceptance remain unverified. Reverse-side instructions stay in the full government sources. Current main Vercel status is rate-limited, so latest endpoint/UI is not confirmed live. Still test filled editable forms, actual file save/share/print, Hindi/Marathi guidance and local legal format. Do not present machine translations as official government forms or flatten multi-page official sources. |
| E07 | [ ] VERIFY | Lab choices: lipid profile, ammonia, iron studies | Recovered request. Check exact current list, labels and selected-item output; no completion evidence yet. |
| E08 | [ ] VERIFY | Radiology: portable/bedside USG, separate arterial/venous Doppler, CT/MRI choices | Recovered request. Check exact current items and requisition output before marking complete. |
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
| H02 | [x] CI VERIFIED — LIVE PENDING | Previsit long-history sharing must preserve the complete history and clearly tell the user nothing was shortened or sent automatically. | New CI found that `tests/booking-intake.test.cjs` expected “Nothing has been shortened” while the runtime message only said “Nothing is sent automatically.” Updated the user-facing message to “Nothing has been shortened or sent automatically.” The corrected message passes tests/booking-intake.test.cjs in the full green suite. |
| H03 | [x] CI GREEN — 24 FILES | Every correction must be tested; do not infer success from code presence. | Added `.github/workflows/regression-tests.yml` to run all `tests/*.test.cjs` using Node 22, locked project dependencies and jsdom. The green run 41018433870 completed all 24 tests/*.test.cjs files on Node 22. Vercel build-rate-limit remains a separate preview blocker. This workflow does not bypass or resolve Vercel's separate build-rate-limit failure. |

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
| H08 | [ ] CI PENDING — PREVIEW BLOCKED | Add medicine rows; preserve work and avoid unintentional data loss. | Found that `initRxPad()` cleared existing rows and auto-filled three sample medicines. On PR42 review branch, `index.html` now creates one fully blank row only if no rows exist, preserves entries on re-open, and adds blank rows. Regression test `tests/prescription-initialization.test.cjs` checks the blank initial state, no sample drug names, retention of clinician-entered values and adding a blank second row. Source commit `8412292db14a5ec2d195dd08c8ee84a69dcf700c`; test commit `df2c089892ad8d1426f7050da7328b280e909e4d`. Await CI on the exact current head, then preview and PDF/long-row/device checks. Not live-verified. |


| H09 | [ ] CI PENDING — PREVIEW BLOCKED | Doctor Workstation Daily Patient / Death / Stock Register must open and render its fields. | Latest Actions run `41031803682` exposed a runtime exception: `makeField()` set the `type` property on a `select`/ `textarea`, which prevented the Movement select from rendering. Fixed `workstation-registers.js` to set `type` only for actual `INPUT` elements. Source commit `d4532a243587e726d708aec6ea4adced626a03b5`. Re-run all tests on latest branch head; then test actual owner/non-owner cloud access and migration/RLS separately. |


| H10 | [ ] CI PENDING — PREVIEW BLOCKED | Prescription and requisition PDFs must use clear document-specific filenames, not the doctor's name. | Updated download actions to `Prescription.pdf`, `Lab_Requisition.pdf`, and `Radiology_Requisition.pdf`; date-stamping helper appends the India date. Added `tests/document-filenames.test.cjs`. Implementation commit `859cb6cd82e9b0b9f4fbe691aaa66059a361dfff`; test commit `74d0973f72fa3cbc8dcc97070370b112b43d3a18`. Confirm latest CI and actual device filenames. |


| H11 | [ ] CI PENDING — PREVIEW BLOCKED | Do not assume the patient has no known drug allergies unless verified. | Prescription field `rxAllergies` previously defaulted to `NKDA (No Known Drug Allergies)`. Changed to blank with `Confirm and document allergy status`; added regression assertion. Source commit `03d76614002a66fd1e624bd850a9bfebfb0d9a76`; test commit `95c8a45557c5190e40470e4897642eca65b1ad3b`. Verify on latest CI and preview. |


| H12 | [ ] CI PENDING — PREVIEW BLOCKED | Health Library articles should open in a clean reader with normal browser Back/Forward behaviour, not redundant share/download controls on patient guide cards. | Removed share/download buttons from patient guide cards; added a history state per opened article and popstate handling so Back closes and Forward restores the reader. Single reader Back control remains. Tests updated in tests/patient-reader-exit.test.cjs. Source commit a40b9ffaa43a0327ba80b9279dac0817fe135d2d; test commit fb5cc6d3bc01a6d76f60ab46f17aadac61883792. Await CI and preview/device checks. |


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

| H13 | [ ] CI PENDING — LIVE BLOCKED | Each calculator must display the standard reference range / threshold / interpretation and linked source. | Source renders the correct label `Standard reference range / threshold / interpretation` on each calculator. The UI regression test still expected the old `Reference / interpretation` label. Test-only correction in commit `2e9e8fb7672e3a5b33d9e11f1d23f025c0a5802c` now asserts the correct wording. Existing UI test covers 2 public + 28 clinical calculators, reference notes/source links, selected published ranges, BMI, bidirectional patient/doctor conversions and diet-preset preservation. Await current-head CI; clinical source-by-source review and live visual/device verification remain pending. Vercel build-rate-limit blocks live confirmation. |


### Document sharing follow-up — 30 October 2026

| H14 | [ ] CI PENDING — DEVICE VERIFICATION OPEN | Lab/radiology requisition and patient-history sharing must pass the actual PDF/file to a supported app and not leave a stuck share modal. | `document-sharing.js` already shares the generated PDF plus selected original files when Web Share supports them. Found a fallback-path defect: after the user retried native share from the fallback dialog and it resolved, the dialog remained open. Fixed in `0934b175e89b5d4882b584e00d6bd24483612017`; added a regression assertion in `c37e924db498e56e8e008b80a75872580fb45a82` that the dialog closes. The UI retains download/manual WhatsApp attach guidance and does not claim the external recipient sent/received the file. Await latest-main CI; real phone share sheet, WhatsApp, PDF readability and recipient-side delivery remain unverified. |


### Article manager import-toolbar follow-up — 30 October 2026

| H15 | [ ] CI PENDING — PROVIDER / LIVE QA OPEN | Place article-fetch controls above the content box; make cloud Refresh, Load and Start visibly boxed and functional. | `public-article-editor.js` moved the existing cloud selector, Refresh, pager, Load, Start and status into `publicCloudArticleImportToolbar` before the content box in commit `3c62f7032675e84fba1444578bcba080898a4175`. `index.html` styles the toolbar responsively in `9a9275bea1cc6527fa9f02f563b21e05f1a6e31e`. `tests/public-article-editor.test.cjs` verifies placement and existing synthetic API interactions in `1f2d7fdbf4eb37153cfc38162f049ea61a40d915`. Local file import and device-local attachments remain unchanged. Await CI, then verify real owner-authenticated cloud refresh/load and mobile layout; provider setup/cross-device persistence remain unverified. |
