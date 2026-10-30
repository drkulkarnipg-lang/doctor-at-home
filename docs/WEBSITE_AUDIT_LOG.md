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
| Prescription sharing | Clarified the share action label and dialog title, improved the registration-number typography, and made the desktop WhatsApp fallback explain the manual PDF attachment limitation. | `c6c34b6d19546a35a04ebdd1ab4f64c254730f11`; `d746e31ba63533a726477b5364d633eae5a5cb91`; `e80c818985a93d6ca6d21319b2640c62c64fab9f`; `75b377df6a7dea480e3b7db74496aa326fffc875` |
| Prescription document footer | Source configuration excludes prescription, pathology, and radiology sheets from the generic website-footer stamp. The prescription share filename is based on “Prescription”. | `document-provenance.js` and `document-sharing.js` source review |
| Health resources order | Moved “Explore health resources” to the bottom of the patient portal, before the footer. | `f1517462a622c95c0ccb78fc230a0ee8194e4d8d` |

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
- The consolidated code commit `8ca84e7c104bce7b4b8b7720da3e527b684a9dec` now reports a successful Vercel status check. This includes the main language-panel, Health Library, pre-visit intake, and prescription-sharing corrections.
- Later commits `db5141642f9b520158a0d8fb6d79ad1e4eb5762d` (payment wording), `fc822a4ade404529ad4edcda3b64913a7761a970` (privacy notice region claim), and `c359a5bb841184a153cea1517ee4d81f11caa946` (WhatsApp message length guard), plus audit-log-only commits, currently report Vercel build-rate-limit failures. Those later changes are committed in GitHub but are not confirmed deployed. The main functional corrections are covered by the successful code commit above.
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
