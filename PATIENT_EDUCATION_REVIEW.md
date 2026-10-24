# Patient education revision — 24 October 2026

## Scope and editorial status

Rewrites all eight built-in Health library guides and the separate kidney/potassium default into nine shared topics, each with independently written Marathi and English text. The three public-guidance default cards and the two workstation default cards now reuse these guides instead of maintaining inconsistent copies. English and Marathi are deliberately not labelled as physician-approved translations.

This covers the repository's built-in patient-library articles. It is not a verified review of the doctor's unseen browser/phone articles, uploaded PDFs, external websites, every medicine entry or every cloud research draft. Device-added articles and attachments are preserved and labelled as unverified by the website. Nothing is automatically submitted to the cloud article publishing service. No approval date or physician sign-off is invented.

The new articles are source-checked editorial drafts for the doctor's review. Sources support the content; a link is not evidence that the source organisation endorses this site. The original wording is written for patients and caregivers, with Indian household context, practical questions, conditional advice and urgent-action distinctions. No ranking as the world's best medical knowledge base is claimed.

## Consequential corrections

| Previous issue | Replacement |
|---|---|
| Coconut water strictly prohibited for everyone in a kidney article | Potassium and fluid restrictions depend on results, medicines and individual advice; people with high potassium or an existing restriction should avoid it until the team advises. It is not a kidney-cleaning treatment. |
| Kidney failure means potassium does not leave the body | Kidney disease may reduce adequate removal. Levels can be high, normal or low; urine volume alone does not establish a normal blood potassium level. |
| Leaching presented as a universal preparation rule | It can reduce some potassium, not remove all. Suitable foods, method and portions require individual dietetic advice. It is not emergency treatment for hyperkalemia. |
| Passing urine used to justify fewer dialysis sessions | Frequency and adequacy require nephrology assessment. No self-directed reduction, universal one-litre cap or universal very-low-protein prescription. |
| Fixed 1.2-litre fluid limit for every heart-failure patient | Individual fluid advice and weight-alert thresholds; symptoms and observations complement the plan. No self-directed diuretic increase. |
| Rapid weight change treated as proof of lung fluid | A clue requiring assessment in context, not a diagnosis. |
| Catheter bag below the abdomen | Below bladder level; urinary and feeding tubes have separate instructions. |
| Soft food assumed safe after stroke | Swallowing assessment determines texture, drinks, position, pace and supervision. Absence of cough does not exclude aspiration. |
| One mattress or massage as skin prevention | Individual movement/pressure/skin/nutrition plan; do not massage vulnerable skin; inspect colour changes including on darker skin. |
| Falls or sudden confusion dismissed as ageing | Review the cause; head injury on blood thinners and sudden confusion need prompt assessment. |
| A high home BP reading treated without context | Proper technique, both readings recorded, severe-value and symptom actions distinguished; no automatic extra medicine. |

## Topic registry

| ID | Topic | Source anchors |
|---|---|---|
| 1 | Dialysis, urine and the individual plan | NIDDK hemodialysis; NIDDK hemodialysis nutrition |
| 2 | Heart failure, weight and fluids | AHA lifestyle/changes to report; NHS heart failure |
| 3 | Urinary catheter and feeding-tube safety | NHS urinary catheter; CDC CAUTI; Cambridge adult tube feeding |
| 4 | Swallowing after stroke | NHS dysphagia; NICE NG236; St John Ambulance adult choking |
| 5 | Pressure-injury prevention | NICE CG179; NICE patient guidance; NHS pressure ulcers |
| 6 | Falls, head injury and sudden confusion | NIA falls; CDC falls; NHS head injury and delirium |
| 7 | Medicines, lists and reactions | FDA use medicines wisely/side effects; NHS anaphylaxis |
| 8 | Home blood-pressure readings | AHA home monitoring, technique and severe-pressure guidance |
| 9 | Potassium, coconut water and leaching | NKF potassium/hyperkalemia; NIDDK CKD diet; NIH potassium; NKF Hawaii coconut water |

Exact URLs and section-to-source mappings are in patient-education-data.js. The old broken AHA home-monitoring link is replaced. NICE recommendation pages sometimes blocked direct retrieval; relevant recommendation excerpts were verified through official-domain search and the patient-guidance result. Do not describe every source link as independently guaranteed available on every device.

