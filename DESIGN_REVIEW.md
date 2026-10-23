## Release state — 23 October 2026

The approved petal-green baseline was published through PR 4 (main c256b486). The subsequent document, conversion, diet and device-lock changes below are a NEW PREVIEW ONLY. Dr Kulkarni requested a compulsory preview before any further production publishing. Do not merge this preview without his approval.

# International portal redesign — approval preview

This is a review branch, not a production release. Production `main` stays at `44a5678b453213a97b577d0c020d21f06468a531` until Dr Kulkarni approves publishing.

## In this preview

- Calculator work was completed and checked before the broader design edits. The 30 original tool topics are now interactive, with formula, scope, explicit units and reference links. See `CALCULATOR_AUDIT.md`.
- Two simple tools remain in the public portal; 28 clinical tools are grouped within Doctor Workstation.
- New editorial layout: spacious English homepage, clear care pathways, topic discovery, 8 referenced health guides, patient FAQ, guidance PDF sharing and explicit visit-request wording.
- The original 337 HTML element IDs remain. Prescriptions, lab/radiology slips, certificates, Form 2/4/4A, article attachments/import/export, medicine imports, the 20-entry trend, research desk and existing AI/reference links remain accessible. Element retention checks do not prove every legacy feature is clinically correct.
- Three built-in patient article topics remain and have English, individualised guidance. User-created articles and uploaded files are not changed or deleted.
- DrugSetu is linked from the medicine directory with an honest “not connected” API status. See `DRUGSETU_SETUP.md`. No purchase, signup or paid API use occurred.
- English is the original interface language. The pre-existing Google Translate widget is no longer limited to its old 14-language whitelist. Provider-supported languages and browser translation are offered; this is not a claim of human-verified translation into every world language. Clinical document inputs are excluded from automatic translation.

## Verification

- 935 calculation/input assertions passed across all 30 tools.
- DOM integration passed for all 337 existing IDs, calculator placement, tabs, GCS options, conditional inputs, stale-result invalidation, calculator search, awareness search and DrugSetu link.
- The desktop homepage, library, English FAQ and clinical calculator screen were observed in the internal browser. The browser subsequently blocked further observation/interactions because of a URL-policy error involving an unsupported protocol. No workaround was attempted. Final mobile visual QA and translated-page behaviour are therefore still unverified.
- JavaScript syntax checks passed. This is source and software validation, not external medical-device certification.

## Review honestly before release

The wider legacy application still needs separate work: patient-specific isolation of the 20-day trend and other clinical records; removal/review of preloaded prescription examples; public RSS publisher availability (the previous production Critical Care request returned 502); and authenticated server access for paid integrations. This preview does not claim those systems were repaired by a visual redesign. The original local PIN is not a secure clinical backend. External generative AI and daily research automation are not connected.

## What to inspect

1. Homepage appearance and reading comfort on your PC and phone.
2. Health-library search and all 8 guide dialogs; article PDF sharing.
3. Both public tools and the 28 clinical tools inside Doctor Workstation. Review formula definitions and the audit notes.
4. All existing workstation tabs, certificates and attachments.
5. Language menu/fallback, especially Marathi and Hindi; compare clinical meaning with English.
6. DrugSetu reference panel and connection requirements.

Approval to review the design is not automatically approval to deploy to production. The branch will not be merged or published to the live URL without an explicit publishing instruction.

## Petal-green refinement and contact handoff

The review draft now uses pale petal/sage backgrounds, warm-white panels, dark-green text, consistent rounded tabs and an explicit selected-tab style. Core text colours maintain WCAG AA contrast against their background. Print sheet styling is unchanged.

Phone links first open an accessible contact dialog with dialler, WhatsApp and copy options. The initial click prevents navigation and does not copy a number or open an external app automatically. The user can close the dialog to continue browsing. The actual device dialler/WhatsApp handoff has not been tested on the user's phone.

Contact-open/close/copy behaviour, explicit phone URI and navigation state were added to DOM integration checks. Browser visual verification remains incomplete because of the earlier URL-policy block.

## New document and access preview

- Masked passphrase fields, no built-in PIN or master password; PBKDF2-SHA256 verifier with a random salt and 600,000 iterations. Changes require the existing passphrase. Reload, hiding the page and 15-minute inactivity lock the workstation. No simulated fingerprint option.
- This is a browser privacy lock, NOT owner-only server login, encrypted records or a clinical security certification. Verified identity, WebAuthn/passkeys and a protected clinical backend remain unconfigured. The public source and browser-stored legacy data are not secured by this screen.
- Celsius/Fahrenheit and kg/lb conversions; four requested diet presets plus three retained guidance topics, appended without overwriting existing advice.
- Unchanged CRS Form 4/4A PDF and a GHMC Form 2 reference PDF can be downloaded/opened for print. The GHMC edition is explicitly not a verified Maharashtra prescribed edition. Editable HTML working forms remain separate.
- App-generated PDF export stamps website, source-section URL and page number on every page. Original government PDFs remain unchanged. Actual PDF export pagination and mobile share-app handoff still require manual preview review.
- Privacy/limitations page and per-document source references. Article storage remains device-local; adding an article does not publish it globally.
- Tests: 935 calculator assertions plus DOM tests for masked fields, setup/unlock/rejection/change-password protection, no plaintext password storage, converter values, diet non-overwrite/deduplication and per-page PDF stamp calls. No independent security or legal review claimed.

## Patient-separated trend follow-up (preview only)

Added a prominent Doctor Workstation “Diet & Conversions” tab with seven guidance cards and a working second converter; the prescription selector and public converter remain. This addresses discovery: these changes were not yet published to the live baseline.

