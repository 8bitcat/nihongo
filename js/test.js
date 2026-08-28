// test — JLPT N5-mockprov. Tre delar som riktiga provet:
// 1) Tecken & ordförråd  2) Grammatik & läsning  3) Hörförståelse (talsyntes).
// Skala 0–180, godkänt ≥80 totalt + delminimum (38 språk/läsning, 19 hörförståelse).

import { el, escapeHTML, confetti } from './ui.js';
import { speak, stopSpeech } from './audio.js';
import { S, save, addXP, touchStreak } from './state.js';
import { VOCAB } from '../data/vocab.js';
import { allKanji } from '../data/kanji.js';
import { GRAMMAR_LESSONS, READING_PASSAGES, LISTENING_ITEMS } from '../data/grammar.js';
import { pick, shuffle } from './kanaUtils.js';
import { mcOptions } from './exercises.js';

const TEST_MINUTES = 25;

export function renderTestIntro(root, nav) {
  const bar = el('div', 'topbar');
  const back = el('button', 'back', '‹');
  back.onclick = () => nav.go('home');
  bar.appendChild(back);
  bar.appendChild(el('h1', null, 'JLPT N5-prov'));
  root.appendChild(bar);

  const box = el('div', 'test-intro');
  box.appendChild(el('div', 'torii', '🎓'));
  box.appendChild(el('h2', null, 'Mockprov — som riktiga JLPT N5'));
  box.appendChild(el('div', 'prompt-label mt', `${TEST_MINUTES} minuter · 31 frågor · nya frågor varje gång`));
  const parts = el('div', 'parts');
  parts.innerHTML = `
    <div class="test-part"><span class="n">1</span><div class="t"><b>文字・語彙 — Tecken & ordförråd</b><span>12 frågor: ordbetydelser & kanji-läsningar</span></div></div>
    <div class="test-part"><span class="n">2</span><div class="t"><b>文法・読解 — Grammatik & läsning</b><span>11 frågor: partiklar, böjning & en lästext</span></div></div>
    <div class="test-part"><span class="n">3</span><div class="t"><b>聴解 — Hörförståelse</b><span>8 frågor: lyssna och svara (🔊 krävs!)</span></div></div>`;
  box.appendChild(parts);
  box.appendChild(el('div', 'prompt-label', 'Godkänt: minst 80 av 180 poäng totalt, och minst 38/120 på del 1+2 samt 19/60 på del 3.<br>Inga facit visas under provet — precis som på riktigt. 頑張って！'));
  if (S.bestTest) {
    box.appendChild(el('div', 'prompt-label', `Ditt bästa: <b style="color:var(--gold)">${S.bestTest.score}/180</b> ${S.bestTest.pass ? '✔ godkänd' : ''} (${S.bestTest.date})`));
  }
  const start = el('button', 'btn', 'Starta provet ▶');
  start.onclick = () => nav.go('testRun');
  box.appendChild(start);
  root.appendChild(box);
}

