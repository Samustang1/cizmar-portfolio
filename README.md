# Samuel Čižmár — Osobné portfólio

Moderná osobná webová stránka (statická, jeden súbor HTML + CSS + JS).
Beží na **GitHub Pages** — bez Google Sites, bez servera.

- **Live:** https://samustang1.github.io/cizmar-portfolio/
- **Fotoportfólio (druhá stránka):** https://samustang1.github.io/cizmar-photography/

## Sekcie

| Sekcia | Obsah |
|---|---|
| Domov | Predstavenie, rýchle odkazy |
| O mne | Krátke bio + zručnosti |
| Zručnosti a skúsenosti | Fotografia, grafika, video, 3D, web, hudba |
| Projekty | Karty s projektmi a odkazmi |
| Vzdelanie / Kurzy | Časová os |
| Kontakt | E-mail, telefón, GitHub, formulár |

## Štruktúra

```
index.html                 # celá stránka
assets/css/style.css       # dizajn (tmavá neonová téma)
assets/js/main.js          # interakcie, animácie, formulár
.nojekyll                  # vypne Jekyll na Pages
```

## Ako upraviť obsah

1. Otvor `index.html` a prepíš texty (nadpisy, popisy, projekty, kontakt).
2. Farby zmeníš v `assets/css/style.css` v časti `:root` (premenná `--neon`).
3. Po zmene CSS/JS zvýš `?v=1` na `?v=2` v `index.html` (cache-busting).
4. Odošli zmenu:

```bash
git add -A
git commit -m "úprava obsahu"
git push
```

GitHub Pages sa prebuildí automaticky do minúty.

## Kontaktný formulár

Formulár posiela správy cez **FormSubmit** do schránky `cizsamko@gmail.com`.
Pri **prvom** odoslaní príde na e-mail aktivačný link — treba ho raz potvrdiť.
