// gamify — dagliga uppdrag, utmärkelser, belöningskista, toasts, rang-upp.
// Designprincip: belöna beteenden som forskningen säger driver inlärning
// (repetition, produktion, lyssning) — inte bara lätta poäng.

import { el, confetti, escapeHTML } from './ui.js';
import { S, save, addXP, rank, streakDays } from './state.js';
import { kanaLessonsFor } from '../data/kana.js';
import { KANJI_LESSONS } from '../data/kanji.js';
import { VOCAB } from '../data/vocab.js';
import { MANGA, STORIES } from '../data/stories.js';
import { COURSE_LESSONS } from '../data/course.js';

// ---------- Dagliga uppdrag ----------
const QUEST_POOL = [
  { id:'review',  type:'review', target:10, label:'Repetera 10 kort',              xp:15, emoji:'🏮' },
  { id:'lesson',  type:'lesson', target:1,  label:'Klara 1 lektion',               xp:15, emoji:'📖' },
  { id:'listen',  type:'listen', target:8,  label:'8 rätt på lyssningsfrågor',     xp:15, emoji:'👂' },
  { id:'write',   type:'write',  target:6,  label:'6 rätt skriv- eller ritövningar', xp:15, emoji:'✍️' },
  { id:'arcade',  type:'arcade', target:15, label:'Nå 15 poäng i Kana-regn',       xp:20, emoji:'🌧️' },
  { id:'combo',   type:'combo',  target:8,  label:'Nå kombo ×8 i en övning',       xp:15, emoji:'🔥' },
  { id:'grind20', type:'grind',  target:20, label:'Maratona 20 ord',               xp:20, emoji:'🎯' },
];
const MAX_TYPES = new Set(['arcade', 'combo']); // dessa mäter bästa resultat, inte summa

function todayStr() { return new Date().toISOString().slice(0, 10); }

function ensureToday() {
  const today = todayStr();
  if (S.quests.date !== today) {
    S.quests = { date: today, progress: {}, claimed: [] };
    save();
  }
}

export function questsForToday() {
  ensureToday();
  // Deterministiskt dagligt urval: tre uppdrag i följd med startindex ur datumet
  let hash = 0;
  for (const ch of S.quests.date) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const start = hash % QUEST_POOL.length;
  return [0, 1, 2].map(i => QUEST_POOL[(start + i) % QUEST_POOL.length]);
}

export function questProgress(q) { ensureToday(); return S.quests.progress[q.id] || 0; }
export function questClaimed(q) { ensureToday(); return S.quests.claimed.includes(q.id); }

export function track(type, amount = 1) {
  ensureToday();
  for (const q of questsForToday()) {
    if (q.type !== type || questClaimed(q)) continue;
    const cur = S.quests.progress[q.id] || 0;
    S.quests.progress[q.id] = MAX_TYPES.has(type) ? Math.max(cur, amount) : cur + amount;
  }
  save();
}

export function claimQuest(q) {
  ensureToday();
  if (questClaimed(q) || questProgress(q) < q.target) return false;
  S.quests.claimed.push(q.id);
  addXP(q.xp);
  save();
  showToast(`${q.emoji} Uppdrag klart! <b>+${q.xp} XP</b>`);
  return true;
}

