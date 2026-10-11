#!/usr/bin/env python3
"""Download only the authentic public Minecraft skin for the owner's own username."""
import base64, json, io
from pathlib import Path
import requests
from PIL import Image
USER = "Sheiny__"
s = requests.Session()
s.headers.update({"User-Agent":"Sheiny-portfolio/1.0", "Accept":"application/json"})
uuid = None
for url in (f"https://api.minecraftservices.com/minecraft/profile/lookup/name/{USER}",
            f"https://api.mojang.com/users/profiles/minecraft/{USER}"):
    try:
        r = s.get(url,timeout=25)
        if r.ok:
            j=r.json()
            uuid=j.get("id")
            if uuid: break
        print("Account lookup:",r.status_code,url)
    except requests.RequestException as e:
        print("Account lookup failed:",e)
if not uuid: raise SystemExit("Mojang profile lookup failed: no skin asset was added.")
p=s.get(f"https://sessionserver.mojang.com/session/minecraft/profile/{uuid}",timeout=25)
p.raise_for_status()
props=p.json().get("properties",[])
skin_props=[x for x in props if x.get("name")=="textures"]
if not skin_props: raise SystemExit("Mojang textures missing")
payload=json.loads(base64.b64decode(skin_props[0]["value"]))
skin=payload.get("textures",{}).get("SKIN",{})
skin_url=skin.get("url","")
from urllib.parse import urlsplit
parsed=urlsplit(skin_url)
if parsed.hostname != "textures.minecraft.net" or parsed.scheme not in ("http", "https") or not parsed.path.startswith("/texture/"):
    raise SystemExit("Refusing unexpected skin URL: "+skin_url)
# Mojang textures metadata sometimes uses an HTTP URL; force HTTPS for transport.
skin_url="https://textures.minecraft.net"+parsed.path
raw=s.get(skin_url,timeout=30)
raw.raise_for_status()
im=Image.open(io.BytesIO(raw.content))
im.load()
if im.size not in ((64,64),(64,32)):
    raise SystemExit("Unexpected skin dimensions: "+str(im.size))
target=Path("assets/sheiny-official-skin.png")
target.parent.mkdir(exist_ok=True)
im.save(target)
print(f"Verified official skin: {USER} UUID={uuid} size={im.size} URL={skin_url}")
print(f"Saved: {target}")
