const AUTH_STORAGE_KEY = 'telmor_praca_local_session_v1';
const AUTH_EVENT_NAME = 'telmor-auth-changed';

export function getAuthSession() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getAuthSession());
}

export function getUserInitials() {
  const session = getAuthSession();
  const value = session?.displayName || session?.email || 'Tomek';
  return String(value).trim().slice(0, 2).toUpperCase() || 'TW';
}

export function getUserEmail() {
  return getAuthSession()?.email || 'konto lokalne';
}

export function getAuthModeLabel() {
  return getAuthSession() ? 'konto lokalne' : 'nieuruchomione';
}

export function getLocalAccountStatus() {
  return {
    configured: true,
    localOnly: true
  };
}


export async function loginToApp({ email, password }) {
  const login = String(email || '').trim() || 'lokalnie@telmor-praca';
  if (!password) throw new Error('Podaj hasło lokalne albo użyj wejścia lokalnego.');

  const session = {
    uid: 'local-user',
    email: login,
    displayName: login.split('@')[0] || 'Tomek',
    mode: 'local',
    signedInAt: new Date().toISOString()
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  emitAuthChange();
  return session;
}

export async function registerAppAccount({ email, password }) {
  return loginToApp({ email, password });
}

export async function resetAppPassword() {
  throw new Error('Aplikacja działa lokalnie. Nie ma serwera resetowania hasła.');
}

export function loginDemoAccount(email = 'lokalnie@telmor-praca') {
  const session = {
    uid: 'local-user',
    email,
    displayName: 'Tomek',
    mode: 'local',
    signedInAt: new Date().toISOString()
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  emitAuthChange();
  return session;
}

export async function getValidIdToken() {
  return null;
}

export function signOutFromApp() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  emitAuthChange();
}

export function onAuthChange(callback) {
  window.addEventListener(AUTH_EVENT_NAME, callback);
  return () => window.removeEventListener(AUTH_EVENT_NAME, callback);
}

function emitAuthChange() {
  window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: getAuthSession() }));
}
