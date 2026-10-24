# Patient experience: comfortable reading, hopeful tone and an obvious way back
24 October 2026. Preview only; no public release or medical colour-therapy claim.

## Reported failure and correction
The original reader put its small icon and article into the same long scrolling panel. After reading, the close icon could be above the viewport; the new language panel could compete for space. The reader now has a non-scrolling named Close control at the top, a persistent return-to-library control at the bottom and a separately scrollable article body. Backdrop click and Escape also close it. Background scrolling/focus are blocked while open, then restored; the triggering article card retains focus. This does not claim that the browser/Android Back button is intercepted.

## Visual intent
A patient should find a welcoming, understandable place to take a next step. The canvas, header, navigation, hero companion panel, library, booking, FAQ and footer now use a coordinated light palette rather than changing only the intake form. Main canvas #f1f8ff, paper #ffffff, text #17354b, secondary text #38596e, action colour #176788. Mint, lavender, soft peach and a small pale-yellow label add warmth and distinguish areas; they are not coded as diagnoses or promises of emotional effects. Georgia identity and clinical print layouts remain intact. No forced motion, flashing, fake patient praise, fabricated outcomes or service claims were added.

## Evidence and limits
- Jonauskaite et al., Psychological Science (2020), DOI-linked PubMed record https://pubmed.ncbi.nlm.nih.gov/32900287/: colour-emotion associations show shared patterns and cultural/language/geographic variation. Association is not proof of treatment effect.
- Eminovic et al., randomised trial, 80 arthroplasty patients, https://pmc.ncbi.nlm.nih.gov/articles/PMC8921019/: coloured rooms plus art improved some quality-of-life scores at day 6, but mood, anxiety/depression and pain differences were not significant. Hospital-room results cannot be extrapolated into a claim that website colours treat depression.
- W3C dialog guidance https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/: visible close control, Escape, managed focus and return to trigger.
- NHS accessible GP website guidance https://www.england.nhs.uk/wp-content/uploads/2022/09/PRN00651-creating-a-highly-usable-and-accessible-gp-website-for-patients-v3.pdf: readable contrast and useful navigation, not colour alone.
- Mayo https://www.mayoclinic.org/patient-centered-care, Cleveland https://my.clevelandclinic.org/health and MSD https://www.msdmanuals.com/home were inspected for information/navigation references; no endorsement or copied identity is implied.

The palette is a design judgement informed by the doctor's preference and accessibility principles, not an independently validated psychological intervention. Real patients should be able to judge comfort and clarity in the preview.

## Checks
DOM tests cover top Close, bottom return, backdrop, Escape, background/focus restoration and repeated opening without duplicate controls. Core text/button pairs meet computed 4.5:1 contrast. Full patient education, PDF-sharing source tests and native-language/intake checks are separate. These tests do not establish full WCAG conformance, all-pixel contrast or real-device geometry. Browser extensions that force dark colours may still alter a page; no claim is made about overriding user accessibility settings.
