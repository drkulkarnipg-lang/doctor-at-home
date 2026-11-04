# Hands-on interaction audit — 4 November 2026

Tested live release: `222d0b4b1c758ebf39425ae392e1ad380e93c094`, drkulkarnipg.com, cloud desktop browser 1363×936. This is a partial audit with explicit remaining work, not a declaration that every facility or button passes. Static markup queue: `data/control-audit-inventory-2026-11-04.json` (520 controls; dynamically generated controls must also be tracked).

## Observed interaction results

| Control / case | Action and observed result | Status |
| --- | --- | --- |
| Seven Patient Portal tabs | Overview, Elderly care, Health library, Search articles, Book a home visit, Health tools and Patient FAQ each opened its intended panel/route. | BROWSER PASS, desktop only |
| Qualifications launch | Opens correct facts; focus stayed on underlying launch control; Escape did not close it; role dialog absent. | DEFECT CONFIRMED; fix coded, not live |
| Qualifications X | Closes overlay; keyboard/focus defects are separate. | BROWSER PASS for close only |
| BMI normal case | 70 kg + 175 cm → 22.9 kg/m²; displayed reference weight 67.4 kg. | BROWSER PASS for tested arithmetic |
| BMI invalid case | Height 0 clears valid-result presentation and shows valid-input message. | BROWSER PASS |
| Both calculator Clear buttons | BMI fields/result and HbA1c field/result cleared independently. | BROWSER PASS |
| HbA1c estimate | Input 7 → displayed 154 mg/dL, 8.6 mmol/L estimate. | BROWSER PASS for arithmetic, not medical certification |
| Both Formula & methodology disclosures | Expanded and showed formulas. | BROWSER PASS opening; collapse not separately recorded |
| Temperature conversion | Entered 37 °C → displayed 98.6 °F. | BROWSER PASS one direction; reverse pending |
| Weight conversion | Entered 100 lb → displayed 45.36 kg. | BROWSER PASS one direction; reverse pending |
| All eight FAQ questions | Each individually opened, answer became visible, and closed. | BROWSER PASS 8/8 open + close |
| Five FAQ topic filters | Visits/fees 3; preparation/reports 2; health guidance 2; urgent help 1; All 8. | BROWSER PASS 5/5 |
| FAQ search/reset | GPS finds two questions; nonsense shows no matching results; clear restores 8. | BROWSER PASS |
| Five diet disclosures | Fever, hepatitis, long-term liver disease, diarrhoea and vomiting each toggled aria-expanded true then false through its stable aria-controls target. | BROWSER PASS 5/5 open + close |
| Header language summary | Opens and closes; search Marathi filters list; clear restores options; Escape closes. | BROWSER PASS, clinical translation and focus restoration not certified |
| All eight library topic filters | Kidney 2, heart 2, home care 1, stroke 1, skin/mobility 2, medicines 1, everyday living 1, All 10. | BROWSER PASS 8/8 |
| Library search | Dialysis gives one matching guide; nonsense gives 0 with explicit no-match text. | BROWSER PASS |
| Booking hero CTA | Opens booking panel. | BROWSER PASS |
| New booking name/address labels | Synthetic inputs entered through labels, then cleared. No message sent or patient upload. | BROWSER PASS for label association |
| Empty published-article search | Goes to /articles?q= and reports no published articles. | FUNCTIONAL but low-value empty destination |
| Published search: dialysis | Reports no matching published article even though the separate built-in library has a dialysis guide. Clear and Home work. | DISCOVERY GAP; reconcile search scopes, do not invent published content |
| PDF Share dialog focus | Opens Ready state but focus remains on underlying page; close works. | DEFECT CONFIRMED; fix coded, not live |

## Every built-in guide — actual Read/Download/Share controls

All 10 Read buttons opened the matching title with substantial article text, and each Back control returned to library. All 10 Share-PDF buttons reached a Ready PDF state and were closed without selecting WhatsApp, a recipient or sending a message. This is preparation/fallback evidence, not recipient delivery.

