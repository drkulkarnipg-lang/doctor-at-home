# AI Patient Website Assistant — Setup & Safety
**Project:** HOME VISITING ICU DOCTOR  
**Backend:** Supabase project `xqhhxnehrjkpyffdvxdm` (Mumbai region)  
**Function:** `patient-site-assistant`  
**Status:** code integrated in the protected design draft branch; provider secret is not yet configured.

## What this first AI release does

The AI assistant is a **website navigation and service-information assistant**, not an AI doctor. It can help visitors find booking, fees, contact options, Health Library, patient guides and website tools. Existing deterministic FAQs answer known service questions immediately; other permitted navigation questions are sent to the server-side model.

Clinical questions are deliberately intercepted before calling the model. The assistant does not diagnose, assess symptoms, interpret reports, counsel on treatment, name medicines or recommend doses. Emergency keyword matches return a fixed emergency message directing the visitor to call 112 or go to the nearest emergency department. This conservative scope reflects India's Telemedicine Practice Guidelines for technology platforms, which state that AI/ML platforms must not counsel patients or prescribe; an RMP must communicate clinical counselling/prescriptions directly.

## Provider configuration (required before generative replies work)

The function is provider-agnostic and uses an OpenAI-compatible Chat Completions endpoint. The default is OpenRouter:

- `AI_API_KEY` — provider secret (required)
- `AI_BASE_URL` — optional; default `https://openrouter.ai/api/v1`
- `AI_MODEL` — optional; default `openrouter/free`

You may alternatively name the key `OPENROUTER_API_KEY` or `OPENAI_API_KEY`; the function checks those names as fallbacks. Never place this secret in GitHub, HTML, JavaScript, Vercel public environment variables, or a browser. The website contains only the Supabase publishable key, which is designed for public clients.

### Set the secret

1. Open the Supabase project dashboard for `doctor-at-home`.
2. Go to **Edge Functions → Secrets**.
3. Add `AI_API_KEY` with the provider's API key as its value.
4. Optionally add `AI_BASE_URL` and `AI_MODEL` if using another OpenAI-compatible provider/model.
5. Save. Supabase makes new secrets available to deployed functions without a function redeploy.

Provider key setup is an owner action; this repository workflow cannot retrieve or invent an API key. Do not send the key in chat or commit it.

## Security and privacy controls in this implementation

- Provider key is read only on the Edge Function server.
- Website API key is a Supabase publishable key; the function checks it against the project's configured publishable/legacy anon keys.
- CORS is restricted to the official site, custom domains, localhost development and the project's Vercel preview host pattern.
- Request size and message length are capped; only one message is sent per request.
- Per-isolate IP throttling is a best-effort first layer, not a globally consistent abuse-control system. Add an edge/WAF rate limit or persistent atomic limiter before high-volume production use.
- No conversation or patient details are written to the database by this function.
- No patient name, phone, address, Aadhaar, report or image should be entered into the public chat.
- Upstream provider error bodies are not returned to the browser.
- Model output is capped and the request has a timeout.
- The model cannot call tools, access Doctor Station, read patient records, write to the database, book visits, take payments or issue prescriptions.

## Clinical/legal boundary

MoHFW/NMC telemedicine guidance requires RMP-led professional judgement, patient/RMP identification, consent, appropriate mode of consultation, evaluation and management. AI/ML platform assistance does not replace the RMP's direct communication for counselling or prescriptions. The AI patient website helper is intentionally restricted to navigation and service information. Before adding symptom triage, personalised disease management, report interpretation or clinical decision support, obtain legal/regulatory review and establish a separately governed clinician-supervised workflow.

## Test plan before declaring AI live

1. Verify function returns `AI_SETUP_REQUIRED` before provider secret is configured.
2. After secret configuration, test permitted queries in Marathi, Hindi and English.
3. Confirm emergency phrases return the fixed 112 response without model invocation.
4. Confirm medication, diagnosis, symptom and report questions are routed to an RMP.
5. Test invalid API key, disallowed origin, oversized request, rate limiting, provider timeout and provider error.
6. Confirm no chat content is stored and no provider key appears in browser/network assets.
7. Test on mobile and desktop preview, then verify the exact production SHA and domain after release.

## Primary references

- India Telemedicine Practice Guidelines — https://www.nmc.org.in/wp-content/uploads/2019/10/Public_Notice_for_TMG_Website_Notice-merged.pdf
- MoHFW Guidelines for Technology Platforms enabling Telemedicine — https://www.mohfw.gov.in/pdf/Telemedicine.pdf
- WHO, Ethics and governance of AI for health — https://www.who.int/publications/i/item/9789240084759
- Supabase Edge Functions — https://supabase.com/docs/guides/functions
- Supabase Edge Function secrets — https://supabase.com/docs/guides/functions/secrets
- Supabase Edge Function auth — https://supabase.com/docs/guides/functions/auth
