# Lab Normal Reference Check Table — 700+ interval expansion plan

**Target:** at least 700 distinct numerical laboratory test/analyte entries, with age-, sex-, pregnancy-, specimen- and method-specific interval partitions wherever evidence supports them.  
**Clinical status:** decision-support comparator only; it does not diagnose or replace the performing laboratory's own interval.

## Current baseline
- The current comparator contains 27 source-attributed adult interval entries.
- CSV import currently loads extra local intervals for the active browser session; it is not yet a centrally maintained 700-entry database.
- A test without a compatible, source-verified interval must show “No validated interval available — use the performing laboratory's report range” and must not guess LOW / NORMAL / HIGH.

## Scientific rule: no single universal global reference interval
Reference intervals depend on reference population, age, sex, pregnancy/physiological state, specimen, analytical method, calibration/traceability, units and laboratory platform. IFCC C-RIDL is working on harmonization and transferability; it does not establish one universal interval for every assay and population. CLSI EP28 provides the framework for establishing, verifying and transferring quantitative laboratory reference intervals.

The performing laboratory's own assay-specific interval takes first precedence. An external interval is usable only when specimen, method/platform, units and demographic partition are compatible or a documented transfer/verification process supports it.

## Data-source hierarchy
1. Performing laboratory report / assay-specific local interval — highest precedence.
2. Indian population studies and Indian laboratory validation. Priority research source: Shah et al., IFCC C-RIDL Indian study (512 healthy Indian volunteers; 33 biochemical analytes; age/sex partitioning for selected analytes).
3. IFCC C-RIDL global/Asian studies and IFCC position statements — only for compatible methods and validated transfer.
4. CLSI EP28-aligned reference laboratory catalogues: Mayo Clinic Laboratories, ARUP, Labcorp, Stanford Medicine and other accredited laboratories. Capture the actual assay page and method.
5. Manufacturer instructions / kit inserts — only when method and analyser match and no better applicable source exists.
6. Peer-reviewed, population-specific literature — include cohort, date, method and limitations.

Do not bulk-copy LabQAR into the commercial website. Its 2026 paper reports 550 ranges across 363 unique tests, but the published article is under CC BY-NC-ND 4.0. It may be a research benchmark/discovery checklist, not a copied or adapted production range database without permission.

## Planned 750-test numerical coverage

| Domain | Target |
|---|---:|
| CBC, differential, reticulocytes, morphology indices and haematinics | 85 |
| General chemistry, electrolytes, minerals and osmolality | 90 |
| Renal function, urine chemistry and renal injury markers | 55 |
| Liver, biliary, pancreatic and muscle enzymes | 65 |
| Lipid, apolipoprotein and cardiometabolic markers | 55 |
| Diabetes, endocrine, thyroid, adrenal, pituitary and reproductive hormones | 105 |
| Coagulation, thrombosis and haemostasis | 55 |
| Cardiac, vascular and heart-failure biomarkers | 40 |
| Iron, vitamins, trace elements, nutrition and bone metabolism | 55 |
| Immunoglobulins, complement, autoimmunity and inflammatory markers | 65 |
| Urinalysis, CSF, body fluids and stool quantitative analytes | 45 |
| Therapeutic drug monitoring and toxicology | 35 |
| **Total target** | **750** |

The catalogue target is not a claim that every item has one numerical reference interval. Qualitative tests, clinical decision limits, screening cut-offs and critical thresholds are separate data types and must not be mislabeled as population reference intervals.

## Required record schema
Each interval partition must carry:
- Stable internal test ID; display name; aliases; LOINC code only where an exact mapping exists.
- Specimen/matrix; collection conditions (fasting/time of day); method principle; analyser/platform where known.
- UCUM-compatible unit; numeric lower/upper bounds; inclusive/exclusive semantics; result type and precision.
- Population/geography; age minimum/maximum; sex partition; pregnancy trimester / menstrual phase / neonatal or paediatric partition when applicable.
- Interval kind: reference interval, clinical decision limit, screening cutoff, or critical limit (never mix them).
- Source organisation/title/direct URL/publication or version date/retrieval date/exact page-table-section/assay method note/evidence licence.
- Review status: unreviewed, source checked, method compatible, physician verified, or retired.
- Reviewer and last-reviewed date; replacement/supersession link when a source is updated.

## Matching and classification
1. Searchable test picker; exact selection by canonical name, alias or LOINC. Do not silently auto-select an ambiguous fuzzy match.
2. Capture age, sex where relevant, pregnancy/physiological context, specimen, method if known, measured value and unit.
3. Match the most specific compatible interval. Never fall back from paediatric/pregnancy-specific testing to an adult range.
4. Prefer the report's own interval. A manual override must be labelled Report-specific interval and remain local unless explicitly saved as a reusable local laboratory profile.
5. Convert units only through analyte-specific, dimensionally validated conversion; never assume molecular weight.
6. Classify immediately as LOW, WITHIN SELECTED REFERENCE INTERVAL, or HIGH. Test exact lower/upper boundaries.
7. Show decision limits and critical thresholds separately; do not overwrite the reference interval.
8. If the interval is missing, incompatible, expired or unverified, show a warning and do not classify.

## Release phases
- Phase 1 — core 200: CBC/differential, electrolytes, renal/liver panels, glucose/HbA1c, lipids, thyroid, iron studies, coagulation, common cardiac markers and common urine chemistry.
- Phase 2 — specialist 250: extended endocrine/reproductive, autoimmune/immunology, complement, cardiac, inflammatory, vitamins/trace elements, pancreatic, muscle, therapeutic drug monitoring and toxicology.
- Phase 3 — advanced 300: specialty haematology, coagulation factors, tumour markers, infectious disease quantitative markers, body-fluid/CSF analytes, paediatric/neonatal, pregnancy/menstrual-cycle partitions and uncommon send-out assays.

## Quality assurance gates
- No interval without direct source, method, specimen and unit metadata.
- Two-person review for high-risk or highly partitioned intervals; physician sign-off before production status.
- Duplicate/alias/LOINC collision checks.
- Boundary tests: exact lower/upper, just below and just above.
- Age/sex/pregnancy/specimen/method mismatch tests and explicit no-validated-interval behaviour.
- Unit-conversion and numeric plausibility tests.
- Automated regression test for every data release; versioned dataset and change log.
- Patient values remain browser-local by default. Patient reports are never uploaded to the reference catalogue.

## Primary references
- CLSI EP28, Defining, Establishing, and Verifying Reference Intervals: https://clsi.org/shop/standards/ep28/
- IFCC C-RIDL, Reference Intervals and Decision Limits: https://ifcc.org/ifcc-scientific-division/sd-committees/c-ridl/
- Shah SAV et al. Indian C-RIDL study, Clin Chem Lab Med. 2018;56(12):2093–2103. DOI: 10.1515/cclm-2018-0152. https://doi.org/10.1515/cclm-2018-0152
- Mayo Clinic Laboratories Test Catalog: https://www.mayocliniclabs.com/test-catalog
- ARUP Consult: https://arupconsult.com/
- Labcorp Test Menu: https://www.labcorp.com/test-menu/search
- LabQAR paper (benchmark only; do not copy/adapt its NC-ND dataset into the commercial product): https://www.nature.com/articles/s41597-026-07554-z

**Release principle:** 700 correctly sourced and appropriately partitioned intervals are more valuable than 700 plausible-looking but method-incompatible numbers. Always report the exact count of physician-verified, method-compatible intervals.
