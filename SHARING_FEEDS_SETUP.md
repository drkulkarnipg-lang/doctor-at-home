# PDF sharing, interactive patient help and research feeds

Updated 23 October 2026.

PDF is the default share format for patient articles, prescriptions, pathology/radiology slips, clinical/death certificates, BP trends and health-library articles. The pinned html2pdf.js 0.14.0 bundle is hosted with the website. PDFs are prepared locally, capture current inputs/selections/multiline text, and omit control buttons. A second Share PDF click invokes the device share menu with an application/pdf File, preserving the user gesture required by browsers after PDF preparation.

The user chooses the app and recipient. No clinical document is sent automatically. Supported devices can offer WhatsApp, email or Drive. Where native PDF file sharing is unavailable, Download PDF and Open WhatsApp are offered; the downloaded file must be attached as a document. WhatsApp Web cannot attach a local PDF through a text URL. Cancelling share leaves the PDF ready and does not open WhatsApp. Word/video attachments retain their original download links and are not automatically converted into PDF.

The on-demand Vercel endpoint `/api/research-feeds?source=criticalcare` replaces the external rss2json service. It accepts only fixed publisher IDs, GET requests and HTTPS publisher hosts, limits response size/time, rejects XML DTD/entity declarations, parses RSS/Atom using pinned fast-xml-parser 5.11.2, and caches successful public results for ten minutes. Critical Care uses its current Springer journal feed and is the default. NEJM, Lancet, Medical Xpress and CDC choices remain. The CDC source is correctly labelled Newsroom. Publisher blocks, removed feeds and HTML error responses get an explicit unavailable message and original source link.

The endpoint requires Vercel Node functions; opening index.html locally or using static-only hosting does not provide it. No separate user internet connection, n8n or model key is required for on-demand public feeds. Publisher availability is outside the website's control. RSS excerpts are not full-paper analysis.

The floating Patient help chat handles Marathi/English service topics, booking, fees, reports, location, PDF sharing and navigation with quick actions. It is a curated interactive helper, not an external generative AI model or clinical diagnosis system. Messages stay transient in the open page. Clinical questions are directed to the doctor. No new patient-data storage or automatic cloud upload is added. Daily Feedly/AI automation still requires separate secure workflow/model configuration.

Validation: actual PDFs downloaded for a Marathi article, prescription, pathology/radiology, fitness and Form 2; native file payload and cancellation tested with a mock receiver; unsupported-browser fallback and 360px layouts checked. PDF rendering and Devanagari headings reviewed. Existing IDs, outgoing links and inline application scripts preserved. RSS tests cover RSS/Atom, unsafe links, HTML/non-feed responses, DTD rejection, arbitrary-source rejection, GET-only, caching and publisher/redirect errors. Production feed availability must be checked after deployment.

References:
- https://vercel.com/docs/functions/runtimes/node-js
- https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
- https://github.com/eKoopmans/html2pdf.js
- https://github.com/NaturalIntelligence/fast-xml-parser
- https://medicalxpress.com/feeds/
