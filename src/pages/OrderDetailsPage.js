import { getOrder, saveOrder } from '../data/orderRepository.js';
import { getOrderHistory } from '../data/historyRepository.js';
import { getNotesForOrder, saveNote } from '../data/notesRepository.js';
import { createAttachmentFromFile, getAttachmentsForOrder } from '../data/attachmentRepository.js';
import { readAttachmentFileLocally } from '../local/attachmentFileStore.js';
import { EmptyView } from '../components/LoadingView.js';
import { getUserEmail } from '../local/authService.js';
import { addRecentOrder } from '../local/workPreferencesStore.js';
import { WORK_STATUS, getWorkStatusLabel, setOrderWorkStatus, toggleOrderFavorite } from '../data/workActions.js';

const tabs = [
  ['details', 'Szczegóły'],
  ['client', 'Klient'],
  ['history', 'Historia'],
  ['attachments', 'Załączniki'],
  ['notes', 'Notatki']
];

export async function OrderDetailsPage(orderId, selectedTab = 'details') {
  const order = await getOrder(orderId);
  const [history, notes, attachments] = await Promise.all([
    getOrderHistory(order.id),
    getNotesForOrder(order.id),
    getAttachmentsForOrder(order.id)
  ]);

  addRecentOrder(order);
  setTimeout(() => initOrderDetailsPage(order), 0);

  const activeTab = tabs.some(([key]) => key === selectedTab) ? selectedTab : 'details';
  const phone = normalizePhone(order.phone);
  const address = order.address || order.location || order.city || '';

  return `
    <div class="page details-page">
      <div class="details-topbar">
        <a href="#/orders-open" class="back-link">‹ Powrót do listy</a>
        <div class="details-actions desktop-only-flex">
          <a class="action-button" href="tel:${phone}">☎ Zadzwoń</a>
          <a class="action-button" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}" target="_blank" rel="noreferrer">⌖ Nawiguj</a>
          <button class="primary-button small" type="button" data-work-status="do_sprawdzenia">Do sprawdzenia</button>
        </div>
      </div>

      <section class="details-hero">
        <div>
          <h1>#${order.number || order.id}</h1>
          <p>${order.topic || '-'}</p>
        </div>
        <em class="pill pill-${order.statusTone || 'gray'}">${order.status || '-'}</em>
      </section>

      <div class="mobile-action-grid mobile-only">
        <a href="tel:${phone}">☎<small>Zadzwoń</small></a>
        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}" target="_blank" rel="noreferrer">⌖<small>Nawiguj</small></a>
        <button type="button" data-work-status="pilne">!<small>Pilne</small></button>
        <button type="button" data-work-status="do_sprawdzenia">↺<small>Sprawdź</small></button>
      </div>

      <nav class="details-tabs" aria-label="Zakładki zlecenia">
        ${tabs.map(([key, label]) => `
          <a class="${key === activeTab ? 'active' : ''}" href="#/order/${order.id}?tab=${key}">${label}${key === 'attachments' ? ` (${attachments.length || order.attachmentCount || 0})` : ''}${key === 'notes' ? ` (${notes.length})` : ''}</a>
        `).join('')}
      </nav>

      ${renderTab(order, activeTab, history, notes, attachments)}
    </div>
  `;
}

function renderTab(order, tab, history, notes, attachments) {
  if (tab === 'client') return clientTab(order);
  if (tab === 'history') return historyTab(history);
  if (tab === 'attachments') return attachmentsTab(order, attachments);
  if (tab === 'notes') return notesTab(order, notes);
  return detailsTab(order);
}

