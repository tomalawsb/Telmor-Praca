import { getTelmorCredentialStatus, isCredentialVaultSupported, verifyTelmorCredentialsLocally } from '../local/credentialVault.js';
import { getTelmorSessionState } from '../local/sessionStore.js';

export async function getTelmorModuleStatus() {
  const credentialStatus = await getTelmorCredentialStatus();
  const sessionState = getTelmorSessionState();

  return {
    vaultSupported: isCredentialVaultSupported(),
    credentialsSaved: Boolean(credentialStatus.exists),
    loginHint: credentialStatus.loginHint || '',
    credentialsSavedAt: credentialStatus.savedAt || '',
    rememberSession: Boolean(credentialStatus.rememberSession),
    sessionActive: Boolean(sessionState.loggedIn),
    sessionLastCheckAt: sessionState.lastCheckAt || '',
    sessionMessage: sessionState.message || '',
    readyForManualImport: true,
    readyForLiveSync: Boolean(credentialStatus.exists)
  };
}

export async function testLocalTelmorCredentials() {
  const result = await verifyTelmorCredentialsLocally();
  return {
    ok: true,
    login: result.login,
    passwordLength: result.passwordLength,
    rememberSession: result.rememberSession,
    savedAt: result.savedAt
  };
}
