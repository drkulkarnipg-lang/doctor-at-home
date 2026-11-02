# Private cloud patient trends — not connected yet

The preview contains the login, cloud save/open controls, API and database migration. No database was provisioned and no patient record was uploaded during development. Supabase and Vercel account connections are required to finish configuration. No paid plan or subscription has been activated.

## Configuration

1. Connect the doctor's Supabase and Vercel accounts. Use a dedicated project, choose the storage region deliberately, and review the provider's terms, costs, retention and backup options before clinical use. This code is not a legal or regulatory certification.
2. Create/verify the doctor's Supabase Auth user through the provider dashboard. Disable public signup. Use a strong unique password; do not paste passwords, service-role keys or database credentials into chat or GitHub. **First-time account creation is an administrator/provider-dashboard step, not a public website signup.** The website can request a password-recovery email for an existing owner account; it cannot create the owner identity from the public page. Native passkey endpoints and UI are in the repository, but they are not active until the Supabase passkey settings and real-device ceremony in `PASSKEY_SETUP.md` are completed. MFA is not currently verified as enabled.
3. Run `supabase/migrations/20261023_patient_trends.sql` once. In the administrative SQL editor, insert ONLY the verified doctor's Auth UUID into `clinic_members`. Do not grant public/anonymous access. RLS enforces membership and ownership in the database; browser filtering alone is insufficient.
4. Configure Vercel server environment variables for the same dedicated Supabase project: `SUPABASE_URL` (HTTPS `.supabase.co` project URL), `SUPABASE_PUBLISHABLE_KEY` (`sb_publishable_…`, not a secret/service-role key), and `CLINIC_OWNER_USER_ID` (the verified doctor's Auth UUID). Also set `CLINIC_OWNER_EMAIL` to the exact owner email address used by Supabase Auth; this is required for the site's password-recovery request. These values must all refer to the same project/account. Never commit credential files, passwords, refresh tokens or service-role keys. Production and preview should use separate clinical/test projects and users; use synthetic records for preview.
5. Redeploy the preview. Check the cloud panel, sign in as owner, then test all of: anonymous access denied, another authenticated user denied, owner read/insert/update allowed, wrong revision rejected with 409, and owner logout. Run actual RLS integration checks against the configured database; mocked API tests are not evidence that a live project's policies are correct.
6. Test with two synthetic patients on PC and mobile: save to cloud on one device, open on the other, update and reload. Compare conflicts, offline errors and expired login before using real patient information. After the doctor's preview approval, configure/redeploy production.

## First-time password setup, email OTP and password changes

The clinic owner Auth identity already exists in the connected Supabase project and is confirmed by email. The public website must never create a second owner or allow public signup.

### Preferred first-time password creation / forgotten password / password change

1. Keep public signups disabled. Confirm the existing owner account, `CLINIC_OWNER_USER_ID`, `CLINIC_OWNER_EMAIL` and optional `CLINIC_OWNER_USERNAME` all identify the same owner in the same Supabase project. The server sends codes only to the configured owner email; the browser cannot supply or redirect the recipient.
2. In Supabase Dashboard → Authentication → Sign In / Providers → Email, keep Email OTP enabled. Set the Magic Link email template to display the numeric code using `{{ .Token }}` (not only `{{ .ConfirmationURL }}`). The website's OTP form accepts 6–10 digits. Configure the OTP expiry to a short interval (recommended 10 minutes; never more than 24 hours).
3. Configure a production SMTP sender under Authentication → SMTP Settings. Use the clinic's verified Google Workspace sender if that is the chosen provider; keep SMTP credentials in Supabase's secret settings only. Supabase's built-in sender is best-effort, limited to 2 emails/hour and restricted to project-team addresses; it is not a production delivery service.
4. In Doctor Workstation → Doctor login, select **Create / change password with email OTP** → **Send email OTP**. Enter the code received at the configured owner email, then enter and confirm a unique password (12–128 characters). The API calls Supabase Auth with `create_user:false`, verifies the code, checks the verified Auth UUID against `CLINIC_OWNER_USER_ID`, then updates the password. No public user creation, client-selected email, localStorage password or service-role key is used.
5. On successful password change, the API attempts to sign out all active Auth sessions, clears its own session cookies, and asks the doctor to sign in again with the new password. If global sign-out cannot be confirmed, the UI states that explicitly; manually log out other devices.
6. The existing recovery-link control remains as an alternative. Its redirect must be allow-listed exactly as `https://home-visiting-icu-doctor.vercel.app/password-reset.html`. The recovery page strips the token from browser history and keeps it in memory only.
7. Test on the production origin and actual owner mailbox: request code; confirm delivery; reject wrong/expired code; reject any non-owner Auth UUID; create the first password; sign in; change password with a fresh OTP; confirm the old password fails and the new one works; confirm logout and session expiry. Use a private browser and never enter real patient data in test records.

### Security controls

- The OTP recipient is fixed server-side to `CLINIC_OWNER_EMAIL`; user input cannot choose another address.
- OTP requests use Supabase Auth rate limits; do not add a resend loop or bypass cooldowns.
- Passwords must be unique and at least 12 characters; the application never stores them.
- OTP tokens and Auth access tokens are not returned to the browser by the password setup API.
- Only the configured clinic owner's verified Auth UUID may change the password.
- Password updates use Supabase Auth; passwords are never stored in application tables.
- Public signup remains disabled. A missing owner account is an administrator/provider-dashboard setup issue, not a public signup flow.
- Email OTP delivery is not considered active until the Auth email template, SMTP sender, real inbox delivery and live password change have all been verified.

### Provider references

- https://supabase.com/docs/guides/auth/auth-email-passwordless
- https://supabase.com/docs/guides/auth/auth-smtp
- https://supabase.com/docs/guides/auth/passwords
- https://supabase.com/docs/guides/auth/rate-limits
- https://supabase.com/docs/guides/deployment/going-into-prod

## Register storage activation

The register screen is not evidence that cloud persistence is ready. Before using Daily Patient, Death or Stock Registers, back up the intended database, apply `supabase/migrations/20261030_workstation_registers.sql` to the correct project, verify the owner row in `clinic_members`, and test list/create/update/conflict/non-owner denial using actual owner and non-owner accounts. The migration grants no delete permission. Record the migration version and a successful restore test in the private operations log. Never test with real patient/death data in Preview.

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


## Practice registers — separate reviewed migration

The optional Doctor Workstation Daily Patient, Death and Stock Registers use `public.clinic_workstation_registers` and the same authenticated clinic-owner/member boundary as patient trends. The application does not save these entries in browser localStorage and does not offer deletion from the UI. Updates use revision checks; CSV exports are local downloads and must be protected as confidential practice data.

**Not enabled merely by merging source code.** Before using the register feature, a database administrator must review and manually apply `supabase/migrations/20261030_workstation_registers.sql` to the dedicated Supabase project, verify that the intended owner UUID is present in `public.clinic_members`, and test RLS with the actual clinic-owner account and a non-owner account. Do not run this migration against a production database until it has been reviewed and tested in a separate project/preview. The migration intentionally grants no DELETE permission. If the table is absent, the UI reports that cloud register storage is not installed and does not create a local fallback.

These working registers do not replace the prescribed Maharashtra/local statutory registers, government death forms, or official medical certification requirements. Confirm the applicable legal fields and retention rules before clinical use. No real patient or death record was entered in tests.
