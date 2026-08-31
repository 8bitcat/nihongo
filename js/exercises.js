// exercises — övningsmotorn: flerval, skriv-romaji (active recall), lyssna, rita, matchning.
// Fel svar läggs tillbaka i kön (adaptiv drill). Första försöket räknas för stjärnor + SRS.

import { el, escapeHTML } from './ui.js';
import { speak, stopSpeech } from './audio.js';
import { romajiToKana, romajiMatchesKana, kanaToRomaji, shuffle, pick } from './kanaUtils.js';
import { S, srsGrade, addXP } from './state.js';
import { track, reportCombo } from './gamify.js';

const rate = () => (S.settings.slowAudio ? 0.7 : 0.9);

// ---------- Frågefabriker ----------
// Varje fråga: { qtype?, itemId?, render(container, done) } där done(correct, firstTry)

export function mcQ({ prompt, promptJP, promptEmoji, speakText, autoSpeak, options, correctIdx, itemId, note, explain, emojiOpts, qtype }) {
  return { itemId, qtype, render(root, done) {
    const ex = el('div', 'exercise');
    if (prompt) ex.appendChild(el('div', 'prompt-label', prompt));
    if (promptJP) {
      const g = el('div', promptJP.length > 4 ? 'medglyph' : 'bigglyph', escapeHTML(promptJP));
      ex.appendChild(g);
    }
    if (promptEmoji) ex.appendChild(el('div', 'bigglyph', escapeHTML(promptEmoji)));
    if (speakText) {
      const btn = el('button', 'speakbtn' + (promptJP ? '' : ' big'), '🔊');
      btn.onclick = () => speak(speakText, { rate: rate() });
      ex.appendChild(btn);
      if (autoSpeak && S.settings.autoplay) setTimeout(() => speak(speakText, { rate: rate() }), 250);
    }
    const grid = el('div', 'answers' + (options.some(o => String(o.label).length > 14) ? ' single-col' : ''));
    const fb = el('div', 'feedback');
    let answered = false, firstTry = true;
    options.forEach((o, i) => {
      const b = el('button', 'answer' + (o.jp ? ' jp' : '') + (emojiOpts ? ' emoji' : ''),
        escapeHTML(o.label) + (o.sub ? `<span class="sub">${escapeHTML(o.sub)}</span>` : ''));
      b.onclick = () => {
        if (answered) return;
        if (i === correctIdx) {
          answered = true;
          b.classList.add('correct');
          fb.innerHTML = (firstTry ? 'Rätt! 正解！' : 'Rätt — nu sitter den!') +
            (explain ? `<br><small>${escapeHTML(explain)}</small>` : '');
          fb.className = 'feedback ok';
          if (o.speakOnPick) speak(o.speakOnPick, { rate: rate() });
          [...grid.children].forEach(c => { if (c !== b) c.classList.add('dim'); });
          setTimeout(() => done(true, firstTry), explain ? 1800 : firstTry ? 700 : 900);
        } else {
          firstTry = false;
          b.classList.add('wrong');
          fb.innerHTML = 'Fel — försök igen!' + (note ? ` <small>${escapeHTML(note)}</small>` : '');
          fb.className = 'feedback no';
          setTimeout(() => b.classList.remove('wrong'), 600);
        }
      };
      grid.appendChild(b);
    });
    ex.appendChild(grid);
    ex.appendChild(fb);
    root.appendChild(ex);
  }};
}

