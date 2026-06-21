import { loadTelmorCredentials } from '../local/credentialVault.js';
import { saveTelmorSessionState } from '../local/sessionStore.js';

export async function prepareTelmorLoginContext() {
  const credentials = await loadTelmorCredentials();
  if (!credentials?.login || !credentials?.password) {
    throw new Error('Brak lokalnie zapisanych danych logowania Telmor. Uzupełnij je w Ustawieniach.');
  }

  return {
    login: credentials.login,
    passwordLength: credentials.password.length,
    rememberSession: Boolean(credentials.rememberSession)
  };
}

export async function markTelmorLoginAsReady() {
  const context = await prepareTelmorLoginContext();
  saveTelmorSessionState({
    loggedIn: false,
    message: 'Dane lokalne są gotowe. Prawdziwe logowanie do Telmoru nie jest jeszcze uruchomione w Etapie 8.'
  });
  return context;
}
