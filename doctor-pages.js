/* Doctor-only pages (29 Oct 2026). One page per Workstation tab, reachable at /doctor and /doctor#workstation=<tab> (the Workstation's existing tab URLs).
   Nothing is removed: the original tab strip, views and ids stay in the DOM, and the existing privacy lock still guards them.
   This is a browser privacy screen, not server authentication. */
(()=>{'use strict';
const doc=document,root=doc.documentElement,$=id=>doc.getElementById(id);
const GROUPS=[
 ['Prescription, Lab slip and Radiology slip',['rxPad','pathReq','radReq']],
 ['Death certificate Forms 4A, 4 and 2',['legalForms']],
 ['Letters',['clinicalCertificates']],
 ['Registers',['registers']],
 ['Medicines',['drugDir']],
 ['Clinical tools',['symptomChecker','pathCheatSheet','clinicalCalculators','everydayTools','chart20','patientTrends']],
 ['Research and articles',['journalsHub','articlesHub']],
 ['Settings',['settingsTab']]
];
const NOTE={rxPad:'Write, print and share the A4 prescription',pathReq:'Pathology requisition slip',radReq:'X-ray, scan and sonography requisition',
 clinicalCertificates:'Referral, consent, fitness and leave letters',legalForms:'Death certificate Forms 4A, 4 and 2',drugDir:'Search, import and add medicines',
 registers:'Patient, Stock and Death registers',symptomChecker:'Symptom and interaction reference',pathCheatSheet:'Quick pathology reference',
 clinicalCalculators:'Clinical calculators',journalsHub:'Research feeds',articlesHub:'Manage published articles',settingsTab:'Security and settings'};
const CHIP={rxPad:'Prescription',pathReq:'Lab slip',radReq:'Radiology slip'};
let tabs=null,built=false;
const isDoctor=()=>location.pathname.replace(/\/+$/,'')==='/doctor'||location.hash==='#doctor'||/^#workstation=/.test(location.hash);
const tabFromHash=()=>{const m=location.hash.match(/^#workstation=([A-Za-z0-9]+)$/);return m?m[1]:'';};
function scan(){
 if(tabs)return tabs;tabs=[];
 for(const b of doc.querySelectorAll('#doctorWorkstation .doctor-tabs button[onclick*="switchDocTab("]')){
  const m=(b.getAttribute('onclick')||'').match(/switchDocTab\('([A-Za-z0-9_-]+)'\)/);if(!m)continue;
  const label=b.textContent.replace(/\s+/g,' ').trim();if(!label||tabs.some(t=>t.id===m[1]))continue;tabs.push({id:m[1],label});
 }
 return tabs;
}
function el(tag,cls,text){const e=doc.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;}
function build(){
 if(built)return;const ws=$('doctorWorkstation');if(!ws)return;built=true;
 const home=el('section','');home.id='doctorHome';home.setAttribute('aria-label','Doctor Workstation pages');
 const used=new Set();const list=scan();
 const add=(title,items)=>{if(!items.length)return;const s=el('div','dp-group');s.append(el('h2','dp-group-title',title));const grid=el('div','dp-grid');
  for(const t of items){used.add(t.id);const a=el('a','dp-card');a.href='#workstation='+t.id;a.append(el('span','dp-card-title',t.label));if(NOTE[t.id])a.append(el('span','dp-card-note',NOTE[t.id]));grid.append(a);}
  s.append(grid);home.append(s);};
 for(const [title,ids] of GROUPS)add(title,ids.map(id=>list.find(t=>t.id===id)).filter(Boolean));
 add('Other',list.filter(t=>!used.has(t.id)));
 const bar=el('div','dp-bar no-print');bar.id='doctorPageBar';
 const back=el('a','dp-back','← Doctor home');back.href='#doctor';bar.append(back);
 const siblings=el('nav','dp-chips');siblings.id='doctorSiblings';siblings.setAttribute('aria-label','Related pages');bar.append(siblings);
 const lock=el('button','dp-lock','🔒 Lock');lock.type='button';lock.onclick=()=>window.lockWorkstationNow?.();bar.append(lock);
 const gate=el('section','dp-gate');gate.id='doctorGate';gate.hidden=true;
 gate.append(el('h2','',  'Doctor Workstation is locked'),el('p','','Unlock to continue. This page is for the doctor only.'));
 const unlock=el('button','dp-unlock','Unlock');unlock.type='button';unlock.onclick=()=>window.verifyAndOpenWorkstation?.();gate.append(unlock);
 const heading=ws.querySelector('.workstation-heading');
 (heading?heading.after.bind(heading):ws.prepend.bind(ws))(bar,home);
 ws.parentNode.insertBefore(gate,ws);
}
function locked(){const ws=$('doctorWorkstation');return !ws||ws.classList.contains('hidden');}
function sync(){
 const on=isDoctor();root.classList.toggle('doctor-site',on);
 if(!on){root.classList.remove('doctor-tab-open','doctor-locked');return;}
 build();const tab=tabFromHash(),known=scan().find(t=>t.id===tab);
 root.classList.toggle('doctor-tab-open',!!known);
 const sib=$('doctorSiblings');if(sib){sib.replaceChildren();const grp=known&&GROUPS.find(g=>g[1].includes(known.id)&&g[1].length>1);
  if(grp)for(const id of grp[1]){const t=scan().find(x=>x.id===id);if(!t)continue;const a=el('a','dp-chip',CHIP[id]||t.label);a.href='#workstation='+id;if(id===known.id)a.setAttribute('aria-current','page');sib.append(a);}}
 root.classList.toggle('doctor-locked',locked());
 const gate=$('doctorGate');if(gate)gate.hidden=!locked();
 const base='Doctor Workstation';
 if(known){try{window.switchDocTab(known.id);}catch{}if(!doc.title||doc.title===base)doc.title=known.label.replace(/^[^\p{L}\p{N}]+/u,'')+' | '+base;}
 else doc.title=base+' | Dr Pramod G Kulkarni';
 let robots=doc.querySelector('meta[name="robots"]');if(!robots){robots=doc.createElement('meta');robots.name='robots';doc.head.append(robots);}robots.content='noindex, nofollow';
}
function start(){
 // Patients never see the Doctor Workstation switch; the doctor reaches it at /doctor.
 const pub=$('navPublicBtn'),dr=$('navDoctorBtn');
 if(pub&&pub.parentElement)pub.parentElement.classList.add('dp-doctor-only');
 for(const b of doc.querySelectorAll('button[onclick="openSecuritySettingsModal()"]'))b.classList.add('dp-doctor-only');
 for(const a of doc.querySelectorAll('header.site-header a[data-direct-call],header.site-header a[href*="share.google"],header.site-header a[href*="google.com/search"],header.site-header details.language-control,header.site-header .portal-nav'))a.classList.add('dp-patient-only');
 sync();
 if(isDoctor()&&locked()&&typeof window.switchWorkspace==='function'){try{window.switchWorkspace('doctor');}catch{}}
}
window.addEventListener('hashchange',()=>{sync();if(isDoctor()&&locked()){try{window.switchWorkspace('doctor');}catch{}}window.scrollTo(0,0);});
window.addEventListener('clinical-workspace-unlocked',()=>setTimeout(sync,0));
window.addEventListener('clinical-workspace-locked',()=>setTimeout(sync,0));
// In doctor pages the document Close buttons return to the Doctor home.
doc.addEventListener('click',e=>{if(!root.classList.contains('doctor-site'))return;const b=e.target.closest?.('.clinical-document-exit button');if(!b)return;e.stopPropagation();e.preventDefault();location.hash='#doctor';},true);
doc.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('doctor-tab-open')&&!doc.querySelector('dialog[open], .pdf-share-backdrop:not([hidden])')){location.hash='#doctor';}});
if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',start);else start();
})();
