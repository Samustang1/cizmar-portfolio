# -*- coding: utf-8 -*-
"""
Pripravi obrazky pre stranku "PROJEKTY" (zadanie z Downloads).

- skonvertuje realne obrazky projektov na WebP (assets/img/projekty/)
- vygeneruje profilovy avatar (assets/img/profil.webp)
- vygeneruje neutralny placeholder pre chybajuci Projekt 4 (projekt-4.webp)
- vygeneruje OG obrazok (assets/img/og.webp)

Spustaj:  python tools/page_assets.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from PIL import Image, ImageDraw  # noqa: E402

import generate_art as G  # noqa: E402

SRC = r"C:\Users\cizsa\AppData\Local\Temp\opencode\zadanie\semantika\spg podstranka\img"
IMG = G.OUT
PROJ = os.path.join(IMG, "projekty")
os.makedirs(PROJ, exist_ok=True)

REAL = [
    ("PROJEKT1.png", "projekt-1.webp"),
    ("Projekt2.png", "projekt-2.webp"),
    ("Projekt3.png", "projekt-3.webp"),
    ("Projekt5.jpg", "projekt-5.webp"),
]


def convert_real():
    for src, dst in REAL:
        p = os.path.join(SRC, src)
        im = Image.open(p)
        if im.mode in ("RGBA", "LA", "P"):
            im = im.convert("RGBA")
            bg = Image.new("RGB", im.size, (6, 9, 16))
            bg.paste(im, mask=im.split()[-1])
            im = bg
        else:
            im = im.convert("RGB")
        im.save(os.path.join(PROJ, dst), "WEBP", quality=90, method=6)
        print("  %-14s -> %-16s %s" % (src, dst, im.size))


def glyph_ok(font, ch):
    try:
        return font.getmask(ch).size != font.getmask("\uE000").size
    except Exception:
        return True


def make_profile(size=760):
    S = G.SS
    W = H = size * S
    img = G.base_canvas(W, H)
    img = G.glow(img, W * 0.50, H * 0.34, int(W * 0.72), G.BLUE, 0.50, gamma=2.0)
    img = G.glow(img, W * 0.50, H * 0.90, int(W * 0.66), G.VIOLET, 0.42, gamma=2.1)
    img = G.grid(img, 48 * S, value=20)
    lay = G.layer((W, H))
    G.rings(lay, W * 0.50, H * 0.50, G.BLUE, W * 0.47, v_max=120)
    img = G.blur_add(img, lay, 0.6)
    f = G.fnt("BigShoulders-Bold.ttf", int(W * 0.40))
    ch = "SČ" if glyph_ok(f, "Č") else "SC"
    print("  profil monogram:", repr(ch))
    lay = G.layer((W, H))
    d = ImageDraw.Draw(lay)
    d.text((W * 0.50, H * 0.53), ch, font=f, fill=G.sc(G.CYAN, 235), anchor="mm")
    img = G.add(img, lay)
    img = img.resize((size, size), Image.LANCZOS)
    img = G.bloom(img, 20, 0.6, 80)
    img = G.grain(img, 16, 0.45)
    img = G.vignette(img, 0.5)
    return G.tone(img, 3, 1.03)


def make_project4(w=1600, h=900):
    S = G.SS
    W, H = w * S, h * S
    img = G.base_canvas(W, H)
    img = G.glow(img, W * 0.24, H * 0.18, int(W * 0.72), G.VIOLET, 0.40, gamma=2.1)
    img = G.glow(img, W * 0.80, H * 0.86, int(W * 0.72), G.BLUE, 0.40, gamma=2.1)
    img = G.grid(img, 52 * S, value=18)

    lay = G.layer((W, H))
    d = ImageDraw.Draw(lay)
    x0, y0, x1, y1 = W * 0.13, H * 0.18, W * 0.87, H * 0.82
    d.rounded_rectangle([x0, y0, x1, y1], radius=18 * S, outline=G.sc(G.CYAN, 190), width=2 * S)
    d.line([(x0, y0 + 58 * S), (x1, y0 + 58 * S)], fill=G.sc(G.CYAN, 150), width=2 * S)
    for i, c in enumerate([(255, 95, 95), (255, 190, 60), (80, 220, 120)]):
        cx = x0 + 26 * S + i * 28 * S
        d.ellipse([cx, y0 + 22 * S, cx + 13 * S, y0 + 35 * S], fill=G.sc(c, 220))
    d.rounded_rectangle([x0 + 150 * S, y0 + 20 * S, x0 + 560 * S, y0 + 40 * S],
                        radius=10 * S, fill=G.sc(G.WHITE, 26))
    # abstraktny obsah
    d.rounded_rectangle([x0 + 40 * S, y0 + 92 * S, x0 + 240 * S, y1 - 40 * S],
                        radius=12 * S, fill=G.sc(G.BLUE, 40))
    for i in range(4):
        yy = y0 + 92 * S + i * 40 * S
        d.rounded_rectangle([x0 + 270 * S, yy, x1 - 40 * S, yy + 22 * S],
                            radius=8 * S, fill=G.sc(G.CYAN, 46 - i * 6))
    d.rounded_rectangle([x0 + 270 * S, y0 + 300 * S, x1 - 40 * S, y1 - 40 * S],
                        radius=12 * S, fill=G.sc(G.VIOLET, 30))
    img = G.blur_add(img, lay, 0.5)

    img = img.resize((w, h), Image.LANCZOS)
    img = G.bloom(img, 18, 0.55, 80)
    img = G.grain(img, 16, 0.40)
    img = G.vignette(img, 0.5)
    return G.tone(img, 3, 1.03)


def make_og(w=1200, h=630):
    S = G.SS
    W, H = w * S, h * S
    img = G.base_canvas(W, H)
    img = G.glow(img, W * 0.80, H * 0.18, int(W * 0.72), G.BLUE, 0.45, gamma=2.1)
    img = G.glow(img, W * 0.18, H * 0.84, int(W * 0.72), G.VIOLET, 0.40, gamma=2.1)
    img = G.grid(img, 48 * S, value=18)
    lay = G.layer((W, H))
    d = ImageDraw.Draw(lay)
    d.text((W * 0.08, H * 0.30), "SAMUEL ČIŽMÁR", font=G.fnt("BigShoulders-Bold.ttf", 58 * S),
           fill=G.sc(G.WHITE, 235), anchor="lm")
    d.text((W * 0.08, H * 0.55), "PROJEKTY", font=G.fnt("BigShoulders-Bold.ttf", 128 * S),
           fill=G.sc(G.CYAN, 240), anchor="lm")
    d.text((W * 0.08, H * 0.80), "PORTFÓLIO · 2026", font=G.fnt("GeistMono-Regular.ttf", 20 * S),
           fill=G.sc(G.WHITE, 150), anchor="lm")
    img = G.add(img, lay)
    img = img.resize((w, h), Image.LANCZOS)
    img = G.bloom(img, 16, 0.5, 85)
    img = G.grain(img, 14, 0.35)
    img = G.vignette(img, 0.5)
    return G.tone(img, 3, 1.04)


def main():
    print("konvertujem realne obrazky ...")
    convert_real()
    print("profil ...")
    make_profile().save(os.path.join(IMG, "profil.webp"), "WEBP", quality=88, method=6)
    print("projekt-4 (placeholder) ...")
    make_project4().save(os.path.join(PROJ, "projekt-4.webp"), "WEBP", quality=86, method=6)
    print("og ...")
    make_og().save(os.path.join(IMG, "og.webp"), "WEBP", quality=86, method=6)
    print("hotovo ->", IMG)


if __name__ == "__main__":
    main()
