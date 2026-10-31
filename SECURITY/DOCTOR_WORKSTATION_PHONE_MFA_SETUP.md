# Doctor Workstation username + Supabase Phone MFA — implementation plan

Status: DEVELOPMENT PREPARATION ONLY. No provider account, SMS credentials, Auth factor enrollment, or live OTP delivery is configured. This document is not evidence that SMS verification is active.

## Protected release boundary

- Work only on branch `feature/doctor-workstation-username-phone-mfa`, based on Stitch development head `6e01d44e1e6a3f982e918f585ba09fcad9b445a4`.
- Do not change `main`, production, MASTER ORIGINAL, Vercel production settings, or production Supabase data.
- Do not commit credentials, passwords, OTPs, access tokens, refresh tokens, or service-role keys.
- Do not use test OTP bypasses in a production environment.

## Approved user experience

1. Owner enters a username and password.
2. Server resolves the username to the single configured owner account without revealing the owner email or supporting public signup.
3. Owner completes Supabase Phone MFA using the already-enrolled, verified owner phone factor.
4. The server accepts the resulting session only after verifying owner UUID and MFA assurance level `aal2`.
5. Password change requires a new password and confirmation entry; the two values must match and meet the configured minimum strength.
6. Password update is accepted only with a fresh, verified MFA-backed owner session. Server-side validation and rate limits apply.
7. Logout/revocation and session renewal retain the current Secure, HttpOnly, SameSite=Strict cookie boundary.

## Supabase Auth / SMS provider

Use Supabase hosted Auth Phone MFA (not a custom OTP generator). Supabase Auth creates and verifies the MFA challenge; the configured SMS provider delivers the message.

Selected provider for setup: Twilio Verify, subject to account creation, destination support, pricing review, and applicable India telecom requirements.

Supabase provider configuration requires the credentials/identifiers shown in the project's Auth > Providers > Phone configuration. These must be entered directly in the Supabase dashboard's secret fields; never place them in source control or ChatGPT.

Twilio setup:
1. Create an account at https://www.twilio.com/try-twilio .
2. Create/configure a Verify Service in the Twilio Console.
3. Complete any identity, billing, destination, and sender/compliance requirements Twilio requests for India.
4. In Supabase Dashboard > Authentication > Providers > Phone, enable/configure the supported Twilio Verify integration using the required account/service credentials.
5. Configure Phone MFA enrollment and verification in Supabase Auth settings.
6. Verify the owner phone factor through a controlled enrollment challenge before enabling mandatory MFA.
7. Check the actual delivered OTP on the owner's handset and verify it once in the development environment.

India notes:
- Use E.164 format internally for the phone factor.
- India SMS delivery has regulatory and routing requirements. Confirm the current Twilio India guidance and DLT applicability for the chosen route before production use.
- Do not assume international delivery, DLT exemption, sender ID, or carrier delivery until the provider confirms the account's selected route.
- SMS MFA has SIM-swap risk. Keep a documented account recovery route and protect the Supabase organization account separately with strong MFA.

## Required implementation controls

- Username lookup must be private and non-enumerable; no public table read, no email returned to the browser, no user-controlled owner UUID.
- Restrict the mapping to the configured owner identity; public signup remains disabled.
- Do not treat `user_metadata` as an authorization source.
- Require signed/verified Supabase Auth tokens, correct issuer/audience, owner UUID, unexpired session, and `aal2` for sensitive password changes and workstation access.
- Challenge and verification must use Supabase Auth's phone MFA factor APIs. Do not create/store OTPs in a public database table.
- Enforce resend throttling, failed-attempt limits, short session age for password changes, CSRF/origin checks, and generic errors.
- Password and confirmation are compared server-side; minimum 12 characters; never log or persist plaintext passwords.
- Revoke other sessions after password change where supported and verify the behavior in development.
- Do not rely on a client-side `verified=true` flag for authorization.

## Current external blocker

The owner has no Twilio account yet. Therefore SMS provider credentials and real SMS delivery are unavailable. Do not activate the feature, remove existing login recovery, or claim successful OTP delivery until the account/provider setup and real handset test are complete.

## Verification gate before any production request

- Owner factor enrollment and challenge/verify succeeds on the actual handset.
- `aal2` is confirmed by the server for the exact session used.
- Wrong owner, unverified phone, wrong/expired/replayed OTP, excessive attempts, cross-site POST, stale session, mismatched passwords, weak password, and password update without recent MFA are rejected.
- Correct username + password + OTP permits only the configured owner.
- New password works; old password fails; other sessions are revoked or explicitly documented.
- Regression suite passes on exact branch head; preview deployment and visual/functional tests are recorded separately.
- Production migration/configuration/deployment requires separate explicit approval.

## Official references

- Supabase Phone MFA: https://supabase.com/docs/guides/auth/auth-mfa/phone
- Supabase MFA enforcement and AAL: https://supabase.com/docs/guides/auth/auth-mfa
- Supabase phone provider configuration: https://supabase.com/docs/guides/auth/phone-login
- Twilio Verify SMS: https://www.twilio.com/docs/verify/sms
- Twilio India SMS guidance: https://www.twilio.com/en-us/guidelines/in/sms
