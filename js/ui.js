// ui — små DOM-hjälpare.

export function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

export function starsHTML(n, max = 3) {
  let s = '<span class="stars">';
  for (let i = 0; i < max; i++) s += `<span class="${i < n ? 'on' : 'off'}">★</span>`;
  return s + '</span>';
}

export function confetti() {
  const emojis = ['🌸', '⭐', '🎉', '✨', '🏮'];
  for (let i = 0; i < 18; i++) {
    const d = el('div', 'confetti-burst', emojis[Math.floor(Math.random() * emojis.length)]);
    d.style.left = Math.random() * 100 + 'vw';
    d.style.top = (-10 - Math.random() * 20) + 'vh';
    d.style.animationDelay = (Math.random() * 0.5) + 's';
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 2200);
  }
}

export function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}
