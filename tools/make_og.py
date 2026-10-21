# -*- coding: utf-8 -*-
"""
Vygeneruje OG (nahladovy) obrazok v novom svetlom style portfolia.
Vystup: assets/img/og.webp  (1200 x 630)

Spustaj:  python tools/make_og.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

BASE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(BASE)
OUT = os.path.join(REPO, "assets", "img")
FONTS = os.path.join(BASE, "fonts")

PAPER = (243, 238, 227)
INK = (20, 24, 31)
RED = (226, 53, 31)
AMBER = (240, 163, 46)
BLUE = (29, 91, 214)
NAVY = (20, 33, 61)


def f(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


def main():
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)

    # bodkovy raster
    for y in range(0, H, 22):
        for x in range(0, W, 22):
            d.point((x, y), fill=(216, 208, 190))

    # farebne pruhy (mix)
    d.rectangle([0, 0, W, 16], fill=RED)
    d.rectangle([0, H - 16, W // 3, H], fill=AMBER)
    d.rectangle([W // 3, H - 16, 2 * W // 3, H], fill=BLUE)
    d.rectangle([2 * W // 3, H - 16, W, H], fill=NAVY)

    # stvorec SČ
    d.rectangle([70, 70, 158, 158], fill=RED, outline=INK, width=4)
    d.text((114, 116), "SČ", font=f("BigShoulders-Bold.ttf", 62), fill=PAPER, anchor="mm")

    # mono popisok
    d.text((186, 92), "PORTFÓLIO · 2026", font=f("GeistMono-Regular.ttf", 24), fill=(92, 98, 112), anchor="lm")
    d.text((186, 124), "ŠTUDENT GRAFIKY · TVORCA", font=f("GeistMono-Bold.ttf", 22), fill=INK, anchor="lm")

    # velke meno
    d.text((66, 300), "SAMUEL", font=f("BigShoulders-Bold.ttf", 190), fill=INK, anchor="lm")
    d.text((66, 452), "ČIŽMÁR", font=f("BigShoulders-Bold.ttf", 190), fill=RED, anchor="lm")

    # tagy vpravo dole
    d.text((1136, 470), "FOTOGRAFIA · GRAFIKA", font=f("GeistMono-Regular.ttf", 22), fill=(92, 98, 112), anchor="rm")
    d.text((1136, 508), "WEB · KÓD", font=f("GeistMono-Regular.ttf", 22), fill=(92, 98, 112), anchor="rm")

    os.makedirs(OUT, exist_ok=True)
    out = os.path.join(OUT, "og.webp")
    img.save(out, "WEBP", quality=88, method=6)
    print("ulozene:", out, os.path.getsize(out) // 1024, "KB")


if __name__ == "__main__":
    main()
