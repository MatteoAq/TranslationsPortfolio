#!/usr/bin/env python3
"""Fetch known pack covers once, validate images, and vendor them locally."""
from __future__ import annotations
import io
from pathlib import Path
import requests
from PIL import Image, UnidentifiedImageError

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
ASSETS.mkdir(parents=True, exist_ok=True)
COVERS = {
    "beyond-depth": "https://media.forgecdn.net/attachments/1225/936/deeper-darker-gate-png.png",
    "dread-reborn": "https://stickypiston.co/wp-content/uploads/dread-arrenek_twitter.jpg",
    "lucky-world-invasion": "https://minecraft.fr/wp-content/uploads/2024/09/lucky-world-invasion-modpack-minecraft.jpg",
    "project-genesis": "https://biohazard.voidcube.studio/assets/gallery/Image1.png",
    "over-stars": "https://www.bisecthosting.com/images/CF/Over_Stars/BH_Over_Stars_header.webp",
    "create-mekanized": "https://mtxserv.com/uploads/cover/create-mekanized-minecraft-d624f70cff05e10deaa2d49593cbc582.jpg",
    "opolis-inc": "https://media.forgecdn.net/attachments/954/66/opolis_inc_1.png",
    "create-stranded-at-sea": "https://media.forgecdn.net/attachments/1315/126/create-stranded-at-sea-showcase-5-png.png",
}

session = requests.Session()
session.headers.update({"User-Agent": "Mozilla/5.0 (compatible; SheinyPortfolio/1.0; static screenshot backup)"})
saved = {}
for slug, url in COVERS.items():
    try:
        response = session.get(url, timeout=35, headers={"Accept": "image/avif,image/webp,image/png,image/jpeg,image/*"})
        response.raise_for_status()
        if len(response.content) > 12_000_000:
            raise ValueError("image too large")
        if not response.headers.get("Content-Type", "").lower().startswith("image/"):
            raise ValueError(f"unexpected content-type: {response.headers.get('Content-Type')}")
        im = Image.open(io.BytesIO(response.content))
        im.load()
        if im.width < 160 or im.height < 90:
            raise ValueError(f"image too small: {im.size}")
        im = im.convert("RGB")
        im.thumbnail((1200, 800), Image.Resampling.LANCZOS)
        target = ASSETS / f"cover-{slug}.webp"
        im.save(target, "WEBP", quality=83, method=6)
        saved[url] = f"./assets/{target.name}"
        if slug == "create-stranded-at-sea":
            saved["https://media.forgecdn.net/attachments/1076/193/create-stranded-at-sea-showcase-end.png"] = f"./assets/{target.name}"
        print(f"OK {slug}: {im.width}x{im.height}, {target.stat().st_size} bytes")
    except (requests.RequestException, OSError, UnidentifiedImageError, ValueError) as exc:
        print(f"SKIP {slug}: {type(exc).__name__}: {exc}")
for name in ("index.html", "app.js"):
    path = ROOT / name
    content = path.read_text("utf-8")
    for source, relative in saved.items():
        content = content.replace(source, relative)
    path.write_text(content, "utf-8")
print(f"Saved {len(saved)}/{len(COVERS)} verified, local covers.")
