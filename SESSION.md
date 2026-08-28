# SESSION — Nihongo Quest

Senast uppdaterad: 2026-08-28 (v2.0 — bilder + gamification)

## Status

**v2.0 klar och röktestad headless (Playwright, inga JS-fel).**
v1-kärnan (lektioner, SRS, prov) + v2: bildstöd (emoji via dual coding — 92 kana + 200 av 334 ord,
tilldelade via multi-agent-workflow), dagliga uppdrag, combo med viktad XP, Kana-regn-arkadspel
(SRS-viktat urval, guldtecken, recap + riktad drill), bossar (Oni/Kappa/Kitsune — produktionstunga,
3 liv), 17 utmärkelser med toasts, belöningskista, rang-upp-firande, ♨️ streak-frys,
"Vägen till N5"-progressbar. Nya filer: [js/gamify.js](js/gamify.js), [js/arcade.js](js/arcade.js).
Designbeslut grundade i research-workflow (dual coding/picture superiority, gamification-forskning,
minigame-design) — se CLAUDE.md punkt 7–8 för reglerna.

## Filkarta

| Fil | Innehåll |
|---|---|
| [index.html](index.html) | Appskal |
| [css/style.css](css/style.css) | All stil — indigo/vermilion-tema, mobil-först |
| [js/main.js](js/main.js) | Navigation/router (`nav.go`) |
| [js/screens.js](js/screens.js) | Alla vyer utom provet |
| [js/test.js](js/test.js) | JLPT N5-mockprov (3 delar, timer, 0–180 p) |
| [js/exercises.js](js/exercises.js) | Övningsmotor: mcQ, typeQ, drawQ (canvas), matchning, runDrill |
| [js/state.js](js/state.js) | Sparfil + SRS (Leitner, 9 boxar) + XP/rank/streak |
| [js/audio.js](js/audio.js) | Talsyntes ja-JP med röstranking (Nanami > Google > övriga) |
| [js/kanaUtils.js](js/kanaUtils.js) | kana↔romaji, IME-parser (accepterar Hepburn + Kunrei) |
| [data/kana.js](data/kana.js) | 92 kana med svenska mnemonics + lektionsindelning |
| [data/vocab.js](data/vocab.js) | ~330 N5-ord, 18 teman, exempelmeningar |
| [data/kanji.js](data/kanji.js) | 80 N5-kanji i 10 temalektioner |
| [data/grammar.js](data/grammar.js) | 10 grammatiklektioner + läspassager + hörförståelsebank |

## Designbeslut

- **Svenska mnemonics** för bas-kana; tenten (゛/゜) och kombinationer (きゃ) lärs som regler.
- **SRS-stege efter box:** flerval → lyssna → skriv romaji → rita ur minnet (självrättning).
- **Romaji-inmatning** rättas genom att konvertera användarens romaji → kana (IME-stil), så
  både Hepburn (shi) och Kunrei (si) godkänns. Långa vokaler: både "koohii" och "ko-hi-".
- **Skrivpoäng:** spårning poängsätts med täckning (≥45 % av glyfen) + precision (≥50 % på glyfen).
- **Provet** viktar som riktiga JLPT N5: del 1+2 → 120 p, del 3 (hörförståelse) → 60 p.
  Godkänt = totalt ≥80 OCH ≥38 på språk/läsning OCH ≥19 på hörförståelse. Slumpas varje gång.
- **Inget backend** — localStorage (`nihongo_save_v1`).

## Researchkällor (2026-08-28)

- Tofugu: Spaced Repetition and Japanese / kana-mnemonics-metodik
- Coto Academy + Migaku: JLPT N5-krav (~100 kanji, ~800 ord, 80/180 godkänt, delminimum)
- Clozemaster/Kanjijo: active recall 3–5× effektivare än passiv repetition; 5–10 nya ord/dag
- De Gruyter (CercleS 2024) + Frontiers: handskrift förbättrar kana/kanji-retention

## Nästa steg (idéer)

1. **Fler N5-ord** — vi har ~330 av ~800; fyll på `data/vocab.js` (schema klart).
2. **Stroke order** — riktig streckordningsanimation (KanjiVG-data) i stället för spårning.
3. **N4-nivån** — nya datafiler + nivåväljaren aktiveras ([js/screens.js](js/screens.js) `levelbar`).
4. **Ljudinspelning** — låta spelaren säga ordet och jämföra (SpeechRecognition).
5. **Meningsbyggar-övning** — dra ord i rätt ordning (partikelträning i kontext).

## Verifiering

Röktest: `node nihongo-smoke.js` (skript återskapas enkelt — startar `python -m http.server 8144`,
klickar igenom alla moduler headless med Playwright från QISY-frontends node_modules,
samlar console-fel + screenshots).
