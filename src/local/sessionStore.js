const TELMOR_SESSION_STATE_KEY = 'telmor_session_state_v1';

export function saveTelmorSessionState(state) {
  const payload = {
    loggedIn: Boolean(state?.loggedIn),
    lastCheckAt: state?.lastCheckAt || new Date().toISOString(),
    message: state?.message || ''
  };
  sessionStorage.setItem(TELMOR_SESSION_STATE_KEY, JSON.stringify(payload));
  return payload;
}

export function getTelmorSessionState() {
  const raw = sessionStorage.getItem(TELMOR_SESSION_STATE_KEY);
  if (!raw) {
    return { loggedIn: false, lastCheckAt: null, message: 'Sesja Telmor nie była jeszcze sprawdzana.' };
  }

  try {
    return JSON.parse(raw);
  } catch {
    sessionStorage.removeItem(TELMOR_SESSION_STATE_KEY);
    return { loggedIn: false, lastCheckAt: null, message: 'Stan sesji był uszkodzony i został wyczyszczony.' };
  }
}

export function clearTelmorSessionState() {
  sessionStorage.removeItem(TELMOR_SESSION_STATE_KEY);
}
