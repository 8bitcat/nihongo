// push — prenumerera på riktiga pushnotiser (skickas dagligen kl 19 av GitHub Actions).
// Flöde: Aktivera (på iPhone-hemskärmsappen) → kopiera JSON → klistra in i repo-secreten
// PUSH_SUBSCRIPTIONS. Utan server sker det steget manuellt — en gång per enhet.

const VAPID_PUBLIC_KEY = 'BFzdWVUv86D8-rJ0uGplehCBaqGjPcp_mTdQ6o456CHSRzfeikDjPLc-JOW497rkoz9YKTsuED7-nbNFELGdexU';

function urlBase64ToUint8Array(base64) {
  const padding = '='.repeat((4 - base64.length % 4) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

export function pushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

export async function currentSubscription() {
  try {
    const reg = await navigator.serviceWorker.ready;
    return await reg.pushManager.getSubscription();
  } catch { return null; }
}

// Måste anropas från en användargest. Returnerar { status, json? }.
export async function subscribePush() {
  if (!pushSupported()) return { status: 'unsupported' };
  try {
    if ('Notification' in window && Notification.permission !== 'granted') {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') return { status: 'denied' };
    }
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }
    return { status: 'ok', json: JSON.stringify([sub.toJSON()], null, 2) };
  } catch (e) {
    return { status: 'error', message: e.message };
  }
}
