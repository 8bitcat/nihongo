// Kana-data: hiragana + katakana med svenska mnemonics, grupperade i lektioner.
// Forskningsgrund: mnemonics (visuella minnesbilder) + små grupper om ~5 tecken.

export const HIRAGANA = [
  // rad 1: vokaler
  { k:'あ', r:'a',   m:'En TV-antenn snurrad kring ett kors på taket — "a" som i antenn.' },
  { k:'い', r:'i',   m:'Två istappar sida vid sida — "i" som i is.' },
  { k:'う', r:'u',   m:'Ett ubåtsperiskop som sticker upp ur vattnet — "u" som i ubåt.' },
  { k:'え', r:'e',   m:'En exotisk fågel med lång stjärtfjäder — "e" som i exotisk.' },
  { k:'お', r:'o',   m:'En orm som ringlar runt en pinne, med huvudet utstickande — "o" som i orm.' },
  // rad 2: k
  { k:'か', r:'ka',  m:'En bumerang som just KAstats — med ett litet snöre efter sig.' },
  { k:'き', r:'ki',  m:'En nyckel — "key" på engelska — "ki".' },
  { k:'く', r:'ku',  m:'En fågelnäbb i profil — göken säger "ku-ku".' },
  { k:'け', r:'ke',  m:'Ett KEx som doppas i ett högt glas — "ke" som i kex.' },
  { k:'こ', r:'ko',  m:'Golv och tak i en liten KOja sedd från sidan — "ko".' },
  // rad 3: s
  { k:'さ', r:'sa',  m:'En SAx med öppna skänklar — "sa" som i sax.' },
  { k:'し', r:'shi', m:'En fiskekrok — fisken viskar "shhh…" (shi).' },
  { k:'す', r:'su',  m:'En virvel som SUger ner allt i avloppet — "su" som i suga.' },
  { k:'せ', r:'se',  m:'En gapande mun med en enda tand — den SÄger "se!".' },
  { k:'そ', r:'so',  m:'En sicksack-SÖM från en symaskin — "so" som i söm.' },
  // rad 4: t
  { k:'た', r:'ta',  m:'Ser faktiskt ut som "ta" skrivet med våra bokstäver: t + a!' },
  { k:'ち', r:'chi', m:'En femma (5) med mage — "tji fick du!" (chi).' },
  { k:'つ', r:'tsu', m:'En TSUnami-våg som rullar in — "tsu".' },
  { k:'て', r:'te',  m:'En krokig TEsked — "te" som i te.' },
  { k:'と', r:'to',  m:'En TÅ med en sticka i — aj! — "to" som i tå.' },
  // rad 5: n
  { k:'な', r:'na',  m:'En person som drar åt en knut — "NA, nu sitter den!".' },
  { k:'に', r:'ni',  m:'Ett ben som böjer knät — "knee" på engelska = ni.' },
  { k:'ぬ', r:'nu',  m:'NUdlar som snurrats runt en gaffel — med en ögla på slutet.' },
  { k:'ね', r:'ne',  m:'En katt (neko!) med hoprullad svans — "ne".' },
  { k:'の', r:'no',  m:'En nolla med snedstreck — förbudsskylten säger "NO!".' },
  // rad 6: h
  { k:'は', r:'ha',  m:'Ser ut som ett "H" och ett "a" ihopskrivna — "Ha!".' },
  { k:'ひ', r:'hi',  m:'Ett flinande ansikte i profil — "hi-hi!".' },
  { k:'ふ', r:'fu',  m:'Berget FUji med små moln omkring — "fu".' },
  { k:'へ', r:'he',  m:'En liten kulle — upp och ner, HEla vägen — "he". Lättast av alla!' },
  { k:'ほ', r:'ho',  m:'Som は men med tak — tomten på taket ropar "HO ho ho!".' },
  // rad 7: m
  { k:'ま', r:'ma',  m:'MAmma med en hårknut i nacken — "ma".' },
  { k:'み', r:'mi',  m:'En snurrig rosett — "MIn rosett!" — "mi".' },
  { k:'む', r:'mu',  m:'En ko i profil som säger "MUU!" — med svansen i vädret.' },
  { k:'め', r:'me',  m:'Ett öga — och "me" betyder faktiskt "öga" på japanska!' },
  { k:'も', r:'mo',  m:'En fiskekrok med två MOrmaskar på — "mo".' },
  // rad 8: y + w + n
  { k:'や', r:'ya',  m:'En YAk (oxe) med ett spetsigt horn — "ya".' },
  { k:'ゆ', r:'yu',  m:'En fisk sedd från sidan — "JU vilken fisk!" — "yu".' },
  { k:'よ', r:'yo',  m:'En YO-YO som hänger i sitt snöre — "yo".' },
  // rad 9: r
  { k:'ら', r:'ra',  m:'En RAdioantenn på en liten båt — "ra".' },
  { k:'り', r:'ri',  m:'En flod ("river") som rinner mellan två stränder — "ri".' },
  { k:'る', r:'ru',  m:'En RUtschkana som slutar i en loop — wiii! — "ru".' },
  { k:'れ', r:'re',  m:'En person som gör en REverens (bugar) — "re".' },
  { k:'ろ', r:'ro',  m:'Som る men utan loopen — du glider ut i lugn och RO.' },
  // rad 10: w + n
  { k:'わ', r:'wa',  m:'Som れ men med rund mage — "WA, vilken mage!".' },
  { k:'を', r:'wo',  m:'En surfare i en våg — uttalas "o", används bara som objektpartikel.' },
  { k:'ん', r:'n',   m:'Ser ut som ett litet "n" i skrivstil — enda kanat utan vokal!' },
];

