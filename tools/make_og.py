# -*- coding: utf-8 -*-
"""
Vygeneruje tmavý OG (náhľadový) obrázok portfólia.
Výstup: assets/img/og.webp  (1200 x 630)

Spúšťaj:  python tools/make_og.py
"""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

BASE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(BASE)
OUT = os.path.join(REPO, "assets", "img")
FONTS = os.path.join(BASE, "fonts")

INK = (245, 245, 247)
MUTED = (147, 147, 155)
MUTED_2 = (104, 104, 111)
GOLD = (215, 179, 106)
GOLD_2 = (240, 204, 134)


def f(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


def main():
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), (8, 8, 10))
    d = ImageDraw.Draw(img)

    # vertikálny gradient
    for y in range(H):
        t = y / (H - 1)
        col = (
            int(20 + (7 - 20) * t),
            int(19 + (7 - 19) * t),
            int(23 + (9 - 23) * t),
        )
        d.line([(0, y), (W, y)], fill=col)

    # teplý svit vpravo hore
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([W - 520, -300, W + 260, 480], fill=(198, 156, 88, 70))
    gd.ellipse([-260, H - 330, 400, H + 260], fill=(76, 82, 105, 45))
    glow = glow.filter(ImageFilter.GaussianBlur(150))
    img = Image.alpha_composite(img.convert("RGBA"), glow)

    # jemné zrno
    noise = Image.effect_noise((W, H), 10).convert("L")
    noise_rgb = Image.merge("RGB", (noise, noise, noise))
    img = Image.blend(img.convert("RGB"), noise_rgb, 0.028).convert("RGBA")

    # tenký rám
    frame = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    fd = ImageDraw.Draw(frame)
    fd.rounded_rectangle([28, 28, W - 28, H - 28], radius=3, outline=GOLD + (52,), width=1)
    img = Image.alpha_composite(img, frame)

    # veľký duchovný monogram vpravo
    ghost = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ghd = ImageDraw.Draw(ghost)
    ghd.text((W - 130, H // 2 + 10), "SČ", font=f("Outfit-Bold.ttf", 380),
             fill=(255, 255, 255, 9), anchor="mm")
    img = Image.alpha_composite(img, ghost)

    # značka
    mark = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    md = ImageDraw.Draw(mark)
    md.ellipse([66, 66, 126, 126], outline=GOLD + (150,), width=1)
    md.text((96, 98), "SČ", font=f("Outfit-Bold.ttf", 28), fill=GOLD + (235,), anchor="mm")
    md.text((148, 82), "SAMUEL ČIŽMÁR", font=f("GeistMono-Bold.ttf", 21), fill=INK + (235,), anchor="lm")
    md.text((148, 110), "FOTOGRAFIA · GRAFIKA · WEB", font=f("GeistMono-Regular.ttf", 15),
            fill=MUTED + (230,), anchor="lm")
    md.line([68, 220, 280, 220], fill=GOLD + (100,), width=1)

    # veľké meno
    name_font = f("Outfit-Bold.ttf", 142)
    md.text((66, 352), "Samuel", font=name_font, fill=INK + (255,), anchor="ls")
    md.text((66, 500), "Čižmár", font=name_font, fill=INK + (255,), anchor="ls")
    name_w = md.textlength("Čižmár", font=name_font)
    md.text((66 + name_w + 4, 500), ".", font=name_font, fill=GOLD + (255,), anchor="ls")

    # meta vpravo dole
    md.text((W - 68, 540), "PORTFÓLIO · 2026", font=f("GeistMono-Regular.ttf", 17),
            fill=GOLD + (220,), anchor="rs")
    md.text((W - 68, 570), "POPRAD, SLOVENSKO", font=f("GeistMono-Regular.ttf", 14),
            fill=MUTED_2 + (230,), anchor="rs")

    img = Image.alpha_composite(img, mark)

    os.makedirs(OUT, exist_ok=True)
    out = os.path.join(OUT, "og.webp")
    img.convert("RGB").save(out, "WEBP", quality=90, method=6)
    print("ulozene:", out, os.path.getsize(out) // 1024, "KB")


if __name__ == "__main__":
    main()
