# Stitch clinical web platform — implementation review

Date: 31 October 2026  
Repository: `drkulkarnipg-lang/doctor-at-home`  
Isolated experiment branch: `experiment/stitch-clinical-platform-2026-10-31`  
Protected source baseline: `fe09009b3bd3e0f2a561fe7ca854ebe52d16956d`

## Export received

`stitch_clinical_web_platform_architecture.zip` contains four HTML screens and screenshots:
1. Home Visit / bedside assessment
2. Booking / telemedicine
3. Clinical bedside calculators
4. Statutory forms / digital prescriptions

It also contains a design-system specification. The export is a static visual prototype, not a production-ready application or a replacement for the existing clinical platform.

## Design direction adopted

- Warm ivory canvas: `#FAF8F5`
- Linen surfaces: `#F5F2EB`
- Deep academic navy: `#0B192C` and `#102A43`
- Petal / forest greens: `#4E8765` and `#3B6E52`
- Restrained sky-blue focus accent: `#3884BE`
- Linen divider and input border: `#E6DFD5` and `#D8CEBF`
- Locally bundled Newsreader and Inter remain in use rather than introducing remote font dependencies.
- Classical rectangular controls, restrained radii, tabular figures, clear spacing and visible focus states.
- Critical red remains reserved for genuine emergency/contraindication semantics; it is not used as a decorative brand colour.

## Mapping to the existing application

| Stitch screen | Existing application destination | Integration rule |
|---|---|---|
| Home Visit | Patient Portal home / overview panel | Retained existing home-visit hero, contact actions, credentials and pathways; renamed first tab to **Home visit**. |
| Booking / Telemedicine | Existing Booking tab and booking section | Existing intake, GPS, fee estimate, consultation notice, payment disclosure and WhatsApp workflow retained. |
| Clinical calculators | Existing public Know Your Numbers plus 28 Doctor Workstation calculators | Visual refinement only. Existing formula functions, units, blank defaults, validation, interpretation and references remain authoritative. |
| Statutory forms / digital prescriptions | Existing prescription, lab/radiology requisitions, certificates and government forms | Screen-only styling of existing editors. Existing document generation, identity, sign-off and A4/PDF/print behaviour remain authoritative. |

Patient Portal order is now:
1. Home visit
2. Booking
3. Health library
4. Elderly care
5. Search articles
6. Health tools
7. Patient FAQ

All seven destinations remain present. Existing two-workspace structure (Patient Portal and Doctor Workstation) is preserved.

## Deliberately excluded from the Stitch export

The static HTML contains sample patient names, age/sex, phone and identity-like values, clinical observations, medication entries and prefilled calculator values. None of those example records or values were imported.

The Stitch calculators have sample defaults; the existing application intentionally starts clinical calculator inputs blank and does not auto-fill or persist values. That safety behaviour is retained.

The exported pages also include remote Tailwind CDN usage, remote Google font references, remote image assets and prototype-only JavaScript handlers. These were not copied into the application. Existing locally bundled styles/assets and production workflows remain the source of truth.

No external destination, phone link, WhatsApp route, QR/payment destination, API, database, authentication flow or provider configuration was replaced by the Stitch prototype.

## Code changes in this experiment

- Added `stitch-clinical-design.css`, loaded after the existing stylesheets.
- CSS is enclosed in screen media rules. Existing print/PDF document rules are not intentionally overridden.
- Reordered and renamed the Patient Portal tab labels without changing tab IDs, panel IDs or destinations.
- Added regression assertions for navigation order, mobile visibility, design tokens, focus colour, emergency warning semantics and screen-only styling.
- Added the experiment branch to the regression workflow so this branch receives the full repository test suite.
- Refreshed the source-link inventory to include the new stylesheet. It currently records 88 scanned active source files and 221 unique extracted destinations; this is source inventory coverage, not live link verification.

## Safety and release boundaries

- This branch is separate from `main`, the protected baseline branch and the live deployment.
- No merge to `main`, production deployment, database migration, payment activation, provider-secret change or clinical-content publication is part of this experiment.
- Doctor Workstation remains protected by its existing `notranslate` safeguard; the global language selector remains available in the shared header. Machine translation must not silently alter clinical prescriptions or calculations.
- A successful build or automated test is not proof of actual phone rendering, live external-link reachability, payment settlement, WhatsApp recipient delivery, PDF printing or clinical validity.

## Current status

- [x] Export received and all four screens / design specification inspected.
- [x] Separate experiment branch created from the latest main source baseline.
- [x] First visual layer and requested navigation order implemented.
- [x] Calculator and statutory-form screen styling added without importing prototype data or formulas.
- [x] Calculator results update automatically after all active required inputs are complete; manual calculation remains available.
- [x] Regression tests added for the navigation and design layer.
- [x] Link inventory updated for the new stylesheet.
- [ ] Full exact-head regression suite: pending latest workflow run.
- [ ] Vercel branch preview: pending deployment status.
- [ ] Desktop and 320px / 390px mobile visual review: pending.
- [ ] Functional smoke tests for booking, language selector, library, calculators, prescription, requisitions, certificates, payment disclosures, QR and external links: pending.
- [ ] Owner review and explicit approval: required before any promotion or production release.

 
## Automatic calculator behaviour added after the first visual pass

The existing public and clinical calculator UI now recalculates when an input or select changes, once all currently active required fields are complete and valid. Incomplete fields show a completion prompt; invalid values continue to use the existing validation messages. The manual **Calculate now** action remains available. No formulas, units, source references, blank initial values, patient persistence or clinical interpretation were changed.
