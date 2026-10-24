# SEO and patient privacy preview — 24 October 2026

This change is isolated from the pending AI-agent branch and is based on published main 0e74ebe. It does not activate AI billing, scheduled automation or n8n.

## Search pages

- Adds truthful Physician/MedicalBusiness service markup alongside WebSite and Person, without a fictitious clinic address, invented qualifications or ratings.
- Adds a 1200×630 PNG social card and homepage Open Graph/Twitter metadata.
- Homepage language links identify only the existing English/default URL. Automatic Google Translate does not create independent translated pages. Published equivalent article translations receive reciprocal hreflang links only when their matching language URLs actually exist.
- Adds explicit owner publishing for text articles, private drafts, public /articles/<slug> server-rendered pages, per-article metadata, review dates, references and printing. Existing browser-only articles/attachments remain unchanged. No existing article is automatically uploaded or published.
- Sitemap index includes the real public pages and a database-backed article sitemap. Only published articles appear. Sitemap length alone does not establish SEO quality or guarantee indexing/ranking. Search Console and custom-domain setup are not completed by this change.

## Patient privacy

- New client and server saves use a generated code as the cloud record label. Local display names are retained locally. Notes/readings/dates can still identify a person; pseudonymisation is not anonymisation.
- Requires doctor-recorded permission before first upload. Stores notice version, method, purpose, recording actor and time. Existing permission time is preserved on routine saves; changing the permission record creates a minimal audit event.
- Adds owner-only cloud deletion with exact-code confirmation and optimistic revision protection. It does not delete local records, exports, recipient copies or all provider backups. Required clinical retention must be checked first.
- Minimal privacy events contain patient code/ID, actor, event, version/method and timestamp; no names or readings. The trigger is private, has a fixed search path and cannot be invoked directly by application roles.
- Existing cloud records are not changed or deleted. They may still contain earlier names and have no permission record; the owner must review them and explicitly resave through the new coded flow. No historical consent is invented.

## Database migration applied after explicit approval

The user explicitly approved the prepared migration on 24 October 2026. Supabase migration `patient_privacy_and_public_articles` was applied successfully. The consent column, owner-only delete policy, private audit trigger and article tables/policies are present; row-level security is enabled on all three tables. The earlier automatic-review block was resolved through explicit approval, without bypassing it.

Database role tests confirmed an unrelated authenticated user sees zero patient, audit or private draft rows. An owner-role transaction successfully created and deleted a synthetic coded record and generated both audit events; all synthetic changes were rolled back. Direct trigger execution is denied to authenticated clients. A separate transaction confirmed anonymous readers see only published articles while the owner can read their draft; these test articles were also rolled back. The original patient-row count remains one, and no existing label or consent was rewritten.

The deployed preview returns HTTP 200 for /articles and /article-sitemap.xml using the new database. Both are honestly empty because no real article has been explicitly published through the new service. The production website code remains unchanged; authenticated browser save/delete/publish interactions still require owner preview testing.

Supabase security advisors report no new database advisories. The existing Auth warning remains: leaked-password protection is disabled (https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). No subscription or paid security option was enabled.

The SQL is additive except for new grants/policies; it does not delete patient records or publish articles. Column checks, RLS, restricted audit writes and authenticated revision checks are prepared. This is not a statement of full legal compliance. A checkbox attestation is not independent verification of valid consent, guardian authority or all retention obligations.

## Validation

Synthetic tests cover coded outgoing labels, required permission, exact-code deletion, revision conflicts, untrusted article text/JSON-LD escaping, source URLs, language links and sitemap discovery. Existing calculator and UI regressions are run separately. Browser/mobile visual QA and the full owner browser-to-API save/delete/publish flow remain unverified. Database RLS/trigger tests and public preview reads passed. No real patient data is included in tests, documents or source control.