// ---------- Utmärkelser ----------
export const ACHIEVEMENTS = [
  { id:'first-lesson', name:'Första steget',      emoji:'👣', desc:'Klara din första lektion',
    check: s => Object.keys(s.lessons).length >= 1 },
  { id:'hira-all',     name:'Hiragana-mästare',   emoji:'🌸', desc:'Alla hiragana-lektioner klarade',
    check: s => kanaLessonsFor('hira').every(l => (s.lessons[l.id] || 0) > 0) },
  { id:'kata-all',     name:'Katakana-mästare',   emoji:'⚡', desc:'Alla katakana-lektioner klarade',
    check: s => kanaLessonsFor('kata').every(l => (s.lessons[l.id] || 0) > 0) },
  { id:'kanji-first',  name:'Första kanjit',      emoji:'🖌️', desc:'Klara en kanji-lektion',
    check: s => KANJI_LESSONS.some(l => (s.lessons[l.id] || 0) > 0) },
  { id:'kanji-all',    name:'Kanji-kung',         emoji:'👑', desc:'Alla 80 N5-kanji genomgångna',
    check: s => KANJI_LESSONS.every(l => (s.lessons[l.id] || 0) > 0) },
  { id:'words-50',     name:'50 ord',             emoji:'🍜', desc:'50 ord påbörjade',
    check: s => VOCAB.filter(w => s.srs[w.id]).length >= 50 },
  { id:'words-150',    name:'150 ord',            emoji:'🍱', desc:'150 ord påbörjade',
    check: s => VOCAB.filter(w => s.srs[w.id]).length >= 150 },
  { id:'words-300',    name:'Ordskatt',           emoji:'💰', desc:'300 ord påbörjade',
    check: s => VOCAB.filter(w => s.srs[w.id]).length >= 300 },
  { id:'streak-3',     name:'Tre dagar i rad',    emoji:'🔥', desc:'3 dagars streak',
    check: () => streakDays() >= 3 },
  { id:'streak-7',     name:'En hel vecka',       emoji:'🏮', desc:'7 dagars streak',
    check: () => streakDays() >= 7 },
  { id:'streak-30',    name:'En hel månad!',      emoji:'🎆', desc:'30 dagars streak',
    check: () => streakDays() >= 30 },
  { id:'combo-10',     name:'Kombo ×10',          emoji:'💫', desc:'10 rätt i rad i en övning',
    check: s => (s.counters.bestCombo || 0) >= 10 },
  { id:'rain-30',      name:'Regnmästare',        emoji:'🌧️', desc:'30 poäng i Kana-regn',
    check: s => (s.highscores.kanaRain || 0) >= 30 },
  { id:'boss-first',   name:'Bossdödare',         emoji:'⚔️', desc:'Besegra din första boss',
    check: s => Object.keys(s.lessons).some(id => id.startsWith('boss-')) },
  { id:'mastered-50',  name:'50 mästrade kort',   emoji:'🎓', desc:'50 kort i högsta SRS-boxarna',
    check: s => Object.values(s.srs).filter(v => v.box >= 6).length >= 50 },
  { id:'xp-1000',      name:'1000 XP',            emoji:'💎', desc:'Samla 1000 XP',
    check: s => s.xp >= 1000 },
  { id:'test-pass',    name:'合格 — N5 godkänd!', emoji:'🎌', desc:'Klara JLPT N5-mockprovet',
    check: s => !!(s.bestTest && s.bestTest.pass) },
  { id:'manga-first',  name:'Mangaläsare',        emoji:'📖', desc:'Läs din första manga — åt rätt håll!',
    check: s => MANGA.some(m => (s.lessons[m.id] || 0) > 0) },
  { id:'bookworm',     name:'Bokmal',             emoji:'📚', desc:'Läs alla sagor och all manga',
    check: s => [...MANGA, ...STORIES].every(x => (s.lessons[x.id] || 0) > 0) },
  { id:'course-start', name:'Kursstart',          emoji:'🎓', desc:'Klara kursens första kapitel',
    check: s => (s.lessons['kurs-1'] || 0) > 0 },
  { id:'course-half',  name:'Halva boken!',       emoji:'📗', desc:'Klara kursens kapitel 1–6',
    check: s => COURSE_LESSONS.slice(0, 6).every(l => (s.lessons[l.id] || 0) > 0) },
  { id:'course-all',   name:'HELA Genki I! 🎉',   emoji:'🏯', desc:'Klara kursens alla 12 kapitel',
    check: s => COURSE_LESSONS.every(l => (s.lessons[l.id] || 0) > 0) },
  { id:'grind-500',    name:'500 ord',            emoji:'🎯', desc:'500 ord i Ordmaraton',
    check: s => (s.grind?.pos || 0) >= 500 },
  { id:'grind-1000',   name:'Tusenklubban',       emoji:'🏅', desc:'1 000 ord i Ordmaraton',
    check: s => (s.grind?.pos || 0) >= 1000 },
  { id:'grind-2000',   name:'2 000 ord',          emoji:'⛰️', desc:'2 000 ord i Ordmaraton',
    check: s => (s.grind?.pos || 0) >= 2000 },
  { id:'grind-3000',   name:'MÅLET: 3 000 ord!',  emoji:'👑', desc:'Japanskans vanligaste ord — avklarade',
    check: s => (s.grind?.pos || 0) >= 3000 },
  { id:'grind-5000',   name:'5 000 ord',          emoji:'🌋', desc:'Halvvägs till 10 000',
    check: s => (s.grind?.pos || 0) >= 5000 },
  { id:'grind-10000',  name:'HELA BANAN — 10 000!', emoji:'🗻', desc:'Alla ord i maratonet avklarade',
    check: s => (s.grind?.pos || 0) >= 10000 },
];

export function checkAchievements() {
  const fresh = [];
  for (const a of ACHIEVEMENTS) {
    if (S.badges.includes(a.id)) continue;
    let ok = false;
    try { ok = a.check(S); } catch { /* trasig check får inte krascha spelet */ }
    if (ok) {
      S.badges.push(a.id);
      addXP(10);
      fresh.push(a);
    }
  }
  if (fresh.length) {
    save();
    confetti();
    for (const a of fresh) showToast(`${a.emoji} Utmärkelse: <b>${escapeHTML(a.name)}</b> +10 XP`);
  }
  return fresh;
}

export function reportCombo(combo) {
  if (combo > (S.counters.bestCombo || 0)) { S.counters.bestCombo = combo; save(); }
  track('combo', combo);
}

// ---------- Belöningskista (variabel belöning) ----------
export function rollReward() {
  const r = Math.random();
  if (r < 0.10) return { xp: 25 + Math.floor(Math.random() * 11), emoji: '🏆', name: 'SÄLLSYNT skatt!' };
  if (r < 0.40) return { xp: 12 + Math.floor(Math.random() * 9),  emoji: '💰', name: 'Fin belöning!' };
  return { xp: 5 + Math.floor(Math.random() * 6), emoji: '🎁', name: 'Belöning!' };
}

// ---------- Rang-upp ----------
export function checkRankUp() {
  const r = rank();
  if (S.lastSeenRank === null) { S.lastSeenRank = r.name; save(); return; }
  if (S.lastSeenRank !== r.name) {
    S.lastSeenRank = r.name;
    save();
    confetti();
    showToast(`${r.emoji} NY RANG: <b>${escapeHTML(r.name)}</b>`);
  }
}

// ---------- Toast-kö ----------
const toastQueue = [];
let toastActive = false;

export function showToast(html) {
  toastQueue.push(html);
  if (!toastActive) nextToast();
}
function nextToast() {
  const html = toastQueue.shift();
  if (html === undefined) { toastActive = false; return; }
  toastActive = true;
  const t = el('div', 'toast', html);
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 30);
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => { t.remove(); nextToast(); }, 350);
  }, 2600);
}
