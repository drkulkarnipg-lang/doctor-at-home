/* Restored live-site features absent from the GitHub base. */
const LIVE_SITE_DRUGS = [
      { cat: "Antiplatelet", generic: "Aspirin 75mg / 150mg", brands: "Ecosprin 75/150, Loprin, Delisprin", timing: "After Food", freq: "0-1-0", days: 30, advice: "After lunch with water" },
      { cat: "Antiplatelet", generic: "Clopidogrel 75mg", brands: "Clopilet 75, Deplatt 75, Plavix", timing: "After Food", freq: "0-1-0", days: 30, advice: "Secondary CAD/stroke prevention" },
      { cat: "Antiplatelet", generic: "Prasugrel 5mg / 10mg", brands: "Prasita, Prax, Prasulet, Effient", timing: "After Food", freq: "1-0-0", days: 30, advice: "Potent antiplatelet post-PCI" },
      { cat: "Antiplatelet", generic: "Ticagrelor 90mg", brands: "Brilinta, Axcer, Ticasave", timing: "After Food", freq: "1-0-1", days: 30, advice: "Reversible P2Y12 inhibitor" },
      { cat: "Anticoagulant (DOAC)", generic: "Rivaroxaban 10mg / 15mg / 20mg", brands: "Xarelto, Rivara, Xaroban", timing: "With Food", freq: "1-0-0", days: 30, advice: "With evening meal" },
      { cat: "Anticoagulant (DOAC)", generic: "Apixaban 2.5mg / 5mg", brands: "Eliquis, Apigat, Afixar", timing: "After Food", freq: "1-0-1", days: 30, advice: "Twice daily Factor Xa inhibitor" },
      { cat: "Anticoagulant (DOAC)", generic: "Dabigatran 110mg / 150mg", brands: "Pradaxa, Dabiplus, Dabigo", timing: "After Food", freq: "1-0-1", days: 30, advice: "Direct thrombin inhibitor" },
      { cat: "Anticoagulant", generic: "Warfarin 2mg / 5mg", brands: "Warf, Uniwarf, Coumadin", timing: "Bedtime", freq: "0-0-1", days: 30, advice: "Titrate strictly by PT/INR" },
      { cat: "Injectable Anticoagulant", generic: "Inj Enoxaparin 40mg / 60mg SC", brands: "Clexane, Lonopin, Lovenox", timing: "Subcutaneous", freq: "OD / BD", days: 5, advice: "Deep subcutaneous abdominal injection" },
      { cat: "Injectable Anticoagulant", generic: "Inj Fondaparinux 2.5mg SC", brands: "Arixtra, Fondared, Fondanest", timing: "Subcutaneous", freq: "OD", days: 5, advice: "Factor Xa synthetic inhibitor" },
      { cat: "Injectable Anticoagulant", generic: "Inj Argatroban (For HIT)", brands: "Arganova, Novastan", timing: "IV Infusion", freq: "Titrated", days: 3, advice: "In Heparin Induced Thrombocytopenia" },
      { cat: "Antianginal", generic: "Glyceryl Trinitrate 2.6mg / 6.4mg CR", brands: "Nitrocontin, Angispan-TR", timing: "After Food", freq: "1-0-1", days: 30, advice: "Do not crush tablet" },
      { cat: "Antianginal", generic: "Isosorbide Mononitrate 30mg / 60mg SR", brands: "Monotrate, Imdur, Ismo", timing: "Morning", freq: "1-0-0", days: 30, advice: "Asymmetric dosing prevents tolerance" },
      { cat: "Antianginal", generic: "Nicorandil 5mg / 10mg", brands: "Nikoran, Korandil, K-Nic", timing: "After Food", freq: "1-0-1", days: 30, advice: "K-ATP channel opener" },
      { cat: "Antianginal", generic: "Ranolazine 500mg ER", brands: "Rancad, Ranozex, Ranx", timing: "After Food", freq: "1-0-1", days: 30, advice: "Late sodium current inhibitor" },
      { cat: "Antianginal", generic: "Ivabradine 5mg", brands: "Bradia, Ivabrad, Coralan", timing: "With Food", freq: "1-0-1", days: 30, advice: "For resting HR > 70 bpm" },
      { cat: "Antianginal", generic: "Trimetazidine 35mg MR", brands: "Flavedon MR, Carvidon MR", timing: "With Food", freq: "1-0-1", days: 30, advice: "Myocardial metabolic cytoprotective" },
      { cat: "SGLT2 Inhibitor", generic: "Dapagliflozin 10mg", brands: "Forxiga, Oxra, Dapaone", timing: "Morning", freq: "1-0-0", days: 30, advice: "Proven in HFrEF & CKD" },
      { cat: "SGLT2 Inhibitor", generic: "Empagliflozin 10mg / 25mg", brands: "Jardiance, Gibtulio", timing: "Morning", freq: "1-0-0", days: 30, advice: "Cardiorenal mortality protection" },
      { cat: "GLP-1 RA", generic: "Inj / Tab Semaglutide", brands: "Ozempic, Rybelsus, Wegovy", timing: "Empty Stomach", freq: "OD / Weekly", days: 30, advice: "Cardioprotection & glycemic control" },
      { cat: "Statin", generic: "Atorvastatin 10mg / 20mg / 40mg", brands: "Atorva, Storvas, Lipitor", timing: "Bedtime", freq: "0-0-1", days: 30, advice: "High intensity statin" },
      { cat: "Statin", generic: "Rosuvastatin 10mg / 20mg", brands: "Rosuvas, Rozavel, Crestor", timing: "Bedtime", freq: "0-0-1", days: 30, advice: "Potent LDL lowering" },
      { cat: "Lipid Lowering", generic: "Bempedoic Acid 180mg", brands: "Brillo, Bemdac", timing: "With Food", freq: "1-0-0", days: 30, advice: "For statin-intolerant CAD" },
      { cat: "Lipid Lowering", generic: "Bempedoic Acid + Ezetimibe", brands: "Brillo-EZ, Bemdac-EZ", timing: "With Food", freq: "1-0-0", days: 30, advice: "Dual non-statin LDL reduction" },
      { cat: "Fibrate", generic: "Fenofibrate 145mg / 160mg", brands: "Lipicard, Stanlip", timing: "With Food", freq: "0-0-1", days: 30, advice: "For severe hypertriglyceridemia" },
      { cat: "ARNI (हार्ट फेल्युअर)", generic: "Sacubitril 24mg + Valsartan 26mg", brands: "Cidmus 50, Vymada 50, Arnipin", timing: "After Food", freq: "1-0-1", days: 30, advice: "HFrEF guideline cornerstone, check BP" },
      { cat: "Non-Steroidal MRA", generic: "Finerenone 10mg / 20mg", brands: "Firialta, Kerendia, Fineren", timing: "With Food", freq: "1-0-0", days: 30, advice: "CKD + T2DM protection" },
      { cat: "MRA Diuretic", generic: "Eplerenone 25mg / 50mg", brands: "Eptus, Planep, Eplecard", timing: "After Food", freq: "1-0-0", days: 30, advice: "Post-MI aldosterone blockade" },
      { cat: "Loop Diuretic", generic: "Torsemide 10mg + Spironolactone 50mg", brands: "Dytor-Plus, Torget-Plus", timing: "Morning", freq: "1-0-0", days: 15, advice: "After breakfast, track urine volume" },
      { cat: "Beta Blocker", generic: "Bisoprolol 2.5mg / 5mg", brands: "Concor, Bisoheart", timing: "Morning", freq: "1-0-0", days: 30, advice: "Cardioselective beta-1 blocker" },
      { cat: "Beta Blocker", generic: "Metoprolol Succinate 25mg / 50mg ER", brands: "Betaloc-XL, Metolar-XR", timing: "Morning", freq: "1-0-0", days: 30, advice: "Extended release CAD & HTN" },
      { cat: "Beta Blocker", generic: "Carvedilol 3.125mg / 6.25mg", brands: "Carca, Cardivas", timing: "With Food", freq: "1-0-1", days: 30, advice: "For HFrEF guideline therapy" },
      { cat: "Beta Blocker", generic: "Nebivolol 2.5mg / 5mg", brands: "Nebicard, Nebistar", timing: "Morning", freq: "1-0-0", days: 30, advice: "Nitric oxide vasodilating beta blocker" },
      { cat: "ARB", generic: "Telmisartan 40mg / 80mg", brands: "Telma, Telmikind, Sartel", timing: "Morning", freq: "1-0-0", days: 30, advice: "24-hour BP control" },
      { cat: "CCB", generic: "Azelnidipine 8mg / 16mg", brands: "Azulix, Azovas, Azeldac", timing: "After Food", freq: "1-0-0", days: 30, advice: "Zero pedal edema CCB" },
      { cat: "CCB", generic: "Benidipine 4mg / 8mg", brands: "Benitres, Caritec", timing: "After Food", freq: "1-0-0", days: 30, advice: "Triple channel blocker, renal friendly" },
      { cat: "CCB + ARB", generic: "Cilnidipine 10mg + Telmisartan 40mg", brands: "Telma-C, Cilacar-T", timing: "Morning", freq: "1-0-0", days: 30, advice: "Dual action BP controller" },
      { cat: "Neuroprotection", generic: "Citicoline 500mg", brands: "Stoline, Ceham, Citistar", timing: "After Food", freq: "1-0-1", days: 30, advice: "Membrane phospholipid repair" },
      { cat: "Antioxidant", generic: "Alpha Lipoic Acid + Methylcobalamin", brands: "Rejunuron-Plus, Nervijen", timing: "After Food", freq: "1-0-0", days: 30, advice: "Diabetic neuropathy & bedridden care" },
      { cat: "Topical Bedsore", generic: "Silver Sulfadiazine 1% + Chlorhexidine", brands: "Silvazine, Silverex Ionic, Rexil", timing: "External", freq: "BD", days: 14, advice: "Apply on ulcer after sterile NS wash" }
    ];
    function toggleChatbot() { document.getElementById('chatbotWindow').classList.toggle('hidden'); }
    function openCredentialsModal() { document.getElementById('credentialsModal').classList.remove('hidden'); }
    function closeCredentialsModal() { document.getElementById('credentialsModal').classList.add('hidden'); }
    function sendChatMessage() {
      const input = document.getElementById('chatInput');
      const val = input.value.trim();
      if(!val) return;
      const msgBox = document.getElementById('chatMessages');

      const userDiv = document.createElement('div');
      userDiv.className = "bg-[#0D9488] text-white p-2.5 rounded-2xl max-w-[85%] ml-auto text-right font-medium";
      userDiv.innerText = val;
      msgBox.appendChild(userDiv);
      input.value = "";

      setTimeout(() => {
        const botDiv = document.createElement('div');
        botDiv.className = "bg-slate-100 p-2.5 rounded-2xl max-w-[85%] text-slate-800 leading-relaxed";
        if(val.toLowerCase().includes('chest') || val.toLowerCase().includes('breath') || val.toLowerCase().includes('stroke') || val.toLowerCase().includes('dhad') || val.toLowerCase().includes('धडधड') || val.toLowerCase().includes('दम')) {
          botDiv.innerHTML = "🚨 <strong>URGENT MEDICAL ALERT:</strong> Severe cardiopulmonary symptoms detected. Please call 108 or contact Dr. Kulkarni directly at <a href='tel:+919822594341' class='text-red-700 font-bold underline'>9822594341</a> for bedside ICU support.";
        } else {
          botDiv.innerText = "Understood. Dr. Kulkarni provides 24x7 home ICU visits across Pune from Dhayari base. Daytime visit starts at ₹1,200. Connect on WhatsApp: 9822594341.";
        }
        msgBox.appendChild(botDiv);
        msgBox.scrollTop = msgBox.scrollHeight;
      }, 400);
    }
    function renderPublicArticles() {
      const container = document.getElementById('publicArticlesList');
      container.innerHTML = '';
      const defaults = [
        { title: "हार्ट फेल्युअर: पाण्याचे नियंत्रण व दैनंदिन वजन", cat: "हार्ट फेल्युअर", body: "२४ तासांत पाणी १.२ लिटर मर्यादेत ठेवावे. वरून मीठ, पापड, लोणचे पूर्ण बंद करावे. दररोज सकाळी उपाशीपोटी वजन करावे; २ दिवसांत १.५ किलो वजन वाढल्यास डॉक्टरांना कळवावे." },
        { title: "CKD मध्ये नारळ पाणी का टाळावे?", cat: "किडनी केअर", body: "किडनी निकामी असल्यास अतिरिक्त पोटॅशियम बाहेर पडत नाही. नारळ पाण्यात भरपूर पोटॅशियम असल्याने अचानक कार्डिॲक अरेस्टचा धोका असतो. भाज्या उकळून पाणी फेकून द्यावे." },
        { title: "बेडरीडन रुग्णांची काळजी: २ तासांचे टर्निंग क्लॉक", cat: "बेडसोअर", body: "एकाच स्थितीत पडून राहिल्याने सेक्रमवर जखम होते. दर २ तासांनी कूस बदलावी, एअर मॅट्रेस वापरावी आणि जखमेवर नॉर्मल सलाइनने स्वच्छता ठेवावी." }
      ];
      const custom = JSON.parse(localStorage.getItem('patientArticles') || '[]');
      const all = [...custom, ...defaults];

      all.forEach(art => {
        const div = document.createElement('div');
        div.className = "p-5 bg-slate-50 border rounded-2xl space-y-2 flex flex-col justify-between";
        div.innerHTML = `
          <div>
            <span class="text-[10px] bg-teal-100 text-teal-900 font-bold px-2.5 py-0.5 rounded-full uppercase">${art.cat}</span>
            <h4 class="font-bold text-sm text-[#0F2942] mt-2">${art.title}</h4>
            <p class="text-xs text-slate-600 mt-1 leading-relaxed">${art.body}</p>
          </div>
          <button onclick="shareDirectArticleWhatsApp('${encodeURIComponent(art.title)}', '${encodeURIComponent(art.body)}')" class="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-xl text-[11px] flex items-center justify-center gap-1.5 shadow-sm">
            <i class="fa-brands fa-whatsapp"></i> Share on WhatsApp
          </button>
        `;
        container.appendChild(div);
      });
    }
    function shareDirectArticleWhatsApp(title, body) {
      const msg = `*PATIENT HEALTH GUIDANCE — DR. PRAMOD G. KULKARNI*\n(Home Visiting ICU Doctor Pune | Mob: 9822594341)\n\n*${decodeURIComponent(title)}*\n\n${decodeURIComponent(body)}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    }

// Merge live and repository medicine lists, preserving existing browser customDrugs.
function getAllDrugs() {
  let custom=[];try{custom=JSON.parse(localStorage.getItem('customDrugs')||'[]');}catch{}
  if(!Array.isArray(custom))custom=[];
  const result=[], seen=new Set();
  for(const d of [...custom,...DRUG_DATABASE,...LIVE_SITE_DRUGS]) {
    if(!d||typeof d.generic!=='string')continue;
    const key=d.generic.toLowerCase();if(seen.has(key))continue;seen.add(key);result.push(d);
  }
  return result;
}
function openAddDrugModal(){document.getElementById('addDrugModal').classList.remove('hidden');}
function closeAddDrugModal(){document.getElementById('addDrugModal').classList.add('hidden');}
function saveCustomDrug(){
  const val=id=>document.getElementById(id).value.trim();
  const generic=val('custDrugGen');if(!generic){alert('Please enter Generic Molecule name.');return;}
  let all=[];try{all=JSON.parse(localStorage.getItem('customDrugs')||'[]');}catch{}
  if(!Array.isArray(all))all=[];
  all.unshift({generic,cat:val('custDrugCat')||'General',brands:val('custDrugBrand')||'Standard Brands',timing:val('custDrugTiming')||'After Food',freq:val('custDrugFreq')||'1-0-1',days:30,advice:'Take as directed'});
  localStorage.setItem('customDrugs',JSON.stringify(all));closeAddDrugModal();renderDrugDirectory();showToast('Custom medicine saved.');
}
// Use DOM text and input properties for custom medicine names, never executable HTML.
function addRxRowWithData(med,freq,timing,days,advice){
 const tbody=document.getElementById('rxTableBody');const tr=tbody.insertRow();
 const num=tr.insertCell();num.className='border p-1 text-center';num.textContent=tbody.rows.length;
 for(const [i,value] of [med,timing,freq,days,advice].entries()){
  const cell=tr.insertCell();cell.className='border p-1';const input=document.createElement('input');
  input.type='text';input.value=value==null?'':String(value);input.className='w-full bg-transparent px-1 py-0.5';
  if(i===0){input.placeholder='Medicine Name';input.addEventListener('dblclick',()=>openDrugModal(input));}
  cell.appendChild(input);
 }
 const cell=tr.insertCell();cell.className='border p-1 no-print';const remove=document.createElement('button');remove.type='button';remove.textContent='✕';remove.className='text-red-600';remove.addEventListener('click',()=>tr.remove());cell.appendChild(remove);
}
function renderDrugDirectory(){
 const tbody=document.getElementById('drugDirBody');tbody.replaceChildren();
 for(const d of getAllDrugs()){
  const tr=tbody.insertRow();tr.className='border-b';
  for(const text of [d.cat,d.generic,d.brands]){const td=tr.insertCell();td.textContent=text||'';td.className='p-3';}
  const button=document.createElement('button');button.type='button';button.textContent='+ Add to Rx';button.className='bg-[#0D9488] text-white px-3 py-2 rounded-xl';
  button.onclick=()=>addDrugDirectlyToRx(`${d.generic} (${String(d.brands||'').split(',')[0]})`,d.freq,d.timing,d.days,d.advice);tr.insertCell().appendChild(button);
 }
}
let restoredTargetDrugInput=null;
function populateModalDrugs(drugs){
 const list=document.getElementById('modalDrugList');list.replaceChildren();
 for(const d of drugs){const div=document.createElement('div');div.className='p-3 border rounded-xl flex justify-between gap-3';
 const info=document.createElement('p');info.textContent=`${d.generic} · ${d.brands||''} · ${d.cat||''}`;div.appendChild(info);
 const button=document.createElement('button');button.type='button';button.textContent='Select';button.className='bg-[#0D9488] text-white px-3 py-1 rounded-xl';button.onclick=()=>selectDrugForRx(d);div.appendChild(button);list.appendChild(div);}
}
function openDrugModal(target){restoredTargetDrugInput=target||null;document.getElementById('drugModal').classList.remove('hidden');document.getElementById('modalDrugSearch').value='';populateModalDrugs(getAllDrugs());}
function filterModalDrugs(){const q=document.getElementById('modalDrugSearch').value.toLowerCase();populateModalDrugs(getAllDrugs().filter(d=>`${d.generic} ${d.brands} ${d.cat}`.toLowerCase().includes(q)));}
function selectDrugForRx(d){
 const name=`${d.generic} (${String(d.brands||'').split(',')[0]})`;
 if(restoredTargetDrugInput){const row=restoredTargetDrugInput.closest('tr');[name,d.timing,d.freq,d.days,d.advice].forEach((v,i)=>{row.cells[i+1].querySelector('input').value=v==null?'':v;});}
 else addDrugDirectlyToRx(name,d.freq,d.timing,d.days,d.advice);
 closeDrugModal();restoredTargetDrugInput=null;
}
const previousSwitchDocTab=switchDocTab;
switchDocTab=function(tab){
 previousSwitchDocTab(tab);document.getElementById('viewChart20').classList.toggle('hidden',tab!=='chart20');
 document.querySelectorAll('.doctor-tabs button').forEach(b=>b.setAttribute('aria-selected',String((b.getAttribute('onclick')||'').includes("'"+tab+"'"))));
};
const previousRenderArticles=renderPublishedArticles;
renderPublishedArticles=function(){previousRenderArticles();renderPublicArticles();};

const trendKey='kulkarniTrend20V1';
function getTrendReadings(){return Array.from(document.querySelectorAll('#trendRows tr')).map(row=>Object.fromEntries(Array.from(row.querySelectorAll('input')).map(i=>[i.dataset.field,i.value])));}
function drawTrend(){
 const data=getTrendReadings();const svg=document.getElementById('bpTrendGraph');svg.replaceChildren();
 const valid=data.map((r,i)=>({i,s:Number(r.sbp),d:Number(r.dbp),has:r.sbp!==''&&r.dbp!==''}));
 const points=valid.filter(r=>r.has&&r.s>r.d&&r.d>0&&r.s<=400&&r.d<=300);
 document.querySelectorAll('#trendRows tr').forEach((row,i)=>{const r=valid[i];row.querySelector('output').textContent=points.includes(r)?((r.s+2*r.d)/3).toFixed(1):'—';});
 const status=document.getElementById('trendStatus');status.textContent=points.length?`${points.length} entered BP readings. Invalid or incomplete pairs are not plotted.`:'No valid BP readings entered. The graph is blank.';
 if(!points.length)return;
 const ns='http://www.w3.org/2000/svg';const el=(tag,attrs,text)=>{const e=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));if(text)e.textContent=text;svg.appendChild(e);return e;};
 const max=Math.ceil(Math.max(...points.map(r=>r.s))/20)*20+20;
 for(let v=0;v<=max;v+=40){const y=210-v/max*180;el('line',{x1:42,x2:738,y1:y,y2:y,stroke:'#ded8cb'});el('text',{x:5,y:y+4,fill:'#59636a','font-size':11},String(v));}
 const coords=r=>({x:45+r.i*36,yS:210-r.s/max*180,yD:210-r.d/max*180});
 for(const [field,color]of [['yS','#0f2942'],['yD','#006a61']]){
  let segment=[];const flush=()=>{if(segment.length>1)el('polyline',{points:segment.join(' '),fill:'none',stroke:color,'stroke-width':2});segment=[];};
  valid.forEach(r=>{if(!points.includes(r)){flush();return;}const p=coords(r);segment.push(`${p.x},${p[field]}`);el('circle',{cx:p.x,cy:p[field],r:4,fill:color});});flush();
 }
 el('text',{x:45,y:232,fill:'#59636a','font-size':11},'Entry 1');el('text',{x:690,y:232,fill:'#59636a','font-size':11},'Entry 20');
}
function saveTrendReadings(){localStorage.setItem(trendKey,JSON.stringify(getTrendReadings()));showToast('20-entry trend saved in this browser.');}
function exportTrendReadings(){const a=document.createElement('a');const url=URL.createObjectURL(new Blob([JSON.stringify(getTrendReadings(),null,2)],{type:'application/json'}));a.href=url;a.download='20-day-bp-lab-trend.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}

const serviceFaq=[
 {topic:'भेट व शुल्क',q:'घरी डॉक्टरांची भेट कशी बुक करावी?',a:'“Book a visit” विभाग उघडा. नाव, फोन नंबर, पत्ता आणि आवश्यक सेवा भरा. उपलब्ध असल्यास GPS location जोडा. बुकिंगची माहिती WhatsApp वर पाठवा. भेटीची वेळ डॉक्टरांकडून निश्चित करून घ्या.',keywords:'booking appointment visit doctor home'},
 {topic:'भेट व शुल्क',q:'घरी भेटीचे शुल्क किती आहे?',a:'दिवसाच्या भेटीचे मूळ शुल्क ₹१,२०० आहे. वेळ, अंतर आणि निवडलेल्या प्रक्रियांनुसार शुल्क बदलते. “Book a visit” विभागातील calculator मध्ये अंदाज पाहा आणि अंतिम शुल्क डॉक्टरांकडून निश्चित करून घ्या.',keywords:'fees cost charge price payment upi'},
 {topic:'भेट व शुल्क',q:'GPS location जोडता आली नाही तर काय करावे?',a:'पूर्ण पत्ता, इमारतीचे नाव, मजला, फ्लॅट नंबर आणि जवळची खूण लिहा. WhatsApp वर location पाठवता येते. तुमची परवानगी दिल्यावरच browser GPS वापरतो.',keywords:'gps location address permission map'},
 {topic:'तयारी व अहवाल',q:'भेटीपूर्वी काय तयार ठेवावे?',a:'सध्याची prescription, औषधांची यादी, allergy ची माहिती, अलीकडील तपासण्यांचे अहवाल आणि discharge summary जवळ ठेवा. रुग्णाला होणाऱ्या त्रासाची आणि तो कधी सुरू झाला याची नोंद ठेवा.',keywords:'preparation reports prescription discharge allergy'},
 {topic:'तयारी व अहवाल',q:'तपासण्यांचे अहवाल कसे पाठवावेत?',a:'तारीख आणि तपासणीचे नाव स्पष्ट दिसेल असे पूर्ण पानाचे फोटो किंवा PDF डॉक्टरांना WhatsApp वर पाठवा. अहवालासोबत रुग्णाचे नाव आणि सध्याचा त्रास नमूद करा.',keywords:'report laboratory scan pdf upload share'},
 {topic:'आरोग्य मार्गदर्शन',q:'आरोग्यविषयक लेख कुठे वाचता येतील?',a:'“Health library” आणि “Patient guidance library” विभागांत लेख पाहता येतील. त्यातील माहिती समजून घेण्यासाठी आहे. वैयक्तिक उपचारांसाठी डॉक्टरांचा सल्ला घ्या.',keywords:'articles education health library information'},
 {topic:'आरोग्य मार्गदर्शन',q:'येथे विचारून औषधांचा डोस बदलता येईल का?',a:'या FAQ मधून वैयक्तिक निदान किंवा औषधांचा डोस ठरवला जात नाही. औषध बदलण्यापूर्वी तुमच्या डॉक्टरांशी संपर्क साधा. prescription आणि औषधांची यादी त्यांना पाठवा.',keywords:'medicine dose treatment prescription drug'},
 {topic:'तातडीची मदत',q:'तातडीची वैद्यकीय मदत हवी असल्यास काय करावे?',a:'तीव्र छातीत दुखणे, खूप दम लागणे किंवा शुद्ध हरपणे अशा वेळी या FAQ च्या उत्तराची वाट पाहू नका. तातडीची वैद्यकीय मदत घ्या. डॉक्टरांशी थेट संपर्कासाठी वरचे Call बटण वापरा.',keywords:'emergency urgent chest breathless unconscious call'}
];
let faqTopic='सर्व';
function renderServiceFaq(){
 const q=document.getElementById('faqSearch').value.trim().toLowerCase();const list=document.getElementById('faqList');list.replaceChildren();
 const rows=serviceFaq.filter(f=>(faqTopic==='सर्व'||f.topic===faqTopic)&&`${f.q} ${f.a} ${f.keywords}`.toLowerCase().includes(q));
 rows.forEach(f=>{const d=document.createElement('details');const s=document.createElement('summary');s.textContent=f.q;const p=document.createElement('p');p.textContent=f.a;d.append(s,p);list.appendChild(d);});
 document.getElementById('faqCount').textContent=`${rows.length} प्रश्न / questions`;
 document.getElementById('faqEmpty').classList.toggle('hidden',rows.length>0);
 document.getElementById('faqAskDoctor').href='https://wa.me/919822594341?text='+encodeURIComponent(q?`नमस्कार डॉक्टर, माझा प्रश्न: ${document.getElementById('faqSearch').value.trim()}`:'नमस्कार डॉक्टर, मला घरी भेटीबद्दल माहिती हवी आहे.');
 document.querySelectorAll('#faqFilters button').forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===faqTopic)));
}
document.addEventListener('DOMContentLoaded',()=>{
 let saved=[];try{saved=JSON.parse(localStorage.getItem(trendKey)||'[]');}catch{}
 const tbody=document.getElementById('trendRows');
 for(let i=0;i<20;i++){
  const tr=tbody.insertRow();
  for(const field of ['date','sbp','dbp','map','notes']){
   const td=tr.insertCell();if(field==='map'){td.appendChild(document.createElement('output'));continue;}
   const input=document.createElement('input');input.dataset.field=field;input.type=field==='date'?'date':['sbp','dbp'].includes(field)?'number':'text';input.setAttribute('aria-label',`Entry ${i+1}: ${field}`);input.value=(saved[i]||{})[field]||'';input.addEventListener('input',drawTrend);td.appendChild(input);
  }
 }
 drawTrend();
 const filters=document.getElementById('faqFilters');
 for(const topic of ['सर्व',...new Set(serviceFaq.map(f=>f.topic))]){const b=document.createElement('button');b.type='button';b.textContent=topic;b.onclick=()=>{faqTopic=topic;renderServiceFaq();};filters.appendChild(b);}
 document.getElementById('faqSearch').addEventListener('input',renderServiceFaq);renderServiceFaq();
});

// Make booking a directed request to the clinic, with the same existing fee calculation.
bookAndTriggerFullAutomation=function(){
 const name=document.getElementById('bkPatName').value.trim();
 const phone=document.getElementById('bkPatPhone').value.trim();
 const addr=document.getElementById('bkPatAddress').value.trim();
 if(!name||!phone){alert('Please enter patient name and mobile number.');return;}
 const nav=document.getElementById('bkGpsMapUrl').value||`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr||'Pune')}`;
 const time=document.getElementById('calcTime');const distance=document.getElementById('calcDistance');
 const procedures=Array.from(document.querySelectorAll('#procedureList input:checked')).map(c=>c.parentElement.textContent.trim());
 const total=calculateFee();
 const msg=`HOME VISIT REQUEST — Dr. Pramod G. Kulkarni\nPatient: ${name}\nPhone: ${phone}\nAddress: ${addr}\nMaps: ${nav}\nVisit time: ${time.options[time.selectedIndex].text}\nDistance: ${distance.options[distance.selectedIndex].text}\nAdditional services: ${procedures.join('; ')||'None selected'}\nEstimated fee: ₹${total}\nPlease confirm availability, visit time and final fee.`;
 window.open('https://wa.me/919822594341?text='+encodeURIComponent(msg),'_blank','noopener,noreferrer');
};

const LIVE_ARTICLE_DEFAULTS=[
        { title: "हार्ट फेल्युअर: पाण्याचे नियंत्रण व दैनंदिन वजन", cat: "हार्ट फेल्युअर", body: "२४ तासांत पाणी १.२ लिटर मर्यादेत ठेवावे. वरून मीठ, पापड, लोणचे पूर्ण बंद करावे. दररोज सकाळी उपाशीपोटी वजन करावे; २ दिवसांत १.५ किलो वजन वाढल्यास डॉक्टरांना कळवावे." },
        { title: "CKD मध्ये नारळ पाणी का टाळावे?", cat: "किडनी केअर", body: "किडनी निकामी असल्यास अतिरिक्त पोटॅशियम बाहेर पडत नाही. नारळ पाण्यात भरपूर पोटॅशियम असल्याने अचानक कार्डिॲक अरेस्टचा धोका असतो. भाज्या उकळून पाणी फेकून द्यावे." },
        { title: "बेडरीडन रुग्णांची काळजी: २ तासांचे टर्निंग क्लॉक", cat: "बेडसोअर", body: "एकाच स्थितीत पडून राहिल्याने सेक्रमवर जखम होते. दर २ तासांनी कूस बदलावी, एअर मॅट्रेस वापरावी आणि जखमेवर नॉर्मल सलाइनने स्वच्छता ठेवावी." }
      ];
const REPO_ARTICLE_DEFAULTS=[
        { title: "हार्ट फेल्युअर: १.२L पाणी मर्यादा आणि सकाळचे वजन", cat: "कार्डिॲक काळजी", body: "हार्ट फेल्युअरच्या रुग्णांनी दिवसाला १.२ लिटरपेक्षा जास्त पाणी पिऊ नये. दररोज सकाळी उपाशीपोटी वजन करावे. २ दिवसांत दीड किलोपेक्षा जास्त वजन वाढल्यास लघवीचे औषध वाढवण्यासाठी डॉक्टरांशी संपर्क साधावा." },
        { title: "डायलिसिस रुग्णांसाठी भाजीचे लीचिंग (Leaching)", cat: "किडनी केअर", body: "किडनी निकामी असल्यास भाज्यांमधील अतिरिक्त पोटॅशियम बाहेर पडत नाही. बटाटा, पालेभाज्या बारीक चिरून भरपूर पाण्यात उकळून पाणी फेकून दिले पाहिजे. नारळ पाणी कडक बंद ठेवावे." }
      ];
function safeArticleCards(container,articles,publicMode){
 container.replaceChildren();
 for(const [idx,art]of articles.entries()){
  const card=document.createElement('article');card.className=publicMode?'research-draft':'p-5 moon-reader-card rounded-2xl space-y-3';card.id=publicMode?`publicArticle_${idx}`:`moonArticle_${idx}`;
  const cat=document.createElement('small');cat.textContent=art.cat||'General';const h=document.createElement('h4');h.textContent=art.title||'';const body=document.createElement('p');body.textContent=art.body||'';body.style.whiteSpace='pre-wrap';card.append(cat,h,body);
  if(art.media&&typeof art.media.data==='string'&&/^data:(image|video)\//.test(art.media.data)){
   const media=document.createElement(art.media.type==='video'?'video':'img');media.src=art.media.data;media.style.maxWidth='100%';if(media.tagName==='VIDEO')media.controls=true;else media.alt=art.title||'Article image';card.appendChild(media);
  }
  const controls=document.createElement('div');controls.className='flex flex-wrap gap-2 no-print';
  if(!publicMode){const pdf=document.createElement('button');pdf.textContent='Save Article PDF';pdf.className='bg-[#0F2942] text-white px-3 py-2 rounded-xl text-xs';pdf.onclick=()=>exportToPdf(card.id,'Dr_Kulkarni_Article.pdf');controls.appendChild(pdf);}
  const share=document.createElement('button');share.textContent=publicMode?'Share on WhatsApp':'Share';share.className='bg-[#0D9488] text-white px-3 py-2 rounded-xl text-xs';share.onclick=()=>publicMode?shareDirectArticleWhatsApp(encodeURIComponent(art.title),encodeURIComponent(art.body)):universalShareArticle(encodeURIComponent(art.title),encodeURIComponent(art.body));controls.appendChild(share);card.appendChild(controls);container.appendChild(card);
 }
}
function storedPatientArticles(){try{const a=JSON.parse(localStorage.getItem('patientArticles')||'[]');return Array.isArray(a)?a:[];}catch{return [];}}
renderPublicArticles=function(){safeArticleCards(document.getElementById('publicArticlesList'),[...storedPatientArticles(),...LIVE_ARTICLE_DEFAULTS],true);};
renderPublishedArticles=function(){safeArticleCards(document.getElementById('publishedArticlesGrid'),[...storedPatientArticles(),...REPO_ARTICLE_DEFAULTS],false);renderPublicArticles();};

calculateFee=function(){
 const base=parseInt(document.getElementById('calcTime').value,10)||0;
 const distance=parseInt(document.getElementById('calcDistance').value,10)||0;
 const services=Array.from(document.querySelectorAll('#procedureList input:checked')).reduce((sum,c)=>sum+(parseInt(c.value,10)||0),0);
 const total=base+distance+services;
 document.getElementById('totalFeeDisplay').textContent='₹'+total.toLocaleString('en-IN');
 const upi='upi://pay?pa=9561394341%40sbi&pn=Dr%20Pramod%20G%20Kulkarni&am='+total+'&cu=INR';
 const image=document.getElementById('upiQrImg');image.alt=`UPI payment QR for estimated fee ₹${total}`;
 const request=String(total);image.dataset.amount=request;
 if(window.KulkarniQRCode)window.KulkarniQRCode.toDataURL(upi,{width:180,margin:2}).then(url=>{if(image.dataset.amount===request)image.src=url;}).catch(()=>{image.alt='QR unavailable. Use the displayed UPI ID.';});
 return total;
};

// Pune service fees use Indian time even if a visitor's device uses another timezone.
autoDetectTimeSlab=function(){
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
 const hour=Number(parts.find(p=>p.type==='hour').value);const time=parts.filter(p=>p.type==='hour'||p.type==='minute').map(p=>p.value).join(':');
 const id=hour>=23||hour<5?'optNight':hour<8?'optEarly':hour<20?'optDay':'optEve';
 document.getElementById(id).selected=true;
 document.getElementById('liveTimeBadge').textContent=`Pune time: ${time} IST`;
 document.getElementById('liveSlabNotice').textContent='Current time band selected. You can choose the requested visit time.';
 calculateFee();
};
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('.portal-nav a').forEach(a=>a.addEventListener('click',e=>{
  if(document.getElementById('publicPortal').classList.contains('hidden')){
   e.preventDefault();switchWorkspace('public');const target=document.querySelector(a.getAttribute('href'));setTimeout(()=>target&&target.scrollIntoView({behavior:'smooth'}),200);
  }
 }));
 const stored=localStorage.getItem('makeWebhookUrl');if(stored)document.getElementById('webhookUrlInput').value=stored;
});
