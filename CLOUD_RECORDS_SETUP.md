# Private cloud patient trends — not connected yet

The preview contains the login, cloud save/open controls, API and database migration. No database was provisioned and no patient record was uploaded during development. Supabase and Vercel account connections are required to finish configuration. No paid plan or subscription has been activated.

## Configuration

1. Connect the doctor's Supabase and Vercel accounts. Use a dedicated project, choose the storage region deliberately, and review the provider's terms, costs, retention and backup options before clinical use. This code is not a legal or regulatory certification.
2. Create/verify the doctor's Supabase Auth user through the provider dashboard. Disable public signup. Use a strong unique password; do not paste passwords, service-role keys or database credentials into chat or GitHub. The current flow supports password login only; passkeys/Windows Hello and MFA are not implemented here.
3. Run `supabase/migrations/20261023_patient_trends.sql` once. In the administrative SQL editor, insert ONLY the verified doctor's Auth UUID into `clinic_members`. Do not grant public/anonymous access. RLS enforces membership and ownership in the database; browser filtering alone is insufficient.
4. Configure Vercel server environment variables `SUPABASE_URL` (the project's HTTPS `.supabase.co` URL), `SUPABASE_PUBLISHABLE_KEY` (`sb_publishable_…`, NOT a secret/service-role key), and `CLINIC_OWNER_USER_ID` (the verified doctor's Auth UUID). All three must point to the same project. Never commit credential files. Production and preview should use separate clinical/test projects and users; use synthetic records for preview.
5. Redeploy the preview. Check the cloud panel, sign in as owner, then test all of: anonymous access denied, another authenticated user denied, owner read/insert/update allowed, wrong revision rejected with 409, and owner logout. Run actual RLS integration checks against the configured database; mocked API tests are not evidence that a live project's policies are correct.
6. Test with two synthetic patients on PC and mobile: save to cloud on one device, open on the other, update and reload. Compare conflicts, offline errors and expired login before using real patient information. After the doctor's preview approval, configure/redeploy production.

## Behaviour

- Open Doctor Workstation → Patient BP, Sugar & Trends → Private cloud records.
- Sign in to cloud, select a local patient and use **Save selected patient to cloud** once. That patient's later edits auto-sync after a short delay while signed in. New local/restored records need their first cloud save; no bulk upload of existing local data happens automatically.
- On another device, sign in, refresh the cloud patient list and open the required patient. This creates/updates its local working copy. A different local copy is never silently overwritten.
- A confirmed server response shows “Cloud saved”. Offline/expired-session/conflict errors explicitly show NOT SAVED TO CLOUD; local edits remain. Retry manually after resolving the problem. This is not an offline background-sync service.
- Updates use an expected revision. Concurrent device edits produce a conflict instead of overwriting a newer history. Export a local JSON backup before comparing conflicting versions. Restoring a backup creates new patient IDs.
- Cloud save covers **patient trend histories only** in this release. Prescriptions, certificates, medicine lists, articles and attachments are not yet cloud-synced.
- Auth tokens use a Secure, HttpOnly, SameSite=Strict host cookie, limited to 15 minutes; no token/password is saved in localStorage. The server verifies the user with Supabase on every clinical request and uses the user's JWT so RLS still applies. No service-role bypass or public patient endpoint exists.
- Signing out stops cloud access but does not erase already downloaded local histories or exported files. Local browser records remain unencrypted, protected only from casual viewing by the device lock. This preview does not claim secure shared-PC storage, end-to-end encryption, a full medical-record audit log or production clinical-system certification.
- There is no delete endpoint. Retention, backup restoration, provider access and incident procedures need to be configured with the actual project.

## Primary references

- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/auth/passwords
- https://supabase.com/docs/guides/getting-started/api-keys
- https://github.com/supabase/auth
