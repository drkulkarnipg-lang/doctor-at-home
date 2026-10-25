"""Refresh a source-labelled RxNorm formulation snapshot. No clinical doses inferred."""
from pathlib import Path
import urllib.request, json, hashlib, datetime
root = Path(__file__).resolve().parents[1]
url = 'https://rxnav.nlm.nih.gov/REST/Prescribe/allconcepts.json?tty=SCD'
with urllib.request.urlopen(url, timeout=30) as response:
    raw = response.read()
records = json.loads(raw)['minConceptGroup']['minConcept']
entries, seen = [], set()
for record in records:
    assert record['tty'] == 'SCD' and record['rxcui'].isdigit() and record['name'].strip()
    if record['rxcui'] not in seen:
        seen.add(record['rxcui'])
        entries.append({'rxcui': record['rxcui'], 'name': record['name']})
assert len(entries) >= 700
entries.sort(key=lambda row: row['name'].lower())
with urllib.request.urlopen('https://rxnav.nlm.nih.gov/REST/version.json', timeout=20) as response:
    version = json.load(response)['version']
payload = dict(schemaVersion=1, source='NLM Prescribable RxNorm API', sourceUrl=url,
               sourceVersion=version, retrievedOn=datetime.date.today().isoformat(), termType='SCD',
               description='Clinical drug formulations, including strength and dose form. Multiple formulations may represent the same ingredient. Not an Indian-brand catalogue; no patient dose is supplied.',
               count=len(entries), sourceResponseSha256=hashlib.sha256(raw).hexdigest(), entries=entries)
target = root / 'assets/drugs/rxnorm-scd.json'
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':'))+'\n')
print(f'{len(entries)} clinical formulations saved to {target.relative_to(root)}')
