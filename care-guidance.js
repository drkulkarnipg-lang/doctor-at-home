/* Session-only care plans. Explicit export; no automatic persistence or messaging. */
(function (root) {
  'use strict';
  const rule = Object.freeze({
    id: 'CKD-RAS-01', version: '2026-11-06',
    title: 'Adult CKD · ACE inhibitor / ARB monitoring',
    source: 'https://kdigo.org/wp-content/uploads/2024/03/KDIGO-2024-CKD-Guideline.pdf',
    section: 'KDIGO 2024 · Practice Point 3.6.2',
    action: 'Check blood pressure, serum creatinine and potassium within 2–4 weeks of starting or increasing an ACE inhibitor or ARB, considering current GFR and potassium.',
    why: 'Review kidney function, potassium and blood pressure after a treatment change to assess response and safety.',
    eligibility: 'Adults with CKD after starting or increasing an ACE inhibitor or ARB. Review baseline results, acute illness and current stability.',
    exception: 'Acute illness, concerning results or new symptoms may need earlier assessment. A routine due date must not delay urgent care.'
  });
  function parseDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) throw Error('Enter a valid calendar date.');
    const date = new Date(value + 'T00:00:00Z');
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) throw Error('Enter a valid calendar date.');
    return date;
  }
  function dueDate(start, days) {
    const date = parseDate(start);
    if (!Number.isInteger(days) || days < 1 || days > 28) throw Error('Choose 1–28 whole days.');
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  }
  function validatePlan(input, today) {
    const plan = {};
    for (const field of ['reference', 'changeDate', 'reviewDate', 'reviewer', 'reason', 'instructions']) {
      plan[field] = String(input[field] || '').trim();
      if (plan[field].length > 1500) throw Error('Keep each text field within 1500 characters.');
    }
    if (!plan.reference || !plan.reviewer || !plan.reason) throw Error('Plan reference, reviewer and clinical reason are required.');
    plan.days = Number(input.days);
    plan.due = dueDate(plan.changeDate, plan.days);
    parseDate(plan.reviewDate); parseDate(today);
    if (plan.reviewDate < plan.changeDate || plan.reviewDate > today) throw Error('Review date must be between the medicine change and today.');
    if (input.eligible !== true || input.reviewed !== true) throw Error('Confirm applicability and your review of this individual plan.');
    if (!Array.isArray(input.tasks) || input.tasks.length > 6) throw Error('Use up to six daily tasks.');
    plan.tasks = input.tasks.map(task => {
      const label = String(task.label || '').trim(), why = String(task.why || '').trim();
      if (!label || !why || label.length > 500 || why.length > 500) throw Error('Each task needs an instruction and reason (up to 500 characters each).');
      return { label, why };
    });
    plan.ruleId = rule.id; plan.ruleVersion = rule.version;
    return plan;
  }
  function reviewStep(review, hasPlan) {
    if (!hasPlan || (review.result && !review.sample) || (review.decision && !review.result) || (review.informed && !review.decision)) throw Error('Apply a plan, then record sample → result → decision → communication in order.');
    if (review.informed) return 'Decision communicated';
    if (review.decision) return 'Communication pending';
    if (review.result) return 'Clinician interpretation pending';
    return review.sample ? 'Result pending' : 'Sample pending';
  }
  const api = { rule, dueDate, validatePlan, reviewStep };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (!root.document) return;
  const document = root.document;
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const today = () => new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const formatDate = value => parseDate(value).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
  let plan = null, entries = [], revision = 0;
  let review = {sample:false,result:false,decision:'',informed:false};
  function rationale() {
    return `<details><summary>हा नियम का? · Why this rule?</summary><dl><dt>Purpose / उद्देश</dt><dd>${escape(rule.why)}</dd><dt>Applies to / कोणाला लागू?</dt><dd>${escape(rule.eligibility)}</dd><dt>When / कधी?</dt><dd>${escape(rule.action)}</dd><dt>Exceptions / अपवाद</dt><dd>${escape(rule.exception)}</dd></dl><p><a href="${rule.source}" target="_blank" rel="noopener noreferrer">${rule.section}</a> · ${rule.id} · ${rule.version}</p><p>Source checked. An individual plan requires clinician review.</p></details>`;
  }
  function mount() {
    const patientHost = document.getElementById('portalPanelTools'), doctorHost = document.getElementById('viewClinicalTools');
    if (!patientHost || !doctorHost || document.getElementById('careGuidancePatient')) return;
    const patient = document.createElement('section'); patient.id = 'careGuidancePatient'; patient.className = 'care-guidance';
    patient.innerHTML = `<span class="section-eyebrow">Practical Allopathy · Daily care</span><h3>माझी रोजची काळजी · My daily care</h3><p>डॉक्टरांचा आराखडा, रोजची नोंद आणि तपासणीची तारीख.</p><p class="cg-notice">नोंदी या उघडलेल्या पानात राहतात. पान बंद किंवा reload करण्यापूर्वी डाउनलोड करा. डॉक्टरांना संदेश आपोआप जात नाही. Session-only; cloud sync and automatic reminders are not connected.</p><div id="cgPatientPlan"></div>${rationale()}<form id="cgDaily"><label>नोंदीची तारीख · Date<input name="date" type="date" required></label><div id="cgTasks"></div><label>औषधे · Medicines<select name="medicines" required><option value="">निवडा · Choose</option><option value="taken">सांगितल्याप्रमाणे घेतली · Taken as directed</option><option value="missed">डोस चुकला · Missed dose</option><option value="unavailable">औषध मिळाले नाही · Unavailable</option><option value="uncertain">नक्की माहिती नाही · Unsure</option></select></label><label>नवीन बदल · Symptoms<select name="symptoms" required><option value="">निवडा · Choose</option><option value="none">नवीन बदल जाणवला नाही · No new change reported</option><option value="changed">नवीन किंवा वाढलेला त्रास · New/worsening symptoms</option><option value="urgent">तीव्र धाप / छातीत दुखणे / नवीन गोंधळ / बेशुद्ध पडणे · Emergency symptoms</option></select></label><p id="cgUrgency" role="alert"></p><label>अडचणी व बदल · Notes<textarea name="notes" maxlength="1500" rows="2"></textarea></label><button type="submit">नोंद करा · Record in this session</button><p id="cgDailyStatus" role="status"></p></form><button type="button" id="cgPatientDownload">नोंदी डाउनलोड करा · Download record</button><div id="cgEntries"></div>`;
    patientHost.prepend(patient);
    const doctor = document.createElement('section'); doctor.id = 'careGuidanceDoctor'; doctor.className = 'care-guidance';
    doctor.innerHTML = `<span class="section-eyebrow">Practical Allopathy · Clinician tools</span><h3>Rule-based CKD care plan</h3><p>Create an individual monitoring date and daily checklist. The applied plan appears in Patient Portal → Health tools in this same session.</p><p class="cg-notice">First module: adult CKD after ACE inhibitor / ARB initiation or dose increase. Session-only workspace. Use an anonymized reference; download before changing patient. Review entries are self-recorded, without a digital signature. Other disease rules and cloud synchronization remain pending.</p><details><summary>Prepare / revise the individual plan</summary><form id="cgPlanForm"><div class="cg-grid"><label>Plan reference<input name="reference" maxlength="80" required></label><label>Medicine change date<input name="changeDate" type="date" required></label><label>Clinician-selected interval (days)<input name="days" type="number" min="1" max="28" step="1" required></label><label>Review date<input name="reviewDate" type="date" required></label></div><p>Guideline window is 14–28 days. Earlier monitoring needs an individual clinical reason. New illness may need urgent assessment rather than this routine schedule.</p><label>Reason for this interval<textarea name="reason" maxlength="1500" rows="2" required></textarea></label><label>Reviewing clinician<input name="reviewer" maxlength="120" required></label><label>Individual instructions — method, time, units and contact plan<textarea name="instructions" maxlength="1500" rows="3"></textarea></label><fieldset><legend>Daily tasks for this patient</legend><div id="cgTaskEditor"></div><button type="button" id="cgAddTask">Add daily task</button></fieldset><label class="cg-check"><input name="eligible" type="checkbox" required> I checked adult CKD applicability, baseline GFR/potassium/BP, medication change and current clinical stability.</label><label class="cg-check"><input name="reviewed" type="checkbox" required> I reviewed this individual plan and instructions.</label><button type="submit">Apply plan to this session</button><p id="cgPlanStatus" role="status"></p></form></details>${rationale()}<div id="cgDoctorSummary" aria-live="polite"></div><details><summary>Result → decision → patient communication</summary><form id="cgReview"><label class="cg-check"><input name="sample" type="checkbox"> Sample collected</label><label class="cg-check"><input name="result" type="checkbox"> Result received and matched to patient/date</label><label>Interpretation and next action<textarea name="decision" maxlength="1500" rows="3"></textarea></label><label class="cg-check"><input name="informed" type="checkbox"> Decision communicated to patient/caregiver</label><button type="submit">Record review</button><p id="cgReviewStatus" role="status"></p></form></details><details><summary>Clinical judgement table</summary><table><thead><tr><th>Decision</th><th>Check before deciding</th></tr></thead><tbody><tr><td>What changed?</td><td>Baseline, dated values with units, symptoms, recent medicine changes and actual intake.</td></tr><tr><td>Possible cause</td><td>Supporting and opposing evidence, missing information, urgency and consequence of delay.</td></tr><tr><td>Next test</td><td>Which clinical question will it resolve? What result changes management?</td></tr><tr><td>Treatment</td><td>Indication, observed response, adverse effects, comorbidities and monitoring.</td></tr><tr><td>Exception</td><td>Why is the usual rule unsuitable? Record the individualized alternative.</td></tr></tbody></table></details><details><summary>Sources and planned coverage</summary><p>MSD — mechanisms and explanations. ICMR — Indian treatment workflows. WHO — primary care and self-care. Specialty guidelines — disease-specific monitoring. Drug labels — dose and formulation safety.</p><p>Only CKD-RAS-01 is implemented here. These links are reference destinations; their complete contents have not been ingested.</p><p><a href="https://www.icmr.gov.in/standard-treatment-workflows-stws" target="_blank" rel="noopener noreferrer">ICMR workflows</a> · <a href="https://www.msdmanuals.com/professional/nephrology/chronic-kidney-disease/chronic-kidney-disease" target="_blank" rel="noopener noreferrer">MSD CKD</a> · <a href="https://www.who.int/publications/i/item/9789240009226" target="_blank" rel="noopener noreferrer">WHO PEN</a></p></details><button type="button" id="cgDoctorDownload">Download plan and review</button><button type="button" id="cgClear">Clear session / change patient</button>`;
    doctorHost.prepend(doctor);
    const get = id => document.getElementById(id);
    const planForm = get('cgPlanForm'), daily = get('cgDaily'), reviewForm = get('cgReview');
    daily.elements.date.value = today();
    function renderSummary() {
      const dueStatus = !plan ? '' : plan.due < today() ? 'Overdue' : plan.due === today() ? 'Due today' : 'Upcoming';
      get('cgDoctorSummary').textContent = plan ? `Plan ${plan.reference} · revision ${revision} · ${dueStatus} ${formatDate(plan.due)} · ${reviewStep(review,true)} · ${entries.length} daily entries.` : 'No individual plan applied.';
      get('cgEntries').replaceChildren();
      for (const entry of entries.slice(-7).reverse()) {
        const item = document.createElement('details'), summary = document.createElement('summary'), text = document.createElement('p');
        summary.textContent = `${entry.date} · medicines: ${entry.medicines} · symptoms: ${entry.symptoms}`;
        text.textContent = [entry.notes,...entry.tasks.map(task=>`${task.label}: ${task.answer}`)].filter(Boolean).join(' | ');
        item.append(summary,text); get('cgEntries').append(item);
      }
    }
    function renderPlan() {
      get('cgPatientPlan').innerHTML = plan ? `<p><b>Plan ${escape(plan.reference)}</b> · revision ${revision}</p><p>BP, creatinine, potassium — <b>${formatDate(plan.due)}</b></p><p>${escape(plan.instructions || 'Ask your clinician for personal daily instructions.')}</p><details><summary>ही तारीख का? · Why this date?</summary><p>${escape(plan.reason)}</p><p>${plan.days} days from ${formatDate(plan.changeDate)}. Review recorded by ${escape(plan.reviewer)} on ${formatDate(plan.reviewDate)}. Self-recorded; not digitally signed.</p></details>` : '<p class="cg-notice">या सत्रात वैयक्तिक आराखडा भरलेला नाही. डॉक्टर तो Workstation Home मध्ये तयार करू शकतात. Daily observations can be recorded below.</p>';
      get('cgTasks').innerHTML = (plan?.tasks || []).map((task,index)=>`<label>${escape(task.label)}<select name="task${index}" required><option value="">निवडा · Choose</option><option value="done">केले · Done</option><option value="not-done">केले नाही · Not done</option><option value="unable">करता आले नाही · Unable</option></select></label><details><summary>हा नियम का? · Why?</summary><p>${escape(task.why)}</p></details>`).join('');
      renderSummary();
    }
    get('cgAddTask').addEventListener('click',()=>{
      const editor = get('cgTaskEditor'); if (editor.children.length >= 6) return;
      const row = document.createElement('div'); row.className = 'cg-task-editor';
      row.innerHTML = '<label>Daily action and method<input data-task-label maxlength="500" required></label><label>Why this action?<input data-task-why maxlength="500" required></label><button type="button">Remove task</button>';
      row.querySelector('button').addEventListener('click',()=>row.remove()); editor.append(row);
    });
    planForm.addEventListener('submit',event=>{
      event.preventDefault();
      try {
        const input = Object.fromEntries(new FormData(planForm));
        input.eligible=planForm.elements.eligible.checked; input.reviewed=planForm.elements.reviewed.checked;
        input.tasks=[...get('cgTaskEditor').children].map(row=>({label:row.querySelector('[data-task-label]').value,why:row.querySelector('[data-task-why]').value}));
        const next=validatePlan(input,today());
        if ((plan || entries.length) && !root.confirm('Applying a plan clears old daily entries and result review. Download first if needed. Continue?')) return;
        plan=next;revision++;entries=[];review={sample:false,result:false,decision:'',informed:false};
        reviewForm.reset();daily.reset();daily.elements.date.value=today();get('cgUrgency').textContent='';get('cgDailyStatus').textContent='';get('cgReviewStatus').textContent='';
        renderPlan();get('cgPlanStatus').textContent='Applied in this session. Open Patient Portal → Health tools. Download to retain the plan.';
      } catch(error){get('cgPlanStatus').textContent=error.message;}
    });
    daily.elements.symptoms.addEventListener('change',()=>{
      const value=daily.elements.symptoms.value;
      get('cgUrgency').textContent=value==='urgent'?'तातडीची मदत घ्या. जवळच्या emergency सेवेशी त्वरित संपर्क करा. पोर्टलच्या प्रतिसादाची वाट पाहू नका. Seek emergency care now.':value==='changed'?'नवीन किंवा वाढलेल्या त्रासासाठी डॉक्टरांशी संपर्क करा. Routine test date ची वाट पाहू नका. No notification is sent by this form.':'';
    });
    daily.addEventListener('submit',event=>{
      event.preventDefault();
      try {
        const data=Object.fromEntries(new FormData(daily));parseDate(data.date);
        if(data.date>today())throw Error('Future daily entries are not allowed.');
        if(!['taken','missed','unavailable','uncertain'].includes(data.medicines)||!['none','changed','urgent'].includes(data.symptoms))throw Error('Complete medicine and symptom answers.');
        const tasks=(plan?.tasks||[]).map((task,index)=>{
          const answer=data['task'+index];if(!['done','not-done','unable'].includes(answer))throw Error('Answer every daily task.');
          return {...task,answer};
        });
        entries.push({date:data.date,medicines:data.medicines,symptoms:data.symptoms,notes:data.notes,tasks,planRevision:revision,recordedAt:new Date().toISOString()});
        renderSummary();get('cgDailyStatus').textContent='Recorded in this session. No message was sent. Contact a clinician directly for new or urgent symptoms.';
      }catch(error){get('cgDailyStatus').textContent=error.message;}
    });
    reviewForm.addEventListener('submit',event=>{
      event.preventDefault();
      try{
        const next={sample:reviewForm.elements.sample.checked,result:reviewForm.elements.result.checked,decision:reviewForm.elements.decision.value.trim(),informed:reviewForm.elements.informed.checked};
        reviewStep(next,!!plan);review=next;renderSummary();get('cgReviewStatus').textContent='Review recorded in this session. Download to retain it.';
      }catch(error){get('cgReviewStatus').textContent=error.message;}
    });
    function exportRecord(){
      const record={schemaVersion:1,exportedAt:new Date().toISOString(),timezone:'Asia/Kolkata',plan,revision,dailyEntries:entries,resultReview:review,sourceRule:rule};
      const url=URL.createObjectURL(new Blob([JSON.stringify(record,null,2)],{type:'application/json'}));
      const link=document.createElement('a');link.href=url;link.download='care-plan-'+today()+'.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
    get('cgPatientDownload').addEventListener('click',exportRecord);get('cgDoctorDownload').addEventListener('click',exportRecord);
    function clearSession(){
      plan=null;entries=[];revision=0;review={sample:false,result:false,decision:'',informed:false};
      planForm.reset();daily.reset();reviewForm.reset();get('cgTaskEditor').replaceChildren();daily.elements.date.value=today();
      for(const id of ['cgPlanStatus','cgDailyStatus','cgReviewStatus','cgUrgency'])get(id).textContent='';renderPlan();
    }
    get('cgClear').addEventListener('click',()=>{if(root.confirm('Clear plan, daily entries and review before changing patient? Download first to keep a copy.'))clearSession();});
    root.addEventListener('clinic-owner-signed-out',clearSession);
    document.addEventListener('change',event=>{if(event.target.id==='cloudPatientSelect')clearSession();});
    renderPlan();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})(typeof window==='undefined'?globalThis:window);
