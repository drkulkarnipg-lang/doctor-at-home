'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const lines=fs.readFileSync('data/pasted-text-10-line-traceability-2026-10-30.jsonl','utf8').trimEnd().split('\n').map(JSON.parse).slice(1);
const rows=fs.readFileSync('data/pasted-text-10-sentence-traceability-2026-10-30.jsonl','utf8').trimEnd().split('\n').map(JSON.parse),meta=rows[0],units=rows.slice(1);
assert.equal(meta.source_document,'Pasted text(10).txt');assert.equal(meta.source_line_count,166);assert.equal(meta.nonempty_source_lines,lines.length);assert.equal(meta.sentence_or_fragment_units,units.length);
assert.equal(new Set(units.map(x=>x.sentence_unit_id)).size,units.length);
for(const u of units){assert.ok(u.source_text.length>0&&u.evidence_pointer&&u.next_action);assert.doesNotMatch(u.line_status,/\bCOMPLETE\b|\bDONE\b|\bVERIFIED LIVE\b/i);}
for(const parent of lines){const parts=units.filter(x=>x.source_line_id===parent.source_unit_id).sort((a,b)=>a.segment_index-b.segment_index);assert.ok(parts.length>0,parent.source_unit_id);assert.equal(parts.length,parts[0].segment_count);assert.deepEqual(parts.map(x=>x.segment_index),Array.from({length:parts.length},(_,i)=>i+1));assert.equal(parts.map(x=>x.source_text).join(''),parent.source_text,parent.source_unit_id+' must reconstruct its public-safe source line');assert.ok(parts.every(x=>x.evidence_pointer===parent.evidence_pointer&&x.line_status===parent.line_status));}
const textAll=rows.map(x=>JSON.stringify(x)).join('\n');assert.doesNotMatch(textAll,/\b\d{11,18}\b/);assert.doesNotMatch(textAll,/\b[A-Z]{4}0[A-Z0-9]{6}\b/i);
console.log('Pasted text(10) sentence traceability passed: '+units.length+' sentence/fragment units reconstruct all 63 source lines exactly after documented privacy redaction.');
