// course — Kursen: eget spår som följer Genki I:s lektionsordning.
// Flöde per lektion: grammatikpunkter → dialog (spelas upp replik för replik) → drill.

import { el, escapeHTML, starsHTML, confetti } from './ui.js';
import { speak, stopSpeech } from './audio.js';
import { S, addXP, touchStreak, setLessonStars, lessonStars } from './state.js';
import { track, checkAchievements } from './gamify.js';
import { runDrill, mcQ, typeQ, tileQ } from './exercises.js';
import { sentenceRomaji, shuffle, randInt } from './kanaUtils.js';
import { COURSE_LESSONS, HOUR_READINGS, HUNDRED_READINGS, THOUSAND_READINGS, PEOPLE_READINGS } from '../data/course.js';

function topbar(root, nav, title, backTo = 'course') {
  const bar = el('div', 'topbar');
  const back = el('button', 'back', '‹');
  back.onclick = () => { stopSpeech(); nav.go(backTo); };
  bar.appendChild(back);
  bar.appendChild(el('h1', null, escapeHTML(title)));
  root.appendChild(bar);
}

// ---------- Sifferlyssning (generatorer — nya tal varje gång) ----------
function timeQuestion() {
  const hour = 1 + randInt(12);
  const half = Math.random() < 0.5;
  const reading = HOUR_READINGS[hour] + (half ? 'はん' : '');
  const label = h => `${h}:${half ? '30' : '00'}`;
  const opts = new Set([hour]);
  while (opts.size < 4) opts.add(1 + randInt(12));
  const options = shuffle([...opts]);
  return mcQ({
    prompt: 'Lyssna — vad är klockan?', speakText: reading, autoSpeak: true, qtype: 'listen',
    options: options.map(h => ({ label: label(h) })),
    correctIdx: options.indexOf(hour),
  });
}

function priceQuestion() {
  const th = randInt(10);          // 0–9 tusen
  const hu = th === 0 ? 1 + randInt(9) : randInt(10); // undvik 0 kr
  const price = th * 1000 + hu * 100;
  const reading = (th ? THOUSAND_READINGS[th] : '') + (hu ? HUNDRED_READINGS[hu] : '') + 'えん';
  const opts = new Set([price]);
  while (opts.size < 4) {
    const t2 = randInt(10), h2 = randInt(10);
    const p2 = t2 * 1000 + h2 * 100;
    if (p2 > 0) opts.add(p2);
  }
  const options = shuffle([...opts]);
  return mcQ({
    prompt: 'Lyssna — vad kostar det?', speakText: reading, autoSpeak: true, qtype: 'listen',
    options: options.map(p => ({ label: p.toLocaleString('sv-SE') + ' yen' })),
    correctIdx: options.indexOf(price),
  });
}

function peopleQuestion() {
  const n = 1 + randInt(10);
  const opts = new Set([n]);
  while (opts.size < 4) opts.add(1 + randInt(10));
  const options = shuffle([...opts]);
  return mcQ({
    prompt: 'Lyssna — hur många personer?', speakText: PEOPLE_READINGS[n], autoSpeak: true, qtype: 'listen',
    options: options.map(x => ({ label: x + (x === 1 ? ' person' : ' personer') })),
    correctIdx: options.indexOf(n),
  });
}

// ---------- Kurslistan ----------
export function renderCourse(root, nav) {
  topbar(root, nav, '🎓 Kursen', 'home');
  root.appendChild(el('div', 'prompt-label center',
    'Följer läroboken <b>Genki I</b> kapitel för kapitel — dialog, grammatik och drillar.<br>Perfekt att köra parallellt med boken!'));
  const list = el('div', 'lessonlist');
  COURSE_LESSONS.forEach((l, i) => {
    const prev = COURSE_LESSONS[i - 1];
    const unlocked = !l.locked && (i === 0 || (prev && lessonStars(prev.id) > 0));
    const row = el('button', 'lesson-row' + (unlocked ? '' : ' locked'));
    row.innerHTML = `<span class="num">${l.locked ? '🔒' : unlocked ? l.emoji : '🔒'}</span>
      <span class="mid"><span class="title">Kap ${l.nr}: <span class="jp">${escapeHTML(l.title)}</span></span>
      <span class="preview">${escapeHTML(l.titleSv)}${l.locked ? ' · ' + escapeHTML(l.teaser) + ' (del 2 — kommer!)' : ''}</span></span>
      ${l.locked ? '' : starsHTML(lessonStars(l.id))}`;
    if (unlocked) row.onclick = () => nav.go('courseLesson', { lessonId: l.id });
    list.appendChild(row);
  });
  root.appendChild(list);
}