export const KATAKANA = [
  { k:'ア', r:'a',   m:'En kantig antenn — katakana är hiraganas kantiga kusiner.' },
  { k:'イ', r:'i',   m:'En människa i profil som lutar sig mot vinden — "i".' },
  { k:'ウ', r:'u',   m:'Samma ubåtsperiskop som う — men i hårt, kantigt väder.' },
  { k:'エ', r:'e',   m:'En stålbalk från ett bygge (I-balk) — Enkel och stabil — "e".' },
  { k:'オ', r:'o',   m:'En stolpe med en vimpel som sparkar ut — "O-j!".' },
  { k:'カ', r:'ka',  m:'Nästan exakt som か — samma KAstade bumerang, utan snöret.' },
  { k:'キ', r:'ki',  m:'Samma nyckel ("key") som き — bara kantigare.' },
  { k:'ク', r:'ku',  m:'En fågel i profil med näbb — "ku-ku" igen.' },
  { k:'ケ', r:'ke',  m:'Som ク med ett extra streck — en KEps med skärm.' },
  { k:'コ', r:'ko',  m:'Två sidor av en kantig låda — hörnet på en KOffert.' },
  { k:'サ', r:'sa',  m:'SAxen igen — kantig, med två skänklar uppåt.' },
  { k:'シ', r:'shi', m:'Ett leende: strecken LIGGER ner — "shi". (Jämför ツ där de står upp!)' },
  { k:'ス', r:'su',  m:'En skidbacke — du SUsar ner — "su".' },
  { k:'セ', r:'se',  m:'Som せ — munnen med tanden, i kantig version — "se".' },
  { k:'ソ', r:'so',  m:'Ett streck som STÅR upp, som en SOlvisare — "so". (Jämför ン!)' },
  { k:'タ', r:'ta',  m:'Fågeln ク som fått ett öga — "ta-ta!" säger den och flyger.' },
  { k:'チ', r:'chi', m:'En sjua med hatt — "tji fick du!" (chi) igen.' },
  { k:'ツ', r:'tsu', m:'TSUnamin igen: två droppar och strecken STÅR upp. (Jämför シ!)' },
  { k:'テ', r:'te',  m:'En TElefonstolpe med två tvärslåar — "te".' },
  { k:'ト', r:'to',  m:'En TOtempåle med en utstickande pinne — "to".' },
  { k:'ナ', r:'na',  m:'En kniv som hugger snett NEDåt — "NA-mmen!".' },
  { k:'ニ', r:'ni',  m:'Två streck — och "ni" betyder faktiskt TVÅ på japanska!' },
  { k:'ヌ', r:'nu',  m:'NUdlar med ätpinnar i kors — "nu".' },
  { k:'ネ', r:'ne',  m:'Ett kors med en rot — "NEr i jorden".' },
  { k:'ノ', r:'no',  m:'Ett enda snedstreck — "NO, mer behövs inte!".' },
  { k:'ハ', r:'ha',  m:'Två streck som skrattar isär åt varsitt håll — "HA-ha!".' },
  { k:'ヒ', r:'hi',  m:'En karatespark i profil — "HI-ya!".' },
  { k:'フ', r:'fu',  m:'Bara toppen av berget FUji kvar — "fu".' },
  { k:'ヘ', r:'he',  m:'Exakt samma kulle som へ — gratis! — "he".' },
  { k:'ホ', r:'ho',  m:'En julgran med kulor — "HO ho ho!" igen.' },
  { k:'マ', r:'ma',  m:'En vägskylt som pekar snett nedåt — "MA, hitåt!".' },
  { k:'ミ', r:'mi',  m:'Tre ångpuffar från MIsosoppan — "mi".' },
  { k:'ム', r:'mu',  m:'Kossans strut/tratt — "MU!" hörs ur den.' },
  { k:'メ', r:'me',  m:'Ett kryss över ögat — piraten med ögonlapp — "me" (öga).' },
  { k:'モ', r:'mo',  m:'Som も — kroken med MOrmaskarna, kantig version.' },
  { k:'ヤ', r:'ya',  m:'Samma YAk-horn som や — bara vassare.' },
  { k:'ユ', r:'yu',  m:'En U-svängs-skylt — "JU, här svänger vi!" — "yu".' },
  { k:'ヨ', r:'yo',  m:'Ett bakvänt E — YOghurt-hyllan med tre hyllplan.' },
  { k:'ラ', r:'ra',  m:'En RAmp med tak över — "ra".' },
  { k:'リ', r:'ri',  m:'Samma flod ("river") som り — två streck — "ri".' },
  { k:'ル', r:'ru',  m:'En RUtschkana med två ben — "ru".' },
  { k:'レ', r:'re',  m:'En REjäl skidsväng — ett enda hugg — "re".' },
  { k:'ロ', r:'ro',  m:'En fyrkantig mun som ROpar — "RO!".' },
  { k:'ワ', r:'wa',  m:'Ett brett tak — "WA, vilket tak!".' },
  { k:'ヲ', r:'wo',  m:'Sällsynt tecken — uttalas "o". Ett liggande E med snedstreck.' },
  { k:'ン', r:'n',   m:'Slut-N: strecket LIGGER ner — "nnn". (Jämför ソ som står upp!)' },
];

