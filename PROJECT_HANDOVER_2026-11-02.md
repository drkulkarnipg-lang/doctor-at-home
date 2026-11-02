# Project Handover — 2 November 2026

## Identity
- Project: HOME VISITING ICU DOCTOR
- Repository: `drkulkarnipg-lang/doctor-at-home`
- Default branch: `main`
- Production domains: `https://drkulkarnipg.com`, `https://www.drkulkarnipg.com`
- Vercel project/domain previously recorded: `home-visiting-icu-doctor-pune`; secondary deployment: `https://home-visiting-icu-doctor.vercel.app`
- Owner requirements: GitHub issue #90 (open; controlling consolidated brief).

## Verified repository state at handover
- Main HEAD independently read from GitHub branch API: `684e520c0203391aa5f1997ff8fe67d78d329afb`.
- Latest main commit message: “Align cloud setup runbook with provisioned Supabase project” (2026-11-02 10:29 UTC).
- Main tree SHA: `9f383bb3575f4d80bdcf52e1b8d3b2282ad410b6`.
- The owner-supplied prior snapshot `ea49b262a1907e8b3ca92fd3ccca5c7169a7c828` is an ancestor, not current main.
- Main branch protection API reports `protected=false`; no required status checks. Treat main as high-risk and do not push directly.
- Working branch created for this handover only: `docs/project-handover-2026-11-02`, based exactly on the main SHA above. No application source changed.

## Deployment status — NOT RELEASED / NOT VERIFIED
- Combined commit status for exact main HEAD reports Vercel context `failure`, target URL indicates `build-rate-limit`.
- Latest confirmed production commit recorded in the existing project ledger: `57d011721e92903c53f76035f43520c296502906`. This is historical and must be independently reconfirmed; it is not evidence that current main is deployed.
- No current Vercel Production deployment ID or deployed SHA was independently obtained in this session.
- Neither `drkulkarnipg.com` nor `www.drkulkarnipg.com` has current exact-SHA/live-browser verification in this session. Do not claim HTTP 200 or feature-level live verification.
- Do not alter billing, upgrade plans, DNS, secrets, hosting configuration, or database migrations to work around rate limits without explicit owner approval.

## Open pull requests observed
- #120 — Phase 1 Clinical Calculator Library plan (draft).
- #119 — Patient Health & Home Care Centre (draft).
- #118 — Global language selector / translation access (draft).
- #117 — Public AI information assistant / visual system (draft).
- #116 — Doctor Workstation username + phone OTP security (draft).
- #115 — MCIM registration / cream palette (open, non-draft).
- #109 — Lab reference plan reconciliation (open).
- #97 — Share Desk local-file privacy evidence (draft).
- #89 — Prescription/death-register linkage (draft).
- #88 and #87 — payment/UPI QR visibility (draft).
- #85 — requisition outputs, language access and article PDF actions (open).
- #64 — external-link audit (open).
- Older open PRs #29, #28, #27, #26, #25, #24, #23, #22, #21, #15, #13, #7 also require triage against the current master and supersession history.
- Do not merge any PR solely because it is open or CI passes. Rebase/compare to current main, inspect full diff, test and confirm owner approval/preview first.

## Confirmed master requirements
Use issue #90 as the authoritative acceptance checklist. Preserve the existing website and all approved assets/features. Work on isolated branches and previews; no unapproved production merge. Key workstreams:
1. India-first clinical research agent with provenance, evidence grading, regulatory status, deduplication, clinician review, secure storage and source-management/status UI; no autonomous diagnosis/prescribing/publication.
2. Responsive navigation and language selector; panel open/close; Doctor Workstation access and close paths.
3. Latest approved doctor signature on doctor-signed forms only; patient/relative/witness signature fields blank; no duplicate signature assets.
4. Death form to Death Register validated record mapping; safe editable clinical diet presets.
5. Visible UPI QR/payment options, but no real collection or paid-state without verified payment flow; Razorpay/BillDesk require merchant onboarding and server-side verification.
6. Username-based Doctor Workstation authentication, password confirmation, secure hashing/session/rate limits; SMS OTP only after Twilio setup/verification.
7. Secure cloud persistence with verified RLS/access controls, backup and restore evidence; do not claim security until tested.
8. Homepage infographic; mobile and desktop QA.
9. Existing external links, articles, calculators, patient forms, documents and booking workflows preserved.

