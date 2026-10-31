# Added-note audit — Pasted text (2026-10-30 20:03:53)

Audit scope: the newly supplied 189-line attachment, with special attention to the closing additions at source lines 160–183. This is a source-to-implementation reconciliation, not a claim that the website is fully complete or deployed. The source contains repeated/overlapping instructions; duplicates are retained as evidence but should not trigger duplicate implementation.

## Sentence / instruction reconciliation

| Source line(s) | Owner's instruction (faithfully condensed) | Current repository evidence | Status and next action |
|---|---|---|---|
| 160, 162 | Read the whole latest draft; compare against downloaded code; implement every correction; report original instruction versus action; do not overlook unfinished items. | Current review branch contains the master task register, checkpoint, sentence audit and source traceability ledgers. This attachment is not yet represented as its own complete line-by-line ledger. | **PARTIAL.** This file records the closing added requirements. Continue reconciling every distinct instruction from the full 189-line attachment; do not call the entire audit complete yet. |
| 164 | Project URL is home-visiting-icu-doctor.vercel.app. | Repository canonical metadata points to the supplied site. | **SOURCE VERIFIED; LIVE DEPLOYMENT NOT VERIFIED** for latest review changes. |
| 166 | Preserve backups and downloaded Stitch creation; do not destroy existing work; correct design, icons and hidden tabs. | Existing source and assets remain in the repository; current changes are isolated on a review branch/draft PR. | **PARTIAL.** Preserve current main and available backup assets. Review current Stitch export against source before any wholesale replacement; do not overwrite the application with a design-only export. |
| 168–174 | Prescription must have name, age/sex, date, complaint, temperature/pulse/BP; medicine name, strength, frequency, timing/food instructions; extra blank medicine rows; clinician can choose a formulary item or type directly; no irrelevant date-of-birth field in the prescription. | `index.html` contains the prescription table and “+ Add Medicine Row”; `initRxPad()` adds a blank row only when empty; `tests/prescription-initialization.test.cjs` verifies blank initial row, retained values and adding a blank row. `clinical-documents.js` mounts clinical document identity/date fields. | **CODE PRESENT; EXACT-HEAD CI / PREVIEW / PDF / OWNER-DEVICE VERIFY REQUIRED.** Check rendered output and ensure date of birth is not printed as a prescription field. Long prescriptions must retain all rows; do not force genuine long content onto one page. |
| 174, 176 | Use clinical relevance and common sense consistently; do not add irrelevant elements to a doctor's interface. | Existing workstation and document modules separate prescription, requisitions, certificates, tools and registers. | **PARTIAL.** Continue item-by-item relevance audit; don't infer that an existing module is clinically or legally approved merely because it renders. |
| 178 | Reference ranges should not require excessive navigation; inputs must not be prefilled with colored rectangles or example patient values. | Calculator UI and CSS exist; calculator regression tests exist. Several fields have light tint styling in trend charts, and calculators may have separate reference/help areas. | **VERIFY/LIKELY OPEN.** Inspect every individual calculator and distinguish an empty input from a calculated/result card. Inputs must start blank unless a value is a documented safe default; reference range and source should be adjacent to the specific calculator and clinically contextual. Do not apply one universal range to all ages, sexes, labs or methods. |
| 181 | Patient Portal tabs (Overview etc.) should open only the selected topic; articles should be collected in one place rather than presenting all content as one long page. | `index.html` has a patient portal navigation with anchors to Overview, Elderly care, Health library, Search articles, Book a home visit, Health tools and Patient FAQ. The primary content is rendered in a long page with in-page section anchors rather than a full one-panel-at-a-time navigation model. | **GAP CONFIRMED.** Design and implement an accessible section-navigation model that shows the selected portal section while preserving direct URLs/back-forward navigation, keyboard access, and clear Home/Overview navigation. Keep articles in the central Health Library/gallery. Add focused tests for each tab, keyboard and browser history. Do not hide the booking CTA or emergency guidance. |
| 183 | Home visit / online consultation is the central purpose and must appear immediately. | `index.html` hero currently says “Home visits. Care at your bedside.” and its supporting copy offers home-visit request and current prescription/discharge summary sharing. The task register separately records the ₹500 online consultation notice and emergency warning. | **SOURCE IMPLEMENTED; LATEST LIVE / PHONE LAYOUT VERIFY OPEN.** Keep home visit as the primary hero CTA and online consultation as a clearly distinct secondary route; verify the language selector does not cover either. |
| 176, 181–183 | Make each element's meaning, hierarchy, color, layout and purpose deliberate; make the site calm, professional and patient-friendly. | `index.html` contains a light ivory/petal surface, dark navy text, and restrained green/teal accents; the hero and portal navigation are present. | **PARTIAL.** Automated tests cannot prove visual quality. Inspect real desktop/mobile screenshots after preview becomes available; check spacing, contrast, focus states, text wrapping and that no tab/control is hidden. “32K resolution” is treated as a visual-quality aspiration, not a literal browser resolution requirement. |

