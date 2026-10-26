/* When a section, answer or accordion is opened, bring it into view so it never opens off-screen on a phone. */
(function () {
  'use strict';
  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  function headerOffset() {
    var h = document.querySelector('header.site-header, .site-header');
    if (!h) return 8;
    var pos = '';
    try { pos = getComputedStyle(h).position; } catch (e) {}
    return (pos === 'sticky' || pos === 'fixed') ? Math.round(h.getBoundingClientRect().height) + 8 : 8;
  }

  function bodyOf(opener) {
    if (opener.tagName === 'SUMMARY' && opener.parentElement) {
      var kids = opener.parentElement.children;
      for (var i = 0; i < kids.length; i++) if (kids[i] !== opener) return kids[i];
      return null;
    }
    var id = opener.getAttribute('aria-controls');
    return (id && document.getElementById(id)) || opener.nextElementSibling;
  }

  function bringIntoView(opener) {
    if (!opener || !opener.getBoundingClientRect) return;
    var body = bodyOf(opener);
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var off = headerOffset();
    var o = opener.getBoundingClientRect();
    var b = body ? body.getBoundingClientRect() : o;
    var firstLineVisible = b.top >= off && b.top < vh - 96;
    var openerVisible = o.top >= off - 4;
    if (firstLineVisible && openerVisible) return;
    var y = window.pageYOffset + o.top - off;
    try { window.scrollTo({ top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth' }); }
    catch (e) { window.scrollTo(0, Math.max(0, y)); }
  }

  document.addEventListener('toggle', function (ev) {
    var d = ev.target;
    if (d && d.tagName === 'DETAILS' && d.open) {
      var s = d.querySelector(':scope > summary');
      window.setTimeout(function () { bringIntoView(s || d); }, 60);
    }
  }, true);

  document.addEventListener('click', function (ev) {
    var t = ev.target && ev.target.closest ? ev.target.closest('button[aria-expanded]') : null;
    if (!t) return;
    window.setTimeout(function () {
      if (t.getAttribute('aria-expanded') === 'true') bringIntoView(t);
    }, 120);
  }, true);
})();
