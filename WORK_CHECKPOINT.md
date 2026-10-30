# Current resumable work checkpoint

Updated: 30 October 2026, India time — owner resumed full sentence-by-sentence audit.

CURRENT: PR20 Close/A4 correction is LIVE after explicit owner approval (“ho”). Implementation a110d9cb114738f9ae5e40fd49b4329a9b5a1232, production dpl_FaeTguGmF9Qztqqfo45NgjhMaXX7 READY. The earlier automatic approval blocker below is resolved by that approval. Do not repeat the merge or this implementation.

## Owner pause — 26 October 2026

Owner explicitly requested stopping here with work so far published. PR20 Close/A4 changes are already live and verified. No further medicine additions or agent integrations were implemented after that release; the last response only described a future sequence. STOP at this checkpoint until the owner asks to resume. On resume, read the master register and continue pending work; do not repeat released corrections or restart from zero.

## Resume here

Repository: `drkulkarnipg-lang/doctor-at-home`.
Working branch: `fix/reading-print-document-datetime`.
Durable implementation commit: `4725cf4cf700572166d4415445310fcd8638bfe5`.
Base production commit: `8fada37396585ec6f2b62a79b8e2c27ad2563d77`.
This batch IS RELEASED: PR19 merged as 1888c3a310ae4305c972d0d34c8ad710809b366c on 26 October 2026. Production deployment dpl_3vbXZvtF8HazQnNmiTUS29SF9yGT READY; current statuses in MASTER_TASK_REGISTER.md supersede historical preview notes below.

## Completed and saved implementation

1. Pale article action controls with explicit dark text, border, focus and hover colours for heart/coconut-water/skin cards and their Read/Download/Share controls.
2. Payment methods collapsed by default; QR nested and collapsed. UPI app link and ID-copy controls added. Existing fee-linked, local QR generation retained; initial remote QR request removed.
3. Prescription DOB editor retained on screen but excluded from document clones and moved outside the demographic grid. Calculated age stays in the prescription.
4. Compact A4 document clone/print rules and isolated print root for ordinary prescriptions/pathology/radiology/referral/consent. Genuine long content is not truncated or forced into one page.
5. Doctor signature/name/date/time output across clinical documents; radiology identity/date/time fields; certificate issue/verification time; consent signatory fields; Form2 informant/Registrar date/time. Actual examination/death/signing events are not auto-invented. Government original PDFs remain unchanged.

## Verification completed

- All pre-existing 23 test files passed after the restored implementation.
- New `tests/clinical-documents.test.cjs` passed: metadata, India midnight boundary, retained event dates, fresh clone values, print isolation/cleanup, collapsed QR and UPI amount.
- Real html2pdf output was generated from synthetic local fixtures. Read-only PDF metadata inspection showed complete PDF trailers, A4 MediaBox and ONE page each for normal five-row prescription, pathology and radiology.
- Browser download completion events timed out; files were left as unconfirmed downloads by the cloud browser. These diagnostics do NOT establish successful final file handoff on the owner's device. No security control was bypassed, no pending file was delivered, and no actual patient data was used.

## Next unfinished work — do not restart released PR19

PR19 released, all 24 tests passed after final change (27.1s). Real PDF engine verified 42-row Rx two pages, normal fitness and consent one page; prior normal Rx/path/rad one page checks retained. Physical device print/download and broader filled examples remain unverified. Audit E07/E08 requisition choices next, then pending login/device and n8n/provider setup; use MASTER_TASK_REGISTER.md row IDs. No unrelated integration is complete merely because this batch was released.

## Workspace recovery note

Automated workspace cleanup removed the earlier uncommitted local batch. The repository was re-cloned and the known changes restored, then synchronized in commit 4725cf4. Future work must checkpoint remotely after each completed step. Never describe a new clone as restarting the project.

Checkpoint workflow and new test synchronized in remote commit 5d7eba9. PR19 was created as a draft; no production merge.

Verified preview at source 5d7eba9: deployment dpl_6duUuHw858vMgcaLBKc4QysRSCHx READY, https://home-visiting-icu-doctor-pune-iwgcvch5y-drkulkarnipg-lang.vercel.app/ . Preview protection is retained. Main remains unchanged.