## Related earlier requirements repeated in this attachment

The same file repeats earlier requests for global language translation, mobile language selector visibility, separate official Forms 2/4/4A downloads, official Marathi/Hindi form availability, patient/death/stock registers, password creation/recovery, patient and workstation converters, calculator reference ranges, article import/publish workflows, invoice/QR/payment options, clickable telephone/WhatsApp links and professional color/design.

These are tracked in `MASTER_TASK_REGISTER.md`, `WORK_CHECKPOINT.md` and the existing sentence audit. Repeated wording is not proof of completion. In particular:
- A test passing is not the same as a live phone/device check.
- A source implementation is not the same as production deployment.
- A payment QR is not a verified payment gateway or proof of settlement.
- A machine translation is not an official government form translation.
- A planned automation is not an active, successfully tested workflow.
- Never put the supplied bank account number or other payment secrets in public source, logs or this audit.

## Current gate

The prior regression run passed on code head `3880dc6fbbe7b7e28c54c28c0828692f211c5346`. The task-register/checkpoint documentation commits after that code head have not yet had an exact-new-head regression result. Vercel has reported a build-rate-limit failure; do not claim latest changes are live. PR #85 remains draft. The confirmed tab-navigation gap above should be prioritized next, but implement it with tests and preserve existing section content and links.

## 31 October addendum — prescription and payment QR

| Owner's exact request (normalized without changing intent) | Code action recorded | State / evidence |
| --- | --- | --- |
| “prescriptionpad-- name agessex,date … complaints/of … temp,pulse,bp … medicine name, strength, frequency, any instructions … medicine row extras to be added” | Reordered patient identifiers, complaints, vitals, provisional diagnosis, medication table and signature. Kept blank manual fields and Add Medicine Row. | Source committed; exact-head test and rendered preview pending. |
| “prescription pad --serial no, drug name, strength frequency, duration, any instructions … ten date, patient name age and sex … under that complaint/of … pulse … bp … provisional diagnosis … under all drugs sign” | Added explicit regression assertions for this sequence; medicine rows now renumber after delete/add. | Source commits 78ffe23, f42ba91, b7a3c8e, 43944ba; exact-head CI pending. |
| “sign i will upload the sign immediately please make sure that will remain as it is” | Kept the existing assets/dr-kulkarni-signature.svg embedded in the prescription; no alteration made. | Asset presence verified. Its match to the owner's original signed image is not proven by the available upload/search results; do not claim authenticity until compared. |
| “QR code … as soon as the user will click QR” and “allow the QR to be enlarged / download … show payee and amount … fallback” | QR action opens payment and QR panels; added visible payee/UPI/amount, enlarge dialog, download link, exact-amount refresh and failure fallback. | Source committed; synthetic regression updated; exact-head CI and actual UPI scan/payment verification pending. |

## 31 October — new prescription-to-patient-register instruction

**Owner's wording:** “as soon as i enter information in the prescription it must be treated as the patient of the business and hence his name and detaisl like address,phone no date time age sex according to serial no automatically should be added”.

**Correction implemented in source:** Separate auto-generated patient registration number and prescription serial; patient name/mobile/full address/locality/age/sex/date-time fields in the prescription; owner-authenticated auto-create/update into the Daily Patient Register after the clinician's patient-information confirmation; returning-patient number reuse by normalized name + mobile; a new encounter row per new prescription; revision-checked updates for changes to the same encounter. Daily register table columns and invoice patient address transfer updated.

**Not yet proven:** Automated regression run 41182622122 must finish green; Supabase register base migration and phone-index migration must be reviewed/applied in the correct project; then verify with a synthetic patient in the authenticated preview and confirm the register row, repeat visit and invoice/PDF output. Do not use real patient data for regression. Production remains unchanged.


**CI result update:** GitHub Actions run `41183587616` passed on exact source head `9389a86ea224fb7ed7cd89c9d1cb180a827f3782`. This includes the new registration test and full repository regression suite. A mobile number is optional when unavailable; when supplied it supports returning-patient matching. Supabase migrations and live owner-authenticated preview test remain pending.


**Final regression update:** patient number suffix increased to 12 hexadecimal characters and prescription serial suffix to 8; mobile remains optional when unavailable. Full GitHub regression run `41184083412` PASSED on exact source head `36b22e5386f5e145e35a492eb9f9a7f558d71bab`, including the no-mobile path.
