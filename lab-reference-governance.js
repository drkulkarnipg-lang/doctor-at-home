/* Lab Normal Reference Check Table — provenance and governance layer.
 * Catalogue data only are stored locally. Patient results are never persisted or transmitted.
 * Imported rows remain pending until a clinician reviews source, method, population and applicability.
 */
(function(root){
  'use strict';
  const PENDING_KEY='labrc.catalog.pending.v1';
  const APPROVED_KEY='labrc.catalog.reviewed.v1';
  const SOURCE_URLS={
    'Basic Metabolic Panel':'https://www.mayocliniclabs.com/test-catalog/Overview/113630',
    'Comprehensive Metabolic Panel':'https://www.mayocliniclabs.com/test-catalog/Overview/113631',
    'Magnesium, Serum':'https://www.mayocliniclabs.com/test-catalog/Overview/8448',
    'Albumin, Serum':'https://www.mayocliniclabs.com/test-catalog/Overview/8436',
    'Alkaline Phosphatase, Serum':'https://www.mayocliniclabs.com/test-catalog/Overview/8340',
    'Liver Profile':'https://www.mayocliniclabs.com/test-catalog',
    'CBC with Differential':'https://www.mayocliniclabs.com/test-catalog/Overview/9109',
    'T4, Free, Serum':'https://www.mayocliniclabs.com/test-catalog/Overview/8725'
  };
  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function parseBound(v){const s=String(v??'').trim().toUpperCase();if(s==='INF'||s==='+INF'||s==='INFINITY'||s==='+INFINITY')return Infinity;if(s==='-INF'||s==='-INFINITY')return -Infinity;if(s==='')return NaN;return Number(s);}
  function parseCSV(text){
    const rows=[];let row=[],field='',quoted=false;
    for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'&&quoted&&text[i+1]==='"'){field+='"';i++;}else if(c==='"')quoted=!quoted;else if(c===','&&!quoted){row.push(field.trim());field='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(field.trim());if(row.some(x=>x!==''))rows.push(row);row=[];field='';}else field+=c;}
    row.push(field.trim());if(row.some(x=>x!==''))rows.push(row);if(quoted)throw Error('CSV contains an unclosed quoted field.');return rows;
  }
  function validateEntry(r){
    const errors=[];const required=['test','unit','low','high','source','source_url','category','specimen','method','population','age_min','age_max','sex','range_type'];
    for(const k of required)if(!String(r[k]??'').trim())errors.push('Missing '+k);
    const lo=parseBound(r.low),hi=parseBound(r.high);
    if(!Number.isFinite(lo)&&lo!==-Infinity)errors.push('Invalid lower limit');
    if(!Number.isFinite(hi)&&hi!==Infinity)errors.push('Invalid upper limit');
    if(lo>hi)errors.push('Lower limit exceeds upper limit');
    const amin=Number(r.age_min),amax=Number(r.age_max);
    if(!Number.isFinite(amin)||!Number.isFinite(amax)||amin<18||amax<amin||amax>120)errors.push('Adult age bounds must be valid (18–120 years)');
    if(!['all','male','female'].includes(String(r.sex).toLowerCase()))errors.push('sex must be all, male or female');
    if(!['reference_interval','decision_limit'].includes(r.range_type))errors.push('range_type must be reference_interval or decision_limit');
    if(!/^https:\/\/[A-Za-z0-9.-]+(?::\d+)?(?:\/|$)/i.test(String(r.source_url||'')))errors.push('Source URL must be a valid HTTPS link');
    if(!String(r.specimen||'').trim()||!String(r.method||'').trim()||!String(r.population||'').trim())errors.push('Specimen, method and population are mandatory');
    return {valid:errors.length===0,errors,low:lo,high:hi};
  }
  function classify(value,low,high,kind='reference_interval'){
    const n=Number(value);if(!Number.isFinite(n))return 'INVALID';
    if(n<low)return kind==='decision_limit'?'BELOW DECISION THRESHOLD':'LOW';
    if(n>high)return kind==='decision_limit'?'ABOVE DECISION THRESHOLD':'HIGH';
    return kind==='decision_limit'?'WITHIN DECISION THRESHOLD':'WITHIN REFERENCE INTERVAL';
  }
  function read(key){try{const x=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(x)?x:[];}catch{return [];}}
  function write(key,value){localStorage.setItem(key,JSON.stringify(value));}
  function fingerprint(r){return [r.test,r.unit,r.low,r.high,r.source_url,r.specimen,r.method,r.population,r.age_min,r.age_max,r.sex,r.range_type].map(x=>String(x).trim().toLowerCase()).join('|');}
  function asTuple(r){
    const meta={sourceName:r.source,sourceUrl:r.source_url,specimen:r.specimen,method:r.method,population:r.population,ageMin:Number(r.age_min),ageMax:Number(r.age_max),sex:r.sex,rangeType:r.range_type,reviewStatus:'clinician-reviewed',reviewer:r.reviewer,reviewDate:r.review_date};
    const sexRanges=r.sex==='all'?null:{[r.sex]:[parseBound(r.low),parseBound(r.high)]};
    return ['import-'+fingerprint(r).split('|').join('-').replace(/[^a-z0-9-]/g,'').slice(0,110),r.test,r.aliases||'',r.category,r.unit,parseBound(r.low),parseBound(r.high),'Clinician-reviewed catalogue · '+r.source,sexRanges,meta];
  }
  function attach(){
    const box=document.querySelector('#viewPathCheatSheet .labrc');
    if(!box||box.dataset.governanceReady)return;
    box.dataset.governanceReady='true';
    const tests=root.LAB_REFERENCE_TESTS||[];
    const baseCount=tests.length;
    const sourceMap=[
      ['Basic Metabolic Panel',SOURCE_URLS['Basic Metabolic Panel']],
      ['Comprehensive Metabolic Panel',SOURCE_URLS['Comprehensive Metabolic Panel']],
      ['Magnesium, Serum',SOURCE_URLS['Magnesium, Serum']],
      ['Albumin, Serum',SOURCE_URLS['Albumin, Serum']],
      ['Alkaline Phosphatase, Serum',SOURCE_URLS['Alkaline Phosphatase, Serum']],
      ['Liver Profile',SOURCE_URLS['Liver Profile']],
      ['CBC with Differential',SOURCE_URLS['CBC with Differential']],
      ['T4, Free, Serum',SOURCE_URLS['T4, Free, Serum']]
    ];
    tests.forEach(t=>{
      const src=String(t[7]||'');const pair=sourceMap.find(x=>src.includes(x[0]));
      t[9]=t[9]||{sourceName:src,sourceUrl:pair?.[1]||'https://www.mayocliniclabs.com/test-catalog',specimen:['Haematology'].includes(t[3])?'EDTA whole blood':'Serum/plasma — verify source page',method:'Assay/platform not captured in legacy seed; verify with performing laboratory',population:'Mayo-derived source catalogue; population partition details must be checked on linked source',ageMin:t[0]==='ft4'?20:18,ageMax:120,sex:t[8]?'partitioned':'all',rangeType:t[0]==='egfr'?'decision_limit':'reference_interval',reviewStatus:'source-linked seed; method/population applicability review pending'};
    });
    const pending=read(PENDING_KEY),approved=read(APPROVED_KEY);
    const known=new Set(tests.map(t=>t[0]));
    approved.forEach(r=>{const tuple=asTuple(r);if(!known.has(tuple[0])){tests.push(tuple);known.add(tuple[0]);}});
    const add= document.createElement('section');add.className='labrc-governance';
    add.innerHTML='<h4>Catalogue quality &amp; expansion</h4><p class="labrc-gov-note">The catalogue is designed for 750+ distinct, source-traceable reference-interval/decision-limit records. One analyte may have separate valid records by age, sex, specimen and method. Synonyms and duplicate units do not count as new records. No value is promoted merely to reach the target.</p><div class="labrc-gov-counts"><div><b id="labrcSeedCount">'+baseCount+'</b><span>Legacy source-linked seed entries</span></div><div><b id="labrcApprovedCount">'+approved.length+'</b><span>Clinician-reviewed local entries</span></div><div><b id="labrcPendingCount">'+pending.length+'</b><span>Awaiting review</span></div><div><b>750</b><span>Target catalogue entries</span></div></div><div class="labrc-gov-grid"><label>Import reviewed interval CSV<input id="labrcGovCsv" type="file" accept=".csv,text/csv"></label><button type="button" id="labrcGovTemplate">Download evidence CSV template</button><label>Reviewing clinician<input id="labrcReviewer" type="text" placeholder="Name / professional identifier"></label></div><p class="labrc-gov-note">Imports enter a pending queue. Each row must identify the source URL, specimen, analytical method, population, adult age band, sex partition and whether it is a true reference interval or a clinical decision limit. A clinician must review and approve each row before it becomes selectable. Approval here records local clinical review; it does not imply universal/global endorsement.</p><div id="labrcPendingList" class="labrc-pending-list"></div><p class="labrc-gov-note">Catalogue records are stored only in this browser on this device. Patient measurements are not saved or uploaded. Export/back up this catalogue separately if you need to move it to another workstation.</p>';
    box.appendChild(add);
    const style=document.createElement('style');style.textContent='.labrc{background:linear-gradient(145deg,#edf3ef,#e7eef0 58%,#f2eee5)!important;border-color:#c6d6d1!important;color:#29414b!important}.labrc-governance{margin-top:16px;padding:16px;border:1px solid #c3d4d0;border-radius:14px;background:linear-gradient(135deg,#e6efeb,#e8edf0);color:#29414b}.labrc-governance h4{font-size:16px;font-weight:800;color:#244d49}.labrc-gov-note{font-size:11px!important;line-height:1.65!important;color:#526970!important}.labrc-gov-counts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:12px 0}.labrc-gov-counts>div{padding:11px;border:1px solid #c7d8d2;border-radius:10px;background:#dce9e4}.labrc-gov-counts b{display:block;font-size:23px;color:#244d49}.labrc-gov-counts span{display:block;font-size:10px;color:#526970}.labrc-gov-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;align-items:end;margin:12px 0}.labrc-gov-grid label{display:grid;gap:5px;font-size:11px;font-weight:700;color:#435965}.labrc-gov-grid input,.labrc-gov-grid button{min-height:42px;padding:8px 10px;border:1px solid #b8cbc5;border-radius:9px;background:#f7faf8;color:#29414b;font-size:12px}.labrc-gov-grid button{font-weight:800;background:#315f57;color:white}.labrc-pending-card{display:grid;grid-template-columns:1fr auto;gap:10px;padding:11px;margin:8px 0;border:1px solid #c4d4d0;border-radius:10px;background:#e0eae6}.labrc-pending-card strong{color:#294d49;font-size:12px}.labrc-pending-card small{display:block;color:#5a6e73;font-size:10px;line-height:1.5}.labrc-pending-card button{align-self:center;border:0;border-radius:8px;padding:9px 12px;background:#315f57;color:white;font-weight:700;font-size:11px}.labrc-pending-card button.reject{background:#8a5148}@media(max-width:700px){.labrc-gov-counts{grid-template-columns:repeat(2,minmax(0,1fr))}.labrc-gov-grid{grid-template-columns:1fr}.labrc-pending-card{grid-template-columns:1fr}}';document.head.appendChild(style);
    function updateCounts(){ $('labrcSeedCount').textContent=baseCount;$('labrcApprovedCount').textContent=approved.length;$('labrcPendingCount').textContent=pending.length;const c=$('labrcCount');if(c)c.textContent=(tests.length)+' comparator entries loaded · '+baseCount+' legacy seed entries · '+approved.length+' clinician-reviewed imported entries · '+pending.length+' pending';}
    function renderPending(){
      const host=$('labrcPendingList');host.replaceChildren();
      if(!pending.length){host.textContent='No imported records awaiting review.';return;}
      pending.forEach((r,i)=>{
        const card=document.createElement('div');card.className='labrc-pending-card';
        const info=document.createElement('div');const title=document.createElement('strong');title.textContent=r.test+' · '+r.low+'–'+r.high+' '+r.unit;
        const meta=document.createElement('small');meta.textContent=[r.source,r.specimen,r.method,r.population,'Age '+r.age_min+'–'+r.age_max+' y',r.sex,r.range_type,r.source_url].join(' · ');
        info.append(title,meta);const actions=document.createElement('div');
        const approve=document.createElement('button');approve.textContent='Review & approve';approve.addEventListener('click',()=>{
          const reviewer=$('labrcReviewer').value.trim();if(!reviewer){alert('Enter the reviewing clinician name first.');return;}
          const check=validateEntry(r);if(!check.valid){alert('Cannot approve: '+check.errors.join('; '));return;}
          const duplicate=approved.some(x=>fingerprint(x)===fingerprint(r));if(duplicate){alert('Duplicate catalogue entry.');pending.splice(i,1);write(PENDING_KEY,pending);renderPending();updateCounts();return;}
          const reviewed={...r,reviewer,review_date:new Date().toISOString().slice(0,10)};
          approved.push(reviewed);pending.splice(i,1);write(APPROVED_KEY,approved);write(PENDING_KEY,pending);
          const tuple=asTuple(reviewed);tests.push(tuple);addTestOption(tuple[1]);renderPending();updateCounts();refreshEvidence();
          alert('Added as clinician-reviewed local catalogue data. Confirm source, method and population applicability before clinical interpretation.');
        });
        const reject=document.createElement('button');reject.className='reject';reject.textContent='Reject';reject.addEventListener('click',()=>{pending.splice(i,1);write(PENDING_KEY,pending);renderPending();updateCounts();});
        actions.append(approve,reject);card.append(info,actions);host.append(card);
      });
    }
    function addTestOption(name){
      const list=$('labrcOptions');if(list&&!Array.from(list.options).some(o=>o.value===name)){const o=document.createElement('option');o.value=name;list.appendChild(o);}
      const select=$('labrcTestSelect');if(select&&!Array.from(select.options).some(o=>o.value===name)){const o=document.createElement('option');o.value=name;o.textContent=name;select.appendChild(o);}
    }
    const template='test,unit,low,high,source,source_url,category,aliases,specimen,method,population,age_min,age_max,sex,range_type\nSodium,mmol/L,135,145,Mayo Clinic Laboratories,https://www.mayocliniclabs.com/test-catalog/Overview/113630,Electrolytes,Na; serum sodium,Serum,Source-specific method to be recorded,Healthy adult reference population,18,120,all,reference_interval\n';
    $('labrcGovTemplate').addEventListener('click',()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([template],{type:'text/csv'}));a.download='lab-normal-reference-check-evidence-template.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);});
    $('labrcGovCsv').addEventListener('change',async e=>{
      const file=e.target.files?.[0];if(!file)return;
      try{
        const rows=parseCSV(await file.text());if(!rows.length)throw Error('CSV is empty.');
        const headers=rows.shift().map(x=>x.toLowerCase());const col=k=>headers.indexOf(k);
        const required=['test','unit','low','high','source','source_url','category','specimen','method','population','age_min','age_max','sex','range_type'];
        for(const k of required)if(col(k)<0)throw Error('Missing required column: '+k);
        let added=0,invalid=0;
        rows.forEach(row=>{
          const r={};headers.forEach((h,j)=>r[h]=row[j]??'');const check=validateEntry(r);
          if(!check.valid){invalid++;return;}
          r.low=check.low;r.high=check.high;r.aliases=r.aliases||'';r.age_min=Number(r.age_min);r.age_max=Number(r.age_max);r.sex=r.sex.toLowerCase();
          if(pending.some(x=>fingerprint(x)===fingerprint(r))||approved.some(x=>fingerprint(x)===fingerprint(r))){invalid++;return;}
          pending.push(r);added++;
        });
        write(PENDING_KEY,pending);renderPending();updateCounts();
        alert(added+' valid records staged for clinician review. '+invalid+' invalid or duplicate rows skipped. Nothing is selectable until individually approved.');
      }catch(err){alert('Import rejected: '+err.message);}
      finally{e.target.value='';}
    });
    // Add explicit select and unit/pregnancy controls while retaining the existing searchable datalist.
    const search=$('labrcSearch'),age=$('labrcAge'),sex=$('labrcSex'),value=$('labrcValue'),selected=$('labrcSelected'),result=$('labrcResult');
    const controls=box.querySelector('.labrc-grid');
    const testLabel=document.createElement('label');testLabel.textContent='Browse test dropdown';
    const testSelect=document.createElement('select');testSelect.id='labrcTestSelect';testSelect.innerHTML='<option value="">Choose test…</option>';
    [...new Set(tests.map(t=>t[1]))].sort().forEach(name=>{const o=document.createElement('option');o.value=name;o.textContent=name;testSelect.appendChild(o);});
    testLabel.append(testSelect);controls.insertBefore(testLabel,controls.firstChild);
    const unitLabel=document.createElement('label');unitLabel.textContent='Measured result unit (must match reference)';
    const unitInput=document.createElement('input');unitInput.id='labrcValueUnit';unitInput.type='text';unitInput.placeholder='Select a test first';unitLabel.append(unitInput);controls.append(unitLabel);
    const pregLabel=document.createElement('label');pregLabel.textContent='Pregnancy status (adult comparator)';
    const preg=document.createElement('select');preg.id='labrcPregnancy';preg.innerHTML='<option value="">Not recorded</option><option value="no">Not pregnant</option><option value="yes">Pregnant</option><option value="recent">Recently pregnant</option>';pregLabel.append(preg);controls.append(pregLabel);
    const evidence=document.createElement('div');evidence.className='labrc-selected';evidence.id='labrcEvidence';evidence.textContent='Source, specimen, method and population details appear here after selecting a test.';selected.after(evidence);
    function addTestOptionSafe(name){addTestOption(name);}
    function candidates(){const q=(search.value||testSelect.value||'').trim().toLowerCase();if(!q)return [];return tests.filter(t=>t[1].toLowerCase()===q||t[0].toLowerCase()===q||(t[2]||'').toLowerCase().split(';').some(a=>a.trim()===q));}
    function chosen(){const list=candidates();if(!list.length)return null;const a=Number(age.value),sx=sex.value;return list.find(t=>{const m=t[9]||{};const min=m.ageMin??18,max=m.ageMax??120;if(!Number.isFinite(a)||a<min||a>max)return false;if(m.sex&&['male','female'].includes(m.sex)&&m.sex!==sx)return false;if(t[8]&&(!sx||!t[8][sx]))return false;return true;})||list[0];}
    function refreshEvidence(){
      const list=candidates();const t=chosen();if(!t){evidence.textContent=list.length?'A matching test exists, but age/sex partition is not yet selected or available.':'Select an exact test name; partial text is only a search.';return;}
      const m=t[9]||{};const url=m.sourceUrl||SOURCE_URLS[String(t[7]||'').split('·').pop()?.trim()]||'';
      evidence.innerHTML='<b>Evidence record:</b> '+esc(m.sourceName||t[7])+' · '+esc(m.specimen||'Specimen not recorded')+' · '+esc(m.method||'Method not recorded')+' · '+esc(m.population||'Population details not recorded')+' · '+esc(m.reviewStatus||'Legacy source-linked seed')+(url?' · <a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Open source ↗</a>':'');
      unitInput.value=t[4]||'';
    }
    function evaluate(){
      const list=candidates();if(!list.length){result.className='labrc-result warn';result.textContent='Select an exact test from the dropdown/search suggestions. No range is guessed.';return;}
      const a=Number(age.value),sx=sex.value;
      if(!age.value||!Number.isFinite(a)||a<18){result.className='labrc-result warn';result.textContent='Adult comparator only. Enter age ≥18 years. Paediatric/neonatal intervals are not loaded.';return;}
      if(sx==='female'&&preg.value!=='no'){result.className='labrc-result warn';result.textContent='This catalogue is not pregnancy-specific. Confirm “Not pregnant”; use an obstetric reference interval if pregnant/recently pregnant or status is unknown.';return;}
      if(preg.value==='yes'||preg.value==='recent'){result.className='labrc-result warn';result.textContent='Pregnancy/recent pregnancy requires a pregnancy-specific reference interval; no adult non-pregnant interval is applied.';return;}
      const t=chosen();if(!t){result.className='labrc-result warn';result.textContent='No age/sex-matched interval exists for this selection. Do not extrapolate.';return;}
      const m=t[9]||{};let low,high,kind=m.rangeType||'reference_interval',source=m.sourceName||t[7],unit=t[4];
      const localLow=$('labrcLow').value,localHigh=$('labrcHigh').value,localUnit=$('labrcUnit').value.trim();
      if(localLow!==''||localHigh!==''){
        if(localLow===''||localHigh===''||!Number.isFinite(parseBound(localLow))||(!Number.isFinite(parseBound(localHigh))&&parseBound(localHigh)!==Infinity)||parseBound(localLow)>parseBound(localHigh)){result.className='labrc-result warn';result.textContent='Enter valid report lower and upper limits.';return;}
        low=parseBound(localLow);high=parseBound(localHigh);unit=localUnit||unit;source='Performing laboratory report — clinician-entered interval';kind='reference_interval';
      }else if(t[8]){
        if(!sx||!t[8][sx]){result.className='labrc-result warn';result.textContent='Select the correct sex partition for this test.';return;}
        [low,high]=t[8][sx];
      }else if(t[0]==='ca'&&a>=60&&a<=90){low=8.8;high=10.2;}else if(t[0]==='ca'&&a>90){low=8.2;high=9.6;}else{low=t[5];high=t[6];}
      if(m.sex&&['male','female'].includes(m.sex)&&m.sex!==sx){result.className='labrc-result warn';result.textContent='Selected test partition does not match patient sex.';return;}
      if(a<(m.ageMin??18)||a>(m.ageMax??120)){result.className='labrc-result warn';result.textContent='No validated interval for this age band.';return;}
      const enteredUnit=unitInput.value.trim();if(!enteredUnit||enteredUnit!==unit){result.className='labrc-result warn';result.textContent='Unit mismatch or missing unit. Result unit must exactly match reference unit ('+unit+'). No automatic conversion is performed.';return;}
      selected.textContent=t[1]+' · '+(kind==='decision_limit'?'Decision threshold ':'Reference interval ')+String(low)+'–'+(high===Infinity?'∞':high)+' '+unit+' · '+source;
      if(value.value===''){result.className='labrc-result';result.textContent='Enter the measured value for immediate comparison.';return;}
      const state=classify(value.value,low,high,kind);if(state==='INVALID'){result.className='labrc-result warn';result.textContent='Enter a valid numeric result.';return;}
      result.className='labrc-result '+(state==='LOW'?'low':state==='HIGH'?'high':state.includes('BELOW')||state.includes('ABOVE')?'warn':'normal');
      result.textContent=state+' · '+t[1]+': '+value.value+' '+unit+' (selected '+(kind==='decision_limit'?'decision threshold ':'reference interval ')+low+'–'+(high===Infinity?'∞':high)+' '+unit+'). '+(kind==='decision_limit'?'This is a clinical decision threshold, not a population reference interval. ':'')+'Interpret with clinical context; this flag is not a diagnosis.';
    }
    testSelect.addEventListener('change',()=>{search.value=testSelect.value;refreshEvidence();evaluate();});
    search.addEventListener('change',()=>{testSelect.value=search.value;refreshEvidence();evaluate();});
    search.addEventListener('input',()=>{const q=search.value.trim().toLowerCase();const hits=[...new Set(tests.filter(t=>t[1].toLowerCase().includes(q)||(t[2]||'').toLowerCase().includes(q)).map(t=>t[1]))];if(hits.length===1){search.value=hits[0];testSelect.value=hits[0];refreshEvidence();evaluate();}else if(hits.length>1){result.className='labrc-result warn';result.textContent=hits.length+' matching tests. Select the exact test from the dropdown.';}else if(q){result.className='labrc-result warn';result.textContent='No matching test in the loaded catalogue.';}});
    [age,sex,value,unitInput,preg,$('labrcLow'),$('labrcHigh'),$('labrcUnit')].forEach(el=>{el.addEventListener('input',()=>{refreshEvidence();evaluate();});el.addEventListener('change',()=>{refreshEvidence();evaluate();});});
    search.value='';testSelect.value='';unitInput.value='';
    renderPending();updateCounts();
  }
  const api={parseCSV,validateEntry,classify};
  root.LabReferenceGovernance=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach);else attach();}
})(typeof window!=='undefined'?window:globalThis);
