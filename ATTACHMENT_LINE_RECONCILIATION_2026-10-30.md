# Attached request line reconciliation — 30 October 2026

**Controlling source:** `Pasted text(20261030-092936).txt` (166 physical lines). This is a traceability index, not a completion certificate. Every non-empty source line is represented below. Long composite lines map to multiple requirements; duplicated instructions remain visible as repeated emphasis. Each item stays open until implementation and the appropriate tests/live/device/provider checks support closure.

| Source line(s) | Requirement cluster from the owner's line | Register / audit pointers | Current disposition |
|---|---|---|---|
| 1 | Work on the named existing website/repository, not a replacement. | A01; standing instructions | Repo changes merged; feature-level live audit remains. |
| 4 | Professional explicit design and colour system; decide Stitch vs Google AI Studio. | Design identity; C07 | Full visual audit and Stitch-export comparison remain. |
| 7 | Report exactly what the owner asked and what was done. | Audit format; standing instructions | Mandatory format for every future checkpoint. |
| 10 | Research reusable patient resources; review clinical reference/hospital best practices; cover elderly, hypertension, cardiovascular risk, COPD, palliative cancer, CKD, diabetes, cirrhosis; calculators; AI/workflow and consultation tiers. | B/C/D/F; CALCULATOR_AUDIT.md; patient-education review | Research and authoring remain staged; clinical content requires sources and doctor review. |
| 15 | Search, sitemap, article production and correct qualifications. | A08; C03–C10; site-information.html | Search/SEO and credentials placement need full verification. |
| 18–22 | Payment account/UPI instructions; convenient secure payment without exposing bank details publicly. | D01; D05–D06 | UPI URI correction deployed; gateway/settlement/invoice remain incomplete. Keep account number/IFSC out of public HTML and logs. |
| 27 | Ensure all calculators work. | Calculator audit/tests | 30 tools in source (2 public, 28 workstation); per-tool range/source audit remains. |
| 30 | Language selector overlaps/hides portal, especially mobile. | A09–A10; C07 | Responsive visual check remains. |
| 33 | Workstation email/password setup fails; secure setup, access and logout. | F01–F04; F12 | Recovery code deployed; provider configuration and real-device login/recovery remain unverified. |
| 38 | Tabs after Book a Visit are hidden by language selector. | A09–A10; C07 | Actual mobile/desktop visibility check remains. |
| 41, 44 | Add Medicine / Add Row must add blank prescription rows. | H01; prescription tests | Source and regression tests merged; actual PDF/device output remains. |
| 47 | Sentence-by-sentence reporting is mandatory. | Audit file; this map | Continue request → evidence → action → verification → status. |
| 50 | Form 4 and 4A separate downloads. | E06 | Verify filled output and device download. |
| 53 | Downloaded forms should be editable and save correctly. | E06 | Distinguish on-page editing from flattened PDF; verify exported form. |
| 56 | Forms 2, 4 and 4A in Hindi, Marathi and English. | E06; language work | Correct authored multilingual government forms not yet verified. |
| 59 | Search/import drug identity from RxNorm/open directories; consider data sources/agent. | B01–B07 | Existing catalogue is not proof of every identity/product. Keep ambiguous or withdrawn records blocked for review. |
| 62 | Make the site AI-enabled where feasible. | F07–F11 | Requires scoped sources, budgets, doctor approval and escalation; no autonomous prescribing. |
| 65 | Lab/radiology requisition sign-off must follow full requisition; use “Requisition”, not “Slip”. | E01–E09; H10 | Code exists; short/long PDF and physical print checks remain. |
| 68 | Article manager needs live RSS and AI research agent. | F07–F10; C11 | Successful provider fetch/review/publish workflow not proven. |
| 71, 74, 77 | Group prescription/formulary/lab/radiology/RSS; death/referral/consent/fitness; group remaining tools without losing features. | Workstation navigation; H09; E06 | Audit information architecture and preserve every existing feature. |
| 80 | Each calculator should show an appropriate reference/normal range and credible source. | Calculator audit; clinical safety | “Reference / interpretation” panels exist; audit all 30 for population, range, source, exceptions and applicability. Do not imply universal society consensus where none exists. |
| 85 | Green/blue and light petal shades; avoid indiscriminate red; strong hero. | Design identity; C07 | Visual review across viewport sizes remains; do not promise literal 32K browser rendering. |
| 90, 93, 142 | Stitch/design workflow; attractive, refined, accessible, reassuring site that clearly communicates home visits. | C07–C10; patient-experience review | Hero, spacing, type, accessibility, speed and actual mobile rendering need audit. |
| 96, 144 | Daily patient, death and stock registers in Doctor Workstation. | H09; F05 | UI/API merged; Supabase migration/RLS and owner/non-owner tests remain. |
| 97, 145 | Invoice, visible QR and flexible gateway/NEFT/UPI payment. | D01; D05–D06 | UPI URI source deployed; gateway, verified settlement, invoice and receipt remain. |
| 100, 128, 147 | Language selector must not cover portal controls; adjust spacing/buttons. | A09–A10; C07 | Responsive browser/device verification required. |
| 103–104, 131–132, 149–150 | Know Your Numbers should display appropriate reference ranges. | Calculator audit; public BMI/HbA1c | Public tools exist; verify reference text for all 30 calculators. |
| 107, 135, 152 | Bidirectional Celsius/Fahrenheit conversion. | Converter wiring; calculator UI tests | Source and tests deployed; confirm live both-way behavior and invalid-input handling. |
| 112, 155 | Translate original external health-source documents where supported. | A09; C11 | Translation links/widget do not alter source documents; verify navigation and third-party limits. |
| 115–116, 157–158 | Create/change/recover workstation password; email recovery preferred if secure. | F01–F04; F12 | Recovery source deployed; owner-email env, redirect allowlist, email delivery and token expiry remain unverified. |
| 119–123 | Forwarded-email headers/timestamp included as context. | Provenance | Not a separate feature requirement. |
| 137 | Composite: global language dropdown; never hide tabs; clean article reader with browser Back/Forward; click-to-call and WhatsApp choice; fast home-visit intake with prescription/discharge attachments and focused history; remove decorative prefilled boxes; each tab shows its own content; move health sources to a clear location; direct prescription sharing with correct filename; remove website/contact metadata from prescription; align registration number; keep contact details on site; use government forms; ensure save/print/share works; fix actual WhatsApp file sharing; import articles/media from device/cloud; make RSS controls work; refine hero/design. | A03, A09–A10, C07–C11, D01, E01–E09, H01–H12 | Mixed: some source changes merged; live feature, mobile, file-share, government-form, cloud-import and RSS execution checks remain open. |
| 140 | Composite: preserve all data/features/references; worldwide language support; named PDF export/print/share for forms and clinical documents; RSS/Feedly fetch; payment QR/gateway; secure workstation login; consolidate reference/AI/RSS tools; prominent article gallery; import/export articles/images/videos; support large article library; patient/doctor converters and calculators; retain GPS/distance/time; registers; professional/web standards, performance and patient-comfort design. | A08–A10; B–F; E06; F05–F12; C03–C10 | Keep as separate backlog items; no claim of complete languages, unlimited storage, active RSS, full AI or production payment gateway without evidence. |
| 160 | Re-audit repository and backup/Stitch export; implement all unfinished requirements; preserve home-visit purpose; SEO/web/accessibility/security; speed; visible tabs; secure password changes and click navigation. | A01–A10; C01–C12; F01–F12 | Compare backups before large changes; preserve recovery points and existing features. |
| 162 | Read end-to-end and find all unfinished instructions. | Entire register | Continue from next open ID; do not ask owner to repeat the file. |
| 164 | Website URL. | A01 | Vercel status for commit `233040e281ff975e151d98f77bb606768074d54f` reports success; feature-level verification remains separate. |
| 166 | Backup and Stitch export exist; preserve them; fix icons/tab visibility without destroying existing work. | A01; C07; standing instructions | Compare backups/Stitch assets when accessible; never overwrite or discard existing working features. |