export function typeQ({ prompt, promptJP, speakText, targetKana, itemId, showKanaPreview = true }) {
  return { itemId, qtype: 'write', render(root, done) {
    const ex = el('div', 'exercise');
    ex.appendChild(el('div', 'prompt-label', prompt || 'Skriv uttalet med vanliga bokstäver (romaji):'));
    if (promptJP) ex.appendChild(el('div', promptJP.length > 3 ? 'medglyph' : 'bigglyph', escapeHTML(promptJP)));
    if (speakText) {
      const btn = el('button', 'speakbtn', '🔊');
      btn.onclick = () => speak(speakText, { rate: rate() });
      ex.appendChild(btn);
    }
    const box = el('div', 'typebox');
    const input = document.createElement('input');
    input.type = 'text';
    input.autocapitalize = 'off'; input.autocomplete = 'off'; input.spellcheck = false;
    input.placeholder = 'romaji…';
    const ok = el('button', 'btn small', 'Svara');
    box.appendChild(input); box.appendChild(ok);
    ex.appendChild(box);
    const preview = el('div', 'kana-preview', '');
    if (showKanaPreview) ex.appendChild(preview);
    const fb = el('div', 'feedback');
    ex.appendChild(fb);
    let firstTry = true, doneFlag = false;
    input.addEventListener('input', () => {
      if (showKanaPreview) preview.textContent = romajiToKana(input.value);
      input.className = '';
    });
    const submit = () => {
      if (doneFlag) return;
      const val = input.value.trim();
      if (!val) return;
      if (romajiMatchesKana(val, targetKana)) {
        doneFlag = true;
        input.className = 'correct';
        fb.textContent = 'Rätt! 正解！';
        fb.className = 'feedback ok';
        speak(speakText || targetKana, { rate: rate() });
        setTimeout(() => done(true, firstTry), 900);
      } else {
        firstTry = false;
        input.className = 'wrong';
        fb.textContent = 'Inte riktigt — lyssna och försök igen!';
        fb.className = 'feedback no';
        if (speakText || targetKana) speak(speakText || targetKana, { rate: rate() });
      }
    };
    ok.onclick = submit;
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    root.appendChild(ex);
    setTimeout(() => input.focus(), 100);
  }};
}

// Meningsbyggare (Genki-stil mönsterdrill): bygg meningen genom att trycka
// på ordbrickorna i rätt ordning. Tränar partiklar och ordföljd.
export function tileQ({ sv, tiles, extra = [], itemId }) {
  return { itemId, qtype: 'write', render(root, done) {
    const ex = el('div', 'exercise');
    ex.appendChild(el('div', 'prompt-label', 'Bygg meningen:'));
    ex.appendChild(el('div', 'tile-target', escapeHTML(sv)));
    const built = el('div', 'tile-built jp', '');
    // Romaji-rad som byggs i takt med brickorna (bara när brickorna är ren kana)
    const allKana = [...tiles, ...extra].every(t => /^[぀-ゟ゠-ヿー]+$/.test(t));
    const romajiLine = allKana && S.settings.showRomaji !== false ? el('div', 'kana-preview', '') : null;
    const bank = el('div', 'tile-bank');
    const fb = el('div', 'feedback');
    let pos = 0, firstTry = true, doneFlag = false;
    const builtTiles = [];
    const tileRomaji = t => t === 'は' ? 'wa' : t === 'へ' ? 'e' : t === 'を' ? 'o' : kanaToRomaji(t);
    const all = shuffle([...tiles, ...extra]);
    for (const label of all) {
      const b = el('button', 'tile jp', escapeHTML(label));
      b.onclick = () => {
        if (doneFlag || b.disabled) return;
        if (label === tiles[pos]) {
          pos++;
          b.disabled = true;
          b.classList.add('used');
          built.textContent += label;
          builtTiles.push(label);
          if (romajiLine) romajiLine.textContent = builtTiles.map(tileRomaji).join(' ');
          fb.textContent = '';
          if (pos === tiles.length) {
            doneFlag = true;
            fb.textContent = 'Rätt! 正解！';
            fb.className = 'feedback ok';
            speak(tiles.join(''), { rate: rate() });
            setTimeout(() => done(true, firstTry), 1300);
          }
        } else {
          firstTry = false;
          b.classList.add('shake');
          setTimeout(() => b.classList.remove('shake'), 350);
          fb.textContent = pos === 0 ? 'Vad börjar meningen med?' : 'Inte den — vad kommer härnäst?';
          fb.className = 'feedback no';
        }
      };
      bank.appendChild(b);
    }
    ex.appendChild(built);
    if (romajiLine) ex.appendChild(romajiLine);
    ex.appendChild(bank);
    ex.appendChild(fb);
    root.appendChild(ex);
  }};
}