## Known state and limitations recorded in project ledger
- Main contains the 111-record lab reference catalogue; target 700–750 remains open. Source attribution exists, but local method/platform transfer and clinician governance are still required.
- Main contains 18-language selector work; machine translation is not clinically certified. Real-device 320px/390px verification remains outstanding.
- UPI QR and private-cloud prescription-save work have been merged according to the project ledger; actual end-to-end payment verification remains disabled/pending.
- Razorpay/BillDesk remain disabled pending merchant registration/KYC and secure server verification.
- SMS OTP remains pending Twilio account/number/verification and secrets.
- Google Workspace mailbox is not provisioned; MX/SPF/DKIM/DMARC and sender verification remain owner/provider tasks.
- AI evidence pipeline requires AI Gateway credentials/model/credits; do not expose secrets or enable a public chatbot without review.
- Share Desk actual desktop/mobile handoff and recipient receipt are not verified.
- NEWS2/GCS and diet guidance require clinical governance review before routine use.
- Existing SQL migration files are source artifacts; do not apply migrations without explicit authorization and backup/restore checks.

## Next exact actions
1. Inspect current GitHub Actions runs for exact main HEAD `684e520c0203391aa5f1997ff8fe67d78d329afb`; separate CI result from Vercel deployment status.
2. Recheck Vercel build-rate-limit status through the connected Vercel account/integration when available; identify deployment ID, target environment, source SHA, and domain aliases.
3. Inspect the current production domains using an actual browser session. Verify served SHA from deployment metadata, then desktop and mobile at 320px/390px.
4. Review PRs #115, #118, #116, #119 and #120 in priority order against issue #90, current main and their exact CI/preview evidence. Keep all unapproved work out of production.
5. Triage older PRs for duplicates/superseded work; preserve branches and backup refs.
6. Update this handover with each verified result. Do not overwrite the protected master backup.

## Backup and recovery
- Protected backup branch previously recorded: `backup/baseline-2026-10-31-pre-stitch`.
- Separate master copy branch observed: `backup/MASTER-ORIGINAL-2026-11-01`.
- Prior owner-supplied original development commit: `ab8855374d376cca6e2158417385f10bebcb4965`.
- Source-code branch/archive backups are not complete infrastructure backups. Separately verify database exports, storage assets, environment-variable recovery procedure, Vercel project settings, DNS and restore testing. Never store credentials, OTPs, bank details or patient data in Git.
- Verify backup branch SHAs directly before recovery; do not assume names imply immutability.

## Session change log
- Read repository metadata, main branch object, recursive tree, issue #90, open PR search and exact-HEAD combined commit status directly from GitHub.
- No source code, production deployment, billing, DNS, secrets or database migrations changed.
- Handover-only branch created from current main; this file is intended to be committed on that branch only.


## Verification addendum — 2 November 2026, 16:06 IST
- Exact-main GitHub Actions run `41429159705` (run #1723) completed SUCCESS against `684e520c0203391aa5f1997ff8fe67d78d329afb`. The `node-regression` job and “Run every repository regression test” step both completed successfully.
- This does not override the separate Vercel commit status: Vercel remains FAILURE with `build-rate-limit`. CI green is not deployment success.
- The connected browser could not be accessed because this session lacks its originating browser context. Direct web retrieval of the three production domains was disabled by the browsing service. Therefore HTTP status, served SHA, alias routing and visual/device checks remain unverified.
- A handover document was committed on the isolated branch as `998d7ba0b6d2dd23f0491b2e710d824eb608252f`; the file was fetched back from that branch and its contents confirmed. This documentation commit is not on main.
- The project remains open; no production changes made.
