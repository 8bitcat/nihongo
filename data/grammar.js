// Grammatik JLPT N5 — förklaringar på svenska, exempel med ljud, cloze-quiz.
// Även läspassager + hörförståelsebank för provläget.

export const GRAMMAR_LESSONS = [
  { id:'gram-1', title:'です・は・か — "X är Y"', points: [
    { title:'AはBです — A är B', expl:'は (uttalas "wa" som partikel!) markerar samtalsämnet. です är artigt "är". Ordföljd: [ämne]は [beskrivning]です.',
      examples: [
        { jp:'わたしは カールです。', sv:'Jag är/heter Carl.' },
        { jp:'これは ほんです。', sv:'Det här är en bok.' },
        { jp:'ねこは かわいいです。', sv:'Katter är söta.' },
      ]},
    { title:'か — frågepartikeln', expl:'Lägg か sist i meningen så blir den en fråga. Inget frågetecken behövs, men vi använder det ofta ändå.',
      examples: [
        { jp:'あなたは がくせいですか。', sv:'Är du studerande?' },
        { jp:'これは なんですか。', sv:'Vad är det här?' },
      ]},
    { title:'じゃないです — "är inte"', expl:'Negation av です: じゃないです (eller artigare ではありません).',
      examples: [
        { jp:'わたしは にほんじんじゃないです。', sv:'Jag är inte japan.' },
      ]},
  ], quiz: [
    { q:'わたし___ スウェーデンじんです。', opts:['は','を','か','の'], correct:0, sv:'Jag är svensk.' },
    { q:'これは ほんです___。', opts:['か','は','を','も'], correct:0, sv:'Är det här en bok?' },
    { q:'"Jag är inte lärare" = わたしは せんせい___です。', opts:['じゃない','は','です','か'], correct:0, sv:'' },
    { q:'Hur uttalas partikeln は?', opts:['wa','ha','ba','pa'], correct:0, sv:'Som partikel uttalas は alltid "wa".' },
  ]},
  { id:'gram-2', title:'を・が — objekt & subjekt', points: [
    { title:'を — objektpartikeln', expl:'を (uttalas "o") sätts efter det som verbet görs MED: パンを たべます = jag äter bröd.',
      examples: [
        { jp:'みずを のみます。', sv:'Jag dricker vatten.' },
        { jp:'テレビを みます。', sv:'Jag tittar på TV.' },
      ]},
    { title:'が — subjekt & "gillar/kan"', expl:'が pekar ut VAD/VEM. Används med すき (gillar), わかる (förstår), あります/います (finns).',
      examples: [
        { jp:'すしが すきです。', sv:'Jag gillar sushi.' },
        { jp:'にほんごが わかります。', sv:'Jag förstår japanska.' },
      ]},
  ], quiz: [
    { q:'コーヒー___ のみます。', opts:['を','が','は','に'], correct:0, sv:'Jag dricker kaffe.' },
    { q:'ねこ___ すきです。', opts:['が','を','へ','か'], correct:0, sv:'Jag gillar katter.' },
    { q:'ほん___ よみます。', opts:['を','が','も','で'], correct:0, sv:'Jag läser en bok.' },
    { q:'にほんご___ わかりますか。', opts:['が','を','の','へ'], correct:0, sv:'Förstår du japanska?' },
  ]},
  { id:'gram-3', title:'に・で・へ — plats & riktning', points: [
    { title:'に — mål, tidpunkt & plats (finnas)', expl:'に = "till/i/vid": mål för rörelse (がっこうに いきます), klockslag (しちじに), plats där något FINNS.',
      examples: [
        { jp:'がっこうに いきます。', sv:'Jag går till skolan.' },
        { jp:'しちじに おきます。', sv:'Jag går upp klockan sju.' },
      ]},
    { title:'で — plats för aktivitet & medel', expl:'で = "i/på/med": platsen där något GÖRS (こうえんで あそぶ) eller medlet (でんしゃで = med tåg).',
      examples: [
        { jp:'レストランで たべます。', sv:'Jag äter på restaurang.' },
        { jp:'バスで いきます。', sv:'Jag åker (dit) med buss.' },
      ]},
    { title:'へ — riktning', expl:'へ (uttalas "e") = "mot/till", nästan utbytbar mot に vid rörelse.',
      examples: [
        { jp:'にほんへ いきます。', sv:'Jag åker till Japan.' },
      ]},
  ], quiz: [
    { q:'ろくじ___ おきます。', opts:['に','で','を','は'], correct:0, sv:'Jag går upp klockan sex.' },
    { q:'としょかん___ べんきょうします。', opts:['で','に','へ','を'], correct:0, sv:'Jag pluggar på biblioteket.' },
    { q:'でんしゃ___ いきます。', opts:['で','を','が','か'], correct:0, sv:'Jag åker dit med tåg.' },
    { q:'あした とうきょう___ いきます。', opts:['へ','を','で','が'], correct:0, sv:'Imorgon åker jag till Tokyo.' },
  ]},
  { id:'gram-4', title:'の・も・と — äga, också, och', points: [
    { title:'の — genitiv ("s")', expl:'AのB = A:s B. わたしの ほん = min bok. Även ursprung: にほんの くるま = en japansk bil.',
      examples: [
        { jp:'わたしの かばんです。', sv:'Det är min väska.' },
        { jp:'にほんごの せんせい', sv:'lärare i japanska' },
      ]},
    { title:'も — "också"', expl:'も ersätter は/が/を och betyder "också": わたしも = jag också.',
      examples: [
        { jp:'わたしも いきます。', sv:'Jag åker också.' },
      ]},
    { title:'と — "och" & "med"', expl:'と binder ihop substantiv (パンと たまご) och betyder "tillsammans med" (ともだちと).',
      examples: [
        { jp:'パンと たまごを かいます。', sv:'Jag köper bröd och ägg.' },
        { jp:'ともだちと えいがを みます。', sv:'Jag ser en film med en vän.' },
      ]},
  ], quiz: [
    { q:'これは わたし___ ペンです。', opts:['の','は','も','を'], correct:0, sv:'Det här är min penna.' },
    { q:'わたし___ コーヒーが すきです。("jag också")', opts:['も','は','の','が'], correct:0, sv:'Jag gillar också kaffe.' },
    { q:'あに___ あそびます。("med min storebror")', opts:['と','の','を','か'], correct:0, sv:'Jag umgås med min storebror.' },
    { q:'"En japansk bil" = にほん___ くるま', opts:['の','と','も','は'], correct:0, sv:'' },
  ]},
  { id:'gram-5', title:'Verb: ます-formen', points: [
    { title:'ます — artigt presens/futurum', expl:'Verbets artiga form: たべます (äter/ska äta). Negation: たべません. Dåtid: たべました. Dåtid negation: たべませんでした.',
      examples: [
        { jp:'まいにち コーヒーを のみます。', sv:'Jag dricker kaffe varje dag.' },
        { jp:'にくを たべません。', sv:'Jag äter inte kött.' },
        { jp:'きのう えいがを みました。', sv:'Igår såg jag en film.' },
        { jp:'きのう べんきょうしませんでした。', sv:'Igår pluggade jag inte.' },
      ]},
  ], quiz: [
    { q:'"Jag äter inte fisk" = さかなを たべ___。', opts:['ません','ます','ました','たい'], correct:0, sv:'' },
    { q:'"Igår läste jag en bok" = きのう ほんを よみ___。', opts:['ました','ます','ません','ましょう'], correct:0, sv:'' },
    { q:'"Jag pluggade inte" = べんきょうし___。', opts:['ませんでした','ました','ます','ません'], correct:0, sv:'' },
    { q:'Vilken är artig form av のむ (dricka)?', opts:['のみます','のむます','のります','のべます'], correct:0, sv:'' },
  ]},
  { id:'gram-6', title:'Adjektiv: い och な', points: [
    { title:'い-adjektiv', expl:'Slutar på い och böjs själva: たかい (dyr) → たかくない (inte dyr) → たかかった (var dyr). OBS: いい böjs som よい: よくない, よかった.',
      examples: [
        { jp:'この ほんは たかくないです。', sv:'Den här boken är inte dyr.' },
        { jp:'えいがは おもしろかったです。', sv:'Filmen var intressant.' },
      ]},
    { title:'な-adjektiv', expl:'Tar な före substantiv (きれいな はな) och negeras med じゃない: しずかじゃないです.',
      examples: [
        { jp:'きれいな まちですね。', sv:'Vilken fin stad!' },
        { jp:'この へやは しずかじゃないです。', sv:'Det här rummet är inte tyst.' },
      ]},
  ], quiz: [
    { q:'"Inte kall (väder)" = さむ___です。', opts:['くない','いじゃない','くなかった','ない'], correct:0, sv:'' },
    { q:'"Filmen var rolig" = えいがは たのし___です。', opts:['かった','いでした','くない','い'], correct:0, sv:'' },
    { q:'"En vacker blomma" = ___ はな', opts:['きれいな','きれいの','きれい','きれいい'], correct:0, sv:'' },
    { q:'Negation av いい (bra)?', opts:['よくない','いくない','いいじゃない','よい'], correct:0, sv:'いい böjs alltid som よい.' },
  ]},
  { id:'gram-7', title:'あります・います — "det finns"', points: [
    { title:'あります — saker, います — levande', expl:'"Det finns X" = Xが あります (döda ting/växter) eller Xが います (människor/djur). Platsen tar に.',
      examples: [
        { jp:'つくえの うえに ほんが あります。', sv:'Det ligger en bok på bordet.' },
        { jp:'こうえんに こどもが います。', sv:'Det är barn i parken.' },
        { jp:'ねこが いますか。', sv:'Finns det en katt? / Har du katt?' },
      ]},
  ], quiz: [
    { q:'いすの したに ねこが ___。', opts:['います','あります','です','します'], correct:0, sv:'Det är en katt under stolen.' },
    { q:'かばんの なかに ペンが ___。', opts:['あります','います','です','のみます'], correct:0, sv:'Det finns en penna i väskan.' },
    { q:'"Var är stationen?" = えきは どこに ___か。', opts:['あります','います','します','いきます'], correct:0, sv:'' },
    { q:'へやに おとこのこが ___。', opts:['います','あります','たべます','です'], correct:0, sv:'Det är en pojke i rummet.' },
  ]},
  { id:'gram-8', title:'これ・それ・あれ — pekorden', points: [
    { title:'ko-so-a-do-systemet', expl:'これ = nära MIG, それ = nära DIG, あれ = långt från oss båda, どれ = vilken? Före substantiv: この/その/あの/どの + ord.',
      examples: [
        { jp:'これは わたしの スマホです。', sv:'Det här är min mobil.' },
        { jp:'それは なんですか。', sv:'Vad är det där (du håller i)?' },
        { jp:'あの やまは ふじさんです。', sv:'Berget där borta är Fuji.' },
      ]},
  ], quiz: [
    { q:'(Du pekar på något du håller i) ___は ペンです。', opts:['これ','それ','あれ','どれ'], correct:0, sv:'' },
    { q:'"Den där boken (nära dig)" = ___ ほん', opts:['その','この','あの','どの'], correct:0, sv:'' },
    { q:'"Vilken är din väska?" = あなたの かばんは ___ですか。', opts:['どれ','これ','それ','あの'], correct:0, sv:'' },
    { q:'(Berget långt borta) ___ やまは きれいです。', opts:['あの','この','その','どの'], correct:0, sv:'' },
  ]},
  { id:'gram-9', title:'Räkna: klockan & saker', points: [
    { title:'Klockan: 〜時〜分', expl:'Timmar: いちじ, にじ… OBS: 4 = よじ, 7 = しちじ, 9 = くじ. Halv = はん: さんじはん (3:30).',
      examples: [
        { jp:'いま よじはんです。', sv:'Klockan är halv fem (4:30).' },
        { jp:'くじに ねます。', sv:'Jag lägger mig klockan nio.' },
      ]},
    { title:'Saker: ひとつ、ふたつ…', expl:'Allmänt räkneord: ひとつ, ふたつ, みっつ, よっつ, いつつ… Personer: ひとり (1), ふたり (2), さんにん (3)…',
      examples: [
        { jp:'りんごを みっつ ください。', sv:'Tre äpplen, tack.' },
        { jp:'かぞくは よにんです。', sv:'Vi är fyra i familjen.' },
      ]},
  ], quiz: [
    { q:'Klockan 9 heter…', opts:['くじ','きゅうじ','ここのじ','くうじ'], correct:0, sv:'' },
    { q:'"Två äpplen tack" = りんごを ___ ください。', opts:['ふたつ','ににん','ふたり','にほん'], correct:0, sv:'' },
    { q:'Klockan 4:30 heter…', opts:['よじはん','しじはん','よんじはん','くじはん'], correct:0, sv:'' },
    { q:'"Tre personer" heter…', opts:['さんにん','みっつ','さんこ','さんじ'], correct:0, sv:'' },
  ]},
  { id:'gram-10', title:'Vilja, be & föreslå', points: [
    { title:'〜たいです — "vill"', expl:'Byt ます mot たいです: いきたいです = jag vill åka. Negation: いきたくないです.',
      examples: [
        { jp:'にほんに いきたいです。', sv:'Jag vill åka till Japan.' },
        { jp:'すしを たべたいです。', sv:'Jag vill äta sushi.' },
      ]},
    { title:'〜てください — "snälla gör"', expl:'Verbets て-form + ください = artig uppmaning: まってください (vänta!), みてください (titta!).',
      examples: [
        { jp:'ちょっと まってください。', sv:'Vänta lite, tack.' },
        { jp:'ゆっくり はなしてください。', sv:'Prata långsamt, tack.' },
      ]},
    { title:'〜ましょう — "vi gör!"', expl:'Byt ます mot ましょう = "låt oss": いきましょう (nu går vi!), たべましょう (nu äter vi!).',
      examples: [
        { jp:'いっしょに べんきょうしましょう。', sv:'Vi pluggar tillsammans!' },
      ]},
  ], quiz: [
    { q:'"Jag vill se en film" = えいがを み___です。', opts:['たい','ます','たく','ましょう'], correct:0, sv:'' },
    { q:'"Vänta, tack!" = まっ___ください。', opts:['て','た','つ','ます'], correct:0, sv:'' },
    { q:'"Nu går vi!" = いき___。', opts:['ましょう','たいです','ません','ました'], correct:0, sv:'' },
    { q:'"Jag vill inte äta" = たべ___です。', opts:['たくない','たいじゃ','ませんたい','なくたい'], correct:0, sv:'' },
  ]},
];

