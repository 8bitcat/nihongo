// reading — mangaläsning (höger→vänster med ordningstvång) + graderade sagor.
// Pedagogik: läsriktningen TRÄNAS genom att man måste peka på rutorna i rätt ordning.

import { el, escapeHTML, starsHTML, confetti } from './ui.js';
import { speak, stopSpeech } from './audio.js';
import { S, addXP, touchStreak, setLessonStars, lessonStars } from './state.js';
import { track, checkAchievements, showToast } from './gamify.js';
import { runDrill, mcQ, mcOptions } from './exercises.js';
import { sentenceRomaji, shuffle } from './kanaUtils.js';
import { MANGA, STORIES, ONOMATOPOEIA } from '../data/stories.js';
import { LADDER_STORIES } from '../data/ladder.js';
import { understoodCount } from './grind.js';

function topbar(root, nav, title, backTo = 'reading', backParams) {
  const bar = el('div', 'topbar');
  const back = el('button', 'back', '‹');
  back.onclick = () => { stopSpeech(); nav.go(backTo, backParams); };
  bar.appendChild(back);
  bar.appendChild(el('h1', null, escapeHTML(title)));
  root.appendChild(bar);
}

// ---------- LÄSNING (modulhem) ----------
export function renderReading(root, nav) {
  topbar(root, nav, '📖 Läsning', 'home');
  root.appendChild(el('div', 'prompt-label center', 'Riktig läsning från dag ett — manga åt rätt håll och enkla sagor.'));

  const list = el('div', 'lessonlist');

  const guide = el('button', 'lesson-row guide-row');
  guide.innerHTML = `<span class="num">🧭</span>
    <span class="mid"><span class="title">Så läser du manga</span>
    <span class="preview">Höger→vänster! Guide + övning — börja här</span></span>
    <span class="stars">${lessonStars('manga-guide') > 0 ? '✅' : ''}</span>`;
  guide.onclick = () => nav.go('mangaGuide');
  list.appendChild(guide);

  root.appendChild(list);
  root.appendChild(el('div', 'sectionlabel', '📖 Manga — läses höger → vänster'));
  const mlist = el('div', 'lessonlist');
  for (const m of MANGA) {
    const row = el('button', 'lesson-row');
    row.innerHTML = `<span class="num">${m.emoji}</span>
      <span class="mid"><span class="title jp">${escapeHTML(m.title)}</span>
      <span class="preview">${escapeHTML(m.titleSv)} · ${m.panels.length} rutor</span></span>
      ${starsHTML(lessonStars(m.id))}`;
    row.onclick = () => nav.go('manga', { mangaId: m.id });
    mlist.appendChild(row);
  }
  root.appendChild(mlist);

  // Läs-stegen: texter skrivna med ord ur Ordmaraton-banan — låses upp av din position
  const u = understoodCount();
  root.appendChild(el('div', 'sectionlabel', '📈 Läs-stegen — låses upp av Ordmaraton'));
  const llist = el('div', 'lessonlist');
  for (const s of LADDER_STORIES) {
    const unlocked = u >= s.req;
    const row = el('button', 'lesson-row' + (unlocked ? '' : ' locked'));
    row.innerHTML = `<span class="num">${unlocked ? s.emoji : '🔒'}</span>
      <span class="mid"><span class="title${unlocked ? ' jp' : ''}">${escapeHTML(unlocked ? s.title : s.titleSv)}</span>
      <span class="preview">${unlocked
        ? escapeHTML(s.titleSv) + ' · ' + s.pages.length + ' sidor · ' + escapeHTML(s.level)
        : 'Låses upp vid ' + s.req.toLocaleString('sv-SE') + ' ord — du har ' + u.toLocaleString('sv-SE')}</span></span>
      ${unlocked ? starsHTML(lessonStars(s.id)) : ''}`;
    if (unlocked) row.onclick = () => nav.go('story', { storyId: s.id });
    llist.appendChild(row);
  }
  root.appendChild(llist);

  root.appendChild(el('div', 'sectionlabel', '📚 Sagor — som barnböcker, med ljud'));
  const slist = el('div', 'lessonlist');
  for (const s of STORIES) {
    const row = el('button', 'lesson-row');
    row.innerHTML = `<span class="num">${s.emoji}</span>
      <span class="mid"><span class="title jp">${escapeHTML(s.title)}</span>
      <span class="preview">${escapeHTML(s.titleSv)} · ${s.pages.length} sidor · ${escapeHTML(s.level)}</span></span>
      ${starsHTML(lessonStars(s.id))}`;
    row.onclick = () => nav.go('story', { storyId: s.id });
    slist.appendChild(row);
  }
  root.appendChild(slist);
}

