import requests, re, json, xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from urllib.parse import urljoin
base="https://kennyminecraft.ru"
s=requests.Session()
s.headers.update({"User-Agent":"Mozilla/5.0 (compatible; SheinyPortfolio/1.0)"})
paths=["/translations/","/translations/biohazard-project-genesis-the-ultimate-apocalypse","/wp-sitemap.xml","/sitemap_index.xml","/wp-json/wp/v2/search?search=Over%20Stars&per_page=50","/wp-json/wp/v2/types"]
for p in paths:
    u=base+p
    try:
        resp=s.get(u,timeout=25)
        print("URL",u,"HTTP",resp.status_code,"TYPE",resp.headers.get("content-type"),"BYTES",len(resp.content),"FINAL",resp.url)
        print("HEAD",resp.text[:180].replace("\n"," "))
        if "xml" in resp.headers.get("content-type","") or "sitemap" in p:
            print("XML_MATCHES",json.dumps(re.findall(r'https?://[^< ]+',resp.text)[:60],ensure_ascii=False))
        elif "json" in resp.headers.get("content-type",""):
            print("JSON",resp.text[:6500])
        else:
            bs=BeautifulSoup(resp.text,"html.parser")
            print("TITLE",bs.title.text.strip() if bs.title else "none")
            elems=[]
            for a in bs.select("a[href]"):
                href=urljoin(resp.url,a.get("href",""))
                if "/translations/" in href:
                    elems.append((href,a.get_text(" ",strip=True)[:65]))
            print("TRANSLATIONS",json.dumps(list(dict.fromkeys(elems))[:100],ensure_ascii=False))
    except Exception as e:
        print("ERROR",p,repr(e))