## Online consultation notice — 26 October 2026
Implemented D02/D03: hero tag links to an English/Marathi ₹500 consultation notice beside home-visit booking. Stable follow-up/report review, doctor-confirmed suitability/availability, possible in-person examination, separate home-visit fee. Prominent severe-symptom warning says seek emergency help without waiting for appointment/reply/payment. Source checked: MoHFW Telemedicine Practice Guidelines (official eSanjeevani PDF, emergency-care limitations); primary NHS emergency symptom guidance. No new payment/backend or availability promise. Pale readable card, 46px contact link, no new main tab. Requires visual preview review; not production.

Consultation notice verification: clinical-documents regression test passed after the HTML/CSS update; focused DOM checks passed for ₹500, Marathi, emergency warning, separate home fee, correct tel number and unique IDs. Local browser hero link reached the notice; screenshot inspected: dark text on pale card, clear fee and emergency warning. Screenshot saved as consultation-notice-review-20261026.jpg (QA only, not committed). Full suite remains the earlier 24-file pass; no claim of a new full-suite run. Notice and existing PR19 fixes remain NOT LIVE.

## Release continuation — 26 October 2026
Owner instructed proceeding without repeated suggestions after seeing the review screenshot. Treat as authorisation to finish and release this concrete PR19 correction batch, not a blanket claim that unrelated integrations work. Main remains 8fada37; remote review head d8be7fd. Latest exact-head preview dpl_GpJtSACh1k1kqAvhg3rCh1aXBXh6 READY. Entire 24-file suite re-run successfully after the consultation notice: 29.8 seconds. Next: finish remaining local document/card/QR checks, then merge PR19 and verify production.

Remaining overflow check completed: a diagnostic hook on the real PDF stamp received jsPDF's getNumberOfPages() = 2 for the 42-row synthetic prescription. All 42 rows and final signature/date/time retained in the DOM clone; no browser download completion claimed. Fitness visual check found an unnecessary second page in the ordinary synthetic case. Applied compact spacing to fitness/leave templates as well; original government forms remain unchanged. Rechecking this concrete defect before release.

Final local checks: ordinary synthetic fitness now one PDF page (clone 906px); consent one page (653px), with doctor and patient signature/date/time fields visible. Long 42-row Rx two pages with all rows retained. All three patient article action groups computed pale rgb(237,246,255) backgrounds/dark rgb(21,62,89) text, controls 46–51px. Payment methods initially closed; opening it leaves QR closed; tapping QR reveals a locally generated 180px data-image. Copy on insecure local preview correctly offered manual-copy fallback; secure production clipboard still to be checked. Actual UPI payment and native dialler/device printing are not asserted. All 24 tests passed again after the fitness/leave spacing correction. Ready to release this concrete batch under the latest owner instruction.

## Production verified — 26 October 2026
PR19 merge 1888c3a, deployment dpl_3vbXZvtF8HazQnNmiTUS29SF9yGT READY production. Live index.html, reading-print-fixes.css, clinical-documents.js returned HTTP200 and SHA256 matched current implementation. Browser verified notice/₹500 and English/Marathi severe-condition warning, all six article controls pale with dark text, payment/QR initially closed; secure Copy UPI ID reported success. Production screenshot live-consultation-20261026.jpg saved for handoff. Browser error sample concerned Chrome extension metadata; no app error identified in that sample, not a complete runtime monitoring scan. No purchase/payment, patient data entry or biometric enrolment performed. Master register updated with live ticks and remaining limits.

## Active follow-up — document close and A4 presentation
User reports no exit from prescription/lab/radiology after/before export, and half-size content on A4. Worktree document-exit-a4, branch fix/document-exit-a4, based on released main f945281. Added persistent per-document exit controls, keyboard exit and chooser without clearing inputs; generated clinical clones now use a full-page writing area with readable type and lower signoff. Need interaction/data-retention and actual PDF geometry/visual checks, ordinary/long page regression, then review/deploy. Current follow-up is not live. Preserve prior release checks; do not call one-page count alone visual proof.

