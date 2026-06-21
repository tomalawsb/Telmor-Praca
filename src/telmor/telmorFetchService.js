import { TELMOR_PORTAL } from './telmorConfig.js';

export async function fetchTelmorPagePlaceholder() {
  throw new Error(`Pobieranie na żywo z ${TELMOR_PORTAL.baseUrl} nie jest uruchomione w Etapie 8. Ten etap przygotowuje parser, mapowanie danych i ręczny import HTML/tekstu.`);
}

export function getTelmorPortalInfo() {
  return { ...TELMOR_PORTAL };
}
