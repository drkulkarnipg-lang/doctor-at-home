/* Local physician review queue; no credentials, background jobs or automatic publishing. */
(() => {
  'use strict';
  const key = 'kulkarniResearchDraftsV1';
  const fields = ['finding', 'evidence', 'limitations', 'practiceImpact', 'patientGuidance'];
  const names = ['Key finding', 'Evidence and study type', 'Limitations', 'Practical implications', 'Patient-education draft'];
  const read = () => { try { const v = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } };
  window.ResearchReview={find:url=>read().find(d=>d.url===url),addRssItem:item=>{const url=new URL(item.url);if(url.protocol!=='https:'||url.username||url.password)throw Error('A valid HTTPS source is required.');const all=read(),existing=all.find(d=>d.url===url.href);if(existing){existing.reviewNotes=String(item.reviewNotes||'').slice(0,12000);localStorage.setItem(key,JSON.stringify(all));render();return false;}if(all.length>=300)throw Error('Review queue full. Export a backup first.');all.unshift({title:String(item.title).slice(0,12000),url:url.href,source:String(item.source),published:String(item.published),contentScope:'rss_excerpt',finding:'Not assessed. Supplied RSS excerpt: '+String(item.excerpt||'No excerpt provided.'),evidence:'Not assessed from the supplied material.',limitations:'Full text and study methods have not been reviewed.',practiceImpact:'Not assessed; no practice change recommended by this tool.',patientGuidance:'Unapproved. Physician review required before any patient publication.',reviewNotes:String(item.reviewNotes||'').slice(0,12000)});localStorage.setItem(key,JSON.stringify(all));render();return true;}};
  window.ResearchReview.importCloud=items=>{const all=read(),urls=new Set(all.map(d=>d.url));let added=0;for(const item of items){const u=new URL(item.url);if(u.protocol!=='https:'||u.username||u.password||urls.has(u.href))continue;if(all.length>=300)throw Error('Review queue full. Export a backup first.');const d={title:String(item.title).slice(0,800),url:u.href,source:String(item.source),published:String(item.published),contentScope:'rss_excerpt',reviewNotes:String(item.review_notes||'').slice(0,12000)};for(const f of fields)d[f]=String(item.draft?.[f]||'Not assessed.').slice(0,12000);all.unshift(d);urls.add(u.href);added++;}localStorage.setItem(key,JSON.stringify(all));render();return added;};
  function node(tag, text, parent) { const el = document.createElement(tag); if(text) el.textContent = text; if(parent) parent.appendChild(el); return el; }
  function render() {
    const list = document.getElementById('researchDraftList');
    list.replaceChildren();
    const drafts = read();
    document.getElementById('researchDraftCount').textContent = `${drafts.length} draft${drafts.length === 1 ? '' : 's'} saved in this browser`;
    drafts.forEach(d => {
      const card = node('article', '', list); card.className = 'research-draft';
      node('small', 'DRAFT · PHYSICIAN REVIEW REQUIRED', card);
      node('h4', d.title, card);
      const link = node('a', 'Open original source ↗', card); link.href=d.url; link.target='_blank';link.rel='noopener noreferrer';
      node('small', `${d.source || 'Source not specified'} · ${d.published || 'Publication date not supplied'} · ${d.contentScope}`, card);
      const dl=node('dl','',card);
      fields.forEach((f,i) => {node('dt',names[i],dl);node('dd',d[f] || 'Not reported in the imported draft.',dl);});
      const label=node('label','Physician review notes',card);
      const notes=node('textarea','',label);notes.value=d.reviewNotes || '';notes.placeholder='Record corrections and source checks before preparing patient education.';
      const save=node('button','Save review notes',card);save.type='button';save.onclick=()=>{const all=read();const item=all.find(a=>a.url===d.url);if(item){item.reviewNotes=notes.value.slice(0,12000);localStorage.setItem(key,JSON.stringify(all));showToast('Review notes saved in this browser.');}};
      const edit=node('button','Open draft in Article Manager',card);edit.type='button';edit.onclick=()=>{switchDocTab('articlesHub');document.getElementById('newArtTitle').value=d.title;document.getElementById('newArtCat').value='Research draft — needs review';document.getElementById('newArtBody').value=fields.map((f,i)=>`${names[i]}: ${d[f] || 'Not reported'}`).join('\n\n')+`\n\nSource: ${d.url}\nContent available: ${d.contentScope}\nPhysician notes: ${notes.value}`;uploadedMediaData=null;showToast('Draft opened for editing. Nothing has been published.');};
    });
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.doctor-tabs button').forEach((b,i)=>{b.setAttribute('aria-selected',String(i===0));b.addEventListener('click',()=>{document.querySelectorAll('.doctor-tabs button').forEach(x=>x.setAttribute('aria-selected',String(x===b)));});});
    document.getElementById('researchImport').addEventListener('change',async e=>{
      const status=document.getElementById('researchImportStatus');
      try {
        const file=e.target.files[0];if(!file)return;if(file.size>2_000_000)throw Error('Use a JSON file smaller than 2 MB.');
        const data=JSON.parse(await file.text());const raw=Array.isArray(data)?data:data.articles;
        if(!Array.isArray(raw)||!raw.length||raw.length>100)throw Error('Provide 1–100 articles in an articles array.');
        const incoming=raw.map(item=>{
          if(!item||typeof item.title!=='string'||!item.title.trim())throw Error('Every draft needs a title.');
          let url;try{url=new URL(item.url);}catch{throw Error('Every draft needs a valid source URL.');}
          if(url.protocol!=='https:')throw Error('Source URLs must use HTTPS.');
          if(!['full_text','abstract','rss_excerpt'].includes(item.contentScope))throw Error('Set contentScope to full_text, abstract or rss_excerpt for each article.');
          const d={url:url.href,contentScope:item.contentScope};
          for(const f of ['title','source','published',...fields]) {if(item[f]!=null&&typeof item[f]!=='string')throw Error(`${f} must be text.`);d[f]=(item[f]||'').slice(0,12000);}
          return d;
        });
        const all=read();const urls=new Set(all.map(a=>a.url));let added=0;
        for(const d of incoming)if(!urls.has(d.url)){all.unshift(d);urls.add(d.url);added++;}
        if(all.length>300)throw Error('Review queue is full. Export a backup before clearing older drafts.');
        localStorage.setItem(key,JSON.stringify(all));status.textContent=`${added} new drafts imported. Duplicate source URLs skipped. Nothing published.`;status.className='';render();
      }catch(err){status.textContent=err.message;status.className='research-error';}finally{e.target.value='';}
    });
    document.getElementById('researchExport').addEventListener('click',()=>{
      const blob=new Blob([JSON.stringify({articles:read()},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=node('a');a.href=url;a.download='clinical-research-review-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
    render();
  });
})();
