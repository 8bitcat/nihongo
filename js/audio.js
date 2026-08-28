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

export function initAudio() {
  if (!('speechSynthesis' in window)) { voicesLoaded = true; return; }
  pickVoice();
  speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
  // Vissa webbläsare fyller getVoices() först efter en stund (och utan event) — polla tills träff
  for (const t of [200, 600, 1200, 2500, 4000]) {
    setTimeout(() => { if (!voice) pickVoice(); }, t);
  }
}

export function hasJapaneseVoice() {
  if (!voice) pickVoice();
  return voice !== null;
}

export function speak(text, { rate = 0.9, onend } = {}) {
  if (!('speechSynthesis' in window)) { onend?.(); return; }
  if (!voice) pickVoice();
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP';
  if (voice) u.voice = voice;
  u.rate = rate;
  u.pitch = 1;
  if (onend) u.onend = onend;
  speechSynthesis.speak(u);
}

export function stopSpeech() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}

export function voiceName() {
  return voice ? voice.name : null;
}
