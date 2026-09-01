# SESSION — Nihongo Quest

Senast uppdaterad: 2026-09-01 (v3.2 — Läs-stegen + maratonprognos)

## v3.2 — Läs-stegen (comprehensible input)

- **📈 Läs-stegen** ([data/ladder.js](data/ladder.js)): 8 graderade texter som låses upp av
  Ordmaraton-positionen (250/500/750/1000/1500/2000/2500/3000 ord). REGEL: texten för steg N
  använder nästan bara ord ur banans första N + de 334 lektionsorden — verifieras med
  scratchpad-checkern `check_ladder.mjs` (tokeniserar på mellanslag, strippar partiklar/
  böjningar/です-suffix; flaggor granskas manuellt). Håll regeln vid nya/ändrade texter!
- Visas i Läsning-modulen (låsta rader visar kravet) och läses i sagoläsaren
  ([js/reading.js](js/reading.js) `renderStory` hanterar nu STORIES ∪ LADDER_STORIES,
  pixelart-cover via `story.cover`, romaji-startläge från settings.showRomaji).
- **Prognos** ([js/grind.js](js/grind.js) `goalForecast`): ord/dag loggas i S.grind.daily,
  snitt över senaste 7 aktiva dagar → "målet nås ca 11 oktober" på maratonsidan; där syns
  också nästa stegtext med antal ord kvar. Upplåsning ger toast efter rundan.
- 8 pixelart-omslag (img/manga/l1-l8.png) via scratchpad `gen_ladder_art.py` (samma
  palett/sprites som mangapanelerna). 2 nya utmärkelser (Stegläsare / Högst upp på stegen).

## v3.1 — Mangaläsaren

- **Pixelart-paneler**: 16 bilder (4 manga × 4 rutor) i [img/manga/](img/manga/), genererade av
  scratchpad-skriptet `gen_manga_art.py` (PIL, 48×48 → 192px, gemensam palett/sprites —
  katt/barn/hund/regn/säng osv). Panelen visar bilden (object-fit cover, pixelated) med
  lodrät pratbubbla ovanpå; emoji (`p.img`) kvar som fallback om `p.pic` saknas.
- **Infopanel under mangan** ([js/reading.js](js/reading.js)): varje läst ruta visar replikerna
  med 🔊 + tryck-fram-knappar för **romaji** (startläge följer settings.showRomaji) och
  **svenska**; tryck på en redan läst ruta byter infopanelen dit + spelar repliken.
- **Läs- & ordförståelsetest**: efter recap → quiz med innehållsfrågor + ordfrågor
  (`questions` + `vocab` per manga i [data/stories.js](data/stories.js); orddistraktorer
  hämtas ur alla mangors vocab). Stjärnorna sätts nu av quizet (som sagorna), inte av
  läsordningsklicken — felklicken redovisas i resultatdetaljen.

## v3.0 — Ordmaraton & 10 000-ordbanken

- **🎯 Ordmaraton** ([js/grind.js](js/grind.js)): bruteforce-drill rakt igenom en frekvensordnad
  bana på **10 000 ord** — Carls personliga mål är de **3 000 vanligaste** (progressbar + 👑 på hem).
  10 ord/runda: snabbtitt (kanji + klickbara kana-stavelser + romaji + svenska) → drill.
  Alla frågor UTGÅR FRÅN JAPANSKAN (Carls krav): kanji/kana→betydelse, ljud→betydelse,
  läs-och-skriv-uttal (typeQ med promptJP), meningsbygge (tileQ-ramar per ordklass:
  これは〜です / わたしはまいにち〜 / とても〜です). Missade ord → automatiskt in i SRS
  (rätta nya ord belastar INTE repetitionen). Milstolpe-utmärkelser 500→10 000 + dagsuppdrag.
  Position ankras med lastId så banan tål datajusteringar ([js/grind.js](js/grind.js) `syncPos`).
- **Ordbanken** ([data/wordbank.js](data/wordbank.js) + genererade [data/words1.js](data/words1.js)
  (1–3000) / [data/words2.js](data/words2.js) (3001–10000)): byggd av
  **hingston/japanese-frekvenslistan (Leeds-korpus, CC BY) ⋈ JMdict (EDRDG, CC BY-SA 4.0)**.
  Pipeline i scratchpad: `extract.mjs` (join, POS-filter prt/aux/cop/suf, fragment-blocklista
  ます/あり/かも…, uk-preferens för kana-homografer) → 10 översättningsagenter (EN→SV, TSV per
  rank) → `build_words.mjs` (merge + handputsade glosor för toppfunktionsord + N5-ord utan
  frekvensträff placeras SIST i 3000-blocket — banan börjar med äkta frekvensordning).
  Attribution i Inställningar. Kompakt format: `[kanji|0, kana, sv, ordklass, id?]` —
  id delas med lektionsspåret (v_…) när ordet finns där; SRS-progress synkas automatiskt.
