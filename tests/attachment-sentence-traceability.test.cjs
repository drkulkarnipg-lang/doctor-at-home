'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const lines=fs.readFileSync('data/attachment-line-traceability-2026-10-30.jsonl','utf8').trimEnd().split('\n').map(JSON.parse).slice(1);
const rows=fs.readFileSync('data/attachment-sentence-traceability-2026-10-30.jsonl','utf8').trimEnd().split('\n').map(JSON.parse);
const meta=rows[0],units=rows.slice(1);
assert.equal(meta.record_type,'metadata');
assert.match(meta.source_document,/Pasted text\.txt/);
assert.doesNotMatch(meta.source_document,/Pasted text\(10\)/);
assert.equal(meta.source_line_count,lines.length);
assert.equal(meta.source_line_count,1059);
assert.equal(meta.reported_source_lines,1991);
assert.equal(meta.sentence_or_fragment_units,units.length);
assert.equal(rows.length,units.length+1);
assert.equal(new Set(units.map(x=>x.sentence_unit_id)).size,units.length,'Sentence IDs must be unique');
for(const u of units){assert.ok(u.source_line_id&&u.source_text.length>0&&u.evidence_pointer&&u.next_action,u.sentence_unit_id+' must preserve text and traceability');assert.ok(!/\bCOMPLETE\b|\bDONE\b|\bVERIFIED LIVE\b/i.test(u.line_status),u.sentence_unit_id+' must not infer completion');}
for(const parent of lines){const parts=units.filter(x=>x.source_line_id===parent.source_unit_id).sort((a,b)=>a.segment_index-b.segment_index);assert.ok(parts.length>0,parent.source_unit_id+' must have sentence/fragment coverage');assert.equal(parts.length,parts[0].segment_count,parent.source_unit_id+' segment count must be consistent');assert.deepEqual(parts.map(x=>x.segment_index),Array.from({length:parts.length},(_,i)=>i+1),parent.source_unit_id+' segment indexes must be contiguous');assert.equal(parts.map(x=>x.source_text).join(''),parent.source_text,parent.source_unit_id+' must reconstruct the original line exactly');assert.ok(parts.every(x=>x.evidence_pointer===parent.evidence_pointer&&x.line_status===parent.line_status),parent.source_unit_id+' segments must inherit the same evidence gate');}
console.log('Sentence-level traceability passed: all sentence fragments are evidence-mapped and reconstruct all 1,059 original non-empty lines exactly, with no inferred completion.');
