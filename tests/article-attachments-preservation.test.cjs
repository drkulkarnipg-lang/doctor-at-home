'use strict';
const assert=require('node:assert/strict'),{JSDOM}=require('jsdom'),fs=require('node:fs');
const script=fs.readFileSync('article-attachments.js','utf8');
function boot(){
 const dom=new JSDOM('<input id="newArtTitle"><textarea id="newArtBody"></textarea><input id="newArtUrl"><input id="articleAttachFiles" type="file" multiple><div id="attachmentStatus"></div><div id="pendingArticleAttachments"></div><button id="addArticleSourceLink"></button><button id="focusArticleSourceLink"></button><div id="publishedArticlesGrid"></div>',{url:'https://clinic.example.test',runScripts:'outside-only'});
 const w=dom.window;w.alert=()=>{};w.showToast=()=>{};w.safeArticleCards=()=>{};w.renderPublishedArticles=()=>{};
 w.publishNewArticle=function(){const title=w.document.getElementById('newArtTitle').value.trim(),body=w.document.getElementById('newArtBody').value.trim();if(!title||!body){w.alert('Please enter article title and body.');return;}const a=JSON.parse(w.localStorage.getItem('patientArticles')||'[]');a.unshift({title,body,attachments:[],date:'30/10/2026'});w.localStorage.setItem('patientArticles',JSON.stringify(a));};
 w.eval(script);w.document.dispatchEvent(new w.Event('DOMContentLoaded'));return{w,close:()=>dom.window.close()};
}
(async()=>{
 const a=boot(),w=a.w;
 const original=[{title:'Existing guide',body:'Keep these links',attachments:[{kind:'link',url:'https://example.org/keep'}]}];
 w.localStorage.setItem('patientArticles',JSON.stringify(original));
 w.publishNewArticle();
 assert.deepEqual(JSON.parse(w.localStorage.getItem('patientArticles')),original,'A failed empty-editor save must not erase attachments on an existing article');
 w.document.getElementById('newArtUrl').value='https://example.org/clinical-guide';
 w.publishNewArticle();
 const saved=JSON.parse(w.localStorage.getItem('patientArticles'));
 assert.equal(saved.length,2,'New article is added without replacing the existing one');
 assert.equal(saved[0].attachments.length,1,'New article retains the pending source attachment');
 assert.equal(saved[0].attachments[0].url,'https://example.org/clinical-guide');
 assert.deepEqual(saved[1].attachments,original[0].attachments,'Existing article attachments remain unchanged');
 a.close();
 console.log('Article attachment preservation checks passed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
