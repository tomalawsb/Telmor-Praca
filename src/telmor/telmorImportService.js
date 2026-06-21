import { saveCustomer } from '../data/customerRepository.js';
import { saveHistoryEntry } from '../data/historyRepository.js';
import { saveOrders } from '../data/orderRepository.js';
import { localDbGet, localDbSet } from '../local/localDb.js';
import { parseTelmorHtmlSnapshot, parseTelmorTextSnapshot } from './telmorParser.js';

const LAST_IMPORT_KEY = 'telmor_last_import_preview_v1';

export async function analyzeTelmorSnapshot({ input, sourceType }) {
  const value = String(input || '').trim();
  const looksLikeHtml = /<\s*(html|table|div|tr|td|body|span|form)\b/i.test(value);
  const result = looksLikeHtml
    ? parseTelmorHtmlSnapshot(value, { sourceType })
    : parseTelmorTextSnapshot(value, { sourceType });

  await localDbSet(LAST_IMPORT_KEY, summarizeImport(result));
  return result;
}

export async function saveTelmorImportLocally(parseResult) {
  if (!parseResult?.orders?.length) {
    throw new Error('Brak zleceń do zapisania. Najpierw przeanalizuj HTML lub tekst Telmor.');
  }

  const savedOrders = await saveOrders(parseResult.orders);
  for (const customer of parseResult.customers || []) await saveCustomer(customer);
  for (const entry of parseResult.history || []) await saveHistoryEntry(entry);

  await localDbSet(LAST_IMPORT_KEY, summarizeImport(parseResult, 'local'));

  return {
    saved: true,
    mode: 'local',
    orders: savedOrders.length,
    customers: parseResult.customers?.length || 0,
    history: parseResult.history?.length || 0,
    message: 'Dane Telmor zapisane lokalnie w tej przeglądarce.'
  };
}

export async function getLastTelmorImportSummary() {
  return localDbGet(LAST_IMPORT_KEY);
}

function summarizeImport(result, mode = 'preview') {
  return {
    mode,
    parsedAt: result?.parsedAt || new Date().toISOString(),
    sourceType: result?.sourceType || 'auto',
    stats: result?.stats || {},
    warnings: result?.warnings || []
  };
}
