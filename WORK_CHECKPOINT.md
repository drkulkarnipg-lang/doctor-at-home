# Current resumable work checkpoint

Updated: 30 October 2026, India time.

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
