# Samuel Čižmár — PROJEKTY

Statická webová stránka (HTML + CSS + JS, bez servera) so **semantickou štruktúrou**
podľa zadania. Beží na **GitHub Pages**.

- **Live:** https://samustang1.github.io/cizmar-portfolio/
- **Fotoportfólio (druhá stránka):** https://samustang1.github.io/cizmar-photography/

## Zadanie

Stránka vychádza zo školského zadania (priečinok `Downloads`):

- `Čižmár_projekty.docx` — texty projektov (Zadanie + Vypracovanie a hodnotenie)
- `Čižmár_projekty_wireframe.png` — náčrt rozloženia
- `Čižmár_projekty_semantika.zip` — `spg podstránka/podstranka.html` + obrázky projektov

Štruktúra podľa zadania:

```
<header>   logo + navigačné menu + profil (obrázok + meno)
<main>     <section class="projects">
             <h1>PROJEKTY</h1>
             <article class="project"> … obrázok + text (Zadanie / Vypracovanie a hodnotenie)
             (5×, striedavo s triedou .reverse)
<footer>   päta (kontakt, odkazy)
```

## Obsah — 5 projektov

| # | Projekt | Obrázok |
|---|---------|---------|
| 01 | Kreatívny životopis | `assets/img/projekty/projekt-1.webp` |
| 02 | Glow up effect | `assets/img/projekty/projekt-2.webp` |
| 03 | Prvá webová stránka | `assets/img/projekty/projekt-3.webp` |
| 04 | Webová stránka pre šikanu | `assets/img/projekty/projekt-4.webp` *(placeholder)* |
| 05 | Web hosting z Raspberry Pi | `assets/img/projekty/projekt-5.webp` |

> **Poznámka:** Zadanie neobsahovalo obrázok pre Projekt 4 ani profilovú fotku.
> Projekt 4 má preto neutrálny placeholder — nahraď ho reálnym obrázkom
> (ulož ho ako `assets/img/projekty/projekt-4.webp`). Profilový avatar
> `assets/img/profil.webp` nahradíš svojou fotkou (napr. `profil.jpg`).

## Štruktúra projektu

```
index.html                    # celá stránka
assets/css/style.css          # dizajn (premium tmavá téma)
assets/js/main.js             # navigácia, reveal, počítadlá, lightbox
assets/img/profil.webp        # profilový avatar
assets/img/og.webp            # náhľad pre sociálne siete
assets/img/projekty/*.webp    # obrázky projektov
tools/generate_art.py         # generátor vizuálov (Pillow)
tools/page_assets.py          # konverzia obrázkov + avatar + placeholder + OG
tools/fonts/                  # fonty pre generátor (OFL)
DESIGN-PHILOSOPHY.md          # dizajnová filozofia
.nojekyll                     # vypne Jekyll na Pages
```

## Ako upraviť obsah

1. Texty projektov prepíšeš v `index.html` (v `article.project`).
2. Farby v `assets/css/style.css` v časti `:root`.
3. Obrázky: nahraď `assets/img/projekty/*.webp` (WebP, prípadne uprav `tools/page_assets.py`).
4. Po zmene CSS/JS zvýš `?v=1` → `?v=2` v `index.html` (cache-busting).
5. Nahraj:

```bash
git add -A
git commit -m "úprava obsahu"
git push
```

GitHub Pages sa prebuildí automaticky do minúty.

## Kontakt

- **E-mail:** cizsamko@gmail.com
- **Telefón:** +421 910 186 170
- **GitHub:** [Samustang1](https://github.com/Samustang1)
