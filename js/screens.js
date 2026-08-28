// screens — alla vyer utom provläget.

import { el, starsHTML, confetti, escapeHTML } from './ui.js';
import { speak, stopSpeech, hasJapaneseVoice, voiceName } from './audio.js';
import { S, save, addXP, rank, touchStreak, streakDays, srsAdd, srsDue, srsStats, srsBox,
         setLessonStars, lessonStars, resetAll } from './state.js';
import { runDrill, kanaDrill, vocabDrill, kanjiDrill, mcQ, typeQ, drawQ, matchingGame, mcOptions } from './exercises.js';
import { kanaLessonsFor, allKanaItems, HIRAGANA, KATAKANA } from '../data/kana.js';
import { VOCAB, VOCAB_CATEGORIES } from '../data/vocab.js';
import { KANJI_LESSONS, allKanji } from '../data/kanji.js';
import { GRAMMAR_LESSONS } from '../data/grammar.js';
import { pick, shuffle, kanaToRomaji } from './kanaUtils.js';

const CHUNK = 8; // ord per ordförrådslektion (forskning: 5–10 nya/dag)

// ---------- gemensamt ----------
function topbar(root, nav, title, backTo = 'home', backParams) {
  const bar = el('div', 'topbar');
  const back = el('button', 'back', '‹');
  back.onclick = () => { stopSpeech(); nav.go(backTo, backParams); };
  bar.appendChild(back);
  bar.appendChild(el('h1', null, escapeHTML(title)));
  root.appendChild(bar);
  return bar;
}

function audioNotice(root) {
  // Röster laddas asynkront — visa varningen först när de fått chans att ladda,
  // och göm den direkt om en japansk röst dyker upp.
  const box = el('div', 'notice',
    '🔇 <b>Ingen japansk röst hittades.</b> Ljudet är viktigt för inlärningen! ' +
    'Prova webbläsaren <b>Edge</b> eller <b>Chrome</b>, eller lägg till japanska som språk i Windows: ' +
    'Inställningar → Tid och språk → Språk → Lägg till japanska.');
  box.style.display = 'none';
  root.appendChild(box);
  const checks = [400, 1000, 2000, 3500, 5000];
  checks.forEach((t, i) => setTimeout(() => {
    if (!box.isConnected) return;
    if (hasJapaneseVoice()) box.style.display = 'none';
    else if (i === checks.length - 1) box.style.display = '';
  }, t));
}

// ---------- HEM ----------
export function renderHome(root, nav) {
  const r = rank();
  const hero = el('div', 'hero');
  hero.appendChild(el('div', 'torii', '⛩️'));
  hero.appendChild(el('h1', null, 'Nihongo Quest'));
  hero.appendChild(el('div', 'sub', 'Vägen till JLPT — japanska från noll'));
  root.appendChild(hero);

  const chips = el('div', 'statchips', '');
  chips.style.justifyContent = 'center';
  chips.innerHTML =
    `<span class="chip">${r.emoji} ${escapeHTML(r.name)}</span>` +
    `<span class="chip">⚡ <b>${S.xp}</b> XP</span>` +
    `<span class="chip">🔥 <b>${streakDays()}</b> dagar</span>`;
  root.appendChild(chips);

  // Nivåväljare N5–N1
  const lv = el('div', 'levelbar');
  for (const level of ['N5', 'N4', 'N3', 'N2', 'N1']) {
    const b = el('button', 'levelbtn' + (level === 'N5' ? ' active' : ' locked'), level);
    if (level !== 'N5') {
      b.title = 'Kommer när N5 är avklarad!';
      b.onclick = () => alert(level + ' låses upp i en framtida version — klara N5-provet först! 頑張って！');
    }
    lv.appendChild(b);
  }
  root.appendChild(lv);
  audioNotice(root);

  // Dagens träning (SRS)
  const due = srsDue().length;
  const daily = el('div', 'daily');
  daily.innerHTML = `<div class="icon">${due > 0 ? '🏮' : '✅'}</div>
    <div class="info"><b>${due > 0 ? 'Dagens repetition' : 'Inget att repetera just nu'}</b>
    <div class="sub">${due > 0 ? due + ' kort väntar — repetition vid rätt tillfälle är superkraften!' : 'Kom tillbaka senare, eller lär dig något nytt nedan.'}</div></div>`;
  const startBtn = el('button', 'btn', due > 0 ? 'Repetera' : 'Öva ändå');
  startBtn.onclick = () => nav.go('review');
  const st = srsStats();
  if (st.total === 0) { startBtn.disabled = true; startBtn.textContent = 'Lär dig först!'; }
  daily.appendChild(startBtn);
  root.appendChild(daily);

  // Moduler
  const mods = el('div', 'modules');
  const hiraLessons = kanaLessonsFor('hira'), kataLessons = kanaLessonsFor('kata');
  const hiraDone = hiraLessons.filter(l => lessonStars(l.id) > 0).length;
  const kataDone = kataLessons.filter(l => lessonStars(l.id) > 0).length;
  const vocabInSrs = VOCAB.filter(w => srsBox(w.id) >= 0).length;
  const kanjiDone = KANJI_LESSONS.filter(l => lessonStars(l.id) > 0).length;
  const gramDone = GRAMMAR_LESSONS.filter(l => lessonStars(l.id) > 0).length;

  const items = [
    { emoji:'🌸', name:'Hiragana', desc:'Grundskriften — börja här!', pct: hiraDone / hiraLessons.length, go:['kana', { script:'hira' }] },
    { emoji:'⚡', name:'Katakana', desc:'För lånord — kaffe, spel, Sverige…', pct: kataDone / kataLessons.length, go:['kana', { script:'kata' }] },
    { emoji:'🍜', name:'Ordförråd', desc: vocabInSrs + ' av ' + VOCAB.length + ' N5-ord påbörjade', pct: vocabInSrs / VOCAB.length, go:['vocab'] },
    { emoji:'🖌️', name:'Kanji', desc:'80 N5-kanji med exempel', pct: kanjiDone / KANJI_LESSONS.length, go:['kanjiModule'] },
    { emoji:'🧩', name:'Grammatik', desc:'Partiklar, verb & adjektiv', pct: gramDone / GRAMMAR_LESSONS.length, go:['grammarModule'] },
    { emoji:'🎓', name:'JLPT N5-prov', desc: S.bestTest ? `Bästa: ${S.bestTest.score}/180 ${S.bestTest.pass ? '✔ godkänd' : ''}` : 'Testa dig som på riktiga provet', pct: S.bestTest?.pass ? 1 : 0, go:['testIntro'] },
  ];
  for (const m of items) {
    const card = el('button', 'module');
    card.innerHTML = `<div class="head"><span class="emoji">${m.emoji}</span><span class="name">${m.name}</span></div>
      <div class="desc">${escapeHTML(m.desc)}</div>
      <div class="progressbar"><div style="width:${Math.round(m.pct * 100)}%"></div></div>
      <div class="pct">${Math.round(m.pct * 100)} %</div>`;
    card.onclick = () => nav.go(...m.go);
    mods.appendChild(card);
  }
  root.appendChild(mods);

  const foot = el('div', 'center mt');
  const setBtn = el('button', 'btn secondary small', '⚙️ Inställningar');
  setBtn.onclick = () => nav.go('settings');
  foot.appendChild(setBtn);
  root.appendChild(foot);
}

