import { compactText, normalizePhone, normalizeText } from './normalizeText.js';

export function prepareQuery(query = '') {
  const normalized = normalizeText(query);
  const compact = compactText(query);
  const phone = normalizePhone(query);
  const words = normalized.split(' ').filter(Boolean);

  return {
    raw: String(query || '').trim(),
    normalized,
    compact,
    phone,
    words
  };
}

export function rankRecord(record = {}, query = '', fieldWeights = {}) {
  const prepared = typeof query === 'object' ? query : prepareQuery(query);
  if (!prepared.raw) return { score: 0, reasons: [] };

  let score = 0;
  const reasons = [];

  Object.entries(fieldWeights).forEach(([field, weight]) => {
    const value = getValue(record, field);
    const normalizedValue = normalizeText(value);
    const compactValue = compactText(value);
    const phoneValue = normalizePhone(value);

    if (!normalizedValue && !compactValue && !phoneValue) return;

    if (prepared.normalized && normalizedValue === prepared.normalized) {
      score += weight * 12;
      reasons.push(`dokładnie: ${labelField(field)}`);
      return;
    }

    if (prepared.compact && compactValue === prepared.compact) {
      score += weight * 10;
      reasons.push(`dokładnie: ${labelField(field)}`);
      return;
    }

    if (prepared.phone && phoneValue && phoneValue.includes(prepared.phone)) {
      score += weight * 9;
      reasons.push(`telefon: ${labelField(field)}`);
      return;
    }

    if (prepared.normalized && normalizedValue.includes(prepared.normalized)) {
      score += weight * 7;
      reasons.push(`zawiera: ${labelField(field)}`);
    }

    if (prepared.compact && compactValue.includes(prepared.compact)) {
      score += weight * 5;
      reasons.push(`skrót: ${labelField(field)}`);
    }

    const wordScore = scoreWords(prepared.words, normalizedValue);
    if (wordScore > 0) {
      score += weight * wordScore;
      reasons.push(`słowa: ${labelField(field)}`);
    }
  });

  const tokenScore = scoreSearchTokens(record.searchTokens, prepared);
  if (tokenScore > 0) {
    score += tokenScore;
    reasons.push('indeks wyszukiwania');
  }

  return {
    score,
    reasons: [...new Set(reasons)].slice(0, 3)
  };
}

export function sortRankedResults(results = []) {
  return results
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return String(b.updatedAt || b.createdAt || '').localeCompare(String(a.updatedAt || a.createdAt || ''));
    });
}

function scoreWords(words = [], normalizedValue = '') {
  if (!words.length || !normalizedValue) return 0;

  let score = 0;
  words.forEach((word) => {
    if (!word) return;
    if (normalizedValue.split(' ').includes(word)) {
      score += 3;
      return;
    }
    if (normalizedValue.includes(word)) {
      score += 2;
      return;
    }
    if (word.length >= 4 && hasCloseWord(word, normalizedValue)) {
      score += 1;
    }
  });

  return score;
}

function scoreSearchTokens(tokens = [], prepared) {
  if (!Array.isArray(tokens) || !tokens.length) return 0;

  const normalizedTokens = tokens.map((token) => normalizeText(token)).filter(Boolean);
  const compactTokens = tokens.map((token) => compactText(token)).filter(Boolean);

  if (prepared.normalized && normalizedTokens.includes(prepared.normalized)) return 22;
  if (prepared.compact && compactTokens.includes(prepared.compact)) return 18;

  let score = 0;
  prepared.words.forEach((word) => {
    if (normalizedTokens.includes(word)) score += 8;
    else if (normalizedTokens.some((token) => token.includes(word))) score += 4;
    else if (word.length >= 4 && normalizedTokens.some((token) => isCloseMatch(word, token))) score += 2;
  });

  return score;
}

function hasCloseWord(word, normalizedValue) {
  return normalizedValue
    .split(' ')
    .filter((part) => part.length >= 4)
    .some((part) => isCloseMatch(word, part));
}

function isCloseMatch(a, b) {
  const maxDistance = Math.max(a.length, b.length) >= 7 ? 2 : 1;
  return levenshtein(a, b) <= maxDistance;
}

function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;

  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = new Array(b.length + 1);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + cost
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[b.length];
}

function getValue(record, field) {
  return field.split('.').reduce((value, key) => (value && value[key] !== undefined ? value[key] : ''), record);
}

function labelField(field) {
  const labels = {
    number: 'numer',
    customerName: 'klient',
    clientName: 'klient',
    name: 'klient',
    phone: 'telefon',
    city: 'miasto',
    location: 'lokalizacja',
    address: 'adres',
    status: 'status',
    topic: 'temat',
    shortTopic: 'temat',
    voucher: 'voucher',
    title: 'historia',
    text: 'treść',
    author: 'autor'
  };
  return labels[field] || field;
}
