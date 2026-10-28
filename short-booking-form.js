/* Short one-page (A4) pre-visit form. The full history form stays available below it.
   Nothing is stored or sent automatically. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const node=(tag,text,parent)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(parent)parent.append(e);return e;};
const OFFICE='919561394341';
function today(){try{return new Date().toLocaleDateString('en-GB',{timeZone:'Asia/Kolkata'}).replace(/\//g,'-');}catch(e){return '';}}
const fields=[];
function label(parent,id,en,mr,hi){const wrap=node('label','',parent);wrap.htmlFor='sf-'+id;const s=node('span',en,wrap);if(mr){s.append(document.createTextNode(' · '));node('span',mr,s).lang='mr';}if(hi){s.append(document.createTextNode(' · '));node('span',hi,s).lang='hi';}return wrap;}
function field(parent,id,en,mr,hi,kind,options){const wrap=label(parent,id,en,mr,hi);let e;
 if(kind==='select'){e=node('select','',wrap);for(const t of ['',...options]){const o=node('option',t||'Choose / not answered',e);o.value=t;}}
 else if(kind==='textarea'){e=node('textarea','',wrap);e.rows=3;e.maxLength=400;}
 else{e=node('input','',wrap);e.type=kind||'text';e.maxLength=kind==='number'?3:160;if(kind==='number'){e.min='0';e.inputMode='numeric';}}
 e.id='sf-'+id;e.name=id;e.autocomplete='off';fields.push({id,en});return e;}
function val(id){const e=$('sf-'+id);return e?e.value.trim():'';}
function booking(){return{name:($('bkPatName')?.value||'').trim(),phone:($('bkPatPhone')?.value||'').trim(),address:($('bkPatAddress')?.value||'').trim()};}
function data(blank){const b=booking();const pick=v=>blank?'':v;return{
 date:val('date')||today(),
 rows:[
  ['Patient name',pick(b.name)],
  ['Age / sex',blank?'':[val('age')&&(val('age')+' '+(val('ageUnit')||'years')),val('sex')].filter(Boolean).join(' / ')],
  ['Mobile (WhatsApp)',pick(b.phone)],
  ['Address with landmark',pick(b.address)],
  ['What is troubling you now?',pick(val('problem'))],
  ['Since when?',pick(val('since'))],
  ['Known illnesses',pick(val('illness'))],
  ['Medicine allergy',pick(val('allergy'))],
  ['Medicines taken now',pick(val('medicines'))]
 ]};}
function render(blank){const out=$('shortFormDocument');out.replaceChildren();out.hidden=false;const d=data(blank);
 const top=node('div','',out);top.className='sf-top';
 const brand=node('div','',top);node('strong','Dr Pramod G Kulkarni',brand).className='sf-name';node('span','Home Visiting ICU Doctor · Emergency and HomeCare Specialist',brand);node('span','BAMS, PGDEMS · Reg. No. I-24809-A-1',brand);
 const date=node('div','',top);date.className='sf-date';node('span','Date',date);node('strong',d.date||'__ - __ - ____',date);
 node('h2','Short pre-visit form',out);
 const t=node('table','',out);t.className='sf-table';for(const [k,v]of d.rows){const tr=node('tr','',t);node('th',k,tr);node('td',v||'',tr);}
 const sign=node('div','',out);sign.className='sf-sign';
 const a=node('div','',sign);node('span','Signature of patient / authorised representative',a);node('span','Name and relationship: ',a);
 const c=node('div','',sign);node('span','For clinic use: doctor’s notes and signature',c);
 const foot=node('p','',out);foot.className='sf-foot';
 const tel=node('a','+91 95613 94341',foot);tel.href='tel:+919561394341';foot.append(document.createTextNode(' · '));const mail=node('a','drkulkarnipg@gmail.com',foot);mail.href='mailto:drkulkarnipg@gmail.com';
 foot.append(document.createTextNode(' · Patient-supplied information; the doctor will verify it. Not a diagnosis.'));
 const close=node('button','Close preview',out);close.type='button';close.className='no-print sf-close';close.onclick=()=>{out.hidden=true;};
 return out;}
function reveal(){const out=$('shortFormDocument');const h=document.querySelector('header.site-header');const pos=h?getComputedStyle(h).position:'';out.style.scrollMarginTop=((pos==='sticky'||pos==='fixed')?h.getBoundingClientRect().height+8:8)+'px';out.scrollIntoView({block:'start',behavior:'smooth'});}
function status(msg){$('sfStatus').textContent=msg;}
function consent(){if(!$('sf-consent').checked){status('Please confirm that the patient, or an authorised representative, agrees to share this information with the doctor.');return false;}return true;}
function message(){const d=data(false);return ['SHORT PRE-VISIT FORM — Dr Pramod G Kulkarni','Date: '+d.date,...d.rows.map(([k,v])=>k+': '+(v||'Not provided')),'Patient-supplied information; the doctor will verify it.'].join('\n');}
function printForm(blank){render(blank);document.body.classList.add('printing-shortform');window.print();}
document.addEventListener('DOMContentLoaded',()=>{
 const intake=$('bookingIntake'),parent=$('bookingSection');if(!parent)return;
 const host=node('section','');host.id='shortVisitForm';host.className='booking-intake short-form';host.setAttribute('aria-labelledby','shortVisitTitle');
 const h=node('h3','Short form: tell the doctor briefly what is happening',host);h.id='shortVisitTitle';
 const mr=node('p','संक्षिप्त फॉर्म: आत्ता काय होत आहे ते थोडक्यात लिहा.',host);mr.lang='mr';const hi=node('p','संक्षिप्त फॉर्म: अभी क्या हो रहा है, थोड़े में लिखें।',host);hi.lang='hi';
 node('p','Write only what is happening now, in a few words. Name, mobile number and address are taken from the booking above. The long history form below stays available if you wish to give more detail.',host);
 const urgent=node('p','Severe breathing difficulty, chest pain, new stroke symptoms, collapse or a seizure that does not stop: call 112 or 108 now. Do not wait to fill this form.',host);urgent.className='intake-urgent';
 const form=node('form','',host);form.id='shortVisitFormFields';form.onsubmit=e=>{e.preventDefault();render(false);reveal();};
 const grid=node('div','',form);grid.className='sf-grid';
 field(grid,'date','Date','तारीख','तारीख','text').value=today();
 field(grid,'age','Age','वय','उम्र','number');
 field(grid,'ageUnit','Age unit','वयाचे एकक','उम्र की इकाई','select',['years','months','days']);
 field(grid,'sex','Sex','लिंग','लिंग','select',['Female','Male','Other / prefer to discuss']);
 const wide=node('div','',form);wide.className='sf-wide';
 field(wide,'problem','What is troubling you now? (a few words)','आत्ता काय त्रास होत आहे?','अभी क्या तकलीफ़ है?','textarea');
 field(wide,'since','Since when?','केव्हापासून?','कब से?','text');
 field(wide,'illness','Known illnesses (for example diabetes, blood pressure, heart, kidney)','आधीचे आजार','पहले की बीमारियाँ','text');
 field(wide,'allergy','Medicine allergy: name of the medicine, or “none”','औषधाची ॲलर्जी','दवा से एलर्जी','text');
 field(wide,'medicines','Medicines taken now (names, in brief)','सध्या घेत असलेली औषधे','अभी ली जा रही दवाइयाँ','textarea');
 const c=node('label','',form),cb=node('input','',c);cb.type='checkbox';cb.id='sf-consent';c.append(document.createTextNode(' I am the patient or an authorised representative, and I agree to share this information with Dr Pramod G Kulkarni for this visit.'));
 const actions=node('div','',form);actions.className='intake-actions';
 for(const [id,text,run]of [
  ['sfReview','Review short form',()=>{render(false);reveal();status('Short form ready below. Check it, then share, download or print.');}],
  ['sfShare','Share short form PDF',()=>{if(!consent())return;render(false);window.shareDocumentPdf('shortFormDocument','Short_pre_visit_form');}],
  ['sfDownload','Download short form PDF',()=>{if(!consent())return;render(false);window.exportToPdf('shortFormDocument','Short_pre_visit_form');status('Preparing the PDF on this device…');}],
  ['sfPrint','Print short form (A4)',()=>printForm(false)],
  ['sfBlank','Blank short form (A4)',()=>printForm(true)],
  ['sfWhatsApp','Send short form on WhatsApp',()=>{if(!consent())return;window.open('https://wa.me/'+OFFICE+'?text='+encodeURIComponent(message()),'_blank','noopener,noreferrer');status('WhatsApp opened with the short form. Check the recipient and press Send yourself. Nothing was sent automatically.');}]
 ]){const b=node('button',text,actions);b.type='button';b.id=id;b.onclick=run;}
 const st=node('p','Not saved to the cloud. Information stays on this page until you print, download or share it.',host);st.id='sfStatus';st.setAttribute('role','status');
 const doc=node('article','',host);doc.id='shortFormDocument';doc.className='sf-doc';doc.hidden=true;
 if(intake)intake.before(host);else parent.append(host);
 window.addEventListener('afterprint',()=>document.body.classList.remove('printing-shortform'));
 window.ShortBookingForm={data,render,message};
});
})();