// ---------- KANA-MODUL ----------
export function renderKanaModule(root, nav, { script }) {
  const name = script === 'hira' ? 'Hiragana' : 'Katakana';
  topbar(root, nav, name + ' ' + (script === 'hira' ? 'ひらがな' : 'カタカナ'));
  const lessons = kanaLessonsFor(script);

  const tools = el('div', 'center');
  const tableBtn = el('button', 'btn secondary small', '📜 Teckentabell');
  tableBtn.onclick = () => nav.go('kanaTable', { script });
  tools.appendChild(tableBtn);
  const learned = allKanaItems().filter(i => i.script === script && srsBox(i.id) >= 0);
  if (learned.length >= 8) {
    const matchBtn = el('button', 'btn secondary small', '🃏 Blixtmatch');
    matchBtn.style.marginLeft = '8px';
    matchBtn.onclick = () => nav.go('kanaMatch', { script });
    tools.appendChild(matchBtn);
  }
  root.appendChild(tools);
  root.appendChild(el('div', 'sectionlabel', 'Lektioner — ca 5 tecken i taget'));

  const list = el('div', 'lessonlist');
  lessons.forEach((l, i) => {
    const unlocked = i === 0 || lessonStars(lessons[i - 1].id) > 0;
    const row = el('button', 'lesson-row' + (unlocked ? '' : ' locked'));
    const preview = (l.chars || []).slice(0, 8).map(c => c.k).join(' ') || (l.words || []).map(w => w.k).slice(0, 4).join(' ');
    row.innerHTML = `<span class="num">${unlocked ? i + 1 : '🔒'}</span>
      <span class="mid"><span class="title">${escapeHTML(l.title)}</span>
      <span class="preview jp">${escapeHTML(preview)}</span></span>
      ${starsHTML(lessonStars(l.id))}`;
    if (unlocked) row.onclick = () => nav.go('kanaLesson', { lessonId: l.id });
    list.appendChild(row);
  });
  root.appendChild(list);
}

