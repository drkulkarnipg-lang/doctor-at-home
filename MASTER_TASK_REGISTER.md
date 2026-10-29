# Dr Kulkarni — permanent request and completion register

Updated: 26 October 2026 (India). Covers requests available from the 25–26 October conversation, recovered prior-context requests, and the project's recorded outstanding commitments. This is the current checklist; older completion claims do not override it. Retrieved requests without implementation evidence stay open. This is not a claim to possess a complete archive of every separate conversation.

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
| D01 | [x] LIVE | QR hidden inside Payment methods, reveal when tapped | Closed outer Payment methods and closed inner QR details saved in PR19. No initial third-party QR request. UPI link/copy controls exist in preview; current request confirms other methods are missing. Local browser verified closed outer/inner details and tap-to-reveal local QR; clipboard manual fallback on insecure local preview. Released PR19; live browser verified. |
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

## Next work — resume here, not from zero

**PAUSED by owner, 26 October 2026:** stop after the published PR20 Close/A4 corrections. No new medicine/agent work has started since that release. Resume only on a new owner instruction; keep all remaining rows open.

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


## Resume update — 29 October 2026 (owner asked: “check end to end and restructure end to end”)

This resume instruction supersedes the historical “PAUSED by owner, 26 October” stop for the current task only. It does not authorise production publication or unrelated paid integrations.

- [x] Read the continuity instructions, authoritative register, checkpoint and current project status.
- [x] Start isolated branch `fix/end-to-end-contact-emergency-navigation`; main/production was not edited.
- [x] Open draft PR #29: https://github.com/drkulkarnipg-lang/doctor-at-home/pull/29
- [x] Add English-only emergency strip with direct 112/108 links, correct home-visit contact wording, clickable contact links, and responsive styling.
- [x] Add `END_TO_END_AUDIT.md` with preservation controls, baseline, end-to-end phases and release acceptance criteria.
- [ ] Verify PR #29 preview in an interactive browser and on a real phone; deployment READY alone is not enough.
- [ ] Run the complete existing test suite and add regression tests for the changes. Local cloning/testing was unavailable in the current tool environment because the host could not resolve GitHub; do not report tests as passed.
- [ ] Continue end-to-end audit in the order set out in `END_TO_END_AUDIT.md`: full-article rendering; contact and booking journey; document/form options; Doctor Workstation controls; language coverage; security/session; cloud and automation integrations; responsive/visual review.
- [ ] Keep all other pending rows in this register open until separately verified.
- [ ] No merge, production deploy, patient message, real payment, external publishing or paid integration without the relevant explicit approval.

Evidence note: the current PR preview URL was supplied by Vercel's PR comment: https://home-visiting-icu-doctor-pune-git-fix-d78f6a-drkulkarnipg-lang.vercel.app/ . Vercel marked the deployment Ready, but full live browser QA and the test suite remain unverified.


### Follow-up evidence — 29 October 2026
- [x] Added focused regression test `tests/end-to-end-contact-emergency.test.cjs` covering emergency strip language/links, doctor contact and email links, corrected prescription emergency wording, responsive CSS, and core workspace/booking entry points.
- [ ] Test has not been executed; the current environment cannot clone the repository because GitHub hostname resolution fails. Do not report it as passing.
- [ ] Vercel preview is Ready, but interactive preview inspection and real-device call/WhatsApp checks remain pending.


### Latest deployment status — 29 October 2026
The stable preview URL remains https://home-visiting-icu-doctor-pune-git-fix-d78f6a-drkulkarnipg-lang.vercel.app/ . An earlier deployment was Ready, but the latest checkpoint/audit commits triggered a new Vercel deployment that is currently pending. Verify the current deployment before asking the owner to review; the earlier Ready status does not establish that the newest files are deployed.


## Current end-to-end correction status — 29 October 2026 (supersedes older deployment notes)

- [x] Resumed work on isolated branch `fix/end-to-end-contact-emergency-navigation`; production/main unchanged.
- [x] Draft PR #29 expanded to include language selector, focused patient section navigation, responsive hero/layout, full-article reading, quick home-visit intake, safe blank clinical defaults, PDF sharing and article import improvements.
- [x] Header language selector remains in the header; English is default; automatic translation options are provided by the translation service. The reader no longer moves the selector or shows a Marathi-only language panel.
- [x] Patient sections switch independently; browser Back/Forward is wired to section navigation.
- [x] Full English article content, references, FAQ and takeaway render in the native reader dialog; browser Back, close and Escape are supported. Redundant article-reader action buttons were removed.
- [x] Booking now presents essential contact/address/GPS first; quick optional history and original prescription/discharge attachments are available; long detailed history starts collapsed.
- [x] Removed prefilled “NKDA” and default-selected CBC/KFT/electrolytes/chest X-ray.
- [x] Prescription sheet email removed; registration line styled; prescription/lab/radiology PDF sharing targets and filenames corrected; native file-share sheet attempted before fallback.
- [x] Added two static regression test files for preservation and contact/emergency checks.
- [x] Source scan found zero duplicate HTML IDs and retained the core booking/workstation/document element IDs.
- [ ] Run the new tests and all existing tests in an environment that can clone/run the repository. Tests are added but not executed.
- [ ] Browser-test preview and real Android device: language selector, tabs, Back/Forward, article full text, native dialler/WhatsApp, file share, PDF page count and mobile layout.
- [ ] Exact official Form 2 / Form 4 / Form 4A facsimile/mapping remains open. Original government PDFs remain available; editable working layouts are not claimed to be exact facsimiles.
- [ ] Continue all remaining security, cloud, payments, article-scale and workstation items in `END_TO_END_AUDIT.md`.