| Guide | Read + Back | Download evidence | Share preparation + Close |
| --- | --- | --- | --- |
| Dialysis / passing urine | PASS | Physical file verified: 24,835 bytes, 2 A4 pages; first page rendered and visually inspected. | PASS |
| Heart failure / daily weight | PASS | Physical file verified: 23,789 bytes, 2 A4 pages. | PASS |
| Catheters / feeding tubes | PASS | Download event/path returned, but file absent when inspected. Retry later timed out. NOT VERIFIED. | PASS |
| Stroke / swallowing | PASS | Event/path returned; file absent when inspected. NOT VERIFIED. | PASS |
| Pressure injury | PASS | Event/path returned; file absent when inspected. NOT VERIFIED. | PASS |
| Falls | PASS | Physical file verified: 24,281 bytes, 2 A4 pages. | PASS |
| Medicine list | PASS | Physical file verified: 24,344 bytes, 2 A4 pages. | PASS |
| Home blood pressure | PASS | Physical file verified: 24,026 bytes, 2 A4 pages. | PASS |
| Potassium / coconut water | PASS | Event/path returned; file absent when inspected. NOT VERIFIED. | PASS |
| Everyday living | PASS | Event/path returned; file absent when inspected. NOT VERIFIED. | PASS |

No cause is asserted for the five missing download files. The final retry timed out and reset the browser tool session. Do not call these files delivered or blame the site without evidence. A file-completion failure may involve browser/tool/device behaviour; no browser download-security setting was changed.

## Demonstrated defects and source fixes on PR #145

1. Qualifications: add dialog semantics and explicit close name, move initial focus inside, contain Tab/Shift+Tab, support Escape/backdrop and restore opener/scroll state. Existing actions/facts retained.
2. PDF Share: same focus/keyboard requirements; Escape/backdrop use the existing close handler so temporary file/URL cleanup is retained. No sending behaviour changed.
3. Oversized repeated section orientation: retain all titles, explanatory text and routes but reduce the injected context heading/intro spacing; preserve content hierarchy and links. Actual narrow viewport QA remains pending.
4. Earlier performance work remains: on-demand local PDF engine, retained URLs/links, approved byte-identical logo at existing logo.png. Browser loading checks still pending.

## Still required — do not mark complete

- Actual protected-preview verification of all new fixes; one-hour link authorization for the new deployment not yet granted.
- Remaining booking controls: all fee/time/distance/procedure combinations, validation, GPS permission/failure, attachment limits, consent, review/print, DOB, language and non-sending sharing preparation.
- Public help/chat controls; article card duplicates and source-translation selectors; authored Marathi reader/PDF flows; library share-dialog Download and actual device sharing.
- Authenticated Doctor Workstation, every private tab, prescription controls, save/export/print, long documents, requisition selections, registers, formulary, research and settings. Owner passkey approval still pending. Never bypass auth or alter real patient records for QA.
- Mobile/tablet viewport/device, assistive technology, keyboard traversal across all controls, overlapping layers, line length, spacing and zoom/reflow audit.
- External destination reachability, real dialler/app handoff, payments and recipient delivery. No payment or human-directed message was made during these tests.

## Software verification

After the new dialog/focus/compact-heading changes, all 83 software checks passed sequentially in 52.81 seconds. These include dedicated credentials-dialog and PDF-share-focus tests. All original 522 IDs, 304 href/src/onclick/onchange occurrences and 282 original tracked paths remain. This does not replace any pending browser/device check.

## Additional owner requirements and source implementation

- Uniform clinical display date (`25th Nov, 2026`), 24h IST, consistent PDF-ready Save/Share path for 11 document types, explicit text-save wording and consistent action styling are implemented in the shared modules. Native date-picker/source-PDF/ISO storage representations remain distinct for fidelity. Full cloud-storage format/toolbar/print/device acceptance remains open.
- Every translator is now required to be independent. Added separate library and reader state, scoped header/home/workstation navigation state, and isolated booking-language actions. Changing one selector must not alter another section or patient entries. Authored EN/MR guides work; only available MR navigation labels are translated in Workstation/home. Additional full scoped translations remain unconnected, with explicit notices.
- These changes have focused software tests; they have NOT yet been exercised in an authorized new browser preview. Do not overwrite baseline browser results above with claims about the new source.