export function renderKanaTable(root, nav, { script }) {
  const name = script === 'hira' ? 'Hiragana' : 'Katakana';
  topbar(root, nav, name + '-tabellen', 'kana', { script });
  root.appendChild(el('div', 'prompt-label center', 'Klicka på ett tecken för att höra det. Guldram = mästrad i repetitionen.'));
  const base = script === 'hira' ? HIRAGANA : KATAKANA;
  // Gojūon-layout: 5 kolumner (a i u e o), en rad per konsonant. ん får egen rad.
  const table = el('div', 'kanatable');
  const rows = [
    base.slice(0, 5), base.slice(5, 10), base.slice(10, 15), base.slice(15, 20),
    base.slice(20, 25), base.slice(25, 30), base.slice(30, 35),
    [base[35], null, base[36], null, base[37]],           // や ゆ よ
    base.slice(38, 43),                                    // ら-raden
    [base[43], null, null, null, base[44]],                // わ を
    [base[45], null, null, null, null],                    // ん
  ];
  for (const row of rows) {
    for (const c of row) {
      if (!c) { table.appendChild(el('span', 'kanacell empty', '·')); continue; }
      const cell = el('button', 'kanacell' + (srsBox('k_' + c.k) >= 6 ? ' mastered' : ''));
      cell.innerHTML = `<span class="g">${c.k}</span><span class="r">${c.r}</span>`;
      cell.onclick = () => speak(c.k, { rate: S.settings.slowAudio ? 0.7 : 0.9 });
      table.appendChild(cell);
    }
  }
  root.appendChild(table);
}

export function renderKanaMatch(root, nav, { script }) {
  topbar(root, nav, 'Blixtmatch', 'kana', { script });
  const learned = allKanaItems().filter(i => i.script === script && srsBox(i.id) >= 0);
  const chosen = pick(learned, 8);
  matchingGame(root, chosen.map(c => ({ a: c.k, b: c.r })), {
    onFinish({ mistakes, secs }) {
      addXP(Math.max(4, 16 - mistakes * 2));
      touchStreak();
      confetti();
      nav.go('result', {
        title: 'Blixtmatch klar!', stars: mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1,
        detail: `${secs} sekunder, ${mistakes} felklick`,
        backTo: 'kana', backParams: { script },
      });
    },
  });
}

