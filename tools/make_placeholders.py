# -*- coding: utf-8 -*-
"""
Vygeneruje tmavé placeholdery, ktoré sedia s dizajnom stránky:
  assets/img/foto.webp              (900x1200)  - miesto na úvodnú fotku
  assets/img/prace/prace-1..6.webp  (1200x900)  - miesto na fotky projektov

Tieto súbory nahraď vlastnými (rovnaké meno, ideálne rovnaký pomer strán).
Spúšťaj:  python tools/make_placeholders.py
"""
import os
import random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

BASE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(BASE)
IMG = os.path.join(REPO, "assets", "img")
PRACE = os.path.join(IMG, "prace")
FONTS = os.path.join(BASE, "fonts")

GOLD = (215, 179, 106)
INK = (245, 245, 247)
MUTED = (142, 142, 147)


def f(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


def gradient(w, h, top, bottom):
    img = Image.new("RGB", (w, h), bottom)
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(1, h - 1)
        col = tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
        d.line([(0, y), (w, y)], fill=col)
    return img


def glow(img, cx, cy, rx, ry, color, strength=1.0):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=color + (int(70 * strength),))
    layer = layer.filter(ImageFilter.GaussianBlur(max(rx, ry) // 2))
    return Image.alpha_composite(img.convert("RGBA"), layer)


def grain(img, amount=9):
    noise = Image.effect_noise(img.size, amount).convert("L")
    noise_rgb = Image.merge("RGB", (noise, noise, noise))
    base = img.convert("RGB")
    return Image.blend(base, noise_rgb, 0.035).convert("RGBA")


def frame(img, inset, color):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    w, h = img.size
    d.rounded_rectangle(
        [inset, inset, w - inset, h - inset],
        radius=4,
        outline=color + (55,),
        width=1,
    )
    return Image.alpha_composite(img, layer)


def make_foto():
    W, H = 900, 1200
    img = gradient(W, H, (22, 21, 24), (8, 8, 10))
    img = glow(img, int(W * 0.68), int(H * 0.24), 420, 420, (198, 156, 88), 1.0)
    img = glow(img, int(W * 0.18), int(H * 0.78), 320, 320, (80, 86, 110), 0.6)
    img = grain(img, 10)

    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.text((W / 2, H / 2 - 30), "SČ", font=f("Outfit-Bold.ttf", 330),
           fill=(255, 255, 255, 12), anchor="mm")
    d.text((W / 2, H - 176), "TVOJA FOTKA", font=f("GeistMono-Bold.ttf", 30),
           fill=GOLD + (220,), anchor="mm")
    d.text((W / 2, H - 128), "NAHRAĎ  assets/img/foto.webp", font=f("GeistMono-Regular.ttf", 19),
           fill=(200, 200, 205, 130), anchor="mm")
    d.text((W / 2, H - 96), "ODPORÚČANÝ POMER  3 : 4", font=f("GeistMono-Regular.ttf", 17),
           fill=(120, 120, 128, 190), anchor="mm")
    img = Image.alpha_composite(img, layer)
    img = frame(img, 34, GOLD)

    os.makedirs(IMG, exist_ok=True)
    out = os.path.join(IMG, "foto.webp")
    img.convert("RGB").save(out, "WEBP", quality=90, method=6)
    print("ulozene:", out, os.path.getsize(out) // 1024, "KB")


GLOWS = [
    (0.72, 0.20, 430, 360),
    (0.24, 0.30, 380, 420),
    (0.78, 0.70, 420, 380),
    (0.18, 0.74, 400, 360),
    (0.64, 0.30, 460, 400),
    (0.30, 0.24, 380, 380),
]


def make_prace():
    W, H = 1200, 900
    os.makedirs(PRACE, exist_ok=True)
    for i in range(1, 7):
        random.seed(100 + i)
        img = gradient(W, H, (20, 19, 22), (7, 7, 9))
        gx, gy, grx, gry = GLOWS[i - 1]
        img = glow(img, int(W * gx), int(H * gy), grx, gry, (198, 156, 88), 0.85)
        img = glow(img, int(W * (1 - gx)), int(H * (1 - gy)), 300, 300, (75, 80, 100), 0.45)
        img = grain(img, 11)

        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        d.text((W / 2, H / 2 - 24), "%02d" % i, font=f("Outfit-Bold.ttf", 430),
               fill=(255, 255, 255, 7), stroke_width=1,
               stroke_fill=(215, 179, 106, 34), anchor="mm")
        d.text((64, H - 96), "FOTO %02d" % i, font=f("GeistMono-Bold.ttf", 24),
               fill=GOLD + (210,), anchor="ls")
        d.text((64, H - 64), "NAHRAĎ  assets/img/prace/prace-%d.webp" % i,
               font=f("GeistMono-Regular.ttf", 17), fill=(200, 200, 205, 105), anchor="ls")
        d.text((W - 64, H - 64), "SAMUEL ČIŽMÁR · 2026",
               font=f("GeistMono-Regular.ttf", 15), fill=(120, 120, 128, 150), anchor="rs")
        img = Image.alpha_composite(img, layer)
        img = frame(img, 30, GOLD)

        out = os.path.join(PRACE, "prace-%d.webp" % i)
        img.convert("RGB").save(out, "WEBP", quality=89, method=6)
        print("ulozene:", out, os.path.getsize(out) // 1024, "KB")


if __name__ == "__main__":
    make_foto()
    make_prace()
