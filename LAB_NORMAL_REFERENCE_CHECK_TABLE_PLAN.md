# Lab Normal Reference Check Table — 700+ interval expansion plan

**Target:** at least 700 distinct numerical laboratory test/analyte entries, with age-, sex-, pregnancy-, specimen- and method-specific interval partitions wherever evidence supports them.  
**Clinical status:** decision-support comparator only; it does not diagnose or replace the performing laboratory's own interval.

## Current baseline
- The current comparator contains 105 source-attributed adult records (50 Mayo source-linked records + 55 Indian IFCC C-RIDL study partitions). This includes both reference intervals and explicitly typed decision limits; records are not all locally method-validated.
- The former ungoverned session-only CSV importer has been removed. Evidence-complete CSV imports now enter a pending review queue; a clinician reviews each row before it is added to the local workstation catalogue. Reviewed catalogue metadata persist in browser localStorage and can be exported as JSON. This is still not a centrally maintained 700-entry database.
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


## Implementation checkpoint — 2 November 2026

- Added `lab-reference-governance.js`, loaded after `clinical-calculators.js` in the Doctor Workstation. It adds a dedicated searchable picker and explicit dropdown, result-unit confirmation, pregnancy guard for adult female comparisons, source/evidence display, and age/sex-specific record matching.
- The active comparator distinguishes population reference intervals from clinical decision limits (for example, eGFR threshold); it does not call a decision threshold a normal range. It does not silently convert units. Missing or incompatible partitions do not fall back to a guessed range.
- Existing local report interval override remains available and is clearly labelled as the performing-laboratory interval.
- CSV evidence import now requires HTTPS source URL, specimen, method, population, age bounds, sex partition and range type. Imports are staged as pending; individual clinician approval is required before they become selectable. Approved catalogue metadata are stored locally on the workstation, with JSON export. Patient results are not stored or uploaded.
- Removed the previous CSV import path that immediately activated arbitrary rows without complete provenance.
- After the next evidence batch, the built-in seed contains 105 source-linked adult records (50 Mayo catalogue records + 55 Indian IFCC C-RIDL partitions). These are source-attributed but not all locally method/population verified. No artificial values were added to inflate the count. Target remains 750 distinct evidence-backed records.
- Added `tests/lab-reference-governance.test.cjs` and `npm run test:lab-reference`. Helper-level syntax and validation/classification checks passed in the development runtime; exact-head CI, browser interaction, desktop/mobile visual inspection and production deployment remain open.
- Official sources researched: CLSI EP28/EP28IG, IFCC C-RIDL, Shah et al. Indian C-RIDL 33-analyte study, Mayo Clinic Laboratories test catalogue, MedlinePlus and NABL/ISO 15189. Source and licensing restrictions are recorded in this plan.


### Seed expansion — 2 November 2026

Three additional adult absolute differential-count entries were added from the Mayo Clinic Laboratories CBC with Differential test page (Test ID CBC): absolute monocytes 0.26–0.81 ×10⁹/L, eosinophils 0.03–0.48 ×10⁹/L and basophils 0.01–0.08 ×10⁹/L. Source page specifies EDTA whole blood and the CBC analytical method. These are source-specific comparator intervals, not universal Indian laboratory limits. Direct source: https://www.mayocliniclabs.com/test-catalog/Overview/9109. The active seed at this checkpoint was 85 entries; this historical checkpoint is superseded by the later 105-record batch below. The 750 target remains open.


### Indian population-specific seed batch — 2 November 2026

Added ten Indian IFCC C-RIDL adult serum records from Table 4 of Shah et al. (2018): sodium, potassium, chloride, total calcium, inorganic phosphate, magnesium, total protein, LDL-C, and fasting glucose partitioned into ages 18–44 and 45–65. The study recruited 512 healthy Indian volunteers, collected fasting serum after 10–12 hours, and used Beckman Coulter Unicel DxC 800 / Immage 800 platforms. The table reports the intervals as population-specific; method transfer to a local Pune laboratory has not been validated. Where the same test now has both Mayo-derived and Indian-study intervals, the new source/method dropdown requires an explicit selection instead of silently choosing one. The live seed at this historical checkpoint was 40 records (30 prior Mayo/source-linked records plus 10 initial Indian C-RIDL records); this was later expanded to 85 and then 105. The 750 target remains open.