export function renderKanaLesson(root, nav, { lessonId }) {
  const lesson = kanaLessonsFor('hira').concat(kanaLessonsFor('kata')).find(l => l.id === lessonId);
  const backParams = { script: lesson.script };
  topbar(root, nav, lesson.title, 'kana', backParams);
  const host = el('div');
  root.appendChild(host);

  const chars = lesson.chars || [];
  const words = lesson.words || [];
  const pool = (lesson.script === 'hira' ? HIRAGANA : KATAKANA).concat(chars);

  // Fas 1: introkort — se, hör, läs minnesbilden
  let i = 0;
  const showIntro = () => {
    host.innerHTML = '';
    if (lesson.intro && i === 0) {
      const box = el('div', 'gram-card');
      box.innerHTML = `<h3>💡 Nytt!</h3><p>${escapeHTML(lesson.intro)}</p>`;
      host.appendChild(box);
    }
    if (i >= chars.length) { startWordsOrDrill(); return; }
    const c = chars[i];
    const ex = el('div', 'exercise');
    ex.appendChild(el('div', 'prompt-label', `Nytt tecken ${i + 1} av ${chars.length}`));
    ex.appendChild(el('div', 'bigglyph', escapeHTML(c.k)));
    ex.appendChild(el('div', 'romaji-big', escapeHTML(c.r)));
    const sp = el('button', 'speakbtn', '🔊');
    sp.onclick = () => speak(c.k, { rate: S.settings.slowAudio ? 0.7 : 0.9 });
    ex.appendChild(sp);
    ex.appendChild(el('div', 'mnemonic', `<span class="label">Minnesbild</span>${escapeHTML(c.m)}`));
    const row = el('div', 'continue-row');
    if (i > 0) {
      const prev = el('button', 'btn secondary', '‹ Förra');
      prev.onclick = () => { i--; showIntro(); };
      row.appendChild(prev);
      row.appendChild(document.createTextNode(' '));
    }
    const next = el('button', 'btn', i + 1 < chars.length ? 'Nästa tecken ›' : 'Dags att öva! ›');
    next.onclick = () => { i++; showIntro(); };
    row.appendChild(next);
    ex.appendChild(row);
    host.appendChild(ex);
    if (S.settings.autoplay) setTimeout(() => speak(c.k, { rate: 0.8 }), 300);
  };

  // Fas 1b: ordlektioner (t.ex. små っ-ord)
  const startWordsOrDrill = () => {
    for (const c of chars) srsAdd('k_' + c.k);
    if (words.length && chars.length === 0) { runWordIntro(); return; }
    startDrill();
  };
  let wi = 0;
  const runWordIntro = () => {
    host.innerHTML = '';
    if (wi >= words.length) { startWordDrill(); return; }
    const w = words[wi];
    const ex = el('div', 'exercise');
    ex.appendChild(el('div', 'prompt-label', `Ord ${wi + 1} av ${words.length}`));
    ex.appendChild(el('div', 'medglyph', escapeHTML(w.k)));
    ex.appendChild(el('div', 'kana-preview', escapeHTML(kanaToRomaji(w.k))));
    ex.appendChild(el('div', 'romaji-big', escapeHTML(w.sv)));
    const sp = el('button', 'speakbtn', '🔊');
    sp.onclick = () => speak(w.k, { rate: 0.8 });
    ex.appendChild(sp);
    const row = el('div', 'continue-row');
    if (wi > 0) {
      const prev = el('button', 'btn secondary', '‹ Förra');
      prev.onclick = () => { wi--; runWordIntro(); };
      row.appendChild(prev);
      row.appendChild(document.createTextNode(' '));
    }
    const next = el('button', 'btn', wi + 1 < words.length ? 'Nästa ›' : 'Öva! ›');
    next.onclick = () => { wi++; runWordIntro(); };
    row.appendChild(next);
    ex.appendChild(row);
    host.appendChild(ex);
    if (S.settings.autoplay) setTimeout(() => speak(w.k, { rate: 0.8 }), 300);
  };
  const startWordDrill = () => {
    host.innerHTML = '';
    const qs = shuffle(words.flatMap(w => [
      typeQ({ prompt: `Skriv med romaji (betyder "${w.sv}"):`, promptJP: w.k, speakText: w.k, targetKana: w.k }),
    ]));
    runDrill(host, qs, { onFinish: finish });
  };

  // Fas 2: drill
  const startDrill = () => {
    host.innerHTML = '';
    const drillChars = chars.length > 10 ? pick(chars, 10) : chars;
    const qs = kanaDrill(drillChars, pool, { perChar: chars.length > 8 ? 1 : 2 });
    if (words.length) {
      for (const w of pick(words, 3)) {
        qs.push(typeQ({ prompt: `Skriv med romaji (betyder "${w.sv}"):`, promptJP: w.k, speakText: w.k, targetKana: w.k }));
      }
    }
    runDrill(host, shuffle(qs), {
      onFinish(res) {
        if (chars.length > 0 && chars.length <= 8 && chars[0].k.length === 1) startWriting(res);
        else finish(res);
      },
    });
  };

  // Fas 3: skrivträning (motoriskt minne)
  const startWriting = (drillRes) => {
    host.innerHTML = '';
    host.appendChild(el('div', 'sectionlabel center', '✍️ Skrivträning — sista momentet!'));
    const wq = chars.slice(0, 5).map(c => drawQ({ glyph: c.k, label: c.r, speakText: c.k }));
    runDrill(host, wq, {
      gradeSRS: false,
      onFinish(res) {
        finish({ correctFirstTry: drillRes.correctFirstTry + res.correctFirstTry,
                 total: drillRes.total + res.total });
      },
    });
  };

  const finish = (res) => {
    const acc = res.total ? res.correctFirstTry / res.total : 1;
    const stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
    setLessonStars(lessonId, stars);
    addXP(10 + stars * 5);
    touchStreak();
    confetti();
    const lessons = kanaLessonsFor(lesson.script);
    const idx = lessons.findIndex(l => l.id === lessonId);
    const nextLesson = lessons[idx + 1];
    nav.go('result', {
      title: lesson.title + ' klar!', stars,
      detail: `${res.correctFirstTry} av ${res.total} rätt på första försöket`,
      backTo: 'kana', backParams,
      nextTo: nextLesson ? 'kanaLesson' : null, nextParams: nextLesson ? { lessonId: nextLesson.id } : null,
    });
  };

  if (chars.length) showIntro();
  else startWordsOrDrill();
}

// ---------- ORDFÖRRÅD ----------
export function renderVocabModule(root, nav) {
  topbar(root, nav, 'Ordförråd — JLPT N5');
  root.appendChild(el('div', 'prompt-label center', VOCAB.length + ' ord i ' + VOCAB_CATEGORIES.length + ' teman. Ca 8 nya ord per lektion.'));
  const list = el('div', 'lessonlist');
  for (const cat of VOCAB_CATEGORIES) {
    const words = VOCAB.filter(w => w.cat === cat.id);
    const started = words.filter(w => srsBox(w.id) >= 0).length;
    const row = el('button', 'lesson-row');
    row.innerHTML = `<span class="num">${cat.emoji}</span>
      <span class="mid"><span class="title">${escapeHTML(cat.name)}</span>
      <span class="preview">${started}/${words.length} ord · ${escapeHTML(words.slice(0, 3).map(w => w.sv).join(', '))}…</span></span>
      <span class="stars">${started === words.length ? '✅' : ''}</span>`;
    row.onclick = () => nav.go('vocabCat', { catId: cat.id });
    list.appendChild(row);
  }
  root.appendChild(list);
}

