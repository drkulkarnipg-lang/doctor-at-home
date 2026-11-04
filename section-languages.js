/* Independent local language scopes. Never translate or transmit entered clinical data. */
(function () {
  'use strict';
  const settings = {
    siteLanguageSelector: {root:'.site-header',kind:'header'},
    homeLanguagePicker: {root:'#portalPanelOverview',kind:'home'},
    libraryLanguagePicker: {root:'#wikiSection',kind:'library'},
    doctorLanguagePicker: {root:'#doctorWorkstation',kind:'doctor'},
    encyclopediaLanguagePicker: {root:'#wikiModal',kind:'reader'}
  };
  document.cookie='googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax';
  const states = Object.fromEntries(Object.keys(settings).map(id => [id,'en']));
  const originals = new WeakMap();
  const mr = {
    'Patient Portal':'रुग्ण विभाग','Doctor Workstation':'डॉक्टर कार्यक्षेत्र',
    'Overview':'आढावा','Elderly care':'ज्येष्ठांची काळजी','Health library':'आरोग्य ग्रंथालय',
    'Search articles':'लेख शोधा','Book a home visit':'घरभेटीची विनंती','Health tools':'आरोग्य साधने','Patient FAQ':'रुग्णांचे प्रश्न',
    'Home visits.':'घरभेटी.','Care at your bedside.':'तुमच्या शेजारी वैद्यकीय काळजी.',
    'Request a home visit':'घरभेटीची विनंती करा','Explore the health library':'आरोग्य ग्रंथालय पाहा',
    'Online consultation · ₹500':'ऑनलाइन सल्ला · ₹५००','Call 9561394341':'फोन करा 9561394341',
    'Prescription desk':'औषधपत्र विभाग','Clinical documents':'वैद्यकीय कागदपत्रे',
    'Clinical document tools':'वैद्यकीय कागदपत्रांची साधने','Workstation Home':'कार्यक्षेत्राचे मुख्य पान',
    'Prescription':'औषधपत्र','Lab Requisition':'प्रयोगशाळा तपासणी विनंती',
    'Radiology Requisition':'रेडिओलॉजी तपासणी विनंती','Clinical calculators':'वैद्यकीय गणक',
    'Practice registers':'दवाखान्याच्या नोंदवह्या','Connections & settings':'जोडण्या आणि सेटिंग्ज'
  };
  function translateLabels(root, code, kind) {
    const roots = kind === 'doctor' ? [...root.querySelectorAll('.doctor-tabs,.workstation-heading,#workspacePageIdentity')] : [root];
    for (const host of roots) {
      const walker = document.createTreeWalker(host,NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (node.parentElement?.closest('script,style,input,textarea,select,[contenteditable],.printable-sheet,.section-translator,.language-control')) continue;
        if (!originals.has(node)) originals.set(node,node.nodeValue);
        const original = originals.get(node), text = original.trim();
        node.nodeValue = code === 'mr' && mr[text] ? original.replace(text,mr[text]) : original;
      }
    }
  }
  function notice(id, message) {
    const select = document.getElementById(id);
    const host = select?.closest('.section-translator,.language-row') || select?.parentElement;
    if (!host) return;
    let status = host.querySelector('[data-section-language-status]');
    if (!status) { status = document.createElement('p'); status.dataset.sectionLanguageStatus=id; status.setAttribute('role','status'); status.setAttribute('aria-live','polite'); host.append(status); }
    status.textContent=message;
  }
  function choose(id, code) {
    const scope = settings[id], select = document.getElementById(id);
    if (!scope) return false;
    if (!['en','mr'].includes(code)) {
      if (select) select.value=states[id];
      notice(id,'Section-only translation is not connected for this language. This section and all other sections remain unchanged. English and authored Marathi are available for the health guides.');
      return false;
    }
    const root = document.querySelector(scope.root);
    if (!root) return false;
    if (scope.kind === 'library') window.PatientEducationView?.setLibraryLanguage(code);
    else if (scope.kind === 'reader') window.PatientEducationView?.setReaderLanguage(code);
    else translateLabels(root,code,scope.kind);
    states[id]=code;
    if (select) select.value=code;
    notice(id,scope.kind === 'doctor' ? 'Only this Workstation navigation changed. Clinical text, patient entries and documents stay in their original language; full authored translation remains pending.' : scope.kind === 'home' ? 'Only this overview’s available navigation labels changed. Untranslated text remains English; other sections are unchanged.' : 'Only this section changed. Other selectors and sections are unchanged. Verify clinical meaning against the English original.');
    return true;
  }
  window.SectionLanguages=Object.freeze({choose,getState:id=>states[id]});
  function init() {
    // Protect independent scopes from the legacy whole-page provider widget.
    for (const selector of ['.site-header','#publicPortal','#doctorWorkstation','#wikiModal']) {
      const root=document.querySelector(selector); if (root) {root.classList.add('notranslate');root.setAttribute('translate','no');}
    }
    for (const id of Object.keys(settings)) {const picker=document.getElementById(id);if(picker&&[...picker.options].some(o=>o.value==='en'))picker.value='en';}
    const workstation=document.getElementById('doctorWorkstation');
    if(workstation)new MutationObserver(()=>{
      if(typeof document==='undefined'||!document?.body)return;
      if(states.doctorLanguagePicker==='mr')translateLabels(workstation,'mr','doctor');
    }).observe(workstation,{childList:true,subtree:true});
  }
  document.addEventListener('change',event=>{
    const id=event.target.id;
    if (settings[id]) {event.preventDefault();event.stopImmediatePropagation();choose(id,event.target.value||'en');}
  },true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
