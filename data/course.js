// Kursen — eget spår som följer Genki I:s (3:e uppl.) lektionsstruktur och grammatikordning.
// Allt innehåll (dialoger, meningar, övningar) är originalskrivet för spelet.
// Övningstyperna speglar bokens: mönsterdrill (bygg mening), böjningsdrill, frågor, sifferlyssning.

export const COURSE_LESSONS = [
  { id:'kurs-1', nr:1, title:'あたらしいともだち', titleSv:'Nya vänner', emoji:'🤝',
    points: [
      'XはYです — "X är Y": わたしは カールです。',
      'Fråga med か: あなたは がくせいですか。',
      'NounのNoun: にほんごの せんせい (lärare i japanska)',
      'Klockan: 〜じ (OBS: よじ・しちじ・くじ) och でんわばんごう (telefonnummer)',
    ],
    dialog: [
      { sp:'ゆき', jp:'はじめまして。すずき ゆきです。', sv:'Trevligt att träffas. Jag är Yuki Suzuki.' },
      { sp:'カール', jp:'はじめまして。カールです。スウェーデンじんです。', sv:'Trevligt att träffas. Jag är Carl. Jag är svensk.' },
      { sp:'ゆき', jp:'カールさんは がくせいですか。', sv:'Är du student, Carl?' },
      { sp:'カール', jp:'いいえ、かいしゃいんです。', sv:'Nej, jag jobbar på företag.' },
      { sp:'ゆき', jp:'そうですか。よろしく おねがいします。', sv:'Jaså. Trevligt att lära känna dig!' },
    ],
    drill: {
      tiles: [
        { sv:'Jag är svensk.', tiles:['わたし','は','スウェーデンじん','です'], extra:['か'] },
        { sv:'Är du studerande?', tiles:['あなた','は','がくせい','です','か'] },
        { sv:'Klockan är halv fem (4:30).', tiles:['いま','よじ','はん','です'], extra:['ごじ'] },
        { sv:'Yuki är lärare i japanska.', tiles:['ゆきさん','は','にほんご','の','せんせい','です'] },
        { sv:'Vad är det här?', tiles:['これ','は','なん','です','か'] },
      ],
      conj: [],
      qa: [
        { q:'Klockan är 9 — vad säger du?', opts:['くじです','きゅうじです','ここのじです','じくです'], correct:0 },
        { q:'Hur hälsar du artigt på morgonen?', opts:['おはようございます','こんばんは','おやすみなさい','さようなら'], correct:0 },
        { q:'「でんわばんごうは？」 — vad frågar personen efter?', opts:['Telefonnumret','Namnet','Klockan','Adressen'], correct:0 },
        { q:'"Jag är INTE japan" = わたしは にほんじん…', opts:['じゃないです','です','ですか','でした'], correct:0 },
      ],
      numbers:'time',
    }},
  { id:'kurs-2', nr:2, title:'かいもの', titleSv:'Shopping', emoji:'🛍️',
    points: [
      'これ／それ／あれ／どれ — den här / den där / den där borta / vilken?',
      'この・その・あの + substantiv: この とけい (den här klockan)',
      'ここ／そこ／あそこ — här / där / där borta · だれの — vems?',
      'Nounも (också) · Nounじゃないです (är inte) · 〜ね (eller hur) / 〜よ (vet du)',
      'Priser: 〜えん, いくらですか (vad kostar det?)',
    ],
    dialog: [
      { sp:'カール', jp:'すみません。これは いくらですか。', sv:'Ursäkta, vad kostar den här?' },
      { sp:'みせのひと', jp:'それは さんびゃくえんです。', sv:'Den kostar 300 yen.' },
      { sp:'カール', jp:'じゃあ、これを ください。', sv:'Då tar jag den här, tack.' },
      { sp:'みせのひと', jp:'はい。ありがとうございます。', sv:'Javisst. Tack så mycket!' },
    ],
    drill: {
      tiles: [
        { sv:'Vad kostar den där (nära dig)?', tiles:['それ','は','いくら','です','か'] },
        { sv:'Det här är inte min väska.', tiles:['これ','は','わたし','の','かばん','じゃないです'] },
        { sv:'Vems penna är det där borta?', tiles:['あれ','は','だれ','の','ペン','です','か'] },
        { sv:'Den här klockan är 2000 yen.', tiles:['この','とけい','は','にせんえん','です'], extra:['これ'] },
        { sv:'Toaletten är där borta.', tiles:['トイレ','は','あそこ','です'] },
      ],
      conj: [],
      qa: [
        { q:'ごひゃくえん — hur mycket är det?', opts:['500 yen','5 000 yen','50 yen','15 yen'], correct:0 },
        { q:'"Den här boken också" = この ほん…', opts:['も','は','が','か'], correct:0 },
        { q:'Skorna är långt från er båda: くつは ___ です。', opts:['あそこ','ここ','そこ','どれ'], correct:0 },
        { q:'Du söker medhåll: 「いい てんきです___」', opts:['ね','よ','か','の'], correct:0 },
      ],
      numbers:'price',
    }},
  { id:'kurs-3', nr:3, title:'デートのやくそく', titleSv:'En dejt bokas', emoji:'🎬',
    points: [
      'Verbtyper: ru-verb (たべる), u-verb (のむ), oregelbundna (する・くる)',
      'ます-formen: たべます・たべません (artigt presens/futurum)',
      'Partiklar: を (objekt), で (plats för aktivitet), に/へ (mål, tid)',
      '〜ませんか — "ska vi inte…?" (inbjudan) · 〜ましょう — "vi gör det!"',
      'Frekvensadverb: よく・ときどき・ぜんぜん(+negation) · Ordföljd: [tid] [plats]で [objekt]を [verb]',
    ],
    dialog: [
      { sp:'ゆき', jp:'カールさん、しゅうまつ なにを しますか。', sv:'Carl, vad gör du i helgen?' },
      { sp:'カール', jp:'どようびに としょかんで べんきょうします。', sv:'På lördag pluggar jag på biblioteket.' },
      { sp:'ゆき', jp:'にちようびは？', sv:'Och på söndag?' },
      { sp:'カール', jp:'なにも しません。', sv:'Ingenting alls.' },
      { sp:'ゆき', jp:'じゃあ、いっしょに えいがを みませんか。', sv:'Ska vi inte se en film ihop då?' },
      { sp:'カール', jp:'いいですね！みましょう！', sv:'Gärna! Det gör vi!' },
    ],
    drill: {
      tiles: [
        { sv:'Jag dricker kaffe på ett kafé.', tiles:['カフェ','で','コーヒー','を','のみます'], extra:['に'] },
        { sv:'Jag går till skolan klockan åtta.', tiles:['はちじ','に','がっこう','へ','いきます'] },
        { sv:'Ska vi inte se en film tillsammans?', tiles:['いっしょに','えいが','を','みません','か'] },
        { sv:'Jag pluggar ofta japanska hemma.', tiles:['よく','うち','で','にほんご','を','べんきょうします'] },
        { sv:'Jag dricker inte te på morgonen.', tiles:['あさ','は','おちゃ','を','のみません'] },
      ],
      conj: [
        { base:'たべる', sv:'äta', form:'ます-form', target:'たべます' },
        { base:'のむ', sv:'dricka', form:'ます-form', target:'のみます' },
        { base:'いく', sv:'gå/åka', form:'ます-form', target:'いきます' },
        { base:'みる', sv:'se', form:'negation 〜ません', target:'みません' },
        { base:'かく', sv:'skriva', form:'ます-form', target:'かきます' },
        { base:'する', sv:'göra', form:'negation 〜ません', target:'しません' },
      ],
      qa: [
        { q:'ときどき betyder…', opts:['ibland','alltid','aldrig','ofta'], correct:0 },
        { q:'"på biblioteket" (där något GÖRS) = としょかん…', opts:['で','に','へ','を'], correct:0 },
        { q:'Vilket är ett ru-verb (ichidan)?', opts:['たべる','のむ','いく','はなす'], correct:0 },
        { q:'ぜんぜん kräver alltid…', opts:['negation (〜ません)','ます-form','fråga (か)','ましょう'], correct:0 },
      ],
    }},
  { id:'kurs-4', nr:4, title:'はじめてのデート', titleSv:'Första dejten', emoji:'💐',
    points: [
      'Xが あります／います — "det finns X" (saker / levande)',
      'Platsord: まえ・うしろ・うえ・した・となり・ちかく + に',
      'Dåtid: です→でした · Verb: 〜ました／〜ませんでした',
      'いちじかん (en timme) · たくさん (mycket) · と (och/med)',
    ],
    dialog: [
      { sp:'カール', jp:'このちかくに ぎんこうが ありますか。', sv:'Finns det en bank här i närheten?' },
      { sp:'ゆき', jp:'はい、えきの まえに ありますよ。', sv:'Ja, framför stationen!' },
      { sp:'カール', jp:'ゆきさん、きのう なにを しましたか。', sv:'Yuki, vad gjorde du igår?' },
      { sp:'ゆき', jp:'ともだちと かいものを しました。それから、カフェで ケーキを たべました。', sv:'Jag shoppade med en vän. Sedan åt vi tårta på ett kafé.' },
    ],
    drill: {
      tiles: [
        { sv:'Det finns en katt under bordet.', tiles:['つくえ','の','した','に','ねこ','が','います'], extra:['あります'] },
        { sv:'Det finns en bank framför stationen.', tiles:['えき','の','まえ','に','ぎんこう','が','あります'] },
        { sv:'Igår såg jag en film.', tiles:['きのう','えいが','を','みました'] },
        { sv:'Jag väntade en timme.', tiles:['いちじかん','まちました'] },
        { sv:'Jag åt inte frukost.', tiles:['あさごはん','を','たべませんでした'] },
      ],
      conj: [
        { base:'たべます', sv:'äta', form:'dåtid 〜ました', target:'たべました' },
        { base:'のみます', sv:'dricka', form:'dåtid negation 〜ませんでした', target:'のみませんでした' },
        { base:'いきます', sv:'gå/åka', form:'dåtid 〜ました', target:'いきました' },
        { base:'します', sv:'göra', form:'dåtid negation 〜ませんでした', target:'しませんでした' },
        { base:'みます', sv:'se', form:'dåtid 〜ました', target:'みました' },
        { base:'ねます', sv:'sova', form:'dåtid 〜ました', target:'ねました' },
      ],
      qa: [
        { q:'En hund är levande — "det finns en hund" heter…', opts:['いぬが います','いぬが あります','いぬは です','いぬに います'], correct:0 },
        { q:'"Det VAR en bra film" = いい えいが…', opts:['でした','です','だったです','ました'], correct:0 },
        { q:'たくさん betyder…', opts:['mycket/många','lite','ibland','en timme'], correct:0 },
        { q:'"tillsammans med min vän" = ともだち…', opts:['と','が','を','の'], correct:0 },
      ],
    }},
  { id:'kurs-5', nr:5, title:'おきなわりょこう', titleSv:'Resan till Okinawa', emoji:'🏝️',
    points: [
      'い-adjektiv: たかい → たかくないです → たかかったです → たかくなかったです',
      'な-adjektiv: きれい(な) → きれいじゃないです → きれいでした',
      'OBS: いい böjs som よい: よくないです・よかったです',
      'すき(な)／きらい(な) med が · 〜ましょう／〜ましょうか (förslag)',
      'Räkna saker: ひとつ・ふたつ・みっつ…',
    ],
    dialog: [
      { sp:'ゆき', jp:'なつやすみに おきなわに いきました。', sv:'På sommarlovet åkte jag till Okinawa.' },
      { sp:'カール', jp:'いいですね！どうでしたか。', sv:'Vad kul! Hur var det?' },
      { sp:'ゆき', jp:'とても たのしかったです。うみが きれいでした。', sv:'Jätteroligt. Havet var vackert.' },
      { sp:'カール', jp:'たべものは どうでしたか。', sv:'Och maten?' },
      { sp:'ゆき', jp:'おいしかったです！でも、ちょっと たかかったです。', sv:'Jättegod! Men lite dyr.' },
    ],
    drill: {
      tiles: [
        { sv:'Resan var rolig.', tiles:['りょこう','は','たのしかった','です'], extra:['たのしいでした'] },
        { sv:'Havet i Okinawa är vackert.', tiles:['おきなわ','の','うみ','は','きれい','です'] },
        { sv:'Jag gillar japansk mat.', tiles:['にほん','の','たべもの','が','すき','です'] },
        { sv:'Vi ses vid stationen klockan tre!', tiles:['さんじ','に','えき','で','あいましょう'] },
        { sv:'Det var inte kallt igår.', tiles:['きのう','は','さむくなかった','です'] },
      ],
      conj: [
        { base:'たかい', sv:'dyr/hög', form:'negation 〜くないです', target:'たかくないです' },
        { base:'さむい', sv:'kall', form:'dåtid 〜かったです', target:'さむかったです' },
        { base:'おもしろい', sv:'intressant', form:'dåtid 〜かったです', target:'おもしろかったです' },
        { base:'いい', sv:'bra', form:'dåtid (böjs som よい!)', target:'よかったです' },
        { base:'げんき', sv:'pigg (na-adj)', form:'negation 〜じゃないです', target:'げんきじゃないです' },
        { base:'おいしい', sv:'god', form:'negation 〜くないです', target:'おいしくないです' },
      ],
      qa: [
        { q:'"en fin stad" heter…', opts:['きれいな まち','きれい まち','きれいの まち','きれくて まち'], correct:0 },
        { q:'Negation av いい är…', opts:['よくないです','いくないです','いいじゃないです','よかったです'], correct:0 },
        { q:'ひとつ、ふたつ、みっつ… — vad räknar man?', opts:['Saker (allmänt)','Personer','Timmar','Yen'], correct:0 },
        { q:'"Jag ogillar fisk" = さかなが…', opts:['きらいです','きらいでした','すきです','きらくないです'], correct:0 },
      ],
    }},
  { id:'kurs-6', nr:6, title:'ロバートさんのいちにち', titleSv:'En dag i Roberts liv', emoji:'📅',
    points: [
      'て-formen! たべます→たべて・のみます→のんで・かきます→かいて・いきます→いって (undantag)',
      '〜てください — "snälla gör" · 〜てもいいですか — "får jag…?"',
      '〜てはいけません — "man får inte" · 〜から — "eftersom"',
      'Två aktiviteter i följd: おきて、あさごはんを たべます',
    ],
    dialog: [
      { sp:'カール', jp:'すみません、まどを あけてもいいですか。', sv:'Ursäkta, får jag öppna fönstret?' },
      { sp:'せんせい', jp:'はい、どうぞ。', sv:'Ja, varsågod.' },
      { sp:'カール', jp:'ここで しゃしんを とってもいいですか。', sv:'Får man ta foton här?' },
      { sp:'せんせい', jp:'いいえ、ここで とってはいけません。', sv:'Nej, det är inte tillåtet här.' },
      { sp:'カール', jp:'わかりました。すみません。', sv:'Jag förstår. Ursäkta!' },
    ],
    drill: {
      tiles: [
        { sv:'Öppna fönstret, tack.', tiles:['まど','を','あけて','ください'] },
        { sv:'Får jag titta?', tiles:['みて','も','いいです','か'] },
        { sv:'Man får inte äta här.', tiles:['ここ','で','たべて','は','いけません'] },
        { sv:'Jag går upp klockan sju och äter frukost.', tiles:['しちじ','に','おきて','あさごはん','を','たべます'] },
        { sv:'Prata långsamt, tack.', tiles:['ゆっくり','はなして','ください'] },
      ],
      conj: [
        { base:'たべます', sv:'äta', form:'て-form', target:'たべて' },
        { base:'のみます', sv:'dricka', form:'て-form (む→んで)', target:'のんで' },
        { base:'いきます', sv:'gå/åka', form:'て-form (undantag!)', target:'いって' },
        { base:'よみます', sv:'läsa', form:'て-form (む→んで)', target:'よんで' },
        { base:'かきます', sv:'skriva', form:'て-form (く→いて)', target:'かいて' },
        { base:'まちます', sv:'vänta', form:'て-form (つ→って)', target:'まって' },
      ],
      qa: [
        { q:'て-formen av のみます är…', opts:['のんで','のみて','のって','のて'], correct:0 },
        { q:'て-formen av いきます är (undantaget!)…', opts:['いって','いいて','いきて','いんで'], correct:0 },
        { q:'"eftersom jag är upptagen" = いそがしいです…', opts:['から','まで','でも','と'], correct:0 },
        { q:'「ここで はなしてはいけません」 betyder…', opts:['Man får inte prata här','Prata här, tack','Vi pratar här','Får jag prata här?'], correct:0 },
      ],
    }},
  // Del 2 — låses upp i kommande version (Genki I kap 7–12)
  { id:'kurs-7',  nr:7,  title:'かぞくのしゃしん', titleSv:'Familjefotot', emoji:'👪', locked:true, teaser:'〜ている · beskriva människor · räkna personer' },
  { id:'kurs-8',  nr:8,  title:'バーベキュー', titleSv:'Grillfesten', emoji:'🍖', locked:true, teaser:'Vardagsformer · 〜とおもいます' },
  { id:'kurs-9',  nr:9,  title:'かぶき', titleSv:'Kabuki-teatern', emoji:'🎭', locked:true, teaser:'Dåtid kortform · まだ〜ていません' },
  { id:'kurs-10', nr:10, title:'ふゆやすみのよてい', titleSv:'Vinterlovsplaner', emoji:'⛄', locked:true, teaser:'Jämförelser · いちばん · つもり' },
  { id:'kurs-11', nr:11, title:'やすみのあと', titleSv:'Efter lovet', emoji:'🌅', locked:true, teaser:'〜たい (vill) · 〜たり〜たりする' },
  { id:'kurs-12', nr:12, title:'びょうき', titleSv:'Förkyld!', emoji:'🤒', locked:true, teaser:'〜んです · 〜ほうがいいです' },
];

// Sifferlyssning — klockslag och priser med korrekta läsningar (ljudförändringar!)
export const HOUR_READINGS = { 1:'いちじ',2:'にじ',3:'さんじ',4:'よじ',5:'ごじ',6:'ろくじ',7:'しちじ',8:'はちじ',9:'くじ',10:'じゅうじ',11:'じゅういちじ',12:'じゅうにじ' };
export const HUNDRED_READINGS = { 1:'ひゃく',2:'にひゃく',3:'さんびゃく',4:'よんひゃく',5:'ごひゃく',6:'ろっぴゃく',7:'ななひゃく',8:'はっぴゃく',9:'きゅうひゃく' };
export const THOUSAND_READINGS = { 1:'せん',2:'にせん',3:'さんぜん',4:'よんせん',5:'ごせん',6:'ろくせん',7:'ななせん',8:'はっせん',9:'きゅうせん' };
