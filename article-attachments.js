/* Device attachments use IndexedDB; public/cloud storage is not connected. */
(() => {
  'use strict';
  let pending=[];let busy=0;
  const status=message=>{document.getElementById('attachmentStatus').textContent=message;};
  const dbPromise=new Promise((resolve,reject)=>{
    const request=indexedDB.open('kulkarniArticleFiles',1);
    request.onupgradeneeded=()=>request.result.createObjectStore('files',{keyPath:'id'});
    request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
  });
  // A denied browser-storage permission is reported when the user attaches a file.
  dbPromise.catch(()=>{});
  async function put(record){const db=await dbPromise;return new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite');tx.objectStore('files').put(record);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}
  async function get(id){const db=await dbPromise;return new Promise((resolve,reject)=>{const r=db.transaction('files').objectStore('files').get(id);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
  function list(){
    const target=document.getElementById('pendingArticleAttachments');target.replaceChildren();
    pending.forEach((file,index)=>{
      const row=document.createElement('div');row.className='attachment-row';
      const text=document.createElement('span');text.textContent=file.name+(file.kind==='file'?` · ${(file.size/1024).toFixed(0)} KB · this device`:' · online link');row.appendChild(text);
      const remove=document.createElement('button');remove.type='button';remove.textContent='Remove';remove.onclick=()=>{pending.splice(index,1);list();};row.appendChild(remove);target.appendChild(row);
    });
  }
  function link(raw){let u;try{u=new URL(raw);}catch{throw Error('Paste the complete HTTPS link.');}if(u.protocol!=='https:')throw Error('Use an HTTPS article or Google Drive link.');return u.href;}
  function addLink(){
    try{
      const input=document.getElementById('newArtUrl');const url=link(input.value.trim());
      if(!pending.some(a=>a.url===url))pending.push({kind:'link',url,name:new URL(url).hostname});
      input.value='';list();status('Link added. Drive access depends on the file owner’s sharing permissions.');
    }catch(e){status(e.message);}
  }
  const originalPublish=publishNewArticle;
  publishNewArticle=function(){
    if(busy){status('Please wait until the selected files finish saving.');return;}
    if(document.getElementById('newArtUrl').value.trim()){
      const count=pending.length;addLink();if(pending.length===count&&document.getElementById('newArtUrl').value.trim())return;
    }
    if(!pending.length){originalPublish();return;}
    const title=document.getElementById('newArtTitle');const body=document.getElementById('newArtBody');
    if(pending.length){if(!title.value.trim())title.value=pending[0].name;if(!body.value.trim())body.value='Attached resource. Open the source and review it before using it for patient guidance.';}
    if(!title.value.trim()||!body.value.trim()){originalPublish();return;}
    const attachments=pending.map(a=>({...a}));
    try{
      const beforeCount=JSON.parse(localStorage.getItem('patientArticles')||'[]').length;
      originalPublish();
      const articles=JSON.parse(localStorage.getItem('patientArticles')||'[]');
      if(articles.length!==beforeCount+1){status('The article was not saved. Your selected attachments remain available; add a title and body, then try again.');return;}
      articles[0].attachments=attachments;
      localStorage.setItem('patientArticles',JSON.stringify(articles));pending=[];list();
      renderPublishedArticles();status('Article and attachments saved in this browser. Shared online publication is not connected.');
      showToast('Article saved in this browser.');
    }catch(e){status('Could not save the article: '+e.message);}
  };
  function append(container,articles,publicMode){
    for(const [index,article]of articles.entries()){
      const card=document.getElementById((publicMode?'publicArticle_':'moonArticle_')+index);if(!card||!Array.isArray(article.attachments))continue;
      const area=document.createElement('div');area.className='attachment-links';
      for(const attachment of article.attachments){
        if(attachment.kind==='link'){
          try{const a=document.createElement('a');a.href=link(attachment.url);a.target='_blank';a.rel='noopener noreferrer';a.textContent='Open attached article / Drive file ↗';area.appendChild(a);}catch{}
        }else if(attachment.kind==='file'&&typeof attachment.id==='string'){
          const button=document.createElement('button');button.type='button';button.textContent='Open / download: '+attachment.name;
          button.onclick=async()=>{try{const item=await get(attachment.id);if(!item)throw Error('This file is not stored on this device. Use the original device or an accessible online link.');const url=URL.createObjectURL(item.blob);const a=document.createElement('a');a.href=url;a.download=attachment.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}catch(e){alert(e.message);}};
          area.appendChild(button);
        }
      }
      if(area.childNodes.length)card.appendChild(area);
    }
  }
  const originalCards=safeArticleCards;
  safeArticleCards=function(container,articles,publicMode){originalCards(container,articles,publicMode);append(container,articles,publicMode);};
  document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('articleAttachFiles').addEventListener('change',async e=>{
      const files=Array.from(e.target.files||[]);if(!files.length)return;
      if(files.length+pending.length>12){status('Attach up to 12 files or links per article.');e.target.value='';return;}
      busy++;status('Saving selected files on this device…');
      try{
        for(const file of files){
          if(file.size>20*1024*1024)throw Error(file.name+': use a file up to 20 MB, or add a shared Drive link for larger files.');
          const id=crypto.randomUUID();await put({id,blob:file,name:file.name,type:file.type});
          pending.push({id,kind:'file',name:file.name,type:file.type,size:file.size});
          if(/\.(txt|md)$/i.test(file.name)&&!document.getElementById('newArtBody').value.trim())document.getElementById('newArtBody').value=(await file.text()).slice(0,100000);
        }
        status('Files attached on this device. Add a title and review the article before saving.');
      }catch(e){status('Attachment status: '+e.message);}finally{busy--;list();e.target.value='';}
    });
    document.getElementById('addArticleSourceLink').onclick=addLink;
    document.getElementById('focusArticleSourceLink').onclick=()=>{document.getElementById('newArtUrl').focus();document.getElementById('newArtUrl').scrollIntoView({block:'center',behavior:'smooth'});};
  });
})();
