# End-to-End Website Audit and Restructuring Plan

**Project:** Dr. Pramod G. Kulkarni — Home Visiting ICU Doctor, Pune  
**Repository:** `drkulkarnipg-lang/doctor-at-home`  
**Production:** https://home-visiting-icu-doctor.vercel.app/  
**Current review branch:** `fix/end-to-end-contact-emergency-navigation`  
**Status:** Active audit; first preservation-safe correction batch is in PR #29. This document is a work register, not a claim that every phase is complete.

## Non-negotiable preservation controls

1. Do not delete, replace, flatten, or silently migrate existing patient-facing or clinical functionality.
2. Preserve original articles, article text, external medical-reference URLs, calculator formulas, formulary records, form IDs, document templates, booking calculations, GPS/distance/time-slab logic, authentication, privacy controls, cloud records, and integrations.
3. Production is read-only for this task. Work on a review branch; show a verified preview and test evidence before requesting release approval.
4. No merge, production publication, destructive migration, paid service activation, real payment, patient communication, or external publishing without the appropriate explicit approval.
5. Never use real patient data in tests. Use synthetic fixtures; do not expose credentials or secrets in source or chat.
6. Mark each item LIVE, PREVIEW, PARTIAL, TODO, or VERIFY only when supported by evidence. A successful build or READY preview is not proof of a working integration.
7. Keep the two main workspaces: **Patient Portal** and **Doctor Workstation**. Clinical tools can be grouped within these, not scattered into extra main tabs.
8. The public interface defaults to English. International language options remain available, but machine-translated clinical content must be identified as automatic and checked against the English source. Do not put incorrect Marathi/Hindi text into the emergency strip.
9. Keep native browser/device behaviour: links, phone dialler handoff, browser Back/Forward, standard close buttons, keyboard Escape where appropriate, focus restoration and mobile scrolling.
10. Make every changed feature testable; add regression coverage where possible. Record checks that cannot be executed in this environment rather than claiming they passed.

## Baseline facts confirmed from repository

- The application has one primary HTML entry point plus modular JavaScript/CSS, API routes, static data, 25 existing test files, 20 PDF assets and a project register.
- Existing main features include a Patient Portal, Doctor Workstation, article/health library, booking and GPS capture, fee/time/distance calculation, clinical calculators, prescription/formulary, clinical requisitions/certificates, article management, medical references, cloud records, passkey-related code and research-feed/automation code.
- The repository has 431 unique HTML element IDs in the checked baseline, with no duplicate IDs detected by the simple static audit.
- The existing master register already records significant completed work, but also explicitly leaves language completeness, universal search, device authentication, 30-day session behaviour, some clinical document options, requisition options, full EMR, n8n/provider execution, and several article/SEO items pending.
- The existing preview design has not been accepted as the final design by the owner. Avoid a new blanket redesign until a coherent reviewable design proposal is available.

## Phase 0 — Safe setup and evidence

- [x] Read `AGENTS.md`, `MASTER_TASK_REGISTER.md`, `WORK_CHECKPOINT.md`, and the current project status before editing.
- [x] Create an isolated branch for the first correction batch.
- [x] Keep the original production branch untouched.
- [ ] Confirm current main/head, all open PR dependencies, and latest successful deployment before each later batch.
- [ ] Produce a machine-readable inventory of HTML IDs, script/style references, links, article sources, calculators, forms, API routes, data assets and tests.
- [ ] Identify overlapping PRs before any merge; do not merge stacked PRs out of order.
- [ ] Run the complete test suite in a real project environment. The current tool environment could not resolve GitHub for a local clone, so no local test run is claimed here.

## Phase 1 — Critical patient contact and emergency clarity

- [x] Add a compact, responsive, English-only emergency strip with native `tel:112` and `tel:108` links.
- [x] State clearly that the doctor's number is for home-visit requests, not emergency dispatch.
- [x] Make the main header phone action say “Call 9561394341” and provide an accessible label.
- [x] Correct the contact-board label from “Direct Helpline” to “Home-visit requests”.
- [x] Correct the certificate contact label and make the phone/email clickable.
- [x] Correct prescription emergency wording to direct immediate emergencies to 112/108; retain the doctor number for home visits.
- [x] Make pathology/radiology contact numbers clickable in the relevant templates.
- [x] Correct the patient guide share footer label.
- [ ] Verify phone and WhatsApp handoff on a real phone; a desktop/cloud browser cannot prove native dialler behaviour.
- [ ] Verify all generated WhatsApp text and all remaining contact labels across every template; do not rely on a few replacements alone.
- [x] Add regression assertions in `tests/end-to-end-contact-emergency.test.cjs` for English-only emergency wording, clickable phone/email, emergency links, and preserved core workspace/booking entry points. The test has been added but not executed in this environment.