## Release evidence — 30 October 2026

- Merge commit: `233040e281ff975e151d98f77bb606768074d54f`.
- Regression run `41033995852`: passed on the exact merged commit.
- Vercel status for that commit: success — deployment completed.
- This does not prove all requirements complete. Database migration, provider configuration, real payment settlement, actual device sharing, physical printing and clinical review remain separate.


## Latest merged source-line reconciliation

The current controlling attachment remains `Pasted text(20261030-092936).txt`. Additional source fixes now merged after the earlier line-map status:
- Line 137: prescription website/provenance footer removed from the prescription PDF; Article Manager now opens with RSS/evidence-review panel; registration number baseline fixed.
- Line 140: quick home-visit intake now exposes essentials and attachments first while preserving optional history and existing booking logic.
- Lines 68 and 71: RSS/evidence workflow is accessible from Article Manager and the Workstation Home directory; dedicated RSS tab remains.
- All these source changes passed regression checks, but live deployment is blocked by Vercel's 24-hour rate limit. This is source status, not live verification.


## Latest deployment status — 30 October 2026

- Current main commit `0ba9a434f6a39535fdf3a654b31ec86c16776663`: Vercel status **success — deployment completed**.
- The earlier deployment-rate-limit note is historical for this commit. Feature-level live/device/provider verification remains open.