function detailsTab(order) {
  return `
    <section class="details-grid">
      <article class="panel info-card main-info-card">
        <h2>Podstawowe informacje</h2>
        ${infoRow('Status', `<em class="pill pill-${order.statusTone || 'gray'}">${order.status || '-'}</em>`)}
        ${infoRow('Zarejestrowane', formatDisplayDate(order.createdAt || order.registeredAt))}
        ${infoRow('Termin realizacji', order.plannedAt || '-')}
        ${infoRow('Miasto', order.city || '-')}
        ${infoRow('Temat', order.topic || '-')}
        ${infoRow('Wykonawca', order.assignee || '-')}
        <div class="hidden-details-note">Pełny opis, historia i załączniki są w osobnych zakładkach, żeby ekran nie był przeładowany.</div>
      </article>

      <article class="panel info-card">
        <h2>Adres i kontakt</h2>
        ${infoRow('Klient', order.customerName || '-')}
        ${infoRow('Telefon', `<a href="tel:${normalizePhone(order.phone)}">${order.phone || '-'}</a>`)}
        ${infoRow('Adres', order.address || '-')}
        ${infoRow('Nr domu / mieszkania', order.house || '-')}
      </article>

      <article class="panel info-card">
        <h2>Voucher i pliki</h2>
        ${infoRow('Voucher', order.voucher || '-')}
        ${infoRow('Voucher potwierdzony', order.hasVoucher ? 'Tak' : 'Nie')}
        ${infoRow('Załączniki', String(order.attachmentCount || 0))}
        <a class="soft-button" href="#/order/${order.id}?tab=attachments">Wyświetl załączniki</a>
      </article>

      <article class="panel info-card">
        <h2>Status roboczy</h2>
        ${infoRow('Oznaczenie', getWorkStatusLabel(order.workStatus))}
        ${infoRow('Ulubione', order.isFavorite ? 'Tak' : 'Nie')}
        <div class="work-action-row">
          <button class="soft-button" type="button" data-work-status="pilne">Oznacz jako pilne</button>
          <button class="soft-button" type="button" data-work-status="do_sprawdzenia">Do sprawdzenia</button>
          <button class="soft-button" type="button" data-work-status="gotowe">Gotowe roboczo</button>
          <button class="soft-button" type="button" data-toggle-favorite="1">${order.isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}</button>
        </div>
        <div id="work-action-message" class="settings-message" role="status"></div>
      </article>
    </section>
  `;
}

function clientTab(order) {
  return `
    <section class="details-grid two-columns">
      <article class="panel info-card">
        <h2>Dane klienta</h2>
        ${infoRow('Imię i nazwisko', order.customerName || '-')}
        ${infoRow('Telefon', `<a href="tel:${normalizePhone(order.phone)}">${order.phone || '-'}</a>`)}
        ${infoRow('Adres', order.address || '-')}
        ${infoRow('Nr domu / mieszkania', order.house || '-')}
      </article>
      <article class="panel info-card">
        <h2>Szybkie akcje</h2>
        <div class="action-stack">
          <a class="soft-button" href="tel:${normalizePhone(order.phone)}">Zadzwoń do klienta</a>
          <a class="soft-button" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address || '')}" target="_blank" rel="noreferrer">Otwórz nawigację</a>
          <button class="soft-button" type="button" disabled>Dodaj notatkę w kolejnym etapie</button>
        </div>
      </article>
    </section>
  `;
}

