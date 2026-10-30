# Website Audit Log

**Project:** Home Visiting ICU Doctor  
**Production URL:** https://home-visiting-icu-doctor.vercel.app/  
**Repository:** https://github.com/drkulkarnipg-lang/doctor-at-home  
**Audit date:** 30 October 2026

## Working rules

Preserve existing routes, features, clinical content, and data. Make minimal corrections, review source changes, run relevant checks, and distinguish source changes from successful deployment and live verification.

## Corrections committed to the repository

| Area | Implementation recorded | Evidence / commit |
|---|---|---|
| Mobile header | Added wrapping for the language selector and Patient Portal controls; narrowed the wrapping selector to the adjacent Patient Portal control group. | `88a9181f85cd032af7872ec484cc02587dbf67fd`; `02bf7dc226b039a95436e3e7d238de0ecbbb4ffc` |
| Language-panel overlap | Corrected the stylesheet rule that absolutely positioned the header's actual `.language-row` as if it were a dropdown panel. | `869f18e5a7972f8ff6170b4b5457132acc5e7aa1` |
| Header language selector | Kept the all-language Google Translate selector in the header row and moved authored English/Marathi article controls into the article reader. Header language changes are allowed to translate the whole site; article controls retain authored language behaviour. | `9ea895e7d136d492566d6d905b99975ad754bfba`; `dd8a1454ae0b7445536c11e6bf3f3c0a8e00100d`; `10ef383a1cdff7fc6804d2106006bb77b54ce45c` |
| Health Library cards | Removed separate “Share original PDF” and “Download original PDF” buttons from article cards so the primary action opens the article. The existing reader history handler supports Back/Forward and Escape. | `9285c71d70ca1c286731c4cfac4f56182325b41a` |
| Pre-visit workflow | Connected the existing patient-history form's short history text to the WhatsApp booking message, validated Indian mobile-number formats, added optional structured temperature, weight, height, and BMI fields, and handled attachment-only submissions without creating an empty history PDF. Existing consent and attachment workflow remains the source of detailed history and files. | `66c3a842f68650d22a11e84dda11e291c233191b` |
| History-sharing fallback | For long histories or selected files, the fallback now targets the doctor's WhatsApp number and clearly instructs the user to attach the downloaded PDF/original files manually. Attachment-only sharing uses the native share sheet when supported or opens WhatsApp with a cover note and explicit manual-attachment instructions. The site does not claim to upload or auto-attach files. | `935f77ecce77040281a2b5f3260e3954b6f3a029` |
| Prescription sharing | The prescription action now routes through the actual PDF share workflow (not plain-text sharing), uses the `Prescription_YYYY-MM-DD.pdf` filename, targets the entered patient number in the desktop WhatsApp fallback when available, improves registration-number typography, and explains manual attachment where the browser cannot share files directly. The text export is explicitly a download, not a cloud save. | `c6c34b6d19546a35a04ebdd1ab4f64c254730f11`; `d746e31ba63533a726477b5364d633eae5a5cb91`; `e80c818985a93d6ca6d21319b2640c62c64fab9f`; `75b377df6a7dea480e3b7db74496aa326fffc875` |
| Prescription document footer | Source configuration excludes prescription, pathology, and radiology sheets from the generic website-footer stamp. The prescription share filename is based on “Prescription”. | `document-provenance.js` and `document-sharing.js` source review |
| Health resources order | Moved “Explore health resources” to the bottom of the patient portal, before the footer. | Source reviewed in `index.html`.
| Webhook configuration | Removed the inactive browser-stored Make.com/n8n webhook field and its success toast; the settings panel now clearly says server-side integration is not connected and warns against pasting secrets into the browser. The stale loader was removed. | `aa55162e787fdd29e63d4a668a4499797c5f2768`; `ac2ad2cd17a977580a7ec62544204b3d0a458f03`\n| Article source-link safety | Published article reference links now accept only HTTP(S) URLs without embedded credentials. Unsafe schemes render as escaped text rather than clickable links. | `e3f1bc4cab592e4e28fbccf54b5eea1dc56287bf`\n| Privacy and payment accuracy | Removed the unverified Supabase-region claim from the privacy notice and clarified that UPI/QR is active while gateway setup and bank transfer remain limited. | `fc822a4ade404529ad4edcda3b64913a7761a970`; `db5141642f9b520158a0d8fb6d79ad1e4eb5762d` `f1517462a622c95c0ccb78fc230a0ee8194e4d8d` |

