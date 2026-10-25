"""Build a traceable name-coverage audit; never infer dosing or local availability."""
import concurrent.futures, hashlib, json, re, urllib.parse, urllib.request
from pathlib import Path
from html import unescape

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'data/requested-cardiovascular-2026-10-25.txt'
CORRECTIONS = {
 'apricitentan':'aprocitentan','iloprost inhalation':'iloprost','trifrusal':'triflusal','acebutalol':'acebutolol','metoproll':'metoprolol',
 'bicalirufin':'bivalirudin','rivarixaban':'rivaroxaban','semaglutude':'semaglutide',
 'isosapent ethyl':'icosapent ethyl','rosuvastation':'rosuvastatin','vaksartan':'valsartan',
 'levalmlodipine':'levamlodipine','colestiramine':'cholestyramine','pemafibrste':'pemafibrate',
 'provastatin':'pravastatin','trandilapril':'trandolapril','metilfigoxin':'metildigoxin',
 'bendroflumeyhiazide':'bendroflumethiazide','chlorthalifone':'chlorthalidone',
 'metilazone':'metolazone','secubitril':'sacubitril','fonerenone':'finerenone',
 'udedecarenonr':'ubidecarenone','gosinopril':'fosinopril','zopenopril':'zofenopril',
 'guanfacone':'guanfacine','captioril':'captopril','enalaoril':'enalapril',
 'ramiprul':'ramipril','smlodipine':'amlodipine','amloodipine':'amlodipine',
 'chlorthalidobe':'chlorthalidone','nebivolpl':'nebivolol','amilorude':'amiloride',
 'edara one':'edaravone','sotatercept- srk':'sotatercept-csrk','bose tan':'bosentan',
 'epoorostenol':'epoprostenol','l carnitine':'levocarnitine','nicotinic acid':'niacin',
 'choline fenofibrate':'fenofibric acid','glyceryl trinitrate':'nitroglycerin',
}
AMBIGUOUS = {'oravastatin','bitoxolol','orazisin','vo-dergocrine','hydrochlorthalidone'}
ALIASES = {'nitroglycerin':['glyceryl trinitrate'], 'levocarnitine':['l carnitine','l-carnitine'],
 'niacin':['nicotinic acid'], 'cholestyramine':['colestiramine'],
 'fenofibric acid':['choline fenofibrate','choline fenofibrate salt']}

def canonical(raw):
 s=raw.lower().strip(' .');s=re.sub(r'^(tab|inj)\s+','',s)
 s=s.replace('argatroban inj-in heparin induced thrombocytopenia','argatroban')
 s=re.sub(r'\s+combination$','',s).replace('plus',' plus ')
 s=' '.join(s.split())
 for old,new in sorted(CORRECTIONS.items(), key=lambda x:-len(x[0])):
  s=re.sub(r'(?<![a-z])'+re.escape(old)+r'(?![a-z])',new,s)
 return s

def fetch_who(name):
 url='https://atcddd.fhi.no/atc_ddd_index/?'+urllib.parse.urlencode({'name':name,'showdescription':'no'})
 try:
  with urllib.request.urlopen(url,timeout=25) as r: html=r.read().decode(r.headers.get_content_charset() or 'latin-1')
  pairs=re.findall(r'<a[^>]+href=["\'][^"\']*code=([A-Z]\d{2}[A-Z]{2}\d{2})[^"\']*["\'][^>]*>(.*?)</a>',html,re.I|re.S)
  found=[]
  for code,label in pairs:
   label=unescape(re.sub('<[^>]*>','',label)).strip().lower()
   if label==name.lower(): found.append({'code':code.upper(),'name':label,'url':'https://atcddd.fhi.no/atc_ddd_index/?code='+code.upper()})
  return name,{'query':url,'matches':found,'retrievedOn':'2026-10-25','responseSHA256':hashlib.sha256(html.encode()).hexdigest()}
 except Exception as e:return name,{'query':url,'matches':[],'error':str(e)}