// Rita tecknet — spårning över svag mall (motoriskt minne).
// blind=true: rita ur minnet, självrättning (för höga SRS-boxar).
export function drawQ({ glyph, label, speakText, itemId, blind = false }) {
  return { itemId, qtype: 'write', render(root, done) {
    const ex = el('div', 'exercise');
    ex.appendChild(el('div', 'prompt-label',
      blind ? `Rita <b>${escapeHTML(label)}</b> ur minnet — klicka Klar för facit`
            : `Spåra tecknet med fingret eller musen${label ? ' — uttalas "' + escapeHTML(label) + '"' : ''}`));
    const wrap = el('div', 'drawwrap');
    const size = Math.min(300, window.innerWidth - 60);
    const cv = document.createElement('canvas');
    cv.className = 'drawpad';
    cv.width = size; cv.height = size;
    const ctx = cv.getContext('2d');

    // Mall-lager (offscreen) för att kunna poängsätta spårningen
    const guide = document.createElement('canvas');
    guide.width = size; guide.height = size;
    const gctx = guide.getContext('2d');
    gctx.font = `${size * 0.75}px "Yu Gothic", "Meiryo", "Hiragino Sans", sans-serif`;
    gctx.textAlign = 'center'; gctx.textBaseline = 'middle';
    gctx.fillStyle = '#000';
    gctx.fillText(glyph, size / 2, size / 2 + size * 0.02);

    function paintBase(showGuide) {
      ctx.clearRect(0, 0, size, size);
      if (showGuide) {
        ctx.save();
        ctx.globalAlpha = 0.16;
        ctx.drawImage(guide, 0, 0);
        ctx.restore();
      }
    }
    paintBase(!blind);

    // Ritning
    const strokes = [];
    let cur = null;
    const pos = e => {
      const r = cv.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (size / r.width), y: (e.clientY - r.top) * (size / r.height) };
    };
    cv.addEventListener('pointerdown', e => {
      e.preventDefault();
      cv.setPointerCapture(e.pointerId);
      cur = [pos(e)];
      strokes.push(cur);
    });
    cv.addEventListener('pointermove', e => {
      if (!cur) return;
      cur.push(pos(e));
      redraw();
    });
    const up = () => { cur = null; };
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', up);

    let guideVisible = !blind;
    function redraw() {
      paintBase(guideVisible);
      ctx.strokeStyle = '#c0392b';
      ctx.lineWidth = size * 0.045;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (const s of strokes) {
        ctx.beginPath();
        s.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.stroke();
      }
    }

    const tools = el('div', 'drawtools');
    const clearBtn = el('button', 'btn secondary small', 'Rensa');
    clearBtn.onclick = () => { strokes.length = 0; redraw(); };
    const hearBtn = el('button', 'btn secondary small', '🔊 Lyssna');
    hearBtn.onclick = () => speak(speakText || glyph, { rate: rate() });
    const doneBtn = el('button', 'btn small', 'Klar ✔');
    tools.appendChild(clearBtn); tools.appendChild(hearBtn); tools.appendChild(doneBtn);
    const fb = el('div', 'feedback');
    wrap.appendChild(cv); wrap.appendChild(tools); wrap.appendChild(fb);
    ex.appendChild(wrap);
    root.appendChild(ex);

    function scoreTrace() {
      // Täckning: hur stor del av tecknet har fått en linje nära sig?
      const gdata = gctx.getImageData(0, 0, size, size).data;
      const R = size * 0.05;
      const points = strokes.flat();
      if (points.length < 5) return { cover: 0, prec: 0 };
      let glyphPts = 0, covered = 0;
      const step = 4;
      for (let y = 0; y < size; y += step) {
        for (let x = 0; x < size; x += step) {
          if (gdata[(y * size + x) * 4 + 3] > 100) {
            glyphPts++;
            for (const p of points) {
              const dx = p.x - x, dy = p.y - y;
              if (dx * dx + dy * dy < R * R) { covered++; break; }
            }
          }
        }
      }
      // Precision: andel av användarens punkter som ligger på/har nära tecknet
      let onGlyph = 0;
      for (const p of points) {
        const x = Math.round(p.x), y = Math.round(p.y);
        let hit = false;
        const R2 = Math.round(R);
        outer: for (let dy = -R2; dy <= R2; dy += 3) {
          for (let dx = -R2; dx <= R2; dx += 3) {
            const xx = x + dx, yy = y + dy;
            if (xx >= 0 && yy >= 0 && xx < size && yy < size && gdata[(yy * size + xx) * 4 + 3] > 100) { hit = true; break outer; }
          }
        }
        if (hit) onGlyph++;
      }
      return { cover: glyphPts ? covered / glyphPts : 0, prec: points.length ? onGlyph / points.length : 0 };
    }

    doneBtn.onclick = () => {
      if (blind) {
        // Visa facit + självrättning (Anki-stil)
        guideVisible = true;
        redraw();
        fb.innerHTML = '';
        tools.style.display = 'none';
        const selfRow = el('div', 'drawtools');
        const good = el('button', 'btn small', 'Jag hade rätt ✔');
        const bad = el('button', 'btn secondary small', 'Fel — repetera ✖');
        good.onclick = () => done(true, true);
        bad.onclick = () => done(false, false);
        selfRow.appendChild(good); selfRow.appendChild(bad);
        wrap.appendChild(selfRow);
        speak(speakText || glyph, { rate: rate() });
      } else {
        const { cover, prec } = scoreTrace();
        if (cover >= 0.45 && prec >= 0.5) {
          fb.textContent = 'Snyggt spårat! ' + Math.round(cover * 100) + '% täckning';
          fb.className = 'feedback ok';
          speak(speakText || glyph, { rate: rate() });
          setTimeout(() => done(true, true), 900);
        } else if (strokes.length === 0) {
          fb.textContent = 'Rita tecknet först!';
          fb.className = 'feedback no';
        } else {
          fb.textContent = 'Försök följa strecken lite noggrannare!';
          fb.className = 'feedback no';
        }
      }
    };
  }};
}

