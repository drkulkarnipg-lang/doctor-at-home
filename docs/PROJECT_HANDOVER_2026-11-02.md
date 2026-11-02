# Project Handover — 2 November 2026

## Project identity
- Website: https://drkulkarnipg.com
- Secondary deployment: https://home-visiting-icu-doctor.vercel.app
- Repository: https://github.com/drkulkarnipg-lang/doctor-at-home
- Default branch: `main`
- Hosting: Vercel; Cloudflare and connected services may also be involved.
- Owner acceptance brief: GitHub issue #90 — https://github.com/drkulkarnipg-lang/doctor-at-home/issues/90

## Exact source and backup references (verified 2 Nov 2026, 16:05 IST)
- Latest `main` SHA at inspection: `684e520c0203391aa5f1997ff8fe67d78d329afb`.
- Latest `main` commit: “Align cloud setup runbook with provisioned Supabase project” (2026-11-02 10:29 UTC).
- Dated source snapshot branch created without modifying prior backups: `backup/MASTER-ORIGINAL-2026-11-02`, starting at `684e520c0203391aa5f1997ff8fe67d78d329afb`.
- Earlier dated backup remains: `backup/MASTER-ORIGINAL-2026-11-01` at `3766ea54a3bcbf65adde6507d5e85b067183b389`.
- Earlier protected-baseline reference remains: `backup/baseline-2026-10-31-pre-stitch` at `ab8855374d376cca6e2158417385f10bebcb4965`.
- These are source-code references, not complete database, Vercel, Cloudflare, DNS, mail-provider or secret backups. The 2 Nov backup branch was created as a new dated reference; no prior backup was overwritten. GitHub reports the main branch as unprotected, so repository-level immutability/branch protection has not been established.

## CI and deployment status
- GitHub Actions regression run `41429159705`, run #1723, on exact main SHA `684e520c0203391aa5f1997ff8fe67d78d329afb`: completed SUCCESS (2026-11-02 10:30 UTC).
- GitHub combined commit status for that exact SHA: Vercel = FAILURE; target points to Vercel's build-rate-limit/upgrade page.
- Therefore Vercel Production deployment of this SHA is NOT verified. Do not equate green GitHub Actions with deployment.
- Direct public fetch of both configured website URLs was inconclusive in this inspection (cache miss); no live browser/device verification is claimed.
- Current Production deployment SHA and deployment ID: NOT independently established.
- Vercel account/project/deployment tooling was not available through the connected integrations in this session. Do not infer production status from stale project documents.

## Supabase / security state (source-documented, production still unverified)
- Latest main documentation says the dedicated Supabase project `doctor-at-home` in `ap-south-1` is `ACTIVE_HEALTHY`; owner Auth identity exists and migrations for patient trends, research/evidence workflows, workstation registers, private document vault and health passport/audit trail are recorded as applied.
- This does NOT prove Production Vercel environment variables, end-to-end RLS, email delivery, owner login, cross-device workflows or real patient workflows are operational.
- MFA is explicitly not verified as enabled; passkeys remain conditional on provider activation and a real-device ceremony.
- Never create a second Supabase project, duplicate the owner identity or rerun already-applied migrations without inspecting current state and backups.

## Open owner acceptance work
- Issue #90 remains OPEN and is the authoritative consolidated owner brief.
- It requires the clinical research workspace (India CDSCO first, FDA/EMA, trials, PubMed, source provenance, deduplication, review status, secure storage, alerting), global language navigation, workstation close/back behaviour, approved signature use, death-form-to-register linkage, safe editable diet presets, visible verified UPI payment flow, secure username/password/OTP boundaries and homepage infographic.
- The exact acceptance tests and owner-side dependencies are in issue #90. Do not claim completion from source code alone.

