#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Velocity Cartography — generátor vizuálov pre portfólio Samuela Čižmára.

Vytvorí:
  assets/img/hero.png        (1200x1500)  hlavný vizuál
  assets/img/about.png       (1100x1375)  vizuál sekcie "O mne"
  assets/img/tile-01..06.png (1200x675)    dlaždice projektov

Kreslí sa aditívnym svetlom (neon glow + bloom) na takmer čiernom podklade,
takže svetelné prvky skutočne žiaria. 2x supersampling = hladké čiary.
"""
import math
import os
import random

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont, ImageOps

BASE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(BASE)
OUT = os.path.join(REPO, "assets", "img")
FDIR = os.path.join(BASE, "fonts")
os.makedirs(OUT, exist_ok=True)

SS = 2  # supersampling

BG_TOP = (11, 15, 27)
BG_BOT = (3, 4, 9)
BLUE = (60, 130, 255)
CYAN = (70, 240, 255)
VIOLET = (150, 110, 255)
MAGENTA = (235, 95, 250)
WHITE = (240, 245, 255)

random.seed(7)


# ----------------------------------------------------------------------------- utils
def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def sc(color, v):
    v = max(0, min(255, int(v)))
    return (color[0] * v // 255, color[1] * v // 255, color[2] * v // 255)


def fnt(name, size):
    return ImageFont.truetype(os.path.join(FDIR, name), size)


def layer(size):
    return Image.new("RGB", size, (0, 0, 0))


def add(img, lay):
    return ImageChops.add(img, lay)


def merge_mask(mask):
    return Image.merge("RGB", (mask, mask, mask))


def base_canvas(w, h):
    img = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(1, h - 1)
        d.line([(0, y), (w, y)], fill=lerp(BG_TOP, BG_BOT, t ** 0.85))
    return img


def glow(img, cx, cy, radius, color, strength=1.0, gamma=1.0):
    r = int(radius)
    if r <= 0:
        return img
    mask = Image.radial_gradient("L").resize((r * 2, r * 2))
    mask = ImageOps.invert(mask)
    if gamma != 1.0:
        mask = mask.point(lambda v: int((v / 255.0) ** gamma * 255))
    mask = mask.point(lambda v: int(v * strength))
    tile = ImageChops.multiply(Image.new("RGB", (r * 2, r * 2), color), merge_mask(mask))
    lay = layer(img.size)
    lay.paste(tile, (int(cx) - r, int(cy) - r))
    return add(img, lay)


def grid(img, step, color=(120, 170, 230), value=22):
    lay = layer(img.size)
    d = ImageDraw.Draw(lay)
    w, h = img.size
    col = sc(color, value)
    for x in range(0, w + step, step):
        d.line([(x, 0), (x, h)], fill=col, width=1)
    for y in range(0, h + step, step):
        d.line([(0, y), (w, y)], fill=col, width=1)
    return add(img, lay)


def bloom(img, radius=34, strength=0.8, threshold=60):
    m = img.convert("L").point(lambda v: max(0, v - threshold))
    m = m.filter(ImageFilter.GaussianBlur(radius)).point(lambda v: int(v * strength))
    return add(img, ImageChops.multiply(img, merge_mask(m)))


def grain(img, sigma=20, amount=0.6):
    w, h = img.size
    n = Image.effect_noise((w, h), sigma).convert("L")
    pos = n.point(lambda v: int(max(0, v - 128) * amount))
    neg = n.point(lambda v: int(max(0, 128 - v) * amount))
    img = add(img, merge_mask(pos))
    img = ImageChops.subtract(img, merge_mask(neg))
    return img


def vignette(img, strength=0.55):
    w, h = img.size
    inv = ImageOps.invert(Image.radial_gradient("L").resize((w, h)))
    factor = inv.point(lambda v: int(255 * (1 - strength) + v * strength))
    return ImageChops.multiply(img, merge_mask(factor))


def tone(img, lift=10, gain=1.08):
    lut = [min(255, int((i + lift) * gain)) for i in range(256)]
    return img.point(lut * 3)


def blur_add(img, lay, radius):
    if radius > 0:
        lay = lay.filter(ImageFilter.GaussianBlur(radius))
    return add(img, lay)


# ----------------------------------------------------------------------------- prvky
def rings(lay, cx, cy, color, r_max, v_max=150):
    d = ImageDraw.Draw(lay)
    n = 26
    for i in range(n):
        t = i / (n - 1)
        r = 70 + t * (r_max - 70)
        v = v_max * (1 - t) ** 1.6 + 8
        col = lerp(color, CYAN, t * 0.5)
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=sc(col, v), width=SS)
    for i in range(0, 360, 3):
        rad = math.radians(i)
        r0 = r_max * 0.72
        long = (i % 30 == 0)
        r1 = r0 + (26 if long else 11)
        v = 200 if long else 80
        d.line([(cx + math.cos(rad) * r0, cy + math.sin(rad) * r0),
                (cx + math.cos(rad) * r1, cy + math.sin(rad) * r1)], fill=sc(color, v), width=SS)
    for _ in range(5):
        a0 = random.uniform(0, 360)
        a1 = a0 + random.uniform(20, 90)
        r = random.uniform(0.55, 0.95) * r_max
        d.arc([cx - r, cy - r, cx + r, cy + r], a0, a1, fill=sc(CYAN, 210), width=2 * SS)


def streaks(lay, fx, fy, w, h):
    d = ImageDraw.Draw(lay)
    for _ in range(300):
        ang = math.radians(random.uniform(-100, 30))
        length = random.uniform(0.15, 1.2) * w
        t = random.random()
        col = lerp(BLUE, CYAN, t)
        v = 20 + 150 * (1 - t) * random.random()
        d.line([(fx, fy), (fx + math.cos(ang) * length, fy + math.sin(ang) * length)],
               fill=sc(col, v), width=SS if random.random() > 0.2 else 2 * SS)


def contours(lay, w, h, color, rows=10, v=70):
    d = ImageDraw.Draw(lay)
    for k in range(rows):
        base = h * (0.60 + k * 0.042)
        amp = h * 0.012 * (0.5 + random.random())
        f1 = random.uniform(1.0, 2.4)
        ph = random.random() * 6.28
        f2 = random.uniform(4.0, 8.0)
        pts = []
        x = 0
        while x <= w:
            y = base + math.sin(x / w * f1 * 6.28 + ph) * amp + math.sin(x / w * f2 * 6.28) * amp * 0.25
            pts.append((x, y))
            x += 6 * SS
        d.line(pts, fill=sc(color, v), width=SS)


def label(d, xy, text, font, color, v=200, anchor="la"):
    d.text(xy, text, font=font, fill=sc(color, v), anchor=anchor)


# ----------------------------------------------------------------------------- vizuály
def compose_hero(w=1200, h=1500):
    W, H = w * SS, h * SS
    img = base_canvas(W, H)

    img = glow(img, W * 0.72, H * 0.24, int(W * 0.70), BLUE, 0.46, gamma=2.2)
    img = glow(img, W * 0.22, H * 0.80, int(W * 0.66), VIOLET, 0.40, gamma=2.3)
    img = glow(img, W * 0.62, H * 0.34, int(W * 0.42), CYAN, 0.30, gamma=2.5)

    img = grid(img, 56 * SS, value=26)

    lay = layer((W, H)); rings(lay, W * 0.63, H * 0.335, BLUE, W * 0.53, v_max=190)
    img = blur_add(img, lay, 0.6)

    lay = layer((W, H)); streaks(lay, W * 0.30, H * 0.74, W, H)
    img = blur_add(img, lay, 1.0)

    lay = layer((W, H))
    contours(lay, W, H, CYAN, rows=9, v=70)
    contours(lay, W, H, VIOLET, rows=5, v=45)
    img = blur_add(img, lay, 0.6)

    lay = layer((W, H)); d = ImageDraw.Draw(lay)
    d.line([(W * 0.06, H * 0.045), (W * 0.94, H * 0.045)], fill=sc((120, 170, 230), 55), width=SS)
    d.line([(W * 0.06, H * 0.955), (W * 0.94, H * 0.955)], fill=sc((120, 170, 230), 55), width=SS)
    img = add(img, lay)

    lay = layer((W, H)); d = ImageDraw.Draw(lay)
    label(d, (W * 0.07, H * 0.055), "FIG. 01", fnt("GeistMono-Bold.ttf", 20 * SS), CYAN, 235)
    label(d, (W * 0.07, H * 0.075), "VELOCITY CARTOGRAPHY", fnt("GeistMono-Regular.ttf", 20 * SS), WHITE, 150)
    label(d, (W * 0.93, H * 0.935), "SC / MMXXVI", fnt("GeistMono-Regular.ttf", 20 * SS), WHITE, 165, anchor="ra")
    label(d, (W * 0.93, H * 0.955), "48.7\u00b0N \u00b7 19.5\u00b0E", fnt("GeistMono-Regular.ttf", 20 * SS), CYAN, 140, anchor="ra")
    img = add(img, lay)

    img = img.resize((w, h), Image.LANCZOS)
    img = bloom(img, radius=26, strength=0.55, threshold=82)
    img = grain(img, 18, 0.5)
    img = vignette(img, 0.5)
    return tone(img, lift=3, gain=1.03)


def compose_about(w=1100, h=1375):
    W, H = w * SS, h * SS
    img = base_canvas(W, H)
    img = glow(img, W * 0.30, H * 0.28, int(W * 0.70), VIOLET, 0.42, gamma=2.1)
    img = glow(img, W * 0.74, H * 0.74, int(W * 0.70), BLUE, 0.42, gamma=2.1)
    img = glow(img, W * 0.5, H * 0.5, int(W * 0.45), CYAN, 0.22, gamma=2.4)
    img = grid(img, 60 * SS, value=22)

    lay = layer((W, H)); contours(lay, W, H, CYAN, rows=16, v=55)
    img = blur_add(img, lay, 0.6)

    lay = layer((W, H)); rings(lay, W * 0.70, H * 0.30, VIOLET, W * 0.30, v_max=120)
    img = blur_add(img, lay, 0.6)

    lay = layer((W, H)); d = ImageDraw.Draw(lay)
    for i in range(120):
        t = i / 119
        y = H * (0.80 + t * 0.16)
        amp = H * 0.01 * (1 - t)
        pts = [(x, y + math.sin(x / W * 12.56 + t * 6.28) * amp) for x in range(0, W + 8 * SS, 8 * SS)]
        d.line(pts, fill=sc(lerp(CYAN, VIOLET, t), 60 * (1 - t) + 12), width=SS)
    img = blur_add(img, lay, 0.7)

    lay = layer((W, H)); d = ImageDraw.Draw(lay)
    label(d, (W * 0.08, H * 0.05), "PROFILE / 02", fnt("GeistMono-Bold.ttf", 20 * SS), CYAN, 225)
    label(d, (W * 0.08, H * 0.95), "SYSTEMS \u00b7 LIGHT \u00b7 FORM", fnt("GeistMono-Regular.ttf", 16 * SS), WHITE, 140)
    img = add(img, lay)

    img = img.resize((w, h), Image.LANCZOS)
    img = bloom(img, radius=24, strength=0.5, threshold=82)
    img = grain(img, 18, 0.5)
    img = vignette(img, 0.5)
    return tone(img, lift=3, gain=1.03)


# ----------------------------------------------------------------------------- dlaždice
def tile_base(w, h, c1, c2, seed):
    random.seed(seed)
    W, H = w * SS, h * SS
    img = base_canvas(W, H)
    img = glow(img, W * 0.20, H * 0.18, int(W * 0.70), c1, 0.42, gamma=2.1)
    img = glow(img, W * 0.84, H * 0.88, int(W * 0.70), c2, 0.38, gamma=2.1)
    img = grid(img, 48 * SS, value=22)
    return img, W, H


def tile_finish(img, w, h, W, H, index, label_text, accent):
    lay = layer((W, H)); d = ImageDraw.Draw(lay)
    label(d, (W * 0.045, H * 0.24), index, fnt("BigShoulders-Bold.ttf", 200 * SS), accent, 60)
    label(d, (W * 0.045, H * 0.86), label_text.upper(), fnt("GeistMono-Bold.ttf", 18 * SS), WHITE, 230)
    label(d, (W * 0.955, H * 0.86), index, fnt("GeistMono-Regular.ttf", 18 * SS), accent, 220, anchor="ra")
    img = add(img, lay)

    img = img.resize((w, h), Image.LANCZOS)
    img = bloom(img, radius=18, strength=0.5, threshold=80)
    img = grain(img, 16, 0.45)
    img = vignette(img, 0.5)
    return tone(img, lift=3, gain=1.03)


def motif_aperture(d, W, H, accent):
    cx, cy, R = W * 0.70, H * 0.52, min(W, H) * 0.32
    for i in range(8):
        a0 = i * 45 + 12
        d.arc([cx - R, cy - R, cx + R, cy + R], a0, a0 + 130, fill=sc(accent, 210), width=2 * SS)
    d.ellipse([cx - R * 0.42, cy - R * 0.42, cx + R * 0.42, cy + R * 0.42], outline=sc(CYAN, 235), width=2 * SS)
    for i in range(0, 360, 6):
        rad = math.radians(i)
        r0 = R * 1.02
        r1 = r0 + (20 if i % 45 == 0 else 9)
        d.line([(cx + math.cos(rad) * r0, cy + math.sin(rad) * r0),
                (cx + math.cos(rad) * r1, cy + math.sin(rad) * r1)], fill=sc(accent, 170), width=SS)


def motif_halftone(d, W, H, accent):
    cols, rows = 24, 12
    ox, oy = W * 0.30, H * 0.10
    sx, sy = W * 0.66 / cols, H * 0.80 / rows
    for j in range(rows):
        for i in range(cols):
            t = (i / cols) * 0.6 + (j / rows) * 0.4
            r = (1 - t) * (sx * 0.5)
            if r < 1:
                continue
            col = lerp(accent, CYAN, t)
            x, y = ox + i * sx + sx / 2, oy + j * sy + sy / 2
            d.ellipse([x - r, y - r, x + r, y + r], fill=sc(col, 70 + 165 * (1 - t)))


def motif_cube(d, W, H, accent):
    def cube(cx, cy, s, v):
        top = [(cx, cy - s), (cx + s, cy - s * 0.5), (cx, cy), (cx - s, cy - s * 0.5)]
        left = [(cx - s, cy - s * 0.5), (cx, cy), (cx, cy + s), (cx - s, cy + s * 0.5)]
        right = [(cx + s, cy - s * 0.5), (cx, cy), (cx, cy + s), (cx + s, cy + s * 0.5)]
        for poly in (top, left, right):
            d.polygon(poly, outline=sc(accent, v))
    s = min(W, H) * 0.16
    cube(W * 0.62, H * 0.38, s, 245)
    cube(W * 0.62, H * 0.38 + s * 0.55, s, 150)
    cube(W * 0.62, H * 0.38 + s * 1.10, s, 90)
    for i in range(4):
        d.line([(W * 0.16, H * (0.32 + i * 0.13)), (W * 0.34, H * (0.32 + i * 0.13))], fill=sc(CYAN, 120 - i * 20), width=SS)


def motif_film(d, W, H, accent):
    x0, y0, x1, y1 = W * 0.40, H * 0.22, W * 0.92, H * 0.62
    d.rectangle([x0, y0, x1, y1], outline=sc(accent, 235), width=2 * SS)
    for yy in range(int(y0) + 18, int(y1) - 8, 26 * SS):
        d.rectangle([x0 + 8 * SS, yy, x0 + 20 * SS, yy + 10 * SS], fill=sc(accent, 200))
        d.rectangle([x1 - 20 * SS, yy, x1 - 8 * SS, yy + 10 * SS], fill=sc(accent, 200))
    pts = []
    for x in range(int(x0), int(x1) + 4 * SS, 4 * SS):
        t = (x - x0) / (x1 - x0)
        y = (y0 + y1) / 2 + math.sin(t * 6.28 * 3) * (y1 - y0) * 0.26 * (0.6 + 0.4 * math.sin(t * 6.28))
        pts.append((x, y))
    d.line(pts, fill=sc(CYAN, 245), width=2 * SS)


def motif_code(d, W, H, accent):
    f = fnt("GeistMono-Bold.ttf", 250 * SS)
    d.text((W * 0.33, H * 0.5), "{", font=f, fill=sc(accent, 235), anchor="lm")
    d.text((W * 0.79, H * 0.5), "}", font=f, fill=sc(CYAN, 235), anchor="rm")
    for j in range(9):
        for i in range(6):
            x = W * 0.44 + i * W * 0.055
            y = H * 0.22 + j * H * 0.06
            on = random.random() > 0.45
            d.rectangle([x, y, x + W * 0.035, y + H * 0.03], fill=sc((accent if on else CYAN), random.uniform(110, 220)))


def motif_eq(d, W, H, accent):
    n = 34
    x0 = W * 0.33
    span = W * 0.60
    bw = span / n * 0.55
    for i in range(n):
        t = i / (n - 1)
        hgt = (0.12 + 0.55 * abs(math.sin(t * 6.28 * 1.6)) * (0.5 + 0.5 * random.random())) * H
        x = x0 + i * span / n
        y1 = H * 0.62
        col = lerp(accent, CYAN, t)
        d.rectangle([x, y1 - hgt, x + bw, y1], fill=sc(col, 120 + 130 * (1 - t)))
    d.line([(x0 - W * 0.04, H * 0.62), (x0 + span + W * 0.02, H * 0.62)], fill=sc(CYAN, 190), width=2 * SS)


MOTIFS = [
    ("01", "Fotografia", BLUE, CYAN, motif_aperture),
    ("02", "Grafika", VIOLET, MAGENTA, motif_halftone),
    ("03", "3D & tla\u010d", CYAN, BLUE, motif_cube),
    ("04", "Video", MAGENTA, VIOLET, motif_film),
    ("05", "Web & PHP", BLUE, VIOLET, motif_code),
    ("06", "Hudba", VIOLET, CYAN, motif_eq),
]


def main():
    print("hero ...")
    compose_hero().save(os.path.join(OUT, "hero.png"), optimize=True)
    print("about ...")
    compose_about().save(os.path.join(OUT, "about.png"), optimize=True)
    for idx, (num, name, c1, c2, motif) in enumerate(MOTIFS, start=1):
        print("tile %s ..." % num)
        img, W, H = tile_base(1200, 675, c1, c2, seed=100 + idx)
        lay = layer((W, H)); d = ImageDraw.Draw(lay)
        motif(d, W, H, c1)
        img = blur_add(img, lay, 0.5)
        img = tile_finish(img, 1200, 675, W, H, num, name, c1)
        img.save(os.path.join(OUT, "tile-%02d.png" % idx), optimize=True)
    print("hotovo ->", OUT)


if __name__ == "__main__":
    main()
