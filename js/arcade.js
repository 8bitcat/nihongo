// arcade — Kana-regn: tecken faller, skriv romaji innan de når marken.
// Pedagogik (research): SRS-viktat urval (svaga tecken oftare), missade tecken
// respawnar garanterat, recap efteråt med mnemonic + riktad drill.

import { el, escapeHTML, confetti } from './ui.js';
import { speak, stopSpeech } from './audio.js';
import { S, save, addXP, srsBox, touchStreak } from './state.js';
import { romajiToKana, shuffle, pick } from './kanaUtils.js';
import { track, checkAchievements, showToast } from './gamify.js';
import { runDrill, kanaDrill } from './exercises.js';
import { HIRAGANA, KATAKANA, allKanaItems } from '../data/kana.js';

export function renderArcade(root, nav) {
  const bar = el('div', 'topbar');
  const back = el('button', 'back', '‹');
  back.onclick = () => nav.go('home');
  bar.appendChild(back);
  bar.appendChild(el('h1', null, '🌧️ Kana-regn'));
  const hs = el('span', 'chip', `🏆 Rekord: <b>${S.highscores.kanaRain || 0}</b>`);
  bar.appendChild(hs);
  root.appendChild(bar);

  // SRS-viktat urval: 50 % svaga (box 0–2), 30 % mellan (3–5), 20 % mogna (6+)
  const learned = allKanaItems().filter(i => srsBox(i.id) >= 0 && i.k.length === 1);
  let pool;
  if (learned.length < 8) {
    pool = HIRAGANA.slice(0, 10);
    root.appendChild(el('div', 'notice', '💡 Du har få inlärda tecken än — spelet kör de första hiragana. Lär dig fler så växer regnet!'));
  } else {
    const low = learned.filter(i => srsBox(i.id) <= 2);
    const mid = learned.filter(i => srsBox(i.id) >= 3 && srsBox(i.id) <= 5);
    const high = learned.filter(i => srsBox(i.id) >= 6);
    pool = [...pick(low, 12), ...pick(mid, 7), ...pick(high, 5)];
    if (pool.length < 8) pool = learned;
  }

  const intro = el('div', 'test-intro');
  intro.appendChild(el('div', 'torii', '🌧️'));
  intro.appendChild(el('h2', null, 'Skriv romaji innan tecknen når marken!'));
  intro.appendChild(el('div', 'prompt-label mt',
    'Svaga tecken faller oftare (så du tränar rätt saker).<br>✨ Guldtecken = 5× poäng · 🔥 Kombo höjer multiplikatorn · ❤️×3 liv'));
  const start = el('button', 'btn', 'Spela ▶');
  intro.appendChild(start);
  root.appendChild(intro);

  start.onclick = () => { root.removeChild(intro); startGame(); };

  function startGame() {
    const wrap = el('div');
    const field = el('div', 'rain-field');
    const hud = el('div', 'rain-hud');
    const scoreEl = el('span', 'chip', 'Poäng: <b>0</b>');
    const comboEl = el('span', 'chip', '');
    const heartsEl = el('span', 'chip', '❤️❤️❤️');
    hud.appendChild(scoreEl); hud.appendChild(comboEl); hud.appendChild(heartsEl);
    const inputRow = el('div', 'typebox rain-input');
    const input = document.createElement('input');
    input.type = 'text'; input.autocapitalize = 'off'; input.autocomplete = 'off'; input.spellcheck = false;
    input.placeholder = 'skriv romaji…';
    inputRow.appendChild(input);
    const preview = el('div', 'kana-preview center', '');
    wrap.appendChild(hud); wrap.appendChild(field); wrap.appendChild(inputRow); wrap.appendChild(preview);
    root.appendChild(wrap);
    setTimeout(() => input.focus(), 100);

    let score = 0, hearts = 3, streakHits = 0, running = true;
    let fallDuration = 9000;        // ms från topp till mark
    let spawnEvery = 2600;
    let maxActive = 2;
    const active = [];              // { item, elm, born, gold, missedBefore }
    const missedQueue = [];         // garanterad respawn
    const stats = new Map();        // k -> { hits, miss, totalMs }
    let lastSpawn = 0;
    let raf = null;

    const statFor = (k) => { if (!stats.has(k)) stats.set(k, { hits: 0, miss: 0, totalMs: 0 }); return stats.get(k); };
    const multiplier = () => streakHits >= 10 ? 3 : streakHits >= 5 ? 2 : 1;

    function spawn(now) {
      if (active.length >= maxActive) return;
      const fromMissed = missedQueue.length > 0 && Math.random() < 0.6;
      const item = fromMissed ? missedQueue.shift() : pool[Math.floor(Math.random() * pool.length)];
      if (active.some(a => a.item.k === item.k)) return; // inga dubbletter i luften
      const gold = !fromMissed && Math.random() < 0.08;
      const elm = el('div', 'rain-kana' + (gold ? ' gold' : ''), escapeHTML(item.k));
      elm.style.left = (8 + Math.random() * 76) + '%';
      field.appendChild(elm);
      active.push({ item, elm, born: now, gold, missedBefore: fromMissed });
    }

    function pop(entry, now) {
      const st = statFor(entry.item.k);
      st.hits++; st.totalMs += now - entry.born;
      streakHits++;
      const pts = (entry.gold ? 5 : 1) * multiplier();
      score += pts;
      entry.elm.classList.add('popped');
      entry.elm.textContent = '+' + pts;
      setTimeout(() => entry.elm.remove(), 400);
      active.splice(active.indexOf(entry), 1);
      speak(entry.item.k, { rate: 1 });
      // Adaptiv svårighet: snabbare vid träffsäkerhet
      fallDuration = Math.max(4200, fallDuration - 120);
      spawnEvery = Math.max(1100, spawnEvery - 40);
      if (score > 10) maxActive = 3;
      if (score > 25) maxActive = 4;
      updateHud();
    }

    function miss(entry) {
      statFor(entry.item.k).miss++;
      streakHits = 0;
      hearts--;
      missedQueue.push(entry.item); // garanterad andra chans
      entry.elm.classList.add('missed');
      setTimeout(() => entry.elm.remove(), 400);
      active.splice(active.indexOf(entry), 1);
      fallDuration = Math.min(9000, fallDuration + 600); // nåd: sakta ner efter miss
      updateHud();
      if (hearts <= 0) gameOver();
    }

    function updateHud() {
      scoreEl.innerHTML = `Poäng: <b>${score}</b>`;
      const m = multiplier();
      comboEl.textContent = m > 1 ? `🔥 ×${m}` : '';
      heartsEl.textContent = '❤️'.repeat(hearts) + '🖤'.repeat(3 - hearts);
    }

    function frame(now) {
      if (!running) return;
      if (now - lastSpawn > spawnEvery) { spawn(now); lastSpawn = now; }
      const fieldH = field.clientHeight;
      for (const entry of [...active]) {
        const t = (now - entry.born) / fallDuration;
        if (t >= 1) { miss(entry); continue; }
        entry.elm.style.top = (t * (fieldH - 46)) + 'px';
      }
      raf = requestAnimationFrame(frame);
    }

    input.addEventListener('input', () => {
      const typed = romajiToKana(input.value);
      preview.textContent = typed;
      const hitEntry = active.find(a => a.item.k === typed || a.item.k === romajiToKana(input.value).trim());
      if (hitEntry) {
        pop(hitEntry, performance.now());
        input.value = ''; preview.textContent = '';
      } else if (input.value.length > 5) {
        input.value = ''; preview.textContent = '';
      }
    });

    function gameOver() {
      running = false;
      cancelAnimationFrame(raf);
      stopSpeech();
      const best = S.highscores.kanaRain || 0;
      const isPB = score > best;
      if (isPB) { S.highscores.kanaRain = score; save(); confetti(); }
      const xp = Math.min(40, Math.max(2, Math.floor(score)));
      addXP(xp);
      track('arcade', score);
      touchStreak();
      checkAchievements();

      wrap.innerHTML = '';
      const res = el('div', 'result');
      res.appendChild(el('h2', null, isPB ? '🏆 NYTT REKORD!' : 'Regnet tog dig!'));
      res.appendChild(el('div', 'bigstars', String(score)));
      res.appendChild(el('div', 'detail', `poäng · rekord: ${Math.max(best, score)} · +${xp} XP`));

      // Recap: svagaste tecknen med minnesbild + riktad drill (det pedagogiska avslutet)
      const weak = [...stats.entries()]
        .map(([k, st]) => ({ k, st, item: pool.find(p => p.k === k) }))
        .filter(x => x.item && (x.st.miss > 0 || (x.st.hits > 0 && x.st.totalMs / x.st.hits > 4500)))
        .sort((a, b) => (b.st.miss - a.st.miss) || (b.st.totalMs / Math.max(1, b.st.hits)) - (a.st.totalMs / Math.max(1, a.st.hits)))
        .slice(0, 5);
      if (weak.length) {
        res.appendChild(el('div', 'sectionlabel', 'Dina svagaste tecken denna runda'));
        for (const w of weak) {
          res.appendChild(el('div', 'gram-card',
            `<p style="margin:0"><span class="jp" style="font-size:1.5rem">${escapeHTML(w.k)}</span> ` +
            `<b style="color:var(--gold)">${escapeHTML(w.item.r)}</b> ${w.item.e ? escapeHTML(w.item.e) : ''} — ` +
            `<span style="color:var(--muted)">${escapeHTML(w.item.m || '')}</span></p>`));
        }
        const drillBtn = el('button', 'btn', '🎯 Drilla dessa nu');
        drillBtn.onclick = () => {
          wrap.innerHTML = '';
          const host = el('div');
          wrap.appendChild(host);
          const chars = weak.map(w => w.item);
          runDrill(host, kanaDrill(chars, [...HIRAGANA, ...KATAKANA], { perChar: 2 }), {
            onFinish() { showToast('🎯 Bra jobbat — de sitter bättre nu!'); nav.go('arcade'); },
          });
        };
        res.appendChild(drillBtn);
        res.appendChild(document.createTextNode(' '));
      }
      const again = el('button', 'btn secondary', 'Spela igen');
      again.onclick = () => nav.go('arcade');
      const home = el('button', 'btn secondary', 'Hem');
      home.onclick = () => nav.go('home');
      res.appendChild(again);
      res.appendChild(document.createTextNode(' '));
      res.appendChild(home);
      wrap.appendChild(res);
    }

    nav.onLeave = () => { running = false; cancelAnimationFrame(raf); stopSpeech(); };
    raf = requestAnimationFrame(t => { lastSpawn = t - spawnEvery; frame(t); }); // första tecknet direkt
  }
}