// ---------- Drillkörning ----------
// questions: lista av frågor. onFinish({correctFirstTry, total}).
// Boss-läge: maxWrong (antal tillåtna fel) + onFail — hjärtan visas och drillen avbryts vid för många fel.
export function runDrill(root, questions, { onFinish, onAnswer = null, gradeSRS = true, maxWrong = null, onFail = null, noRequeue = false }) {
  const queue = questions.slice();
  const totalOriginal = questions.length;
  let idx = 0;
  let firstTryCorrect = 0;
  let combo = 0;
  let wrongCount = 0;
  const results = []; // true/false per originalfråga (första försöket)

  const statusRow = el('div', 'drill-status');
  const dots = el('div', 'progress-dots');
  const comboEl = el('div', 'combo', '');
  const heartsEl = el('div', 'hearts', '');
  statusRow.appendChild(dots);
  const qHost = el('div');

  function renderDots() {
    dots.innerHTML = '';
    for (let i = 0; i < totalOriginal; i++) {
      const d = el('span', 'pdot');
      if (i < results.length) d.classList.add(results[i] ? 'done' : 'wrong');
      else if (i === results.length) d.classList.add('current');
      dots.appendChild(d);
    }
    comboEl.textContent = combo >= 3 ? `🔥 ×${combo}` : '';
    if (maxWrong !== null) {
      heartsEl.textContent = '❤️'.repeat(Math.max(0, maxWrong + 1 - wrongCount)) + '🖤'.repeat(wrongCount);
    }
  }

  function next() {
    stopSpeech();
    qHost.innerHTML = '';
    if (idx >= queue.length) {
      onFinish({ correctFirstTry: firstTryCorrect, total: totalOriginal });
      return;
    }
    renderDots();
    const q = queue[idx];
    q.render(qHost, (correct, firstTry) => {
      // Kombo: obruten kedja av rätt-på-första-försöket
      if (firstTry && correct) {
        combo++;
        reportCombo(combo);
        if (combo % 5 === 0) addXP(3); // bonus var femte i rad
      } else {
        combo = correct ? 1 : 0;
      }
      if (!q._requeued) {
        results.push(firstTry && correct);
        if (firstTry && correct) {
          firstTryCorrect++;
          // Svårighetsviktad XP: produktion (skriva/rita) > lyssna > flerval
          addXP(q.qtype === 'write' ? 4 : q.qtype === 'listen' ? 3 : 2);
          if (q.qtype) track(q.qtype, 1);
        } else {
          wrongCount++;
        }
        if (gradeSRS && q.itemId) srsGrade(q.itemId, firstTry && correct);
        onAnswer?.(q, correct, firstTry);
      } else if (correct) {
        addXP(1);
      }
      if (maxWrong !== null && wrongCount > maxWrong) {
        renderDots();
        onFail?.({ correctFirstTry: firstTryCorrect, answered: results.length, total: totalOriginal });
        return;
      }
      if (!correct && !q._requeued && !noRequeue) {
        // lägg tillbaka en kopia i slutet av kön
        const copy = Object.create(Object.getPrototypeOf(q));
        Object.assign(copy, q, { _requeued: true });
        queue.push(copy);
      }
      idx++;
      next();
    });
  }

  root.appendChild(statusRow);
  root.appendChild(comboEl);
  if (maxWrong !== null) root.appendChild(heartsEl);
  root.appendChild(qHost);
  next();
}