## Reading, accessibility and PDF behavior

- Full-guide buttons open actual additional sections, FAQs, references and a take-home point, not a restyled teaser.
- Marathi is written directly, with a separate English version, language labels and protection against automatic translation of these already authored versions. The rest of the existing site language widget remains available with its clinical-translation caveat.
- Shared data prevents the card, modal and PDF from having different medical advice. Hidden full text is included in the PDF source, while the visible summary is excluded from the PDF layout. Existing download/share and attachment controls remain.
- Scoped magazine-style headings, readable text, subtle mint emphasis, urgent-action colour plus text, source links, keyboard focus, Escape and modal focus return. Existing hero, clinical layout, calculators and features remain.
- Clinical emergencies refer to India's official 112 service and a local emergency number outside India. The urgent-action advice is not a substitute for first-aid training.

## Verification and remaining review

DOM integration checks exercise all nine guides in both languages, actual full paragraph rendering, keyword search, unique IDs, modal keyboard behavior, safe custom text, unchanged local article storage and retained attachments. A PDF-engine stub verifies every paragraph, references and draft status reaches the PDF input; this does not verify the final rendered PDF's page breaks or Marathi glyph appearance. Existing calculator/API/privacy/security regressions are run separately.

Physician clinical approval, native-language editorial review by the doctor, mobile visual inspection and final PDF layout/glyph review remain pending. No live website release is performed by this revision. Pending AI Gateway/n8n work is untouched.

## Follow-up: complete sharing, language and pre-visit history

The owner accepted the article content and requested technical corrections. English is now the default/original view; authored Marathi remains selectable, with natural wording such as “शहाळ्याचे पाणी”, “नारळाचे पाणी” and “रक्ताची तपासणी”. Education content is no longer marked notranslate. The existing Google language control is available from the article toolbar; automatic translations remain unverified and third-language PDF export uses the visible translated full guide, not an English PDF silently substituted.

Root cause found in actual sharing controls: the generic `.no-print` selector began matching the new Read full guide button before the actual share toolbar. Sharing now targets a dedicated toolbar and data-action attribute. New tests click the actual card and modal buttons, then compare the File passed to navigator.share with the complete PDF bytes for every one of the 18 authored language/topic combinations.

All nine guides have complete, prebuilt English and Marathi PDFs with embedded fonts, references, website identity and page numbers. The reproducible build script checks that every source paragraph reaches the paginated layout and that no text box exceeds its page. Every page is rendered for visual inspection. Marathi visual text is checked separately from PDF text extraction because shaped Devanagari does not always round-trip through PDF extraction. WhatsApp file sharing requires the user to choose a recipient and press Send; a web WhatsApp link cannot attach a file automatically. Desktop fallback instructions explicitly describe Download → Attach → Document → Send.

Booking now includes an optional patient-supplied pre-visit history form with repeatable symptom rows and a full relief pattern: what helps, time to relief, degree/duration of relief and recurrence. It is not centred on seizures; the seizure example is optional and collapsed. Age/sex, conditions, follow-up, operations, substances, allergies, prior consultations, home measures and every current/recent medicine can be entered. Each medicine has name, strength, dose, route, timing, reason, prescriber/since, last dose and missed/stopped-dose notes. Unknown details are not invented.

The form supports review, blank/filled printing with Save as PDF, and explicit PDF/WhatsApp sharing. Consent gates sending. Short complete histories can accompany booking text; longer histories require the full PDF and are never truncated. No patient intake table, public upload endpoint or automatic cloud persistence was created. This is a website-hosted form with device-side input and intentional sharing, not a cloud-saved EMR intake service. Refreshing can clear the page, so the UI tells the user to save or share before leaving. Clinical identity, accuracy and guardian authority still require verification.

The symptom form explicitly records the relief pattern: provoking context, relieving measure, time until relief, degree and duration of relief, and recurrence. Formatting is selective and relevant: hierarchy, short paragraphs and a small set of safety/action emphasis phrases; Marathi text avoids synthetic italic slant. The same emphasis is included in the generated PDFs.
