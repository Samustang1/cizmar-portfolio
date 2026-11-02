# Samuel Čižmár — Fotografia & dizajn

Osobné **portfólio** postavené od nuly v čistom **HTML, CSS a JavaScripte**
(žiadny framework). Fotografia je hlavná, grafika a web ju dopĺňajú.

- **Live:** https://samustang1.github.io/cizmar-portfolio/
- **Repo:** https://github.com/Samustang1/cizmar-portfolio

## Štýl

Tmavý, fotografický „nočný ateliér“ — takmer čierna (`#0a0a0c`), jemná
sklenená hlavička, tlmená zlatá (`#d7b36a`) a veľa priestoru pre fotky.

- **Písmo:** Instrument Sans (text a nadpisy), Instrument Serif italic
  (zlaté akcenty v nadpisoch), Space Mono (technické popisky)
- **Pohyb:** krátke, pokojné prechody; reveal pri scrollovaní; modály sa
  otvárajú plynule; `prefers-reduced-motion` je plne podporené
- **Bez knižníc:** len Google Fonts, žiadny JS framework
- **Fotka v hero:** na desktope vpravo, na tablete a mobile **prvá** —
  fotografia je to prvé, čo človek uvidí

## Sekcie

| # | Sekcia | Obsah |
|---|--------|-------|
| — | Hero | veľká fotka, meno, rotujúce slovo, predstavenie, CTA |
| 01 | Vybrané práce | 6 klikateľných fotiek — detail s popisom sa otvorí v modáli |
| — | Prístup | krátky textový pás s mottom |
| 02 | O mne | krátke bio + fakty (vek, lokalita, zameranie, jazyky, dostupnosť) |
| 03 | Zručnosti | 3 karty s pruhmi — **Fotografia, Grafika & dizajn, Web & kód** |
| 04 | Vzdelanie | Súkromná SOŠ, Ul. 29. augusta 4812, Poprad — grafika |
| 05 | Kontakt | e-mail, telefón, GitHub + formulár |

Tlačidlá **„Napíš mi“** vedú na `#kontakt` — teda na formulár, nie na mail.
Odkaz na fotoportfólio je **iba** na karte **„Fotografia“** v sekcii Zručnosti.

---

## Ako vložiť vlastnú fotku do hero

1. Ulož fotku (ideálne na výšku, pomer **3 : 4**) ako `assets/img/foto.webp`.
2. Hotovo — orezanie rieši CSS (`object-fit: cover`).
   Na desktope je rám vysoký, na tablete/mobile širší; fotka sa prispôsobí.

> Teraz je tam tmavý placeholder s nápisom „TVOJA FOTKA“.
> Fotka nie je odkaz — odkaz na fotoportfólio je len na karte „Fotografia“.

## Ako vložiť fotky projektov

V `assets/img/prace/` je pripravených 6 miest:

```
assets/img/prace/prace-1.webp   →  Projekt 01
assets/img/prace/prace-2.webp   →  Projekt 02
assets/img/prace/prace-3.webp   →  Projekt 03
assets/img/prace/prace-4.webp   →  Projekt 04
assets/img/prace/prace-5.webp   →  Projekt 05
assets/img/prace/prace-6.webp   →  Projekt 06
```

Nahraď ich vlastnými fotkami (**rovnaký názov**, odporúčaný pomer **4 : 3**).
Názvy a kategórie pod fotkami prepíšeš v `index.html` v `<figcaption>`:

```html
<figcaption class="work__caption">
  <span class="work__name">Projekt 01</span>
  <span class="work__tag">Portrét</span>
</figcaption>
```

Ak chceš viac/menej projektov, skopíruj/uber celý `<figure class="work">` blok
a nezabudni na zodpovedajúci modál (nižšie).

## Popis projektu (klik na fotku)

Každá fotka je **tlačidlo** `data-open="projekt-1"`. Po kliknutí sa otvorí
modál s fotkou, názvom, popisom a štítkami. Zavrieť sa dá:

- okrúhlym **✕** v pravom hornom rohu (je vpredu, nad obsahom),
- klávesou **Esc**,
- kliknutím na tmavé pozadie okolo okna.

Texty nájdeš v `index.html` úplne dole, hľadaj `id="projekt-1"` až
`id="projekt-6"`:

