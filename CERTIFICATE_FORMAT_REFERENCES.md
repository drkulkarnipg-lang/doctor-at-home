# Certificate formats and research update links

Updated 22 October 2026. The approved design baseline is preserved in commit `6259653c3ecd3115129efc8b3dbbcaa9d1eeef5f`.

## Workstation navigation

- Live RSS & AI Research Agent: Medical Xpress Updates and its publisher RSS directory are visible next to Feedly. Medical Xpress is also available in the RSS source selector. Its stories are research news, not automatically peer-reviewed studies. The publisher's original article should be reviewed before clinical use. The existing RSS-to-JSON service still determines whether a feed loads; the direct publisher link remains available if it fails. No daily automation is activated by adding a link.
- Referral, Consent & Fitness: select Medical Fitness or Medical Leave / Unfitness. Includes record number, patient identification, examination date, findings, treatment/leave dates, work assessment or leave duration, issue details and blank signature/seal area.
- Death Certificates: select Form 2, Form 4 or Form 4A. Form 2 has separate legal/informant and statistical/registrar pages; Form 4 is for hospital in-patients; Form 4A is for non-institutional deaths. The cause-of-death section includes the Part I sequence and intervals, Part II and pregnancy/delivery fields. Form 4 also includes manner of death and injury details.

## Source and status

The editable forms are working layouts based on official reference forms, not facsimiles or a claim of universal acceptance. When an employer, receiving Registrar or local portal mandates a particular form, use that prescribed form. Links to the official references appear beside the relevant forms in the workstation. The website does not submit a CRS registration or issue a Registrar's death certificate.

- ORGI / CRS Form 4 and Form 4A, with instructions: https://dc.crsorgi.gov.in/assets/download/MCCD_Form.pdf
- Maharashtra government CRS handbook (2026), including reporting-form guidance: https://cdnbbsr.s3waas.gov.in/s3f3ac63c91272f19ce97c7397825cc15f/uploads/2026/03/2026032088191524.pdf
- Maharashtra registration rules and appended forms, Bombay High Court official repository: https://bombayhighcourt.gov.in/bhc/libweb/legislation/rules/R2000.001.pdf
- Government reference for leave and return-to-duty certificates: https://ccsniah.gov.in/download/format/Medical_Certificate_Form_4_and_Fitness_Certificate_Form_5.pdf
- Medical Xpress publisher links: https://medicalxpress.com/ and https://medicalxpress.com/feeds/

## Data and output

All patient information and clinical decisions start blank. There is no prefilled diagnosis, fitness declaration, cause/manner of death, signature or examination/issue date. Optional Aadhaar fields in the Form 2 working layout are not required. The form tool neither persists patient entries in browser storage nor sends them to a server. Entries remain only in the current open page; a downloaded or printed copy is a separate record managed by the user.

Print and PDF output use the selected sheet only and replace form controls with text to preserve multiline entries and selected choices. Browser Print supports Save as PDF without the external html2pdf dependency. Fitness, Unfitness, Form 4 and Form 4A have one-page blank/short-entry layouts; Form 2 has two pages. Long clinical entries can extend pagination. The leave-duration helper counts both start and end dates and does not infer clinical dates.

## Verification

Preserved all existing element IDs and inline application scripts, retained the clinical document and legal form selectors, consent/referral actions and existing external links. Browser checks cover all five editable forms, blank defaults, inclusive leave dates and reversed-date handling, selected-only printing, multiline/value preservation and no document overflow at 360px. PDF pages were rendered and visually reviewed. No test patient data is included in the website.


## Separate one-page official blank downloads — 30 October 2026

The app now exposes separate download routes for the **official blank form page only**:
- Form 2: `/api/official-form-pdf?form=2` — zero-based page index 4 (PDF page 5).
- Form 4: `/api/official-form-pdf?form=4` — zero-based page index 8 (PDF page 9).
- Form 4A: `/api/official-form-pdf?form=4a` — zero-based page index 10 (PDF page 11).

Source: Government of India Civil Registration System, `https://dc.crsorgi.gov.in/assets/download/all_forms_CRS_2019_new.pdf` (23-page combined official PDF; each form is followed by its reverse-side instructions). The endpoint extracts the single form page so each form downloads separately; the complete official PDF reference remains available for instructions.

**Important:** this preserves the central CRS form page exactly, but local registrars may prescribe state/local variants or additional instructions. Confirm the current Maharashtra/Pune Registrar requirements before official filing. Editable website working-layout PDFs remain separate and must not be described as exact facsimiles of the government original.
