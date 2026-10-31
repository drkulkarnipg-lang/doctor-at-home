(function () {
  'use strict';

  var main = document.getElementById('publicPortal');
  if (!main) return;

  var hero = main.querySelector(':scope > .portal-hero');
  var views = {
    overview: ['publicGuidanceSection', 'onlineConsultationNotice'],
    elderly: ['elderlySection'],
    library: ['wikiSection', 'exploreHealthResources'],
    booking: ['onlineConsultationNotice', 'bookingSection'],
    tools: ['nutritionSection', 'patientToolsSection'],
    faq: ['patientFaq']
  };
  var hashToView = {
    publicPortal: 'overview',
    elderlySection: 'elderly',
    wikiSection: 'library',
    exploreHealthResources: 'library',
    bookingSection: 'booking',
    onlineConsultationNotice: 'booking',
    nutritionSection: 'tools',
    patientToolsSection: 'tools',
    patientFaq: 'faq',
    publicGuidanceSection: 'overview'
  };
  var activeView = '';

  function topLevelSection(target) {
    var node = target;
    while (node && node.parentElement !== main) node = node.parentElement;
    return node && node.parentElement === main && node.tagName === 'SECTION' ? node : null;
  }

  function viewForTarget(target) {
    if (!target || target === main) return 'overview';
    var section = topLevelSection(target);
    if (!section) return '';
    return hashToView[section.id] || '';
  }

  function render(view) {
    if (!views[view]) view = 'overview';
    activeView = view;
    var visibleIds = views[view];
    Array.prototype.forEach.call(main.querySelectorAll(':scope > section'), function (section) {
      if (section === hero) {
        section.hidden = false;
        return;
      }
      if (!section.id) return;
      section.hidden = visibleIds.indexOf(section.id) === -1;
    });

    main.setAttribute('data-portal-view', view);
    var links = document.querySelectorAll('.portal-nav a[href^="#"]');
    Array.prototype.forEach.call(links, function (link) {
      var targetId = decodeURIComponent(link.getAttribute('href').slice(1));
      var linkView = hashToView[targetId] || (targetId === 'publicPortal' ? 'overview' : '');
      if (linkView === view) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function applyLocation(shouldScroll) {
    var rawHash = window.location.hash;
    var targetId = '';
    try { targetId = rawHash ? decodeURIComponent(rawHash.slice(1)) : ''; } catch (_) {}
    var target = targetId ? document.getElementById(targetId) : main;
    var view = target ? viewForTarget(target) : '';
    if (!view && targetId) return;
    render(view || 'overview');
    if (shouldScroll && target && target !== main) {
      window.requestAnimationFrame(function () {
        if (!target.hidden && typeof target.scrollIntoView === 'function') {
          target.scrollIntoView({
            behavior: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            block: 'start'
          });
        }
      });
    }
  }

  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest ? event.target.closest('#publicPortal a[href^="#"], .portal-nav a[href^="#"]') : null;
    if (!link || link.closest('#wikiModal')) return;
    var href = link.getAttribute('href');
    var targetId;
    try { targetId = decodeURIComponent(href.slice(1)); } catch (_) { return; }
    var target = document.getElementById(targetId);
    if (!target || (target !== main && !main.contains(target))) return;
    var view = viewForTarget(target);
    if (!view) return;
    event.preventDefault();
    if (window.location.hash !== href) window.history.pushState(null, '', href);
    render(view);
    if (target !== main) {
      window.requestAnimationFrame(function () {
        if (typeof target.scrollIntoView === 'function') {
          target.scrollIntoView({
            behavior: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            block: 'start'
          });
        }
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  });

  window.addEventListener('popstate', function () { applyLocation(true); });
  window.addEventListener('hashchange', function () { applyLocation(true); });
  render('overview');
  if (window.location.hash) applyLocation(true);

  window.PatientPortalNavigation = {
    get activeView() { return activeView; },
    show: function (view) {
      if (!views[view]) return false;
      var targetByView = {
        overview: 'publicPortal',
        elderly: 'elderlySection',
        library: 'wikiSection',
        booking: 'bookingSection',
        tools: 'patientToolsSection',
        faq: 'patientFaq'
      };
      var id = targetByView[view];
      var href = '#' + id;
      if (window.location.hash !== href) window.history.pushState(null, '', href);
      render(view);
      var target = document.getElementById(id);
      if (target && typeof target.scrollIntoView === 'function') target.scrollIntoView({ behavior: 'auto', block: 'start' });
      return true;
    }
  };
})();