## Source-level checks completed

- JavaScript syntax compilation passed for `awareness-library.js`, `document-sharing.js`, `booking-intake.js`, `patient-language-access.js`, `document-provenance.js`, and `clinical-documents.js`.
- All four inline executable scripts in `index.html` passed syntax compilation.
- HTML source scan found no duplicate IDs.
- HTML source scan found no missing targets for internal hash links.
- Static scan found all 42 unique inline click-handler names in the HTML defined in the inline code or the referenced JavaScript source.
- Braces are balanced in `international-portal.css` and `workstation.css`.
- The BMI and HbA1c/eAG public calculators already display reference/interpretation notes and source links.
- The Celsius/Fahrenheit and kilograms/pounds bidirectional conversion logic already exists in `unit-converters.js`.

## Deployment and live verification — OPEN

- Commit `88a9181f85cd032af7872ec484cc02587dbf67fd` has a successful Vercel status check.
- Consolidated source commit `8ca84e7c104bce7b4b8b7720da3e527b684a9dec` reported success, and the latest website-code commit `469c1a418731162520e06f28e4bae03d94271067` now also reports a successful Vercel status check. The latest successful code commit includes the language-panel, Health Library, pre-visit, prescription-PDF, privacy/payment, and webhook-control corrections.
- The production UI has not been visually inspected at real mobile viewport sizes in this session. A successful Vercel check confirms deployment status, not the final mobile interaction result.
- Legacy browser-local values from the former `patientCloudPrescriptions` and `makeWebhookUrl` keys are not automatically deleted to avoid destroying user data; the current UI no longer reads or writes these keys. Any legacy entries remain local to the user's browser.
- Actual production/mobile visual verification has not been completed in this audit session. In particular, the language panel must be checked at 320 px and 390 px widths, including whether the Patient Portal, Doctor Workstation, hero links, and navigation remain visible and clickable.
- Prescription sharing must be checked on a device supporting Web Share and on desktop fallback.
- The pre-visit workflow must be manually tested with synthetic data, with and without attachments, and with both short and long history.
- No claim of zero defects or full completion is made until the deployment blocker clears and the live workflows are tested.

## Next verification sequence

1. Obtain a successful Vercel deployment for the current `main` source.
2. Confirm the production build includes the latest language-row CSS and language-controller changes.
3. Test mobile viewports at 320 × 700 and 390 × 844; confirm no overlap and no blocked clicks.
4. Test Health Library article open, Back, Forward, Escape, and focus restoration.
5. Test pre-visit consent, short-history WhatsApp text, long-history PDF sharing, and manual attachment instructions.
6. Test prescription share naming, direct native sharing where supported, desktop fallback, and absence of generic website footer text.
7. Continue the remaining security, storage, payment, SEO, accessibility, and responsive audit from the master prompt.

## Latest requested corrections — 30 October 2026

- **Shorter pre-visit form:** The first screen is now a compact essentials panel rather than a long questionnaire. It surfaces known illnesses, medicine allergy and reaction details, past surgery/admission, last menstrual period when relevant, temperature, weight, height, and BMI. Detailed symptom history, medicine-by-medicine reconciliation, seizure-specific details and other background questions remain available in collapsed optional sections; no existing workflow was intentionally removed.
- **BMI retained and automated:** BMI is read-only in the pre-visit form and recalculates from entered weight (kg) and height (cm). The field includes adult BMI reference bands: 18.5–24.9 kg/m²; <18.5 underweight; 25.0–29.9 overweight; ≥30 obesity category. This is a screening guide, not a diagnosis; paediatric and pregnancy interpretation differs.
- **Existing records still supported:** The user can attach up to three existing PDF/JPG/PNG files, such as the latest prescription, discharge summary or medicine-reconciliation form, within the existing device-side limits. Consent, preview, print/save-as-PDF, share and WhatsApp flows remain in place. The website does not claim files are uploaded or automatically sent when they are not.
- **All clinical calculators:** The clinical calculator count now says 30. Each calculator card presents its own source-linked reference/interpretation note under “Standard reference range / threshold / interpretation”, followed by a disclaimer that local laboratory ranges and individual titration/clinical targets may differ. Calculators with no universal reference interval explicitly say so and direct the user to the prescribed value, device specification or local laboratory as appropriate. The BMI calculator is retained.
- **Styling:** Added a responsive two-column desktop / one-column mobile layout for the compact essentials panel and a restrained per-calculator disclaimer style.
- **Source-level checks:** booking-intake.js and clinical-calculators.js pass JavaScript syntax compilation. All four inline executable scripts in index.html pass syntax compilation. These checks do not replace live browser testing.

