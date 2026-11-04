# Patient-first facility contract — 4 November 2026

## Priority and information architecture
The first public tasks are requesting a home visit and reading reliable guidance. Keep Overview as the landing page with its booking CTA, followed in navigation by Booking and Health Library. Retain Elderly care, article search, tools and FAQ, all existing destinations, and the two existing top-level workspaces. Do not add a duplicate dashboard or extra actions merely to make the page look complete.

## A facility is complete only when the whole journey works
| Journey | Entry and inputs | Required outcome | Failure and recovery | Acceptance evidence still needed |
| --- | --- | --- | --- | --- |
| Home visit request | Hero or Booking tab; readable, labelled intake | Review and explicit chosen dispatch; distinguish request from confirmed appointment | Missing/invalid fields explained inline; preserve entered answers; retry/cancel | Fee combinations, optional attachments, consent, review and native handoff |
| Health guidance | Library immediately after Booking; topic or search | Read complete guide; return to originating context; download/share same content | No-match message, unavailable PDF recovery, unchanged independent section language | Five remaining physical guide downloads; mobile reading and device share |
| Article search | Existing search destination | Relevant published results or honest empty state | Network error distinguishable from zero results; retry | Resolve built-in-guide vs published-article discovery mismatch |
| Tools | Existing labelled tools tab | Result with units, explanation and clear/reset | Invalid/zero input rejected; previous error cleared after correction | Reverse conversion directions and mobile use |
| Clinical documents | Owner-authenticated Workstation | Common prepare/review/save/share/print path with complete A4 output | Renderer failure/retry, cancellation, safe access boundaries | Legitimate owner login, actual PDFs and cloud/device acceptance |

## Presentation rules
Use text labels with supplementary icons; do not rely on icons or colour alone. Primary actions have a consistent visual role. Navigation controls use a 44px project target; wrap in document order rather than hide destinations off-screen. Mobile navigation uses two columns. Keep body text readable, line lengths bounded, labels near inputs, error messages near the cause, and all state changes perceivable. Exact spacing and breakpoint adequacy require visual viewport checks, not CSS-source assertions.

## Current evidence
Implemented the first bounded hierarchy adjustment: Overview, Booking, Library, Elderly care, Search, Tools, FAQ. Hero order: visit, library, online consultation. No destination removed. Updated keyboard navigation regression for actual DOM order. Source preservation and navigation tests pass; actual desktop/mobile layout remains unverified. This contract is an acceptance plan, not a claim that all journeys are complete.
