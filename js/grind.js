// grind — Ordmaraton: drilla rakt igenom 10 000-ordsbanan (frekvensordnad).
// Målet: förstå de 3 000 vanligaste orden — ren volymträning ("bruteforce").
// Svaga ord (fel på första försöket) läggs automatiskt in i SRS-repetitionen;
// rätt svar på nya ord belastar INTE repetitionskön (skulle dränka den).

import { el, escapeHTML, confetti } from './ui.js';
import { speak, stopSpeech } from './audio.js';
import { S, save, addXP, touchStreak, srsAdd, srsGrade } from './state.js';
import { runDrill, mcQ, typeQ, tileQ, mcOptions } from './exercises.js';
import { WORDS, WORD_GOAL } from '../data/wordbank.js';
import { LADDER_STORIES } from '../data/ladder.js';
import { kanaToRomaji, shuffle } from './kanaUtils.js';
import { track, checkAchievements, showToast } from './gamify.js';

// Prognos: snitt-takt över de senaste 7 dagarna med aktivitet → datum då målet nås
export function goalForecast() {
  const daily = S.grind.daily || {};
  const days = Object.keys(daily).sort().slice(-7).filter(d => daily[d] > 0);
  if (!days.length) return null;
  const rate = Math.round(days.reduce((s, d) => s + daily[d], 0) / days.length);
  if (rate < 1) return null;
  const left = WORD_GOAL - understoodCount();
  if (left <= 0) return { rate, done: true };
  const eta = new Date(Date.now() + Math.ceil(left / rate) * 864e5);
  return { rate, left, eta: eta.toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' }) };
}

const ROUND = 10;

// Om banan ändras mellan versioner: hitta tillbaka via id-ankaret i stället för rå position
function syncPos() {
  const g = S.grind;
  if (g.pos > 0 && g.lastId && WORDS[g.pos - 1]?.id !== g.lastId) {
    const idx = WORDS.findIndex(w => w.id === g.lastId);
    if (idx >= 0) { g.pos = idx + 1; save(); }
  }
  if (g.pos > WORDS.length) { g.pos = WORDS.length; save(); }
}

// Ord räknas som förstådda: allt bakom maratonpositionen + ord man klarat i lektioner/SRS
export function understoodCount() {
  syncPos();
  const pos = S.grind.pos;
  let n = pos;
  for (let i = pos; i < WORDS.length; i++) {
    const st = S.srs[WORDS[i].id];
    if (st && st.right > 0) n++;
  }
  return n;
}

function wordMain(w) { return w.kanji || w.kana; }
const showRomaji = () => S.settings.showRomaji !== false;

// Dela upp kana i klickbara stavelser: yōon (きゃ) hålls ihop, っ/ッ och ー slås ihop med grannen
function kanaSegments(kana) {
  const segs = [];
  let pendSokuon = '';
  for (const ch of kana) {
    if ('っッ'.includes(ch)) { pendSokuon = ch; continue; }
    if ('ゃゅょャュョー'.includes(ch) && segs.length && !pendSokuon) {
      segs[segs.length - 1] += ch;
      continue;
    }
    segs.push(pendSokuon + ch);
    pendSokuon = '';
  }
  if (pendSokuon) segs.push(pendSokuon);
  return segs;
}

// Gemensam ordrad: huvudord (klick = hela ordet), kana-stavelser (klick = stavelsens ljud), romaji, svenska
function wordRowEl(w, { showRank = false, done = false } = {}) {
  const row = el('button', 'wordrow' + (done ? ' done' : ''));
  const taps = kanaSegments(w.kana)
    .map(s => `<span class="kana-tap jp" data-seg="${escapeHTML(s)}">${escapeHTML(s)}</span>`).join('');
  row.innerHTML = `${showRank ? `<span class="w-r">${w.r}${done ? ' ✓' : ''}</span>` : ''}
    <span class="w-jp jp">${escapeHTML(wordMain(w))}</span>
    <span class="w-mid"><span class="w-kana">${taps}</span>
    ${showRomaji() ? `<span class="w-romaji">${escapeHTML(kanaToRomaji(w.kana))}</span>` : ''}</span>
    <span class="w-sv">${escapeHTML(w.sv)}</span>`;
  row.onclick = e => {
    const seg = e.target.closest?.('.kana-tap');
    if (seg) { speak(seg.dataset.seg, { rate: 0.75 }); return; }
    speak(w.kana, { rate: S.settings.slowAudio ? 0.7 : 0.9 });
  };
  return row;
}

// Snabbtoggle för romaji-visning (samma inställning som i Inställningar)
function romajiToggle(rerender) {
  const btn = el('button', 'btn secondary small', showRomaji() ? 'Aあ Romaji: På' : 'Aあ Romaji: Av');
  btn.onclick = () => { S.settings.showRomaji = !showRomaji(); save(); rerender(); };
  return btn;
}

// ---------- Frågegenerator ----------
function distractorPool(idx) {
  const from = Math.max(0, idx - 60);
  return WORDS.slice(from, idx + 60);
}

const TILE_FRAMES = {
  n:  w => ({ tiles: ['これ', 'は', w.kana, 'です'], extra: ['を'], sv: `Det här är ${w.sv}.` }),
  v:  w => ({ tiles: ['わたし', 'は', 'まいにち', w.kana], extra: ['を'], sv: `Jag ${w.sv} varje dag.` }),
  a:  w => ({ tiles: ['とても', w.kana, 'です'], extra: ['は'], sv: `Det är väldigt ${w.sv}.` }),
  na: w => ({ tiles: ['とても', w.kana, 'です'], extra: ['が'], sv: `Det är väldigt ${w.sv}.` }),
};

// Alla frågor utgår från JAPANSKAN (Carls krav): se/hör ordet → förstå eller uttala.
function grindQuestion(w, idx) {
  const pool = distractorPool(idx);
  const types = ['jp2sv', 'listen', 'typeRead', 'jp2sv', 'tile'];
  let t = types[(w.r + idx) % types.length];
  if (t === 'tile' && (!TILE_FRAMES[w.p] || w.kana.length > 8)) t = 'jp2sv';
  if (t === 'typeRead' && w.kana.length > 7) t = 'listen';

  const romaji = kanaToRomaji(w.kana);
  if (t === 'jp2sv') {
    const { options, correctIdx } = mcOptions(w, pool, 3, x => x.sv);
    return mcQ({
      prompt: (w.kanji ? `<span class="jp" style="font-size:1.05rem">${escapeHTML(w.kana)}</span>` : '') +
        (showRomaji() ? `${w.kanji ? ' · ' : ''}${escapeHTML(romaji)}` : ''),
      promptJP: wordMain(w), speakText: w.kana, autoSpeak: true,
      options: options.map(o => ({ label: o.sv })), correctIdx, itemId: w.id,
    });
  }
  if (t === 'listen') {
    const { options, correctIdx } = mcOptions(w, pool, 3, x => x.sv);
    return mcQ({
      prompt: 'Lyssna — vad betyder ordet?', speakText: w.kana, autoSpeak: true, qtype: 'listen',
      options: options.map(o => ({ label: o.sv })), correctIdx, itemId: w.id,
    });
  }
  if (t === 'tile') {
    const f = TILE_FRAMES[w.p](w);
    return tileQ({ sv: f.sv, tiles: f.tiles, extra: f.extra, itemId: w.id });
  }
  // typeRead: läs det japanska ordet (kanji om det finns) och skriv uttalet
  return typeQ({
    prompt: `Läs ordet (${escapeHTML(w.sv)}) — skriv uttalet med romaji:`,
    promptJP: wordMain(w), speakText: w.kana, targetKana: w.kana, itemId: w.id,
  });
}

// ---------- Vyer ----------
function topbar(root, nav, title, backTo = 'home', backParams) {
  const bar = el('div', 'topbar');
  const back = el('button', 'back', '‹');
  back.onclick = () => { stopSpeech(); nav.go(backTo, backParams); };
  bar.appendChild(back);
  bar.appendChild(el('h1', null, escapeHTML(title)));
  root.appendChild(bar);
}

export function renderGrind(root, nav) {
  syncPos();
  topbar(root, nav, '🎯 Ordmaraton');
  const u = understoodCount();
  const pos = S.grind.pos;
  const goalReached = u >= WORD_GOAL;
  const target = goalReached ? WORDS.length : WORD_GOAL;

  const hero = el('div', 'daily');
  hero.innerHTML = `<div class="icon">${goalReached ? '👑' : '🎯'}</div>
    <div class="info"><b>${goalReached ? 'Målet nått — nu mot 10 000!' : 'Ditt mål: förstå ' + WORD_GOAL.toLocaleString('sv-SE') + ' ord'}</b>
    <div class="sub">De ${WORD_GOAL.toLocaleString('sv-SE')} första i banan är japanskans vanligaste ord — banan fortsätter till ${WORDS.length.toLocaleString('sv-SE')}.</div></div>`;
  root.appendChild(hero);

  const bar = el('div', 'journey');
  bar.innerHTML = `<span>🎯</span><span class="progressbar"><span style="width:${Math.min(100, Math.round(100 * u / target))}%"></span></span><span>${goalReached ? '🗻' : '👑'}</span>
    <span class="j-pct"><b>${u.toLocaleString('sv-SE')}</b> av ${target.toLocaleString('sv-SE')} ord förstådda</span>`;
  root.appendChild(bar);

  // Prognos + nästa text i Läs-stegen
  const fc = goalForecast();
  if (fc && !fc.done) {
    root.appendChild(el('div', 'prompt-label center',
      `🔥 Din takt: ~${fc.rate} ord/dag → målet nås ca <b>${escapeHTML(fc.eta)}</b>`));
  }
  const nextStory = LADDER_STORIES.find(s => s.req > u);
  const ladderRow = el('button', 'lesson-row');
  if (nextStory) {
    ladderRow.innerHTML = `<span class="num">📖</span>
      <span class="mid"><span class="title">Nästa text i Läs-stegen: ${escapeHTML(nextStory.titleSv)}</span>
      <span class="preview">Låses upp vid ${nextStory.req.toLocaleString('sv-SE')} ord — ${(nextStory.req - u).toLocaleString('sv-SE')} kvar</span></span>`;
  } else {
    ladderRow.innerHTML = `<span class="num">📚</span>
      <span class="mid"><span class="title">Hela Läs-stegen är upplåst!</span>
      <span class="preview">Alla ${LADDER_STORIES.length} texter väntar i Läsning</span></span>`;
  }
  ladderRow.onclick = () => nav.go('reading');
  root.appendChild(ladderRow);

  const next = WORDS.slice(pos, pos + ROUND);
  const btnRow = el('div', 'center mt');
  const go = el('button', 'btn', pos === 0 ? '▶ Starta maratonet!' : `▶ Drilla ord ${(pos + 1).toLocaleString('sv-SE')}–${(pos + next.length).toLocaleString('sv-SE')}`);
  if (next.length === 0) { go.disabled = true; go.textContent = '🗻 HELA banan avklarad!'; }
  go.onclick = () => nav.go('grindRun');
  btnRow.appendChild(go);
  root.appendChild(btnRow);

  const tools = el('div', 'center mt');
  const listBtn = el('button', 'btn secondary small', '📖 Bläddra i ordlistan');
  listBtn.onclick = () => nav.go('grindList', { page: Math.floor(pos / 100) });
  tools.appendChild(listBtn);
  root.appendChild(tools);

  if (next.length) {
    const label = el('div', 'sectionlabel', 'Härnäst i banan');
    label.style.display = 'flex'; label.style.justifyContent = 'space-between'; label.style.alignItems = 'center';
    label.appendChild(romajiToggle(() => nav.go('grind')));
    root.appendChild(label);
    const preview = el('div', 'wordbrowse');
    for (const w of next.slice(0, 5)) preview.appendChild(wordRowEl(w));
    root.appendChild(preview);
  }

  const info = el('div', 'notice');
  info.innerHTML = '💡 <b>Så funkar maratonet:</b> 10 ord i taget — snabbtitt, sedan drill (välja rätt, lyssna, skriva, bygga mening). ' +
    'Ord du missar läggs automatiskt i 🏮 Dagens repetition. Ren volym räcker långt — kör!';
  root.appendChild(info);
}

export function renderGrindRun(root, nav) {
  syncPos();
  const startPos = S.grind.pos;
  const uStart = understoodCount();
  const words = WORDS.slice(startPos, startPos + ROUND);
  if (words.length === 0) { nav.go('grind'); return; }
  topbar(root, nav, `Ord ${(startPos + 1).toLocaleString('sv-SE')}–${(startPos + words.length).toLocaleString('sv-SE')}`, 'grind');
  const host = el('div');
  root.appendChild(host);

  // Fas 1: snabbtitt — alla ord med kanji + kana + romaji + svenska + ljud
  const showIntro = () => {
    host.innerHTML = '';
    const head = el('div', 'prompt-label center', 'Snabbtitt — tryck på ordet för hela, på en stavelse för dess ljud. ');
    head.appendChild(romajiToggle(showIntro));
    host.appendChild(head);
    const list = el('div', 'wordbrowse');
    for (const w of words) list.appendChild(wordRowEl(w));
    host.appendChild(list);
    const row = el('div', 'continue-row');
    const start = el('button', 'btn', 'Drilla! ›');
    start.onclick = startDrill;
    row.appendChild(start);
    host.appendChild(row);
  };

  const startDrill = () => {
    host.innerHTML = '';
    const qs = shuffle(words.map((w, i) => grindQuestion(w, startPos + i)));
    runDrill(host, qs, {
      gradeSRS: false,
      onAnswer(q, correct, firstTry) {
        const ok = correct && firstTry;
        if (S.srs[q.itemId]) srsGrade(q.itemId, ok);      // redan i repetitionen → betygsätt
        else if (!ok) { srsAdd(q.itemId); }               // nytt + missat → in i repetitionen
      },
      onFinish(res) {
        S.grind.pos = startPos + words.length;
        S.grind.lastId = words[words.length - 1].id;
        const today = new Date().toISOString().slice(0, 10);
        S.grind.daily = S.grind.daily || {};
        S.grind.daily[today] = (S.grind.daily[today] || 0) + words.length;
        save();
        addXP(5);
        touchStreak();
        track('grind', words.length);
        checkAchievements();
        confetti();
        // Milstolpar + upplåsta texter i Läs-stegen
        const u = understoodCount();
        for (const m of [500, 1000, 2000, WORD_GOAL, 5000, 7500, 10000]) {
          if (startPos < m && S.grind.pos >= m) {
            showToast(m === WORD_GOAL ? `👑 <b>MÅLET NÅTT — ${WORD_GOAL.toLocaleString('sv-SE')} ORD!</b> お見事！` : `🎯 Milstolpe: <b>${m.toLocaleString('sv-SE')} ord!</b>`);
          }
        }
        for (const st of LADDER_STORIES) {
          if (uStart < st.req && u >= st.req) {
            showToast(`📖 Ny text upplåst i Läs-stegen: <b>${st.titleSv}</b>!`);
          }
        }
        nav.go('result', {
          title: 'Runda klar! 進め！', stars: 0,
          detail: `${res.correctFirstTry} av ${res.total} rätt direkt · ${u.toLocaleString('sv-SE')} ord förstådda totalt`,
          backTo: 'grind', nextTo: 'grindRun', nextLabel: '▶ Nästa 10 ord',
        });
      },
    });
  };

  showIntro();
}

export function renderGrindList(root, nav, { page = 0 } = {}) {
  syncPos();
  const PER = 100;
  const pages = Math.ceil(WORDS.length / PER);
  page = Math.max(0, Math.min(pages - 1, page));
  topbar(root, nav, '📖 Ordlistan', 'grind');

  const mkPager = () => {
    const pager = el('div', 'center', '');
    const prev = el('button', 'btn secondary small', '‹');
    prev.disabled = page === 0;
    prev.onclick = () => nav.go('grindList', { page: page - 1 });
    const label = el('span', 'prompt-label', ` Ord ${page * PER + 1}–${Math.min(WORDS.length, (page + 1) * PER)} av ${WORDS.length.toLocaleString('sv-SE')} `);
    label.style.margin = '0 10px';
    const next = el('button', 'btn secondary small', '›');
    next.disabled = page >= pages - 1;
    next.onclick = () => nav.go('grindList', { page: page + 1 });
    pager.appendChild(prev); pager.appendChild(label); pager.appendChild(next);
    return pager;
  };
  root.appendChild(mkPager());

  const toggleRow = el('div', 'center');
  toggleRow.appendChild(romajiToggle(() => nav.go('grindList', { page })));
  root.appendChild(toggleRow);

  const list = el('div', 'wordbrowse');
  const pos = S.grind.pos;
  for (const w of WORDS.slice(page * PER, (page + 1) * PER)) {
    list.appendChild(wordRowEl(w, { showRank: true, done: w.r <= pos }));
  }
  root.appendChild(list);
  root.appendChild(mkPager());
}
