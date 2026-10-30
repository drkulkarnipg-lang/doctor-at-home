/* Offer Google Translate for external health-source pages without replacing the original source link. */
(()=>{'use strict';
const languages=[['mr','Marathi'],['hi','Hindi'],['gu','Gujarati'],['bn','Bengali'],['ta','Tamil'],['te','Telugu'],['kn','Kannada'],['ml','Malayalam'],['ur','Urdu'],['pa','Punjabi'],['or','Odia'],['as','Assamese'],['ne','Nepali'],['fr','French'],['es','Spanish'],['ar','Arabic'],['zh-CN','Chinese (Simplified)']];
function translatedUrl(url,lang){return 'https://translate.google.com/translate?sl=auto&tl='+encodeURIComponent(lang)+'&u='+encodeURIComponent(url);}
document.addEventListener('DOMContentLoaded',()=>{
 const root=document.getElementById('exploreHealthResources'),select=document.getElementById('sourceTranslateLanguage');if(!root||!select)return;
 const widget=document.getElementById('google_translate_element');
 function syncLanguageOptions(){const combo=widget?.querySelector('.goog-te-combo');if(!combo||combo.options.length<2)return;const prior=select.value;const entries=[...combo.options].filter(o=>o.value).map(o=>[o.value,o.textContent.trim()]);if(!entries.length)return;select.replaceChildren(...entries.map(([value,label])=>{const option=document.createElement('option');option.value=value;option.textContent=label;return option;}));select.value=entries.some(([value])=>value===prior)?prior:(entries.some(([value])=>value==='mr')?'mr':entries[0][0]);}
 syncLanguageOptions();if(widget)new MutationObserver(syncLanguageOptions).observe(widget,{childList:true,subtree:true});
 for(const link of [...root.querySelectorAll('a[href]')]){
  let url;try{url=new URL(link.href,location.href);}catch{continue;}
  if(!['http:','https:'].includes(url.protocol)||url.origin===location.origin||url.hostname==='translate.google.com'||link.dataset.sourceTranslateAdded)continue;
  const action=document.createElement('a');action.className='source-translate-link';action.textContent='Translate ↗';action.target='_blank';action.rel='noopener noreferrer';action.dataset.sourceTranslateAdded='true';action.setAttribute('aria-label','Open a machine-translated version of '+(link.textContent.trim()||url.hostname));const update=()=>{action.href=translatedUrl(url.href,select.value||'mr');};select.addEventListener('change',update);update();link.insertAdjacentElement('afterend',action);
 }
});
})();