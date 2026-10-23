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