Exit regression check passed for all three forms: top/bottom Close, reopen, retained names, Escape, no exit buttons in exported clones. Escape closes the share overlay first and leaves the editor open; listener capture prevents a double close. Source fix and meaningful regression checks saved before real PDF inspection.

Real PDF geometry checked, not only page count: normal five-row Rx, pathology and radiology each render one A4 page; embedded content image width 549.93pt = 194mm and height747.67pt =263.76mm. Thus content occupies the full A4 writing area rather than a half-page box. Rx signoff begins 825px into the 998px clone. Long 42-row stress Rx naturally expands to four pages with all 42 rows retained at the larger readable font. Full24 suite passed after exit/format changes. No owner-device file transfer or physical print claimed.

PR20 created: https://github.com/drkulkarnipg-lang/doctor-at-home/pull/20 . Automated approval review REJECTED merging this new Close/A4 batch into main: standing preview-before-publication requirement needs explicit approval of this batch. Do not retry via shell, other branch or direct deployment. Source and tests remain saved on fix/document-exit-a4. Main remains f945281. Local browser synthetic Close/reopen preserved entered name, and screenshot clinical-close-preview-20261026.jpg shows top and fixed-bottom Close controls. Await owner's explicit release approval; do not report this batch live.

## PR20 approved release verification — 26 October 2026
After the user explicitly approved the preview, PR20 merged a110d9cb114738f9ae5e40fd49b4329a9b5a1232. Vercel dpl_FaeTguGmF9Qztqqfo45NgjhMaXX7 READY production. Live clinical-documents.js and reading-print-fixes.css HTTP200 and SHA256 match the tested local files. Reloaded production DOM contains both Close controls for all three editors and one document chooser. Workstation remains locked; no auth protection changed or bypassed. Earlier synthetic browser Close/reopen/data retention, Escape layering and 24-file suite remain the behavioral evidence; real authenticated owner-device PDF/print interaction not claimed. Register G01/G02 marked live with those limits. Resume other pending register rows, not PR20.


## Active work — continue pending website corrections (30 October 2026)

Owner explicitly asked: “mag ka thambala,jya baki pending aahet tya aatta lagech sampavayala ghya.ek ek gosht purn purn karat ja” — resume the pending website work immediately and finish one item at a time. Do not stop at another checklist-only response. Preserve preview-before-publication; do not claim a preview is production.

### Step 1 — BMI standard inputs
PR30 “Remove age option from standard BMI calculator” merged by squash into main as `4f219c902c62445d131e5a72f7d807f14c0df436` on 30 Oct. Its source commit previously had a successful Vercel preview status, but the post-merge production deployment was still pending at the time of this checkpoint. Verify its Vercel status and live calculator before marking production verified. Do not reimplement this change.

### Step 2 — lab/radiology requisitions + live unit conversion
The earlier review branch `fix/requisition-share-converter` was merged through PR31. Its Lab Requisition options and fee-independent Celsius/Fahrenheit and kg/lb conversion changes are now in `main`. The latest full website correction batches PR35–PR41 have also been merged; however, Vercel has since returned a build-rate-limit failure, so those merged source changes are not all verified live. Do not repeat these implementations or treat a merge as browser QA.

### Current active review — UPI payee regression
PR42: https://github.com/drkulkarnipg-lang/doctor-at-home/pull/42
Branch: `fix/upi-payee-single-source-20261030`, based on current main `61f4ba2012b08c212c164a30b0c4a2b8ff900a46`.
Main source had a regression: `clinical-documents.js` overrode the visible/canonical `drkulkarnipg@upi` with `9561394341@sbi`. The branch removes that override and keeps the amount-bearing UPI URI consistent with the requested payee. Static syntax and source checks pass; the Vercel status is failing due to the build-rate-limit error. PR42 is unmerged pending a usable preview and behaviour tests.

### Remaining master register priority
Continue one bounded item at a time from `MASTER_TASK_REGISTER.md`, using the actual source and test evidence. Keep credentials, patient information and bank details out of source and public responses. Report each item as IMPLEMENTED / PREVIEW TESTED / PRODUCTION VERIFIED / BLOCKED.


