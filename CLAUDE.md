# Nihongo Quest — projektinstruktion

Det här är **Nihongo Quest**, Carls japanska-inlärningsspel: hiragana, katakana,
ordförråd, kanji och grammatik — hela vägen till ett JLPT N5-mockprov.

**För full kontext och att återuppta arbetet: läs [SESSION.md](SESSION.md).**

- Live: https://8bitcat.github.io/nihongo · Repo: `main` → GitHub Pages (deploy = push).
- **Bumpa `js/version.js` vid varje deploy** — Pages cachar JS i 10 min; sidfoten visar versionen så användaren ser om webbläsaren kör gammalt.
- Buildless HTML5 + ES-moduler, ingen bygg. Lokal test: `python -m http.server 8144`.
- Verifiera alltid ändringar med headless-screenshot (Playwright) innan commit + push.
- Ljud = Web Speech API (talsyntes ja-JP). Ingen extern ljudfil, inget API.
- All progress i `localStorage` under nyckeln `nihongo_save_v1`.

## Pedagogisk grund (ändra inte utan skäl)

Speldesignen bygger på research (2026-08-28, källor i SESSION.md):

1. **Mnemonics** — varje kana har en svensk minnesbild + emoji. Tenten/kombinationer lärs som REGLER, inte nya bilder.
2. **SRS/spaced repetition** — Leitner-boxar med växande intervall ([js/state.js](js/state.js)). Fel → ner två boxar.
3. **Active recall-stege** — låg box: flerval → mellan: lyssna → hög: skriv romaji → topp: rita ur minnet.
4. **Handskrift** — canvas-spårning för motoriskt minne ([js/exercises.js](js/exercises.js) `drawQ`).
5. **Ljud alltid** — tecken/ord läses upp när de visas; hörförståelse är egen frågetyp och egen provdel.
6. **Små portioner** — ~5 kana eller ~8 ord per lektion (mer sänker retention).
7. **Bildstöd (dual coding)** — emoji på konkreta ord/kana-minnesbilder. REGLER (Carpenter & Olson):
   bild vid FÖRSTA presentationen och som cue/facit i retrieval — aldrig ledtråd bredvid rätt svar;
   abstrakta ord får INGEN bild (kan hämma); bilden fasas ut i SRS från box 2.
8. **Gamification-integritet** — XP viktas efter svårighet (skriva ×2, lyssna ×1.5, flerval ×1);
   bossar kräver produktion; combo belönar noggrannhet (ingen tidspress); streak har ♨️-frys
   (förtjänas var 7:e dag) mot streak-ångest; belöningskistan ger bara XP, aldrig innehåll bakom slump.

## Nivåstruktur N5→N1

All data är taggad för N5. N4–N1 läggs till genom att utöka datafilerna i `data/`
med fler poster/lektioner och en nivåväljare — schemat är förberett, ändra inte format.
JLPT-provets poängsättning (0–180, godkänt 80 + delminimum) speglar riktiga provet — behåll den.
