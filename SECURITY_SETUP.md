# Doctor Workstation security activation

## Implemented in the feature branch

- Owner sign-in accepts the configured username. Supabase Auth continues to own the underlying email identity; the browser does not need to know it.
- Password login does not issue a workstation session. The backend first requires a Supabase Phone MFA challenge to the fixed owner phone `+919561394341`.
- The first-factor access token is held only in a short-lived Secure, HttpOnly, SameSite=Strict pending cookie. The normal owner session cookie is issued only after the phone factor is verified.
- Every protected clinical-cloud request requires a verified Supabase JWT with `aal2`. Legacy password-only sessions fail closed.
- Password change requires the current password, a new password of at least 12 characters, and the same new password entered again. A successful change clears the browser session and requires a fresh username/password/OTP login.
- Passwords and OTPs are never written to application tables, localStorage, or logs. Supabase Auth stores password hashes, MFA factors and authentication sessions. The website stores only HttpOnly session cookies in the browser.

## Required provider activation before production

1. In Supabase Dashboard → Authentication → Providers, configure Phone SMS delivery using an approved SMS provider and its private credentials. For a native Twilio SMS setup, configure the Account SID, Auth Token and Messaging Service SID in the Supabase Auth provider settings; do not put these values in GitHub, HTML, browser storage, or chat.
2. In Supabase Dashboard → Authentication → Multi-Factor Authentication, enable Phone factor enrollment and Phone factor verification.
3. Confirm the owner account's phone factor is exactly `+919561394341`. The first successful login after provider activation enrolls this phone if it is not already enrolled, sends the enrollment OTP, and blocks access until verification succeeds.
4. Enable leaked-password protection in Supabase Auth password security settings.
5. In Vercel Production environment, verify the existing server-side values `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `CLINIC_OWNER_USER_ID`, `CLINIC_OWNER_EMAIL`; set `CLINIC_OWNER_USERNAME=drkulkarnipg`. Keep these as server-side environment variables. Redeploy after changing them.
6. Confirm Supabase Auth rate limits, OTP expiry and SMS frequency are appropriate. Check India SMS delivery, sender registration/template requirements and provider balance.
7. Run a real production-equivalent test: username + correct password → SMS delivered to the owner's phone → correct OTP → workstation opens; wrong/expired OTP → access denied; old password-only session → access denied; password change with mismatched confirmation → rejected; successful password change → session cleared and fresh OTP required.
8. Run Supabase Security Advisor and resolve all relevant findings before marking the release secure.

## Fail-closed behavior

If the SMS provider or Phone MFA is not enabled, the backend rejects workstation sign-in. It must never fall back to password-only authentication or the local device passphrase as a substitute for server authentication.

## Important

Phone SMS MFA improves assurance but remains susceptible to SIM-swap and mobile-number takeover. Protect the carrier account and consider a passkey or hardware-backed authenticator as an additional future factor. Do not represent the workstation as fully production-secure until actual OTP delivery, verification, recovery, expiry, and non-owner access tests have passed.