```html
<p class="modal__eyebrow">01 / Portrét · 2026</p>
<h3 class="modal__title" id="projekt-1-title">Projekt 01</h3>
<p class="modal__text">Sem napíš popis projektu…</p>
<ul class="chips"><li>Lightroom</li><li>Photoshop</li></ul>
```

> `data-open="projekt-1"` na tlačidle musí sedieť s `id="projekt-1"` v modáli.

## Odkaz na fotoportfólio

Jediný odkaz na fotoportfólio je karta **„Fotografia“** v sekcii Zručnosti:

```
https://samustang1.github.io/cizmar-photography/
```

V `index.html` je to `<a class="skill skill--link" …>`. Otvára sa v novej karte.
Ak by si ho chcel odstrániť, zmeň `<a>` na `<article>` a zmaž
`<span class="skill__go">` aj `<span class="skill__hint">`.

## Rotujúce slovo a zlatý podfarbený pás

V `assets/js/main.js` je pole `words`:

```js
const words = ["portréty.", "krajinu.", "svetlo.", "detail.", "momenty."];
```

Text sa píše aj maže **písmeno po písmene**. Zlatý pás je len pozadie
inline prvku `.rotate` — nemá pevnú šírku, takže sa **skracuje a mizne presne
spolu s textom**. Rýchlosti vieš doladiť v `tickRotate()`:

- prvých `2800 ms` drží prvé slovo,
- písanie `68 ms`, držanie `1900 ms`, mazanie `38 ms`,
- medzi slovami `120 ms`.

Pri `prefers-reduced-motion` zostane prvé slovo statické.

## Zručnosti a pruhy

V `index.html` v sekcii Zručnosti zmeň šírku v `<i style="--w:88%">`:

- Fotografia — **88 %**
- Grafika & dizajn (Photoshop, Illustrator) — **82 %**
- Web & kód — **50 %**

Pruh sa vyplní, keď sa karta dostane do viewportu (IntersectionObserver
pridá `.is-in`). Hover na desktope a tap na tablete/mobile majú rovnaký
zvýraznený stav: `.skill:hover` a `.skill.is-hover` (triedu pridáva `main.js`
pri `pointerdown`; klávesnica funguje cez Enter/Space).

## Súbory

```
index.html                     # celá stránka
assets/css/style.css           # dizajn a responzivita
assets/js/main.js              # menu, reveal, rotujúce slovo, modály, formulár
assets/img/foto.webp           # fotka v hero (nahraď svojou)
assets/img/prace/*.webp        # fotky projektov (nahraď svojimi)
assets/img/og.webp             # náhľad pre sociálne siete
tools/make_placeholders.py     # generátor tmavých placeholderov
tools/make_og.py               # generátor OG obrázka
tools/fonts/                   # fonty pre generátory (OFL)
.nojekyll                      # vypne Jekyll na GitHub Pages
```

## Úpravy a nasadenie

1. **Texty** prepíšeš v `index.html`.
2. **Farby** v `assets/css/style.css` v `:root` (`--gold`, `--bg`, `--surface`…).
3. Po zmene CSS alebo JS **zvýš verziu** v `index.html`:
   `assets/css/style.css?v=36` a `assets/js/main.js?v=36` → `?v=37`.
   Bez toho môže prehliadač zobraziť starú verziu z cache.
4. Nahraj:

```bash
git add -A
git commit -m "tmavý foto-first dizajn"
git push
```

GitHub Pages sa prebuildí automaticky, zvyčajne do **60–90 sekúnd**.
Ak sa zmena neukáže, daj tvrdý refresh (`Ctrl + F5`).

> **Formulár:** používa FormSubmit (`formsubmit.co`). Pri prvej odoslanej
> správe treba raz potvrdiť e-mail, ktorý príde na `cizsamko@gmail.com`.

### Generovanie placeholderov / OG obrázka

Ak máš Python s Pillow:

```bash
python tools/make_placeholders.py
python tools/make_og.py
```

Na tomto PC nie je systémový Python — použi Blender Python:

```powershell
& "C:\Program Files\Blender Foundation\Blender 5.0\5.0\python\bin\python.exe" tools\make_placeholders.py
& "C:\Program Files\Blender Foundation\Blender 5.0\5.0\python\bin\python.exe" tools\make_og.py
```

## Kontakt

- **E-mail:** cizsamko@gmail.com
- **Telefón:** +421 910 186 170
- **GitHub:** [Samustang1](https://github.com/Samustang1)
