/* Keyboard access for the existing local PDF preview; no sharing/auth changes. */
(function () {
  'use strict';
  function init() {
    const dialog = document.getElementById('pdfShareDialog');
    const close = document.getElementById('pdfShareClose');
    if (!dialog || !close) return;
    let active = false, returnFocus = null, previousOverflow = '';
    function sync() {
      if (typeof document === 'undefined' || !document?.body) return;
      if (!dialog.hidden && !active) {
        active = true;
        returnFocus = document.activeElement;
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        close.focus();
      } else if (dialog.hidden && active) {
        active = false;
        document.body.style.overflow = previousOverflow;
        if (returnFocus?.isConnected) returnFocus.focus();
        returnFocus = null;
      }
    }
    new MutationObserver(sync).observe(dialog, {attributes:true, attributeFilter:['hidden']});
    document.addEventListener('keydown', event => {
      if (dialog.hidden) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        close.click(); // Existing handler also releases temporary PDF URLs and files.
      } else if (event.key === 'Tab') {
        const controls = [...dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),[tabindex="0"]')].filter(el => !el.hidden && el.getClientRects().length);
        const first = controls[0], last = controls[controls.length - 1];
        if (!first) return;
        if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
          event.preventDefault(); first.focus();
        }
      }
    }, true);
    dialog.addEventListener('click', event => { if (event.target === dialog) close.click(); });
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
