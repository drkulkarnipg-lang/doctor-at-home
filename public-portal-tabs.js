/* Accessible single-panel navigation for the seven Patient Portal tabs. */
(() => {
  'use strict';
  const nav = document.querySelector('.portal-nav[role="tablist"]');
  if (!nav) return;
  const tabs = [...nav.querySelectorAll('[role="tab"][data-public-tab]')];
  const panels = [...document.querySelectorAll('#publicPortal [data-public-panel]')];
  if (tabs.length !== 7 || panels.length !== 7) return;
  const panelByKey = new Map(tabs.map(tab => [tab.dataset.publicTab, document.getElementById(tab.getAttribute('aria-controls'))]));
  const panelForHash = hash => {
    let id = String(hash || '').replace(/^#/, '');
    try { id = decodeURIComponent(id); } catch (_) {}
    if (!id || id === 'publicPortal') return panelByKey.get('overview');
    const target = document.getElementById(id);
    if (!target) return panels[0];
    return target.matches('[data-public-panel]') ? target : target.closest('[data-public-panel]') || panels[0];
  };
  function activate(panel, options = {}) {
    if (typeof panel === 'string') panel = panelByKey.get(panel) || document.getElementById(panel);
    if (!panel || !panels.includes(panel)) return false;
    panels.forEach(item => {
      const active = item === panel;
      item.hidden = !active;
      item.setAttribute('aria-hidden', String(!active));
    });
    tabs.forEach(tab => {
      const active = tab.getAttribute('aria-controls') === panel.id;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    if (options.history) {
      const hash = '#' + (options.hashTarget || panel.id);
      if (window.location.hash !== hash) window.history.pushState({ publicPanel: panel.id }, '', hash);
    }
    if (options.focusTarget && options.focusTarget.isConnected) options.focusTarget.scrollIntoView?.({ block: 'start', behavior: 'auto' });
    else if (options.focusPanel) {
      panel.focus({ preventScroll: true });
      panel.scrollIntoView?.({ block: 'start', behavior: 'auto' });
    }
    return true;
  }
  window.switchPublicTab = (key, options = {}) => activate(key, { history: true, ...options });
  nav.addEventListener('click', event => {
    const tab = event.target.closest('[role="tab"][data-public-tab]');
    if (!tab) return;
    event.preventDefault();
    activate(panelByKey.get(tab.dataset.publicTab), { history: true, focusPanel: true });
  });
  nav.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const current = tabs.indexOf(document.activeElement);
    if (current < 0) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 :
      (current + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
    tabs[next].focus();
    activate(panelByKey.get(tabs[next].dataset.publicTab), { history: true });
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || nav.contains(link)) return;
    const href = link.getAttribute('href');
    if (href === '#publicPortal') {
      event.preventDefault();
      activate('overview', { history: true, focusPanel: true });
      return;
    }
    let id = href.slice(1);
    try { id = decodeURIComponent(id); } catch (_) {}
    const target = document.getElementById(id);
    const panel = target?.closest('[data-public-panel]');
    if (!panel || !panel.hidden) return;
    event.preventDefault();
    activate(panel, { history: true, hashTarget: target.id, focusTarget: target });
  });
  const restore = () => activate(panelForHash(window.location.hash));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', restore, { once: true });
  else restore();
  window.addEventListener('popstate', restore);
  window.addEventListener('hashchange', restore);
})();