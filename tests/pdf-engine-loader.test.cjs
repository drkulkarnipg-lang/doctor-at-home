'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
function harness(src = 'assets/pdf/html2pdf.bundle.min.js') {
  const dom = new JSDOM(`<script id="pdfEngineSource" type="application/x-lazy-script" src="${src}"></script>`, { url: 'https://clinic.example/', runScripts: 'outside-only' });
  dom.window.eval(fs.readFileSync('pdf-engine-loader.js', 'utf8'));
  return dom;
}
(async () => {
  const dom = harness(), w = dom.window;
  assert.equal(w.document.querySelector('[data-pdf-engine]'), null, 'Browsing must not start a PDF-engine download');
  const first = w.ensurePdfEngine(), second = w.ensurePdfEngine();
  assert.equal(first, second, 'Concurrent PDF requests share one loader');
  assert.equal(w.document.querySelectorAll('[data-pdf-engine]').length, 1);
  w.html2pdf = function renderer() {};
  w.document.querySelector('[data-pdf-engine]').dispatchEvent(new w.Event('load'));
  assert.equal(await first, w.html2pdf);
  assert.equal(await w.ensurePdfEngine(), w.html2pdf);
  dom.window.close();

  const failed = harness(), f = failed.window;
  const attempt = f.ensurePdfEngine();
  const rejected = assert.rejects(attempt, /could not load.*Print/);
  f.document.querySelector('[data-pdf-engine]').dispatchEvent(new f.Event('error'));
  await rejected;
  assert.equal(f.document.querySelector('[data-pdf-engine]'), null);
  const retry = f.ensurePdfEngine();
  f.html2pdf = function renderer() {};
  f.document.querySelector('[data-pdf-engine]').dispatchEvent(new f.Event('load'));
  assert.equal(await retry, f.html2pdf, 'Retry recovers without refreshing or losing the document');
  failed.window.close();

  const timed = harness(), t = timed.window;
  let onTimeout;
  t.setTimeout = callback => (onTimeout = callback, 1);
  t.clearTimeout = () => {};
  const waiting = t.ensurePdfEngine();
  const timeoutCheck = assert.rejects(waiting, /took too long.*Print/);
  onTimeout();
  await timeoutCheck;
  assert.equal(t.document.querySelector('[data-pdf-engine]'), null);
  timed.window.close();

  const foreign = harness('https://untrusted.example/renderer.js');
  await assert.rejects(foreign.window.ensurePdfEngine(), /must load from this website/);
  assert.equal(foreign.window.document.querySelector('[data-pdf-engine]'), null);
  foreign.window.close();

  const html = fs.readFileSync('index.html', 'utf8');
  const page = new JSDOM(html);
  const source = page.window.document.getElementById('pdfEngineSource');
  assert.equal(source.type, 'application/x-lazy-script');
  assert.equal(source.getAttribute('src'), 'assets/pdf/html2pdf.bundle.min.js', 'Original renderer URL retained');
  assert.ok(page.window.document.querySelector('script[src="pdf-engine-loader.js"]'));
  assert.ok(fs.existsSync('logo.png'), 'Existing logo URL must resolve without a 404 fallback');
  page.window.close();
  console.log('PDF loader: no eager download, one concurrent load, reuse, failure recovery, timeout and same-origin guard pass. Existing renderer/logo URLs retained.');
})().catch(error => { console.error(error); process.exitCode = 1; });