## Verification still required

- **Current deployment blocker:** GitHub reports the Vercel status check as `failure` with target `https://vercel.com/drkulkarnipg?upgradeToPro=build-rate-limit` for the new form/calculator commits, including `7882d10d192b8eaa8204bb1335b8a971dafcf304`, `572d5192d7569d0c21b8ed8186f264989fc7608b`, `01f460cedad6e819cb8fa7d6b82ca171a9ef23cc`, and `c645d60f1fe4bd851ac3727fb38272dbaa73a28e`. These corrections are committed to GitHub but are **not confirmed live**. No hosting, billing or production configuration was changed.
- Deploy the latest commits and verify the actual production site, especially the compact form at narrow mobile widths.
- Manually test BMI calculation for valid and empty weight/height, file selection limits, consent gating, print/PDF, native share, and WhatsApp fallback using synthetic data only.
- Visually confirm all 30 calculator cards show their reference/interpretation note, source link and disclaimer at desktop and mobile widths.
- A GitHub commit or syntax check is not proof of production deployment or end-to-end browser functionality.


## Header language-selector overlap — source correction (30 October 2026)

- **User requirement:** The language selector must not hide the Patient Portal or Doctor Workstation controls; retain the language selector at the header and make the header usable on desktop and mobile.
- **Root cause confirmed in source:** `index.html` used a generic `<div class="language-control">`, while the existing CSS and layout rules target a native `details.language-control[open]` element. Consequently, the intended open/closed disclosure behaviour and its in-flow expanded-panel layout were not activated by the markup.
- **Correction committed:** Commit `0b2e049d880416f6df78c9f669bf5a74640d1367` converts the control to native `<details>/<summary>` and places it after the Patient Portal / Doctor Workstation button group. The Google Translate mount, translation status, help link, existing CSS, and both portal buttons are preserved.
- **Source-level validation:** Exactly one language-control details element; no legacy div-based language control; Patient Portal and Doctor Workstation occur before the language panel; Google Translate mount and translation status each occur once; matching in-flow expanded-panel CSS exists. HTML source contains 483 IDs and 0 duplicated ID values.
- **Status:** SOURCE-CONFIRMED / FIXED — PENDING LIVE VERIFICATION. The current Vercel status check still reports `build-rate-limit`; this commit is not confirmed live. Desktop/mobile visual and click testing remain required after deployment, especially 320 px, 390 px, and desktop widths. No hosting, billing, secrets, or deployment configuration was changed.


## Calculator reference-label regression assertion — 30 October 2026

- **Owner requirement:** Every individual calculator must display its standard reference range / threshold / interpretation with source guidance; the public “Know your numbers” reference area must not remain a filled green box and source actions must be visibly clickable.
- **Baseline finding:** `clinical-calculators.js` correctly renders the requested heading `Standard reference range / threshold / interpretation` on each calculator card. However, `tests/calculator-ui.test.cjs` still asserted the obsolete label `Reference / interpretation`. The assertion was stale and would fail against the current UI label.
- **Correction:** Commit `2e9e8fb7672e3a5b33d9e11f1d23f025c0a5802c` updates the regression assertion to require the exact standard-reference heading. No production application code was changed in this test-only correction.
- **Existing coverage reviewed:** The UI test checks 2 public calculators + 28 clinical calculators, each reference panel and source link, multiple reference bands, BMI, conversions in Patient Portal and Doctor Workstation, and diet-preset insertion preserving existing advice. `tests/public-calculator-reference-style.test.cjs` asserts public reference notes have no filled green background or green outline and source links remain visibly clickable with a comfortable target.
- **Status:** TEST FIX COMMITTED — CI PENDING. Latest main-head regression run must confirm this exact commit. Source-based review does not substitute for clinical source-by-source review or live visual verification. Vercel deployment remains separately blocked by `build-rate-limit`; do not claim the latest application code is live.


