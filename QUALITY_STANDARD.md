# Website quality standard and release gates

Applies to drkulkarnipg.com. Owner requirement: preserve every existing feature, page, URL and link while improving patient value and professional quality. Large websites are quality references, not evidence of this site's compliance. No universal claim that every protocol, all WCAG criteria or zero defects is satisfied.

## Measurable engineering targets

| Area | Target / release evidence | Current evidence / remaining work |
| --- | --- | --- |
| Accessibility | WCAG 2.2 AA target; keyboard navigation, visible/non-obscured focus, labels, understandable validation, contrast and responsive reflow. Primary actions aim for 44px or more. | Selected navigation/labels/contrast checked in PR144. Full WCAG audit, assistive-technology and actual narrow viewport/device tests open. |
| Performance | Core Web Vitals good thresholds at the 75th percentile: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1, assessed on both mobile and desktop real-user traffic. | No field data or verified Lighthouse score. PERF-20261104 moves the 946,030-byte PDF renderer off initial page execution/loading, pending live resource-timing confirmation. File size is not a speed score. |
| Functionality | Inventory every existing route, action and resource; regression checks; test success/failure/retry paths; do not remove functionality to make checks pass. | PR144 preservation baseline retains 522 IDs, 304 link/action occurrences, 282 tracked paths. Automated checks do not prove every workflow. |
| Clinical content | Verify professional facts and sources; clinician review before clinical publication; no invented diagnoses, dosing, credentials, endorsements or reviews. | Conflicting 31/29/15/16 experience chronology needs clarification. No new medical claims introduced by this batch. |
| Documents | Preserve A4, complete long content, readable writing area, patient/clinician identity, units, date, allergy information and clear output errors. Verify synthetic examples and actual files. | Existing software checks retained. Full owner-authenticated PDF/print/device verification open; no legal/regulatory compliance certification. |
| Privacy/access | Keep owner authentication, patient separation and explicit sharing; never place real patient data/secrets in source, QA or public screenshots. | No protection weakening or patient uploads in this work. Formal security review, live backend configuration and data-protection assessment remain separate. |
| Release | Separate branch, exact source, passing checks, appropriate browser verification, rollback baseline, production commit/alias confirmation and honest limitations. | PR144 released with desktop browser checks. Authentication/device limitations recorded. Every deployment failure must be reported explicitly. |

## Current next item

PERF-20261104: retain the existing PDF engine URL as a non-executing source descriptor; download/execute on demand through one same-origin loader. Share concurrent requests, retry after network failure/timeout, keep Print / Save as PDF fallback and retain prebuilt guide PDFs without loading the renderer. Resolve the existing `logo.png` request with a byte-identical copy of the approved logo, preserving all image URLs and fallback logic. No image redesign or invented branding.

## Primary references

- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- W3C explanation of new WCAG 2.2 requirements: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- Core Web Vitals thresholds and field assessment: https://web.dev/articles/vitals
- OWASP ASVS (future security-review reference, not certification): https://owasp.org/www-project-application-security-verification-standard/

Statuses must distinguish source checks, browser checks, field metrics, clinician approval and formal certification. Do not advertise Amazon/Google/MSD/ChatGPT-equivalent quality as verified without relevant evidence.
