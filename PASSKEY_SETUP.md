# Native doctor passkey setup — code implemented, activation not completed
Existing owner password is retained. Native Supabase passkeys are experimental; keep password fallback.

Implemented: api/doctor-passkey.js proxies bounded fixed WebAuthn options/verify operations to Supabase Auth; registration requires the existing owner session. Authentication verifies the returned token with the provider, checks the configured owner and sets the existing short-lived Secure/HttpOnly/SameSite cookie. No refresh/access tokens or fingerprint images are stored in browser storage. doctor-passkey.js performs the native credential ceremony and serialises binary fields; user verification is required. There is no service-role key or independent biometric account.

Before use, configure Supabase Dashboard → Authentication → Passkeys:
- Enable Passkey authentication.
- RP display name: Dr Pramod G Kulkarni.
- RP ID: home-visiting-icu-doctor.vercel.app
- Allowed origin: https://home-visiting-icu-doctor.vercel.app
The domain is intentionally stable; changing it invalidates previous passkeys. Do not use vercel.app as the RP ID, and do not register credentials against temporary preview domains.

After preview approval and main-site release, the owner signs in with the existing password, opens Doctor session and chooses Add a passkey to my doctor account. The owner completes the device prompt themselves. Later sign-ins can use Fingerprint / Windows Hello / passkey. The operating system may use a fingerprint, face, device PIN or security key; a website cannot promise fingerprint specifically on all PCs. Register an alternative authenticator/recovery route as appropriate; do not remove password fallback.

Tests cover origin/CSRF, registration access, provider challenge, wrong-owner denial, cookie settings and provider-disabled errors. Real-device registration, repeated successful login, cancellation, challenge replay/expiry at the actual provider, disabled/lost device recovery and logout must be verified before declaring the feature live. Supabase setting changes and real-device registration were not performed in this turn.

Sources checked 24 October 2026:
https://supabase.com/docs/guides/auth/passkeys
https://github.com/supabase/auth/blob/master/internal/api/passkey_authentication.go
https://github.com/supabase/auth/blob/master/internal/api/passkey_registration.go