## Active work — original correction notes, UPI regression (30 October 2026)

Owner explicitly requested that the original notes be read first and the missing corrections implemented, sentence by sentence. Original 18.9 KB note file was read in full. Current `main` source audit found a regression despite the visible HTML and `payment-options.js` showing the requested `drkulkarnipg@upi`: `clinical-documents.js` still overwrote the copied UPI ID and payment URI with `9561394341@sbi`.

### Bounded correction implemented on review branch
- Branch: `fix/upi-payee-single-source-20261030` (based on current `main`).
- `payment-options.js`: one canonical payee constant; UPI URI now includes the current fee, INR currency, and correct payee whenever `calculateFee()` runs; initial amount-bearing URI refresh added.
- `clinical-documents.js`: removed the stale copied-ID handler and conflicting payment-URI override.
- `tests/clinical-documents.test.cjs`: added assertions for the canonical payee, amount-bearing URI, and copy fallback text.
- Static validation: JavaScript syntax passed for the two changed runtime scripts; HTML has no duplicate IDs; source assertions confirm the requested payee and absence of the stale override.
- Vercel status for the latest review-branch commit reports `failure` with `upgradeToPro=build-rate-limit`. Therefore the browser regression test has not run in a deployed preview, and no production/live payment behaviour is claimed.

### Next action
Open a review PR and keep it unmerged pending a usable preview. Once Vercel permits a preview, run the clinical document test suite, verify the UPI payee and amount in the actual QR/link on desktop/mobile, then update D01 with evidence. Do not attempt a real payment or expose bank-account details. Continue the next unfinished original-note item only after this bounded fix is checkpointed.


## Regression CI finding — 30 October 2026
Added `.github/workflows/regression-tests.yml` to run all existing `tests/*.test.cjs` on pull requests and relevant pushes. First run `41016442845` failed in `tests/booking-intake.test.cjs`: the assertion expected the status to include “Nothing has been shortened”, but the runtime status said “Nothing is sent automatically.” Updated `booking-intake.js` to clarify “Nothing has been shortened or sent automatically.” This is a genuine test/source wording mismatch discovered by the new automated suite, not a test to delete. Rerun CI and fix any further failures before considering PR42. Vercel remains separately blocked by the build-rate-limit status; passing CI will not imply a live deployment.


### Converter test follow-up — 30 October 2026
The first converter regression test correctly caught a defect in the new paired-field helper: the helper was passing its conversion callback as a unit selector instead of invoking it. Corrected the callback invocation in `release-tools.js`; rerun the complete CI suite before marking the converter fix validated. The test also verifies below-absolute-zero input clears the paired field and displays an error. Do not remove this test or soften the expected behaviour.


## Owner's current instruction supersedes old pause (30 October 2026)
The original register had a 26 October “PAUSED by owner” note. The owner now explicitly said “dont pause and resume stop only after checking my draft completion,implementation.” That older pause is superseded. Continue working from the original 28.9 KB master prompt and 18.9 KB correction note; do not stop after a plan or one commit. Preserve preview-before-production rules and clearly document external blockers. H01–H03 in MASTER_TASK_REGISTER.md track the new CI and real source defects found during this continuation.


### Hero assertion update — 30 October 2026
CI progressed past the converter checks and exposed another stale assertion in `tests/calculator-ui.test.cjs`: it expected the former “Thoughtful care” headline, while the current hero deliberately says “Home visits. Care at your bedside.” Updated the regression assertion to check the explicit home-visit promise from the owner's original instruction. This is a test expectation update aligned to the current approved design intent, not a weakening of the requirement. Rerun all tests; other stale assumptions may still surface.


### UPI test syntax issue — 30 October 2026
CI exposed a syntax error in the newly added UPI assertion: an apostrophe in its single-quoted message was not escaped. Fixed the assertion text and ran a JavaScript parse check on the complete test file successfully. The regression assertion itself remains unchanged in meaning. Rerun the full suite.


## Regression suite green — 30 October 2026