**Review artifact:** PR #29 — https://github.com/drkulkarnipg-lang/doctor-at-home/pull/29  
**Verified Vercel preview URL:** https://home-visiting-icu-doctor-pune-git-fix-d78f6a-drkulkarnipg-lang.vercel.app/  
An earlier deployment of this branch was marked Ready, but the latest checkpoint/documentation commits triggered a new Vercel deployment that is still pending. Keep using the preview URL above, but verify the latest deployment status before treating it as review-ready. The page has not been fully browser-tested in this task; do not interpret Ready as end-to-end verification.

## Phase 2 — Visual system and responsive experience

- [ ] Ask for no new requirements; use the established requirements and current source as the baseline.
- [ ] Produce a restrained design system: colour tokens, typography, spacing, borders, card surfaces, buttons, form controls, status messages, focus rings and breakpoints.
- [ ] Preserve the established Georgia/editorial brand and calm clinical intent; compare the cream/navy and sky-blue preview approaches rather than layering both.
- [ ] Make text and controls readable with adequate contrast; avoid decorative animation that distracts from emergency and clinical actions.
- [ ] Audit 320, 360, 390, 768, 1024 and desktop widths.
- [ ] Verify sticky header, touch targets, overflow, opened accordion visibility, long article scroll, modal close, keyboard navigation and focus order.
- [ ] Verify no horizontal page overflow, clipped article content, hidden buttons or dark-on-dark controls.
- [ ] Show a direct preview link and request review before publishing a global redesign.

## Phase 3 — Navigation and information architecture

- [ ] Retain only the Patient Portal and Doctor Workstation as main workspace choices.
- [ ] Organise patient content into overview, home-care guidance, health library, booking, tools, FAQ and reference links without deleting or duplicating content.
- [ ] Organise the Doctor Workstation into a clear task-based landing page and stable named modules, keeping existing feature IDs/contracts where possible.
- [ ] Keep standard browser Back/Forward working. For in-page readers/dialogs, provide ordinary Close/return controls and Escape handling where expected; do not override browser navigation globally.
- [ ] Ensure each major section and workstation tab is directly reachable and has a clear page title/heading.
- [ ] Audit internal links, fragment targets, dead links, redirects, and external-source attribution.

## Phase 4 — Health library and article management

- [ ] Fix and regression-test the exact defect where “Read the complete guide” does not show the complete original article.
- [ ] Confirm every authored section, warning, FAQ, reference and attachment is rendered; no hidden/clipped content and no summary substituted for the source.
- [ ] Preserve original text and references; machine formatting may improve headings and spacing but must not change clinical meaning or fabricate citations.
- [ ] Audit the gallery for 1,000+ articles: pagination/virtualisation, search, category/tag filters, sorting, source and review date, version history, draft/published state and duplicate detection.
- [ ] Test import/export from local files and authorised cloud/source links, including malformed files, large imports and rollback.
- [ ] Test download/share/print/PDF outputs and clear filenames; do not claim recipient delivery merely because the share sheet opened.
- [ ] Keep author approval and clinical review as hard gates before publication.
- [ ] Preserve all current article URLs and medical-reference URLs; additions must not replace existing sources.

## Phase 5 — Booking, contacts and payment

- [ ] Regression-test required fields, validation, GPS permission/denial, coordinates, map link, distance slabs, time-of-day slabs, procedures, totals and WhatsApp request text.
- [ ] Confirm all displayed estimates are described as estimates and visit availability is doctor-confirmed.
- [ ] Confirm payment choices are collapsed until requested and QR appears when selected.
- [ ] Verify UPI QR payload/payee/amount against a known-safe test; do not display placeholder QR or imply that a payment succeeded without provider confirmation.
- [ ] Keep Razorpay/other gateways pending until merchant configuration, webhooks, refunds, security and reconciliation are verified. No paid activation without approval.
- [ ] Test the full booking flow with synthetic data on desktop and phone; no actual booking or patient message during testing.