// ---------- En kurslektion ----------
export function renderCourseLesson(root, nav, { lessonId }) {
  const lesson = COURSE_LESSONS.find(l => l.id === lessonId);
  topbar(root, nav, `Kap ${lesson.nr}: ${lesson.titleSv}`);
  const host = el('div');
  root.appendChild(host);

  // Fas 1: grammatikpunkter
  const showPoints = () => {
    host.innerHTML = '';
    const card = el('div', 'gram-card');
    card.appendChild(el('h3', null, `📖 ${escapeHTML(lesson.title)} — det här lär du dig`));
    for (const p of lesson.points) {
      card.appendChild(el('p', null, '・' + escapeHTML(p)));
    }
    host.appendChild(card);
    const row = el('div', 'center mt');
    const btn = el('button', 'btn', 'Till dialogen ›');
    btn.onclick = showDialog;
    row.appendChild(btn);
    host.appendChild(row);
  };

  // Fas 2: dialogen — replik för replik med ljud
  let line = 0;
  const showDialog = () => {
    host.innerHTML = '';
    host.appendChild(el('div', 'sectionlabel center', '💬 Dialogen — lyssna och läs'));
    const list = el('div');
    for (let i = 0; i <= Math.min(line, lesson.dialog.length - 1); i++) {
      const d = lesson.dialog[i];
      const row = el('div', 'example');
      row.innerHTML = `<div class="info"><div class="jp-line"><b style="color:var(--blue)">${escapeHTML(d.sp)}:</b> ${escapeHTML(d.jp)}</div>
        <div class="romaji">${escapeHTML(sentenceRomaji(d.jp))}</div>
        <div class="sv">${escapeHTML(d.sv)}</div></div>`;
      const b = el('button', 'speakbtn', '🔊');
      b.onclick = () => speak(d.jp, { rate: 0.85 });
      row.appendChild(b);
      list.appendChild(row);
    }
    host.appendChild(list);
    const row = el('div', 'continue-row center');
    if (line < lesson.dialog.length - 1) {
      const next = el('button', 'btn', 'Nästa replik ›');
      next.onclick = () => { line++; showDialog(); };
      row.appendChild(next);
    } else {
      const replay = el('button', 'btn secondary', '🔊 Hela dialogen');
      replay.onclick = () => playAll(0);
      const start = el('button', 'btn', 'Öva! ›');
      start.onclick = startDrill;
      row.appendChild(replay);
      row.appendChild(document.createTextNode(' '));
      row.appendChild(start);
    }
    host.appendChild(row);
    if (S.settings.autoplay) setTimeout(() => speak(lesson.dialog[Math.min(line, lesson.dialog.length - 1)].jp, { rate: 0.85 }), 300);
  };
  const playAll = (i) => {
    if (i >= lesson.dialog.length) return;
    speak(lesson.dialog[i].jp, { rate: 0.85, onend: () => setTimeout(() => playAll(i + 1), 350) });
  };

  // Fas 3: drill — mönster, böjning, frågor, sifferlyssning
  const startDrill = () => {
    stopSpeech();
    host.innerHTML = '';
    const d = lesson.drill;
    const qs = [
      ...d.tiles.map(t => tileQ(t)),
      ...d.conj.map(c => typeQ({
        prompt: `Böj till <b>${escapeHTML(c.form)}</b> (${escapeHTML(c.sv)}):`,
        promptJP: c.base, targetKana: c.target,
      })),
      ...d.qa.map(q => {
        const opts = q.opts.map((o, i) => ({ o, i }));
        const shuffled = shuffle(opts);
        // Ljud: rent japanska frågor läses upp (paus i luckan); rätt svar → hela meningen
        const pureJP = /[぀-ヿ一-鿿]/.test(q.q) && !/[A-Za-z]/.test(q.q.replace(/___/g, ''));
        const fullSentence = pureJP ? q.q.replace(/___/g, q.opts[q.correct]) : null;
        return mcQ({
          prompt: escapeHTML(q.q).replace(/___/g, '<b style="color:var(--gold)">___</b>'),
          speakText: pureJP ? q.q.replace(/___/g, '、') : undefined,
          autoSpeak: pureJP,
          options: shuffled.map(x => ({ label: x.o, jp: /[぀-ヿ一-鿿]/.test(x.o),
            speakOnPick: x.i === q.correct && fullSentence ? fullSentence : undefined })),
          correctIdx: shuffled.findIndex(x => x.i === q.correct),
        });
      }),
    ];
    if (d.numbers === 'time') qs.push(timeQuestion(), timeQuestion(), timeQuestion());
    if (d.numbers === 'price') qs.push(priceQuestion(), priceQuestion(), priceQuestion());
    if (d.numbers === 'people') qs.push(peopleQuestion(), peopleQuestion(), peopleQuestion());
    runDrill(host, shuffle(qs), {
      gradeSRS: false,
      onFinish(res) {
        const acc = res.correctFirstTry / res.total;
        const stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
        setLessonStars(lessonId, stars);
        addXP(15 + stars * 5);
        touchStreak();
        track('lesson', 1);
        checkAchievements();
        confetti();
        const idx = COURSE_LESSONS.findIndex(l => l.id === lessonId);
        const nextL = COURSE_LESSONS[idx + 1];
        const nextOk = nextL && !nextL.locked;
        nav.go('result', {
          title: `Kapitel ${lesson.nr} klart! お疲れ様！`, stars,
          detail: `${res.correctFirstTry} av ${res.total} rätt på första försöket`,
          backTo: 'course',
          nextTo: nextOk ? 'courseLesson' : null, nextParams: nextOk ? { lessonId: nextL.id } : null,
        });
      },
    });
  };

  showPoints();
}
