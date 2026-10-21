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
| — | Hero | meno, rotujúce povolanie, predstavenie, fotka, počítadlá, bežiaci pás |
| 01 | O mne | krátke bio + fakty (vek, lokalita, zameranie, jazyky, dostupnosť) |
| — | Statement | veľký tmavý pás s mottom |
| 02 | Projekty | mriežka 6 fotiek — **klik na projekt otvorí detail s popisom** |
| 03 | Zručnosti | 3 karty s animovanými pruhmi — **karta „Fotografia" je odkaz na fotoportfólio** |
| 04 | Vzdelanie | časová os (Súkromná SOŠ Poprad — grafika) |
| 05 | Kontakt | e-mail, telefón, GitHub + kontaktný formulár |

Tlačidlá **„Napíš mi"** vedú na kontaktný formulár (`#kontakt`), nie na mail.

---

## Ako vložiť vlastnú fotku

1. Ulož svoju fotku (ideálne na výšku, pomer **3 : 4**) ako `assets/img/foto.webp`
   (alebo `.jpg` — potom zmeň názov v `index.html`).
2. Hotovo — veľkosť a orezanie rieši CSS (`object-fit: cover`).

> Teraz je tam placeholder `assets/img/foto.webp` s nápisom „TVOJA FOTKA".
> Fotka nie je odkaz — odkaz na fotoportfólio je na karte „Fotografia" v sekcii Zručnosti.

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

Nahraď ich vlastnými fotkami (**rovnaký názov**, odporúčaný pomer **4 : 3**).
Popisky („Projekt 01", „2026") prepíšeš v `index.html` v `<figcaption>`.

Ak chceš **viac alebo menej** projektov, skopíruj/uber `<figure class="work">` blok.

## Popis projektu (klik na fotku)

Každá fotka v Projektoch je **tlačidlo** — po kliknutí sa otvorí **detail projektu**
(fotka + názov + popis + štítky s nástrojmi). Detail sa dá zavrieť tlačidlom **✕**,
klávesou **Esc** alebo kliknutím mimo okna.

Text detailu nájdeš v `index.html` úplne dole v sekcii Projekty — hľadaj `id="projekt-1"`
až `id="projekt-6"`. Pri každom projekte prepíš tieto riadky:

```html
<div class="modal" id="projekt-1" …>
  …
      <p class="modal__eyebrow">Projekt 01 · 2026</p>          <!-- malý riadok hore -->
      <h3 class="modal__title" id="projekt-1-title">Názov projektu</h3>
      <p class="modal__text">Sem napíš popis projektu …</p>     <!-- popis projektu -->
      <ul class="chip"><li>Photoshop</li><li>Illustrator</li></ul>  <!-- nástroje -->
  …
</div>
```

> Dôležité: `data-open="projekt-1"` na tlačidle musí sedieť s `id="projekt-1"` v okne detailu.

## Odkaz na fotoportfólio

Na fotoportfólio vedie **jediný odkaz** — karta **„Fotografia"** v sekcii Zručnosti:

```
https://samustang1.github.io/cizmar-photography/
```

Otvára sa v novej karte, na hover sa karta nadvihne a v rohu sa rozsvieti „↗".
Odkaz zmeníš v `index.html` v atribúte `href`:

```html
<a class="card card--link" href="https://samustang1.github.io/cizmar-photography/" target="_blank" rel="noopener" …>
```

> Ak odkaz nechceš, vymeň `<a class="card card--link" …>` za `<article class="card" …>`
> a zmaž `<span class="card__go">↗</span>`.

---

## Súbory

```
index.html                     # celá stránka
assets/css/style.css           # dizajn
assets/js/main.js              # menu, reveal, počítadlá, formulár
assets/img/foto.webp           # fotka v hero (nahraď svojou)
assets/img/prace/*.webp        # fotky projektov (nahraď svojimi)
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
4. Po zmene CSS/JS zvýš `?v=11` → `?v=12` v `index.html` (cache-busting).
5. **Pruhy zručností** — v sekcii Zručnosti v `index.html` zmeň `--w` v `<div class="bar"><i style="--w:88%"></i></div>`
   (teraz: Fotografia **88 %**, Grafika **82 %**, Web & kód **50 %**).
6. **Bežiaci pás** („Fotografia ★ Grafika ★ …"): text je v `index.html` zopakovaný
   **8×** a animácia ho posúva o presne jednu kópiu (`--copies: 8` v `.ribbon__track`).
   Vďaka tomu je loop plynulý a pás nikdy nie je prázdny. Ak text zmeníš, prepíš ho
   vo všetkých kópiách; ak zmeníš počet kópií, uprav aj `--copies` v CSS.
7. Nahraj:

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
