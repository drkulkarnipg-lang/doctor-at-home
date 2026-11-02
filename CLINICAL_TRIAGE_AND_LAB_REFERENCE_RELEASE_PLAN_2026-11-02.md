# Lab Normal Reference Check Table & Clinical Triage — Implementation Plan
**Date:** 2 November 2026  
**Status:** Engineering roadmap; clinical governance and local-laboratory verification remain mandatory.

## 1. Clinical objective

Build two clinician-facing decision-support tools inside Doctor Workstation:

1. **Lab Normal Reference Check Table** — searchable test catalogue with immediate comparison of an entered result against an explicitly sourced, population-/method-/age-/sex-/pregnancy-appropriate reference interval or clinical decision limit.
2. **Home Visit Clinical Triage** — structured bedside assessment with mandatory observations, validated early-warning score, danger-sign overrides, explicit general-condition (GC) assessment, and documented clinician disposition.

Neither tool independently diagnoses disease, rules out serious illness, prescribes treatment, or certifies a patient as safe for home care.

## 2. Lab Normal Reference Check Table

### Current baseline

- Main currently contains **111 source-attributed adult records** in the governed reference catalogue.
- The existing searchable comparator already partitions supported records and blocks unsupported paediatric and pregnancy/recent-pregnancy transfers.
- Existing tests cover source metadata, interval boundaries, matching safeguards and instant search.
- The existing programme target is **750 distinct entries**. The minimum acceptance target is **700 distinct, non-duplicated test/analyte-method-partition records**.
- Six Reticulocyte Profile records were added in the 111-record baseline. These are records/partitions, not necessarily 111 unique analytes.

### User-facing workflow

1. Search by common test name, abbreviation, analyte or panel (e.g. Hb, CBC, creatinine, sodium, TSH, troponin).
2. Select the exact test, specimen and method/assay where relevant.
3. Display the source interval, units, population, age/sex partition, pregnancy scope, specimen, method, source laboratory/guideline, publication/catalogue date and last verification date **before** result entry.
4. User enters a numeric value and unit. Convert units only where conversion is dimensionally valid and unambiguous.
5. Immediately show one of:
   - **Below reference interval**
   - **Within reference interval**
   - **Above reference interval**
   - **Critical/decision-limit alert** only when a source explicitly defines that limit and the matching assay/population is valid
   - **Cannot classify — use performing laboratory interval / unsupported population / incomplete metadata**
6. Show exact lower/upper limits and explain that a result inside the interval does not exclude disease and an outside result does not establish a diagnosis.
7. Allow the clinician to enter the performing laboratory's printed interval and select it as the primary comparator. Preserve the imported/source comparator as secondary context.

### Evidence and governance rules

- Do not claim a single universal “normal range for the whole world”. IFCC C-RIDL documents biological variation by geography, age, sex, BMI and other factors and explicitly works on transferability of reference intervals and decision limits.
- **The performing laboratory's validated, current, assay-specific interval takes precedence** for patient interpretation.
- Keep reference intervals distinct from clinical decision limits, therapeutic targets, alert thresholds and critical values. Never label a troponin decision limit, INR treatment target, HbA1c diagnostic threshold or similar as a normal interval.
- Every record must carry: stable ID, analyte/test name, synonyms, panel, specimen, method/platform, units, lower/upper or one-sided limit, interval type, age range, sex applicability, pregnancy/postpartum scope, fasting/collection conditions, source URL, source title/organisation, source publication/catalogue date, access/verification date, jurisdiction/population, caveats, evidence status, reviewer and review date.
- No invented values, extrapolated partitions, copied proprietary database dump, or undocumented AI-generated intervals.
- A missing source, uncertain method match, unknown sex/age applicability, pregnancy mismatch, paediatric mismatch or unit mismatch must return **cannot classify**, never a guessed normal/abnormal result.
- Keep source snapshots / provenance and a change log. Re-check source pages and version changes periodically.

### 700-record acquisition strategy

Build in verified batches; count unique records only after deduplication by analyte + specimen + method + unit + population partition + interval type.

