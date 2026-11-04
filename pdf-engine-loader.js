/* Load the existing local PDF renderer only when a document needs rendering. */
(function () {
  'use strict';
  let pending = null;
  window.ensurePdfEngine = function () {
    if (typeof window.html2pdf === 'function') return Promise.resolve(window.html2pdf);
    if (pending) return pending;
    const descriptor = document.getElementById('pdfEngineSource');
    if (!descriptor || !descriptor.getAttribute('src')) {
      return Promise.reject(new Error('PDF engine is unavailable. Use Print / Save as PDF.'));
    }
    const source = new URL(descriptor.getAttribute('src'), document.baseURI);
    if (source.origin !== window.location.origin) {
      return Promise.reject(new Error('PDF engine must load from this website. Use Print / Save as PDF.'));
    }
    pending = new Promise(function (resolve, reject) {
      const script = document.createElement('script');
      script.src = source.href;
      script.async = true;
      script.dataset.pdfEngine = 'loading';
      let finished = false;
      const timeout = setTimeout(function () { finish(new Error('PDF engine took too long to load. Try again or use Print / Save as PDF.')); }, 20000);
      function finish(error) {
        if (finished) return;
        finished = true;
        clearTimeout(timeout);
        script.onload = script.onerror = null;
        if (error) {
          script.remove();
          pending = null;
          reject(error);
        } else {
          script.dataset.pdfEngine = 'ready';
          resolve(window.html2pdf);
        }
      }
      script.onload = function () {
        finish(typeof window.html2pdf === 'function' ? null : new Error('PDF engine could not start. Try again or use Print / Save as PDF.'));
      };
      script.onerror = function () { finish(new Error('PDF engine could not load. Check the connection, try again or use Print / Save as PDF.')); };
      document.head.append(script);
    });
    return pending;
  };
})();