export function renderVocabCat(root, nav, { catId }) {
  const cat = VOCAB_CATEGORIES.find(c => c.id === catId);
  topbar(root, nav, cat.emoji + ' ' + cat.name, 'vocab');
  const words = VOCAB.filter(w => w.cat === catId);
  const chunks = [];
  for (let i = 0; i < words.length; i += CHUNK) chunks.push(words.slice(i, i + CHUNK));
  const list = el('div', 'lessonlist');
  chunks.forEach((chunk, i) => {
    const lid = 'vocab-' + catId + '-' + i;
    const unlocked = i === 0 || lessonStars('vocab-' + catId + '-' + (i - 1)) > 0;
    const row = el('button', 'lesson-row' + (unlocked ? '' : ' locked'));
    row.innerHTML = `<span class="num">${unlocked ? i + 1 : '🔒'}</span>
      <span class="mid"><span class="title">Lektion ${i + 1}</span>
      <span class="preview jp">${escapeHTML(chunk.slice(0, 4).map(w => w.kana).join('、'))}</span></span>
      ${starsHTML(lessonStars(lid))}`;
    if (unlocked) row.onclick = () => nav.go('vocabLesson', { catId, chunk: i });
    list.appendChild(row);
  });
  root.appendChild(list);
}

export function renderVocabLesson(root, nav, { catId, chunk }) {
  const cat = VOCAB_CATEGORIES.find(c => c.id === catId);
  topbar(root, nav, cat.name + ' — lektion ' + (chunk + 1), 'vocabCat', { catId });
  const host = el('div');
  root.appendChild(host);
  const words = VOCAB.filter(w => w.cat === catId).slice(chunk * CHUNK, chunk * CHUNK + CHUNK);
  const lid = 'vocab-' + catId + '-' + chunk;

  let i = 0;
  const showIntro = () => {
    host.innerHTML = '';
    if (i >= words.length) { startDrill(); return; }
    const w = words[i];
    const ex = el('div', 'exercise');
    ex.appendChild(el('div', 'prompt-label', `Nytt ord ${i + 1} av ${words.length}`));
    ex.appendChild(el('div', 'medglyph', escapeHTML(w.kana)));
    ex.appendChild(el('div', 'kana-preview', escapeHTML(kanaToRomaji(w.kana))));
    if (w.kanji) ex.appendChild(el('div', 'prompt-label', 'Med kanji: <span class="jp" style="font-size:1.4rem">' + escapeHTML(w.kanji) + '</span>'));
    ex.appendChild(el('div', 'romaji-big', escapeHTML(w.sv)));
    const sp = el('button', 'speakbtn', '🔊');
    sp.onclick = () => speak(w.kana, { rate: S.settings.slowAudio ? 0.7 : 0.9 });
    ex.appendChild(sp);
    if (w.ex) {
      const exm = el('div', 'example');
      exm.innerHTML = `<div class="info"><div class="jp-line">${escapeHTML(w.ex.jp)}</div><div class="sv">${escapeHTML(w.ex.sv)}</div></div>`;
      const b = el('button', 'speakbtn', '🔊');
      b.onclick = () => speak(w.ex.jp, { rate: 0.85 });
      exm.appendChild(b);
      exm.style.maxWidth = '480px'; exm.style.margin = '14px auto';
      ex.appendChild(exm);
    }
    const row = el('div', 'continue-row');
    if (i > 0) {
      const prev = el('button', 'btn secondary', '‹ Förra');
      prev.onclick = () => { i--; showIntro(); };
      row.appendChild(prev);
      row.appendChild(document.createTextNode(' '));
    }
    const next = el('button', 'btn', i + 1 < words.length ? 'Nästa ord ›' : 'Öva! ›');
    next.onclick = () => { i++; showIntro(); };
    row.appendChild(next);
    ex.appendChild(row);
    host.appendChild(ex);
    if (S.settings.autoplay) setTimeout(() => speak(w.kana, { rate: 0.85 }), 300);
  };

  const startDrill = () => {
    for (const w of words) srsAdd(w.id);
    host.innerHTML = '';
    runDrill(host, vocabDrill(words, VOCAB), {
      onFinish(res) {
        const acc = res.correctFirstTry / res.total;
        const stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
        setLessonStars(lid, stars);
        addXP(10 + stars * 5);
        touchStreak();
        confetti();
        const total = VOCAB.filter(w => w.cat === catId).length;
        const hasNext = (chunk + 1) * CHUNK < total;
        nav.go('result', {
          title: 'Lektion klar!', stars,
          detail: `${res.correctFirstTry} av ${res.total} rätt på första försöket`,
          backTo: 'vocabCat', backParams: { catId },
          nextTo: hasNext ? 'vocabLesson' : null, nextParams: hasNext ? { catId, chunk: chunk + 1 } : null,
        });
      },
    });
  };
  showIntro();
}

// ---------- KANJI ----------
export function renderKanjiModule(root, nav) {
  topbar(root, nav, 'Kanji — 80 N5-tecken');
  const list = el('div', 'lessonlist');
  KANJI_LESSONS.forEach((l, i) => {
    const unlocked = i === 0 || lessonStars(KANJI_LESSONS[i - 1].id) > 0;
    const row = el('button', 'lesson-row' + (unlocked ? '' : ' locked'));
    row.innerHTML = `<span class="num">${unlocked ? i + 1 : '🔒'}</span>
      <span class="mid"><span class="title">${escapeHTML(l.title)}</span>
      <span class="preview jp">${l.kanji.map(k => k.c).join(' ')}</span></span>
      ${starsHTML(lessonStars(l.id))}`;
    if (unlocked) row.onclick = () => nav.go('kanjiLesson', { lessonId: l.id });
    list.appendChild(row);
  });
  root.appendChild(list);
}

