# Evidence-to-education automation: Dr Pramod G Kulkarni
Date: 24 October 2026 (Asia/Kolkata)
Status: implementation blueprint; NOT a running n8n workflow.
Owner's objective: find genuinely new, clinically useful evidence that may improve treatment decisions, avoid harm, reduce unnecessary expenditure or introduce a consequential practical approach; convert selected evidence into physician briefs and humane patient education, visuals and videos. Novelty alone is not sufficient.

## Existing baseline and gap
Production website release f08c2b4561884a54281f531a6b23b0fdc4555850 is preserved.
The separate preview/readability-visual-hierarchy branch contains an RSS-excerpt summarizer with 19 feeds, daily deduplication, a six-attempt cap and a private review queue. It rotates publisher order; it does NOT rank clinical usefulness, read full text, independently review evidence, generate approved media or publish an n8n workflow. Last recorded AI Gateway result was customer_verification_required, not success. No n8n production webhook has been connected.
Do not merge the old preview wholesale: it predates current patient education, privacy and booking changes.

## Roles and deliverables
1. Orchestrator: starts one India-calendar-day run at 00:00 Asia/Kolkata, tracks every stage, enforces budgets, retries and durable checkpoints. One active scheduler only.
2. Source scout: retrieves allowlisted publisher, journal, regulator and guideline feeds. Feedly is optional and must use authorised feeds/API access. RSS is a discovery mechanism, not evidence that full text was read. Record canonical URL, DOI/PMID when available, publisher, date, retrieval time and specialty.
3. Novelty and relevance screener: deduplicates by DOI/PMID/canonical URL and previous topic registry; compares updates to earlier versions. Links multiple reports of the same study rather than treating them as independent confirmations. Safety corrections/retractions remain eligible even when the original item is old.
4. Evidence reader: opens the original primary source where legally accessible. Records access_scope = full_text | abstract | rss_excerpt | unavailable. No paywall bypass or claim of full-text reading from an excerpt. Missing source text goes to needs_source, not to an authoritative publication.
5. Clinical analyst: extracts population, setting, intervention/comparator, study type, outcomes, absolute effects where reported, harms, limitations, follow-up, conflicts, generalisability and relation to existing guidance. Distinguishes statistical significance from meaningful clinical benefit. Identifies established recommendation versus preliminary signal.
6. Independent evidence reviewer: receives the source evidence, checks each consequential claim against it, checks numeric/unit consistency and identifies unsupported extrapolation, contradictory guidance, corrections and retractions. Reviewer disagreement requires physician resolution; several AI agents agreeing is not independent clinical validation.
7. Editorial writer: creates separate physician and patient outputs from the verified evidence. Physician brief explains what changed, who it applies to, practical implications, what should NOT change, limitations and references. Patient article explains lived concerns, safe actions, red flags and one clear takeaway without prompting unsupervised treatment changes. English original, authored Marathi and later reviewed translations. No fabricated personal anecdotes or author credentials.
8. Visual/video producer: works from approved claims and storyboard only. One concept per visual; separate English and Marathi assets; concise readable labels and approved identity. Video package includes script, scene plan, captions and narration text. Verify actual anatomy, labels, numbers, audio/caption agreement and actual output dimensions. No invented patient testimonial or patient data.
9. Delivery coordinator: assembles a private review package with physician brief, complete article, sources, uncertainty, proposed visual, video preview and estimated/actual generation cost. Initial delivery is the private Doctor Workstation queue. External notifications require a configured, authorised channel; delivery is not assumed.
10. Physician approver: Dr Kulkarni accepts, requests edits or rejects the exact version. Approval is explicit, authenticated and recorded. Changing approved text, translation, imagery or video invalidates that approval.
11. Publisher: publishes only exact approved asset hashes to explicitly selected connected destinations. Stores public URL, version, date and platform result; offers correction/unpublish. Website first. Social destinations are not silently authorised by a website approval.

These are workflow responsibilities. They need not be eleven paid models or eleven autonomous processes. Deterministic code handles fetch/dedup/state; separate restricted LLM calls handle interpretation and review.

