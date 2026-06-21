import { compactText, normalizePhone, normalizeText } from './normalizeText.js';

export function buildSearchTokens(parts = []) {
  const tokens = new Set();

  parts
    .filter((part) => part !== null && part !== undefined)
    .map((part) => String(part))
    .forEach((part) => {
      const normalized = normalizeText(part);
      const compact = compactText(part);
      const phone = normalizePhone(part);

      if (normalized) {
        tokens.add(normalized);
        normalized.split(' ').forEach((word) => addTokenVariants(tokens, word));
      }

      if (compact) addTokenVariants(tokens, compact);
      if (phone) addTokenVariants(tokens, phone);
    });

  return [...tokens].filter((token) => token.length >= 2).slice(0, 120);
}

function addTokenVariants(tokens, value) {
  if (!value) return;
  tokens.add(value);

  if (value.length >= 4) tokens.add(value.slice(0, 4));
  if (value.length >= 6) tokens.add(value.slice(0, 6));
  if (value.length >= 8) tokens.add(value.slice(0, 8));
}