### Additional comparator safety gate — 2 November 2026

- External intervals now require an explicit clinician attestation that source, specimen, assay/method and patient population are applicable. If uncertain, use the performing laboratory's own report interval instead.
- Both Indian fasting-glucose age partitions require explicit confirmation of an 8–12 hour fast. The study's serum collection conditions are shown in the evidence panel. The tool does not infer fasting status.
- Source/method partition dropdown prevents automatic selection when multiple same-name ranges from different catalogues/populations match. The exact age/sex-compatible record is selected only when unambiguous.
- Result units must exactly match the chosen interval; no automatic conversion is performed. Pregnancy/recent pregnancy is excluded from the adult non-pregnant comparator.


### Full Indian C-RIDL Table 4 expansion — 2 November 2026

A further 45 sex-/age-partitioned records were transcribed from Table 4 of the same Indian IFCC C-RIDL study, completing all 33 biochemical analytes reported in that study. Added records cover albumin, total cholesterol, HDL-C, triglycerides, creatinine, urea, uric acid, AST, ALT, LDH, ALP, GGT, CK, amylase, total bilirubin, iron, transferrin, hsCRP, IgG, IgA, IgM, C3, C4 and transthyretin. The matching engine uses explicit age/sex partitions and the source/method dropdown to prevent ambiguous silent selection. Current seed before the next batch: 85 records (30 Mayo/source-linked + 55 Indian-study partitions). The next batch below adds 20 distinct source-specific Mayo adult records. These remain source-specific; the study's analyser/platform is not equivalent to every local laboratory, and local method transfer is still pending. Automated data/partition regression now passes 467 assertions in the development runtime.

- Source/method applicability attestation is reset whenever the test, source/method partition, age, sex or pregnancy status changes; it cannot carry over from a prior result. Lab form controls and catalogue buttons use a tinted teal/sage panel rather than a plain-white surface, with ≥44 px touch targets and visible keyboard-focus styles.


### Mayo adult OPD/ICU evidence batch — 2 November 2026

Added 20 distinct source-specific adult catalogue records, bringing the built-in seed from 85 to **105** (50 Mayo source-linked records + 55 Indian IFCC C-RIDL partitions). The batch covers three ferritin sex/age partitions (male ≥18; female 18–50; female ≥51), free T4, TSH, total T3, total T4, vitamin B12, plasma lactate, total amylase, LDH, lipase, PT, INR, aPTT, functional fibrinogen (Clauss), intact PTH, procalcitonin and sex-specific high-sensitivity troponin I upper-reference/decision limits.