function buildTest() {
  const kanji = allKanji();
  const questions = [];

  // Del 1: ordförråd (12)
  for (const w of pick(VOCAB, 5)) {
    const { options, correctIdx } = mcOptions(w, VOCAB, 3, x => x.sv);
    questions.push({ part: 1, prompt: 'Vad betyder ordet?', jp: w.kana,
      opts: options.map(o => o.sv), correct: correctIdx, facit: `${w.kana} = ${w.sv}` });
  }
  for (const w of pick(VOCAB, 3)) {
    const { options, correctIdx } = mcOptions(w, VOCAB, 3, x => x.kana);
    questions.push({ part: 1, prompt: `Vilket ord betyder "${w.sv}"?`,
      opts: options.map(o => o.kana), jpOpts: true, correct: correctIdx, facit: `${w.sv} = ${w.kana}` });
  }
  for (const k of pick(kanji.filter(k => k.ex.length), 4)) {
    const e = k.ex[0];
    const { options, correctIdx } = mcOptions(e, kanji.flatMap(x => x.ex).filter(x => x.r !== e.r), 3, x => x.r);
    questions.push({ part: 1, prompt: `Hur läses ordet?`, jp: e.w,
      opts: options.map(o => o.r), jpOpts: true, correct: correctIdx, facit: `${e.w} läses ${e.r} (${e.sv})` });
  }

  // Del 2: grammatik (8) + läsning (3)
  const allGramQ = GRAMMAR_LESSONS.flatMap(l => l.quiz);
  for (const q of pick(allGramQ, 8)) {
    questions.push({ part: 2, prompt: q.q.replace(/___/g, '⬜'),
      opts: q.opts, jpOpts: q.opts.some(o => /[぀-ヿ一-鿿]/.test(o)), correct: q.correct,
      facit: q.q.replace(/___/g, '【' + q.opts[q.correct] + '】') });
  }
  const passage = pick(READING_PASSAGES, 1)[0];
  for (const q of passage.questions) {
    const opts = q.opts.map((o, i) => ({ o, i }));
    const shuffled = shuffle(opts);
    questions.push({ part: 2, passage: passage.jp, prompt: q.q,
      opts: shuffled.map(x => x.o), correct: shuffled.findIndex(x => x.i === q.correct),
      facit: q.q + ' → ' + q.opts[q.correct] });
  }

  // Del 3: hörförståelse (8)
  for (const item of pick(LISTENING_ITEMS, 8)) {
    const opts = item.opts.map((o, i) => ({ o, i }));
    const shuffled = shuffle(opts);
    questions.push({ part: 3, audio: item.audio, prompt: item.q,
      opts: shuffled.map(x => x.o), correct: shuffled.findIndex(x => x.i === item.correct),
      facit: '「' + item.audio + '」 → ' + item.opts[item.correct] });
  }
  return questions;
}