1. **Core chemistry and renal/metabolic:** electrolytes, urea, creatinine, eGFR context, glucose, calcium, phosphate, magnesium, urate, osmolality, bicarbonate, anion-gap context.
2. **Liver/protein/lipid:** AST, ALT, ALP, GGT, bilirubin fractions, albumin, total protein, globulins, lipid fractions, ApoB/Lp(a) where sourced.
3. **Haematology:** CBC indices, differential absolute counts, reticulocyte parameters, ESR and haemostasis profile with method/specimen.
4. **Endocrine:** thyroid, adrenal, pituitary, reproductive hormones with cycle/age/pregnancy caveats.
5. **Iron/nutrition/vitamins:** ferritin, iron/TIBC/transferrin saturation, B12, folate, vitamin D and other adequately sourced markers.
6. **Inflammation/infection/cardiac:** CRP, procalcitonin, lactate, troponin, BNP/NT-proBNP, CK/CK-MB and pathogen-specific tests; decision limits kept separate from reference intervals.
7. **Urine/body fluids:** urinalysis, urine albumin/creatinine, CSF/pleural/ascitic/synovial fluid values only with explicit specimen and method.
8. **Specialty/critical care:** blood gas, co-oximetry, osmolality, toxicology/therapeutic drug levels, coagulation and immunology where authoritative assay-specific sources exist.

Prioritise tests commonly ordered in Indian outpatient, emergency, home-visit and ICU practice. Do not pad the count with duplicate synonyms or multiple identical records. A distinct sex/age partition is a separate record only when the source genuinely defines it.

### Release gates

- Minimum 700 accepted records; aspirational 750.
- 100% provenance completeness for every active comparator record.
- Automated tests for lower/upper inclusive boundaries, just-outside values, unit conversion, age/sex/pregnancy matching, specimen/method mismatch, one-sided decision limits, missing data and duplicate rejection.
- Independent clinical-pathology review of each batch and local Pune laboratory transfer review before the record is promoted from “source comparator” to “locally verified”.
- UI clearly identifies evidence status: **Source-attributed — not locally verified**, **Locally verified**, **Decision limit**, **Pending review**, or **Retired**.

## 3. Home Visit Clinical Triage

### Existing baseline

The repository already contains `triage-assessment.js`, a clinician-led adult home-visit assessment with:
- NEWS2 scoring from respiratory rate, SpO₂ Scale 1, systolic BP, pulse, consciousness, temperature and supplemental oxygen;
- separate GCS component capture;
- WHO danger-sign overrides;
- infection/fever duration, weakness, intake, urine output, respiratory/cardiac/neurological symptoms, frailty, immunosuppression, pregnancy, caregiver and follow-up checklist;
- documented doctor decision, home-care rationale, treatment/monitoring, reassessment and return precautions;
- incomplete-data blocking and no automatic home clearance.

The existing module is not a new autonomous APACHE calculator. APACHE II is an ICU severity/prognostic score using the worst physiology during the first 24 hours plus age/chronic-health points; it is not an outpatient home-disposition score.

### Planned clinical refinement

A. **Immediate danger screen before any aggregate score**
- Airway obstruction/stridor, severe respiratory distress, cyanosis, severe hypoxaemia, shock/perfusion failure, new focal neurological deficit/stroke, seizure, unresponsiveness/new altered mental state, major bleeding, acute coronary syndrome concern, anaphylaxis, severe hypoglycaemia, rapidly progressive non-blanching rash.
- Any positive danger sign blocks a green/home-suitable result and triggers emergency assessment/transfer workflow.
- Provide explicit emergency escalation and handover fields; local emergency access (India 112/ambulance) should be configurable and clinically reviewed.

B. **Structured ABCDE and general condition (GC)**
- General appearance: well / ill / toxic / critically ill; ability to speak, posture, interaction, distress.
- Airway patency and protective reflex concern.
- Breathing: RR, SpO₂, oxygen/device/flow, work of breathing, auscultation, ability to speak.
- Circulation: HR, BP, pulse volume, capillary refill, skin temperature/colour, peripheral perfusion, hydration, urine output.
- Disability: AVPU, GCS E/V/M separately, pupils, focal deficit, glucose, delirium/new confusion.
- Exposure: temperature, rash, bleeding, oedema, injury, hydration/nutrition and relevant examination.
- Baseline observations and chronic oxygen/BP/neurological status must be recorded to avoid misclassifying chronic abnormalities as acute change.