## Open review pull requests observed
The following recently updated PRs were open and draft at inspection; their heads/base SHAs must be rechecked before any review or merge:
- #120 Phase 1 clinical calculator library plan — head `e5b7391697e5898d1e52ffeddfc2839ce7ee3820`, base main was `3e4f3e3737cb31bd416c6d18df6a3ff83f9ee482`.
- #119 Patient Health & Home Care Centre — head `42278062247e645c54f1cb67b8c891b11ffd56ed`, base main was `3e4f3e3737cb31bd416c6d18df6a3ff83f9ee482`.
- #118 Global language selector / whole-page translation — head `f961b855682f8a64731f74d082ef9f727f6bb5e8`, base main was `3e4f3e3737cb31bd416c6d18df6a3ff83f9ee482`.
- #117 Public AI information assistant / visual system — head `dffe641879925fa1bf147c6488f100ef4e25d6d8`, base main was `ea49b262a1907e8b3ca92fd3ccca5c7169a7c828`.
- #116 Workstation username + phone MFA — head `bcf27a39dfdfffffaa84c02702cb5fe2ed7e8b89`, base was `fix/owner-approved-registration-cream-palette` at `913a4b63b4fa63af55cbaea2fe808b411eb3842a`.
- Other open PRs were also present (including #115, #109, #97, #89, #88, #87, #85, #64, #29, #28). Re-query the full open-PR list before selecting the next implementation batch.
- PR base SHAs shown above are stale relative to the current main SHA. Do not merge blindly; compare, update/rebase in isolated branches, rerun exact-head CI and obtain preview review.

## Completed in this inspection
1. Read current repository metadata and exact `main` ref directly from GitHub.
2. Read owner requirements issue #90.
3. Queried open PRs, open issues and dated backup branches.
4. Verified exact-main regression Actions run and Vercel combined status.
5. Created new dated source snapshot branch `backup/MASTER-ORIGINAL-2026-11-02` from exact main SHA, leaving prior backup branches untouched.
6. Created this isolated handover branch `ops/project-handover-2026-11-02`.

## Blockers / external dependencies
- Vercel build rate limit is currently the explicit deployment-status blocker. Need inspect Vercel project usage/limits and latest Production deployment through an authenticated Vercel account or Vercel integration; do not bypass billing or alter plan without owner consent.
- Need actual Vercel Production deployment SHA/ID and domain alias checks for both URLs.
- Owner-side/provider dependencies recorded in issue #90: Twilio account/number/Verify/SMS configuration; Razorpay merchant registration/KYC and secure live payment configuration; Shop Act; Udyam; Google app password/SMTP as applicable. Never request or commit secrets in chat/GitHub.
- Physical mobile/desktop device verification and owner login/MFA ceremonies require owner/device participation.

## Exact next actions
1. Recheck `main` and all open PR heads immediately before action.
2. Resolve or wait out the Vercel build-rate-limit blocker using the Vercel account's documented controls; obtain the exact current Production deployment SHA and deployment ID.
3. Compare PRs #118, #119, #120, #117 and #116 against current main; choose the smallest high-value, independently testable task from issue #90; update an isolated branch from current main, not stale bases.
4. Run full regression CI on the exact proposed head; inspect diff for patient data, secrets, clinical safety, lost features and duplicate implementations.
5. Generate a protected preview and perform desktop/mobile and workflow QA; obtain owner review before production merge/deployment.
6. Update this handover with exact evidence after each significant batch. Never merge an unapproved change or claim production verification without exact SHA evidence.

## Safety and release rules
- Production and existing features remain protected. No production merge/deploy is authorized by this handover alone.
- Do not expose API keys, passwords, OTPs, service-role keys, bank account details or identifiable patient information.
- A source ZIP/branch is not a complete infrastructure backup. Database backup/restore, Vercel configuration, Cloudflare/DNS, mail, payment and external provider states require separate verified recovery records.
- Classify each result as COMPLETED AND VERIFIED, IMPLEMENTED — AWAITING VERIFICATION, BLOCKED — EXACT REASON, or OWNER ACTION REQUIRED.
