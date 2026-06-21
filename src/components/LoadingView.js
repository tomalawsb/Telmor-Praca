export function LoadingView(message = 'Ładowanie danych...') {
  return `
    <div class="page">
      <section class="panel state-panel">
        <div class="loader-dot" aria-hidden="true"></div>
        <div>
          <h2>${message}</h2>
          <p>Dane są pobierane z warstwy repozytoriów. W trybie demo aplikacja używa danych testowych.</p>
        </div>
      </section>
    </div>
  `;
}

export function ErrorView(error) {
  const message = error?.message || 'Nieznany błąd.';
  return `
    <div class="page">
      <section class="panel state-panel state-panel-error">
        <div class="error-icon" aria-hidden="true">!</div>
        <div>
          <h2>Nie udało się wczytać danych</h2>
          <p>${escapeHtml(message)}</p>
          <button class="secondary-button" type="button" onclick="window.location.reload()">Odśwież aplikację</button>
        </div>
      </section>
    </div>
  `;
}

export function EmptyView({ title = 'Brak danych', text = 'Dane pojawią się po synchronizacji.' } = {}) {
  return `
    <div class="empty-list-box">
      <strong>${title}</strong>
      <span>${text}</span>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
