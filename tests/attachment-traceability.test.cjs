'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const path='data/attachment-line-traceability-2026-10-30.jsonl';
const rows=fs.readFileSync(path,'utf8').trimEnd().split('\n').map((line,i)=>{try{return JSON.parse(line)}catch(e){throw Error('Invalid JSONL record on line '+(i+1)+': '+e.message)}});
const meta=rows[0];
assert.equal(meta.record_type,'metadata');
assert.equal(meta.reported_source_lines,1991,'Keep the original source-line count');
assert.equal(meta.nonempty_source_units,1059,'Keep every non-empty source unit');
assert.equal(rows.length,1060,'Metadata plus all 1,059 source units must remain');
const units=rows.slice(1);
assert.equal(new Set(units.map(x=>x.source_unit_id)).size,units.length,'Every source unit ID must be unique');
assert.equal(new Set(units.map(x=>x.source_line)).size,units.length,'Every non-empty source line must map once');
assert.equal(units[0].source_unit_id,'MS-0001');
assert.equal(units.at(-1).source_unit_id,'MS-1059');
for(const row of units){
 assert.equal(typeof row.source_text,'string',row.source_unit_id+' must preserve exact source text');
 assert.ok(row.source_text.length>0,row.source_unit_id+' must not lose source content');
 assert.ok(typeof row.line_status==='string'&&row.line_status.length>0,row.source_unit_id+' needs an explicit status');
 assert.ok(typeof row.evidence_pointer==='string'&&row.evidence_pointer.length>0,row.source_unit_id+' needs an evidence pointer or explicit cross-cutting mapping');
 assert.ok(typeof row.next_action==='string'&&row.next_action.length>0,row.source_unit_id+' needs a next action / closure condition');
 if(row.unit_type==='ACTIONABLE_OR_REQUIREMENT'||row.unit_type==='BULLET_OR_LIST_ITEM'){
  assert.ok(/PARTIAL|OPEN|BLOCKED|INDEXED|ACTIVE GUARDRAIL/.test(row.line_status),row.source_unit_id+' must not be silently marked complete');
  assert.ok(/tests\/|MASTER_TASK_REGISTER|WORK_CHECKPOINT|data\//.test(row.evidence_pointer),row.source_unit_id+' should point to source/test/ledger evidence');
 }
 assert.doesNotMatch(row.line_status,/\bCOMPLETE\b|\bDONE\b|\bVERIFIED LIVE\b/i,row.source_unit_id+' must not claim completion without end-to-end evidence');
}
assert.equal(meta.mapping_version,'2.0');
assert.ok(meta.mapping_policy.includes('No item is marked fully complete'));
console.log('Attachment traceability checks passed: all 1,059 non-empty source units preserved, uniquely indexed, evidence-mapped and assigned an explicit remaining gate; no unit is marked complete by inference.');
