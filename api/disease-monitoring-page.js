'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {owner}=require('../server/owner-session');
module.exports=async function(req,res){
 res.setHeader('Cache-Control','private, no-store');res.setHeader('Vercel-CDN-Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','no-referrer');
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).send('Method not allowed.');}
 const session=await owner(req).catch(()=>null);
 if(!session){res.setHeader('Content-Type','text/plain; charset=utf-8');return res.status(401).send('Doctor Workstation owner login required. Return to the website, sign in, then reopen Disease Monitoring Centre.');}
 try{const html=fs.readFileSync(path.join(process.cwd(),'server','disease-monitoring.html'),'utf8');res.setHeader('Content-Type','text/html; charset=utf-8');return res.status(200).send(html);}
 catch{return res.status(500).send('Disease Monitoring Centre could not be loaded. No patient data was accessed.');}
};
