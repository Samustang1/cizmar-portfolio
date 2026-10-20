# Samuel Čižmár — Osobné portfólio

Prémiová osobná webová stránka (statická — HTML + CSS + JS, bez servera).
Beží na **GitHub Pages**.

- **Live:** https://samustang1.github.io/cizmar-portfolio/
- **Fotoportfólio (druhá stránka):** https://samustang1.github.io/cizmar-photography/

## Vizuálny koncept

Dizajn vychádza z umeleckej filozofie **Velocity Cartography** (viď
[`DESIGN-PHILOSOPHY.md`](DESIGN-PHILOSOPHY.md)) — pohyb ako terén, ktorý sa dá
zmerať a zmapovať. Vizuály (hero, sekcia „O mne", dlaždice projektov) nie sú
fotky z internetu; generuje ich vlastný skript aditívnym neonovým svetlom
(glow + bloom) na takmer čiernom podklade.

- Typografia: **Big Shoulders Display** (nadpisy), **Inter** (text), **JetBrains Mono** (technické popisky)
- Paleta: elektrická modrá → neónová tyrkysová → fialová na hlbokom pozadí

## Sekcie

| Sekcia | Obsah |
|---|---|
| Domov | Veľký nadpis, hero vizuál, štatistiky |
| O mne | Bio + zoznam zručností |
| Zručnosti | 6 oblastí s ukazovateľmi |
| Projekty | 6 dlaždíc s vlastnými vizuálmi |
| Vzdelanie / Kurzy | Časová os |
| Kontakt | Údaje + funkčný formulár |

## Štruktúra

```
index.html                 # celá stránka
assets/css/style.css       # dizajn
assets/js/main.js          # interakcie, animácie, formulár
assets/img/                # vygenerované vizuály (hero, about, tile-01..06)
tools/generate_art.py      # generátor vizuálov (Pillow)
tools/fonts/               # fonty pre generátor (OFL)
DESIGN-PHILOSOPHY.md       # dizajnová filozofia
.nojekyll                  # vypne Jekyll na Pages
```

## Ako upraviť obsah

1. Texty prepíšeš v `index.html`.
2. Farby v `assets/css/style.css` v časti `:root`.
3. Vizuály prerobíš: `python tools/generate_art.py` (potrebuje `Pillow`).
   Parametre žiary a farieb sú hore v skripte.
4. Po zmene CSS/JS zvýš `?v=2` → `?v=3` v `index.html` (cache-busting).
5. Nahraj zmenu:

```bash
git add -A
git commit -m "úprava obsahu"
git push
```

GitHub Pages sa prebuildí automaticky do minúty.

## Kontaktný formulár

Formulár posiela správy cez **FormSubmit** do schránky `cizsamko@gmail.com`.
Pri prvom odoslaní príde aktivačný e-mail — treba ho raz potvrdiť.
