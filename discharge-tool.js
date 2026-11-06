/* Discharge checklist: session only, patient-entered information, no clinical score. */
(function(){
'use strict';
const items=[
 ['summary','डिस्चार्ज सारांश व संपर्क उपलब्ध आहेत','निदान, उपचार आणि मदतीचा संपर्क एकत्र ठेवल्याने पुढील डॉक्टरांना माहिती मिळते.'],
 ['medicines','औषधांची नवीन यादी समजली व औषधे उपलब्ध आहेत','जुनी, बंद केलेली आणि नवीन औषधे यांचा ताळमेळ डॉक्टर किंवा pharmacist कडून तपासल्याने चुका कमी होतात.'],
 ['teachback','काळजीवाहकाने सूचना स्वतःच्या शब्दांत सांगून दाखवल्या','फक्त होकारापेक्षा प्रत्यक्ष समज तपासणे महत्त्वाचे आहे.'],
 ['food','आहार, पाणी व गिळण्याबाबत वैयक्तिक सूचना स्पष्ट आहेत','मूत्रपिंड, हृदय आणि गिळण्याच्या अडचणींनुसार सूचना बदलतात.'],
 ['equipment','लागणारी उपकरणे व त्यांचे प्रशिक्षण उपलब्ध आहे','वापरण्याचे प्रशिक्षण व बिघाड झाल्यास संपर्क आवश्यक असतो. लागू नसल्यास तसे नोंदवा.'],
 ['mobility','हालचाल, त्वचेची काळजी व मदतीची व्यवस्था ठरली आहे','पडण्याचा धोका, त्वचा आणि हालचालीची क्षमता यानुसार योजना ठरते; सर्वांना एकच वेळापत्रक लागू नाही.'],
 ['results','प्रलंबित अहवाल कोण तपासणार हे ठरले आहे','तपासणी झाली म्हणजे अहवाल तपासला आणि त्यावर निर्णय झाला असे नसते.'],
 ['visit','पुढील भेट व प्रवासाची व्यवस्था निश्चित आहे','वेळ, जागा आणि जाण्याची व्यवस्था स्पष्ट असल्यास follow-up चुकण्याची शक्यता कमी होते.']
];
function mount(){
 const host=document.getElementById('portalPanelTools');if(!host||document.getElementById('dischargeTool'))return;
 const el=document.createElement('section');el.id='dischargeTool';el.className='care-guidance';el.lang='mr';
 el.innerHTML=`<h3>घरी परतल्यानंतरची काळजी</h3><p>Discharge-to-Home Checklist · सूचना → कृती → पुनर्तपासणी</p><p class="cg-notice">ही नोंद फक्त या उघड्या पानापुरती राहते. बंद किंवा refresh करण्यापूर्वी डाउनलोड करा. डॉक्टरांना कोणताही संदेश आपोआप पाठवला जात नाही. ही checklist म्हणजे निदान, discharge clearance किंवा सुरक्षिततेचे प्रमाणपत्र नाही.</p>
 <form id="dtForm"><div class="cg-grid"><label>रुग्णाचा कोड (पूर्ण नाव टाळा)<input name="reference" maxlength="60" required></label><label>नोंदीची तारीख<input name="date" type="date" required></label></div>
 <label>आज नवीन किंवा वाढलेला त्रास आहे का?<select name="symptoms" required><option value="">निवडा</option><option value="none">नवीन त्रास नोंदवलेला नाही</option><option value="changed">नवीन / वाढलेला त्रास</option><option value="urgent">तीव्र श्वासाचा त्रास, शुद्ध हरपणे, छातीत तीव्र दुखणे, झटका किंवा जोरदार रक्तस्राव</option></select></label><p id="dtAlert" role="alert"></p>
 ${items.map(([id,label,why])=>`<fieldset><legend>${label}</legend><details><summary>हा नियम का?</summary><p>${why}</p></details><label>स्थिती<select name="${id}" required><option value="">अजून तपासले नाही</option><option value="done">झाले / समजले</option><option value="issue">अडचण आहे / मदत हवी</option><option value="na">लागू नाही</option></select></label></fieldset>`).join('')}
 <h4>पुढील तपासणी किंवा भेट</h4><p>डिस्चार्ज सूचना किंवा डॉक्टरांनी दिलेली तारीख नोंदवा. तारीख ठरलेली नसेल तर ती बाकी कामांत दिसेल.</p><label>काय करायचे आणि का?<input name="action" maxlength="300"></label><label>तारीख<input name="due" type="date"></label><label>अहवाल / भेटीची जबाबदारी कोणाकडे?<input name="owner" maxlength="150"></label><label>स्थिती<select name="followup"><option value="pending">बाकी आहे</option><option value="performed">तपासणी / भेट झाली; निर्णय बाकी</option><option value="reviewed">निर्णय समजावून सांगितला</option></select></label>
 <label>आजची नोंद / डॉक्टरांना विचारायचे प्रश्न<textarea name="notes" maxlength="2000" rows="3"></textarea></label>
 <button type="submit">आजचा सारांश तयार करा</button><button type="button" id="dtDownload">नोंद डाउनलोड करा</button><button type="button" id="dtReset">नवीन रुग्ण / नोंद पुसा</button></form>
 <p id="dtStatus" role="status"></p><div id="dtSummary" aria-live="polite"></div>
 <details><summary>आधार व मर्यादा</summary><p>आपल्या Discharge-to-Home toolkit मधील discharge summary व औषध-ताळमेळ विभागांवर आधारित. ही पहिली checklist आहे; सर्व PDF मजकूर किंवा सर्व आजारांचे नियम यात समाविष्ट नाहीत. तपासणीची वारंवारता, औषधांचा dose, पाणी आणि repositioning interval आपोआप ठरवले जात नाहीत.</p><p><a href="assets/articles/discharge-to-home-care-toolkit.pdf" target="_blank" rel="noopener">मूळ Toolkit PDF</a> · <a href="https://www.ahrq.gov/patient-safety/settings/hospital/red/toolkit/redtool3a.html" target="_blank" rel="noopener">AHRQ discharge planning</a> · <a href="https://www.nice.org.uk/guidance/cg179/chapter/Recommendations" target="_blank" rel="noopener">NICE skin care guidance</a></p><p>आवृत्ती: 6 नोव्हेंबर 2026. मूळ PDF बदललेले नाहीत. उपचार करणाऱ्या डॉक्टरांचा वैयक्तिक आराखडा आवश्यक.</p></details>`;
 host.prepend(el);const form=el.querySelector('form'),get=id=>document.getElementById(id);let saved=null;
 const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 function alert(){get('dtAlert').textContent=form.elements.symptoms.value==='urgent'?'तातडीची मदत घ्या. Checklist पूर्ण करण्यासाठी किंवा डॉक्टरांच्या उत्तरासाठी थांबू नका; आपत्कालीन सेवांशी संपर्क करा.':form.elements.symptoms.value==='changed'?'उपचार करणाऱ्या डॉक्टरांशी संपर्क करून पुढील कृती ठरवा. त्रास तीव्र असल्यास तातडीची मदत घ्या.':'';}
 function invalidate(){saved=null;get('dtSummary').replaceChildren();get('dtStatus').textContent='बदल नोंदवले. सारांश पुन्हा तयार करा.';alert();}
 form.addEventListener('input',invalidate);form.addEventListener('change',invalidate);
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;
 const values=Object.fromEntries(new FormData(form));if(values.date>today()){get('dtStatus').textContent='भविष्यातील दैनंदिन नोंद स्वीकारता येत नाही.';return;}
 const missing=items.filter(([id])=>values[id]==='issue').map(([,label])=>label);
 if(!values.action||!values.due||!values.owner)missing.push('पुढील कृती, तारीख किंवा जबाबदार व्यक्तीची माहिती अपूर्ण आहे.');
 if(values.due&&values.due<today()&&values.followup!=='reviewed')missing.push('नियोजित तारीख उलटली आहे; follow-up पूर्ण करून निर्णय नोंदवा.');
 if(values.followup==='performed')missing.push('तपासणी / भेट झाली; पुढील निर्णय व त्याचे स्पष्टीकरण बाकी आहे.');
 if(values.symptoms!=='none')missing.unshift('नवीन त्रासाची नोंद: वरील कृती-सूचना पाळा.');
 saved={schemaVersion:1,tool:'discharge-checklist',createdAt:new Date().toISOString(),values,pending:missing};
 const p=document.createElement('p');p.textContent=missing.length?'डॉक्टरांसोबत पूर्ण करायची कामे:':'या नोंदीत अडचण दाखवलेली नाही. याचा अर्थ रुग्ण स्थिर आहे किंवा सर्व clinical review पूर्ण झाले असा नाही.';get('dtSummary').replaceChildren(p);
 const ul=document.createElement('ul');missing.forEach(text=>{const li=document.createElement('li');li.textContent=text;ul.append(li);});get('dtSummary').append(ul);get('dtStatus').textContent='सारांश तयार. ही माहिती डॉक्टरांना स्वतः दाखवा.';
 });
 get('dtDownload').onclick=()=>{if(!saved){get('dtStatus').textContent='प्रथम आजचा सारांश तयार करा.';return;}const url=URL.createObjectURL(new Blob([JSON.stringify(saved,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='discharge-checklist-'+saved.values.date+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 function reset(){form.reset();form.elements.date.value=today();saved=null;get('dtSummary').replaceChildren();get('dtStatus').textContent='';alert();}
 get('dtReset').onclick=()=>{if(window.confirm('ही नोंद पुसायची? आवश्यक असल्यास आधी डाउनलोड करा.'))reset();};window.addEventListener('clinic-owner-signed-out',reset);document.addEventListener('change',e=>{if(e.target.id==='cloudPatientSelect')reset();});reset();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
