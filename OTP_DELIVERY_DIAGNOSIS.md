# Password-reset OTP delivery — evidence and next step

App request: one normal live website request completed with the generic success message.
Auth provider: current code returns that message only for an OK response from Supabase /auth/v1/otp with configured owner email and create_user:false. This does not independently verify a numeric token was rendered in the email or that SMTP/inbox delivery occurred.
Email sending/inbox: not verified. Supabase configuration/delivery logs and inbox connector are unavailable in the current session. No provider setting or password was changed. No second send attempted.

Verified gap: the existing UI says a code was sent although it has no delivery receipt. Do not use this as evidence that the reported missing-email fault is fixed.
Potential causes needing evidence: sender configuration/restrictions, provider email template using a Magic Link instead of a numeric token, delivery failure or filtering. These are not established diagnoses.

Next action: connect Supabase for the website project; inspect relevant Auth request, SMTP/hook/template, error and delivery records. User can confirm receipt without sharing the code. Never request secrets in chat or bypass account verification.

## Updated after Supabase connection

Project matched production. Auth200/user_recovery_requested and confirmed-owner recovery_sent_at2026-11-04T19:10:21.409999Z verified without reading tokens. Owner confirms receipt of a Sign in link email; numericOTP receipt remains unverified. Supabase docs prescribe displaying{{ .Token }} in the relevant email template. Actual dashboard settings require secure dashboard sign-in; connector supports logs/database but no Auth config endpoint. No second send/password change performed.

## Verified configuration fix

Dashboard access succeeded. Actual MagicLinkOTP template lackedToken and only renderedConfirmationURL. Saved OTP-primary subject/body, preserving fallbacklink and originalbackup. Independent reload and completeeditor clipboard comparison exactly matched intendedHTML. One post-fix live request accepted after cooldown. Numeric-code inbox receipt awaits owner confirmation; no password changed.
