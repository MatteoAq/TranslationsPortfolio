import re,json,requests,xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from urllib.parse import urljoin
base="https://kennyminecraft.ru"
session=requests.Session()
session.headers.update({"User-Agent":"Mozilla/5.0 (Sheiny localization portfolio; link checker)"})
response=session.get(base+"/sitemap.xml",timeout=25);response.raise_for_status()
sitemap=ET.fromstring(response.content)
locs=[el.text for el in sitemap.iter() if el.tag.endswith('loc') and el.text]
translations=[s for s in locs if '/translations/' in s]
print("SITEMAP-COUNT",len(locs),"TRANSLATIONS",len(translations))
for u in translations:
 try:
  r=session.get(u,timeout=16)
  title=BeautifulSoup(r.text,'html.parser').title
  print("TRANSLATION",r.status_code,u,"TITLE",title.get_text(' ',strip=True)[:130] if title else "")
 except Exception as e:print("ERROR",u,repr(e))
print("OTHER-RELATED")
for u in locs:
 if not '/translations/' in u and any(p in u.lower() for p in ['aeronautics','create','rtf','about']):
  print(u)
a=session.get(base+"/all_of_aeronautics/",timeout=25)
soup=BeautifulSoup(a.text,'html.parser')
for img in soup.select('img[src]'):
 src=urljoin(a.url,img['src'])
 if any(w in (src+' '+img.get('alt','')).lower() for w in ['team','crew','skin','render','member','avatar','character','person','pers','staff']):
  print("AERO-PERSON",src,"ALT",img.get('alt'))
print("AERO-IMAGES",json.dumps([{'src':urljoin(a.url,x['src']),'alt':x.get('alt',''),'width':x.get('width'),'height':x.get('height')} for x in soup.select('img[src]')][:40],ensure_ascii=False))
