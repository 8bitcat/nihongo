// stories — manga i rutor (läses höger→vänster!) + graderade sagor (tadoku-stil, N5-nivå).
// Manga-panelerna ligger i LÄSordning i arrayen; grid med direction:rtl lägger ruta 1 uppe till höger.

export const ONOMATOPOEIA = [
  { jp:'ドキドキ', romaji:'dokidoki', sv:'hjärtat bultar (nervös, kär)' },
  { jp:'ペコペコ', romaji:'pekopeko', sv:'jättehungrig (magen kurrar)' },
  { jp:'ザーザー', romaji:'zaazaa', sv:'ösregn' },
  { jp:'グーグー', romaji:'guuguu', sv:'snarkningar (djup sömn)' },
  { jp:'ジリリリ', romaji:'jiririri', sv:'väckarklockan ringer' },
  { jp:'ニコニコ', romaji:'nikoniko', sv:'ler stort och glatt' },
  { jp:'シーン', romaji:'shiin', sv:'total tystnad' },
  { jp:'ゴロゴロ', romaji:'gorogoro', sv:'muller (åska) / latar sig' },
];

export const MANGA = [
  { id:'manga-1', title:'ネコと さかな', titleSv:'Katten och fisken', emoji:'🐱',
    panels: [
      { img:'🐱', pic:'img/manga/m1-1.png', lines:[{ jp:'おなかが すいた…', sv:'Jag är hungrig…' }] },
      { img:'🐱👀🐟', pic:'img/manga/m1-2.png', lines:[{ jp:'あ！さかな！', sv:'Åh! En fisk!' }] },
      { img:'🐱💨🐟', pic:'img/manga/m1-3.png', sfx:{ jp:'ダッ！', sv:'(spurt!)' }, lines:[{ jp:'まって～！', sv:'Vänta!' }] },
      { img:'🌊🐟 🐱💧', pic:'img/manga/m1-4.png', sfx:{ jp:'ポチャン', sv:'(plums)' }, lines:[{ jp:'ざんねん…', sv:'Synd…' }] },
    ],
    vocab: [
      { jp:'おなかが すいた', sv:'jag är hungrig' },
      { jp:'さかな', sv:'fisk' },
      { jp:'まって', sv:'vänta!' },
      { jp:'ざんねん', sv:'synd / tråkigt' },
    ],
    questions: [
      { q:'Varför jagar katten fisken?', opts:['Den är hungrig','Den vill leka','Den är arg','Den är uttråkad'], correct:0 },
      { q:'ネコは さかなを たべましたか。 — Fick katten fisken?', opts:['Nej — fisken hoppade i vattnet','Ja, den åt upp den','Fisken flög iväg','En hund tog den'], correct:0 },
    ]},
  { id:'manga-2', title:'あめの ひ', titleSv:'Regndagen', emoji:'🌧️',
    panels: [
      { img:'👦☀️', pic:'img/manga/m2-1.png', lines:[{ jp:'いい てんきですね。', sv:'Vilket fint väder!' }] },
      { img:'👦☁️☁️', pic:'img/manga/m2-2.png', lines:[{ jp:'あれ？くもが きました。', sv:'Va? Det kom moln.' }] },
      { img:'👦💦🌧️', pic:'img/manga/m2-3.png', sfx:{ jp:'ザーザー', sv:'(ösregn)' }, lines:[{ jp:'あめだ！かさが ありません！', sv:'Regn! Jag har inget paraply!' }] },
      { img:'👦🏃🏠', pic:'img/manga/m2-4.png', sfx:{ jp:'ダッシュ！', sv:'(rusning!)' }, lines:[{ jp:'はしって、うちに かえりました！', sv:'Jag sprang hem!' }] },
    ],
    vocab: [
      { jp:'てんき', sv:'väder' },
      { jp:'くも', sv:'moln' },
      { jp:'あめ', sv:'regn' },
      { jp:'かさ', sv:'paraply' },
      { jp:'かえりました', sv:'åkte/gick hem' },
    ],
    questions: [
      { q:'Hur var vädret i början?', opts:['Soligt och fint','Regnigt','Snöigt','Blåsigt'], correct:0 },
      { q:'かさが ありますか。 — Hade pojken ett paraply?', opts:['Nej, inget paraply','Ja, ett rött','Ja, men trasigt','Han lånade ett'], correct:0 },
      { q:'Vad gjorde pojken till slut?', opts:['Sprang hem','Väntade under ett träd','Köpte ett paraply','Blev kvar i regnet'], correct:0 },
    ]},
  { id:'manga-3', title:'テストの ひ', titleSv:'Provdagen', emoji:'💯',
    panels: [
      { img:'👦📖🌙', pic:'img/manga/m3-1.png', lines:[{ jp:'あしたは テストです。べんきょうします。', sv:'Imorgon är det prov. Jag pluggar.' }] },
      { img:'👦💤', pic:'img/manga/m3-2.png', sfx:{ jp:'グーグー', sv:'(snark)' }, lines:[{ jp:'ねむい… ちょっとだけ…', sv:'Sömnig… bara en liten stund…' }] },
      { img:'⏰😱', pic:'img/manga/m3-3.png', sfx:{ jp:'ジリリリ！', sv:'(väckarklockan!)' }, lines:[{ jp:'あさだ！テストだ！', sv:'Det är morgon! Provet!' }] },
      { img:'👦✏️💯', pic:'img/manga/m3-4.png', sfx:{ jp:'ニコニコ', sv:'(stort leende)' }, lines:[{ jp:'でも、だいじょうぶでした。ひゃくてんです！', sv:'Men det gick bra. Hundra poäng!' }] },
    ],
    vocab: [
      { jp:'テスト', sv:'prov / test' },
      { jp:'べんきょうします', sv:'pluggar / studerar' },
      { jp:'ねむい', sv:'sömnig' },
      { jp:'あさ', sv:'morgon' },
      { jp:'ひゃくてん', sv:'hundra poäng' },
    ],
    questions: [
      { q:'Varför pluggar pojken på kvällen?', opts:['Det är prov imorgon','Han har läxa','Han gillar böcker','Mamma sa till honom'], correct:0 },
      { q:'Vad hände medan han pluggade?', opts:['Han somnade','Han såg på TV','Han åt middag','Strömmen gick'], correct:0 },
      { q:'テストは どうでしたか。 — Hur gick provet?', opts:['Hundra poäng!','Han kom försent','Han missade det','Femtio poäng'], correct:0 },
    ]},
  { id:'manga-4', title:'プレゼント', titleSv:'Presenten', emoji:'🎁',
    panels: [
      { img:'👧🎁', pic:'img/manga/m4-1.png', lines:[{ jp:'これは なんですか。', sv:'Vad är det här?' }] },
      { img:'👧🤔', pic:'img/manga/m4-2.png', lines:[{ jp:'おおきいですね。だれの ですか。', sv:'Vad stor den är. Vems är den?' }] },
      { img:'👧📦🐶', pic:'img/manga/m4-3.png', sfx:{ jp:'ワン！', sv:'(voff!)' }, lines:[{ jp:'いぬです！', sv:'En hund!' }] },
      { img:'👧❤️🐶', pic:'img/manga/m4-4.png', sfx:{ jp:'ドキドキ', sv:'(hjärtat bultar)' }, lines:[{ jp:'ありがとう、おかあさん！', sv:'Tack, mamma!' }] },
    ],
    vocab: [
      { jp:'これ', sv:'den här / det här' },
      { jp:'おおきい', sv:'stor' },
      { jp:'だれの', sv:'vems?' },
      { jp:'いぬ', sv:'hund' },
      { jp:'ありがとう', sv:'tack' },
    ],
    questions: [
      { q:'これは なんですか。 — Vad undrar flickan?', opts:['Vad presenten är','Var hunden är','När det är fest','Vem som kommer'], correct:0 },
      { q:'Vad fanns i lådan?', opts:['En hund','En katt','En docka','En bok'], correct:0 },
      { q:'Vem var presenten från?', opts:['Mamma','Pappa','En kompis','Läraren'], correct:0 },
    ]},
];

