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
  document.cookie='googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=drkulkarnipg.com; SameSite=Lax';
  const states = Object.fromEntries(Object.keys(settings).map(id => [id,'en']));
  const originals = new WeakMap();
  const mr = {
    'Home visits.':'डॉक्टरांची घरभेट.','Care at your bedside.':'तुमच्या जवळ, तुमच्या काळजीसाठी.',
    'Here for your':'तुमच्या पुढील टप्प्यावर','next step.':'आमची साथ.',
    'Your care, connected':'तुमच्या आरोग्यासाठी संपर्क',
    'Qualifications & registration':'पात्रता आणि नोंदणी',
    'A4 Prescription':'A4 औषधपत्र','Invoice / Receipt':'बिल / पावती',
    'Patient Portal':'रुग्ण विभाग','Doctor Workstation':'डॉक्टर कार्यक्षेत्र',
    'Overview':'आढावा','Elderly care':'ज्येष्ठांची काळजी','Health library':'आरोग्य ग्रंथालय',
    'Health Library':'आरोग्य ग्रंथालय',
    'Referenced educational guides; check source and review status within each guide.':'संदर्भांसह आरोग्यविषयक लेख. प्रत्येक लेखातील मूळ स्रोत आणि पुनरावलोकनाची माहिती तपासा.',
    'Understanding changes':'समजून घेतल्याने','everything.':'दृष्टिकोन बदलतो.',
    'Find practical answers, recognise warning signs and prepare better questions for your doctor.':'उपयुक्त उत्तरे शोधा, धोक्याची लक्षणे ओळखा आणि डॉक्टरांना विचारायचे प्रश्न तयार करा.',
    'Search by condition, symptom or everyday concern':'आजार, लक्षण किंवा रोजच्या आरोग्यविषयक प्रश्नानुसार शोधा',
    'No matching topic yet. Try another term or ask the doctor.':'जुळणारा विषय सापडला नाही. दुसरा शब्द वापरा किंवा डॉक्टरांना विचारा.',
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
        if (node.parentElement?.closest('script,style,input,textarea,select,[contenteditable],.printable-sheet,.section-translator,.language-control,#wikiCardsGrid,#libraryTopicFilters,#libraryResultCount')) continue;
        if (!originals.has(node)) originals.set(node,node.nodeValue);
        const original = originals.get(node), text = original.trim();
        const label = text.replace(/^[^\p{L}\p{N}]+/u, '').replace(/\s*[→↗]$/, '');
        const key = mr[text] ? text : label;
        node.nodeValue = code === 'mr' && mr[key] ? original.replace(key,mr[key]) : original;
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
    if (scope.kind === 'library') {
      translateLabels(root,code,scope.kind);
      const search = root.querySelector('#wikiSearchInput');
      if (search) search.placeholder = code === 'mr' ? 'आरोग्य ग्रंथालयात शोधा…' : 'Search the library…';
      const filters = root.querySelector('#libraryTopicFilters');
      if (filters) filters.setAttribute('aria-label',code === 'mr' ? 'आरोग्यविषयक विषय निवडा' : 'Filter health topics');
      window.PatientEducationView?.setLibraryLanguage(code);
    }
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