## PDF / requisition share fallback — close dialog after successful file handoff (30 October 2026)

- **Owner's request:** “lab slip pathvitana whatsapp nusate ughadale, share command proper work hot nahi” — the share action must hand the actual document to a supported sharing app, not merely leave a stuck modal or open WhatsApp without explaining attachment limits.
- **Baseline / root cause:** `document-sharing.js` already generated a PDF and tried the Web Share API with the actual `File` plus selected original attachments. When that direct attempt failed and the user retried from the fallback dialog, a successful `navigator.share()` only updated the status text; the dialog remained open, making the action look unfinished.
- **Correction:** Commit `0934b175e89b5d4882b584e00d6bd24483612017` now closes the share dialog, releases temporary object URLs/files, and shows a completion toast when the fallback native file-share resolves. The status explicitly says the website cannot confirm recipient send/receipt. Commit `c37e924db498e56e8e008b80a75872580fb45a82` adds a regression assertion that the dialog closes after successful fallback sharing.
- **Preservation:** The generated PDF, original selected attachments, existing document-specific filenames, WhatsApp manual-attach fallback, download option, cancellation behaviour and privacy model are retained. No document is silently uploaded or sent automatically.
- **Status:** SOURCE + TEST COMMITTED — CI and real-device verification pending. Test simulates native share acceptance with synthetic bytes/files. Actual WhatsApp app behaviour, device share sheet, downloaded PDF readability and recipient-side delivery remain unverified; opening WhatsApp alone cannot attach a file.


## Cloud article fetch controls moved above the content editor — 30 October 2026

- **Owner's request:** Put the cloud/device article fetch/import controls above the content box; make Refresh, Load and Start clear, boxed and functional. The Moon Reader is a reading interface, not the primary authoring/publishing workspace.
- **Baseline:** `public-article-editor.js` created the cloud article selector, Refresh, pagination, Load and Start controls inside `publicArticlePublisher`, which was inserted after the article content box. This put the fetch controls below the text area the owner was trying to populate.
- **Correction:** Commit `3c62f7032675e84fba1444578bcba080898a4175` creates a separate `publicCloudArticleImportToolbar` before the content editor and moves the existing refresh/select/pager/load/start/status controls into it. The publishing/AI/review controls remain in the existing publishing panel. The cloud article selector now has an explicit accessible label.
- **Styling:** Commit `9a9275bea1cc6527fa9f02f563b21e05f1a6e31e` gives the toolbar a light bordered panel, wrapping layout, minimum 44 px controls, visible focus and responsive select sizing. Existing rectangular button styling is applied to controls in both the toolbar and publishing panel.
- **Regression coverage:** Commit `1f2d7fdbf4eb37153cfc38162f049ea61a40d915` updates `tests/public-article-editor.test.cjs` to assert the cloud toolbar appears before the content box, the three controls are inside it, pagination is grouped, the status stays visible and the selector is labelled. `new Function` syntax checks pass for the editor/share scripts and all four inline executable scripts; source contains no duplicate HTML IDs.
- **Limits:** Refresh/load are wired to the existing `/api/articles-admin` endpoint and are tested with synthetic API responses. Actual owner login, Supabase/cloud provider configuration and cross-device persistence remain external gates. Local attachments remain device-local; a Google Drive link retains its own permissions. No content or saved article was deleted.
- **Status:** SOURCE + TEST COMMITTED — CI and live responsive verification pending.


## Pre-visit form essential sections — regression failure corrected (30 October 2026)

