// Läs-stegen — graderade texter som låses upp av Ordmaraton-positionen.
// REGEL: texten för steg N använder (nästan) bara ord ur banans första N ord
// + de 334 lektionsorden (data/vocab.js). Verifieras av scratchpad-checkern
// vid författande — håll regeln när texter läggs till eller ändras.
// Texterna är i kana med mellanslag mellan fraser (romaji-hjälpen kräver det).

export const LADDER_STORIES = [
  { id:'ladder-1', req:250, title:'わたしと クロ', titleSv:'Jag och Kuro', emoji:'🐈‍⬛', level:'Lätt',
    cover:'img/manga/l1.png',
    pages: [
      { jp:'わたしは まいにち しちじに おきます。わたしの ねこも おきます。', sv:'Jag går upp klockan sju varje dag. Min katt går också upp.' },
      { jp:'ねこの なまえは クロです。くろくて、ちいさいです。', sv:'Katten heter Kuro. Han är svart och liten.' },
      { jp:'わたしは しごとに いきます。クロは いえに います。', sv:'Jag går till jobbet. Kuro är hemma.' },
      { jp:'よる、わたしは うちに かえります。クロは ドアの ところで まって います。', sv:'På kvällen kommer jag hem. Kuro väntar vid dörren.' },
      { jp:'わたしは クロが だいすきです。クロは わたしの かぞくです。', sv:'Jag älskar Kuro. Kuro är min familj.' },
    ],
    questions: [
      { q:'ねこの なまえは？ — Vad heter katten?', opts:['Kuro','Momo','Shiro','Tama'], correct:0 },
      { q:'Var är Kuro på dagen?', opts:['Hemma','På jobbet','I parken','I skolan'], correct:0 },
      { q:'Vad gör Kuro på kvällen?', opts:['Väntar vid dörren','Sover','Äter fisk','Leker ute'], correct:0 },
    ]},

  { id:'ladder-2', req:500, title:'あさの でんしゃ', titleSv:'Morgontåget', emoji:'🚃', level:'Lätt',
    cover:'img/manga/l2.png',
    pages: [
      { jp:'まいあさ、わたしは でんしゃで かいしゃに いきます。', sv:'Varje morgon åker jag tåg till företaget.' },
      { jp:'でんしゃの なかに おとこの ひとが います。まいにち おなじ ひとです。', sv:'På tåget finns en man. Samma man varje dag.' },
      { jp:'その ひとは いつも しんぶんを よみます。', sv:'Han läser alltid tidningen.' },
      { jp:'きょうは しんぶんが ありません。その ひとは ねて います。', sv:'Idag har han ingen tidning. Han sover.' },
      { jp:'あ！えきです！「おきて ください！」と わたしは いいました。', sv:'Åh! Stationen! "Vakna!" sa jag.' },
      { jp:'その ひとは「ありがとう ございます！」と いって、はしって いきました。', sv:'Han sa "tack så mycket!" och sprang iväg.' },
    ],
    questions: [
      { q:'その ひとは まいにち なにを しますか。 — Vad gör mannen varje dag?', opts:['Läser tidningen','Lyssnar på musik','Äter frukost','Pratar i telefon'], correct:0 },
      { q:'Vad hände idag?', opts:['Han somnade','Han missade tåget','Han glömde väskan','Han kom försent'], correct:0 },
      { q:'Vad gjorde berättaren?', opts:['Väckte honom','Tog hans tidning','Bytte plats','Gick av tåget'], correct:0 },
    ]},

  { id:'ladder-3', req:750, title:'あたらしい しごと', titleSv:'Nya jobbet', emoji:'💼', level:'Lätt',
    cover:'img/manga/l3.png',
    pages: [
      { jp:'きょうから あたらしい かいしゃで はたらきます。ちょっと しんぱいです。', sv:'Från och med idag jobbar jag på ett nytt företag. Jag är lite orolig.' },
      { jp:'かいしゃの ひとたちは「はじめまして！」と いいました。みんな やさしいです。', sv:'Folket på företaget sa "trevligt att träffas!". Alla är snälla.' },
      { jp:'しごとは むずかしいです。しつもんが たくさん あります。', sv:'Jobbet är svårt. Jag har många frågor.' },
      { jp:'となりの ひとが こたえを おしえました。「ゆっくりで いいですよ。」', sv:'Personen bredvid berättade svaren. "Det är okej att ta det lugnt."' },
      { jp:'ごご、しゃちょうと はなしました。「だいじょうぶですよ。」と しゃちょうは いいました。', sv:'På eftermiddagen pratade jag med chefen. "Det kommer att gå bra", sa chefen.' },
      { jp:'よる、うちに かえりました。たいへんでしたが、たのしかったです。', sv:'På kvällen åkte jag hem. Det var tufft, men roligt.' },
    ],
    questions: [
      { q:'Hur kände sig berättaren på morgonen?', opts:['Lite orolig','Arg','Uttråkad','Sjuk'], correct:0 },
      { q:'となりの ひとは なにを しましたか。 — Vad gjorde personen bredvid?', opts:['Berättade svaren','Gick hem tidigt','Skrattade','Sa ingenting'], correct:0 },
      { q:'Hur var första dagen till slut?', opts:['Tuff men rolig','Bara tråkig','Lätt och kort','Hemsk'], correct:0 },
    ]},

  { id:'ladder-4', req:1000, title:'ねこの ニュース', titleSv:'Katten i nyheterna', emoji:'📺', level:'Lätt',
    cover:'img/manga/l4.png',
    pages: [
      { jp:'わたしの まちに ゆうめいな ねこが います。', sv:'I min stad finns en berömd katt.' },
      { jp:'その ねこは まいにち じぶんで バスに のります。', sv:'Den katten tar bussen på egen hand varje dag.' },
      { jp:'あさ こうえんに いって、ごご うちに かえります。', sv:'På morgonen åker den till parken, på eftermiddagen hem igen.' },
      { jp:'きのう、しんぶんの きしゃが きました。しゃしんを たくさん とりました。', sv:'Igår kom en tidningsreporter. Hen tog många bilder.' },
      { jp:'きょう、ねこは テレビの ニュースに でました！', sv:'Idag var katten med i TV-nyheterna!' },
      { jp:'まちの みんなは その ねこが だいすきです。ねこは きょうも バスに のって います。', sv:'Alla i staden älskar katten. Även idag åker den buss.' },
    ],
    questions: [
      { q:'ねこは まいにち なにに のりますか。 — Vad åker katten varje dag?', opts:['Buss','Tåg','Bil','Cykel'], correct:0 },
      { q:'Vem kom igår?', opts:['En tidningsreporter','En polis','En veterinär','En turist'], correct:0 },
      { q:'Var syntes katten idag?', opts:['I TV-nyheterna','I skolan','På bion','I affären'], correct:0 },
    ]},

  { id:'ladder-5', req:1500, title:'ふゆの うみ', titleSv:'Vinterhavet', emoji:'🌊', level:'Lätt',
    cover:'img/manga/l5.png',
    pages: [
      { jp:'ふゆです。そとは ゆきが いっぱいです。', sv:'Det är vinter. Ute är det fullt av snö.' },
      { jp:'かぞくと うみへ りょこうに いきました。', sv:'Jag åkte på resa till havet med familjen.' },
      { jp:'ふゆの うみは しずかです。ひとが いません。', sv:'Vinterhavet är stilla. Det finns inga människor där.' },
      { jp:'くうきは つめたいです。でも、とても きれいです。', sv:'Luften är kall. Men det är väldigt vackert.' },
      { jp:'よる、ホテルで あたたかい りょうりを たべました。おいしかったです。', sv:'På kvällen åt vi varm mat på hotellet. Det var gott.' },
      { jp:'「はるに また きましょう ね。」と ちちが いいました。わたしは うれしかったです。', sv:'"Vi kommer tillbaka till våren", sa pappa. Jag blev glad.' },
    ],
    questions: [
      { q:'Vart åkte familjen?', opts:['Till havet','Till bergen','Till Tokyo','Till en ö'], correct:0 },
      { q:'ふゆの うみは どうですか。 — Hur är havet på vintern?', opts:['Stilla och tomt','Fullt av folk','Varmt','Stormigt'], correct:0 },
      { q:'När vill pappan komma tillbaka?', opts:['På våren','På sommaren','Nästa vinter','Aldrig'], correct:0 },
    ]},

  { id:'ladder-6', req:2000, title:'ちいさな パンの みせ', titleSv:'Det lilla bageriet', emoji:'🍞', level:'Medel',
    cover:'img/manga/l6.png',
    pages: [
      { jp:'えきの ちかくに ちいさな みせが あります。パンの みせです。', sv:'Nära stationen finns en liten butik. Ett bageri.' },
      { jp:'みせの ひとは まいあさ よじに おきて、パンを つくります。', sv:'Bagaren går upp klockan fyra varje morgon och bakar bröd.' },
      { jp:'おきゃくさんが たくさん きます。「ここの パンは まちで いちばんです！」', sv:'Många kunder kommer. "Brödet här är bäst i stan!"' },
      { jp:'まどから あたたかい パンが みえます。', sv:'Genom fönstret ser man det varma brödet.' },
      { jp:'きょう、おきゃくさんの てがみが きました。「あなたの パンが だいすきです。ありがとう。」', sv:'Idag kom ett brev från en kund. "Jag älskar ditt bröd. Tack."' },
      { jp:'みせの ひとは とても うれしかったです。そして、あしたの パンを つくりました。', sv:'Bagaren blev väldigt glad. Och bakade morgondagens bröd.' },
    ],
    questions: [
      { q:'みせは どこに ありますか。 — Var ligger butiken?', opts:['Nära stationen','Vid havet','I parken','Vid skolan'], correct:0 },
      { q:'När går bagaren upp?', opts:['Klockan fyra','Klockan sju','Klockan sex','Klockan fem'], correct:0 },
      { q:'Vad stod i brevet?', opts:['Jag älskar ditt bröd','Brödet är för dyrt','Butiken är stängd','Beställning på kakor'], correct:0 },
    ]},

  { id:'ladder-7', req:2500, title:'やまの てがみ', titleSv:'Brevet från bergen', emoji:'🏔️', level:'Medel',
    cover:'img/manga/l7.png',
    pages: [
      { jp:'ともだちの たなかさんは やまに すんで います。', sv:'Min vän Tanaka bor i bergen.' },
      { jp:'きのう、たなかさんから てがみが きました。', sv:'Igår kom ett brev från Tanaka.' },
      { jp:'「やまの あさは しずかです。とりの こえが きこえます。」', sv:'"Morgonen i bergen är stilla. Man hör fåglarnas röster."' },
      { jp:'「まいにち もりを あるきます。ふゆは ゆきで しろいです。」', sv:'"Varje dag går jag i skogen. På vintern är allt vitt av snö."' },
      { jp:'「らいねんの はる、あそびに きて ください。」', sv:'"Kom och hälsa på till våren nästa år."' },
      { jp:'わたしは「いきます！」と てがみを かきました。いまから たのしみです。', sv:'Jag skrev tillbaka: "Jag kommer!". Jag ser redan fram emot det.' },
    ],
    questions: [
      { q:'たなかさんは どこに すんで いますか。 — Var bor Tanaka?', opts:['I bergen','Vid havet','I Tokyo','I utlandet'], correct:0 },
      { q:'Hur är morgonen i bergen?', opts:['Stilla, med fågelsång','Bullrig','Mörk','Full av folk'], correct:0 },
      { q:'Vad svarade berättaren?', opts:['Jag kommer!','Jag kan inte','Kanske nästa år','Skriv igen'], correct:0 },
    ]},

  { id:'ladder-8', req:3000, title:'はじめての とうきょう', titleSv:'Första gången i Tokyo', emoji:'🗼', level:'Medel',
    cover:'img/manga/l8.png',
    pages: [
      { jp:'ことしの なつ、はじめて とうきょうに いきました。', sv:'I somras åkte jag till Tokyo för första gången.' },
      { jp:'とうきょうえきは とても おおきいです。ひとが ほんとうに たくさん います。', sv:'Tokyo station är jättestor. Det är verkligen mycket folk.' },
      { jp:'ちかてつで まちを みました。みせも ひとも おおいです。', sv:'Jag såg staden från tunnelbanan. Många butiker och många människor.' },
      { jp:'ひるは ゆうめいな こうえんを あるきました。きが たかくて、しずかでした。', sv:'På dagen promenerade jag i en berömd park. Träden var höga och det var stilla.' },
      { jp:'ごご、えいがを みました。それから、かいものを して、かぞくに プレゼントを かいました。', sv:'På eftermiddagen såg jag en film. Sedan shoppade jag och köpte presenter till familjen.' },
      { jp:'よるの まちは ひかりで いっぱいでした。おんがくも きこえました。', sv:'Staden på natten var full av ljus. Man hörde musik också.' },
      { jp:'「せかいは ひろいなあ。」と おもいました。', sv:'"Världen är stor", tänkte jag.' },
      { jp:'つぎの ゆめは にほんの ほかの まちです。また いきます！', sv:'Nästa dröm är andra städer i Japan. Jag åker igen!' },
    ],
    questions: [
      { q:'いつ とうきょうに いきましたか。 — När åkte hen till Tokyo?', opts:['I somras','I vintras','Igår','Förra året på våren'], correct:0 },
      { q:'Vad gjorde hen på eftermiddagen?', opts:['Såg film och shoppade','Sov på hotellet','Åkte hem','Badade'], correct:0 },
      { q:'よるの まちは どうでしたか。 — Hur var staden på natten?', opts:['Full av ljus och musik','Mörk och tyst','Regnig','Stängd'], correct:0 },
      { q:'Vad är nästa dröm?', opts:['Fler städer i Japan','Flytta till Tokyo','Åka utomlands','Öppna en butik'], correct:0 },
    ]},
];