// ---------- Matchningsspel ----------
export function matchingGame(root, pairs, { onFinish }) {
  // pairs: [{a, b}] — a = kana/jp, b = romaji/sv
  const cards = shuffle([
    ...pairs.map((p, i) => ({ id: i, side: 'a', label: p.a, jp: true })),
    ...pairs.map((p, i) => ({ id: i, side: 'b', label: p.b, jp: false })),
  ]);
  const grid = el('div', 'matchgrid');
  const fb = el('div', 'feedback center');
  let sel = null, left = pairs.length, mistakes = 0;
  const t0 = Date.now();
  for (const c of cards) {
    const btn = el('button', 'matchcard' + (c.jp ? ' jp' : ''), escapeHTML(c.label));
    btn.onclick = () => {
      if (btn.classList.contains('done')) return;
      if (sel === null) {
        sel = { c, btn };
        btn.classList.add('sel');
        if (c.jp) speak(c.label, { rate: rate() });
        return;
      }
      if (sel.btn === btn) { btn.classList.remove('sel'); sel = null; return; }
      if (sel.c.id === c.id && sel.c.side !== c.side) {
        btn.classList.add('done'); sel.btn.classList.add('done');
        sel.btn.classList.remove('sel');
        addXP(1);
        left--;
        sel = null;
        if (left === 0) {
          const secs = Math.round((Date.now() - t0) / 1000);
          fb.textContent = `Alla par klara på ${secs} s!`;
          fb.className = 'feedback ok center';
          setTimeout(() => onFinish({ mistakes, secs }), 900);
        }
      } else {
        mistakes++;
        btn.classList.add('shake'); sel.btn.classList.add('shake');
        const old = sel.btn;
        setTimeout(() => { btn.classList.remove('shake'); old.classList.remove('shake', 'sel'); }, 350);
        sel = null;
      }
    };
    grid.appendChild(btn);
  }
  root.appendChild(el('div', 'prompt-label center', 'Para ihop! Klicka på ett tecken och dess uttal.'));
  root.appendChild(grid);
  root.appendChild(fb);
}