// ---------- Läspassager (provläget, del 2) ----------
export const READING_PASSAGES = [
  { id:'read-1', jp:'はじめまして。わたしは カールです。スウェーデンじんです。かぞくは よにんです。まいにち あさ コーヒーを のみます。にほんごの べんきょうは たのしいです。',
    sv:'(Självpresentation)',
    questions: [
      { q:'カールさんは どこの ひとですか。 — Varifrån kommer Carl?', opts:['Sverige','Japan','Kina','USA'], correct:0 },
      { q:'かぞくは なんにんですか。 — Hur många är familjen?', opts:['Fyra','Två','Tre','Fem'], correct:0 },
      { q:'カールさんは まいあさ なにを のみますか。 — Vad dricker Carl varje morgon?', opts:['Kaffe','Te','Mjölk','Juice'], correct:0 },
    ]},
  { id:'read-2', jp:'きょうは どようびです。あさ くじに おきました。ともだちと こうえんへ いきました。こうえんで サッカーを しました。それから、レストランで ひるごはんを たべました。とても たのしかったです。',
    sv:'(En lördag)',
    questions: [
      { q:'きょうは なんようびですか。 — Vilken veckodag är det?', opts:['Lördag','Söndag','Fredag','Måndag'], correct:0 },
      { q:'どこで サッカーを しましたか。 — Var spelade de fotboll?', opts:['I parken','I skolan','På stationen','Hemma'], correct:0 },
      { q:'なんじに おきましたか。 — När gick hen upp?', opts:['Klockan 9','Klockan 7','Klockan 6','Klockan 10'], correct:0 },
    ]},
  { id:'read-3', jp:'わたしの へやは ちいさいですが、あかるいです。つくえの うえに パソコンが あります。まどの ちかくに ねこが います。ねこの なまえは モモです。',
    sv:'(Mitt rum)',
    questions: [
      { q:'へやは どうですか。 — Hurdant är rummet?', opts:['Litet men ljust','Stort och mörkt','Litet och mörkt','Stort och ljust'], correct:0 },
      { q:'つくえの うえに なにが ありますか。 — Vad står på skrivbordet?', opts:['En dator','En bok','En TV','En klocka'], correct:0 },
      { q:'ねこの なまえは？ — Vad heter katten?', opts:['Momo','Koko','Nana','Yuki'], correct:0 },
    ]},
];

