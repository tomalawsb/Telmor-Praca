(function () {
  'use strict';

  const VERSION = '16.0 - 2106262222';
  const APP_NAME = 'Telmor Praca';
  const DATA_KEY = 'telmor_praca_pwa_v16_data';
  const SETTINGS_KEY = 'telmor_praca_pwa_v16_settings';

  const DEFAULT_SETTINGS = {
    username: 'Tomasz',
    notificationsEnabled: false,
    autoDemo: true
  };

  const DEMO_DATA = {
    orders: [
      {
        id: '104750',
        date: '2026-06-21',
        time: '09:00',
        status: 'Nowe',
        priority: 'high',
        type: 'Kamera / internet',
        client: 'Jan Kowalski',
        phone: '500 100 200',
        address: 'Czermin 120',
        city: 'Czermin',
        service: 'Montaż kamery Wi-Fi i konfiguracja podglądu w telefonie.',
        equipment: 'Kamera Wi-Fi, zasilacz, uchwyt, przewód LAN',
        voucher: 'brak',
        notes: 'Sprawdzić zasięg Wi-Fi przy miejscu montażu.',
        createdAt: '2026-06-21T08:00:00',
        history: [
          { at: '2026-06-21T08:00:00', text: 'Zlecenie dodane do aplikacji.' }
        ]
      },
      {
        id: '104751',
        date: '2026-06-21',
        time: '12:30',
        status: 'W toku',
        priority: 'normal',
        type: 'Telewizja',
        client: 'Anna Nowak',
        phone: '501 222 333',
        address: 'Wadowice Górne 45',
        city: 'Wadowice Górne',
        service: 'Ustawienie anteny, pomiar sygnału, konfiguracja kanałów.',
        equipment: 'Miernik, końcówki F, kabel koncentryczny',
        voucher: 'voucher Telmor',
        notes: 'Klient zgłasza zanik TVP Kultura.',
        createdAt: '2026-06-21T09:10:00',
        history: [
          { at: '2026-06-21T09:10:00', text: 'Zlecenie przyjęte.' },
          { at: '2026-06-21T11:50:00', text: 'Status zmieniony na W toku.' }
        ]
      },
      {
        id: '104752',
        date: '2026-06-22',
        time: '10:15',
        status: 'Oczekuje',
        priority: 'low',
        type: 'Internet',
        client: 'Marek Wiśniewski',
        phone: '502 444 555',
        address: 'Mielec, ul. Słoneczna 8',
        city: 'Mielec',
        service: 'Sprawdzenie routera, Wi-Fi i prędkości internetu.',
        equipment: 'Laptop serwisowy, tester LAN',
        voucher: 'brak',
        notes: 'Czeka na potwierdzenie godziny.',
        createdAt: '2026-06-21T10:20:00',
        history: [
          { at: '2026-06-21T10:20:00', text: 'Zlecenie zapisane jako oczekujące.' }
        ]
      },
      {
        id: '104730',
        date: '2026-06-20',
        time: '14:00',
        status: 'Zamknięte',
        priority: 'normal',
        type: 'Instalacja TV',
        client: 'Piotr Zieliński',
        phone: '503 666 777',
        address: 'Borowa 607A',
        city: 'Borowa',
        service: 'Przeciągnięcie przewodu, konfiguracja telewizora i sprawdzenie internetu.',
        equipment: 'Kabel antenowy, końcówki F',
        voucher: 'brak',
        notes: 'Usługa zakończona.',
        createdAt: '2026-06-20T13:00:00',
        history: [
          { at: '2026-06-20T13:00:00', text: 'Zlecenie dodane.' },
          { at: '2026-06-20T15:35:00', text: 'Zlecenie zamknięte.' }
        ]
      }
    ],
    notifications: [
      { id: 'n1', at: '2026-06-21T09:00:00', title: 'Nowe zlecenie', body: 'Dodano zlecenie #104750.', type: 'info' },
      { id: 'n2', at: '2026-06-21T11:50:00', title: 'Zmiana statusu', body: 'Zlecenie #104751 jest w toku.', type: 'status' }
    ]
  };

  let state = loadData();
  let settings = loadSettings();
  let currentFilter = 'all';

  document.addEventListener('DOMContentLoaded', startApp);
  window.addEventListener('hashchange', render);

  function startApp() {
    registerServiceWorker();
    if (!location.hash) location.hash = '#/dashboard';
    renderShell();
    render();
    notifyInApp('Aplikacja gotowa', 'Dane są zapisywane lokalnie w tej przeglądarce.');
  }

  function renderShell() {
    const root = document.getElementById('app');
    root.className = '';
    root.innerHTML = `
      <div class="app-shell">
        <aside class="sidebar">
          <a class="brand" href="#/dashboard"><span class="brand-mark">T</span><span>Telmor Praca</span></a>
          <nav class="nav" id="side-nav">${navLinks()}</nav>
          <div class="sidebar-note">
            <strong>Wersja ${escapeHtml(VERSION)}</strong><br>
            PWA lokalne pod GitHub Pages. Bez Firebase, bez serwera, bez zewnętrznych zależności.
          </div>
        </aside>
        <main class="main">
          <header class="topbar">
            <div class="mobile-brand">Telmor Praca</div>
            <label class="search"><span>⌕</span><input id="global-search" type="search" placeholder="Szukaj zlecenia, klienta, adresu..." autocomplete="off"></label>
            <div class="top-actions">
              <span class="sync-status">Lokalne PWA</span>
              <button class="btn soft" id="install-button" type="button" hidden>Instaluj</button>
            </div>
          </header>
          <section id="page-root" class="page-root"></section>
        </main>
        <nav class="bottom-nav" id="bottom-nav">${bottomLinks()}</nav>
        <div class="toast-wrap" id="toast-wrap"></div>
      </div>
    `;

    document.getElementById('global-search').addEventListener('input', function () {
      const q = this.value.trim();
      if (q.length >= 2) location.hash = '#/search?q=' + encodeURIComponent(q);
    });

    setupInstallPrompt();
  }

  function navLinks() {
    return [
      ['#/dashboard', '⌂', 'Start'],
      ['#/orders', '▤', 'Zlecenia'],
      ['#/work', '◆', 'Praca'],
      ['#/customers', '☏', 'Klienci'],
      ['#/history', '◷', 'Historia'],
      ['#/notifications', '◉', 'Powiadomienia'],
      ['#/local-data', '⇅', 'Dane lokalne'],
      ['#/settings', '⚙', 'Ustawienia']
    ].map(([href, icon, label]) => `<a href="${href}" data-route="${href}"><span>${icon}</span><span>${label}</span></a>`).join('');
  }

  function bottomLinks() {
    return [
      ['#/dashboard', '⌂', 'Start'],
      ['#/orders', '▤', 'Zlecenia'],
      ['#/work', '◆', 'Praca'],
      ['#/customers', '☏', 'Klienci'],
      ['#/settings', '⚙', 'Opcje']
    ].map(([href, icon, label]) => `<a href="${href}" data-route="${href}"><span>${icon}</span><small>${label}</small></a>`).join('');
  }

  function render() {
    const root = document.getElementById('page-root');
    if (!root) return;
    const hash = location.hash || '#/dashboard';
    const path = hash.split('?')[0];
    const params = new URLSearchParams((hash.split('?')[1] || ''));

    if (path.startsWith('#/order/')) {
      renderOrderDetails(root, decodeURIComponent(path.replace('#/order/', '')));
    } else if (path === '#/dashboard') {
      renderDashboard(root);
    } else if (path === '#/orders') {
      renderOrders(root, params.get('status') || currentFilter || 'all');
    } else if (path === '#/work') {
      renderWork(root);
    } else if (path === '#/customers') {
      renderCustomers(root);
    } else if (path === '#/history') {
      renderHistory(root);
    } else if (path === '#/notifications') {
      renderNotifications(root);
    } else if (path === '#/local-data') {
      renderLocalData(root);
    } else if (path === '#/settings') {
      renderSettings(root);
    } else if (path === '#/search') {
      renderSearch(root, params.get('q') || '');
    } else {
      root.innerHTML = pageWrap('Nie znaleziono', '<p class="muted">Taka strona nie istnieje.</p>');
    }

    markActive(path);
  }

  function pageWrap(title, body, subtitle, actions) {
    return `<div class="page"><div class="page-title"><div><h1>${title}</h1>${subtitle ? `<p>${subtitle}</p>` : ''}</div>${actions ? `<div class="page-actions">${actions}</div>` : ''}</div>${body}</div>`;
  }

  function renderDashboard(root) {
    const orders = sortedOrders();
    const open = orders.filter(o => o.status !== 'Zamknięte' && o.status !== 'Anulowane');
    const closed = orders.filter(o => o.status === 'Zamknięte');
    const today = todayIso();
    const todayOrders = orders.filter(o => o.date === today);
    const body = `
      <section class="grid stats">
        ${statCard('Otwarte', open.length, 'Do realizacji', 'blue')}
        ${statCard('Dzisiaj', todayOrders.length, 'Na aktualny dzień', 'orange')}
        ${statCard('Vouchery', orders.filter(o => hasVoucher(o)).length, 'Do kontroli', 'purple')}
        ${statCard('Zamknięte', closed.length, 'W historii', 'green')}
      </section>
      <section class="grid content-grid">
        <div class="panel">
          <h2>Najbliższe zlecenia</h2>
          ${orderCards(open.slice(0, 6))}
        </div>
        <aside class="grid">
          <div class="panel">
            <h2>Szybkie akcje</h2>
            <div class="card-actions">
              <a class="btn primary" href="#/orders">Otwórz zlecenia</a>
              <a class="btn" href="#/work">Panel pracy</a>
              <a class="btn" href="#/local-data">Eksport danych</a>
            </div>
          </div>
          <div class="panel">
            <h2>Powiadomienia lokalne</h2>
            ${notificationList(state.notifications.slice(0, 5))}
          </div>
        </aside>
      </section>
    `;
    root.innerHTML = pageWrap(`Dzień dobry, ${escapeHtml(settings.username)}!`, body, 'Aplikacja działa lokalnie w przeglądarce i nadaje się do GitHub Pages.');
  }

  function renderOrders(root, filter) {
    currentFilter = filter;
    const filters = ['all', 'Nowe', 'W toku', 'Oczekuje', 'Zamknięte', 'Anulowane'];
    const orders = sortedOrders().filter(o => filter === 'all' || o.status === filter);
    const body = `
      <section class="panel">
        <div class="filters">
          ${filters.map(f => `<a class="btn ${filter === f ? 'active' : ''}" href="#/orders?status=${encodeURIComponent(f)}">${f === 'all' ? 'Wszystkie' : f}</a>`).join('')}
        </div>
        <div class="table-wrap table-desktop">${ordersTable(orders)}</div>
        <div class="mobile-cards">${orderCards(orders)}</div>
      </section>
      <section class="panel" style="margin-top:16px">
        <h2>Dodaj zlecenie ręcznie</h2>
        ${orderForm()}
      </section>
    `;
    root.innerHTML = pageWrap('Zlecenia', body, 'Lista prac zapisana lokalnie w przeglądarce.');
    bindOrderForm();
  }

  function renderOrderDetails(root, id) {
    const order = state.orders.find(o => o.id === id);
    if (!order) {
      root.innerHTML = pageWrap('Brak zlecenia', '<p class="muted">Nie znaleziono zlecenia.</p>', '', '<a class="btn" href="#/orders">Powrót</a>');
      return;
    }
    const body = `
      <section class="grid two">
        <article class="panel">
          <h2>Dane zlecenia</h2>
          ${infoRow('Numer', '#' + escapeHtml(order.id))}
          ${infoRow('Status', statusPill(order.status))}
          ${infoRow('Termin', `${formatDate(order.date)} ${escapeHtml(order.time || '')}`)}
          ${infoRow('Typ', escapeHtml(order.type || '-'))}
          ${infoRow('Opis', escapeHtml(order.service || '-'))}
          ${infoRow('Sprzęt', escapeHtml(order.equipment || '-'))}
          ${infoRow('Voucher', escapeHtml(order.voucher || '-'))}
          ${infoRow('Notatki', escapeHtml(order.notes || '-'))}
        </article>
        <article class="panel">
          <h2>Klient</h2>
          ${infoRow('Nazwa', escapeHtml(order.client || '-'))}
          ${infoRow('Telefon', `<a class="copyable" href="tel:${cleanPhone(order.phone)}">${escapeHtml(order.phone || '-')}</a>`)}
          ${infoRow('Adres', `<span class="copyable">${escapeHtml(order.address || '-')}</span>`)}
          ${infoRow('Miejscowość', escapeHtml(order.city || '-'))}
          <div class="card-actions" style="margin-top:12px">
            <a class="btn primary" href="tel:${cleanPhone(order.phone)}">Zadzwoń</a>
            <button class="btn" data-copy="${escapeAttr(order.address || '')}" type="button">Kopiuj adres</button>
            <a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address || order.city || '')}">Mapa</a>
          </div>
        </article>
      </section>
      <section class="panel" style="margin-top:16px">
        <h2>Zmiana statusu</h2>
        <div class="form-grid">
          <label class="field"><span>Status</span><select id="status-select">${['Nowe','W toku','Oczekuje','Zamknięte','Anulowane'].map(s => `<option ${s === order.status ? 'selected' : ''}>${s}</option>`).join('')}</select></label>
          <label class="field"><span>Notatka do historii</span><input id="history-note" placeholder="np. Klient potwierdził godzinę"></label>
        </div>
        <div class="form-actions"><button class="btn green" id="save-status" type="button">Zapisz zmianę</button></div>
      </section>
      <section class="panel" style="margin-top:16px">
        <h2>Historia</h2>
        ${timeline(order.history || [])}
      </section>
    `;
    root.innerHTML = pageWrap(`Zlecenie #${escapeHtml(order.id)}`, body, escapeHtml(order.client || ''), '<a class="btn" href="#/orders">Powrót</a>');
    bindCopyButtons();
    document.getElementById('save-status').addEventListener('click', function () {
      const newStatus = document.getElementById('status-select').value;
      const note = document.getElementById('history-note').value.trim();
      updateOrderStatus(order.id, newStatus, note || `Status zmieniony na ${newStatus}.`);
      location.hash = '#/order/' + encodeURIComponent(order.id);
    });
  }

  function renderWork(root) {
    const active = sortedOrders().filter(o => o.status !== 'Zamknięte' && o.status !== 'Anulowane');
    const body = `
      <section class="grid two">
        <div class="panel">
          <h2>Do wykonania</h2>
          ${orderCards(active)}
        </div>
        <div class="panel">
          <h2>Szybka notatka do zlecenia</h2>
          <div class="form-grid">
            <label class="field"><span>Zlecenie</span><select id="work-order">${active.map(o => `<option value="${escapeAttr(o.id)}">#${escapeHtml(o.id)} - ${escapeHtml(o.client)}</option>`).join('')}</select></label>
            <label class="field"><span>Akcja</span><select id="work-action"><option>Rozpoczęto realizację</option><option>Klient nieobecny</option><option>Potrzebny dodatkowy materiał</option><option>Zakończono usługę</option></select></label>
            <label class="field full"><span>Notatka</span><textarea id="work-note" placeholder="Dodatkowe informacje"></textarea></label>
          </div>
          <div class="form-actions"><button class="btn primary" id="save-work-note" type="button">Zapisz do historii</button></div>
        </div>
      </section>
    `;
    root.innerHTML = pageWrap('Praca', body, 'Panel szybkiej obsługi zleceń.');
    const btn = document.getElementById('save-work-note');
    if (btn) btn.addEventListener('click', function () {
      const id = document.getElementById('work-order').value;
      const action = document.getElementById('work-action').value;
      const note = document.getElementById('work-note').value.trim();
      addHistory(id, note ? `${action}: ${note}` : action);
      if (action === 'Rozpoczęto realizację') updateOrderStatus(id, 'W toku', action, false);
      if (action === 'Zakończono usługę') updateOrderStatus(id, 'Zamknięte', action, false);
      saveData();
      notifyInApp('Zapisano notatkę', `Zlecenie #${id}`);
      render();
    });
  }

  function renderCustomers(root) {
    const customers = buildCustomers();
    const body = `<section class="panel"><div class="cards-list">${customers.map(c => `
      <article class="card order-card">
        <header><h3>${escapeHtml(c.client)}</h3><span>${c.count} zlec.</span></header>
        <p>${escapeHtml(c.address || c.city || '-')}</p>
        <p><a href="tel:${cleanPhone(c.phone)}">${escapeHtml(c.phone || '-')}</a></p>
        <div class="card-actions"><a class="btn" href="#/search?q=${encodeURIComponent(c.client)}">Pokaż zlecenia</a></div>
      </article>`).join('') || empty('Brak klientów')}</div></section>`;
    root.innerHTML = pageWrap('Klienci', body, 'Lista klientów budowana automatycznie ze zleceń.');
  }

  function renderHistory(root) {
    const items = [];
    state.orders.forEach(o => (o.history || []).forEach(h => items.push({ order: o, at: h.at, text: h.text })));
    items.sort((a, b) => new Date(b.at) - new Date(a.at));
    const body = `<section class="panel"><div class="timeline">${items.map(i => `<div class="timeline-item"><strong>#${escapeHtml(i.order.id)} - ${escapeHtml(i.order.client)}</strong><small>${formatDateTime(i.at)}</small><p>${escapeHtml(i.text)}</p></div>`).join('') || empty('Brak historii')}</div></section>`;
    root.innerHTML = pageWrap('Historia', body, 'Wszystkie zmiany zapisane lokalnie.');
  }

  function renderNotifications(root) {
    const body = `<section class="panel">
      <div class="card-actions" style="margin-bottom:14px">
        <button class="btn primary" id="enable-notifications" type="button">Włącz powiadomienia w otwartej aplikacji</button>
        <button class="btn" id="test-notification" type="button">Test</button>
        <button class="btn red" id="clear-notifications" type="button">Wyczyść</button>
      </div>
      ${notificationList(state.notifications)}
    </section>`;
    root.innerHTML = pageWrap('Powiadomienia', body, 'Powiadomienia działają tylko, gdy aplikacja jest otwarta. Nie ma Firebase ani push w tle.');
    document.getElementById('enable-notifications').addEventListener('click', enableNotifications);
    document.getElementById('test-notification').addEventListener('click', () => notifyInApp('Test powiadomienia', 'To powiadomienie działa tylko w otwartej aplikacji.', true));
    document.getElementById('clear-notifications').addEventListener('click', () => { state.notifications = []; saveData(); render(); });
  }

  function renderLocalData(root) {
    const body = `<section class="grid two">
      <div class="panel">
        <h2>Eksport</h2>
        <p class="muted">Zapisz kopię danych z tej przeglądarki do pliku JSON.</p>
        <div class="card-actions"><button class="btn primary" id="export-json" type="button">Pobierz JSON</button><button class="btn" id="copy-json" type="button">Kopiuj JSON</button></div>
      </div>
      <div class="panel">
        <h2>Import</h2>
        <p class="muted">Wklej JSON wyeksportowany z tej aplikacji.</p>
        <textarea id="import-json" class="code" rows="8" placeholder="Wklej dane JSON"></textarea>
        <div class="form-actions"><button class="btn green" id="import-json-button" type="button">Importuj</button></div>
      </div>
    </section>
    <section class="panel" style="margin-top:16px"><h2>Podgląd danych</h2><pre class="code">${escapeHtml(JSON.stringify(state, null, 2))}</pre></section>`;
    root.innerHTML = pageWrap('Dane lokalne', body, 'Synchronizacja polega na eksporcie/importcie lokalnego pliku.');
    document.getElementById('export-json').addEventListener('click', exportJson);
    document.getElementById('copy-json').addEventListener('click', () => copyText(JSON.stringify(state, null, 2)));
    document.getElementById('import-json-button').addEventListener('click', importJson);
  }

  function renderSettings(root) {
    const body = `<section class="grid two">
      <div class="panel">
        <h2>Ustawienia</h2>
        <div class="form-grid">
          <label class="field"><span>Imię w aplikacji</span><input id="setting-username" value="${escapeAttr(settings.username)}"></label>
        </div>
        <div class="form-actions"><button class="btn primary" id="save-settings" type="button">Zapisz</button></div>
      </div>
      <div class="panel danger-zone">
        <h2>Reset danych</h2>
        <p class="muted">Przywraca dane demo i usuwa lokalne zmiany w tej przeglądarce.</p>
        <button class="btn red" id="reset-data" type="button">Przywróć dane demo</button>
      </div>
    </section>
    <section class="panel" style="margin-top:16px"><h2>Informacje techniczne</h2><p>Wersja: <strong>${escapeHtml(VERSION)}</strong></p><p class="muted">Brak npm, Vite, Firebase, package-lock, node_modules i builda. GitHub Pages może publikować pliki bez kompilacji.</p></section>`;
    root.innerHTML = pageWrap('Ustawienia', body, 'Konfiguracja lokalna aplikacji.');
    document.getElementById('save-settings').addEventListener('click', function () {
      settings.username = document.getElementById('setting-username').value.trim() || 'Tomasz';
      saveSettings();
      notifyInApp('Zapisano ustawienia', 'Zmiany zapisane lokalnie.');
      render();
    });
    document.getElementById('reset-data').addEventListener('click', function () {
      if (!confirm('Na pewno przywrócić dane demo?')) return;
      state = clone(DEMO_DATA);
      saveData();
      notifyInApp('Dane przywrócone', 'Wczytano dane demo.');
      location.hash = '#/dashboard';
    });
  }

  function renderSearch(root, q) {
    q = q.trim();
    const results = q ? sortedOrders().filter(o => normalize(Object.values(o).join(' ')).includes(normalize(q))) : [];
    const body = `<section class="panel"><label class="field"><span>Szukaj</span><input id="search-page-input" value="${escapeAttr(q)}" autofocus></label><div style="margin-top:16px">${q ? orderCards(results) : empty('Wpisz minimum 2 znaki.')}</div></section>`;
    root.innerHTML = pageWrap('Szukaj', body, 'Wyszukiwanie po numerze, kliencie, adresie, opisie i notatkach.');
    const input = document.getElementById('search-page-input');
    input.addEventListener('input', () => location.hash = '#/search?q=' + encodeURIComponent(input.value.trim()));
  }

  function statCard(label, value, note, tone) {
    return `<article class="card stat ${tone}"><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`;
  }

  function ordersTable(orders) {
    if (!orders.length) return empty('Brak zleceń dla wybranego filtra.');
    return `<table class="table"><thead><tr><th>Nr</th><th>Klient</th><th>Adres</th><th>Termin</th><th>Status</th><th>Priorytet</th><th></th></tr></thead><tbody>${orders.map(o => `
      <tr><td><strong>#${escapeHtml(o.id)}</strong></td><td>${escapeHtml(o.client)}</td><td>${escapeHtml(o.address)}</td><td>${formatDate(o.date)} ${escapeHtml(o.time || '')}</td><td>${statusPill(o.status)}</td><td>${priority(o.priority)}</td><td><a class="btn" href="#/order/${encodeURIComponent(o.id)}">Otwórz</a></td></tr>
    `).join('')}</tbody></table>`;
  }

  function orderCards(orders) {
    if (!orders.length) return empty('Brak zleceń.');
    return `<div class="cards-list">${orders.map(o => `<article class="card order-card">
      <header><h3>#${escapeHtml(o.id)} · ${escapeHtml(o.client)}</h3>${statusPill(o.status)}</header>
      <p>${escapeHtml(o.address || '-')}</p>
      <p>${formatDate(o.date)} ${escapeHtml(o.time || '')} · ${escapeHtml(o.type || '-')} · ${priority(o.priority)}</p>
      <div class="card-actions"><a class="btn primary" href="#/order/${encodeURIComponent(o.id)}">Otwórz</a><a class="btn" href="tel:${cleanPhone(o.phone)}">Telefon</a></div>
    </article>`).join('')}</div>`;
  }

  function orderForm() {
    return `<form id="add-order-form">
      <div class="form-grid">
        <label class="field"><span>Numer</span><input name="id" required placeholder="np. 104800"></label>
        <label class="field"><span>Status</span><select name="status"><option>Nowe</option><option>W toku</option><option>Oczekuje</option><option>Zamknięte</option></select></label>
        <label class="field"><span>Data</span><input name="date" type="date" value="${todayIso()}"></label>
        <label class="field"><span>Godzina</span><input name="time" type="time"></label>
        <label class="field"><span>Klient</span><input name="client" required></label>
        <label class="field"><span>Telefon</span><input name="phone"></label>
        <label class="field full"><span>Adres</span><input name="address"></label>
        <label class="field"><span>Miasto</span><input name="city"></label>
        <label class="field"><span>Typ</span><input name="type" placeholder="np. Internet / TV / Kamera"></label>
        <label class="field full"><span>Opis usługi</span><textarea name="service"></textarea></label>
      </div>
      <div class="form-actions"><button class="btn primary" type="submit">Dodaj zlecenie</button></div>
    </form>`;
  }

  function bindOrderForm() {
    const form = document.getElementById('add-order-form');
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if (state.orders.some(o => o.id === data.id)) {
        alert('Zlecenie o takim numerze już istnieje.');
        return;
      }
      const order = {
        id: data.id.trim(),
        date: data.date || todayIso(),
        time: data.time || '',
        status: data.status || 'Nowe',
        priority: 'normal',
        type: data.type || '-',
        client: data.client || '-',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        service: data.service || '',
        equipment: '',
        voucher: 'brak',
        notes: '',
        createdAt: new Date().toISOString(),
        history: [{ at: new Date().toISOString(), text: 'Zlecenie dodane ręcznie.' }]
      };
      state.orders.push(order);
      addNotification('Nowe zlecenie', `Dodano #${order.id} - ${order.client}.`);
      saveData();
      notifyInApp('Dodano zlecenie', `#${order.id}`);
      location.hash = '#/order/' + encodeURIComponent(order.id);
    });
  }

  function notificationList(items) {
    if (!items.length) return empty('Brak powiadomień.');
    return `<div class="timeline">${items.map(n => `<div class="timeline-item"><strong>${escapeHtml(n.title)}</strong><small>${formatDateTime(n.at)}</small><p>${escapeHtml(n.body || '')}</p></div>`).join('')}</div>`;
  }

  function timeline(items) {
    if (!items.length) return empty('Brak historii.');
    return `<div class="timeline">${items.slice().reverse().map(h => `<div class="timeline-item"><strong>${escapeHtml(h.text)}</strong><small>${formatDateTime(h.at)}</small></div>`).join('')}</div>`;
  }

  function infoRow(label, value) {
    return `<div class="info-row"><span>${label}</span><strong>${value}</strong></div>`;
  }

  function statusPill(status) {
    const map = {
      'Nowe': 'status-nowe',
      'W toku': 'status-w-toku',
      'Oczekuje': 'status-oczekuje',
      'Zamknięte': 'status-zamkniete',
      'Anulowane': 'status-anulowane'
    };
    return `<span class="pill ${map[status] || 'status-nowe'}">${escapeHtml(status || '-')}</span>`;
  }

  function priority(value) {
    const map = { high: 'Wysoki', normal: 'Normalny', low: 'Niski' };
    return `<span class="priority ${escapeAttr(value || 'normal')}">${map[value] || 'Normalny'}</span>`;
  }

  function empty(text) {
    return `<div class="empty">${escapeHtml(text)}</div>`;
  }

  function updateOrderStatus(id, status, note, withSave = true) {
    const order = state.orders.find(o => o.id === id);
    if (!order) return;
    order.status = status;
    addHistory(id, note || `Status zmieniony na ${status}.`);
    addNotification('Zmiana statusu', `#${id}: ${status}`);
    if (withSave) {
      saveData();
      notifyInApp('Status zapisany', `#${id}: ${status}`);
    }
  }

  function addHistory(id, text) {
    const order = state.orders.find(o => o.id === id);
    if (!order) return;
    if (!Array.isArray(order.history)) order.history = [];
    order.history.push({ at: new Date().toISOString(), text });
  }

  function addNotification(title, body) {
    state.notifications.unshift({ id: 'n' + Date.now(), at: new Date().toISOString(), title, body, type: 'local' });
    state.notifications = state.notifications.slice(0, 80);
  }

  async function enableNotifications() {
    if (!('Notification' in window)) {
      notifyInApp('Brak obsługi powiadomień', 'Ta przeglądarka nie obsługuje Notification API.');
      return;
    }
    const permission = await Notification.requestPermission();
    settings.notificationsEnabled = permission === 'granted';
    saveSettings();
    notifyInApp(permission === 'granted' ? 'Powiadomienia włączone' : 'Brak zgody', 'Dotyczy tylko otwartej aplikacji.', true);
  }

  function notifyInApp(title, body, alsoSystem) {
    const wrap = document.getElementById('toast-wrap');
    if (wrap) {
      const el = document.createElement('div');
      el.className = 'toast';
      el.innerHTML = `${escapeHtml(title)}${body ? `<small>${escapeHtml(body)}</small>` : ''}`;
      wrap.appendChild(el);
      setTimeout(() => el.remove(), 4500);
    }
    if (alsoSystem && settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      try { new Notification(title, { body, icon: './icons/icon-192.png' }); } catch (_) {}
    }
  }

  function exportJson() {
    const text = JSON.stringify(state, null, 2);
    const name = 'telmor-praca-dane-' + nowFileStamp() + '.json';
    downloadFile(name, text, 'application/json;charset=utf-8');
  }

  function importJson() {
    try {
      const text = document.getElementById('import-json').value.trim();
      const imported = JSON.parse(text);
      if (!imported || !Array.isArray(imported.orders)) throw new Error('Brak tablicy orders.');
      state = {
        orders: imported.orders,
        notifications: Array.isArray(imported.notifications) ? imported.notifications : []
      };
      saveData();
      notifyInApp('Import zakończony', `Wczytano ${state.orders.length} zleceń.`);
      location.hash = '#/dashboard';
    } catch (error) {
      alert('Nie można zaimportować danych: ' + error.message);
    }
  }

  function loadData() {
    try {
      const raw = localStorage.getItem(DATA_KEY);
      if (!raw) return clone(DEMO_DATA);
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.orders)) return clone(DEMO_DATA);
      parsed.notifications = Array.isArray(parsed.notifications) ? parsed.notifications : [];
      return parsed;
    } catch (_) {
      return clone(DEMO_DATA);
    }
  }

  function saveData() {
    localStorage.setItem(DATA_KEY, JSON.stringify(state));
  }

  function loadSettings() {
    try {
      return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'));
    } catch (_) {
      return Object.assign({}, DEFAULT_SETTINGS);
    }
  }

  function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  function sortedOrders() {
    return state.orders.slice().sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')) || String(a.time || '').localeCompare(String(b.time || '')));
  }

  function buildCustomers() {
    const map = new Map();
    state.orders.forEach(o => {
      const key = normalize(o.client || 'brak');
      if (!map.has(key)) map.set(key, { client: o.client || '-', phone: o.phone || '', address: o.address || '', city: o.city || '', count: 0 });
      map.get(key).count += 1;
    });
    return Array.from(map.values()).sort((a, b) => a.client.localeCompare(b.client, 'pl'));
  }

  function hasVoucher(order) {
    return normalize(order.voucher || '').includes('voucher');
  }

  function formatDate(value) {
    if (!value) return '-';
    const d = new Date(value + 'T00:00:00');
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('pl-PL');
  }

  function formatDateTime(value) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value || '-';
    return d.toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' });
  }

  function todayIso() {
    return new Date().toISOString().slice(0, 10);
  }

  function nowFileStamp() {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getDate())}${pad(d.getMonth() + 1)}${String(d.getFullYear()).slice(2)}${pad(d.getHours())}${pad(d.getMinutes())}`;
  }

  function cleanPhone(value) {
    return String(value || '').replace(/[^0-9+]/g, '');
  }

  function normalize(value) {
    return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function copyText(text) {
    navigator.clipboard?.writeText(text).then(() => notifyInApp('Skopiowano', 'Tekst zapisany w schowku.')).catch(() => alert(text));
  }

  function bindCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(btn => btn.addEventListener('click', () => copyText(btn.dataset.copy || '')));
  }

  function downloadFile(name, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function markActive(path) {
    document.querySelectorAll('[data-route]').forEach(link => {
      const route = link.dataset.route;
      const active = route === path || (route === '#/orders' && path.startsWith('#/order/'));
      link.classList.toggle('active', active);
    });
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(console.warn));
    }
  }

  function setupInstallPrompt() {
    let promptEvent = null;
    const button = document.getElementById('install-button');
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      promptEvent = event;
      button.hidden = false;
    });
    button.addEventListener('click', async () => {
      if (!promptEvent) return;
      promptEvent.prompt();
      await promptEvent.userChoice;
      promptEvent = null;
      button.hidden = true;
    });
  }
})();
