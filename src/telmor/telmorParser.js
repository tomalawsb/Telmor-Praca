import { mapTelmorHistoryItem, mapTelmorOrderToCustomer, mapTelmorRowToOrder } from './telmorOrderMapper.js';
import { TELMOR_IMPORT_TYPES } from './telmorConfig.js';

const HEADER_MAP = [
  [/^(nr|numer|zlecenie|nr zlecenia|numer zlecenia|id)$/i, 'number'],
  [/status|stan/i, 'status'],
  [/klient|abonent|nazwa/i, 'customerName'],
  [/telefon|tel\.?|kontakt/i, 'phone'],
  [/miasto|miejscowo/i, 'city'],
  [/adres|ulica/i, 'address'],
  [/temat|opis|sprawa|usługa|usluga|problem/i, 'topic'],
  [/voucher|bon|kupon|kod/i, 'voucher'],
  [/data zlecenia|utworzono|zgłoszono|zgloszono|data rejestracji/i, 'registeredAt'],
  [/termin|planowana/i, 'plannedAt'],
  [/data wykonania|wykonano|zamknięto|zamknieto/i, 'doneAt'],
  [/data/i, 'registeredAt']
];

export function parseTelmorHtmlSnapshot(html = '', options = {}) {
  const sourceType = options.sourceType || TELMOR_IMPORT_TYPES.AUTO;
  const safeHtml = String(html || '').trim();

  if (!safeHtml) {
    return emptyResult('Nie podano HTML do analizy.');
  }

  if (typeof DOMParser === 'undefined') {
    return emptyResult('DOMParser nie jest dostępny w tym środowisku. Parser działa w przeglądarce.');
  }

  const document = new DOMParser().parseFromString(safeHtml, 'text/html');
  const tableRows = parseTables(document, sourceType);
  const detailRows = tableRows.length ? [] : parseDetailsPage(document, sourceType);
  const rawRows = tableRows.length ? tableRows : detailRows;

  const orders = deduplicateOrders(rawRows.map((row) => mapTelmorRowToOrder(row, { defaultStatus: sourceTypeToStatus(sourceType) })));
  const customers = deduplicateCustomers(orders.map(mapTelmorOrderToCustomer).filter((customer) => customer.name || customer.phone));
  const history = parseHistory(document, orders[0]);
  const warnings = [];

  if (!orders.length) {
    warnings.push('Nie znaleziono zleceń. Wklej pełny HTML strony listy albo szczegółów zlecenia.');
  }

  return {
    ok: orders.length > 0,
    sourceType,
    parsedAt: new Date().toISOString(),
    orders,
    customers,
    history,
    warnings,
    stats: {
      rawRows: rawRows.length,
      orders: orders.length,
      customers: customers.length,
      history: history.length,
      tables: document.querySelectorAll('table').length
    }
  };
}

export function parseTelmorTextSnapshot(text = '', options = {}) {
  const safeText = String(text || '').trim();
  if (!safeText) return emptyResult('Nie podano tekstu do analizy.');

  const lines = safeText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const rows = [];

  for (const line of lines) {
    const number = line.match(/\b\d{5,}\b/)?.[0] || '';
    if (!number) continue;
    rows.push({
      number,
      topic: line,
      status: options.defaultStatus || '',
      registeredAt: line.match(/\d{1,2}[.\-/]\d{1,2}[.\-/]\d{2,4}/)?.[0] || ''
    });
  }

  const orders = deduplicateOrders(rows.map((row) => mapTelmorRowToOrder(row, options)));
  return {
    ok: orders.length > 0,
    sourceType: options.sourceType || TELMOR_IMPORT_TYPES.AUTO,
    parsedAt: new Date().toISOString(),
    orders,
    customers: deduplicateCustomers(orders.map(mapTelmorOrderToCustomer)),
    history: [],
    warnings: orders.length ? [] : ['Nie znaleziono numerów zleceń w tekście.'],
    stats: { rawRows: rows.length, orders: orders.length, customers: orders.length, history: 0, tables: 0 }
  };
}