// Dakuten/handakuten genereras ur reglerna — pedagogiskt bättre än 25 nya mnemonics.
const DAKUTEN_MAP = [
  ['か','が','k → g'], ['き','ぎ','k → g'], ['く','ぐ','k → g'], ['け','げ','k → g'], ['こ','ご','k → g'],
  ['さ','ざ','s → z'], ['し','じ','shi → ji'], ['す','ず','s → z'], ['せ','ぜ','s → z'], ['そ','ぞ','s → z'],
  ['た','だ','t → d'], ['ち','ぢ','chi → ji (ovanlig)'], ['つ','づ','tsu → zu (ovanlig)'], ['て','で','t → d'], ['と','ど','t → d'],
  ['は','ば','h → b'], ['ひ','び','h → b'], ['ふ','ぶ','h → b'], ['へ','べ','h → b'], ['ほ','ぼ','h → b'],
];
const HANDAKUTEN_MAP = [
  ['は','ぱ','h → p'], ['ひ','ぴ','h → p'], ['ふ','ぷ','h → p'], ['へ','ぺ','h → p'], ['ほ','ぽ','h → p'],
];

import { kanaToRomaji, hiraToKata } from '../js/kanaUtils.js';

function dakutenEntries(map, script, mark, markName) {
  return map.map(([base, voiced, rule]) => {
    const b = script === 'kata' ? hiraToKata(base) : base;
    const v = script === 'kata' ? hiraToKata(voiced) : voiced;
    return { k: v, r: kanaToRomaji(v), m: `${b} + ${mark} (${markName}) = ${v}. Regeln: ${rule}.` };
  });
}

