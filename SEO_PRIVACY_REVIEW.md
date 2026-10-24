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

## Database migration is NOT applied

Automatic approval review rejected applying supabase/privacy-and-articles-schema.sql to the live database because it changes persistent production schema/security, enables authenticated patient deletion and adds public-article access. The user must explicitly approve this concrete migration before it runs. No workaround or equivalent SQL execution was attempted. Until approved, the new consent/delete and public-article database features cannot pass live end-to-end tests; schema-dependent operations in preview may fail. Existing production website remains unchanged.

The SQL is additive except for new grants/policies; it does not delete patient records or publish articles. Column checks, RLS, restricted audit writes and authenticated revision checks are prepared. This is not a statement of full legal compliance. A checkbox attestation is not independent verification of valid consent, guardian authority or all retention obligations.

## Validation

Synthetic tests cover coded outgoing labels, required permission, exact-code deletion, revision conflicts, untrusted article text/JSON-LD escaping, source URLs, language links and sitemap discovery. Existing calculator and UI regressions are run separately. Browser/mobile visual QA and live schema-dependent operations remain unverified. No real patient data is included in tests, documents or source control.
