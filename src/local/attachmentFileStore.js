import { localDbDelete, localDbGet, localDbSet } from './localDb.js';

const ATTACHMENT_FILE_PREFIX = 'attachment:file:v1:';

export async function saveAttachmentFileLocally(attachmentId, file) {
  if (!attachmentId || !file) throw new Error('Brak identyfikatora załącznika albo pliku.');

  const key = buildAttachmentFileKey(attachmentId);
  await localDbSet(key, {
    attachmentId,
    name: file.name || 'plik',
    type: file.type || 'application/octet-stream',
    size: Number(file.size || 0),
    blob: file,
    savedAt: new Date().toISOString()
  });

  return key;
}

export async function readAttachmentFileLocally(attachmentId) {
  if (!attachmentId) return null;
  return localDbGet(buildAttachmentFileKey(attachmentId));
}

export async function deleteAttachmentFileLocally(attachmentId) {
  if (!attachmentId) return false;
  await localDbDelete(buildAttachmentFileKey(attachmentId));
  return true;
}

export function buildAttachmentFileKey(attachmentId) {
  return `${ATTACHMENT_FILE_PREFIX}${attachmentId}`;
}

export function formatAttachmentSize(bytes = 0) {
  const value = Number(bytes || 0);
  if (!value) return '-';
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1).replace('.', ',')} KB`;
  return `${(value / 1024 / 1024).toFixed(1).replace('.', ',')} MB`;
}
