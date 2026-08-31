// audio — japansk talsyntes via Web Speech API.
// Bäst röster: Edge (Nanami online), Chrome (Google 日本語). Fallback: valfri ja-röst.

let voice = null;
let voicesLoaded = false;

function pickVoice() {
  const voices = speechSynthesis.getVoices();
  const ja = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('ja'));
  if (ja.length === 0) { voice = null; voicesLoaded = true; return; }
  // Rangordning: naturliga onlineröster först
  const score = v => {
    const n = v.name.toLowerCase();
    if (n.includes('nanami')) return 5;
    if (n.includes('online') || n.includes('natural')) return 4;
    if (n.includes('google')) return 3;
    if (n.includes('keita') || n.includes('ayumi') || n.includes('haruka')) return 2;
    return 1;
  };
  ja.sort((a, b) => score(b) - score(a));
  voice = ja[0];
  voicesLoaded = true;
}

// iOS (särskilt hemskärmsappar) blockerar talsyntes tills den "låsts upp" av en
// användargest. Första tryck var som helst spelar en tyst tom yttring — därefter
// fungerar även automatisk uppläsning (via setTimeout).
let unlocked = false;
function unlockAudio() {
  if (unlocked || !('speechSynthesis' in window)) return;
  unlocked = true;
  try {
    speechSynthesis.resume();
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0;
    speechSynthesis.speak(u);
  } catch { /* upplåsning är best effort */ }
}

export function initAudio() {
  if (!('speechSynthesis' in window)) { voicesLoaded = true; return; }
  pickVoice();
  speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
  // Vissa webbläsare fyller getVoices() först efter en stund (och utan event) — polla tills träff
  for (const t of [200, 600, 1200, 2500, 4000]) {
    setTimeout(() => { if (!voice) pickVoice(); }, t);
  }
  document.addEventListener('pointerdown', unlockAudio, { once: true, capture: true });
  document.addEventListener('keydown', unlockAudio, { once: true, capture: true });
}

export function hasJapaneseVoice() {
  if (!voice) pickVoice();
  return voice !== null;
}

export function speak(text, { rate = 0.9, onend } = {}) {
  if (!('speechSynthesis' in window)) { onend?.(); return; }
  if (!voice) pickVoice();
  const doSpeak = () => {
    try { speechSynthesis.resume(); } catch { /* iOS kan fastna i paused-läge */ }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    if (voice) u.voice = voice;
    u.rate = rate;
    u.pitch = 1;
    u.volume = 1;
    if (onend) u.onend = onend;
    speechSynthesis.speak(u);
  };
  // iOS-race: cancel() direkt följt av speak() blir ibland helt tyst — vänta en tick
  if (speechSynthesis.speaking || speechSynthesis.pending) {
    speechSynthesis.cancel();
    setTimeout(doSpeak, 80);
  } else {
    doSpeak();
  }
}

export function stopSpeech() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}

export function voiceName() {
  return voice ? voice.name : null;
}