export function renderKanjiLesson(root, nav, { lessonId }) {
  const lesson = KANJI_LESSONS.find(l => l.id === lessonId);
  topbar(root, nav, lesson.title, 'kanjiModule');
  const host = el('div');
  root.appendChild(host);
  const all = allKanji();

  let i = 0;
  const showIntro = () => {
    host.innerHTML = '';
    if (i >= lesson.kanji.length) { startDrill(); return; }
    const k = lesson.kanji[i];
    const ex = el('div', 'exercise');
    ex.appendChild(el('div', 'prompt-label', `Kanji ${i + 1} av ${lesson.kanji.length}`));
    ex.appendChild(el('div', 'bigglyph', k.c));
    ex.appendChild(el('div', 'romaji-big', escapeHTML(k.sv)));
    const romajiOf = s => s === '—' ? '' : ` <span style="color:var(--gold)">(${escapeHTML(kanaToRomaji(s))})</span>`;
    ex.appendChild(el('div', 'prompt-label',
      `on: <b>${escapeHTML(k.on)}</b>${romajiOf(k.on)} · kun: <b>${escapeHTML(k.kun)}</b>${romajiOf(k.kun)}`));
    for (const e of k.ex) {
      const exm = el('div', 'example');
      exm.innerHTML = `<div class="info"><div class="jp-line">${escapeHTML(e.w)}（${escapeHTML(e.r)}）</div><div class="romaji">${escapeHTML(kanaToRomaji(e.r))}</div><div class="sv">${escapeHTML(e.sv)}</div></div>`;
      const b = el('button', 'speakbtn', '🔊');
      b.onclick = () => speak(e.r, { rate: 0.85 });
      exm.appendChild(b);
      exm.style.maxWidth = '440px'; exm.style.margin = '10px auto';
      ex.appendChild(exm);
    }
    const row = el('div', 'continue-row');
    if (i > 0) {
      const prev = el('button', 'btn secondary', '‹ Förra');
      prev.onclick = () => { i--; showIntro(); };
      row.appendChild(prev);
      row.appendChild(document.createTextNode(' '));
    }
    const next = el('button', 'btn', i + 1 < lesson.kanji.length ? 'Nästa kanji ›' : 'Öva! ›');
    next.onclick = () => { i++; showIntro(); };
    row.appendChild(next);
    ex.appendChild(row);
    host.appendChild(ex);
    if (S.settings.autoplay && k.ex[0]) setTimeout(() => speak(k.ex[0].r, { rate: 0.85 }), 300);
  };

  const startDrill = () => {
    for (const k of lesson.kanji) srsAdd('kj_' + k.c);
    host.innerHTML = '';
    runDrill(host, kanjiDrill(lesson.kanji, all), {
      onFinish(res) {
        const acc = res.correctFirstTry / res.total;
        const stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
        setLessonStars(lessonId, stars);
        addXP(12 + stars * 5);
        touchStreak();
        confetti();
        const idx = KANJI_LESSONS.findIndex(l => l.id === lessonId);
        const nextL = KANJI_LESSONS[idx + 1];
        nav.go('result', {
          title: lesson.title + ' klar!', stars,
          detail: `${res.correctFirstTry} av ${res.total} rätt på första försöket`,
          backTo: 'kanjiModule',
          nextTo: nextL ? 'kanjiLesson' : null, nextParams: nextL ? { lessonId: nextL.id } : null,
        });
      },
    });
  };
  showIntro();
}

// ---------- GRAMMATIK ----------
export function renderGrammarModule(root, nav) {
  topbar(root, nav, 'Grammatik — N5');
  const list = el('div', 'lessonlist');
  GRAMMAR_LESSONS.forEach((l, i) => {
    const unlocked = i === 0 || lessonStars(GRAMMAR_LESSONS[i - 1].id) > 0;
    const row = el('button', 'lesson-row' + (unlocked ? '' : ' locked'));
    row.innerHTML = `<span class="num">${unlocked ? i + 1 : '🔒'}</span>
      <span class="mid"><span class="title">${escapeHTML(l.title)}</span></span>
      ${starsHTML(lessonStars(l.id))}`;
    if (unlocked) row.onclick = () => nav.go('grammarLesson', { lessonId: l.id });
    list.appendChild(row);
  });
  root.appendChild(list);
}