C. **Clinical context**
- Fever duration and documented maximum temperature; severe weakness/bedbound state; oral fluid and food intake; vomiting/diarrhoea; urine output; pain; comorbidities; medications; immunosuppression; frailty; pregnancy/postpartum; recent discharge/procedure; caregiver and transport/access to reassessment.
- Age-specific pathways are separate: adult NEWS2 must not be applied to children. Pregnancy requires obstetric-specific tools and thresholds.

D. **Scoring and output**
- Retain the validated NEWS2 algorithm and show each component score, total, single-parameter score of 3, oxygen status and measurement time.
- Use WHO Interagency Integrated Triage Tool (IITT) red/yellow/green acuity as a separate danger-sign/urgency layer.
- Use qSOFA only as an adjunct in suspected infection; a low qSOFA or NEWS2 must never rule out sepsis.
- Do not blend NEWS2, qSOFA, APACHE II, GCS or other scores into an invented composite score.
- Display a transparent disposition prompt: **Emergency now / Urgent hospital assessment / Same-day reassessment / Home treatment may be considered only after clinician review**.
- Home treatment is never auto-approved by a low score. It requires stable ABCDE, no danger signs, adequate intake/urine, acceptable baseline-adjusted observations, feasible treatment, reliable caregiver/access, documented review interval and explicit return precautions.
- The clinician must choose and sign the final disposition; allow override only with reason and record it.

### Clinical validation and acceptance tests

- Verify NEWS2 boundary cases against the RCP chart, including Scale 1 vs clinician-authorised Scale 2, supplemental oxygen, and single parameter score 3.
- Verify WHO IITT danger signs and escalation overrides.
- Test missing observations, invalid ranges, chronic baseline abnormalities, inability to assess, pregnancy, paediatric age, frailty, severe weakness, poor intake, oliguria, no caregiver and unreliable follow-up.
- Confirm GCS remains separate from NEWS2 and APACHE II.
- Conduct retrospective case-vignette testing with adult uncomplicated illness, pneumonia/sepsis, ACS, stroke, shock, hypoglycaemia, COPD/hypercapnia, frail elderly and immunosuppressed patients.
- Require clinician review of every case where the score and clinical impression disagree.
- No claim of prospective validation, diagnostic accuracy, or improved outcomes until formally studied.

## 4. Sources to maintain in the application

- RCP NEWS2 official resources: https://www.rcp.ac.uk/resources/national-early-warning-score-news-2/
- WHO Interagency Integrated Triage Tool: https://www.who.int/tools/triage
- ICMR antimicrobial guidance / qSOFA criteria: https://amrtg.icmr.org.in/chapter3-when-suspect.html
- IFCC C-RIDL reference intervals and decision limits: https://ifcc.org/ifcc-scientific-division/sd-committees/c-ridl/
- Indian IFCC C-RIDL study (33 biochemical analytes; 512 healthy Indian participants): https://pubmed.ncbi.nlm.nih.gov/30074895/
- IFCC global reference-value study, sources of variation: https://cms.ifcc.org/media/476753/ifcc-c-ridl_global-study-part-2.pdf
- EFLM/IFCC review recommendations for biological reference intervals: https://www.eflm.eu/files/efcc/CCLM%20Recommendation%20for%20the%20review%20of%20biological%20reference%20intervals.pdf
- NICE NG253 suspected sepsis: https://www.nice.org.uk/guidance/ng253

## 5. Delivery sequence

1. Audit current data schema, current 111 records, duplicate logic, existing comparator and all existing triage UI/tests.
2. Correct any verified software defects without changing clinically approved values silently.
3. Add data ingestion and provenance validation for curated source batches.
4. Expand in batches to 700+ genuinely distinct, fully sourced entries.
5. Strengthen triage danger-screen/ABCDE/GC and disposition tests.
6. Conduct clinician + laboratory governance review.
7. Run full repository regression, mobile/desktop accessibility and security tests.
8. Release only after CI passes and exact Production deployment SHA is independently verified.

**Release rule:** A green test suite establishes software behaviour, not clinical validity. A published source interval is not automatically valid for every Indian laboratory. The clinician and performing laboratory retain responsibility for interpretation and local verification.
