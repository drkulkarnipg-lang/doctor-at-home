# Clinical Calculator Library — Phase 1 implementation plan

**Project:** Home Visiting ICU Doctor  
**Status:** Development plan; not a clinical release or deployment approval  
**Prepared:** 2 November 2026  
**Clinical owner/reviewer:** Dr. Pramod G. Kulkarni (review pending)  
**Applicability:** India-first; local laboratory intervals and institutional protocols must be configured where relevant.

## 1. Existing implementation discovered

The current `main` branch already contains a 30-tool clinical calculator engine in `clinical-calculators.js`, with a companion regression suite and an unpublished `CALCULATOR_AUDIT.md`.

The existing audit reports 935 assertions across the 30 tools. It describes this as a source/implementation review, not regulatory certification or prospective clinical validation. The current audit also states that BMI and HbA1c/eAG are public-facing, while the other 28 tools are inside Doctor Workstation. Do not describe the entire library as newly built or fully clinically validated.

The current 30 include BMI, MAP, prescribed fluid allowance, Cockcroft–Gault CrCl, HbA1c/eAG, GCS, individual nutrition arithmetic, IV drip rate, adult burn-fluid estimate, albumin-adjusted calcium, CURB-65, anion gap, oxygen cylinder time, qSOFA, P/F ratio, glucose-adjusted sodium, FENa, maintenance fluid methods, steroid equivalence, Wells DVT/PE, CHA₂DS₂-VASc/VA, HAS-BLED, prescribed insulin correction arithmetic, Norton score, shock index, heart-rate reserve, MELD 3.0, Child–Pugh and APACHE II.

## 2. Phase 1 objective

Create a coherent, searchable Clinical Calculator Library with transparent formulae, explicit population/units, validated input boundaries, interpretation caveats, source links, test fixtures, and clinical review metadata. Preserve the existing calculator API and all current site features.

### Priority additions / gaps to close

| Priority | Calculator / capability | Proposed method | Important boundary |
|---|---|---|---|
| P0 | Adult eGFR | 2021 CKD-EPI creatinine equation, race-free; optional combined creatinine–cystatin C only after a separate review | Adults ≥18; IDMS-standardised creatinine; not validated as an India-specific measured-GFR substitute; not for rapidly changing creatinine/AKI |
| P0 | Body surface area | Mosteller: √[(height cm × weight kg)/3600] | Formula estimate; document limitations at extreme body size |
| P0 | Ideal/reference body weight | Clearly labelled formula options, not one universal “ideal” weight | Never present as a nutrition prescription or drug-dosing weight without context |
| P1 | UACR | Albumin-to-creatinine ratio with unit conversion and KDIGO A1/A2/A3 categories | Requires compatible units and urine specimen context; repeat confirmation and transient causes matter |
| P1 | MAP / pulse pressure | Existing MAP plus pulse pressure and orthostatic measurement record | Orthostatic diagnosis needs protocol, posture and timing; calculator must not label a single reading as diagnosis |
| P1 | Corrected calcium | Keep current traditional estimate clearly labelled; add unit-safe SI conversion only if separately verified | Ionised calcium is preferred when correction is unreliable, especially critical illness/CKD |
| P2 | NEWS2 | Official RCP scoring chart, including oxygen scale selection and supplemental oxygen | Clinical use only; score does not replace assessment or escalation protocol |
| P2 | SOFA | Component-wise organ dysfunction score | Requires all component definitions, oxygenation/ventilation context, baseline assumptions and missing-data handling |
| P2 | Geriatric / palliative tools | CFS, ADL/IADL, MNA-SF, ESAS-r and PPS | Tool licensing/permissions, validated translations and population-specific instructions must be checked before implementation |

## 3. Clinical validation contract — required for every calculator

Each tool must display and retain:

1. Name, version, intended population, exclusions and clinical purpose.
2. Formula, coefficient, units and supported input ranges.
3. Required versus optional inputs; missing data must never silently become “normal” or “absent”.
4. Boundary-value tests, known-answer fixtures, invalid/non-finite input tests and unit-conversion tests.
5. Interpretation categories and their source; distinguish reference intervals, diagnostic thresholds, prognostic scores and treatment targets.
6. Primary source(s), access/review date and version of guideline/equation.
7. Reviewer name/role, review status, revision date and next review due date.
8. Safety statement: output is decision support only; no autonomous diagnosis, prescription, dosing, admission/discharge or emergency triage.

## 4. India-first applicability rules

- Do not assume a US/European reference interval is an Indian reference interval. State the source population and require local laboratory interval where assay-specific.
- Use SI units by default where practical (µmol/L, mmol/L, kg, cm); offer conventional units with explicit conversion.
- For eGFR, use a race-free equation; state the assay-standardisation requirement and the limitations of applying an equation developed outside India.
- Do not encode ethnicity/race coefficients.
- Do not infer a medicine dose from eGFR or CrCl; drug-specific dosing requires the current product label and an authorised prescriber.
- Provide English and Marathi first. Other translations must be reviewed for clinical meaning before being marked approved.
- No patient values are stored, shared or linked to the Passport until explicit consent, access controls, audit, retention and export behaviour are implemented and reviewed.

## 5. Test and release gates

- Pure calculation unit tests with independently sourced expected values.
- Threshold/boundary and unit-conversion tests.
- DOM tests for search, mobile layout, input changes invalidating stale output, clear/reset and accessible labels.
- Manual clinical review by the named clinical owner before a tool is labelled “reviewed”.
- Security review before patient-specific persistence.
- Preview verification on desktop and mobile.
- Merge and production deployment remain separate approvals. No calculator changes in this branch authorise automatic production deployment.

## 6. Evidence consulted for the eGFR P0 specification

- NIDDK adult GFR equations: https://www.niddk.nih.gov/research-funding/research-programs/kidney-clinical-research-epidemiology/laboratory/glomerular-filtration-rate-equations/adults
- National Kidney Foundation 2021 CKD-EPI creatinine equation: https://www.kidney.org/professionals/ckd-epi-creatinine-equation-2021
- NIDDK adult eGFR clinical tool and limitations: https://www.niddk.nih.gov/health-information/professionals/clinical-tools-patient-management/kidney-disease/laboratory-evaluation/estimated-gfr-calculators/adults-pediatrics

**Evidence note:** NIDDK describes the 2021 CKD-EPI creatinine equation as an adult, race-free equation using age, sex and IDMS-standardised serum creatinine. NIDDK also cautions that eGFR is an estimate, becomes less accurate at higher GFR, and that combined creatinine–cystatin C can improve accuracy in selected decision-critical contexts. These are equation-level facts, not proof of India-specific calibration.

## 7. Current release status

This branch is a planning and governance checkpoint. It does not change `main`, the protected baseline branch, the live website, Supabase patient records, or production deployment. Phase 1 coding starts only on this isolated branch after the existing calculator UI/test integration points are mapped.
