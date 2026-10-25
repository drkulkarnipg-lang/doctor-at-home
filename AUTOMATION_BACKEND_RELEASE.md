# Automation backend only

Based on published main f08c2b4. No HTML, CSS, browser scripts, patient articles, forms, calculators, drug references or authentication UI changes.

Adds authenticated evidence webhook and owner-only review API, durable research runner and source/pipeline modules. Uses the existing RSS allowlist, owner-session module and fast-xml-parser dependency. Includes the additive SQL already applied and synthetic pipeline tests. No new migration is applied by deploying.

Required server settings: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, CLINIC_OWNER_USER_ID, RESEARCH_JOB_SECRET, EVIDENCE_WEBHOOK_SECRET and AI_GATEWAY_MODEL, with Gateway OIDC or API authentication. This branch has not configured production secrets or activated n8n. Preview Vercel protection remains enabled. Live request, provider verification and a real scheduled run remain unverified.

No automatic publication, notifications, patient-data ingestion, final images/video generation or payment operations. Packages await physician source and clinical review. Separate review UI remains in the larger preview branch.

Validation: synthetic tests passed for deduplication, source scope, independent stages, exact quotes, physician approval gate, empty digest, budget reservation, webhook credential and checkpoints. This does not prove live provider availability or clinical accuracy.