const YOON_BASES_H = ['き','ぎ','し','じ','ち','に','ひ','び','ぴ','み','り'];
function yoonEntries(script) {
  const out = [];
  for (const baseH of YOON_BASES_H) {
    for (const small of ['ゃ','ゅ','ょ']) {
      const hira = baseH + small;
      const k = script === 'kata' ? hiraToKata(hira) : hira;
      out.push({ k, r: kanaToRomaji(k), m: `${script === 'kata' ? hiraToKata(baseH) : baseH} + litet ${script === 'kata' ? hiraToKata(small) : small} smälter ihop till en stavelse: "${kanaToRomaji(k)}".` });
    }
  }
  return out;
}

function slice(arr, from, to) { return arr.slice(from, to); }

// Lektionsstruktur: ~5 tecken per lektion (forskning: små grupper + repetition).
export const KANA_LESSONS = [
  // Hiragana bas
  { id:'hira-1',  script:'hira', title:'Vokalerna あいうえお', chars: slice(HIRAGANA, 0, 5) },
  { id:'hira-2',  script:'hira', title:'K-raden かきくけこ',   chars: slice(HIRAGANA, 5, 10) },
  { id:'hira-3',  script:'hira', title:'S-raden さしすせそ',   chars: slice(HIRAGANA, 10, 15) },
  { id:'hira-4',  script:'hira', title:'T-raden たちつてと',   chars: slice(HIRAGANA, 15, 20) },
  { id:'hira-5',  script:'hira', title:'N-raden なにぬねの',   chars: slice(HIRAGANA, 20, 25) },
  { id:'hira-6',  script:'hira', title:'H-raden はひふへほ',   chars: slice(HIRAGANA, 25, 30) },
  { id:'hira-7',  script:'hira', title:'M-raden まみむめも',   chars: slice(HIRAGANA, 30, 35) },
  { id:'hira-8',  script:'hira', title:'Y- och R-raden やゆよらりるれろ', chars: slice(HIRAGANA, 35, 43) },
  { id:'hira-9',  script:'hira', title:'わ・を・ん — sista tre!', chars: slice(HIRAGANA, 43, 46) },
  { id:'hira-daku-1', script:'hira', title:'Tenten: が・ざ・だ-raderna',
    intro: 'Två små streck (゛dakuten) gör ljudet tonande: k→g, s→z, t→d. Inga nya former att lära — bara regeln!',
    chars: dakutenEntries(DAKUTEN_MAP.slice(0, 15), 'hira', '゛', 'tenten') },
  { id:'hira-daku-2', script:'hira', title:'Tenten & maru: ば・ぱ-raderna',
    intro: 'は-raden med ゛blir B (ば) och med en liten ring ゜(handakuten) blir P (ぱ).',
    chars: dakutenEntries([...DAKUTEN_MAP.slice(15), ...HANDAKUTEN_MAP], 'hira', '゛/゜', 'tenten/maru') },
  { id:'hira-yoon-1', script:'hira', title:'Kombinationer 1: きゃ・しゃ・ちゃ…',
    intro: 'Ett i-kana + litet ゃゅょ = EN stavelse: き+ゃ = きゃ (kya). Jämför: きや (kiya, två stavelser) ≠ きゃ (kya, en).',
    chars: yoonEntries('hira').filter((_, i) => i < 18) },
  { id:'hira-yoon-2', script:'hira', title:'Kombinationer 2: にゃ・ひゃ・りゃ…',
    chars: yoonEntries('hira').filter((_, i) => i >= 18) },
  { id:'hira-rules', script:'hira', title:'Litet っ & långa vokaler',
    intro: 'Litet っ = kort paus/dubbel konsonant: きって (kitte, frimärke). Lång vokal skrivs med extra vokal: おかあさん (okaasan). O-ljud förlängs oftast med う: ありがとう (arigatou).',
    words: [
      { k:'きって', sv:'frimärke' }, { k:'ざっし', sv:'tidskrift' }, { k:'がっこう', sv:'skola' },
      { k:'きっぷ', sv:'biljett' }, { k:'おかあさん', sv:'mamma' }, { k:'おとうさん', sv:'pappa' },
      { k:'ちょっと', sv:'lite grann' }, { k:'ゆっくり', sv:'långsamt' },
    ] },
  // Katakana
  { id:'kata-1',  script:'kata', title:'Vokalerna アイウエオ', chars: slice(KATAKANA, 0, 5) },
  { id:'kata-2',  script:'kata', title:'K-raden カキクケコ',   chars: slice(KATAKANA, 5, 10) },
  { id:'kata-3',  script:'kata', title:'S-raden サシスセソ',   chars: slice(KATAKANA, 10, 15) },
  { id:'kata-4',  script:'kata', title:'T-raden タチツテト',   chars: slice(KATAKANA, 15, 20) },
  { id:'kata-5',  script:'kata', title:'N-raden ナニヌネノ',   chars: slice(KATAKANA, 20, 25) },
  { id:'kata-6',  script:'kata', title:'H-raden ハヒフヘホ',   chars: slice(KATAKANA, 25, 30) },
  { id:'kata-7',  script:'kata', title:'M-raden マミムメモ',   chars: slice(KATAKANA, 30, 35) },
  { id:'kata-8',  script:'kata', title:'Y- och R-raden ヤユヨラリルレロ', chars: slice(KATAKANA, 35, 43) },
  { id:'kata-9',  script:'kata', title:'ワ・ヲ・ン — och förväxlingarna!',
    intro: 'Grattis — snart hela katakana! Extra koll på förväxlingsparen: シ/ツ och ソ/ン. シ och ン: strecken ligger ner. ツ och ソ: strecken står upp.',
    chars: slice(KATAKANA, 43, 46) },
  { id:'kata-daku', script:'kata', title:'Tenten & maru i katakana',
    intro: 'Samma regel som i hiragana: ゛gör K→G, S→Z, T→D, H→B och ゜gör H→P.',
    chars: dakutenEntries([...DAKUTEN_MAP, ...HANDAKUTEN_MAP], 'kata', '゛/゜', 'tenten/maru').filter((_, i) => i % 2 === 0) },
  { id:'kata-yoon', script:'kata', title:'Kombinationer & långstreck ー',
    intro: 'Katakana förlänger vokaler med ett streck: コーヒー (koohii, kaffe). Kombinationer funkar som i hiragana: シャ (sha), チョ (cho), ジャ (ja).',
    chars: yoonEntries('kata').filter((_, i) => i >= 6 && i <= 14), // シャ〜チョ — vanligast i lånord
    words: [
      { k:'コーヒー', sv:'kaffe' }, { k:'ジュース', sv:'juice' }, { k:'シャワー', sv:'dusch' },
      { k:'チョコレート', sv:'choklad' }, { k:'シャツ', sv:'skjorta' }, { k:'ニュース', sv:'nyheter' },
    ] },
];

export function kanaLessonsFor(script) {
  return KANA_LESSONS.filter(l => l.script === script);
}

// Alla inlärningsbara kana-tecken (för SRS + tabellvyer)
export function allKanaItems() {
  const items = [];
  for (const lesson of KANA_LESSONS) {
    for (const ch of (lesson.chars || [])) {
      items.push({ id: 'k_' + ch.k, type: 'kana', ...ch, lesson: lesson.id, script: lesson.script });
    }
  }
  return items;
}
