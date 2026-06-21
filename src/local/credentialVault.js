import { localDbDelete, localDbGet, localDbSet } from './localDb.js';

const CREDENTIALS_KEY = 'telmor_credentials_v1';
const DEVICE_SECRET_KEY = 'telmor_device_secret_v1';
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function isCredentialVaultSupported() {
  return Boolean(window.crypto?.subtle && window.crypto?.getRandomValues && window.indexedDB);
}

export async function saveTelmorCredentials({ login, password, rememberSession = true }) {
  if (!isCredentialVaultSupported()) {
    throw new Error('Ta przeglądarka nie obsługuje wymaganego lokalnego sejfu.');
  }

  const safeLogin = String(login || '').trim();
  const safePassword = String(password || '');

  if (!safeLogin) throw new Error('Podaj login Telmor.');
  if (!safePassword) throw new Error('Podaj hasło Telmor.');

  const key = await getOrCreateDeviceKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const payload = JSON.stringify({
    login: safeLogin,
    password: safePassword,
    rememberSession: Boolean(rememberSession),
    savedAt: new Date().toISOString()
  });

  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(payload)
  );

  const record = {
    version: 1,
    algorithm: 'AES-GCM',
    iv: arrayBufferToBase64(iv),
    data: arrayBufferToBase64(encrypted),
    loginHint: safeLogin,
    rememberSession: Boolean(rememberSession),
    savedAt: new Date().toISOString()
  };

  await localDbSet(CREDENTIALS_KEY, record);
  return { login: safeLogin, rememberSession: Boolean(rememberSession), savedAt: record.savedAt };
}

export async function loadTelmorCredentials() {
  if (!isCredentialVaultSupported()) {
    throw new Error('Ta przeglądarka nie obsługuje wymaganego lokalnego sejfu.');
  }

  const record = await localDbGet(CREDENTIALS_KEY);
  if (!record) return null;

  const key = await getOrCreateDeviceKey();
  const iv = base64ToUint8Array(record.iv);
  const encrypted = base64ToUint8Array(record.data);

  try {
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );
    return JSON.parse(decoder.decode(decrypted));
  } catch {
    throw new Error('Nie udało się odszyfrować zapisanych danych Telmor na tym urządzeniu.');
  }
}

export async function getTelmorCredentialStatus() {
  const record = await localDbGet(CREDENTIALS_KEY);
  if (!record) {
    return {
      exists: false,
      supported: isCredentialVaultSupported(),
      loginHint: '',
      savedAt: null,
      rememberSession: true
    };
  }

  return {
    exists: true,
    supported: isCredentialVaultSupported(),
    loginHint: record.loginHint || '',
    savedAt: record.savedAt || null,
    rememberSession: Boolean(record.rememberSession)
  };
}

export async function deleteTelmorCredentials() {
  await localDbDelete(CREDENTIALS_KEY);
  return true;
}

export async function verifyTelmorCredentialsLocally() {
  const credentials = await loadTelmorCredentials();
  if (!credentials?.login || !credentials?.password) {
    throw new Error('Brak kompletnych danych logowania Telmor.');
  }
  return {
    login: credentials.login,
    passwordLength: credentials.password.length,
    rememberSession: credentials.rememberSession,
    savedAt: credentials.savedAt
  };
}

async function getOrCreateDeviceKey() {
  const existing = localStorage.getItem(DEVICE_SECRET_KEY);
  if (existing) {
    const raw = base64ToUint8Array(existing);
    return window.crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']);
  }

  const raw = window.crypto.getRandomValues(new Uint8Array(32));
  localStorage.setItem(DEVICE_SECRET_KEY, arrayBufferToBase64(raw));
  return window.crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

function arrayBufferToBase64(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function base64ToUint8Array(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