function parseTables(document, sourceType) {
  const rows = [];
  document.querySelectorAll('table').forEach((table) => {
    const headerCells = Array.from(table.querySelectorAll('thead th'));
    const firstRowCells = Array.from(table.querySelectorAll('tr:first-child th, tr:first-child td'));
    const headers = (headerCells.length ? headerCells : firstRowCells).map((cell) => normalizeHeader(cell.textContent));
    const mappedHeaders = headers.map(mapHeaderToField);
    const bodyRows = Array.from(table.querySelectorAll('tbody tr')).length
      ? Array.from(table.querySelectorAll('tbody tr'))
      : Array.from(table.querySelectorAll('tr')).slice(headerCells.length || firstRowCells.some((cell) => cell.tagName === 'TH') ? 1 : 0);

    bodyRows.forEach((tr) => {
      const cells = Array.from(tr.querySelectorAll('td, th')).map((cell) => cleanText(cell.textContent));
      if (cells.length < 2) return;
      const row = {};
      cells.forEach((value, index) => {
        const key = mappedHeaders[index] || inferFieldFromValue(value, index);
        if (!row[key]) row[key] = value;
      });
      row.sourceType = sourceType;
      if (looksLikeOrderRow(row, cells)) rows.push(row);
    });
  });
  return rows;
}

function parseDetailsPage(document, sourceType) {
  const pairs = {};
  const text = cleanText(document.body?.textContent || '');

  document.querySelectorAll('dt, label, th, strong, b').forEach((label) => {
    const labelText = normalizeHeader(label.textContent);
    const key = mapHeaderToField(labelText);
    if (!key) return;

    const valueCandidate = label.nextElementSibling?.textContent
      || label.parentElement?.querySelector('td:last-child, dd, span:last-child')?.textContent
      || '';
    const value = cleanText(valueCandidate).replace(cleanText(label.textContent), '').trim();
    if (value && !pairs[key]) pairs[key] = value;
  });

  if (!pairs.number) pairs.number = text.match(/(?:nr|numer|zlecenie)\D{0,12}(\d{5,})/i)?.[1] || text.match(/\b\d{5,}\b/)?.[0] || '';
  if (!pairs.phone) pairs.phone = text.match(/(?:\+48\s*)?(\d{3}[\s-]?\d{3}[\s-]?\d{3})/)?.[0] || '';
  if (!pairs.topic) pairs.topic = text.slice(0, 160);
  pairs.sourceType = sourceType;

  return pairs.number ? [pairs] : [];
}

function parseHistory(document, order) {
  if (!order) return [];

  const items = [];
  const selectors = ['.history tr', '.historia tr', '.timeline li', '.comment', '.message', '.korespondencja tr'];
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node, index) => {
      const text = cleanText(node.textContent);
      if (!text || text.length < 8) return;
      items.push(mapTelmorHistoryItem({
        id: `${order.id}-hist-${index}`,
        text,
        type: 'telmor',
        title: 'Historia Telmor'
      }, order));
    });
  });

  return deduplicateHistory(items);
}

function sourceTypeToStatus(sourceType) {
  if (sourceType === TELMOR_IMPORT_TYPES.CLOSED_ORDERS) return 'zamknięte';
  return '';
}

function looksLikeOrderRow(row, cells) {
  if (row.number && /\d{5,}/.test(row.number)) return true;
  return cells.join(' ').match(/\b\d{5,}\b/);
}

function mapHeaderToField(header = '') {
  for (const [pattern, field] of HEADER_MAP) {
    if (pattern.test(header)) return field;
  }
  return '';
}

function inferFieldFromValue(value, index) {
  if (/\b\d{5,}\b/.test(value)) return 'number';
  if (/(?:\+48\s*)?\d{3}[\s-]?\d{3}[\s-]?\d{3}/.test(value)) return 'phone';
  if (/\d{1,2}[.\-/]\d{1,2}[.\-/]\d{2,4}/.test(value)) return index < 2 ? 'registeredAt' : 'doneAt';
  return `col${index}`;
}

function normalizeHeader(value = '') {
  return cleanText(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function cleanText(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function deduplicateOrders(orders) {
  return Array.from(new Map(orders.filter((order) => order.number).map((order) => [order.id, order])).values());
}

function deduplicateCustomers(customers) {
  return Array.from(new Map(customers.filter((customer) => customer.id).map((customer) => [customer.id, customer])).values());
}

function deduplicateHistory(history) {
  return Array.from(new Map(history.map((item) => [item.id, item])).values());
}

function emptyResult(message) {
  return {
    ok: false,
    sourceType: TELMOR_IMPORT_TYPES.AUTO,
    parsedAt: new Date().toISOString(),
    orders: [],
    customers: [],
    history: [],
    warnings: [message],
    stats: { rawRows: 0, orders: 0, customers: 0, history: 0, tables: 0 }
  };
}
