// kanaUtils — konvertering kana↔romaji.
// romajiToKana fungerar som en enkel IME: både Hepburn (shi) och Kunrei (si) accepteras.

const HIRA_TO_ROMAJI = {
  'あ':'a','い':'i','う':'u','え':'e','お':'o',
  'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
  'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
  'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
  'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
  'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
  'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
  'や':'ya','ゆ':'yu','よ':'yo',
  'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
  'わ':'wa','を':'wo','ん':'n',
  'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
  'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
  'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do',
  'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
  'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
  'ぁ':'a','ぃ':'i','ぅ':'u','ぇ':'e','ぉ':'o',
};
const YOON_SMALL = { 'ゃ':'ya','ゅ':'yu','ょ':'yo' };

// Katakana → hiragana (kodpunktsskifte 0x60 för ァ..ヶ)
export function kataToHira(s) {
  let out = '';
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c >= 0x30A1 && c <= 0x30F6) out += String.fromCodePoint(c - 0x60);
    else out += ch;
  }
  return out;
}
export function hiraToKata(s) {
  let out = '';
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c >= 0x3041 && c <= 0x3096) out += String.fromCodePoint(c + 0x60);
    else out += ch;
  }
  return out;
}

// Kana (hira eller kata, får innehålla ー och っ/ッ) → Hepburn-romaji
export function kanaToRomaji(kana) {
  const s = kataToHira(kana);
  let out = '';
  let smallTsu = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === 'っ') { smallTsu = true; continue; }
    if (ch === 'ー') { out += out.match(/[aiueo]$/) ? out.slice(-1) : ''; continue; }
    let syl = HIRA_TO_ROMAJI[ch];
    if (syl === undefined) { out += ch; continue; }
    const next = s[i + 1];
    if (next && YOON_SMALL[next]) {
      const y = YOON_SMALL[next];
      if (syl === 'shi') syl = 'sh' + y.slice(1);       // しゃ→sha
      else if (syl === 'chi') syl = 'ch' + y.slice(1);  // ちゃ→cha
      else if (syl === 'ji') syl = 'j' + y.slice(1);    // じゃ→ja
      else syl = syl[0] + y;                            // きゃ→kya
      i++;
    }
    if (smallTsu) { out += syl[0] === 'c' ? 't' : syl[0]; smallTsu = false; }
    // ん före vokal/y: n' i strikt Hepburn — vi skriver bara n (enklare för nybörjare)
    out += syl;
  }
  return out;
}

// Romaji → hiragana (IME-stil). Accepterar Hepburn & Kunrei-varianter.
const ROMAJI_TABLE = {};
{
  const base = {
    a:'あ', i:'い', u:'う', e:'え', o:'お',
    ka:'か', ki:'き', ku:'く', ke:'け', ko:'こ',
    sa:'さ', shi:'し', si:'し', su:'す', se:'せ', so:'そ',
    ta:'た', chi:'ち', ti:'ち', tsu:'つ', tu:'つ', te:'て', to:'と',
    na:'な', ni:'に', nu:'ぬ', ne:'ね', no:'の',
    ha:'は', hi:'ひ', fu:'ふ', hu:'ふ', he:'へ', ho:'ほ',
    ma:'ま', mi:'み', mu:'む', me:'め', mo:'も',
    ya:'や', yu:'ゆ', yo:'よ',
    ra:'ら', ri:'り', ru:'る', re:'れ', ro:'ろ',
    wa:'わ', wo:'を',
    ga:'が', gi:'ぎ', gu:'ぐ', ge:'げ', go:'ご',
    za:'ざ', ji:'じ', zi:'じ', zu:'ず', ze:'ぜ', zo:'ぞ',
    da:'だ', di:'ぢ', du:'づ', de:'で', do:'ど',
    ba:'ば', bi:'び', bu:'ぶ', be:'べ', bo:'ぼ',
    pa:'ぱ', pi:'ぴ', pu:'ぷ', pe:'ぺ', po:'ぽ',
  };
  Object.assign(ROMAJI_TABLE, base);
  // Yōon: kya, sha/sya, cha/tya, ja/jya/zya, osv.
  const yoonBases = {
    ky:'き', gy:'ぎ', ny:'に', hy:'ひ', by:'び', py:'ぴ', my:'み', ry:'り',
  };
  for (const [pre, kana] of Object.entries(yoonBases)) {
    ROMAJI_TABLE[pre + 'a'] = kana + 'ゃ';
    ROMAJI_TABLE[pre + 'u'] = kana + 'ゅ';
    ROMAJI_TABLE[pre + 'o'] = kana + 'ょ';
  }
  for (const [pre, kana] of Object.entries({ sh:'し', sy:'し', ch:'ち', ty:'ち', j:'じ', jy:'じ', zy:'じ' })) {
    ROMAJI_TABLE[pre + 'a'] = kana + 'ゃ';
    ROMAJI_TABLE[pre + 'u'] = kana + 'ゅ';
    ROMAJI_TABLE[pre + 'o'] = kana + 'ょ';
  }
}