function historyTab(history) {
  return `
    <section class="panel history-panel">
      <div class="panel-header"><h2>Historia zlecenia</h2><span>${history.length} wpisy</span></div>
      <div class="timeline">
        ${(history.length ? history : [{ date: '-', title: 'Brak historii', author: 'System', text: 'Dane pojawią się po imporcie.' }]).map((item) => `
          <article>
            <span class="timeline-dot"></span>
            <div>
              <strong>${item.title}</strong>
              <small>${item.date || formatDisplayDate(item.createdAt)} · ${item.author || '-'}</small>
              <p>${item.text || ''}</p>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function attachmentsTab(order, attachments = []) {
  return `
    <section class="details-grid two-columns attachment-workspace">
      <article class="panel attachment-panel">
        <div class="panel-header"><h2>Załączniki</h2><span>${attachments.length} plików</span></div>
        ${attachments.length ? `
          <div class="attachment-list">
            ${attachments.map((file) => `
              <article>
                <span class="file-icon">${iconForFile(file)}</span>
                <div>
                  <strong>${escapeHtml(file.displayName || file.fileName || file.name)}</strong>
                  <small>${escapeHtml(file.fileKind || file.type || 'Plik')} · ${escapeHtml(file.sizeLabel || file.size || '-')} ${file.localOnly ? '· lokalnie' : ''}</small>
                  ${file.description ? `<small>${escapeHtml(file.description)}</small>` : ''}
                </div>
                <button class="icon-button" type="button" data-open-local-attachment="${escapeHtml(file.id)}" ${file.localBlobKey ? '' : 'disabled'} title="Otwórz lokalny plik">↗</button>
              </article>
            `).join('')}
          </div>
        ` : EmptyView({ title: 'Brak załączników', text: 'Dodaj zdjęcie, voucher albo dokument do tego zlecenia.' })}
      </article>

      <article class="panel info-card attachment-add-card">
        <h2>Dodaj plik</h2>
        <form id="attachment-form" class="attachment-form">
          <label class="field-label">Typ pliku</label>
          <select id="attachment-kind" class="input-like">
            <option>Zdjęcie</option>
            <option>Voucher</option>
            <option>Protokół</option>
            <option>PDF</option>
            <option>Inny plik</option>
          </select>

          <label class="field-label">Plik z urządzenia</label>
          <input id="attachment-file" class="input-like" type="file" accept="image/*,.pdf,.txt,.doc,.docx" capture="environment" />

          <label class="checkbox-line">
            <input id="attachment-is-voucher" type="checkbox" />
            <span>Ten plik potwierdza voucher</span>
          </label>

          <label class="field-label">Opis</label>
          <textarea id="attachment-description" class="note-area" placeholder="Np. zdjęcie vouchera, protokół, zdjęcie instalacji"></textarea>

          <button id="attachment-save-button" class="primary-button" type="submit">Zapisz załącznik</button>
          <div id="attachment-message" class="settings-message" role="status"></div>
        </form>
        <div class="hidden-details-note">W Etapie 12 plik jest zapisywany lokalnie na urządzeniu, a metadane trafiają do lokalnego cache. Pliki zostają na tym urządzeniu.</div>
      </article>
    </section>
  `;
}

function notesTab(order, notes) {
  return `
    <section class="panel notes-panel">
      <div class="panel-header"><h2>Notatki własne</h2><span>${notes.length} notatek</span></div>
      ${notes.length ? `
        <div class="notes-list">
          ${notes.map((note) => `
            <article>
              <strong>${escapeHtml(note.createdBy || 'Użytkownik')}</strong>
              <small>${formatDisplayDate(note.createdAt)}</small>
              <p>${escapeHtml(note.text)}</p>
            </article>
          `).join('')}
        </div>
      ` : EmptyView({ title: 'Brak notatek', text: 'Dodaj krótką notatkę roboczą do zlecenia. Zapis działa lokalnie w tej przeglądarce.' })}
      <form id="note-form" class="note-form" data-order-id="${escapeHtml(order.id)}">
        <textarea id="note-text" class="note-area" placeholder="Dodaj swoją notatkę do tego zlecenia..."></textarea>
        <button id="note-save-button" class="primary-button" type="submit">Zapisz notatkę</button>
        <div id="note-message" class="settings-message" role="status"></div>
      </form>
    </section>
  `;
}


function initOrderDetailsPage(order) {
  const form = document.querySelector('#attachment-form');
  const fileInput = document.querySelector('#attachment-file');
  const kindInput = document.querySelector('#attachment-kind');
  const voucherInput = document.querySelector('#attachment-is-voucher');
  const descriptionInput = document.querySelector('#attachment-description');
  const message = document.querySelector('#attachment-message');

  const setMessage = (text, tone = 'info') => {
    if (!message) return;
    message.textContent = text;
    message.dataset.tone = tone;
  };

  kindInput?.addEventListener('change', () => {
    if (!voucherInput) return;
    voucherInput.checked = /voucher/i.test(kindInput.value || '');
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const file = fileInput?.files?.[0];
    if (!file) {
      setMessage('Najpierw wybierz plik.', 'error');
      return;
    }

    const saveButton = document.querySelector('#attachment-save-button');
    if (saveButton) saveButton.disabled = true;
    setMessage('Zapisuję załącznik...', 'info');

    try {
      const attachment = await createAttachmentFromFile({
        order,
        file,
        fileKind: kindInput?.value || 'Zdjęcie',
        isVoucher: Boolean(voucherInput?.checked),
        description: descriptionInput?.value || ''
      });

      await saveOrder({
        ...order,
        hasVoucher: order.hasVoucher || attachment.isVoucher,
        attachmentCount: Number(order.attachmentCount || 0) + 1,
        updatedAt: new Date().toISOString()
      });

      setMessage('Załącznik zapisany. Widok odświeży się za chwilę.', 'success');
      setTimeout(() => window.dispatchEvent(new HashChangeEvent('hashchange')), 350);
    } catch (error) {
      setMessage(error.message, 'error');
    } finally {
      if (saveButton) saveButton.disabled = false;
    }
  });

  document.querySelectorAll('[data-open-local-attachment]').forEach((button) => {
    button.addEventListener('click', async () => {
      const attachmentId = button.dataset.openLocalAttachment;
      const record = await readAttachmentFileLocally(attachmentId);
      if (!record?.blob) {
        window.alert('Tego pliku nie ma lokalnie na tym urządzeniu.');
        return;
      }
      const url = URL.createObjectURL(record.blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    });
  });

  document.querySelectorAll('[data-work-status]').forEach((button) => {
    button.addEventListener('click', async () => {
      const targetStatus = button.dataset.workStatus || WORK_STATUS.NORMAL;
      const workMessage = document.querySelector('#work-action-message');
      try {
        button.disabled = true;
        if (workMessage) workMessage.textContent = 'Zapisuję status roboczy...';
        await setOrderWorkStatus(order, targetStatus);
        if (workMessage) workMessage.textContent = `Zapisano: ${getWorkStatusLabel(targetStatus)}.`;
        setTimeout(() => window.dispatchEvent(new HashChangeEvent('hashchange')), 350);
      } catch (error) {
        if (workMessage) workMessage.textContent = error.message;
      } finally {
        button.disabled = false;
      }
    });
  });

  document.querySelector('[data-toggle-favorite]')?.addEventListener('click', async (event) => {
    const workMessage = document.querySelector('#work-action-message');
    try {
      event.currentTarget.disabled = true;
      if (workMessage) workMessage.textContent = 'Zapisuję oznaczenie ulubione...';
      await toggleOrderFavorite(order);
      if (workMessage) workMessage.textContent = 'Zapisano oznaczenie.';
      setTimeout(() => window.dispatchEvent(new HashChangeEvent('hashchange')), 350);
    } catch (error) {
      if (workMessage) workMessage.textContent = error.message;
    } finally {
      event.currentTarget.disabled = false;
    }
  });

  document.querySelector('#note-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const textInput = document.querySelector('#note-text');
    const noteButton = document.querySelector('#note-save-button');
    const noteMessage = document.querySelector('#note-message');
    const text = textInput?.value?.trim() || '';

    if (!text) {
      if (noteMessage) noteMessage.textContent = 'Wpisz treść notatki.';
      return;
    }

    try {
      if (noteButton) noteButton.disabled = true;
      if (noteMessage) noteMessage.textContent = 'Zapisuję notatkę...';
      await saveNote({
        orderId: order.id,
        customerId: order.customerId || '',
        text,
        createdBy: getUserEmail(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      await saveOrder({
        ...order,
        noteCount: Number(order.noteCount || 0) + 1,
        updatedAt: new Date().toISOString()
      });
      if (noteMessage) noteMessage.textContent = 'Notatka zapisana.';
      if (textInput) textInput.value = '';
      setTimeout(() => window.dispatchEvent(new HashChangeEvent('hashchange')), 350);
    } catch (error) {
      if (noteMessage) noteMessage.textContent = error.message;
    } finally {
      if (noteButton) noteButton.disabled = false;
    }
  });
}

function iconForFile(file = {}) {
  const value = `${file.fileKind || file.type || ''} ${file.fileName || file.name || ''}`.toLowerCase();
  if (/voucher|bon|kupon/.test(value)) return '▣';
  if (/pdf/.test(value)) return '▤';
  if (/zdjęcie|zdjecie|image|jpg|jpeg|png|webp/.test(value)) return '◫';
  return '▧';
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function infoRow(label, value) {
  return `<div class="info-row"><span>${label}</span><strong>${value}</strong></div>`;
}

function normalizePhone(phone) {
  return String(phone || '').replaceAll(' ', '');
}

function formatDisplayDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
