'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

(async () => {
  const base = path.resolve(__dirname, '..');
  const html = fs.readFileSync(path.join(base, 'index.html'), 'utf8');
  const dom = new JSDOM(html, { url: 'https://clinic.example/', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  try {
    w.matchMedia = () => ({ matches: true });
    w.scrollTo = () => {};
    w.HTMLElement.prototype.scrollIntoView = function () {};
    w.eval(fs.readFileSync(path.join(base, 'portal-navigation.js'), 'utf8'));

    const main = w.document.getElementById('publicPortal');
    const section = id => w.document.getElementById(id);
    const nav = href => w.document.querySelector('.portal-nav a[href="' + href + '"]');

    assert.equal(w.PatientPortalNavigation.activeView, 'overview');
    assert.equal(section('elderlySection').hidden, true);
    assert.equal(section('wikiSection').hidden, true);
    assert.equal(section('publicGuidanceSection').hidden, false);
    assert.equal(section('onlineConsultationNotice').hidden, false);
    assert.equal(main.querySelector(':scope > .portal-hero').hidden, false);
    assert.equal(nav('#publicPortal').getAttribute('aria-current'), 'page');

    nav('#elderlySection').click();
    assert.equal(w.PatientPortalNavigation.activeView, 'elderly');
    assert.equal(section('elderlySection').hidden, false);
    assert.equal(section('wikiSection').hidden, true);
    assert.equal(section('publicGuidanceSection').hidden, true);
    assert.equal(main.querySelector(':scope > .portal-hero').hidden, false);
    assert.equal(nav('#elderlySection').getAttribute('aria-current'), 'page');

    nav('#wikiSection').click();
    assert.equal(w.PatientPortalNavigation.activeView, 'library');
    assert.equal(section('wikiSection').hidden, false);
    assert.equal(section('exploreHealthResources').hidden, false);
    assert.equal(section('elderlySection').hidden, true);

    nav('#bookingSection').click();
    assert.equal(w.PatientPortalNavigation.activeView, 'booking');
    assert.equal(section('bookingSection').hidden, false);
    assert.equal(section('onlineConsultationNotice').hidden, false);
    assert.equal(section('wikiSection').hidden, true);

    nav('#patientToolsSection').click();
    assert.equal(w.PatientPortalNavigation.activeView, 'tools');
    assert.equal(section('nutritionSection').hidden, false);
    assert.equal(section('patientToolsSection').hidden, false);
    assert.equal(section('bookingSection').hidden, true);

    nav('#patientFaq').click();
    assert.equal(w.PatientPortalNavigation.activeView, 'faq');
    assert.equal(section('patientFaq').hidden, false);
    assert.equal(section('patientToolsSection').hidden, true);

    w.history.pushState(null, '', '#elderlySection');
    w.dispatchEvent(new w.PopStateEvent('popstate'));
    assert.equal(w.PatientPortalNavigation.activeView, 'elderly');
    assert.equal(section('elderlySection').hidden, false);

    w.history.pushState(null, '', '#wikiSection');
    w.dispatchEvent(new w.PopStateEvent('popstate'));
    assert.equal(w.PatientPortalNavigation.activeView, 'library');
    assert.equal(section('wikiSection').hidden, false);

    assert.equal(w.PatientPortalNavigation.show('booking'), true);
    assert.equal(w.location.hash, '#bookingSection');
    assert.equal(section('bookingSection').hidden, false);
    assert.equal(w.PatientPortalNavigation.show('unknown'), false);

    // Search articles remains a normal page navigation, not a local tab.
    assert.equal(nav('/articles'), null);
    console.log('Patient portal navigation checks passed: isolated sections, persistent home-visit hero, overview/elderly/library/booking/tools/FAQ views, browser history and direct hash routing.');
  } finally {
    dom.window.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
