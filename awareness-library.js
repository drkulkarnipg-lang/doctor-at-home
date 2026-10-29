/* Shared, source-linked patient education. No patient information or external AI calls. */
(()=>{'use strict';const $=id=>document.getElementById(id),data=window.PatientEducation;let lang='en',selected='all',lastTrigger=null,current=null,sequence=0,automatic=false,previousBodyOverflow='',readerBackground=[];const make=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};const words={mr:{all:'सर्व विषय',read:'संपूर्ण लेख वाचा →',sources:'आधार आणि मूळ संदर्भ',faq:'मनातले प्रश्न',take:'लक्षात ठेवण्याची गोष्ट',review:'संदर्भ तपासले: २४ ऑक्टोबर २०२६ · वैयक्तिक उपचारासाठी आपल्या डॉक्टरांची योजना पाळा.',disclaimer:'ही माहिती समजून घेण्यासाठी आहे. आपल्या तपासण्या आणि परिस्थितीनुसार डॉक्टरांचा सल्ला घ्या. औषधे किंवा उपचार स्वतः बदलू नका. गंभीर त्रासासाठी वेबसाइटच्या उत्तराची वाट पाहू नका.',owner:'वेबसाइट: Dr. Pramod G. Kulkarni',count:(n,total)=>`${total} पैकी ${n} सविस्तर लेख`,policy:'लेखन आणि तपासणीची पद्धत'},en:{all:'All topics',read:'Read the complete guide →',sources:'Sources and further reading',faq:'Questions you may have',take:'What to remember',review:'English original · Sources checked: 24 October 2026 · Follow your clinician’s individual treatment plan.',disclaimer:'Educational information supports understanding. Individual advice depends on your situation and results. Do not change medicines or treatment on your own. Do not wait for a website reply in an emergency.',owner:'Website: Dr. Pramod G. Kulkarni',count:(n,total)=>`${n} of ${total} detailed guides`,policy:'How we prepare and review guidance'}};
function richParagraph(text){const p=make('p');const phrases=data.presentation.important.filter(x=>text.includes(x)).sort((a,b)=>b.length-a.length);let rest=text;while(rest){let hit=null,index=rest.length;for(const phrase of phrases){const at=rest.indexOf(phrase);if(at>=0&&at<index){hit=phrase;index=at;}}if(!hit){p.append(document.createTextNode(rest));break;}if(index)p.append(document.createTextNode(rest.slice(0,index)));p.append(make('strong','education-emphasis',hit));rest=rest.slice(index+hit.length);}return p;}
function sourceKeys(a,l){return [...new Set(a[l].sections.flatMap(s=>s.refs))];}
function content(a,l=lang){const prefix='education-'+a.key+'-'+(++sequence)+'-',v=a[l],w=words[l],out=make('article','education-article');out.lang=l;out.setAttribute('translate',automatic?'yes':'no');out.classList.toggle('notranslate',!automatic);out.dataset.educationKey=a.key;out.append(make('p','education-kicker',a.cat[l]),make('h1','education-title',v.title),make('p','education-standfirst',v.intro),make('p','article-review-note',w.review));const toc=make('nav','education-toc');toc.setAttribute('aria-label',l==='mr'?'या लेखात':'In this guide');v.sections.forEach((s,i)=>{const a=make('a','',s.heading);a.href='#'+prefix+i;a.onclick=e=>{e.preventDefault();out.querySelectorAll('.education-section')[i].scrollIntoView?.({block:'start',behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});};toc.append(a);});out.append(toc);v.sections.forEach((s,i)=>{const section=make('section','education-section'+(s.kind==='urgent'?' education-urgent':''));section.id=prefix+i;section.append(make('h2','',s.heading),richParagraph(s.text));if(s.kind==='urgent'){section.setAttribute('aria-label',l==='mr'?'तातडीची मदत':'Urgent help');const emergency=make('p','education-emergency',l==='mr'?'जीवाला धोका असलेल्या स्थितीत भारतात ११२ वर संपर्क करा. इतर देशांत स्थानिक आपत्कालीन क्रमांक वापरा.':'For a life-threatening emergency in India, call 112. Elsewhere use your local emergency number.');section.append(emergency);}out.append(section);});out.append(make('h2','',w.faq));for(const [q,answer]of v.faq){const d=make('details','education-question'),s=make('summary','',q);d.open=true;d.append(s,make('p','',answer));out.append(d);}const takeaway=make('aside','education-takeaway');takeaway.append(make('h2','',w.take),richParagraph(v.takeaway));out.append(takeaway,make('h2','',w.sources));const refs=make('ol','education-references');for(const k of [...sourceKeys(a,l),'emergency']){const [label,url]=data.sources[k],li=make('li'),link=make('a','',label+' ↗');link.href=url;link.target='_blank';link.rel='noopener noreferrer';li.append(link);refs.append(li);}out.append(refs,make('p','education-disclaimer',w.disclaimer),make('p','article-owner',w.owner));const policy=make('a','article-policy-link',w.policy+' ↗');policy.href='editorial-policy.html';policy.target='_blank';policy.rel='noopener noreferrer';out.append(policy);return out;}
function filters(){const box=$('libraryTopicFilters');box.replaceChildren();for(const cat of ['all',...new Set(data.articles.map(t=>t.cat.en))]){const b=make('button','',cat==='all'?words[lang].all:data.articles.find(t=>t.cat.en===cat).cat[lang]);b.type='button';b.setAttribute('aria-pressed',String(cat===selected));b.onclick=()=>{selected=cat;filters();render();};box.append(b);}}
function render(){if(!$('wikiCardsGrid'))return;const q=$('wikiSearchInput').value.trim().toLocaleLowerCase(),items=data.articles.filter(t=>(selected==='all'||t.cat.en===selected)&&`${t.mr.title} ${t.en.title} ${t.mr.intro} ${t.en.intro} ${t.keywords} ${t.cat.mr} ${t.cat.en}`.toLocaleLowerCase().includes(q)),grid=$('wikiCardsGrid');grid.replaceChildren();for(const t of items){const card=make('article','wiki-card');card.lang=lang;card.setAttribute('translate',automatic?'yes':'no');card.classList.toggle('notranslate',!automatic);card.append(make('span','awareness-category',t.cat[lang]),make('h4','',t[lang].title),make('p','',t[lang].intro));const b=make('button','',words[lang].read);b.type='button';b.onclick=()=>window.openWikiModal(t.id);card.append(b);grid.append(card);}$('libraryResultCount').textContent=words[lang].count(items.length,data.articles.length);$('libraryNoResults').hidden=!!items.length;}
function translatorMount(){/* The global header selector must stay in the header. */}
function syncLanguageControls(){/* No duplicate Marathi-only selectors; use the global language dropdown. */}
function refreshOpenArticle(){if(!current)return;$('wikiModalTitle').textContent=current[lang].title;$('wikiModalContent').replaceChildren(content(current));$('wikiModalContent').scrollTop=0;}
function syncLanguageControls(){document.querySelectorAll('[data-library-language]').forEach(b=>b.setAttribute('aria-pressed',String(!automatic&&b.dataset.libraryLanguage===lang)));const engine=$('google_translate_element')?.querySelector('.goog-te-combo');if(engine){engine.id='patientReaderLanguage';engine.setAttribute('aria-label','Translate patient articles into another language');}const ready=!!engine;const message=!ready?'English and Marathi are ready here. The other-language menu is loading; if it does not appear, use your browser Translate option.':automatic?'Automatic translation selected. Check medical meaning against the English original.':'English original and authored Marathi are available here. For other languages, use the translation menu below.';document.querySelectorAll('[data-reader-language-status]').forEach(p=>p.textContent=message);}
function setupLanguageControls(){for(const [id,hostId,heading]of [['patientLanguageControls','patientArticleTranslator','Patient Portal · language / भाषा'],['articleLanguageControls','openArticleTranslator','Read this article in your language / लेखाची भाषा']]){const panel=make('section','patient-language-controls no-print notranslate');panel.id=id;panel.setAttribute('translate','no');const h=make('h2','',heading);h.id=id+'Title';panel.setAttribute('aria-labelledby',h.id);panel.append(h);const actions=make('div','education-languages');for(const [code,label]of [['en','English — original'],['mr','मराठी']]){const b=make('button','',label);b.type='button';b.dataset.libraryLanguage=code;b.onclick=()=>{window.PatientEducationView.setLanguage(code);const combo=$('google_translate_element')?.querySelector('.goog-te-combo');if(combo)combo.value='';};actions.append(b);}panel.append(actions);const mount=make('div','reader-translation-mount');mount.id=hostId;const label=make('label','','Other languages — automatic translation');label.htmlFor='patientReaderLanguage';panel.append(label,mount);const status=make('p','reader-language-status');status.dataset.readerLanguageStatus='';status.setAttribute('role','status');status.setAttribute('aria-live','polite');panel.append(status);if(id==='patientLanguageControls')$('wikiSection').before(panel);else $('wikiModalContent').before(panel);}
const header=document.querySelector('.language-control>div');if(header){const link=make('a','','Open Patient Portal language controls ↓');link.href='#patientLanguageControls';link.onclick=()=>{document.querySelector('.language-control').open=false;};header.append(link);}const languageMenu=document.querySelector('.language-control');const positionLanguageMenu=()=>{if(!languageMenu?.open)return;const menu=languageMenu.querySelector(':scope>div'),r=languageMenu.getBoundingClientRect();if(!menu)return;const width=Math.min(290,window.innerWidth-40),left=Math.max(20,Math.min(r.left,window.innerWidth-width-20)),top=Math.max(12,Math.min(r.bottom+8,window.innerHeight-menu.offsetHeight-12));menu.style.setProperty('--language-left',left+'px');menu.style.setProperty('--language-top',top+'px');};languageMenu?.addEventListener('toggle',positionLanguageMenu);window.addEventListener('resize',positionLanguageMenu);const closeLanguageMenu=()=>{if(languageMenu)languageMenu.open=false;};document.addEventListener('pointerdown',e=>{if(languageMenu&&!languageMenu.contains(e.target))closeLanguageMenu();});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLanguageMenu();});document.querySelectorAll('.portal-nav a').forEach(a=>a.addEventListener('click',closeLanguageMenu));window.addEventListener('hashchange',closeLanguageMenu);translatorMount(false);syncLanguageControls();const widget=$('google_translate_element');if(widget)new MutationObserver(syncLanguageControls).observe(widget,{childList:true,subtree:true});
document.addEventListener('change',e=>{if(!e.target.matches('.goog-te-combo'))return;const code=e.target.value;if(!code)return;if(['en','mr'].includes(code)){e.preventDefault();e.stopImmediatePropagation();window.PatientEducationView.setLanguage(code);return;}window.PatientEducationView.setLanguage('en',true);},true);
}
window.openWikiModal=id=>{
 const a=data.get(id);if(!a)return;
 const dialog=$('wikiModal'),body=$('wikiModalContent');
 if(!current)lastTrigger=document.activeElement;
 current=a;lang='en';automatic=false;
 $('wikiModalTitle').textContent=a.en.title;
 body.replaceChildren(content(a,'en'));body.scrollTop=0;
 if(!dialog.open){
   previousBodyOverflow=document.body.style.overflow;
   readerBackground=[...document.querySelectorAll('.site-header,#publicPortal,#doctorWorkstation')].map(el=>({el,inert:el.inert}));
   readerBackground.forEach(({el})=>el.inert=true);
   dialog.showModal();
   history.pushState({...(history.state||{}),wikiReader:true,articleKey:a.key},'','#article-'+encodeURIComponent(a.key));
   window._wikiReaderHistoryEntry=true;
 }
 body.focus({preventScroll:true});
};
window.closeWikiModal=(fromHistory=false)=>{
 const dialog=$('wikiModal'),hadHistory=!!window._wikiReaderHistoryEntry;
 window._wikiReaderHistoryEntry=false;
 if(dialog.open)dialog.close();
 current=null;document.body.style.overflow=previousBodyOverflow;
 readerBackground.forEach(({el,inert})=>el.inert=inert);readerBackground=[];
 lastTrigger?.focus?.({preventScroll:true});
 if(hadHistory&&!fromHistory&&location.hash.startsWith('#article-'))history.back();
};
window.PatientEducationView={content,get language(){return lang;},get automatic(){return automatic;},get current(){return current?.key||null;},setLanguage(l,machine=false){if(!words[l])return;lang=l;automatic=machine;filters();render();window.renderPublishedArticles?.();refreshOpenArticle();syncLanguageControls();}};
document.addEventListener('DOMContentLoaded',()=>{
 const dialog=$('wikiModal');
 filters();render();
 $('wikiSearchInput').addEventListener('input',render);
 dialog.addEventListener('click',e=>{if(e.target===dialog)window.closeWikiModal();});
 dialog.addEventListener('cancel',e=>{e.preventDefault();window.closeWikiModal();});
 const status=$('translationStatus');
 if(status)status.textContent='English is the original language. Choose any language available in the header dropdown for automatic translation; clinical meaning may not be exact, so check important details against the English original.';
 let reapplyTranslation=false;
 document.addEventListener('change',e=>{
   if(!e.target.matches('.goog-te-combo'))return;
   const code=e.target.value;
   if(!code||code==='en'){window.PatientEducationView.setLanguage('en',false);return;}
   window.PatientEducationView.setLanguage('en',true);
   if(!reapplyTranslation){reapplyTranslation=true;setTimeout(()=>{const combo=$('google_translate_element')?.querySelector('.goog-te-combo');if(combo&&combo.value&&combo.value!=='en')combo.dispatchEvent(new Event('change',{bubbles:true}));reapplyTranslation=false;},0);}
 },true);
 $('doctorWorkstation').classList.add('notranslate');$('doctorWorkstation').setAttribute('translate','no');
 $('bookingSection').querySelectorAll('input,textarea').forEach(e=>{e.classList.add('notranslate');e.setAttribute('translate','no');});
 $('healthGlobalSearchForm').onsubmit=e=>{
   e.preventDefault();selected='all';filters();
   $('wikiSearchInput').value=$('healthGlobalSearch').value;render();
   document.querySelector('[data-portal-view="health-library"]')?.click();
   $('wikiSearchInput').focus({preventScroll:true});
 };
});

})();