export const STORIES = [
  { id:'story-1', title:'ねこの モモ', titleSv:'Katten Momo', emoji:'🐈', level:'Lätt',
    pages: [
      { img:'🐈', jp:'モモは ねこです。しろくて、ちいさいです。', sv:'Momo är en katt. Hon är vit och liten.' },
      { img:'🐈🐟', jp:'モモは さかなが だいすきです。', sv:'Momo älskar fisk.' },
      { img:'🐈🌳', jp:'きょう、モモは こうえんに いきました。', sv:'Idag gick Momo till parken.' },
      { img:'🐈🐦', jp:'こうえんで とりを みました。', sv:'I parken såg hon en fågel.' },
      { img:'🐦💨', jp:'とりは とんで いきました。ざんねん！', sv:'Fågeln flög iväg. Synd!' },
      { img:'🐈🏠🐟', jp:'モモは うちに かえりました。そして、さかなを たべました。', sv:'Momo gick hem. Och så åt hon fisk.' },
    ],
    questions: [
      { q:'モモは なにが だいすきですか。 — Vad älskar Momo?', opts:['Fisk','Fåglar','Mjölk','Parken'], correct:0 },
      { q:'モモは どこに いきましたか。 — Vart gick Momo?', opts:['Till parken','Till skolan','Till affären','Till stationen'], correct:0 },
      { q:'こうえんで なにを みましたか。 — Vad såg hon i parken?', opts:['En fågel','En hund','En fisk','Ett barn'], correct:0 },
    ]},
  { id:'story-2', title:'あさの ケン', titleSv:'Kens morgon', emoji:'🌅', level:'Lätt',
    pages: [
      { img:'🛏️⏰', jp:'ケンは まいあさ しちじに おきます。', sv:'Ken går upp klockan sju varje morgon.' },
      { img:'🍞🥛', jp:'あさごはんに パンを たべて、ぎゅうにゅうを のみます。', sv:'Till frukost äter han bröd och dricker mjölk.' },
      { img:'🚃🏫', jp:'はちじに でんしゃで がっこうに いきます。', sv:'Klockan åtta åker han tåg till skolan.' },
      { img:'📖🇯🇵', jp:'がっこうで にほんごを べんきょうします。たのしいです。', sv:'I skolan pluggar han japanska. Det är kul.' },
      { img:'📚🌙', jp:'よる、ケンは ほんを よみます。じゅうじに ねます。', sv:'På kvällen läser Ken en bok. Han lägger sig klockan tio.' },
    ],
    questions: [
      { q:'ケンは なんじに おきますか。 — När går Ken upp?', opts:['Klockan 7','Klockan 8','Klockan 6','Klockan 10'], correct:0 },
      { q:'なにで がっこうに いきますか。 — Hur tar han sig till skolan?', opts:['Med tåg','Med buss','Med cykel','Han går'], correct:0 },
      { q:'よる、なにを しますか。 — Vad gör han på kvällen?', opts:['Läser en bok','Ser på TV','Spelar spel','Pluggar'], correct:0 },
    ]},
  { id:'story-3', title:'はらぺこの くま', titleSv:'Den hungriga björnen', emoji:'🐻', level:'Lätt',
    pages: [
      { img:'🐻', jp:'くまの ブンは おなかが すきました。ペコペコです。', sv:'Björnen Bun är hungrig. Magen kurrar.' },
      { img:'🐻🌲🍎', jp:'ブンは もりで りんごを みつけました。ひとつ、ふたつ、みっつ！', sv:'Bun hittade äpplen i skogen. Ett, två, tre!' },
      { img:'🍎🌳⬆️', jp:'でも、りんごは たかい きの うえに あります。', sv:'Men äpplena sitter högt uppe i trädet.' },
      { img:'🐻🌳💦', jp:'ブンは きに のぼりました。よいしょ、よいしょ。', sv:'Bun klättrade upp i trädet. Hopp och hej!' },
      { img:'🐻💥', jp:'あ！ブンは おちました。ドスン！', sv:'Åh! Bun ramlade ner. DUNS!' },
      { img:'🐻🍎😋', jp:'でも、だいじょうぶ。りんごも おちました！ブンは りんごを たべました。おいしい！', sv:'Men det gick bra. Äpplena ramlade också ner! Bun åt äpplena. Mums!' },
    ],
    questions: [
      { q:'ブンは なにを みつけましたか。 — Vad hittade Bun?', opts:['Äpplen','Fisk','Honung','Bär'], correct:0 },
      { q:'りんごは どこに ありましたか。 — Var satt äpplena?', opts:['Uppe i trädet','På marken','I vattnet','I en korg'], correct:0 },
      { q:'Hur slutar sagan?', opts:['Bun äter äpplena','Bun går hungrig hem','En fågel tar äpplena','Bun somnar'], correct:0 },
    ]},
  { id:'story-4', title:'ももたろう', titleSv:'Momotarō (folksaga)', emoji:'🍑', level:'Medel',
    pages: [
      { img:'👴👵', jp:'むかしむかし、おじいさんと おばあさんが いました。', sv:'Det var en gång en gammal man och en gammal kvinna.' },
      { img:'👵🏞️🍑', jp:'おばあさんは かわで おおきい ももを みつけました。', sv:'Den gamla kvinnan hittade en stor persika i floden.' },
      { img:'🍑👶✨', jp:'ももの なかから おとこのこが でました！なまえは ももたろうです。', sv:'Ur persikan kom en pojke! Han fick namnet Momotarō.' },
      { img:'💪🧒', jp:'ももたろうは おおきく なりました。とても つよいです。', sv:'Momotarō växte upp. Han är väldigt stark.' },
      { img:'🐶🐵🐦', jp:'ももたろうは いぬと さると きじと ともだちに なりました。', sv:'Momotarō blev vän med en hund, en apa och en fasan.' },
      { img:'⛵👹', jp:'みんなで おにの しまに いきました。', sv:'Tillsammans åkte de till demonernas ö.' },
      { img:'⚔️👹💥', jp:'ももたろうと ともだちは おにと たたかいました。そして、かちました！', sv:'Momotarō och hans vänner slogs mot demonerna. Och de vann!' },
      { img:'🏠🎉', jp:'みんなで うちに かえりました。めでたし、めでたし！', sv:'Alla återvände hem. Snipp snapp snut, så var sagan slut!' },
    ],
    questions: [
      { q:'ももたろうは どこから でましたか。 — Varifrån kom Momotarō?', opts:['Ur en persika','Ur ett ägg','Ur floden','Ur berget'], correct:0 },
      { q:'Vilka blev hans vänner?', opts:['Hund, apa och fasan','Katt, hund och mus','Björn, räv och hare','Drake, orm och tiger'], correct:0 },
      { q:'おには どこに いますか。 — Var finns demonerna?', opts:['På en ö','I skogen','I bergen','I staden'], correct:0 },
    ]},
];