## Phase 6 — Doctor Workstation and clinical documents

- [ ] Keep authentication and authorization intact; never bypass the lock to make a page easier to reach.
- [ ] Check all existing workstation tabs and controls against the feature-ID inventory before refactoring.
- [ ] Test prescription add/delete rows, medicine selection, dosage fields, formulary search/import/export, age/DOB handling, allergy/vitals/advice and document preview.
- [ ] Audit pathology options including lipid profile, ammonia and iron studies; audit radiology options including portable/bedside USG, separate arterial/venous Doppler and CT/MRI choices.
- [ ] Test Form 2, Form 4, Form 4A, fitness/unfitness, referral, consent, prescription, lab/radiology requisitions and other existing forms.
- [ ] Verify A4 PDF dimensions, long-content overflow, all entered rows, signatures/date/time fields, filenames, download, print and native share. Never truncate a long document just to force one page.
- [ ] Distinguish handwritten-signature space from a verified electronic signature. Never auto-invent examination, death, issue or signing events.
- [ ] Keep official government originals unchanged; validate current jurisdictional versions before claiming legal validity.
- [ ] Add patient, stock and death registers only in the appropriate secured workstation area; verify permissions, audit history, export and retention requirements.

## Phase 7 — Medical references, tools and international languages

- [ ] Inventory and preserve every existing external reference URL (medical manuals, drug resources, journals, imaging, calculators and official guidance).
- [ ] Keep links distinguishable from integrated features; a link to a service does not mean the service is connected.
- [ ] Audit all patient calculators and unit converters against existing formula tests and independent known-value fixtures.
- [ ] Keep patient-safe explanation separate from clinician-facing calculation details and ensure units, limits and warnings are visible.
- [ ] Keep English as the default UI; provide a bounded, accessible language selector with clear availability and failure states.
- [ ] Keep authored translations separate from automatic translations; clinical content requires human review before it is represented as verified.
- [ ] Confirm original source text and links remain accessible after language selection.

## Phase 8 — Security, data, cloud and integrations

- [ ] Review all API routes for authentication, authorisation, input validation, rate limiting, error handling, logging and data minimisation.
- [ ] Review CSP and other security headers against actual dependencies; do not weaken them to silence errors.
- [ ] Test session expiry, logout, device trust/30-day session requirements, passkey enrolment and fallback using the owner's device.
- [ ] Never store raw biometric data; use standard platform authentication.
- [ ] Verify cloud record consent, ownership boundaries, deletion, export and recovery with synthetic accounts.
- [ ] Verify n8n/provider setup using explicit health checks and successful manual plus scheduled test executions; code and workflow files alone do not establish activation.
- [ ] Add storage only after measuring current data and file volumes; define backups, restore tests, retention, export and cost limits.
- [ ] Do not enable paid provider inference or send external messages without approval.

## Phase 9 — End-to-end regression and release gate

- [ ] Run all current tests plus newly added regression tests.
- [ ] Browser test the patient journey: land → call/WhatsApp → search/read full article → language selection → booking estimate/GPS → payment UI.
- [ ] Browser test the clinician journey: login → navigate workstation → search/select medicine → create synthetic prescription → requisition/certificate → export/print/share → logout.
- [ ] Verify every original key element ID, form, link, calculator, source, article and data asset against the baseline inventory.
- [ ] Test keyboard-only, screen-reader labels, focus visibility, contrast, reduced motion and mobile breakpoints.
- [ ] Check console errors, failed requests, broken links, page performance, SEO metadata, sitemap and privacy/legal notices.
- [ ] Record test name, environment, result, timestamp and known limitation; distinguish automated, browser and owner-device checks.
- [ ] Attach a direct preview URL, changed-file list, test summary, risks and rollback instructions.
- [ ] Request owner review. Do not merge or publish without explicit approval.

## Definition of done

The restructure is complete only when the preserved-feature inventory is reconciled, all high-priority workflows have evidence, tests pass, no critical data/content regressions remain, limitations are listed, the owner has a reviewable preview, and production publication is explicitly approved. A plan, pull request, or Ready deployment alone is not completion.