GitHub Actions run 41018433870 passed all 24 tests/*.test.cjs files on Node 22. This is a real automated test pass, not a Vercel deployment or live-browser claim.

### Source fixes and test coverage now in the active PR42 branch
- **UPI:** removed stale 9561394341@sbi override; single requested payee drkulkarnipg@upi; payment URI carries calculated fee and INR. clinical-documents.test.cjs passed.
- **Converters:** the actual fields in index.html are paired inputs, not the legacy forms expected by release-tools.js. Diet-card rendering is now independent of conversion binding; unit-converters.js owns bidirectional conversions and rejects below-absolute-zero temperatures/negative mass. Both patient and doctor conversions are tested.
- **Previsit history:** long-history message explicitly says nothing is shortened or sent automatically. Test passed.
- **Health Library:** duplicated reader controls remain removed; one Back action stays in the reader. Share/Download original PDF actions are now on each library guide card, using existing local PDF assets. All 9 English and 9 Marathi guide PDFs were checked against the expected bytes; download filename and reader-exit behaviour passed.
- **Language status:** test now checks the real translation-status region, not the form body. The translation helper safely returns if the document is unavailable during observer teardown.
- **Homepage:** hero regression test checks the explicit “Home visits. Care at your bedside.” promise.
- **Automation:** added .github/workflows/regression-tests.yml; it runs all 24 existing test files and does not delete or skip tests.

### Still blocked
- Vercel status on the PR head remains failure with upgradeToPro=build-rate-limit; no deployable preview exists for this batch. Do not merge or call these source changes live until the preview/production release can be verified under the project's release rules.
- The green test suite does not verify real UPI app handoff, physical-device share/print, the owner's device passkey, production Supabase RLS, or external provider configuration.


## Owner password recovery — implementation and verification status (30 October 2026)

Implemented on the active PR42 review branch:
- API `api/clinical-cloud.js`: `reset-request` requires a valid `CLINIC_OWNER_EMAIL`, returns a generic message for non-matching emails, sends provider recovery only for the configured owner email, and uses a fixed production redirect. `reset-password` validates input length, asks Supabase to validate the recovery access token, confirms the returned user ID equals `CLINIC_OWNER_USER_ID`, then updates the password through the provider. No recovery token is placed in a cookie or returned in a response.
- Login UI: `workstation-auth.js` adds “Set / reset password by email” with an accessible status message; `cloud-records.js` exposes the same-origin request action.
- Recovery page: `password-reset.html` and `password-recovery.js` accept only a recovery-type link, immediately scrub the token from the URL, keep it in memory only, require matching passwords of at least 12 characters, submit only to the same-origin API, and clear both password fields. No local/session storage is used.
- Tests: `tests/clinical-cloud.test.cjs`, `tests/workstation-auth.test.cjs`, and new `tests/password-recovery.test.cjs` cover owner restriction, generic non-owner response, missing config, wrong/expired token, password length, no session cookie, token URL scrubbing, password mismatch and field clearing.
- GitHub Actions run `41019188114` passed all 25 regression test files.

External configuration still required before this can work in production: set Vercel environment variable `CLINIC_OWNER_EMAIL` to the actual owner account email and add `https://home-visiting-icu-doctor.vercel.app/password-reset.html` to the Supabase Auth redirect URL allowlist. Do not put secrets in source or chat. Mobile OTP and 30-day remembered-device behaviour remain separate tasks. Vercel build-rate-limit currently prevents preview/live confirmation; email delivery is not yet verified.


## Latest verified checkpoint — 30 October 2026, India

Active review branch: `fix/upi-payee-single-source-20261030`; current head `cd1198b800171f34f3ce5e54971647039f49d3f3`; PR42 remains unmerged. Permanent request register was updated in the same work batch.

### New corrections implemented and tested
- Owner email password recovery endpoints and page: owner email only, generic non-owner response, recovery link redirect, token validation against `CLINIC_OWNER_USER_ID`, provider-managed password update, token scrubbed from URL, no browser storage, password mismatch/invalid token handled, no login session created automatically.
- 30-day remembered-device choice: explicit opt-in on Doctor login. Access session stays 15 minutes; separate 30-day refresh cookie is HttpOnly, Secure, SameSite=Strict and `__Host-` prefixed. Refresh tokens rotate through Supabase, owner identity is checked again, and logout clears both cookies. Existing password sign-in remains.
- Added/expanded API/UI tests for remembered-cookie issuance, rotation, invalid refresh cleanup, checkbox forwarding and recovery flow.

### Verification
- GitHub Actions run `41025556041` completed **success** on head `cd1198b800171f34f3ce5e54971647039f49d3f3`; all 25 `tests/*.test.cjs` files passed on Node 22.
- Vercel status for the same head is **failure**: deployment rate limited, retry in 24 hours. This prevents a usable PR preview. Do not merge or claim live verification.
- Required provider configuration for email recovery: set Vercel `CLINIC_OWNER_EMAIL` to the clinic owner's actual auth email and allowlist `https://home-visiting-icu-doctor.vercel.app/password-reset.html` in Supabase Auth redirects. These external settings are not changed from repository code and email delivery has not been verified.
- Mobile OTP is not implemented; it remains separate from email recovery. Owner-device browser, passkey, remembered session and physical-device checks remain unverified.


## Owner resumed full audit — 30 October 2026

The owner explicitly requested: “start the audit and corrections as in the chat.” Continue the task now; do not apply the earlier 26 October stop to this newly authorised audit. Preserve the existing no-production-release-without-explicit-approval rule.

### Current durable source edits
- Created `AUDIT_SENTENCE_BY_SENTENCE_2026-10-30.md` in the active PR42 review branch, commit `4047831dbf1230b8264d63b26fa15a5a623dd2ba`. It maps the owner's attached 166-line file into 60 atomic requirement groups, with current evidence, action and verification status.
- Updated `MASTER_TASK_REGISTER.md` in commit `a90b4998377ed18df52035d90b1442ded2549654` to point to the detailed matrix and record the current workflow/deployment blockers.
- These are review-branch changes only. No production deployment or merge was performed.

### Verified source/test evidence
- Repository main head remains `61f4ba2012b08c212c164a30b0c4a2b8ff900a46` at the time of this audit.
- PR42 review branch has the UPI single-source correction, bidirectional patient/workstation converters with bounds validation, password-recovery UI/API, remembered-device option, register code/migration, and tests.
- GitHub Actions run `41025556041` passed 25 test files on commit `cd1198b800171f34f3ce5e54971647039f49d3f3`. The latest review branch has advanced since that tested SHA; run CI again against the exact latest head before declaring the current branch green.
- Vercel deployment check reports `build-rate-limit`; no preview/live visual verification is currently available. Do not merge, bypass the limit, or claim these changes are live.

### Next exact action
1. Fetch current branch head and check whether CI ran after the audit-register commits.
2. Run or trigger regression tests on the exact current branch head.
3. Continue bounded source checks for UPI payee, both converters, diet presets, full previsit history, article Back/Forward and PDF share, prescription add-row visibility, forms, requisitions, and registers.
4. Keep the register and checkpoint updated after each completed bounded step. Wait for Vercel preview availability; then verify desktop/mobile before asking for release approval.
5. External setup blockers remain: Supabase owner-email/redirect configuration, owner-device recovery test, register migration/RLS test, and actual phone/email/PDF share/print. Do not include bank details or provider secrets in source control.


## Latest bounded source correction — prescription initialization safety (30 October 2026)

- **Original defect:** `initRxPad()` emptied the prescription table and inserted three example drugs. Reinitialisation could lose clinician-entered rows; sample medicines could be mistaken for an actual regimen.
- **Correction:** `index.html` now creates one entirely blank row only if the prescription table is empty; re-opening does not clear existing rows; `addRxRow()` adds a completely blank row. Existing formulary selection remains available.
- **Regression test:** new `tests/prescription-initialization.test.cjs` covers blank first row, absence of sample drug names, preserving entered values after reinitialisation, and adding a blank second row.
- **Commits:** implementation `8412292db14a5ec2d195dd08c8ee84a69dcf700c`; test `df2c089892ad8d1426f7050da7328b280e909e4d`; audit matrix update `e994a1fb78728d7664c539978fa6d0c861b992d5`; master register update `a9bb4c5254c7cb80a5e7ec35033aef830dafc84f`.
- **Status:** source correction and test are committed on PR42 review branch only. Await the regression run on the exact latest head; no preview/live/device verification yet. Do not merge or deploy.
- **Next:** inspect the current GitHub Actions run against latest branch head, correct any failures, then continue the next high-priority open source defect. Keep the exact tested SHA in the checkpoint.


## Latest test-driven correction — register form rendering (30 October 2026)

- **Observed failure:** GitHub Actions run `41031803682` failed in `tests/workstation-registers-ui.test.cjs`. In `workstation-registers.js`, `makeField()` assigned `input.type` after creating a `select` or `textarea`; JSDOM threw in strict mode and the Stock Register Movement field did not render. This is a real UI-code defect, not merely a deployment failure.
- **Fix committed:** set `type` only when the generated element is an `INPUT`; select and textarea fields retain their native element type. Commit `d4532a243587e726d708aec6ea4adced626a03b5`.
- **Audit records:** `AUDIT_SENTENCE_BY_SENTENCE_2026-10-30.md` update `01a4d0fb7ecf545aab957029a6a024ac56bfb2c6`; master register update `eb83e61ae5782141fea1090b8702e325ede00b65`.
- **Status:** correction committed on review branch; latest CI still needs to finish. Register database migration/RLS, real owner/non-owner access and Vercel preview remain unverified. Do not mark register feature complete or production-ready yet.


## Latest correction — prescription/requisition filenames (30 October 2026)

- Fixed three PDF download buttons that still used doctor-name filenames: `Prescription_Dr_Kulkarni.pdf`, `Lab_Requisition_Dr_Kulkarni.pdf`, and `Radiology_Requisition_Dr_Kulkarni.pdf`.
- New base names: `Prescription.pdf`, `Lab_Requisition.pdf`, and `Radiology_Requisition.pdf`. Existing date-stamping remains enabled.
- Added `tests/document-filenames.test.cjs`.
- Commits: source `859cb6cd82e9b0b9f4fbe691aaa66059a361dfff`; test `74d0973f72fa3cbc8dcc97070370b112b43d3a18`.
- Await CI on the latest head and device confirmation. Continue checking that the generated prescription excludes unwanted website footer/contact metadata and that registration number typography is aligned.


## Latest clinical safety correction — allergy status (30 October 2026)
- Found the prescription allergy field defaulted to `NKDA (No Known Drug Allergies)` without any confirmation. This could imply a clinical assessment that did not occur.
- Changed default to blank and placeholder to `Confirm and document allergy status`; added regression assertion in `tests/prescription-initialization.test.cjs`.
- Source commit `03d76614002a66fd1e624bd850a9bfebfb0d9a76`; test commit `95c8a45557c5190e40470e4897642eca65b1ad3b`.
- Await latest-head CI and preview/device verification; not live-verified.


## Latest Health Library correction — browser navigation (30 October 2026)
- Preserved Share/Download actions on guide cards for PDF access; kept the reader itself uncluttered with one Back-to-library action. Added browser history state so Back closes the reader and Forward restores the article.
- Added reader history state: opening an article creates a history entry; Back returns to the library; Forward reopens the article; the reader's single Back control closes it and restores history. Escape/backdrop/focus restoration are retained.
- Regression coverage added in tests/patient-reader-exit.test.cjs.
- Commits: source a40b9ffaa43a0327ba80b9279dac0817fe135d2d; test fb5cc6d3bc01a6d76f60ab46f17aadac61883792.
- Current CI and preview/mobile verification pending.


Correction to previous audit note: guide-card PDF Share/Download actions are intentionally retained because they are separate from the article reader. The requested uncluttered reading flow applies to the reader itself; browser Back/Forward support is being tested. Latest test-driven adjustment: c516719d896653ca1924d3b7fe07f0f716bbf7cf.
