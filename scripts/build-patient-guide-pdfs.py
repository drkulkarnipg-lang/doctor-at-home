"""Build complete static guide PDFs for both authored languages.
Dev requirements: weasyprint==68.0, fonttools[woff]==4.60.1.
Run from repository root after exporting patient-education-data.js to JSON.
No patient data or network calls are used.
"""
from pathlib import Path
from html import escape as h
import json, hashlib, re
from fontTools.ttLib import TTFont
from weasyprint import HTML
from weasyprint.text.fonts import FontConfiguration
root=Path(__file__).resolve().parents[1]
data=json.loads((root/'tmp/pdfs/education-content.json').read_text())
fonts=root/'tmp/pdfs/fonts';fonts.mkdir(parents=True,exist_ok=True)
for name,source in [('Devanagari','noto-sans-devanagari-devanagari-400-normal.woff2'),('DevanagariBold','noto-sans-devanagari-devanagari-600-normal.woff2'),('Inter','inter-latin-400-normal.woff2')]:
 font=TTFont(root/'assets/fonts'/source);font.flavor=None;font.save(fonts/(name+'.ttf'))
def rich(text):
 result=h(text)
 for phrase in sorted(data['presentation']['important'],key=len,reverse=True):
  if phrase in text:result=result.replace(h(phrase),'<strong>'+h(phrase)+'</strong>')
 return result
css=f'''@font-face{{font-family:GuideDevanagari;src:url("{(fonts/'Devanagari.ttf').as_uri()}")}}@font-face{{font-family:GuideDevanagari;src:url("{(fonts/'DevanagariBold.ttf').as_uri()}");font-weight:700}}@font-face{{font-family:GuideInter;src:url("{(fonts/'Inter.ttf').as_uri()}")}}
@page{{size:A4;margin:18mm 17mm 22mm;@bottom-left{{content:'Dr. Pramod G. Kulkarni | Patient education';font:8pt GuideInter;color:#375443}}@bottom-right{{content:counter(page) ' / ' counter(pages);font:8pt GuideInter;color:#375443}}}}
body{{font:11pt/1.7 Georgia,'DejaVu Serif',serif;color:#20392d}}body:lang(mr) .intro{{font-style:normal}}body:lang(mr){{font-family:GuideDevanagari,'DejaVu Sans',sans-serif;line-height:1.8}}h1{{font-size:24pt;line-height:1.5;color:#1d4934;margin:4mm 0}}strong{{font-weight:700;background:#e7f0db;color:#1a4530}}h2{{text-decoration:underline;text-decoration-color:#c2d5b8;text-underline-offset:3pt;font-size:14pt;line-height:1.6;color:#24523c;margin:6mm 0 3mm;break-after:avoid}}p{{margin:0 0 4mm;orphans:3;widows:3}}.intro{{font-size:13pt;color:#3c5945;font-style:italic;border-left:3pt solid #b4c9ac;padding-left:5mm}}.urgent{{border-left:3pt solid #96392d;padding-left:5mm;background:#fff3ee}}.takeaway{{background:#edf4e9;padding:1mm 5mm 3mm;border-top:2pt solid #9db48f}}a{{color:#275d41;text-decoration:underline;overflow-wrap:anywhere}}.reference{{font:8.5pt/1.6 GuideInter,GuideDevanagari,sans-serif;overflow-wrap:anywhere;margin:1.4mm 0}}.note{{font-size:9pt;border-top:1pt solid #c5d3bf;padding-top:4mm}}.brand{{font:9pt GuideInter;letter-spacing:.2pt;color:#45664c}}.question{{font-weight:700;break-after:avoid}}.source-link{{font:8pt/1.3 GuideInter;overflow-wrap:anywhere;margin:0}}
'''
out=root/'assets/guides';out.mkdir(parents=True,exist_ok=True);manifest={}
for article in data['articles']:
 for lang in ['en','mr']:
  a=article[lang];mr=lang=='mr';refs=list(dict.fromkeys(k for s in a['sections'] for k in s['refs']))+['emergency']
  parts=[f'<html lang="{lang}"><meta charset="utf-8"><style>{css}</style><body>', '<p class="brand">DR. PRAMOD G. KULKARNI · PATIENT EDUCATION</p>',f'<h1>{h(a["title"])}</h1><p class="intro">{h(a["intro"])}</p>']
  for section in a['sections']:
   urgent=section['kind']=='urgent';parts.append(f'<section class="{"urgent" if urgent else ""}"><h2>{h(section["heading"])}</h2><p>{rich(section["text"])}</p>')
   if urgent:parts.append('<p>'+('जीवाला धोका असलेल्या स्थितीत भारतात ११२ वर संपर्क करा. इतर देशांत स्थानिक आपत्कालीन क्रमांक वापरा.' if mr else 'For a life-threatening emergency in India, call 112. Elsewhere use your local emergency number.')+'</p>')
   parts.append('</section>')
  parts.append('<h2>'+('मनातले प्रश्न' if mr else 'Questions you may have')+'</h2>')
  for q,answer in a['faq']:parts.append(f'<p class="question">{h(q)}</p><p>{h(answer)}</p>')
  parts.append('<aside class="takeaway"><h2>'+('लक्षात ठेवण्याची गोष्ट' if mr else 'What to remember')+f'</h2><p>{h(a["takeaway"])}</p></aside>')
  parts.append('<h2>'+('आधार आणि मूळ संदर्भ' if mr else 'Sources and further reading')+'</h2>')
  for k in refs:
   label,url=data['sources'][k];parts.append(f'<p class="reference"><a href="{h(url)}">{h(label)}</a><br>{h(url)}</p>')
  parts.append('<p class="note">'+('ही माहिती समजून घेण्यासाठी आहे. वैयक्तिक उपचारासाठी आपल्या डॉक्टरांची योजना पाळा. औषधे स्वतः बदलू नका. संदर्भ तपासले: २४ ऑक्टोबर २०२६.' if mr else 'Educational information supports understanding and does not replace individual medical care. Follow your clinician’s plan. Do not change medicines on your own. Sources checked: 24 October 2026.')+'</p>')
  parts.append('<p class="source-link">Website: https://home-visiting-icu-doctor.vercel.app/#wikiSection<br>Article: '+h(article['key'])+' | '+lang+'</p></body></html>')
  content=''.join(parts);file=out/f'{article["key"]}-{lang}.pdf'
  document=HTML(string=content,base_url=str(root)).render(font_config=FontConfiguration())
  boxes=[box for page in document.pages for box in page._page_box.descendants() if hasattr(box,'text')]
  norm=lambda text:re.sub(r'\s+','',text)
  laid_out=norm(''.join(box.text for box in boxes))
  for section in a['sections']:
   if norm(section['text']) not in laid_out:raise ValueError('Incomplete laid-out paragraph: '+article['key']+' '+lang+' '+section['heading'])
  for page in document.pages:
   for box in page._page_box.descendants():
    if hasattr(box,'text') and (box.position_x < -1 or box.position_x+box.width > page.width+1 or box.position_y < -1 or box.position_y+box.height > page.height+1):raise ValueError('Text overflow: '+article['key']+' '+lang)
  document.write_pdf(file)
  (root/'tmp/pdfs'/f'{article["key"]}-{lang}.html').write_text(content)
  manifest[file.name]={'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'size':file.stat().st_size,'key':article['key'],'language':lang,'pages':len(document.pages),'source_sha256':hashlib.sha256((root/'patient-education-data.js').read_bytes()).hexdigest()}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(f'Built {len(manifest)} complete PDFs; total {sum(x["size"] for x in manifest.values())} bytes.')