export function romajiToKana(input) {
  let s = input.toLowerCase().trim().replace(/[^a-z'-]/g, '');
  let out = '';
  while (s.length > 0) {
    // ん: "nn", "n'" eller n före konsonant (ej y) / i slutet
    if (s[0] === 'n') {
      if (s.startsWith('nn')) { out += 'ん'; s = s.slice(2); continue; }
      if (s.startsWith("n'")) { out += 'ん'; s = s.slice(2); continue; }
      if (s.length === 1) { out += 'ん'; s = ''; continue; }
      if (!'aiueoy'.includes(s[1])) { out += 'ん'; s = s.slice(1); continue; }
    }
    // Dubbel konsonant → っ (utom nn som tagits ovan)
    if (s.length >= 2 && s[0] === s[1] && !'aiueon'.includes(s[0])) {
      out += 'っ'; s = s.slice(1); continue;
    }
    if (s.startsWith('tch')) { out += 'っ'; s = s.slice(1); continue; } // matcha → まっちゃ
    if (s[0] === '-') { out += 'ー'; s = s.slice(1); continue; }
    let matched = false;
    for (let len = Math.min(3, s.length); len >= 1; len--) {
      const chunk = s.slice(0, len);
      if (ROMAJI_TABLE[chunk]) { out += ROMAJI_TABLE[chunk]; s = s.slice(len); matched = true; break; }
    }
    if (!matched) { out += s[0]; s = s.slice(1); } // okänt tecken passerar (ger fel vid jämförelse)
  }
  return out;
}

// Jämför användarens romaji-inmatning mot mål-kana (hira eller kata).
export function romajiMatchesKana(input, targetKana) {
  const target = kataToHira(targetKana).replace(/ー/g, '');
  let typed = romajiToKana(input);
  if (typed === kataToHira(targetKana)) return true;
  // Långt vokalstreck: acceptera att användaren skrivit vokalen dubbelt (koohii → コーヒー)
  const t2 = kataToHira(targetKana);
  let expanded = '';
  for (let i = 0; i < t2.length; i++) {
    if (t2[i] === 'ー') {
      const prev = expanded.slice(-1);
      const r = HIRA_TO_ROMAJI[prev] || '';
      const vowel = r.slice(-1);
      expanded += ({ a:'あ', i:'い', u:'う', e:'え', o:'う' })[vowel] || '';
      // o-ljud förlängs oftast med う men acceptera お också nedan
    } else expanded += t2[i];
  }
  if (typed === expanded) return true;
  if (typed === expanded.replace(/う/g, 'お')) return true;
  return typed === target;
}

// Romaji för hela meningar: partiklarna は/へ uttalas wa/e — texterna har mellanslag
// mellan fraser, så partikeln står alltid sist i sitt ord.
export function sentenceRomaji(jp) {
  const fixed = jp
    .replace(/は(?=[\s、。！？!?～]|$)/g, 'わ')
    .replace(/へ(?=[\s、。！？!?～]|$)/g, 'え');
  return kanaToRomaji(fixed);
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function pick(arr, n) { return shuffle(arr).slice(0, n); }
export function randInt(n) { return Math.floor(Math.random() * n); }