## Latest source/deployment checkpoint — 30 October 2026

- Current main `6b551b4450422978d01683e0474f19047a761cf0`: regression run `41038198126` passed.
- Last successful application-code deployment: `0ba9a434f6a39535fdf3a654b31ec86c16776663`; current main is Vercel-rate-limited and not confirmed deployed.
- The new prescription/lab/radiology footer correction is merged and tested in source. Editable government Form 2/4/4A working layouts retain the legal-status disclaimer; original government PDFs remain unchanged.


## Status reconciliation — late session, 30 October 2026

- **Lines 33/115–116/157–158 — owner password setup/recovery:** source supports password login and owner-email-scoped recovery for an existing Supabase Auth user; reset tokens are handled in memory and the server checks the configured owner UUID. First-time account creation still requires the provider dashboard. `CLINIC_OWNER_EMAIL`, email delivery and the exact recovery redirect must be configured in the intended Vercel/Supabase environment. No live email delivery was verified; no password was created in chat.
- **Lines 50–56/137/140 — Form 2, Form 4 and Form 4A:** separate one-page extraction routes and distinct PDF filenames are present in current main, with synthetic regression tests. The legal-forms panel already links the Government of Maharashtra 2026 CRS handbook containing Marathi/English CRS/MCCD material and Form 2/4/4A. It is a full handbook, not a one-page state-form bundle. The full original CRS PDF remains linked for reverse-side instructions. This does not yet satisfy verified Hindi/Marathi/English official form downloads or prove Maharashtra/Pune registrar acceptance. Live download/print/share remains blocked from verification by the current Vercel deployment rate limit.
- **Lines 97/145/147 — payment:** the canonical UPI ID and dynamic amount-bearing QR code are present in current main source. Current main Vercel status is rate-limited, so no claim of latest code being live, QR scan correctness, bank settlement, Razorpay activation, refund handling or invoice delivery.
- **Lines 96/144 — registers:** UI/API and SQL migration are in source; the migration is deliberately not run by deployment. No live cloud persistence is claimed until a database backup, migration review, owner/non-owner RLS checks and restore test are recorded.
- **Lines 68/71/137/140 — articles, RSS, AI and cloud media:** Article Manager, explicit owner-only publication and reviewed AI formatting exist in source. Local attachments use IndexedDB and links; public cloud publishing explicitly excludes attachments. Cloud/device media import/export, working provider RSS/evidence execution, provider budgets and all publishing destinations remain separate open tasks.
- **Current main `1ccd34769734b30e83d1ce9ab1bad34a221446ec`: Vercel status failure — deployment rate limited.** The last successful deployment does not certify current-main features. Do not close any line on source presence alone.
