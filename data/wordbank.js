// Ordbanken för Ordmaraton — 10 000 vanligaste orden i frekvensordning.
// Genererad från JMdict (EDRDG, CC BY-SA 4.0) ⋈ Leeds-korpusens frekvenslista (CC BY).
// Kompakt format i words1/words2: [kanji|0, kana, svenska, ordklass, id?]
// Ordklass: n=substantiv v=verb a=i-adj na=na-adj adv=adverb x=uttryck/övrigt.
// id anges bara när ordet delar id med lektionsspåret (v_…) — annars härleds w_<kana>_<kanji|x>.
// OBS: banan är append/replace-känslig — grind.js ankrar positionen med lastId vid ändringar.

import { W1 } from './words1.js';
import { W2 } from './words2.js';

export const WORD_GOAL = 3000;

export const WORDS = [...W1, ...W2].map((a, i) => ({
  r: i + 1,
  kanji: a[0] || null,
  kana: a[1],
  sv: a[2],
  p: a[3],
  id: a[4] || 'w_' + a[1] + '_' + (a[0] || 'x'),
}));
