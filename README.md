# Samuel Čižmár — Portfólio

Moderné osobné **portfólio** postavené od nuly v čistom **HTML, CSS a JavaScripte**
(žiadny framework). Slúži na ukázanie zamestnávateľovi — brigáda, prax alebo spolupráca.

- **Live:** https://samustang1.github.io/cizmar-portfolio/
- **Repo:** https://github.com/Samustang1/cizmar-portfolio

## Štýl

Svetlý „print / editorial" dizajn s výraznou typografiou, tvrdými tieňmi (offset
box-shadow) a pestrou paletou — mix varsity, editorialu a retra. Žiadny odkaz na iné stránky.

- **Písmo:** Anton (nadpisy), Inter (text), Space Mono (technické popisky)
- **Farby:** krémová, atramentová, červená, modrá, jantárová, zelená, fialová
- Jednoduchý, rýchly, responzívny, bez externých knižníc (len Google Fonts)

## Sekcie

| # | Sekcia | Obsah |
|---|--------|-------|
| — | Hero | meno, rotujúce povolanie, predstavenie, tlačidlá, plagát, bežiaci pás |
| 01 | O mne | krátke bio + fakty (vek, lokalita, zameranie, jazyky, dostupnosť) |
| 02 | Zručnosti | 6 kariet s animovanými pruhmi (foto, grafika, video, 3D, web, zvuk) |
| 03 | Vzdelanie | časová os vzdelania a smerovania |
| 04 | Kontakt | e-mail, telefón, GitHub + kontaktný formulár |

## Súbory

```
index.html               # celá stránka
assets/css/style.css     # dizajn (svetlá téma)
assets/js/main.js        # menu, reveal, pruhy, rotujúce texty, formulár
assets/img/og.webp       # náhľad pre sociálne siete
tools/make_og.py         # generátor OG obrázka (Pillow)
tools/fonts/             # fonty pre generátor (OFL)
.nojekyll                # vypne Jekyll na GitHub Pages
```

## Úpravy

1. **Texty** prepíšeš priamo v `index.html`.
2. **Farby** v `assets/css/style.css` v časti `:root` (`--red`, `--blue`, `--amber`, …).
3. **Rotujúce slová** v `assets/js/main.js` (pole `words`).
4. Po zmene CSS/JS zvýš `?v=1` → `?v=2` v `index.html` (cache-busting).
5. Nahraj:

```bash
git add -A
git commit -m "úprava portfólia"
git push
```

GitHub Pages sa prebuildí automaticky do minúty.

> **Formulár:** používa FormSubmit (`formsubmit.co`). Pri prvej odoslanej správe
> treba raz potvrdiť e-mail, ktorý príde na `cizsamko@gmail.com`.

## Kontakt

- **E-mail:** cizsamko@gmail.com
- **Telefón:** +421 910 186 170
- **GitHub:** [Samustang1](https://github.com/Samustang1)