**Latest checked branch head:** `5e8ef19c7f70da009e4f9db5d62ced297dfd9297`. Vercel status at that head: success/Ready. Preview: https://home-visiting-icu-doctor-pune-git-fix-d78f6a-drkulkarnipg-lang.vercel.app/ . The later audit/checkpoint documentation commits trigger their own redeployments; recheck latest head/status before review. PR #29 remains draft and unmerged.

**Verification truth:** source-level checks passed; full tests and interactive preview/device checks did not run. Do not mark end-to-end complete or publish production yet.

## Latest client-request corrections — 29 October 2026

### Implemented on the review branch
- Front-page call links now have a capture-phase handler that routes phone links to the phone protocol; WhatsApp remains a separate, explicitly chosen action.
- Header language control is compacted; English can be selected to reset Google Translate. Patient navigation reads Elderly care instead of Home care.
- The pre-visit WhatsApp handoff opens a window before preparing content, reports pop-up blocking, and uses a short note plus explicit PDF-attachment instructions for histories that exceed WhatsApp URL limits. It never claims the history was sent automatically.
- Patient tools now include three live calculators: BMI (age field removed), estimated average glucose, and mean arterial pressure. The shared calculator renderer updates results as valid inputs change, including Doctor Workstation calculators. Temperature/weight conversion also updates immediately.
- Calculator results use a neutral white style instead of a green prefilled-looking box.
- Doctor login is labelled username-first; doctor and drkulkarni are aliases for the existing clinic-owner account, while the existing account email remains accepted for compatibility. Password verification and the existing server-owned session boundary are unchanged. Mobile OTP is explicitly marked not active until a verified SMS provider and number are configured.
- Prescription formulary picker now filters the local list, links to external drug references, and can add a typed medicine as a blank prescription row. No dose/frequency/duration is invented for a custom medicine. Existing Add Blank Medicine Row remains available without an imposed row cap. User-entered prescription values are escaped before HTML insertion.
- Added a session-only PNG/JPG/WebP signature-image input for the prescription preview. It is not uploaded or persisted and is not a cryptographic/e-signature or identity-verification service.
- Radiology requisition now has chest X-ray AP/PA selection, venous and arterial Doppler options, and a free-text additional-test field; the specific Portable and Bedside investigation wording was removed from the standard list.
- Added a signed-form photo/PDF input for the death-form section. Image scans are converted locally to an A4 PDF; supported devices can open the native share sheet. Otherwise a PDF copy is downloaded for manual sharing. No patient file is uploaded automatically.
- Article source import now has a normal Open source in new tab fallback and keeps the saved-draft reload control. Arbitrary source text import can still be blocked by CORS, authentication, paywalls or source restrictions.

### Verification performed
- Calculator logic was executed in a lightweight sandbox harness: 944 assertions passed across 31 calculators, including BMI without age and both patient/workstation MAP calculations.
- The contact/emergency and website-preservation regression scripts were executed against fetched source using an in-memory test harness; both passed.
- Updated inline JavaScript and modified JavaScript/test files passed syntax compilation checks.
- Vercel reported success for code commit 27c5c911607bcb9b88b748f7fbb6016bb6bd3df1. Later commits for signature upload and test corrections have their own deploy status; recheck the latest commit before final preview review.
- The direct preview page could not be opened by the available web reader. Native dialler, WhatsApp handoff, file-share chooser, image-to-PDF rendering, mobile layout, and actual device print page count have not been verified on the owner's phone.

### Still not complete / do not overclaim
- Username aliases are a transitional UI mapping to the existing account, not a new server-managed username directory. OTP login is not enabled.
- External drug resources are opened for lookup; arbitrary third-party drug data is not automatically imported. Verify product, formulation, local availability and prescribing information before use.
- The death-form language selector uses the site translation service and may translate the whole page. It does not create a certified bilingual government form.
- Original government Form 2 / Form 4 / Form 4A PDFs remain unchanged and available. Editable HTML forms are not exact Word versions or exact government facsimiles; local/Maharashtra receiving-authority requirements must be checked.
- Full Node.js/npm test suite, authenticated cloud operations, and real Android device/browser tests remain outstanding.

Production is unchanged. Draft PR #29 remains unmerged; no production deploy, payment activation, patient communication, or public article publication is authorised.
