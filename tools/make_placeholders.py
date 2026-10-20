# -*- coding: utf-8 -*-
"""
Vygeneruje neutralne placeholdery:
  assets/img/foto.webp          (900x1200)  - miesto na tvoju fotku v hero
  assets/img/prace/prace-1..6.webp (1200x900) - miesto na obrazky projektov

Tieto subory si nahradis vlastnymi (rovnake meno a idealne rovnaky pomer stran).
Spustaj:  python tools/make_placeholders.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

BASE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(BASE)
IMG = os.path.join(REPO, "assets", "img")
PRACE = os.path.join(IMG, "prace")
FONTS = os.path.join(BASE, "fonts")

PAPER = (243, 238, 227)
INK = (20, 24, 31)
NAVY = (20, 33, 61)
RED = (226, 53, 31)
BLUE = (29, 91, 214)
AMBER = (240, 163, 46)
GREEN = (23, 166, 115)
VIOLET = (108, 75, 214)
TONES = [RED, BLUE, AMBER, GREEN, VIOLET, RED]


def f(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


def dots(d, w, h, step=20, color=(216, 208, 190)):
    for y in range(0, h, step):
        for x in range(0, w, step):
            d.point((x, y), fill=color)


def make_foto():
    W, H = 900, 1200
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)
    dots(d, W, H)

    d.rounded_rectangle([46, 46, W - 46, H - 46], radius=10, fill=NAVY, outline=INK, width=5)
    # farebne pruhy hore
    d.rectangle([46, 46, W - 46, 84], fill=RED)
    d.rectangle([46, H - 84, W - 46, H - 46], fill=BLUE)

    d.text((W / 2, H / 2 - 60), "TVOJA", font=f("BigShoulders-Bold.ttf", 150), fill=PAPER, anchor="mm")
    d.text((W / 2, H / 2 + 70), "FOTKA", font=f("BigShoulders-Bold.ttf", 150), fill=AMBER, anchor="mm")
    d.text((W / 2, H / 2 + 190), "NAHRAĎ  assets/img/foto.webp", font=f("GeistMono-Regular.ttf", 22),
           fill=(200, 210, 230), anchor="mm")
    d.text((W / 2, H / 2 + 230), "odporúčaný pomer  3 : 4", font=f("GeistMono-Regular.ttf", 20),
           fill=(150, 165, 195), anchor="mm")

    os.makedirs(IMG, exist_ok=True)
    out = os.path.join(IMG, "foto.webp")
    img.save(out, "WEBP", quality=88, method=6)
    print("ulozene:", out, os.path.getsize(out) // 1024, "KB")


def make_prace():
    W, H = 1200, 900
    os.makedirs(PRACE, exist_ok=True)
    for i in range(1, 7):
        tone = TONES[(i - 1) % len(TONES)]
        img = Image.new("RGB", (W, H), PAPER)
        d = ImageDraw.Draw(img)
        dots(d, W, H)

        d.rounded_rectangle([40, 40, W - 40, H - 40], radius=10, fill=None, outline=INK, width=5)
        d.rectangle([40, 40, W - 40, 84], fill=tone)

        d.text((W / 2, H / 2 - 40), "%02d" % i, font=f("BigShoulders-Bold.ttf", 300), fill=tone, anchor="mm")
        d.text((W / 2, H / 2 + 150), "SEM PRIDAJ FOTKU PROJEKTU", font=f("GeistMono-Regular.ttf", 26),
               fill=(92, 98, 112), anchor="mm")
        d.text((W / 2, H / 2 + 190), "assets/img/prace/prace-%d.webp" % i, font=f("GeistMono-Regular.ttf", 20),
               fill=(150, 155, 168), anchor="mm")

        out = os.path.join(PRACE, "prace-%d.webp" % i)
        img.save(out, "WEBP", quality=86, method=6)
        print("ulozene:", out, os.path.getsize(out) // 1024, "KB")


if __name__ == "__main__":
    make_foto()
    make_prace()