export function renderGrammarLesson(root, nav, { lessonId }) {
  const lesson = GRAMMAR_LESSONS.find(l => l.id === lessonId);
  topbar(root, nav, lesson.title, 'grammarModule');
  const host = el('div');
  root.appendChild(host);

  const showExplain = () => {
    host.innerHTML = '';
    for (const p of lesson.points) {
      const card = el('div', 'gram-card');
      card.appendChild(el('h3', null, escapeHTML(p.title)));
      card.appendChild(el('p', null, escapeHTML(p.expl)));
      for (const e of p.examples) {
        const exm = el('div', 'example');
        exm.innerHTML = `<div class="info"><div class="jp-line">${escapeHTML(e.jp)}</div><div class="sv">${escapeHTML(e.sv)}</div></div>`;
        const b = el('button', 'speakbtn', '🔊');
        b.onclick = () => speak(e.jp, { rate: 0.85 });
        exm.appendChild(b);
        card.appendChild(exm);
      }
      host.appendChild(card);
    }
    const row = el('div', 'center mt');
    const btn = el('button', 'btn', 'Till frågorna ›');
    btn.onclick = startQuiz;
    row.appendChild(btn);
    host.appendChild(row);
  };

  const startQuiz = () => {
    host.innerHTML = '';
    const qs = shuffle(lesson.quiz).map(q => mcQ({
      prompt: escapeHTML(q.q).replace(/___/g, '<b style="color:var(--gold)">___</b>') + (q.sv ? `<br><small>${escapeHTML(q.sv)}</small>` : ''),
      options: q.opts.map((o, oi) => ({ label: o, jp: /[぀-ヿ一-鿿]/.test(o) })),
      correctIdx: q.correct,
      itemId: 'g_' + lessonId,
    }));
    runDrill(host, qs, {
      gradeSRS: false,
      onFinish(res) {
        const acc = res.correctFirstTry / res.total;
        const stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
        setLessonStars(lessonId, stars);
        addXP(10 + stars * 5);
        touchStreak();
        confetti();
        const idx = GRAMMAR_LESSONS.findIndex(l => l.id === lessonId);
        const nextL = GRAMMAR_LESSONS[idx + 1];
        nav.go('result', {
          title: lesson.title + ' klar!', stars,
          detail: `${res.correctFirstTry} av ${res.total} rätt på första försöket`,
          backTo: 'grammarModule',
          nextTo: nextL ? 'grammarLesson' : null, nextParams: nextL ? { lessonId: nextL.id } : null,
        });
      },
    });
  };
  showExplain();
}

// ---------- SRS-REPETITION ----------
export function renderReview(root, nav) {
  topbar(root, nav, '🏮 Dagens repetition');
  const host = el('div');
  root.appendChild(host);

  const kanaItems = new Map(allKanaItems().map(i => [i.id, i]));
  const vocabItems = new Map(VOCAB.map(w => [w.id, w]));
  const kanjiItems = new Map(allKanji().map(k => [k.id, k]));

  let ids = srsDue();
  if (ids.length === 0) {
    // Inget förfallet — öva på de svagaste ändå
    ids = Object.entries(S.srs).sort((a, b) => a[1].box - b[1].box).slice(0, 12).map(([id]) => id);
  }
  ids = ids.slice(0, 20);

  const qs = [];
  for (const id of ids) {
    const box = srsBox(id);
    if (kanaItems.has(id)) {
      const c = kanaItems.get(id);
      const pool = c.script === 'kata' ? KATAKANA : HIRAGANA;
      if (box >= 6 && c.k.length === 1 && Math.random() < 0.3) {
        qs.push(drawQ({ glyph: c.k, label: c.r, speakText: c.k, itemId: id, blind: true }));
      } else if (box >= 4) {
        qs.push(typeQ({ promptJP: c.k, speakText: c.k, targetKana: c.k, itemId: id }));
      } else if (box >= 2) {
        const { options, correctIdx } = mcOptions(c, pool, 3, x => x.k);
        qs.push(mcQ({ prompt: 'Lyssna — vilket tecken?', speakText: c.k, autoSpeak: true,
          options: options.map(o => ({ label: o.k, jp: true })), correctIdx, itemId: id }));
      } else {
        const { options, correctIdx } = mcOptions(c, pool, 3, x => x.r);
        qs.push(mcQ({ prompt: 'Vilket ljud?', promptJP: c.k, speakText: c.k,
          options: options.map(o => ({ label: o.r })), correctIdx, itemId: id }));
      }
    } else if (vocabItems.has(id)) {
      const w = vocabItems.get(id);
      if (box >= 4) {
        qs.push(typeQ({ prompt: `Skriv "${w.sv}" med romaji:`, speakText: w.kana, targetKana: w.kana, itemId: id }));
      } else if (box >= 2) {
        const { options, correctIdx } = mcOptions(w, VOCAB, 3, x => x.sv);
        qs.push(mcQ({ prompt: 'Lyssna — vad betyder ordet?', speakText: w.kana, autoSpeak: true,
          options: options.map(o => ({ label: o.sv })), correctIdx, itemId: id }));
      } else {
        const { options, correctIdx } = mcOptions(w, VOCAB, 3, x => x.sv);
        qs.push(mcQ({ prompt: 'Vad betyder ordet?', promptJP: w.kana, speakText: w.kana,
          options: options.map(o => ({ label: o.sv })), correctIdx, itemId: id }));
      }
    } else if (kanjiItems.has(id)) {
      const k = kanjiItems.get(id);
      const all = allKanji();
      if (box >= 3) {
        const { options, correctIdx } = mcOptions(k, all, 3, x => x.c);
        qs.push(mcQ({ prompt: `Vilket kanji betyder "${k.sv}"?`,
          options: options.map(o => ({ label: o.c, jp: true })), correctIdx, itemId: id }));
      } else {
        const { options, correctIdx } = mcOptions(k, all, 3, x => x.sv);
        qs.push(mcQ({ prompt: 'Vad betyder kanjit?', promptJP: k.c,
          options: options.map(o => ({ label: o.sv })), correctIdx, itemId: id }));
      }
    }
  }

  if (qs.length === 0) {
    host.appendChild(el('div', 'center mt', 'Inget att repetera än — gå en lektion först! 🌸'));
    return;
  }

  runDrill(host, shuffle(qs), {
    onFinish(res) {
      addXP(5);
      touchStreak();
      confetti();
      nav.go('result', {
        title: 'Repetition klar! お疲れ様！', stars: 0,
        detail: `${res.correctFirstTry} av ${res.total} rätt — kom tillbaka imorgon så sitter de ännu bättre.`,
        backTo: 'home',
      });
    },
  });
}

