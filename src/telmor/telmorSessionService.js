import { clearTelmorSessionState, getTelmorSessionState, saveTelmorSessionState } from '../local/sessionStore.js';

export function getCurrentTelmorSession() {
  return getTelmorSessionState();
}

export function markTelmorSessionActive(message = 'Sesja Telmor oznaczona lokalnie jako aktywna.') {
  return saveTelmorSessionState({
    loggedIn: true,
    message
  });
}

export function markTelmorSessionInactive(message = 'Sesja Telmor nieaktywna.') {
  return saveTelmorSessionState({
    loggedIn: false,
    message
  });
}

export function clearTelmorSession() {
  clearTelmorSessionState();
}
