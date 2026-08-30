// badge — röd siffra på hemskärmsikonen (iOS 16.4+, kräver hemskärmsapp + notisbehörighet).
// iOS kan INTE schemalägga notiser utan server — badgen sätts i stället varje gång appen
// lämnas/stängs och visar hur många kort som är (eller snart blir) klara för repetition.

import { S } from './state.js';

const SOON_MS = 18 * 3600e3; // "väntar snart": förfaller inom 18 h → syns på morgonen

export function badgeSupported() {
  return 'setAppBadge' in navigator;
}

export function isStandalone() {
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

export function dueSoonCount() {
  const limit = Date.now() + SOON_MS;
  return Object.values(S.srs).filter(v => v.due <= limit).length;
}

export function updateBadge() {
  try {
    if (!badgeSupported()) return;
    const n = dueSoonCount();
    if (n > 0) navigator.setAppBadge(Math.min(n, 99));
    else navigator.clearAppBadge();
  } catch { /* badge är nice-to-have — får aldrig krascha */ }
}

// Måste anropas från en användargest (knapp) — iOS visar badgen först när notisbehörighet finns.
export async function enableBadge() {
  if (!badgeSupported()) return 'unsupported';
  try {
    if ('Notification' in window && Notification.permission !== 'granted') {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') return 'denied';
    }
    updateBadge();
    return 'ok';
  } catch {
    return 'error';
  }
}

export function initBadge() {
  // Uppdatera badgen varje gång appen lämnas — det är då den syns på hemskärmen
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') updateBadge();
  });
  window.addEventListener('pagehide', updateBadge);
  // Och rensa/uppdatera direkt vid start (t.ex. efter klarad repetition)
  updateBadge();
}
