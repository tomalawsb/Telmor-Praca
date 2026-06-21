import { localDbGet, localDbSet } from '../local/localDb.js';

const DEVICE_KEY = 'sync:deviceIdentity:v1';

export async function getDeviceIdentity() {
  const saved = await localDbGet(DEVICE_KEY);
  if (saved?.deviceId) return normalizeDevice(saved);

  const device = normalizeDevice({
    deviceId: createDeviceId(),
    name: guessDeviceName(),
    platform: guessPlatform(),
    createdAt: new Date().toISOString(),
    lastSeenAt: new Date().toISOString()
  });

  await localDbSet(DEVICE_KEY, device);
  return device;
}

export async function updateDeviceIdentity(patch = {}) {
  const current = await getDeviceIdentity();
  const next = normalizeDevice({
    ...current,
    ...patch,
    lastSeenAt: new Date().toISOString()
  });
  await localDbSet(DEVICE_KEY, next);
  return next;
}

function normalizeDevice(raw = {}) {
  return {
    deviceId: raw.deviceId || createDeviceId(),
    name: raw.name || guessDeviceName(),
    platform: raw.platform || guessPlatform(),
    createdAt: raw.createdAt || new Date().toISOString(),
    lastSeenAt: raw.lastSeenAt || new Date().toISOString()
  };
}

function createDeviceId() {
  const randomPart = crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
  return `device-${randomPart}`;
}

function guessPlatform() {
  const ua = navigator.userAgent || '';
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad/i.test(ua)) return 'iOS';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Macintosh/i.test(ua)) return 'macOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Web';
}

function guessDeviceName() {
  const platform = guessPlatform();
  if (platform === 'Android' || platform === 'iOS') return `Telefon ${platform}`;
  if (platform === 'Windows' || platform === 'macOS' || platform === 'Linux') return `Komputer ${platform}`;
  return 'Urządzenie web';
}