// ---------- MANGA-GUIDEN ----------
export function renderMangaGuide(root, nav) {
  topbar(root, nav, '🧭 Så läser du manga');

  const steps = [
    ['1. Boken börjar "baklänges"', 'Japanska böcker öppnas från det håll vi ser som baksidan. Det som ser ut som SISTA sidan är den första — och du bläddrar åt VÄNSTER. Många västerländska utgåvor har en varning på "första" sidan: "Du läser åt fel håll!"'],
    ['2. Rutorna: uppe till höger först', 'Börja alltid i rutan UPPE TILL HÖGER. Läs radvis åt vänster, sedan nästa rad. Som ett spegelvänt Z. Går en ruta över hela sidans bredd läses den när dess rad kommer.'],
    ['3. Pratbubblorna: samma regel', 'I varje ruta: bubblan längst till HÖGER först, sedan åt vänster. Övre bubbla före nedre. Den som "svarar" står oftast till vänster.'],
    ['4. Lodrät text', 'Japansk mangatext skrivs oftast LODRÄTT: läs varje kolumn uppifrån och ner, och kolumnerna från höger till vänster. Bubblorna i spelets manga är lodräta — precis som på riktigt!'],
    ['5. Kluriga layouter: följ konsten', 'Små rutor staplade bredvid en stor? Läs gruppen av små rutor som en egen "minisida" (uppifrån och ner) innan du går vidare åt vänster. Osäker? Följ blickriktningar och rörelselinjer — de pekar nästan alltid mot nästa ruta. Bubblans "svans" pekar på den som pratar.'],
    ['6. Furigana — läshjälpen', 'I manga för unga står små kana (furigana) bredvid varje kanji — till HÖGER om tecknet i lodrät text. Perfekt för nybörjare! Tips: försök läsa kanjin först, kika på furiganan efteråt.'],
    ['7. Ljudord (giongo/gitaigo)', 'Manga är full av ljudord ritade direkt i bilden — ofta i katakana. De är en av mangans charmigaste delar. De vanligaste hittar du i tabellen nedan.'],
  ];
  for (const [t, txt] of steps) {
    const card = el('div', 'gram-card');
    card.appendChild(el('h3', null, escapeHTML(t)));
    card.appendChild(el('p', null, escapeHTML(txt)));
    root.appendChild(card);
  }

  // Ljudordstabell med ljud
  const onoCard = el('div', 'gram-card');
  onoCard.appendChild(el('h3', null, '🔊 De vanligaste ljudorden'));
  for (const o of ONOMATOPOEIA) {
    const row = el('div', 'example');
    row.innerHTML = `<div class="info"><div class="jp-line">${escapeHTML(o.jp)} <span style="color:var(--gold);font-size:.85rem">${escapeHTML(o.romaji)}</span></div><div class="sv">${escapeHTML(o.sv)}</div></div>`;
    const b = el('button', 'speakbtn', '🔊');
    b.onclick = () => speak(o.jp, { rate: 0.9 });
    row.appendChild(b);
    onoCard.appendChild(row);
  }
  root.appendChild(onoCard);

  const tipsCard = el('div', 'gram-card');
  tipsCard.innerHTML = `<h3>💡 När du köper din första riktiga manga</h3>
    <p>1. Välj en lätt vardagsmanga MED furigana — klassikern är <b>Yotsuba&!</b> (よつばと!) — vardagsord slår fantasytermer.<br>
    2. Läs ett helt kapitel i sträck — hjärnan vänjer sig vid höger→vänster redan efter första kapitlet.<br>
    3. Sikta på att förstå 70–80 % utan lexikon — förstår du mindre, ta en lättare serie.<br>
    4. Läs om samma kapitel — andra varvet flyter läsordningen av sig själv och du kan fokusera på språket.</p>`;
  root.appendChild(tipsCard);

  // Övning: peka på rutorna i läsordning
  root.appendChild(el('div', 'sectionlabel center', '✋ Övning: peka på rutorna i läsordning!'));
  const host = el('div');
  root.appendChild(host);
  practiceGrid(host, nav);
}

