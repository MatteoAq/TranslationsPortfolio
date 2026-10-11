#!/usr/bin/env python3
"""Repair portfolio covers only from each pack's own CurseForge gallery.

An unrelated theme-matching screenshot is never sufficient.
If an official download fails, keep the previous confirmed image (except
Create: Mekanized, whose image was not from an attributable official gallery).
"""
import io,re,json
from pathlib import Path
from PIL import Image,UnidentifiedImageError
import requests

root=Path(__file__).resolve().parents[1]
assets=root/'assets';assets.mkdir(exist_ok=True)
# Each candidate URL has been individually opened from its official modpack gallery,
# not selected by keywords or image similarity.
choices={
 'Dread Reborn':('https://media.forgecdn.net/attachments/878/676/saved_2024-04-18_22.jpg','https://www.curseforge.com/minecraft/modpacks/dread-arrenek/gallery','verified-dread-reborn.webp'),
 'Beyond Depth':('https://media.forgecdn.net/attachments/1225/924/skyarena-png.png','https://www.curseforge.com/minecraft/modpacks/beyond-depth/gallery','verified-beyond-depth.webp'),
 'Whispers in the Void':('https://media.forgecdn.net/attachments/949/348/halloween-is-coming-2.jpg','https://www.curseforge.com/minecraft/modpacks/whispers-in-the-void/gallery','verified-whispers.webp'),
 'Society: Sunlit Valley':('https://media.forgecdn.net/attachments/1345/664/2025-10-02_15.png','https://www.curseforge.com/minecraft/modpacks/society-sunlit-valley/gallery','verified-society.webp'),
 'Life in the village 4':('https://media.forgecdn.net/attachments/1113/182/dd34dndddd12d12n_2025-03-02_141428638-png.png','https://www.curseforge.com/minecraft/modpacks/life-in-the-village-4/gallery','verified-life-village.webp')
}
# Verified by seeing the file in the modpack's own official sources/repository.
known={
 'Lucky World Invasion':('cover-lucky-world-invasion.webp','Promotional image of this pack at minecraft.fr'),
 'Project Genesis':('cover-project-genesis.webp','Biohazard Project Genesis author website'),
 'The Winter Rescue':('winter-author.jpg','TeamMoeg official modpack repository'),
 'Over Stars':('cover-over-stars.webp','Over Stars description, official CurseForge page'),
 'CABIN: Above and Beyond newer':('cabin-logo.png','ThePansmith CABIN official repository'),
 'Create: Stranded at Sea':('cover-create-stranded-at-sea.webp','Create Stranded at Sea official CurseForge gallery'),
 'Opolis Inc':('cover-opolis-inc.webp','CurseForge media attachment; source gallery not reverified')
}
source_record={}
session=requests.Session();session.headers.update({'User-Agent':'Mozilla/5.0 (portfolio cover attribution check)','Accept':'image/png,image/jpeg,image/webp,image/*'})
replaced={}
for name,(src,page,file) in choices.items():
 try:
  resp=session.get(src,timeout=30)
  resp.raise_for_status()
  if not resp.headers.get('content-type','').lower().startswith('image/'):raise ValueError('Not an image')
  if len(resp.content)>12000000:raise ValueError('Too large')
  im=Image.open(io.BytesIO(resp.content))
  im.load()
  w,h=im.size
  if w<700 or h<380:raise ValueError(f'Insufficient resolution {w}x{h}')
  if w/h<1.25 or w/h>3.5:raise ValueError(f'Unsuitable composition {w}x{h}')
  im=im.convert('RGB')
  im.thumbnail((1440,900),Image.Resampling.LANCZOS)
  path=assets/file
  im.save(path,'WEBP',quality=91,method=6)
  replaced[name]='./assets/'+file
  source_record[name]={'status':'official gallery, visually reviewed','source_page':page,'original_image':src,'local_file':file,'original_resolution':f'{w}x{h}'}
  print(f'VERIFIED {name} {w}x{h} => {file}, {path.stat().st_size} bytes')
 except (requests.RequestException,OSError,UnidentifiedImageError,ValueError) as e:
  print(f'NOT REPLACED {name}: {type(e).__name__} {e}')

# Independently validate that all previous published local files exist.
for name,(file,note) in known.items():
 if not (assets/file).is_file(): raise SystemExit(f'Required asset missing for {name}: {file}')
 source_record[name]={'status':'attributed but unchanged' if name!='Opolis Inc' else 'needs origin reconfirmation', 'local_file':file,'source_note':note}
for name in choices:
 if name not in source_record:
  source_record[name]={'status':'existing cover retained; official replacement download failed','attempted_page':choices[name][1]}
source_record['Create: Mekanized']={'status':'cover removed – previous source is an unrelated generic Minecraft image','gallery':'https://www.curseforge.com/minecraft/modpacks/create-mekanized/gallery'}
source_record['Solo Leveling: OVERLOAD']={'status':'no image until verified'}
source_record["waccyy's Fantasia"]={'status':'no image until verified'}

# Keep the static HTML and JS-generated cards consistent. Previous verified photos
# and card layout remain intact if an official fetch failed.
current={
 'Dread Reborn':'./assets/cover-dread-reborn.webp',
 'Beyond Depth':'./assets/cover-beyond-depth.webp',
 'Whispers in the Void':'./assets/whispers.webp',
 'Society: Sunlit Valley':'./assets/society-author.png',
 'Life in the village 4':'./assets/life-village-4-logo.png'
}
for filename in ('index.html','app.js'):
 path=root/filename
 text=path.read_text(encoding='utf-8')
 for name,new_file in replaced.items():
  old_file=current[name]
  if old_file not in text:raise SystemExit(f'{filename}: old path for {name} missing')
  text=text.replace(old_file,new_file)
 # Remove unrelated visual from dynamic cover map.
 text,n=re.subn(r',"Create: Mekanized":\{"src":"\./assets/cover-create-mekanized\.webp"\}', '',text)
 if n!=1:raise SystemExit(f'{filename}: expected one dynamic Create: Mekanized mapping, got {n}')
 if filename=='index.html':
  # static cards exist independently of JavaScript
  pattern=r'(<article class="project-card"[^>]*>[\s\S]*?<h3 class="card-title">Create: Mekanized</h3>[\s\S]*?</article>)'
  def drop_image(m):
   value=m.group(1)
   if 'cover-create-mekanized.webp' not in value:raise ValueError('Missing wrong Create: Mekanized image')
   return re.sub(r'<img class="cover-photo"[^>]*cover-create-mekanized\.webp[^>]*>', '',value,count=1)
  text,k=re.subn(pattern,drop_image,text,count=1)
  if k!=1:raise SystemExit('Could not find Create Mekanized static card')
  # render the card names/titles and downloaded images without external hotlinks
  text=re.sub(r'\./styles\.css\?v=\d+','./styles.css?v=18',text,count=1)
 if 'cover-create-mekanized.webp' in text:raise SystemExit('Untrusted Create: Mekanized image remains')
 path.write_text(text,encoding='utf-8')
 # verified count invariants
 if filename=='index.html':
  before_script=text.split('<script id=')[0]
  card_total=len(re.findall(r'<article class="project-card"',before_script))
  if card_total!=15:raise SystemExit(f'Wrong static card count: {card_total}')
print('OFFICIAL replacements completed',len(replaced),'of',len(choices))
(assets/'cover-audit.json').write_text(json.dumps(source_record,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