- **Owner's requirement:** Keep the pre-visit intake compact and open only the essential patient/problem sections; optional history remains collapsed and no fields are discarded.
- **CI finding:** Workflow run `41103557791` on commit `9a9275bea1cc6527fa9f02f563b21e05f1a6e31e` failed in `tests/booking-intake.test.cjs`. The assertion expected the first two sections to be open, but the source opened only section 2 because `section()` used `title.startsWith('2.')`. The page's own instruction also said to complete sections 1 and 2.
- **Correction:** Commit `cc51e9b431820d9852f1f064f8fed6b0defe9ed4` changes the rule to open sections 1 and 2 only; sections 3–6 remain collapsed. This preserves the compact intake and matches the explicit quick-start instruction/test.
- **Status:** SOURCE FIX COMMITTED — latest-main CI pending. The failing run is retained in the record; do not mark the task CI-passed until a newer run on a head containing `cc51e9b431820d9852f1f064f8fed6b0defe9ed4` passes. Live/mobile form verification remains pending because Vercel reports build-rate-limit.


## Long-history booking message — attachment limitation made explicit (30 October 2026)

- **CI finding:** Regression run `41104015232` reached `tests/booking-intake.test.cjs` and failed because the long-history booking message did not explicitly state that the booking WhatsApp link cannot attach the complete history PDF. The test expected `must attach the complete history PDF`.
- **Correction:** Commit `fc0d3755df3d90c52619eea1237a9a8c9db4b2fc` updates the long-history booking text to say the booking link cannot attach files and that the user must attach the complete history PDF/original files separately or use the dedicated `Send history to doctor on WhatsApp` share-sheet workflow.
- **Rationale:** A `wa.me` URL can prefill message text but cannot silently attach a PDF or original files. The dedicated share button uses the device's file-sharing API when supported; the site cannot verify that the recipient actually sent or received the files.
- **Status:** SOURCE FIX COMMITTED — latest-head CI pending. The failed run remains documented; do not mark long-history sharing CI-verified until a newer run on a head containing `fc0d3755df3d90c52619eea1237a9a8c9db4b2fc` passes. Real WhatsApp/PDF delivery remains a device-level check.


## Preserve automation settings control without accepting browser secrets — 30 October 2026

- **CI finding:** Workflow run `41104505406` passed the pre-visit test after the section/message fixes, then failed in `tests/calculator-ui.test.cjs` because `webhookUrlInput` was listed in `tests/existing-feature-ids.json` but absent from the settings UI.
- **Correction:** Commit `ef666dc6aad56b9585e2db6b43edb2488779710c` restores the existing `webhookUrlInput` identifier as a visible but disabled placeholder. The adjacent explanation says the integration is not connected and webhook configuration must be server-side; users are explicitly told not to paste webhook URLs or credentials into the browser.
- **Regression protection:** Commit `425b47d3d6a9610b1e19d0cb2bd3a2e8006fca12` keeps the existing-feature-ID preservation test and adds assertions that the webhook field remains disabled and indicates server-side setup.
- **Status:** SOURCE + TEST COMMITTED — CI pending. This preserves the interface without exposing an unsafe client-side webhook editor. It does not enable Make.com/n8n or prove that any booking webhook executes.


## Workstation register migration / RLS static review — 30 October 2026

- **Owner requirement:** Test Daily Patient, Death and Stock Register UI/API and review migration/RLS separately; do not imply that source tests applied the database migration or proved live isolation.
- **Source review:** `supabase/migrations/20261030_workstation_registers.sql` creates only daily/death/stock register types, enables and forces RLS, revokes broad access, grants authenticated select/insert/update, requires `owner_id = auth.uid()` plus membership in `clinic_members`, and provides no DELETE grant/policy. `20261023_patient_trends.sql` creates `clinic_members` with self-read policy and no client insert grant. `api/clinical-cloud.js` enforces the configured clinic-owner UUID before register routes; register updates require matching ID/owner/revision. `workstation-registers.js` provides no delete action, clears in-page records on sign-out, and does not write the registers to localStorage.
- **New regression guard:** Commit `0e4afabbf1cace202fee5ecc81411e09ebd16fc5` adds `tests/workstation-registers-migration.test.cjs` to check RLS enable/force, membership/owner predicates, no client membership self-enrolment, no DELETE privilege/policy, API owner guard, revision check and sign-out clearing.
- **Status:** STATIC MIGRATION REVIEW + TEST ADDED — CI pending. No Supabase migration was applied. Actual owner/non-owner RLS testing, backup/restore, and authenticated cross-device operation still require a dedicated database and owner/provider configuration; do not use production data for synthetic tests.
