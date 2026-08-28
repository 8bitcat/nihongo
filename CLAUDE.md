# Nihongo Quest — projektinstruktion

Det här är **Nihongo Quest**, Carls japanska-inlärningsspel: hiragana, katakana,
ordförråd, kanji och grammatik — hela vägen till ett JLPT N5-mockprov.

**För full kontext och att återuppta arbetet: läs [SESSION.md](SESSION.md).**

- Live: https://8bitcat.github.io/nihongo · Repo: `main` → GitHub Pages (deploy = push).
- Buildless HTML5 + ES-moduler, ingen bygg. Lokal test: `python -m http.server 8144`.
- Verifiera alltid ändringar med headless-screenshot (Playwright) innan commit + push.
- Ljud = Web Speech API (talsyntes ja-JP). Ingen extern ljudfil, inget API.
- All progress i `localStorage` under nyckeln `nihongo_save_v1`.

## Pedagogisk grund (ändra inte utan skäl)

Speldesignen bygger på research (2026-08-28, källor i SESSION.md):

1. **Mnemonics** — varje kana har en svensk minnesbild. Tenten/kombinationer lärs som REGLER, inte nya bilder.
2. **SRS/spaced repetition** — Leitner-boxar med växande intervall ([js/state.js](js/state.js)). Fel → ner två boxar.
3. **Active recall-stege** — låg box: flerval → mellan: lyssna → hög: skriv romaji → topp: rita ur minnet.
4. **Handskrift** — canvas-spårning för motoriskt minne ([js/exercises.js](js/exercises.js) `drawQ`).
5. **Ljud alltid** — tecken/ord läses upp när de visas; hörförståelse är egen frågetyp och egen provdel.
6. **Små portioner** — ~5 kana eller ~8 ord per lektion (mer sänker retention).

## Nivåstruktur N5→N1

All data är taggad för N5. N4–N1 läggs till genom att utöka datafilerna i `data/`
med fler poster/lektioner och en nivåväljare — schemat är förberett, ändra inte format.
JLPT-provets poängsättning (0–180, godkänt 80 + delminimum) speglar riktiga provet — behåll den.
