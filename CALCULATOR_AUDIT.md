# Calculator audit — unpublished review draft

Reviewed 23 October 2026. This is an implementation and source review, not regulatory certification or prospective clinical validation. No production deployment is authorised by this draft.

The 30 existing tool topics are retained. BMI and HbA1c/eAG remain public; the other 28 appear in Doctor Workstation. Its existing browser PIN is an interface convenience, not server-side authorisation. Values start blank, are never auto-filled from another tool and are not persisted.

## Findings and changes

| No. | Tool | Finding / correction | Reference |
|---|---|---|---|
| 1 | BMI & reference weight | BMI mathematics retained; misleading ideal-weight label replaced by explicit BMI-22 reference weight; adult age input added. | [Reference](https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html) |
| 2 | Mean arterial pressure | BP relationship validation added; fixed universal perfusion target removed. | [Reference](https://www.ncbi.nlm.nih.gov/books/NBK538226/) |
| 3 | Prescribed fluid allowance | Automatic HF/CKD restriction replaced by arithmetic against an individually prescribed allowance. | [Reference](https://www.nice.org.uk/guidance/cg174/chapter/recommendations) |
| 4 | Cockcroft–Gault creatinine clearance | Female coefficient restored; CrCl distinguished from indexed eGFR; dosing weight and units explicit. | [Reference](https://www.hiv.uw.edu/page/clinical-calculators/crcl) |
| 5 | HbA1c → estimated average glucose | ADAG formula retained; percent input and both output units explicit. | [Reference](https://professional.diabetes.org/glucose_calc) |
| 6 | Glasgow Coma Scale | All E/V/M responses restored; NT supported without a fabricated total. | [Reference](https://www.glasgowcomascale.org/) |
| 7 | Individual nutrition plan | Universal bedridden requirements replaced by clinician-selected energy/protein factors. | [Reference](https://www.nice.org.uk/guidance/cg32/chapter/Recommendations) |
| 8 | IV volume & drip rate | Giving-set drop factor required; pump and gravity rates distinguished. | [Reference](https://handbook.bcehs.ca/drug-monographs/medication-infusions/infusion-drip-rate-formula/) |
| 9 | Adult burn fluid estimate | Adult ≥20% TBSA scope; ABA 2 mL starting estimate and named classic 4 mL Parkland option distinguished. | [Reference](https://pubmed.ncbi.nlm.nih.gov/38051821/) |
| 10 | Albumin-adjusted total calcium | Traditional equation labelled as adjusted total calcium; no claim to measure ionised calcium. | [Reference](https://www.ncbi.nlm.nih.gov/books/NBK279037/) |
| 11 | CURB-65 | Urea in mmol/L; exact RR/age thresholds; BP uses SBP <90 OR DBP ≤60; no automatic ward/ICU result. | [Reference](https://www.nice.org.uk/guidance/ng250/chapter/Recommendations) |
| 12 | Serum anion gap | Raw and albumin-adjusted gap shown; lab reference and mixed-disorder limitations stated. | [Reference](https://member.thoracic.org/professionals/clinical-resources/critical-care/clinical-education/abgs.php) |
| 13 | Oxygen cylinder time estimate | Cylinder factor and reserve required; no assumed D cylinder or guaranteed oxygen duration. | [Reference](https://www.boconline.co.uk/en/images/BOC-Oxygen-Cylinders-Equiment-Guide_tcm410-682242.pdf) |
| 14 | qSOFA | Exact criteria retained; false low-risk reassurance removed; SSC 2026 limitation stated. | [Reference](https://www.sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-campaign-international-guidelines-for-management-of-sepsis-and-septic-shock-2026) |
| 15 | PaO₂ / FiO₂ ratio | FiO₂ percent enforced; exact 100/200/300 boundaries; ratio alone does not diagnose ARDS. | [Reference](https://pubmed.ncbi.nlm.nih.gov/22797452/) |
| 16 | Sodium adjusted for hyperglycaemia | Katz 1.6 coefficient explicitly named, units shown, glucose <100 rejected for this tool. | [Reference](https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/acute-complications-of-diabetes-mellitus) |
| 17 | Fractional excretion of sodium | Matching creatinine units required; binary prerenal/ATN diagnosis removed. | [Reference](https://academic.oup.com/jalm/article/6/5/1316/6272705) |
| 18 | Maintenance fluid methods | Adult prescribed method separated from paediatric hourly 4–2–1 and daily 100–50–20 methods. | [Reference](https://www.nice.org.uk/guidance/cg174/chapter/recommendations) |
| 19 | Glucocorticoid equivalence | Bidirectional approximate equivalence; no direct substitution/taper instruction. | [Reference](https://vimbook.vumc.org/endocrinology/steroid-conversion) |
| 20 | Two-level Wells DVT | Full nine positive DVT criteria and −2 alternative-diagnosis term implemented. | [Reference](https://www.nice.org.uk/guidance/ng158/chapter/recommendations) |
| 21 | Two-level Wells pulmonary embolism | Full seven PE criteria, fractional weights and strict >4 threshold implemented. | [Reference](https://www.nice.org.uk/guidance/ng158/chapter/recommendations) |
| 22 | AF stroke-risk scores | All VASc components restored; mutually exclusive age bands; VA also displayed; no automatic DOAC instruction. | [Reference](https://academic.oup.com/eurheartj/article/45/36/3314/7738779) |
| 23 | HAS-BLED | All nine components implemented; renal/liver and drugs/alcohol separately scored. | [Reference](https://academic.oup.com/view-large/367989236) |
| 24 | Prescribed insulin correction maths | Unconditional regular-insulin SC schedule removed; arithmetic requires an individual written plan, target, sensitivity and active insulin. Hypoglycaemia blocks calculation. | [Reference](https://diabetesteachingcenter.ucsf.edu/about-diabetes/type-2-diabetes/use-insulin-type-2-diabetes/calculating-insulin-dose) |
| 25 | Norton pressure-injury risk | All five Norton domains implemented; no air-mattress mandate. | [Reference](https://www26.ha.org.hk/Courseware/QEH_CND_PRE2/norton/norton1.asp) |
| 26 | Shock index | Formula retained with finite-input checks; no automatic occult-shock/normal diagnosis. | [Reference](https://handbook.bcehs.ca/clinical-resources/clinical-references-cards/lab-clinical-values/shock-index/) |
| 27 | Heart-rate reserve target | Intensity explicit; maximum-heart-rate estimate and context limitations stated. | [Reference](https://my.clevelandclinic.org/health/articles/24649-heart-rate-reserve) |
| 28 | MELD 3.0 — adult equation | Adult MELD 3.0 implemented with natural logs, interactions, bounds, dialysis handling and rounding; false ICU-transfer threshold removed. | [Reference](https://www.hrsa.gov/optn/data-calculators/allocation-calculators/meld-calculator) |
| 29 | Child–Turcotte–Pugh | All five domains and boundary rules implemented; standard bilirubin variant stated. | [Reference](https://www.hepatitisc.uw.edu/page/clinical-calculators/ctp) |
| 30 | APACHE II — complete score | All twelve physiology components plus age/chronic points implemented. Correct oxygen branch, creatinine doubling and mutually exclusive acid–base branch; no unsupported mortality percentage. | [Reference](https://pubmed.ncbi.nlm.nih.gov/3928249/) |

## Verification

- `node tests/clinical-calculators.test.cjs`: 935 assertions across all 30, including known examples, required fields, non-finite values, ranges, threshold boundaries, NT, dialysis, both fluid methods and APACHE 0/71 extremes.
- `tests/calculator-ui.test.cjs`: DOM integration, 2/28 placement, all GCS response options, tab switching, mutually exclusive fields, clearing stale output, search and core feature IDs. Requires jsdom 26.1.0 (`npm install --no-save --package-lock=false jsdom@26.1.0`).
- Expected values are explicit test fixtures, not taken from the implementation at runtime. MELD example (female; bilirubin 2.5, INR 1.8, Cr 1.4, Na 130, albumin 2.8) gives 26.
- Blank clinical assessments are not silently interpreted as absent. Invalid inputs cannot return Infinity or NaN. Output is invalidated when inputs change.
- Input bounds are software scope constraints, not universal physiological limits. Review unusual/out-of-range values directly.

## Review before clinical release

Dr Kulkarni should review the displayed clinical definitions, local protocols and intended populations. Tools 3, 7, 18 and 24 intentionally require prescribed patient-specific factors rather than inventing a treatment plan. The original 22 executable tools and 8 text-only score cards are now 30 interactive tools. External guideline links may change or be unavailable.

The wider site still contains legacy medical content, medicine entries and patient-record behaviour outside this calculator audit. Those sections have not been certified by these tests.

## Formula catalogue

### 1. BMI & reference weight

BMI = weight / height² (metres). Reference weight = 22 × height².

For adults ≥20 years. BMI is a screening measure; ethnicity, muscle mass, pregnancy and illness affect interpretation. Reference weight at BMI 22 is not an individual ideal-weight prescription.

### 2. Mean arterial pressure

MAP ≈ (SBP + 2 × DBP) / 3.

An approximation; waveform-derived MAP is preferred when available. Individual perfusion targets vary.

### 3. Prescribed fluid allowance

Remaining = prescribed allowance − recorded intake.

Enter the treating clinician’s individual plan. No automatic heart-failure or CKD fluid restriction is assigned.

### 4. Cockcroft–Gault creatinine clearance

CrCl = (140 − age) × weight / (72 × creatinine); female coefficient ×0.85.

CrCl in mL/min, not indexed eGFR. Weight selection needs clinical judgement in obesity/oedema. Unreliable in rapidly changing renal function.

### 5. HbA1c → estimated average glucose

eAG (mg/dL) = 28.7 × HbA1c − 46.7; mmol/L = mg/dL ÷18.

Population estimate, not a current glucose reading. HbA1c can be misleading with altered red-cell turnover, haemoglobin variants and some illnesses.

### 6. Glasgow Coma Scale

Assess E, V and M separately; total only if all three are testable.

Document confounders and components. NT is not a score of 1. A total alone does not determine airway management.

### 7. Individual nutrition plan

Daily energy = weight × prescribed kcal/kg; protein = weight × prescribed g/kg.

Factors must be selected for the patient. Renal/liver disease, critical illness and refeeding risk change requirements.

### 8. IV volume & drip rate

mL/hour = volume / hours; drops/min = volume × drop factor / (hours ×60).

Use the factor printed on the giving set. Rounded drops/min is a gravity estimate; verify the prescribed rate and device.

### 9. Adult burn fluid estimate

24-hour estimate = factor × weight × %TBSA. Classic Parkland: half by 8 hours, remainder over 16 hours, timed from injury.

Adults with ≥20% TBSA only. Exclude superficial burns. ABA favours starting at 2 mL/kg/%. This is an initial estimate requiring burn-team reassessment; not a catch-up infusion order.

### 10. Albumin-adjusted total calcium

Adjusted Ca = measured total Ca + 0.8 × (4 − albumin).

Traditional estimate only. It does not measure ionised calcium and can misclassify patients, particularly in critical illness or renal disease. Use measured ionised calcium when indicated.

### 11. CURB-65

One each: confusion, urea >7 mmol/L, RR ≥30, SBP <90 OR DBP ≤60, age ≥65.

Adults with community-acquired pneumonia. Clinical judgement, oxygenation, comorbidity and support needs also determine treatment setting.

### 12. Serum anion gap

AG (without K) = Na − Cl − HCO₃; albumin-adjusted AG = AG + 2.5 × (4 − albumin).

Use the local laboratory reference interval. A gap alone does not establish a diagnosis or exclude a mixed acid–base disorder.

### 13. Oxygen cylinder time estimate

Minutes = max(pressure − reserve, 0) × cylinder factor / flow.

Enter the manufacturer factor for this exact cylinder; no D-cylinder factor is assumed. Continuous flow only. Leaks, pressure, temperature and delivery systems alter actual time; arrange reserve oxygen.

### 14. qSOFA

One each: RR ≥22, SBP ≤100, altered mentation.

For adults with suspected infection. A low score does not exclude sepsis. SSC 2026 recommends other tools over qSOFA alone for hospital sepsis screening.

### 15. PaO₂ / FiO₂ ratio

P/F = PaO₂ / (FiO₂% ÷100).

Oxygenation bands alone do not diagnose ARDS. Berlin criteria also require timing, imaging, origin of oedema and respiratory-support criteria; newer global definitions broaden eligibility.

### 16. Sodium adjusted for hyperglycaemia

Katz estimate: adjusted Na = measured Na + 1.6 × (glucose −100) /100.

For hyperglycaemia only. The correction factor is an estimate and varies; this is not a fluid or sodium-correction prescription.

### 17. Fractional excretion of sodium

FENa = 100 × urine Na × serum Cr / (serum Na × urine Cr).

Both creatinine values must use matching units. Diuretics, CKD, sepsis and other conditions limit interpretation; FENa alone does not diagnose prerenal AKI or ATN.

### 18. Maintenance fluid methods

Adult: weight × prescribed factor. Child hourly: 4/2/1 per weight tier; child daily: 100/50/20 per tier.

Adult NICE starting range is often 25–30 mL/kg/day, with lower requirements in some patients. Hourly and daily paediatric formulas are separate approximations. No neonatal, resuscitation, replacement or electrolyte orders.

### 19. Glucocorticoid equivalence

Equivalent anti-inflammatory dose = source dose × target reference / source reference.

Approximate oral/IV anti-inflammatory equivalence. Mineralocorticoid effect, duration, route, indication, adrenal replacement and tapering require separate clinical decisions.

### 20. Two-level Wells DVT

Nine +1 criteria; alternative diagnosis −2.

For suspected DVT in adults. A score alone cannot exclude or confirm thrombosis; follow the diagnostic pathway.

### 21. Two-level Wells pulmonary embolism

DVT signs +3, PE most likely +3, tachycardia/immobility/prior VTE +1.5 each, haemoptysis/cancer +1 each.

For suspected PE in adults. An unlikely score does not rule out PE; use the diagnostic pathway.

### 22. AF stroke-risk scores

CHF +1, HTN +1, age ≥75 +2 OR 65–74 +1, DM +1, stroke/TIA/embolism +2, vascular +1; VASc adds female +1.

Shows both original CHA₂DS₂-VASc and ESC 2024 CHA₂DS₂-VA. Anticoagulation depends on AF context, valve disease, contraindications and local guidance; no automatic drug order.

### 23. HAS-BLED

One point per criterion; renal and liver, and drugs and alcohol, score separately.

High bleeding risk calls for modifiable-risk review and closer follow-up; do not use the score alone to withhold anticoagulation.

### 24. Prescribed insulin correction maths

Arithmetic estimate = max(0, (current − target) / prescribed sensitivity − active correction insulin).

No universal sliding scale. Requires a current individual plan, active-insulin assessment and monitoring. Not for DKA/HHS, pregnancy, paediatric dosing or IV insulin. Clinician must choose drug, route and rounding.

### 25. Norton pressure-injury risk

Five domains, 1–4 each; total 5–20. Lower total = greater risk.

Uses ≤14 as an at-risk threshold. Local protocols vary. A complete skin and pressure-injury prevention assessment remains necessary; no single device is mandated by the score.

### 26. Shock index

Shock index = heart rate / systolic BP.

No single threshold diagnoses or excludes shock. Age, pregnancy, medicines, rhythm and clinical context affect interpretation.

### 27. Heart-rate reserve target

Estimated HRmax = 220 − age; target = resting HR + intensity × (HRmax − resting HR).

Age-predicted maximum is approximate. Medicines, arrhythmias and heart disease can invalidate targets. This is not exercise clearance.

### 28. MELD 3.0 — adult equation

1.33×female +4.56 ln(Bili)+0.82(137−Na)−0.24(137−Na)ln(Bili)+9.09 ln(INR)+11.14 ln(Cr)+1.85(3.5−Alb)−1.83(3.5−Alb)ln(Cr)+6.

Adult-at-registration equation only. Bilirubin/INR floor 1; Cr 1–3 (dialysis →3); Na 125–137; albumin 1.5–3.5. Round and limit 6–40. Official allocation includes additional rules; verify with OPTN. No automatic ICU-transfer decision.

### 29. Child–Turcotte–Pugh

Bilirubin <2 / 2–3 / >3; albumin >3.5 / 2.8–3.5 / <2.8; INR <1.7 / 1.7–2.3 / >2.3; clinical domains 1–3.

Standard bilirubin thresholds shown; cholestatic-disease variants differ. Ascites and encephalopathy require clinical assessment. No automatic prognosis or prescription.

### 30. APACHE II — complete score

12 acute physiology components + age points + chronic health points. GCS component = 15 − GCS.

Adult ICU: select worst values in the first 24 hours, using the displayed measurement precision. Choose pH OR bicarbonate, never both. A–a gradient is required if FiO₂ ≥0.50. No default normal values and no patient-specific mortality percentage.