function practiceGrid(host, nav) {
  host.innerHTML = '';
  const grid = el('div', 'manga-grid practice');
  const fb = el('div', 'feedback center');
  let expected = 0, mistakes = 0;
  const cells = [];
  for (let i = 0; i < 6; i++) {
    const cell = el('button', 'manga-panel practice-panel', '<span class="p-q">?</span>');
    cell.onclick = () => {
      if (cell.classList.contains('read')) return;
      if (i === expected) {
        cell.classList.add('read');
        cell.innerHTML = `<span class="p-num">${i + 1}</span>`;
        expected++;
        if (expected === 6) {
          fb.textContent = mistakes === 0 ? 'Perfekt! Du läser som en japan! 🎌' : `Klart! (${mistakes} felklick — höger före vänster!)`;
          fb.className = 'feedback ok center';
          setLessonStars('manga-guide', mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1);
          addXP(10);
          touchStreak();
          checkAchievements();
          confetti();
          const cta = el('div', 'continue-row center');
          const again = el('button', 'btn secondary small', 'Öva igen');
          again.onclick = () => practiceGrid(host, nav);
          const go = el('button', 'btn', 'Läs din första manga ›');
          go.onclick = () => nav.go('manga', { mangaId: MANGA[0].id });
          cta.appendChild(again);
          cta.appendChild(document.createTextNode(' '));
          cta.appendChild(go);
          host.appendChild(cta);
        }
      } else {
        mistakes++;
        cell.classList.add('shake');
        setTimeout(() => cell.classList.remove('shake'), 350);
        fb.textContent = expected === 0 ? 'Börja uppe till HÖGER!' : 'Nästa ruta är åt vänster — eller ny rad från höger!';
        fb.className = 'feedback no center';
      }
    };
    cells.push(cell);
    grid.appendChild(cell);
  }
  host.appendChild(grid);
  host.appendChild(fb);
}