export function renderTestRun(root, nav) {
  const questions = buildTest();
  const answers = new Array(questions.length).fill(-1);
  let idx = 0;
  let finished = false;

  // Timer
  const timerEl = el('div', 'test-timer');
  document.body.appendChild(timerEl);
  const t0 = Date.now();
  const deadline = t0 + TEST_MINUTES * 60e3;
  const tick = setInterval(() => {
    const left = Math.max(0, deadline - Date.now());
    const m = Math.floor(left / 60e3), s = Math.floor((left % 60e3) / 1000);
    timerEl.textContent = `⏱ ${m}:${String(s).padStart(2, '0')}`;
    if (left < 5 * 60e3) timerEl.classList.add('low');
    if (left <= 0 && !finished) finish();
  }, 500);

  const cleanup = () => { clearInterval(tick); timerEl.remove(); stopSpeech(); };

  const host = el('div');
  root.appendChild(host);

  const partNames = { 1: '文字・語彙 — Ordförråd', 2: '文法・読解 — Grammatik & läsning', 3: '聴解 — Hörförståelse' };

  function show() {
    host.innerHTML = '';
    if (idx >= questions.length) { finish(); return; }
    const q = questions[idx];
    const ex = el('div', 'exercise');
    ex.appendChild(el('div', 'sectionlabel center', `Del ${q.part}: ${partNames[q.part]} · fråga ${idx + 1}/${questions.length}`));
    if (q.passage) {
      ex.appendChild(el('div', 'reading-passage', escapeHTML(q.passage)));
    }
    if (q.audio) {
      const b = el('button', 'speakbtn big', '🔊');
      b.onclick = () => speak(q.audio, { rate: 0.85 });
      ex.appendChild(el('div', 'prompt-label', 'Lyssna (du får spela upp flera gånger):'));
      ex.appendChild(b);
      setTimeout(() => speak(q.audio, { rate: 0.85 }), 400);
    }
    ex.appendChild(el('div', 'prompt-label mt', escapeHTML(q.prompt)));
    if (q.jp) ex.appendChild(el('div', q.jp.length > 4 ? 'medglyph' : 'bigglyph', escapeHTML(q.jp)));
    const grid = el('div', 'answers' + (q.opts.some(o => String(o).length > 14) ? ' single-col' : ''));
    q.opts.forEach((o, i) => {
      const b = el('button', 'answer' + (q.jpOpts ? ' jp' : ''), escapeHTML(o));
      b.onclick = () => {
        answers[idx] = i;
        stopSpeech();
        idx++;
        show();
      };
      grid.appendChild(b);
    });
    ex.appendChild(grid);
    const skipRow = el('div', 'continue-row');
    const skip = el('button', 'btn secondary small', 'Hoppa över ›');
    skip.onclick = () => { stopSpeech(); idx++; show(); };
    skipRow.appendChild(skip);
    ex.appendChild(skipRow);
    host.appendChild(ex);
  }

  function finish() {
    if (finished) return;
    finished = true;
    cleanup();

    // Poäng: del 1+2 → 120 p, del 3 → 60 p (som riktiga provets viktning)
    const p12 = questions.map((q, i) => ({ q, ok: answers[i] === q.correct })).filter(x => x.q.part !== 3);
    const p3 = questions.map((q, i) => ({ q, ok: answers[i] === q.correct })).filter(x => x.q.part === 3);
    const score12 = Math.round(120 * p12.filter(x => x.ok).length / p12.length);
    const score3 = Math.round(60 * p3.filter(x => x.ok).length / p3.length);
    const total = score12 + score3;
    const pass = total >= 80 && score12 >= 38 && score3 >= 19;

    const date = new Date().toISOString().slice(0, 10);
    if (!S.bestTest || total > S.bestTest.score) S.bestTest = { score: total, total: 180, pass, date };
    addXP(pass ? 50 : 15);
    touchStreak();
    save();
    if (pass) confetti();

    host.innerHTML = '';
    const res = el('div', 'result');
    res.appendChild(el('h2', null, pass ? '合格！ GODKÄND! 🎉' : 'Inte riktigt än — 頑張って！'));
    res.appendChild(el('div', null, `<span class="pass-badge ${pass ? 'pass' : 'fail'}">${total} / 180</span>`));
    const table = el('table', 'score-table');
    table.innerHTML = `
      <tr><th>Del</th><th></th><td></td></tr>
      <tr><td>Språkkunskap & läsning</td><td>krav ≥38</td><td>${score12} / 120 ${score12 >= 38 ? '✔' : '✘'}</td></tr>
      <tr><td>Hörförståelse</td><td>krav ≥19</td><td>${score3} / 60 ${score3 >= 19 ? '✔' : '✘'}</td></tr>
      <tr><td><b>Totalt</b></td><td>krav ≥80</td><td><b>${total} / 180</b> ${total >= 80 ? '✔' : '✘'}</td></tr>`;
    res.appendChild(table);

    // Facit för fel svar
    const wrong = questions.map((q, i) => ({ q, i })).filter(x => answers[x.i] !== x.q.correct);
    if (wrong.length) {
      res.appendChild(el('div', 'sectionlabel', 'Att repetera (' + wrong.length + ' fel)'));
      const list = el('div', 'lessonlist');
      for (const { q } of wrong.slice(0, 15)) {
        list.appendChild(el('div', 'gram-card', `<p class="jp" style="margin:0">${escapeHTML(q.facit)}</p>`));
      }
      res.appendChild(list);
    }

    const row = el('div', 'continue-row');
    const again = el('button', 'btn', 'Nytt prov');
    again.onclick = () => nav.go('testRun');
    const home = el('button', 'btn secondary', 'Hem');
    home.onclick = () => nav.go('home');
    row.appendChild(again);
    row.appendChild(document.createTextNode(' '));
    row.appendChild(home);
    res.appendChild(row);
    host.appendChild(res);
    window.scrollTo(0, 0);
  }

  // Avbryt-skydd: städa upp timern om man navigerar bort
  nav.onLeave = cleanup;
  show();
}