// ---------- Frågegeneratorer ----------

// Flervalsalternativ: rätt svar + n distraktorer ur pool (unika labels)
export function mcOptions(correct, pool, n, labelFn) {
  const distractors = [];
  const used = new Set([labelFn(correct)]);
  for (const cand of shuffle(pool)) {
    if (distractors.length >= n) break;
    const lb = labelFn(cand);
    if (!used.has(lb)) { used.add(lb); distractors.push(cand); }
  }
  const all = shuffle([correct, ...distractors]);
  return { options: all, correctIdx: all.indexOf(correct) };
}

// Kana-drill: blandade frågetyper för en uppsättning tecken
export function kanaDrill(chars, pool, { perChar = 2 } = {}) {
  const qs = [];
  for (const ch of chars) {
    const typePool = ['see', 'hear', 'reverse', 'type'];
    if (ch.e) typePool.push('bild'); // bild→tecken: minnesbilden som cue (dual coding)
    const types = shuffle(typePool).slice(0, perChar);
    for (const t of types) {
      if (t === 'see') {
        const { options, correctIdx } = mcOptions(ch, pool, 3, x => x.r);
        qs.push(mcQ({
          prompt: 'Vilket ljud är det här?', promptJP: ch.k, speakText: ch.k,
          options: options.map(o => ({ label: o.r })), correctIdx, itemId: 'k_' + ch.k,
        }));
      } else if (t === 'hear') {
        const { options, correctIdx } = mcOptions(ch, pool, 3, x => x.k);
        qs.push(mcQ({
          prompt: 'Lyssna — vilket tecken hör du?', speakText: ch.k, autoSpeak: true, qtype: 'listen',
          options: options.map(o => ({ label: o.k, jp: true })), correctIdx, itemId: 'k_' + ch.k,
        }));
      } else if (t === 'bild') {
        const { options, correctIdx } = mcOptions(ch, pool, 3, x => x.k);
        qs.push(mcQ({
          prompt: `Minnesbilden! Vilket tecken är <b>${escapeHTML(ch.m.split('—')[0].trim())}</b>?`,
          promptEmoji: ch.e,
          options: options.map(o => ({ label: o.k, jp: true, speakOnPick: o.k })), correctIdx, itemId: 'k_' + ch.k,
        }));
      } else if (t === 'reverse') {
        const { options, correctIdx } = mcOptions(ch, pool, 3, x => x.k);
        qs.push(mcQ({
          prompt: `Vilket tecken uttalas "${ch.r}"?`,
          options: options.map(o => ({ label: o.k, jp: true, speakOnPick: o.k })), correctIdx, itemId: 'k_' + ch.k,
        }));
      } else {
        qs.push(typeQ({ promptJP: ch.k, speakText: ch.k, targetKana: ch.k, itemId: 'k_' + ch.k }));
      }
    }
  }
  return shuffle(qs);
}

