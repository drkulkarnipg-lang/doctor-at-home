/* Offer Google Translate for external health-source pages without replacing original links or duplicating existing translation actions. */
(()=>{'use strict';
// Keep the audited external URL-template line stable for the committed source inventory.
function translatedUrl(url,lang){return 'https://translate.google.com/translate?sl=auto&tl='+encodeURIComponent(lang)+'&u='+encodeURIComponent(url);}
function isTranslateLink(link){try{const u=new URL(link.href,location.href);return u.hostname==='translate.google.com'&&u.pathname==='/translate'&&u.searchParams.has('u');}catch{return false;}}
document.addEventListener('DOMContentLoaded',()=>{
 const root=document.getElementById('exploreHealthResources'),select=document.getElementById('sourceTranslateLanguage');if(!root||!select)return;
 const widget=document.getElementById('google_translate_element'),records=[];
 function updateLinks(){for(const r of records){r.action.href=translatedUrl(r.url,select.value||'mr');}}
 function syncLanguageOptions(){const combo=widget?.querySelector('.goog-te-combo');if(combo&&combo.options.length>=2){const prior=select.value,entries=[...combo.options].filter(o=>o.value).map(o=>[o.value,o.textContent.trim()]);if(entries.length){select.replaceChildren(...entries.map(([value,label])=>{const option=document.createElement('option');option.value=value;option.textContent=label;return option;}));select.value=entries.some(([value])=>value===prior)?prior:(entries.some(([value])=>value==='mr')?'mr':entries[0][0]);}}updateLinks();}
 function adjacentTranslation(link){let next=link.nextElementSibling,steps=0;while(next&&steps<3&&next.tagName!=='A'){next=next.nextElementSibling;steps++;}return next&&next.tagName==='A'&&isTranslateLink(next)?next:null;}
 for(const link of [...root.querySelectorAll('a[href]')]){
  let url;try{url=new URL(link.href,location.href);}catch{continue;}
  if(!['http:','https:'].includes(url.protocol)||url.origin===location.origin||url.hostname==='translate.google.com'||link.dataset.sourceTranslateProcessed)continue;
  let action=adjacentTranslation(link);
  if(action){if(action.dataset.sourceTranslateManaged)continue;action.dataset.sourceTranslateManaged='true';action.classList.add('source-translate-link');action.target='_blank';action.rel='noopener noreferrer';action.setAttribute('aria-label','Open a machine-translated version of '+(link.textContent.trim()||url.hostname));}
  else{action=document.createElement('a');action.className='source-translate-link';action.textContent='Translate ↗';action.target='_blank';action.rel='noopener noreferrer';action.dataset.sourceTranslateManaged='true';action.setAttribute('aria-label','Open a machine-translated version of '+(link.textContent.trim()||url.hostname));link.insertAdjacentElement('afterend',action);}
  link.dataset.sourceTranslateProcessed='true';records.push({action,url:url.href});
 }
 select.addEventListener('change',updateLinks);
 syncLanguageOptions();
 if(widget)new MutationObserver(syncLanguageOptions).observe(widget,{childList:true,subtree:true});
});
})();