// ---------- RESULTAT ----------
export function renderResult(root, nav, { title, stars, detail, backTo = 'home', backParams, nextTo, nextParams }) {
  const box = el('div', 'result');
  box.appendChild(el('h2', null, escapeHTML(title)));
  if (stars > 0) {
    box.appendChild(el('div', 'bigstars', '★'.repeat(stars) + '<span style="color:#44446e">' + '★'.repeat(3 - stars) + '</span>'));
  } else {
    box.appendChild(el('div', 'bigstars', '🎉'));
  }
  box.appendChild(el('div', 'detail', escapeHTML(detail || '')));
  box.appendChild(el('div', 'xp', '+XP · totalt ' + S.xp));
  const row = el('div', 'continue-row');
  if (nextTo) {
    const nx = el('button', 'btn', 'Nästa lektion ›');
    nx.onclick = () => nav.go(nextTo, nextParams);
    row.appendChild(nx);
    row.appendChild(document.createTextNode(' '));
  }
  const back = el('button', 'btn secondary', 'Tillbaka');
  back.onclick = () => nav.go(backTo, backParams);
  row.appendChild(back);
  box.appendChild(row);
  root.appendChild(box);
}

// ---------- INSTÄLLNINGAR ----------
export function renderSettings(root, nav) {
  topbar(root, nav, 'Inställningar');
  const list = el('div', 'settings-list');

  const mkToggle = (label, sub, key) => {
    const row = el('div', 'setting-row');
    row.innerHTML = `<div class="t"><b>${label}</b><span>${sub}</span></div>`;
    const btn = el('button', 'btn small ' + (S.settings[key] ? '' : 'secondary'), S.settings[key] ? 'På' : 'Av');
    btn.onclick = () => {
      S.settings[key] = !S.settings[key]; save();
      btn.textContent = S.settings[key] ? 'På' : 'Av';
      btn.className = 'btn small ' + (S.settings[key] ? '' : 'secondary');
    };
    row.appendChild(btn);
    return row;
  };
  list.appendChild(mkToggle('Långsamt uttal', 'Talsyntesen pratar långsammare', 'slowAudio'));
  list.appendChild(mkToggle('Autospela ljud', 'Läs upp tecken/ord automatiskt', 'autoplay'));

  const test = el('div', 'setting-row');
  test.innerHTML = `<div class="t"><b>Testa japansk röst</b><span>${voiceName() ? 'Röst: ' + escapeHTML(voiceName()) : '⚠️ Ingen japansk röst hittad'}</span></div>`;
  const tb = el('button', 'btn small', '🔊 Test');
  tb.onclick = () => speak('こんにちは！日本語を勉強しましょう！', { rate: 0.9 });
  test.appendChild(tb);
  list.appendChild(test);

  const st = srsStats();
  const stats = el('div', 'setting-row');
  stats.innerHTML = `<div class="t"><b>Statistik</b><span>${st.total} kort i repetitionen · ${st.mastered} mästrade · ${S.xp} XP</span></div>`;
  list.appendChild(stats);

  const reset = el('div', 'setting-row');
  reset.innerHTML = `<div class="t"><b>Nollställ allt</b><span>Raderar all progress — går inte att ångra!</span></div>`;
  const rb = el('button', 'btn small secondary', 'Nollställ');
  rb.onclick = () => {
    if (confirm('Säker? All progress raderas.') && confirm('Helt säker? Detta går INTE att ångra.')) {
      resetAll();
      nav.go('home');
    }
  };
  reset.appendChild(rb);
  list.appendChild(reset);

  root.appendChild(list);
}