def main():
 raw=RAW.read_text();tokens=[x.strip() for x in re.split(r',|\n',raw) if x.strip()]
 # Preserve both source fragments while explicitly joining the split triple combination.
 requests=[]
 for i,t in enumerate(tokens):
  c=canonical(t)
  if c.startswith('plus '):c=canonical(tokens[i-1]+' '+t)
  requests.append({'id':f'CV-{i+1:03}','requested':t,'canonical':c})
 snapshot=json.loads((ROOT/'assets/drugs/rxnorm-scd.json').read_text())
 rows={}
 for r in requests:
  name=r['canonical']
  if name in rows:continue
  parts=name.split(' plus ')
  matches=[x for x in snapshot['entries'] if all(re.search(r'(?<![a-z])'+re.escape(p)+r'(?![a-z])',x['name'].lower()) for p in parts)]
  # Formulation references may contain extra ingredients; only classify coverage here.
  rows[name]={'generic':name,'aliases':ALIASES.get(name,[]),'rxnormMatches':len(matches),
    'rxnormExamples':matches[:3], 'status':'needs-source','sources':[]}
  for req in requests:
   if req['canonical']==name:
    alias=re.sub(r'^(tab|inj)\s+','',req['requested'].lower().strip(' .'))
    if alias!=name and alias not in rows[name]['aliases']:rows[name]['aliases'].append(alias)
  if any(re.search(r'\b'+re.escape(a)+r'\b',name) for a in AMBIGUOUS):
   rows[name]['status']='needs-name-review';rows[name]['note']='Original name is ambiguous. Confirm the exact generic name; no substitute has been selected.'
  elif len(parts)>1:
   exact=[x for x in matches if len(re.findall(r' / ',x['name']))==len(parts)-1]
   if exact:
    rows[name]['status']='composition-reference';rows[name]['sources']=[{'name':'NLM RxNorm ingredient combination reference','url':'https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm='+exact[0]['rxcui']}]
    rows[name]['note']='Ingredient identity reference. Select the exact strength, form and locally authorised product before prescribing.'
    continue
   rows[name]['status']='combination-review';rows[name]['note']='Requested ingredient combination. Exact fixed-dose product, ratio, strength and local availability are not verified.'
  elif matches:
   rows[name]['status']='identity-reference';rows[name]['sources']=[{'name':'NLM RxNorm formulation reference','url':'https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm='+matches[0]['rxcui']}]
 cache=ROOT/'data/atc-request-name-checks.json'
 sources=json.loads(cache.read_text()) if cache.exists() else {}
 missing=[n for n,r in rows.items() if r['status']=='needs-source' and (n not in sources or sources[n].get('error'))]
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
  for n,result in pool.map(fetch_who,missing):sources[n]=result;print(n, len(result.get('matches',[])),flush=True)
 cache.write_text(json.dumps(sources,indent=2,ensure_ascii=False)+'\n')
 for n,r in rows.items():
  if r['status']=='needs-source' and sources.get(n,{}).get('matches'):
   r['status']='identity-reference';r['sources']=[{'name':'WHO Collaborating Centre ATC index','url':sources[n]['matches'][0]['url']}]
 # Verify exact named combinations from retrieved WHO group tables, not broad diuretic classes.
 groups=json.loads((ROOT/'data/atc-combination-source-checks.json').read_text())
 for values in groups.values():
  for item in values:
   parts=sorted(x.strip() for x in re.split(r',| and ',item['name'].lower()) if x.strip())
   for name,row in rows.items():
    if row['status']=='combination-review' and sorted(name.split(' plus '))==parts:
     row['status']='composition-reference';row['sources']=[{'name':'WHO Collaborating Centre combination identity','url':'https://atcddd.fhi.no/atc_ddd_index/?code='+item['code']}]
     row['note']='Named ingredient-combination reference only. Verify exact product, strength, ratio and local authorisation.'
 overrides=json.loads((ROOT/'data/requested-cardiovascular-overrides.json').read_text())
 for name,row in rows.items():
  override=dict(overrides.get(name,{}));extra=override.pop('extraSource',None);aliases=override.pop('aliases',[])
  row.update(override);row['aliases']=list(dict.fromkeys(row['aliases']+aliases))
  if extra:row['sources'].append(extra)
  if row['status']=='combination-review':
   for part in name.split(' plus '):
    for source in rows.get(part,{}).get('sources',[])[:1]:
     row['sources'].append(dict(source,name='Constituent only: '+part+' — '+source['name']))
  row['sources']=list({s['url']:s for s in row['sources']}.values())
  row['selectable']=row['status'] in ['identity-reference','composition-reference'] and bool(row['sources'])
  if row['status']=='needs-source':row['note']='Source verification incomplete. This request remains visible; prescription selection disabled.'
 result={'schemaVersion':1,'verifiedOn':'2026-10-25','sourceInput':str(RAW.relative_to(ROOT)),
   'inputSHA256':hashlib.sha256(raw.encode()).hexdigest(),'requests':requests,'rows':list(rows.values())}
 (ROOT/'data/requested-cardiovascular-audit.json').write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n')
 target=ROOT/'assets/drugs/requested-cardiovascular.json'
 target.write_text(json.dumps(result,separators=(',',':'),ensure_ascii=False)+'\n')
 print('requests',len(requests),'unique',len(rows))
 print('UNRESOLVED',[(n,r['status']) for n,r in rows.items() if r['status'] not in ['identity-reference']])

if __name__=='__main__':main()