// ---------- Hörförståelsebank (provläget, del 3 — läses upp med talsyntes) ----------
export const LISTENING_ITEMS = [
  { audio:'えきは どこですか。', q:'Vad letar personen efter?', opts:['Stationen','Skolan','Banken','Toaletten'], correct:0 },
  { audio:'コーヒーを ふたつ ください。', q:'Vad beställer personen?', opts:['Två kaffe','Ett te','Två öl','Ett vatten'], correct:0 },
  { audio:'あしたは あめです。', q:'Hur blir vädret imorgon?', opts:['Regn','Snö','Sol','Molnigt'], correct:0 },
  { audio:'いま さんじはんです。', q:'Vad är klockan?', opts:['3:30','3:00','4:30','13:00'], correct:0 },
  { audio:'わたしは まいにち でんしゃで かいしゃに いきます。', q:'Hur tar sig personen till jobbet?', opts:['Med tåg','Med bil','Med buss','Med cykel'], correct:0 },
  { audio:'すみません、この ほんは いくらですか。', q:'Vad frågar personen om?', opts:['Vad boken kostar','Var boken finns','Vems boken är','När affären öppnar'], correct:0 },
  { audio:'きのう ともだちと えいがを みました。', q:'Vad gjorde personen igår?', opts:['Såg en film med en vän','Pluggade med en vän','Åt middag med familjen','Spelade fotboll'], correct:0 },
  { audio:'つくえの うえに ねこが います。', q:'Var är katten?', opts:['På skrivbordet','Under stolen','I väskan','Vid fönstret'], correct:0 },
  { audio:'にちようびに こうえんで サッカーを します。', q:'Vad händer på söndag?', opts:['Fotboll i parken','Film på bio','Lunch på restaurang','Läxor hemma'], correct:0 },
  { audio:'ぎゅうにゅうと たまごを かいます。', q:'Vad ska personen köpa?', opts:['Mjölk och ägg','Bröd och fisk','Kött och ris','Te och godis'], correct:0 },
  { audio:'あには がっこうの せんせいです。', q:'Vad jobbar storebror som?', opts:['Lärare','Läkare','Kock','Chaufför'], correct:0 },
  { audio:'ちょっと まってください。', q:'Vad ber personen dig göra?', opts:['Vänta lite','Prata långsammare','Öppna fönstret','Komma hit'], correct:0 },
  { audio:'トイレは あそこです。みぎに あります。', q:'Var är toaletten?', opts:['Där borta till höger','Där borta till vänster','Här till höger','Rakt fram'], correct:0 },
  { audio:'まいあさ しちじに おきて、パンを たべます。', q:'Vad äter personen på morgonen?', opts:['Bröd','Ris','Ägg','Fisk'], correct:0 },
];
