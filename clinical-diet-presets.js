/* Clinician-facing acute illness diet presets.
 * These are editable starting points for an individual prescription, not patient-specific orders.
 * No patient data are collected, transmitted or persisted by this module.
 */
(function (root) {
  'use strict';

  const presets = {
    'viral-fever': {
      title: 'Viral fever — supportive care & hydration',
      category: 'Acute febrile illness',
      advice: [
        'Encourage frequent oral fluids according to thirst, losses, urine output and any cardiac/renal fluid restriction. Use ORS when there are significant gastrointestinal fluid losses; water, soups and other tolerated fluids may supplement intake.',
        'Rest while febrile or significantly unwell; resume activity gradually as symptoms improve. Offer small, regular, nutritious meals as tolerated; do not force food.',
        'Reduce transmission: stay home while febrile/unwell where feasible, practise hand and respiratory hygiene, improve ventilation, use a mask when respiratory symptoms are present, and avoid close contact with vulnerable people. Do not isolate from every healthy person as a blanket rule.',
        'Medicines are symptom-directed and supportive; use only the clinician-advised medicine and dose. Avoid self-medication and unnecessary antibiotics. If dengue is possible, avoid aspirin/NSAIDs unless specifically directed by the treating clinician.',
        'Reassess persistent fever (especially ≥3 days), worsening weakness, poor intake or reduced urine. Seek urgent assessment for breathlessness, chest pain, confusion, fainting, bleeding, severe abdominal pain, persistent vomiting, inability to drink, cold/clammy extremities or rapid deterioration.',
        'Individualize for pregnancy, older age, immunosuppression, diabetes, kidney/heart disease, liver disease and children; this preset is not a diagnosis of viral infection.'
      ]
    },
    hepatitis: {
      title: 'Hepatitis — liver-safe nutrition',
      category: 'Hepatic illness',
      advice: [
        'Aim for adequate calories and a balanced diet with regular small meals if appetite is reduced. Maintain oral fluids as tolerated unless a clinician has prescribed a fluid restriction.',
        'Avoid alcohol completely during acute hepatitis and until the treating clinician confirms it is safe. Do not use herbal, bodybuilding, Ayurvedic or over-the-counter products without checking for potential liver toxicity.',
        'Do not start, stop or increase medicines (including paracetamol/acetaminophen) without clinician review; check all combination cold/fever products for duplicate ingredients.',
        'There is no universal “liver detox” diet. Do not routinely restrict protein or fats without a specific clinical indication; tailor nutrition to the cause, severity, nutritional state and laboratory/clinical findings.',
        'Urgent hospital assessment is required for new confusion/drowsiness, bleeding, repeated vomiting or inability to maintain intake, hypoglycaemia, rapidly worsening jaundice, severe abdominal pain, collapse or clinical deterioration.',
        'Document suspected cause, severity, pregnancy status, medication/toxin exposure and follow-up plan. This preset does not replace evaluation for acute liver failure or cause-specific treatment.'
      ]
    },
    'liver-disease': {
      title: 'Chronic liver disease — individualized nutrition',
      category: 'Chronic hepatic disease',
      advice: [
        'Prevent malnutrition: provide adequate energy and regular meals; consider smaller frequent meals and a late-evening snack when appropriate. Avoid prolonged fasting.',
        'Do not routinely restrict dietary protein, including solely because hepatic encephalopathy is present. Protein amount and source should be individualized with the treating team/dietitian; investigate and treat precipitating causes of encephalopathy.',
        'If ascites or oedema is present, individualize sodium advice and review hidden salt in packaged foods. Do not prescribe severe salt restriction without assessing intake and nutritional risk.',
        'Restrict fluids only when there is a specific indication (for example, clinically significant dilutional hyponatraemia) and a documented clinician-directed target. Do not apply a blanket fluid limit to all liver disease.',
        'Avoid alcohol. Review medicines, supplements and herbal products for hepatotoxicity; avoid raw shellfish and unsafe/unpasteurized foods in advanced cirrhosis or immunocompromised patients.',
        'Urgent assessment for confusion, gastrointestinal bleeding/black stools, fever with abdominal pain or ascites, rapidly increasing abdominal distension, reduced urine, breathlessness, persistent vomiting or jaundice with deterioration.',
        'Individualize for cirrhosis stage, ascites, renal function, sodium, diabetes, sarcopenia, transplant status and nutritional assessment.'
      ]
    },
    diarrhoea: {
      title: 'Loose motions — ORS & continued feeding',
      category: 'Acute diarrhoea',
      advice: [
        'Use correctly prepared oral rehydration solution (ORS): dissolve the sachet in exactly the volume of safe water printed on that packet. Do not add extra sugar/salt or mix with milk/juice. Prepare fresh and discard according to packet/local guidance.',
        'Give frequent small sips and replace ongoing losses. Continue breastfeeding and age-appropriate usual food; adults should continue light, nutritious meals as tolerated. Avoid fasting.',
        'Avoid excessive fruit juice, very sugary drinks and alcohol, which may worsen diarrhoea. A restrictive “BRAT-only” diet is not required; resume a balanced diet as tolerated.',
        'Antibiotics and antidiarrhoeal medicines are not routine; use only after clinical assessment. Avoid antimotility drugs when there is blood in stool, high fever, suspected invasive infection or severe abdominal pain unless specifically directed.',
        'Urgent assessment for shock, fainting, confusion, inability to drink, persistent vomiting, markedly reduced urine, blood/black stool, severe abdominal pain, high fever or worsening dehydration.',
        'Use a lower threshold for assessment in infants/young children, older/frail adults, pregnancy, immunosuppression and significant renal/cardiac disease. Individualize ORS/fluid advice if fluid or electrolyte restrictions apply.'
      ]
    },
    vomiting: {
      title: 'Vomiting — oral rehydration & escalation',
      category: 'Nausea and vomiting',
      advice: [
        'If alert and able to swallow safely, start with very small, frequent sips of ORS or clear tolerated fluids; increase gradually as retained. If vomiting recurs, pause briefly and restart more slowly. Do not force large volumes at once.',
        'Once fluids are retained, reintroduce small portions of familiar, easily tolerated food. Avoid alcohol and very fatty meals temporarily; prolonged fasting is not advised.',
        'Do not give oral fluids to a drowsy, confused, actively choking or unsafe-to-swallow patient. Assess aspiration risk and arrange urgent care when oral hydration is not safe or feasible.',
        'Seek urgent assessment for inability to retain fluids, reduced urine, postural fainting/collapse, blood or coffee-ground vomit, green/bilious vomit, severe abdominal pain/distension, severe headache/neck stiffness, chest pain, confusion, pregnancy with significant dehydration or suspected poisoning.',
        'Review likely cause, hydration/perfusion, glucose, electrolytes and medication effects as clinically indicated. Antiemetics should be selected and dosed by the treating clinician after contraindication and QT-risk review.',
        'Individualize for children, older adults, diabetes, renal/cardiac disease and pregnancy. Persistent vomiting or dehydration may require supervised rehydration and investigation.'
      ]
    }
  };

  function appendAdvice(key) {
    const preset = presets[key];
    const target = document.getElementById('rxAdvice');
    if (!preset || !target) return false;
    const block = preset.title + '\n' + preset.advice.map((line, i) => (i + 1) + '. ' + line).join('\n');
    if (target.value.includes(block)) return true;
    target.value = target.value.trim() ? target.value.trim() + '\n\n' + block : block;
    target.dispatchEvent(new Event('input', { bubbles: true }));
    target.focus();
    return true;
  }

  function renderCards() {
    const host = document.getElementById('dietPresetCards');
    if (!host || host.dataset.clinicalPresetsRendered === 'true') return;
    host.dataset.clinicalPresetsRendered = 'true';
    Object.entries(presets).forEach(([key, preset]) => {
      const card = document.createElement('article');
      card.className = 'p-4 rounded-2xl border bg-white space-y-2';
      const heading = document.createElement('h4');
      heading.className = 'font-bold text-sm text-[#0F2942]';
      heading.textContent = preset.title;
      const category = document.createElement('p');
      category.className = 'text-xs text-slate-500';
      category.textContent = preset.category;
      const summary = document.createElement('p');
      summary.className = 'text-xs text-slate-600 leading-relaxed';
      summary.textContent = preset.advice[0];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'bg-[#275f4b] text-white text-xs font-bold px-3 py-2 rounded-xl';
      button.textContent = 'Add to prescription advice';
      button.addEventListener('click', () => {
        if (appendAdvice(key)) {
          button.textContent = 'Added — review before signing';
          button.setAttribute('aria-live', 'polite');
        }
      });
      card.append(category, heading, summary, button);
      host.appendChild(card);
    });
  }

  // Preserve the seven established release-tools.js presets while adding the five acute-illness cards.
  const legacyInsertDietPreset = typeof root.insertDietPreset === 'function'
    ? root.insertDietPreset.bind(root)
    : null;
  root.insertDietPreset = function (key) {
    if (presets[key]) {
      const ok = appendAdvice(key);
      const select = document.getElementById('prescriptionDietPreset');
      if (select) select.value = '';
      if (ok) {
        const status = document.getElementById('rxAdvice');
        if (status) status.setAttribute('aria-label', 'Diet advice populated; review and individualize before signing');
      }
      return ok;
    }
    if (legacyInsertDietPreset && root.ReleaseTools?.diets?.[key]) {
      legacyInsertDietPreset(key);
      return true;
    }
    return false;
  };
  root.ClinicalDietPresets = Object.freeze({
    keys: Object.freeze(Object.keys(presets)),
    get: key => presets[key] || null
  });

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderCards);
    else renderCards();
  }
})(typeof window !== 'undefined' ? window : globalThis);
