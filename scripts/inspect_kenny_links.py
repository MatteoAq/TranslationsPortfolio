import requests,re,json
from urllib.parse import urljoin
from bs4 import BeautifulSoup
b="https://kennyminecraft.ru"
s=requests.Session();s.headers.update({"User-Agent":"Mozilla/5.0"})
for p in ["/","/robots.txt","/sitemap.xml","/catalog","/catalog/","/translations","/translation","/all-translations","/all_of_aeronautics/","/translations/biohazard-project-genesis-the-ultimate-apocalypse"]:
 try:
  r=s.get(b+p,timeout=22)
  print("PAGE",p,r.status_code,"LENGTH",len(r.content),"FINAL",r.url)
  if r.status_code!=200:continue
  if p=="/robots.txt" or "sitemap" in p:print("BODY",r.text[:2500]);continue
  so=BeautifulSoup(r.text,"html.parser")
  print("TITLE",so.title.text.strip() if so.title else "none")
  print("LINKS",json.dumps([{"href":urljoin(r.url,x.get("href","")),"txt":x.get_text(" ",strip=True)[:75]} for x in so.select("a[href]")][:140],ensure_ascii=False))
  print("SCRIPTS",json.dumps([urljoin(r.url,x.get("src")) for x in so.select("script[src]")][:60]))
  print("IMAGES",json.dumps([urljoin(r.url,x.get("src")) for x in so.select("img[src]")][:18]))
  if p=="/":print("RAW-MATCHES",json.dumps(re.findall(r'[^"]*translations[^"]*',r.text,re.I)[:80],ensure_ascii=False))
 except Exception as e:print("ERROR",p,repr(e))