Trend histories now have unique patient IDs and separate storage entries, an explicit patient selector, date/time, BP/MAP, glucose with context, weight, pulse, SpO2, temperature, creatinine and HbA1c. Each plot uses explicit fixed units and entry order; it is not a clinical recommendation or a time-weighted chart. Selecting a measurement shows its relevant columns. Histories begin with 20 blank entries and permit adding readings (up to 2,000 per history).

No automatic assignment of the old global history: its original local-storage key remains unchanged; an explicit copy creates an unverified legacy history. JSON exports cover a selected patient or all histories. Restore adds new IDs rather than overwriting existing patients. Inputs auto-save locally; storage failures prevent silently switching away from unsaved data. A cross-tab conflict notice prevents silently overwriting unsaved entries.

Patient selection applies to the trend module, not prescription/other clinical-document ownership. Server authentication, encryption and cloud backup remain unconfigured. Software tests use synthetic patients: identical display names with different IDs, distinct BP/glucose values, chart switching, legacy preservation and non-overwriting restore. Actual mobile chart/print/PDF and backup download handoff remain manual preview checks.

## Cloud integration draft — separate from the published release

PR 5 was approved for immediate publishing and merged as 575350783eeb5359eb57c0b2069b4e5bfbb0dc0b. The cloud draft is separate: owner-checked server endpoints, short-lived HttpOnly cookies, Supabase user-JWT/RLS access, conditional revision updates, cloud save/open UI and a database migration. It is not configured and no real cloud record has been saved. Account connections are required; see CLOUD_RECORDS_SETUP.md. No service-role key is accepted, and no patient data or credential is committed. API mock tests pass, but actual project RLS and PC/mobile synchronization remain unverified. This draft must not be represented as an operational clinical cloud service.

## Name-led identity and page orientation draft

The public hero now foregrounds Dr. Pramod G. Kulkarni with a responsive editorial wordmark and a separate care promise. Each clinical tool now has a specific page heading, breadcrumb, description and browser title; safe tab deep links contain no patient information. Public sections have location labels and a section breadcrumb. Article dialogs distinguish the website owner, an AI-assisted draft, source-check date and unrecorded clinical sign-off. The editorial standards page explains attribution, source dates, corrections, sponsorship disclosure, translation limits and current technical limitations. It cites primary Mayo Clinic, MSD and W3C guidance without implying endorsement or certification. Browser/mobile visual verification remains incomplete due to the earlier URL-policy restriction.

## Revision after rejected name-led design

The oversized name in the public hero, two-part wordmark and repeated branded section labels have been removed at Dr Kulkarni's request. Original uppercase Georgia name and the care-led hero are restored; the name is modestly bolder and sharper. Each public section instead has a plain title/intro. Clinical page introductions are compact; switching a tool places focus/scroll at its overview so the contents are immediately apparent.

Added canonical/description/Open Graph metadata, a sitemap containing only the three actual public pages (not invented separate tab pages), robots instructions and a Vercel header configuration. Header policy keeps geolocation available for the existing booking flow and does not prohibit the legacy inline scripts or PDF canvas engine. It is a limited hardening configuration, not a complete CSP or a security certification. Deploy/build success does not verify headers in the browser, accessibility conformance, provider account terms, DNS ownership or clinical/legal compliance. A custom domain is optional; none has been bought or configured. Cloud login/database activation remains blocked on account connections/configuration and real integration tests.

## Device lock usability correction

Removed immediate locking when a page becomes hidden. A local privacy session now stays open during active use, short tab switches and reloads on the same tab. It expires after 15 minutes of inactivity or 8 hours total; foreground/visibility checks enforce elapsed time even when background timers are delayed. Explicit Lock now clears the session. The session is tied to the stored verifier and invalidated when the device passphrase changes. It is sessionStorage state for a device privacy screen, NOT server-auth proof; cloud endpoints continue to require the separate server-verified owner cookie. No plaintext passphrase or permanent remember-me setting is stored. Tests cover continuity, expiration, manual lock, old flag rejection and pagehide not reviving a locked session.

## Restore care headline and contain public layout

The care headline now uses the same heading font, normal emphasis, colour, size rules and line break as the approved petal-green release. The semantic H1 remains, while shared h1/h2 hero selectors retain the old appearance. Removed the newly introduced Georgia hero override; Georgia remains the original name style only.

The mobile full-bleed width/margin rules for Health Library, booking and footer are overridden with contained 100% panels, zero side offsets, border-box sizing and shrinkable children. Search and cards stay within the library; no global overflow hiding is used to conceal clipped content. Final rendered geometry on actual devices remains unverified because browser QA remains blocked.

Added a footer Site information page identifying the canonical URL, Vercel host, current subdomain, HTTPS meaning and explicit verification limits. A live HTTPS HEAD request returned 200 and HSTS on 23 October 2026; a separate direct TLS socket check could not resolve DNS in the runtime, so no negotiated TLS version or certificate-expiry claim is made. No universal “international protocol compliant” or provider endorsement claim is made.

## Click affordances and search metadata

Actionable controls use a pointer cursor, hover and visible keyboard focus; text-entry fields retain text cursors and disabled controls show not-allowed. External new-tab links get noopener/noreferrer. Added WebSite/Person structured data limited to the visible name, canonical URL and phone, with no fabricated ratings, credentials or endorsements. Metadata, sitemap and site-information page describe readiness, not verified Google indexing. Search Console verification/submission remains unconfirmed; no suitable connected ownership-management tool was found.
