'use strict';
const { PDFDocument } = require('pdf-lib');

const CRS_FORMS_URL = 'https://dc.crsorgi.gov.in/assets/download/all_forms_CRS_2019_new.pdf';
// Page numbers are zero-based. The official CRS PDF puts each form on a single page
// followed by its instructions on the reverse page: Form 2 = page 5, Form 4 = page 9,
// Form 4A = page 11 (human page numbers 5, 9 and 11 respectively).
const FORM_PAGES = Object.freeze({
  '2': { pageIndex: 4, filename: 'Form_2_Official_Blank.pdf' },
  '4': { pageIndex: 8, filename: 'Form_4_Official_Blank.pdf' },
  '4a': { pageIndex: 10, filename: 'Form_4A_Official_Blank.pdf' }
});
let sourcePdfPromise;

async function loadOfficialSource() {
  if (!sourcePdfPromise) {
    sourcePdfPromise = (async () => {
      const response = await fetch(CRS_FORMS_URL, {
        headers: { accept: 'application/pdf' },
        signal: AbortSignal.timeout(15000)
      });
      if (!response.ok) throw new Error('Official CRS form source returned HTTP ' + response.status);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length < 1000 || bytes.length > 15 * 1024 * 1024) {
        throw new Error('Unexpected official CRS PDF size');
      }
      return bytes;
    })();
    sourcePdfPromise.catch(() => { sourcePdfPromise = null; });
  }
  return sourcePdfPromise;
}

module.exports = async function officialFormPdf(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Use GET to download an official blank form.' });
  }
  const formKey = String(req.query?.form || '').toLowerCase().replace(/\s+/g, '').replace(/^form/, '');
  const spec = FORM_PAGES[formKey];
  if (!spec) {
    return res.status(400).json({ error: 'Choose form=2, form=4 or form=4a.' });
  }
  try {
    const sourceBytes = await loadOfficialSource();
    const source = await PDFDocument.load(sourceBytes);
    if (source.getPageCount() <= spec.pageIndex) throw new Error('Official CRS PDF page map changed');
    const singlePage = await PDFDocument.create();
    const [page] = await singlePage.copyPages(source, [spec.pageIndex]);
    singlePage.addPage(page);
    const output = Buffer.from(await singlePage.save({ useObjectStreams: false }));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="' + spec.filename + '"');
    res.setHeader('Content-Length', String(output.length));
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(200).send(output);
  } catch (_) {
    return res.status(502).json({
      error: 'The official CRS PDF is temporarily unavailable. Use the complete official government PDF reference on the forms page.'
    });
  }
};
