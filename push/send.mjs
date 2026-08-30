// Skickar dagens pushnotis till alla prenumererade enheter.
// Körs av GitHub Actions (cron 17:00 + 18:00 UTC) — skickar bara när klockan är 19 i Stockholm,
// så sommartid/vintertid löser sig automatiskt. FORCE=1 (workflow_dispatch) skickar direkt.
import webpush from 'web-push';

const VAPID_PUBLIC_KEY = 'BFzdWVUv86D8-rJ0uGplehCBaqGjPcp_mTdQ6o456CHSRzfeikDjPLc-JOW497rkoz9YKTsuED7-nbNFELGdexU';
const { VAPID_PRIVATE_KEY, PUSH_SUBSCRIPTIONS, FORCE } = process.env;

const stockholmHour = parseInt(
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Stockholm', hour: '2-digit', hour12: false })
    .format(new Date()), 10);

if (FORCE !== '1' && stockholmHour !== 19) {
  console.log(`Klockan är ${stockholmHour} i Stockholm — inte 19. Hoppar över (andra cron-körningen tar det).`);
  process.exit(0);
}

if (!VAPID_PRIVATE_KEY) { console.error('VAPID_PRIVATE_KEY saknas som secret.'); process.exit(1); }
if (!PUSH_SUBSCRIPTIONS) {
  console.log('Secreten PUSH_SUBSCRIPTIONS är inte satt än — aktivera push i appen och klistra in JSON:en i repo-secrets. Inget skickas.');
  process.exit(0);
}

let subs;
try {
  subs = JSON.parse(PUSH_SUBSCRIPTIONS);
  if (!Array.isArray(subs)) subs = [subs];
} catch (e) {
  console.error('PUSH_SUBSCRIPTIONS är inte giltig JSON:', e.message);
  process.exit(1);
}

webpush.setVapidDetails('https://github.com/8bitcat/nihongo', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// Deklarativt format: iOS 18.4+ visar notisen + sätter badgen utan att väcka service workern.
// Äldre iOS/desktop hanteras av sw.js push-fallback som läser samma fält.
const payload = JSON.stringify({
  web_push: 8030,
  notification: {
    title: '⛩️ Dags för dagens japanska!',
    body: 'Repetitionskorten väntar — 5 minuter räcker. 頑張って！',
    navigate: 'https://8bitcat.github.io/nihongo/',
    app_badge: 1,
  },
});

let ok = 0, gone = 0, failed = 0;
for (const sub of subs) {
  try {
    await webpush.sendNotification(sub, payload, { TTL: 6 * 3600, urgency: 'normal' });
    ok++;
  } catch (e) {
    if (e.statusCode === 404 || e.statusCode === 410) {
      gone++;
      console.warn('Prenumeration har gått ut (ta bort den ur secreten och aktivera om i appen):', sub.endpoint?.slice(0, 60));
    } else {
      failed++;
      console.error('Sändfel', e.statusCode, e.body || e.message);
    }
  }
}
console.log(`Klart: ${ok} skickade, ${gone} utgångna, ${failed} fel (av ${subs.length}).`);
process.exit(failed > 0 && ok === 0 ? 1 : 0);