// Ord-drill (ordförråd). Ord med bild (w.e) får bildbaserade retrieval-frågor —
// bilden är cue eller facit, aldrig ledtråd bredvid rätt svar (Carpenter & Olson).
export function vocabDrill(words, pool) {
  const qs = [];
  const emojiPool = pool.filter(x => x.e);
  for (const w of words) {
    const typePool = ['jp2sv', 'sv2jp', 'hear', 'type'];
    if (w.e) typePool.push('bild2jp', 'hear2bild');
    const types = shuffle(typePool).slice(0, 2);
    for (const t of types) {
      if (t === 'jp2sv') {
        const { options, correctIdx } = mcOptions(w, pool, 3, x => x.sv);
        qs.push(mcQ({
          prompt: 'Vad betyder ordet?', promptJP: w.kana, speakText: w.kana, autoSpeak: true,
          options: options.map(o => ({ label: o.sv })), correctIdx, itemId: w.id,
        }));
      } else if (t === 'sv2jp') {
        const { options, correctIdx } = mcOptions(w, pool, 3, x => x.kana);
        qs.push(mcQ({
          prompt: `Vilket ord betyder "${w.sv}"?`,
          options: options.map(o => ({ label: o.kana, jp: true, speakOnPick: o.kana })), correctIdx, itemId: w.id,
        }));
      } else if (t === 'hear') {
        const { options, correctIdx } = mcOptions(w, pool, 3, x => x.sv);
        qs.push(mcQ({
          prompt: 'Lyssna — vad betyder ordet?', speakText: w.kana, autoSpeak: true, qtype: 'listen',
          options: options.map(o => ({ label: o.sv })), correctIdx, itemId: w.id,
        }));
      } else if (t === 'bild2jp') {
        // Bilden som cue → hämta det japanska ordet (utan svensk text!)
        const { options, correctIdx } = mcOptions(w, emojiPool.length >= 4 ? emojiPool : pool, 3, x => x.kana);
        qs.push(mcQ({
          prompt: 'Vad heter det här på japanska?', promptEmoji: w.e,
          options: options.map(o => ({ label: o.kana, jp: true, speakOnPick: o.kana })), correctIdx, itemId: w.id,
        }));
      } else if (t === 'hear2bild') {
        // Hör ordet → peka på rätt bild (ljud→betydelse utan text)
        const candidates = emojiPool.filter(x => x.e !== w.e);
        const { options, correctIdx } = mcOptions(w, candidates.length >= 3 ? candidates : pool, 3, x => x.e || x.sv);
        qs.push(mcQ({
          prompt: 'Lyssna — vilken bild hör du?', speakText: w.kana, autoSpeak: true, qtype: 'listen', emojiOpts: true,
          options: options.map(o => ({ label: o.e || o.sv })), correctIdx, itemId: w.id,
        }));
      } else {
        qs.push(typeQ({
          prompt: w.e ? `Skriv ordet för ${w.e} med romaji:` : `Skriv "${w.sv}" med romaji:`,
          speakText: w.kana, targetKana: w.kana, itemId: w.id,
        }));
      }
    }
  }
  return shuffle(qs);
}

// Kanji-drill
export function kanjiDrill(list, pool) {
  const qs = [];
  for (const k of list) {
    const types = shuffle(['meaning', 'reverse', 'reading']).slice(0, 2);
    for (const t of types) {
      if (t === 'meaning') {
        const { options, correctIdx } = mcOptions(k, pool, 3, x => x.sv);
        qs.push(mcQ({
          prompt: 'Vad betyder kanjit?', promptJP: k.c,
          options: options.map(o => ({ label: o.sv })), correctIdx, itemId: 'kj_' + k.c,
        }));
      } else if (t === 'reverse') {
        const { options, correctIdx } = mcOptions(k, pool, 3, x => x.c);
        qs.push(mcQ({
          prompt: `Vilket kanji betyder "${k.sv}"?`,
          options: options.map(o => ({ label: o.c, jp: true })), correctIdx, itemId: 'kj_' + k.c,
        }));
      } else {
        const exWord = k.ex[0];
        const { options, correctIdx } = mcOptions(exWord, pool.flatMap(p => p.ex).filter(e => e.r !== exWord.r), 3, x => x.r);
        qs.push(mcQ({
          prompt: `Hur läses ${exWord.w} (${exWord.sv})?`, promptJP: exWord.w, speakText: exWord.r,
          options: options.map(o => ({ label: o.r, jp: true, speakOnPick: o.r })), correctIdx, itemId: 'kj_' + k.c,
          note: `${k.c} = ${k.sv}`,
        }));
      }
    }
  }
  return shuffle(qs);
}
