export function normalizeText(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizePhone(value = '') {
  return String(value).replace(/\D+/g, '');
}

export function compactText(value = '') {
  return normalizeText(value).replace(/\s+/g, '');
}