## Current implementation checkpoint — 29 October 2026

This section supersedes earlier deployment-pending notes above. The latest branch head checked for this checkpoint is `5e8ef19c7f70da009e4f9db5d62ced297dfd9297`; Vercel status is **success/Ready**. This is a preview only, not production publication.

### Implemented in PR #29 (draft; not merged)
- Header language selector remains visible and accessible; English is the original/default. The Google Translate dropdown is not moved into the article reader, and no Marathi-only language panel is injected. It exposes the languages supported by the translation service, not literally every language in the world.
- Patient portal navigation switches between focused content groups: overview, home care, health library, booking, tools, FAQ and health sources. Browser Back/Forward restores the previous section.
- Responsive sky-blue clinical visual pass for the hero, header selector, section tabs, article reader, quick intake and publisher controls; mobile breakpoints and focus states added.
- Separate phone-dialler, WhatsApp and email actions are available from the header/hero. Native phone and share-sheet behaviour still needs device QA.
- Health-library cards default to authored English. The reader now uses a native `<dialog>`, renders the complete authored English article with all sections/references/FAQ/takeaway, and supports browser Back, close and Escape. The extra in-reader “back to library”, download and share buttons were removed.
- Home-visit flow presents name/contact/address/GPS first, then optional complaints, known history, allergies, past surgeries, LMP, height/weight/BMI, temperature, medicine notes and original prescription/discharge-summary attachments. The much longer detailed intake is collapsed by default. Attachments use the device share sheet when supported; unsupported browsers cannot attach files automatically through a WhatsApp URL.
- Removed the prefilled “NKDA” allergy assumption and preselected CBC/KFT/electrolyte/chest-X-ray orders.
- Prescription sharing uses `Prescription.pdf`; the prescription sheet no longer includes the doctor's email; registration typography is compact. Lab and radiology sharing target the correct existing elements and descriptive filenames. The native file-share sheet is attempted first; fallback limitations are reported honestly.
- Article content editor has device-file import, public-URL fetch where CORS/permissions allow, saved-draft reload, status feedback and clear publishing-vs-reading labels. Existing authenticated cloud-article refresh/load/start controls remain in the dedicated publisher panel.
- Government Form 2 / Form 4 / Form 4A original PDF links remain unchanged and available. Editable forms are explicitly treated as working layouts, not exact government facsimiles.

### Source-level checks performed
- Current HTML scan: zero duplicate IDs; core patient/workstation, booking, GPS, calculator and document IDs remain present.
- Static assertions checked: visible header language selector; English default; native article dialog; full article rendering path; separate call/WhatsApp/email links; quick intake attachments; corrected PDF target IDs/names; article import controls; original government PDF links.
- Added tests: `tests/end-to-end-contact-emergency.test.cjs` and `tests/end-to-end-website-preservation.test.cjs`.
- **Tests not executed:** the repository could not be cloned in this environment because GitHub hostname resolution failed. Vercel Ready is not evidence that tests pass or that native device actions work.
- The review preview URL is https://home-visiting-icu-doctor-pune-git-fix-d78f6a-drkulkarnipg-lang.vercel.app/ . The available browser inspection tool could not load the preview, so visual browser QA is still open.

### Remaining critical work
1. Run both new regression tests and the full existing test suite in a repository-capable environment; fix failures before asking for review.
2. Interactively test every patient tab, browser Back/Forward, the full article reader, translation dropdown and 320–1440px layouts.
3. Test real Android phone dialler, WhatsApp, native PDF file share, save/print and page count on the owner's device.
4. Verify government Form 2/4/4A against the current official originals. The existing editable layouts are not exact facsimiles; do not claim statutory-format compliance until exact field mapping and PDF output are reviewed. Form 2 may be multi-page in the official original and must not be distorted merely to force one page.
5. Verify external source import: browser CORS/paywall/login restrictions can block arbitrary web imports. A connected authenticated cloud article list is distinct from importing arbitrary files or URLs.
6. Complete the full workstation security/session, payment, cloud backup, article scale and integration audit in this document.

No merge, production deploy, real payment, patient communication, public publishing or paid integration is authorised by this checkpoint.

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
