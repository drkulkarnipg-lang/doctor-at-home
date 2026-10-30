# External link audit — 30 October 2026

## Scope and method
- Workflow run: https://github.com/drkulkarnipg-lang/doctor-at-home/actions/runs/41041430784
- Artifact ID: `12970218218` (`external-link-audit-41041430784`, 30-day retention).
- Scope: 163 static external HTTP(S) destinations in the scoped inventory. This is not yet a repository-wide crawl, and it does not test the deployed website itself.
- Requests used bounded concurrency, HEAD first, and a one-byte Range GET fallback only when HEAD returned 405/501. No authentication, scraping, access-control bypass or automatic link removal.

## Results
| Outcome | Count | Interpretation |
|---|---:|---|
| Reachable (2xx) | 127 | Automated request reached the destination. |
| Blocked/rate-limited (403) | 29 | Not classified as broken; several medical publishers and service sites block automated requests. |
| Network error | 3 | Destination not verified by this run; includes the CDSCO root, Gemini launch page, and CRS combined PDF endpoint. |
| Timeout | 1 | `https://112.gov.in/about`; not proof of a broken destination. |
| HTTP 406 | 1 | Radiopaedia root; likely method/automation policy, manual browser check required. |
| Method not allowed (405 after fallback) | 2 | NIA pages; manual browser verification required. |
| Confirmed 404/410 | 0 | No confirmed broken URL in this second pass. |

## Corrections made after the first pass
- The first run reported four 404s. Three were false positives: Google Fonts preconnect origins and a bare Make webhook placeholder. They are now classified as non-navigable origins/placeholders and skipped.
- The Norton scale link in `clinical-calculators.js` returned 404. It was replaced with the Agency for Healthcare Research and Quality reference: https://www.ahrq.gov/patient-safety/settings/hospital/resource/pressureulcer/tool/pu7b.html. The calculator formula and threshold were not changed.
- The visible legacy `MCCD_Form.pdf` link returned a network error (not a confirmed 404). It now points to the official combined CRS forms PDF: https://dc.crsorgi.gov.in/assets/download/all_forms_CRS_2019_new.pdf. The PDF was inspected in the browser: 23 pages; Form 2 begins at page 5, Form 4 at page 9, Form 4A at page 11 (1-based). The separate-download endpoint extracts those pages and the full PDF retains reverse-side instructions.
- The source manifest preserves the old MCCD URL and checksum as historical evidence; no checksum was invented for the new PDF.

## Remaining verification
1. Manually open the 29 blocked URLs, 3 network-error URLs, 1 timeout, the 406 destination and the two 405 destinations in a normal browser; use the artifact for exact per-URL outcomes.
2. Expand the inventory beyond the ten scanned source files to all active website modules and routes.
3. Re-run the link audit after future source changes.
4. Live desktop/mobile UI, generated PDF appearance, WhatsApp handoff and production deployment remain unverified because Vercel reports: **“Deployment rate limited — retry in 24 hours.”** The latest code is merged and CI passes, but the live website has not been confirmed updated.
