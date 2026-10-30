'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
const script=fs.readFileSync('invoice-generator.js','utf8');
const html='<input id="invoiceNumber"><input id="invoiceDate"><input id="invoicePatientName"><input id="invoicePatientPhone"><input id="invoicePatientAddress"><input id="invoiceService"><input id="invoiceAmount"><select id="invoicePaymentStatus"><option>Not yet confirmed</option></select><select id="invoicePaymentMethod"><option>Not specified</option></select><output id="invoiceTotal"></output><textarea id="invoiceNotes"></textarea><p id="invoiceStatus"></p><button id="invoiceFromPrescription"></button><button id="invoiceSharePdf"></button><button id="invoiceDownloadPdf"></button><button id="invoicePrint"></button><input id="rxPatName" value="Synthetic Patient"><input id="rxPatPhone" value="0000000000"><input id="rxPatLoc" value="Synthetic locality">';
(async()=>{
 const dom=new JSDOM(html,{url:'https://clinic.example.test',runScripts:'outside-only'}),w=dom.window,$=id=>w.document.getElementById(id),downloads=[],shares=[];w.exportToPdf=(...args)=>downloads.push(args);w.shareDocumentPdf=(...args)=>shares.push(args);let openedTab='';w.switchDocTab=tab=>{openedTab=tab;};
 w.eval(script);w.document.dispatchEvent(new w.Event('DOMContentLoaded'));await new Promise(r=>setTimeout(r,10));
 assert.match($('invoiceNumber').value,/^HVICD-\d{8}-\d{4}$/);assert.match($('invoiceDate').value,/^\d{2}\/\d{2}\/\d{4}$/);
 $('invoiceDownloadPdf').click();assert.equal(downloads.length,0,'Blank invoice must not export');assert.match($('invoiceStatus').textContent,/patient name/i);
 $('invoicePatientName').value='Synthetic Patient';$('invoiceService').value='Home visit';$('invoiceAmount').value='1200';$('invoiceAmount').dispatchEvent(new w.Event('input'));assert.equal($('invoiceTotal').textContent,'₹1,200');
 $('invoiceDownloadPdf').click();assert.equal(downloads.length,1);assert.equal(downloads[0][0],'invoiceSheet');assert.match(downloads[0][1],/^Invoice_\d{4}-\d{2}-\d{2}$/);
 $('invoiceSharePdf').click();assert.equal(shares.length,1);assert.equal(shares[0][0],'invoiceSheet');assert.equal(shares[0][2].direct,true,'Share action requests direct sharing rather than save-first');
 $('invoicePaymentStatus').value='Paid — manually verified';assert.equal(downloads.length,1,'Payment-status selection never triggers payment verification or changes the export count');
 $('invoiceFromPrescription').click();assert.equal($('invoicePatientName').value,'Synthetic Patient');assert.equal($('invoicePatientPhone').value,'0000000000');assert.equal($('invoicePatientAddress').value,'Synthetic locality');assert.equal(openedTab,'invoice');
 dom.window.close();console.log('Invoice validation checks passed: required fields, amount formatting, PDF download/share, and prescription detail copy.');
})().catch(e=>{console.error(e);process.exitCode=1;});