- **Romaji-toggle** (S.settings.showRomaji): av/på i Inställningar + snabbknapp i alla
  maratonvyer; gate:ar romaji i ordrader, drillprompts och tileQ:s romaji-rad.
- **Klickbara kana-stavelser** (`kanaSegments` i grind.js): yōon hålls ihop (きゃ),
  っ slås ihop med nästa; tryck = stavelsens ljud, tryck på huvudordet = hela ordet.
- **Röstväljare** ([js/audio.js](js/audio.js)): dropdown med alla ja-röster (rankade:
  Nanami > enhanced/premium > online/natural > Google > Siri), sparas i settings.voiceURI;
  iOS-tips i Inställningar (ladda ner Kyoko förbättrad). Grammatik- + kursquiz fick ljud
  (autouppläsning med paus i luckan, hela meningen vid rätt svar) och facit-läckande
  förklaringsrader döljs tills efter svar (spoiler-detektering i [js/screens.js](js/screens.js)).
- **Research** (2026-08-31): 2000 ord ≈ 80–85 % av engelsk text; japanskt TAL: 2–3k ord ≈ 95 %,
  japansk SKRIFT: 95 % kräver ~9,5–12k (Matsushita VDRJ) — därav 3k-mål (tal) + 10k-bana (läsning).

## v2.6 — Kursen (Genki-spåret)

- **🎓 Kursen** ([js/course.js](js/course.js), [data/course.js](data/course.js)): eget spår som
  följer **Genki I 3:e uppl.** kapitel för kapitel (struktur verifierad mot Carls PDF — TOC L1–L8
  lästa som renderade sidor via pdfjs+Playwright; PDF:en är gitignorad, allt innehåll originalskrivet).
  Kap 1–6 fullt byggda: grammatikpunkter → dialog (replik för replik med TTS/romaji/svenska) →
  drill med nya övningstyper: **tileQ** (meningsbyggare — Genkis mönsterdrill), böjningsdrill
  (typeQ: ます/dåtid/adjektiv/て-form), frågor, och **sifferlyssning** (genererade klockslag med
  よじ/しちじ/くじ + priser med さんびゃく/ろっぴゃく/はっせん-ljudförändringar). Kap 7–12 byggda 2026-08-31 (samma struktur; kortformer, jämförelser, たい, んです m.m. + personräknings-lyssning). Tidigare som
  låsta stubbar ("del 2"). 2 nya utmärkelser. PDF-rendering: scratchpad/genki-render2.js
  (pdfjs i Chromium — @napi-rs/canvas segfaultar på denna maskin).

## v2.1 — Läsning & PWA

- **📖 Läsmodul** ([js/reading.js](js/reading.js), [data/stories.js](data/stories.js)):
  manga-guide (7 steg + ljudordstabell + panelordnings-övning), 4 mini-manga med ordningstvång
  (grid `direction:rtl`, lodräta pratbubblor via `writing-mode:vertical-rl`, tap i läsordning),
  4 graderade sagor (tadoku-stil, sida-för-sida med TTS/romaji/svenska + frågor).
  Japanskan korrekturläst av workflow-agent: noll fel. `sentenceRomaji()` hanterar partikel-は/へ.
- **PWA**: [manifest.webmanifest](manifest.webmanifest) (display:standalone — KRAV för iOS-badge),
  [sw.js](sw.js) (network-first + cache-fallback), ikoner i icons/ (genererade via Playwright).
- **iOS-badge** ([js/badge.js](js/badge.js)): setAppBadge vid visibilitychange/pagehide =
  antal kort due inom 18 h. Kräver notisbehörighet (knapp i Inställningar) + att appen
  läggs till på hemskärmen PÅ NYTT efter denna version (iOS cachar manifestet hårt).
  Schemalagda pushnotiser utan server är OMÖJLIGT på iOS-webben (verifierat 2026-08-30,
  WebKit-källor i workflow-resultatet) — alternativ dokumenterade i Inställningar.

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
| [js/state.js](js/state.js) | Sparfil + SRS (Leitner, 9 boxar) + XP/rank/streak + grind-position |
| [js/audio.js](js/audio.js) | Talsyntes ja-JP: röstranking + användarvald röst (settings.voiceURI) |
| [js/grind.js](js/grind.js) | Ordmaraton: 10k-banan, rundor, ordlista, kana-stavelser, romaji-toggle |
| [data/wordbank.js](data/wordbank.js) | Laddare för words1/words2 (genererade — redigera EJ för hand) |
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