// ---------- MANGA-LÄSAREN ----------
export function renderManga(root, nav, { mangaId }) {
  const manga = MANGA.find(m => m.id === mangaId);
  topbar(root, nav, manga.title + ' — ' + manga.titleSv);
  root.appendChild(el('div', 'prompt-label center', 'Peka på rutorna i läsordning: uppe till höger → vänster. Texten dyker upp under mangan — tryck fram romaji och svenska om du behöver!'));

  const grid = el('div', 'manga-grid');
  const fb = el('div', 'feedback center');
  const info = el('div');
  let expected = 0, mistakes = 0;
  let currentPanel = -1;
  let showR = S.settings.showRomaji !== false, showSv = false;

  // Infopanelen: aktuell rutas repliker med tryck-fram romaji + svenska
  const renderInfo = () => {
    info.innerHTML = '';
    if (currentPanel < 0) return;
    const p = manga.panels[currentPanel];
    const card = el('div', 'gram-card');
    card.appendChild(el('h3', null, `Ruta ${currentPanel + 1}`));
    for (const line of p.lines) {
      const row = el('div', 'example');
      row.innerHTML = `<div class="info"><div class="jp-line">${escapeHTML(line.jp)}</div>` +
        (showR ? `<div class="romaji">${escapeHTML(sentenceRomaji(line.jp))}</div>` : '') +
        (showSv ? `<div class="sv">${escapeHTML(line.sv)}</div>` : '') + '</div>';
      const b = el('button', 'speakbtn', '🔊');
      b.onclick = () => speak(line.jp, { rate: S.settings.slowAudio ? 0.7 : 0.85 });
      row.appendChild(b);
      card.appendChild(row);
    }
    if (p.sfx) {
      card.appendChild(el('div', 'prompt-label',
        `💥 Ljudord: <span class="jp">${escapeHTML(p.sfx.jp)}</span>` +
        (showSv ? ' = ' + escapeHTML(p.sfx.sv) : '')));
    }
    const tools = el('div', 'drawtools');
    const rBtn = el('button', 'btn secondary small', showR ? 'Dölj romaji' : 'Romaji');
    rBtn.onclick = () => { showR = !showR; renderInfo(); };
    const svBtn = el('button', 'btn secondary small', showSv ? 'Dölj svenska' : 'Svenska');
    svBtn.onclick = () => { showSv = !showSv; renderInfo(); };
    tools.appendChild(rBtn); tools.appendChild(svBtn);
    card.appendChild(tools);
    info.appendChild(card);
  };

  manga.panels.forEach((p, i) => {
    const panel = el('button', 'manga-panel hidden-panel');
    panel.innerHTML = '<span class="p-q">？</span>';
    const reveal = () => {
      panel.innerHTML =
        (p.pic ? `<img class="p-pic" src="${p.pic}" alt="">` : `<span class="p-img">${escapeHTML(p.img)}</span>`) +
        (p.sfx ? `<span class="p-sfx jp">${escapeHTML(p.sfx.jp)}</span>` : '') +
        `<span class="p-bubble jp">${escapeHTML(p.lines.map(l => l.jp).join('\n'))}</span>`;
    };
    panel.onclick = () => {
      if (i < expected) { // redan läst → visa i infopanelen + spela igen
        currentPanel = i;
        renderInfo();
        speak(p.lines.map(l => l.jp).join(' '), { rate: 0.85 });
        return;
      }
      if (i === expected) {
        panel.classList.remove('hidden-panel');
        panel.classList.add('read');
        reveal();
        speak(p.lines.map(l => l.jp).join(' '), { rate: 0.85 });
        expected++;
        currentPanel = i;
        renderInfo();
        fb.textContent = '';
        if (expected === manga.panels.length) finish();
      } else {
        mistakes++;
        panel.classList.add('shake');
        setTimeout(() => panel.classList.remove('shake'), 350);
        fb.textContent = 'Fel ordning! Höger före vänster, uppe före nere.';
        fb.className = 'feedback no center';
      }
    };
    grid.appendChild(panel);
  });
  root.appendChild(grid);
  root.appendChild(fb);
  root.appendChild(info);

  function finish() {
    confetti();
    // Recap: alla repliker med översättning + vidare till frågorna
    const recap = el('div');
    recap.appendChild(el('div', 'sectionlabel', '📝 Vad sa de? (i läsordning)'));
    manga.panels.forEach((p, i) => {
      for (const line of p.lines) {
        const row = el('div', 'example');
        row.innerHTML = `<div class="info"><div class="jp-line">${i + 1}. ${escapeHTML(line.jp)}</div>` +
          `<div class="romaji">${escapeHTML(sentenceRomaji(line.jp))}</div>` +
          `<div class="sv">${escapeHTML(line.sv)}${p.sfx && p.lines[0] === line ? ' · ' + escapeHTML(p.sfx.jp) + ' = ' + escapeHTML(p.sfx.sv) : ''}</div></div>`;
        const b = el('button', 'speakbtn', '🔊');
        b.onclick = () => speak(line.jp, { rate: 0.85 });
        row.appendChild(b);
        recap.appendChild(row);
      }
    });
    const row = el('div', 'continue-row center');
    const quizBtn = el('button', 'btn', '❓ Frågor! ›');
    quizBtn.onclick = () => startQuiz();
    row.appendChild(quizBtn);
    recap.appendChild(row);
    root.appendChild(recap);
    recap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Läs- och ordförståelsetest efter mangan — stjärnorna sätts här
  function startQuiz() {
    stopSpeech();
    root.innerHTML = '';
    topbar(root, nav, manga.titleSv + ' — frågor');
    root.appendChild(el('div', 'sectionlabel center', '❓ Förstod du mangan?'));
    const host = el('div');
    root.appendChild(host);

    const vocabPool = MANGA.flatMap(m => m.vocab || []);
    const qs = [
      ...(manga.questions || []).map(q => {
        const opts = q.opts.map((o, i) => ({ o, i }));
        const shuffled = shuffle(opts);
        return mcQ({
          prompt: escapeHTML(q.q),
          options: shuffled.map(x => ({ label: x.o })),
          correctIdx: shuffled.findIndex(x => x.i === q.correct),
        });
      }),
      ...(manga.vocab || []).map(v => {
        const { options, correctIdx } = mcOptions(v, vocabPool, 3, x => x.sv);
        return mcQ({
          prompt: 'Ordet fanns i mangan — vad betyder det?',
          promptJP: v.jp, speakText: v.jp, autoSpeak: true,
          options: options.map(o => ({ label: o.sv })), correctIdx,
        });
      }),
    ];
    runDrill(host, shuffle(qs), {
      gradeSRS: false,
      onFinish(res) {
        const acc = res.correctFirstTry / res.total;
        const stars = acc >= 0.99 ? 3 : acc >= 0.6 ? 2 : 1;
        setLessonStars(mangaId, stars);
        addXP(12 + stars * 4);
        touchStreak();
        track('lesson', 1);
        checkAchievements();
        confetti();
        const idx = MANGA.findIndex(m => m.id === mangaId);
        const nextM = MANGA[idx + 1];
        nav.go('result', {
          title: manga.titleSv + ' — läst!', stars,
          detail: `${res.correctFirstTry} av ${res.total} rätt på frågorna` +
            (mistakes > 0 ? ` · ${mistakes} felklick i läsordningen` : ' · perfekt läsordning!'),
          backTo: 'reading',
          nextTo: nextM ? 'manga' : null, nextParams: nextM ? { mangaId: nextM.id } : null,
          nextLabel: 'Nästa manga ›',
        });
      },
    });
  }
}

// ---------- SAGOLÄSAREN (sagor + Läs-stegen) ----------
export function renderStory(root, nav, { storyId }) {
  const story = STORIES.find(s => s.id === storyId) || LADDER_STORIES.find(s => s.id === storyId);
  const isLadder = story.id.startsWith('ladder-');
  if (isLadder && understoodCount() < story.req) { nav.go('reading'); return; }
  topbar(root, nav, story.title + ' — ' + story.titleSv);
  const host = el('div');
  root.appendChild(host);
  let page = 0;
  let showRomaji = S.settings.showRomaji !== false, showSv = false;

  const render = () => {
    stopSpeech();
    host.innerHTML = '';
    const p = story.pages[page];
    const ex = el('div', 'exercise');
    ex.appendChild(el('div', 'prompt-label', `Sida ${page + 1} av ${story.pages.length}`));
    if (story.cover) ex.appendChild(Object.assign(document.createElement('img'), { className: 'story-pic', src: story.cover, alt: '' }));
    else ex.appendChild(el('div', 'story-img', escapeHTML(p.img)));
    ex.appendChild(el('div', 'story-text jp', escapeHTML(p.jp)));
    const romajiEl = el('div', 'kana-preview', showRomaji ? escapeHTML(sentenceRomaji(p.jp)) : '');
    ex.appendChild(romajiEl);
    const svEl = el('div', 'story-sv', showSv ? escapeHTML(p.sv) : '');
    ex.appendChild(svEl);

    const tools = el('div', 'drawtools');
    const hear = el('button', 'btn secondary small', '🔊 Lyssna');
    hear.onclick = () => speak(p.jp, { rate: S.settings.slowAudio ? 0.7 : 0.82 });
    const rBtn = el('button', 'btn secondary small', showRomaji ? 'Dölj romaji' : 'Romaji');
    rBtn.onclick = () => { showRomaji = !showRomaji; render(); };
    const svBtn = el('button', 'btn secondary small', showSv ? 'Dölj svenska' : 'Svenska');
    svBtn.onclick = () => { showSv = !showSv; render(); };
    tools.appendChild(hear); tools.appendChild(rBtn); tools.appendChild(svBtn);
    ex.appendChild(tools);

    const row = el('div', 'continue-row');
    if (page > 0) {
      const prev = el('button', 'btn secondary', '‹ Förra');
      prev.onclick = () => { page--; render(); };
      row.appendChild(prev);
      row.appendChild(document.createTextNode(' '));
    }
    const next = el('button', 'btn', page + 1 < story.pages.length ? 'Nästa sida ›' : 'Frågor! ›');
    next.onclick = () => {
      if (page + 1 < story.pages.length) { page++; render(); }
      else startQuestions();
    };
    row.appendChild(next);
    ex.appendChild(row);
    host.appendChild(ex);
    if (S.settings.autoplay) setTimeout(() => speak(p.jp, { rate: 0.82 }), 350);
  };

  const startQuestions = () => {
    stopSpeech();
    host.innerHTML = '';
    host.appendChild(el('div', 'sectionlabel center', '❓ Förstod du sagan?'));
    const qs = shuffle(story.questions).map(q => {
      const opts = q.opts.map((o, i) => ({ o, i }));
      const shuffled = shuffle(opts);
      return mcQ({
        prompt: escapeHTML(q.q),
        options: shuffled.map(x => ({ label: x.o })),
        correctIdx: shuffled.findIndex(x => x.i === q.correct),
      });
    });
    runDrill(host, qs, {
      gradeSRS: false,
      onFinish(res) {
        const acc = res.correctFirstTry / res.total;
        const stars = acc >= 0.99 ? 3 : acc >= 0.6 ? 2 : 1;
        setLessonStars(storyId, stars);
        addXP(12 + stars * 4);
        touchStreak();
        track('lesson', 1);
        checkAchievements();
        confetti();
        const list = isLadder ? LADDER_STORIES : STORIES;
        const idx = list.findIndex(s => s.id === storyId);
        let nextS = list[idx + 1];
        if (isLadder && nextS && understoodCount() < nextS.req) nextS = null; // nästa steg ännu låst
        nav.go('result', {
          title: story.titleSv + ' — läst!', stars,
          detail: `${res.correctFirstTry} av ${res.total} rätt på frågorna`,
          backTo: 'reading',
          nextTo: nextS ? 'story' : null, nextParams: nextS ? { storyId: nextS.id } : null,
          nextLabel: 'Nästa text ›',
        });
      },
    });
  };

  render();
}
