# Shared interface and document contract

Owner instructions, 4 November 2026: every facility must meet its actual purpose; every control must be exercised, not merely inspected. Uniformity is required across dates, document preparation, save/download/share/print, navigation, readability, messages and dialogs. Translators must operate independently in their own sections; earlier synchronized whole-page requirements are superseded.

## Implemented source changes, not yet live

| Area | Single rule | Implementation / limits |
| --- | --- | --- |
| Clinical display dates | `25th Nov, 2026`; 24-hour `HH:mm IST` when a time is present | clinical-format.js validates ISO date-only values without timezone shifts, handles the site's existing explicit DD/MM/YYYY fields and preserves blanks/unknown/invalid values. App-generated clinical clones and signoffs use it. Native date-picker UI and unchanged original government PDFs keep their native/source representation. Machine storage and filename dates remain ISO. Other editorial/research publication-date displays are not yet migrated. |
| Clinical PDF actions | Complete and review → Prepare PDF / Share PDF → the same ready panel → explicit Download PDF or device Share | clinical-document-workflow.js routes 11 document IDs through the shared PDF preparation service. Existing text copies, article downloads, recipient options and native share capability remain available. No automatic recipient sending. |
| Save labels | File type and destination must be explicit | Prescription's text save is labelled “Save text as…”. Existing private-cloud text save is preserved; complete cross-document cloud-storage format unification remains pending authenticated verification. Do not claim all Save buttons are already identical. |
| Clinical facts/events | Never invent date, measurement, signature event or medicine | Existing form field values retained; only presentation is normalized. Current preparation time is not an examination/death/signature time. |
| Independent language scopes | Header navigation, overview, Health Library, reader, Workstation and booking form maintain separate language state | section-languages.js; awareness-library.js has independent library/reader APIs; booking language no longer changes the library/reader. The provider catalogue may be retained without claiming every listed language has working scoped translation. |
| Available translation | Complete authored EN/MR guides; available MR navigation labels; no silent whole-page fallback | Unsupported scoped language leaves content unchanged and displays an explicit status. Full Workstation clinical/interface translation and additional section-only languages require authored content or a suitably governed service. No entered patient data is translated or transmitted. |
| Dialog interaction | Initial focus inside, contained keyboard traversal, explicit Close, Escape/backdrop and focus restoration | Credentials and PDF Share fixes are coded/tested. Other dialogs remain in the hands-on queue. |
| Presentation | Consistent compact section orientation; content-specific information and original links retained | Source refinement only; actual protected preview/mobile viewing still required. |

## Verification required before publication

1. Exact current source must pass regression. Update obsolete tests only for the owner's explicit new requirements; retain data, isolation, error and preservation assertions.
2. Browser-check each new independent selector: Library MR must not change open reader, Workstation or homepage; reader MR must not change Library; unsupported language must not invoke a global provider.
3. Verify actual prepared PDFs for prescription, laboratory/radiology requisitions, fitness/unfitness, referral/consent, editable forms and invoice; include invalid/blank/long cases. Original reference PDFs stay unchanged.
4. Verify Save/Download/Share/Print and cancellation/error paths with synthetic data; no actual patient changes or human-directed message without explicit instruction.
5. Confirm the new HTTPS preview source, then authorized production release and root/www commit mapping. Preview access and legitimate workstation sign-in gates remain open.

This contract defines acceptance criteria and partial source implementation, not zero-defect, clinical, legal, accessibility or world-ranking certification.
