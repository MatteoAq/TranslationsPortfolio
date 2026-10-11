#!/usr/bin/env python3
"""One-off verified image import from the author's own CurseForge gallery."""
import io,json,re,requests
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
out=root/"assets/verified-waccyys-fantasia.webp"
url="https://media.forgecdn.net/attachments/1546/240/tof-png.png"
gallery="https://www.curseforge.com/minecraft/modpacks/waccyys-fantasia/gallery"
resp=requests.get(url,timeout=35,headers={"User-Agent":"Mozilla/5.0","Accept":"image/png,image/jpeg,image/webp,image/*"})
resp.raise_for_status()
if not resp.headers.get("content-type","").lower().startswith("image/"): raise SystemExit("Invalid MIME")
im=Image.open(io.BytesIO(resp.content))
im.load()
if im.width<700 or im.height<380 or im.width/im.height<1.25: raise SystemExit("Invalid photo dimensions: "+str(im.size))
im=im.convert("RGB")
im.thumbnail((1440,900),Image.Resampling.LANCZOS)
im.save(out,"WEBP",quality=91,method=6)
print("Verified official Fantasia screenshot",im.size,out.stat().st_size)
replacement="./assets/"+out.name
for filename in ("index.html","app.js"):
 p=root/filename
 s=p.read_text("utf-8")
 token="const coverMap={"
 if s.count(token)!=1:raise SystemExit("Expected one coverMap in "+filename)
 s=s.replace(token,token+json.dumps("waccyy's Fantasia")+':{"src":'+json.dumps(replacement)+'},',1)
 if filename=="index.html":
  static,sep,rest=s.partition("<script id=")
  if not sep:raise SystemExit("Inline script missing")
  cards=list(re.finditer(r'<article class="project-card"[\s\S]*?</article>',static))
  if len(cards)!=15:raise SystemExit(f"Wrong static card count {len(cards)}")
  found=False
  for m in reversed(cards):
   card=m.group()
   if 'class="card-title">waccyy' not in card:continue
   if 'class="cover-photo"' in card: raise SystemExit("Fantasia cover already present")
   image='<img class="cover-photo" src="'+replacement+'" alt="waccyy&#39;s Fantasia" loading="lazy">'
   card=card.replace('<span class="cover-label">',image+'<span class="cover-label">',1)
   static=static[:m.start()]+card+static[m.end():]
   found=True
  if not found:raise SystemExit("Fantasia static card absent")
  s=static+sep+rest
 p.write_text(s,"utf-8")
auditfile=root/"assets/cover-audit.json"
audit=json.loads(auditfile.read_text("utf-8"))
audit["waccyy's Fantasia"]={"status":"official gallery, visually reviewed","source_page":gallery,"original_image":url,"local_file":out.name}
audit["Opolis Inc"]={"status":"official gallery confirmed","source_page":"https://www.curseforge.com/minecraft/modpacks/opolis-inc/gallery","original_image":"https://media.forgecdn.net/attachments/954/66/opolis_inc_1.png","local_file":"cover-opolis-inc.webp"}
auditfile.write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n","utf-8")
print("Validated covers:",len(audit),"entries")
