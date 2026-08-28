// state — sparfil (localStorage) + SRS-motor (spaced repetition).
// Forskningsgrund: Ebbinghaus glömskekurva — repetera precis innan du glömmer.

const KEY = 'nihongo_save_v1';

// Leitner-intervall per box (ms). Fel svar → ner två boxar.
const INTERVALS = [
  0,                    // box 0: direkt igen
  4 * 3600e3,           // box 1: 4 h
  8 * 3600e3,           // box 2: 8 h
  24 * 3600e3,          // box 3: 1 dag
  2 * 24 * 3600e3,      // box 4: 2 dagar
  4 * 24 * 3600e3,      // box 5: 4 dagar
  7 * 24 * 3600e3,      // box 6: 1 vecka
  14 * 24 * 3600e3,     // box 7: 2 veckor
  30 * 24 * 3600e3,     // box 8: 1 månad
];
export const MAX_BOX = INTERVALS.length - 1;

function freshState() {
  return {
    xp: 0,
    streak: { last: null, count: 0 },
    lessons: {},   // lessonId -> stjärnor 1–3
    srs: {},       // itemId -> { box, due, right, wrong }
    settings: { slowAudio: false, autoplay: true },
    bestTest: null, // bästa provresultat { score, total, pass, date }
    level: 'N5',
  };
}

export let S = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...freshState(), ...JSON.parse(raw) };
  } catch { /* korrupt sparfil → börja om */ }
  return freshState();
}

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* privat läge m.m. */ }
}

export function resetAll() {
  S = freshState();
  save();
}

// ---------- XP & nivåer ----------
const RANKS = [
  [0, '見習い · Nybörjare', '🌱'],
  [150, '学生 · Student', '📖'],
  [400, '旅人 · Resenär', '🎒'],
  [800, '忍者 · Ninja', '🥷'],
  [1400, '侍 · Samuraj', '⚔️'],
  [2200, '先生 · Lärare', '🎓'],
  [3200, '達人 · Mästare', '🏆'],
  [5000, '仙人 · Vis eremit', '⛩️'],
];

export function addXP(n) {
  S.xp += n;
  save();
}
export function rank() {
  let r = RANKS[0];
  for (const cand of RANKS) if (S.xp >= cand[0]) r = cand;
  const idx = RANKS.indexOf(r);
  const next = RANKS[idx + 1];
  return { name: r[1], emoji: r[2], next: next ? next[0] : null, base: r[0] };
}

// ---------- Streak ----------
export function touchStreak() {
  const today = new Date().toISOString().slice(0, 10);
  if (S.streak.last === today) return;
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  S.streak.count = (S.streak.last === yesterday) ? S.streak.count + 1 : 1;
  S.streak.last = today;
  save();
}
export function streakDays() {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  if (S.streak.last === today || S.streak.last === yesterday) return S.streak.count;
  return 0;
}

// ---------- SRS ----------
export function srsAdd(itemId) {
  if (!S.srs[itemId]) {
    S.srs[itemId] = { box: 1, due: Date.now() + INTERVALS[1], right: 0, wrong: 0 };
  }
}
export function srsGrade(itemId, correct) {
  const it = S.srs[itemId] || (S.srs[itemId] = { box: 0, due: 0, right: 0, wrong: 0 });
  if (correct) {
    it.right++;
    it.box = Math.min(MAX_BOX, it.box + 1);
  } else {
    it.wrong++;
    it.box = Math.max(0, it.box - 2);
  }
  it.due = Date.now() + INTERVALS[it.box];
  save();
}
export function srsDue() {
  const now = Date.now();
  return Object.entries(S.srs)
    .filter(([, v]) => v.due <= now)
    .sort((a, b) => a[1].due - b[1].due)
    .map(([id]) => id);
}
export function srsBox(itemId) {
  return S.srs[itemId]?.box ?? -1; // -1 = aldrig sedd
}
export function srsStats() {
  const all = Object.values(S.srs);
  return {
    total: all.length,
    mastered: all.filter(v => v.box >= 6).length,
    due: srsDue().length,
  };
}

// ---------- Lektioner ----------
export function setLessonStars(lessonId, stars) {
  const prev = S.lessons[lessonId] || 0;
  if (stars > prev) S.lessons[lessonId] = stars;
  save();
}
export function lessonStars(lessonId) { return S.lessons[lessonId] || 0; }