## Clinical selection rubric
Every candidate gets a reasoned decision, not a fabricated certainty score.
Assess evidence quality, relevance to the doctor's practice, patient-important benefit, safety impact, genuine change from existing practice, Indian availability/applicability and strength of any cost claim.
Decisions: priority_review | routine_review | monitor_preliminary | needs_source | reject_duplicate | reject_irrelevant.
Do not state that an intervention definitely saves money or improves care unless supported for the relevant setting; otherwise label the potential and missing evidence. Lower expenditure cannot compensate for unsafe care. Preprints, animal/mechanistic results and press releases must not be presented as established treatment changes.
Include important negative/de-implementation trials, drug safety alerts, guideline updates and corrections, not only positive novel treatments.
If no useful update qualifies, report "No qualifying practice-relevant update" rather than manufacture a daily article.

## Proposed daily flow and budget policy
00:00 Asia/Kolkata -> retrieve -> deduplicate -> relevance screen -> obtain source -> evidence extraction -> independent review.
Create a short ranked physician digest; generate patient drafts only for selected topics, not every feed entry. Proposed initial ceiling: up to 3 shortlisted items and 1 full patient article per day, subject to explicit configurable token/spend limits. This is a proposal, not an enabled schedule.
Request physician topic/evidence approval before expensive final visual/video rendering; final media require another approval before publication. This avoids spending on rejected topics.
Use one centrally configured model gateway with hard application-side limits on requests, input size, output tokens, retry count and media jobs. Do not silently switch to a costlier provider or enable paid top-ups.
No current free-tier, unlimited-use or zero-cost claim is made. Hosting, model APIs, n8n runtime and media generation are separate cost lines.

## Webhook contracts (planned; not deployed)
Website Run now: authenticated same-origin backend -> signed server-to-server POST -> n8n production webhook. Browser never receives the signing secret.
Use TLS, HMAC over the raw body, timestamp tolerance, constant-time verification and a durable request-id replay/idempotency check. Receive only permitted action/run identifiers; no arbitrary URLs, prompts, SQL or patient histories.
n8n callback -> verified website backend -> validated status/result manifest -> private Supabase queue. Resolve server-side ownership; payload cannot nominate an arbitrary owner.
Approval is a separate authenticated owner action, bound to content revision, destination list and hashes. A generic webhook payload cannot declare itself approved.
Publisher re-checks approval and revision immediately before each destination operation. Retries use per-destination idempotency keys; failures do not trigger duplicate public posts.
Do not run the old Vercel cron and the n8n scheduler simultaneously.

## State and data separation
States: discovered -> screened -> needs_source / evidence_ready -> reviewed -> draft_ready -> awaiting_physician -> changes_requested / rejected / approved -> media_draft -> awaiting_final_approval -> approved_for_publish -> published / publication_failed.
Store source snapshots/hashes, access scope, claims-to-source mappings, review findings, content versions, approvals and publication receipts. Keep corrections and audit history.
Research/media tables and storage stay separate from patient records. Private review RLS and owner access; public routes return published approved material only. Never pass identifiable patient histories to research, translation or media models.
An approval expires on edits; rejected work cannot re-enter publishing via retry. Imported source text is untrusted data, never execution instructions.

## Acceptance checks before enabling live automation
- Real authorised source retrieval; intentional duplicates ignored; study syndication grouped.
- Abstract/excerpt-only item cannot claim full-text review or auto-publish a practice-changing patient recommendation.
- Unsupported benefit/cost claim and reviewer disagreement stop for review.
- No qualifying items produces an honest empty digest.
- Gateway verification and a small real inference succeed without revealing secrets.
- Wrong/expired/replayed webhook signatures fail; valid retried request creates one run.
- Restart resumes checkpoints; provider/source failure is visible and does not lose drafts.
- Other users and anonymous clients cannot read drafts or approve/publish.
- Edited/rejected/stale draft cannot publish; repeated publish does not duplicate.
- Complete article, translated asset and PDF share preserve content and provenance.
- Real generated image/video visually and linguistically inspected before approval.
- One observed scheduled run at India midnight and one manual run complete end to end.
- Final production activation and enabled destinations are shown to the doctor; do not label a saved draft workflow as active.

## Next configuration needed
The actual n8n workspace URL and access path are not present in this session. Obtain the workspace URL, not a password or API secret. Credentials must be entered directly into n8n/Vercel credential settings. Confirm n8n runtime/version and available integrations before creating a compatible import.
Complete and test AI Gateway verification. Build in a new preview branch based on current main; reuse vetted source/queue components from the old branch selectively. Do not change the live website until the preview is reviewed.

## Technical references checked
- https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduletrigger/
- https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/
- https://docs.n8n.io/advanced-ai/human-in-the-loop-tools/
n8n production webhooks and schedules require workflow publication; timezone must be configured. These references do not prove this user's workflow is connected or running.
