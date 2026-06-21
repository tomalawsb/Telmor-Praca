export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null;

  try {
    const registration = await navigator.serviceWorker.register('./service-worker.js');
    await navigator.serviceWorker.ready;
    return registration;
  } catch (error) {
    console.warn('Nie udało się zarejestrować service workera:', error);
    return null;
  }
}
