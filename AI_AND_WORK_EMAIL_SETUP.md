# AI activation checklist — drkulkarnipg.com

## What is implemented in this branch

- Public website assistant uses a server-side Vercel AI Gateway request. Provider credentials never enter HTML or browser JavaScript.
- The existing service FAQ remains as a fallback if the AI provider is not configured or is temporarily unavailable.
- The assistant is restricted to website guidance and general health education. It must not diagnose, prescribe, calculate individual doses, interpret identifiable reports, or make patient-specific treatment decisions.
- Emergency red-flag wording is handled deterministically before any model request and directs users to emergency care / 112.
- The endpoint applies same-origin checks, bounded message history and input size, a timeout, and best-effort per-instance throttling. It does not persist chat messages.
- The website chat warns visitors not to enter identifiers, medical records, passwords or OTPs.

## Minimum requirements to make the public AI assistant live

1. Enable Vercel AI Gateway for the Vercel project.
2. Verify the AI Gateway account and ensure billing/credits are available.
3. Configure Production environment variables in Vercel:
   - `AI_GATEWAY_MODEL` — select a currently available model in the Vercel AI Gateway model catalogue.
   - `AI_GATEWAY_API_KEY` — create a project-scoped Gateway key and store it only as a Vercel server environment variable; alternatively use verified Vercel OIDC if the deployment/runtime provides it.
4. Redeploy Production after adding variables.
5. Test on the real custom domain: status endpoint reports enabled, a non-clinical question gets an AI answer, provider failure falls back safely, emergency phrases return the deterministic 112 instruction, and browser source/localStorage contains no credential.
6. Set edge-level abuse protection/rate limiting in front of the public endpoint. The in-memory limit in a serverless function is best-effort only and is not a durable global quota.
7. Review provider data-retention settings and privacy notice before inviting patients to use the assistant.

## Existing private clinical research agent

The repository also has an evidence pipeline and private review queue. Its activation is separate from the public chat and needs:
- `AI_GATEWAY_MODEL` and server-side Gateway authentication/credits.
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `RESEARCH_JOB_SECRET` for durable checkpoints and budget reservation.
- Owner-authenticated access to the private evidence workflow.
- A real server scheduler (Asia/Kolkata), configured with a secret and a tested single active schedule. The current workflow UI does not by itself prove that a daily schedule is running.
- Physician review of all evidence briefs and patient-facing drafts. No autonomous publishing, diagnosis or prescribing.

Do not mark the AI research agent as active until a real scheduled run, durable deduplication, provider response, usage budget and physician review queue have all been verified.

## Domain work email

The website host and email host are separate. Cloudflare DNS can point the website to Vercel and simultaneously route mail to a dedicated mail provider. A domain-based mailbox requires an email-hosting provider, domain verification and correct MX/SPF/DKIM (and preferably DMARC) DNS records.

Suggested primary mailbox: `doctor@drkulkarnipg.com`.
Suggested aliases after the mailbox is created: `appointments@drkulkarnipg.com`, `admin@drkulkarnipg.com`.

Do not remove or replace the existing Vercel A/AAAA/CNAME records when adding email DNS. Add only the mail provider's verification, MX and TXT records exactly as its admin console specifies. Cloudflare Email Routing is forwarding, not a complete hosted mailbox with normal send/receive and mailbox storage.