# Doctor at Home — Spacious Stitch redesign

Prepared 22 October 2026. Based on GitHub commit `37c7284a26fe1de8b89abf1e9214425d3aebb5fb` and the live Netlify version inspected during this task.

## Included

- Warm ivory/cream layout, editorial typography, larger spaces and responsive cards based on the supplied Stitch design.
- All 158 original GitHub element IDs, original inline application scripts, event bindings, outgoing links and fee options retained.
- All 30 existing patient calculators retained.
- Existing prescriptions, PDF/print actions, investigation slips, clinical certificates, death forms, WebMD/AI links, research links, article editor, language support, PIN and webhook settings retained.
- Live-only custom medicine entry, additional formulary records, public article sharing, credentials and rule-based Quick Help restored alongside the GitHub modules.
- 45 unique inherited formulary entries. Bulk CSV/JSON import supports up to 10,000 imported records, search across the catalogue, pages of 100, export backup and blank dosing for new imported records.
- Curated Marathi FAQ with search, topic filters, expandable answers and a WhatsApp handoff.
- Article attachments from PC/mobile; Google Drive or publisher links; local file persistence using IndexedDB.
- Research draft JSON import, duplicate URL checks, source-scope labels, physician review notes, export backup and transfer to Article Manager without auto-publication.
- Twenty-entry BP/lab trend with measured inputs, computed MAP, browser save, JSON export and print.
- Fee calculation retained; local UPI QR generation added; WhatsApp booking requests directed to the clinic with fee details.
- Local utility CSS, English/Devanagari fonts and icon assets reduce reliance on external styling services.

## Verification completed

- JavaScript syntax checks and original-feature preservation audit.
- Browser checks at 1440px desktop and 390px/360px mobile; page width matches the viewport.
- All 30 calculators initialize; all 45 inherited medicines render.
- Research import, duplicate handling, rejection of non-HTTPS sources, text-safe rendering, editor transfer and no automatic publication.
- Device file plus Drive-link attachment saved to an article.
- 1,000 synthetic catalogue rows imported in a test-only browser context; pagination, full-catalogue search and blank imported dosing checked. Synthetic test rows are NOT part of this release.
- BP 120/80 produces calculated MAP 93.3; local trend save checked.
- ₹1,200 base + ₹300 distance + ₹700 procedure = ₹2,200; QR amount and clinic WhatsApp destination checked without sending a message.
- FAQ search and no-result handling checked. No browser JavaScript errors observed during these tests.

## Still needs connection

- GitHub access was restored after installing the connector. This version is prepared for review on `design/stitch-spacious-portal`; merging and production publication are separate steps.
- A licensed CIMS/MIMS dataset or another authorized Indian catalogue. This release does not contain 1,000 verified CIMS medicines, licensed MIMS API integration, or clinical interaction checking.
- Feedly/RSS sources, secure model credentials, workflow host and daily execution settings. There is no active scheduled AI agent yet. See RESEARCH_AGENT_SETUP.md.
- Shared authenticated storage/CMS for articles, attachments and research reviews across devices. Current data stays in the browser/device; an accessible online link can still be opened from any device with the source owner's permission.
- Live availability/calendar reservations and payment verification. Booking prepares a request; it does not confirm an appointment or a completed payment.

Clinical material inherited from the original versions has been preserved, not independently validated in this design task. The existing PIN gate and browser records are not an authenticated server-side patient-record system.

## Run or deploy

Extract the ZIP and use the complete folder, keeping index.html beside its CSS/JS/assets. For a local preview, serve the folder over HTTP (for example `python -m http.server 8000`) and open localhost:8000. Use HTTPS hosting for GPS and full browser storage support. Upload the folder contents to a new review branch or preview deployment once access is available. Do not replace the live site before reviewing this version.

MIMS integration references:
- https://cds.mims.com/faqs/
- https://www.mims.com/terms-of-use/

Indian catalogue source to evaluate under its package licence:
- https://www.nrces.in/services/national-releases

## Follow-up: editable certificates and Medical Xpress

Medical Xpress is now prominent beside Feedly, with a publisher RSS link and selectable news feed. Fitness/Unfitness and death Forms 2/4 have complete editable working layouts; Form 4A is aligned with the official reference. Form 2 separates informant/legal and statistical/Registrar information. Clinical conclusions stay blank. Selected-only print/PDF output preserves typed values and multiline entries. The approved design baseline remains preserved in GitHub history. See CERTIFICATE_FORMAT_REFERENCES.md for official references, form status and validation.

## PDF sharing, service chat and server-side feeds - 23 October 2026

PDF is now the default document/article share, with a native file-sharing action and explicit download/attach fallback. The PDF engine is local. Interactive patient service help replaces the generic symptom reply without claiming a connected AI model. A fixed-publisher Vercel RSS endpoint replaces the external conversion service and repairs the moved Critical Care feed. See SHARING_FEEDS_SETUP.md for platform limits, validation and remaining model/workflow connections.