Primary source catalogue pages and method/specimen capture:
- Ferritin (FERR1): serum, electrochemiluminescence immunoassay; male ≥18 years 31–409 mcg/L, female 18–50 years 6–175 mcg/L, female ≥51 years 11–328 mcg/L. https://www.mayocliniclabs.com/test-catalog/overview/619953
- Free T4 (FRT4): serum, electrochemiluminescence immunoassay; adult ≥20 years 0.9–1.7 ng/dL. https://www.mayocliniclabs.com/test-catalog/Overview/8725
- TSH (STSH): serum, electrochemiluminescent immunoassay; adult ≥20 years 0.3–4.2 mIU/L. The catalogue cautions that serious acute illness can cause transient TSH changes. https://www.mayocliniclabs.com/test-catalog/Overview/8939
- Total T3 (T3): serum, electrochemiluminescence immunoassay; adult ≥20 years 80–200 ng/dL. https://www.mayocliniclabs.com/test-catalog/Overview/800093
- Total T4 (T4): serum, electrochemiluminescence immunoassay; adult ≥20 years 4.5–11.7 mcg/dL. Total T4 is affected by binding proteins and pregnancy; it is not a sole thyroid marker in those settings. https://www.mayocliniclabs.com/test-catalog/overview/8724
- Vitamin B12 (B12): serum, immunoenzymatic assay; 180–914 ng/L. The source page presents one interval without age/sex partitions; the UI limits this record to adult use and excludes under-18 interpretation. Recent B12 injection can invalidate deficiency interpretation. https://www.mayocliniclabs.com/test-catalog/Overview/9154
- Lactate (LACS1): plasma NaFl-KOx, colorimetric; adult ≥18 years 0.5–2.0 mmol/L. Source handling requirements are important; D-lactate is not measured by this assay. https://www.mayocliniclabs.com/test-catalog/overview/601685
- Total amylase (AMS): serum, colorimetric; adult ≥18 years 28–100 U/L. https://www.mayocliniclabs.com/test-catalog/Overview/800003
- LDH (LD): serum, photometric; adult ≥18 years 122–222 U/L. https://www.mayocliniclabs.com/test-catalog/Overview/800058
- Lipase (LPS): serum, colorimetric rate reaction; 13–60 U/L. The source page provides a single interval without age/sex bands; the comparator is adult-only and local assay range takes precedence. https://www.mayocliniclabs.com/test-catalog/Overview/8328
- PT and INR (PTTP): platelet-poor citrated plasma, coagulometric/turbidimetric clot detection; PT 9.4–12.5 seconds and INR 0.9–1.1. Warfarin therapeutic targets (2.0–3.0 or 2.5–3.5) are treatment targets, not normal reference intervals, and are not included. https://www.mayocliniclabs.com/test-catalog/Overview/40934
- aPTT (APTTP): platelet-poor citrated plasma, coagulometric/turbidimetric clot detection with SynthASil; 25–37 seconds. Double centrifugation and anticoagulant exposure affect interpretation. https://www.mayocliniclabs.com/test-catalog/Overview/40935
- Fibrinogen (CLFIB): plasma, Clauss functional clotting assay on ACL TOP; male and female adult values 200–500 mg/dL (one shared record because the source interval is identical). Source identifies this as profile/reflex-only rather than independently orderable; fibrinogen is an acute-phase reactant. https://www.mayocliniclabs.com/test-catalog/overview/602173
- Intact PTH (PTH2): serum, electrochemiluminescence; adult ≥18 years 15–65 pg/mL. Fasting 12 hours is preferred but not required; biotin-containing supplements should be avoided for 12 hours. https://www.mayocliniclabs.com/test-catalog/overview/28379
- Procalcitonin (PRCAL): serum, electrochemiluminescence; source catalogue value 0.00–0.24 ng/mL. The source does not provide age/sex partitions on this page; the UI record is adult-only and explicitly not a stand-alone sepsis rule-out. https://www.mayocliniclabs.com/test-catalog/overview/40947
- High-sensitivity troponin I (HSTNI): lithium-heparin plasma, electrochemiluminescence immunoassay; adult male ≤20 ng/L and female ≤15 ng/L. These sex-specific upper reference limits are represented as decision-limit records, not two-sided normal ranges; they are not a stand-alone MI diagnosis or rule-out pathway and require assay-specific serial/delta interpretation. https://www.mayocliniclabs.com/test-catalog/Overview/614422

The batch does not claim local Pune method transfer or universal Indian/global applicability. The performing laboratory's own validated interval takes precedence. The adult comparator continues to block paediatric and pregnancy/recent-pregnancy use. Exact batch regression now asserts all 20 IDs, values, units, source URLs, specimens, methods, age/sex partitions, interval types, inclusive lower/upper boundaries, out-of-range boundaries and sex-specific matching. Exact-head GitHub Actions result is pending; development-runtime execution is not claimed until run.

