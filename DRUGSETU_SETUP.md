# DrugSetu connection — review draft

DrugSetu is an independent commercial medicine-data platform, not the government Drug Registry and not a verified CIMS replacement. The workstation now provides its official website and API pricing links. No DrugSetu data has been copied, and no API connection is claimed.

Official sources checked 23 October 2026:
- https://drugsetu.com/faq/
- https://drugsetu.com/pricing/
- https://drugsetu.com/terms-of-use/
- Documentation linked by DrugSetu: https://app.drugsetu.com/

## How to connect after access is available

1. Create your own DrugSetu account and obtain the appropriate test/production access. Check the selected plan’s permitted fields and current charges directly with DrugSetu. The pricing page currently has inconsistent trial-request counts, so confirm your account allowance rather than relying on a guessed limit.
2. Obtain the authenticated API documentation: exact endpoint, query names, response schema, error codes, rate limits and permitted use. Homepage sample code is insufficient to validate a production integration.
3. Add the API key as a Vercel server environment secret, for example `DRUGSETU_API_KEY`. Never paste it into this repository, browser localStorage, patient documents or chat.
4. Add an authenticated, rate-limited server route for clinician search. The existing browser PIN is not server authentication and cannot protect a paid API key from public consumption by itself.
5. Send only a medicine search term; do not send patient names or records. Allowlist the confirmed provider host, validate input length, cap responses, impose a timeout, honour provider limits and render returned values as text.
6. Keep DrugSetu search results separate from your local catalogue. Show source, retrieval time, strength, dosage form, composition, manufacturer and packaging where the plan provides them. Do not silently overwrite medicines or dosing.
7. Adding a result to a prescription should require clinician confirmation and blank patient-specific dose/frequency/duration fields. Brand/composition similarity does not establish therapeutic interchangeability.
8. Test with the sandbox, including no results, duplicate brands/strengths, unavailable service, quota errors and invalid keys. Then review a preview before enabling production.

The provider terms limit database extraction/replication. API search access does not imply permission to download and retain the entire database. Any bulk import needs the appropriate written permission. Existing authorised CSV/JSON imports and existing references remain available.

No account creation, subscription purchase or paid API call was performed for this draft.
