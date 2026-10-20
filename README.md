# Samuel Čižmár — Portfólio

Moderné osobné **portfólio** postavené od nuly v čistom **HTML, CSS a JavaScripte**
(žiadny framework). Slúži na ukázanie zamestnávateľovi — brigáda, prax alebo spolupráca.

- **Live:** https://samustang1.github.io/cizmar-portfolio/
- **Repo:** https://github.com/Samustang1/cizmar-portfolio

## Štýl

Svetlý „print / editorial" dizajn s výraznou typografiou, tvrdými tieňmi (offset
box-shadow), pestrou paletou a animovaným (aurora) pozadím.

- **Písmo:** Anton (nadpisy), Inter (text), Space Mono (technické popisky)
- **Farby:** krémová, atramentová, červená, modrá, jantárová, zelená, fialová
- Rýchle, responzívne, bez externých knižníc (len Google Fonts)

## Sekcie

| # | Sekcia | Obsah |
|---|--------|-------|
| — | Hero | meno, rotujúce povolanie, predstavenie, **fotka**, počítadlá, bežiaci pás |
| 01 | O mne | krátke bio + fakty (vek, lokalita, zameranie, jazyky, dostupnosť) |
| — | Statement | veľký tmavý pás s mottom |
| 02 | Projekty | mriežka 6 obrázkov (klik = zväčšenie / lightbox) |
| 03 | Zručnosti | 6 kariet s animovanými pruhmi |
| 04 | Vzdelanie | časová os |
| 05 | Kontakt | e-mail, telefón, GitHub + kontaktný formulár |

Tlačidlá **„Napíš mi"** vedú na kontaktný formulár (`#kontakt`), nie na mail.

---

## Ako vložiť vlastnú fotku

1. Ulož svoju fotku (ideálne na výšku, pomer **3 : 4**) ako `assets/img/foto.webp`
   (alebo `.jpg` — potom zmeň názov v `index.html`).
2. Hotovo — veľkosť a orezanie rieši CSS (`object-fit: cover`).

> Teraz je tam placeholder `assets/img/foto.webp` s nápisom „TVOJA FOTKA".

## Ako vložiť projekty / fotky

Sú pripravené 6 miesta v `assets/img/prace/`:

```
assets/img/prace/prace-1.webp   →  Projekt 01
assets/img/prace/prace-2.webp   →  Projekt 02
assets/img/prace/prace-3.webp   →  Projekt 03
assets/img/prace/prace-4.webp   →  Projekt 04
assets/img/prace/prace-5.webp   →  Projekt 05
assets/img/prace/prace-6.webp   →  Projekt 06
```

Nahraď ich vlastnými obrázkami (**rovnaký názov**, odporúčaný pomer **4 : 3**).
Popisky („Projekt 01", „popis · rok") prepíšeš v `index.html` v `<figcaption>`.

Ak chceš **viac alebo menej** projektov, skopíruj/uber `<figure class="work">` blok.

---

## Súbory

```
index.html                     # celá stránka
assets/css/style.css           # dizajn
assets/js/main.js              # menu, reveal, počítadlá, lightbox, formulár
assets/img/foto.webp           # fotka v hero (nahraď svojou)
assets/img/prace/*.webp        # obrázky projektov (nahraď svojimi)
assets/img/og.webp             # náhľad pre sociálne siete
tools/make_og.py               # generátor OG obrázka
tools/make_placeholders.py     # generátor placeholderov (foto + projekty)
tools/fonts/                   # fonty pre generátory (OFL)
.nojekyll                      # vypne Jekyll na GitHub Pages
```

## Úpravy a nasadenie

1. **Texty** prepíšeš v `index.html`.
2. **Farby** v `assets/css/style.css` v časti `:root` (`--red`, `--blue`, `--amber`, …).
3. **Rotujúce slová** v `assets/js/main.js` (pole `words`).
4. Po zmene CSS/JS zvýš `?v=3` → `?v=4` v `index.html` (cache-busting).
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
