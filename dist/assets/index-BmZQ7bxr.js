(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`telmor_praca_local_session_v1`,t=`telmor-auth-changed`;function n(){let t=localStorage.getItem(e);if(!t)return null;try{return JSON.parse(t)}catch{return localStorage.removeItem(e),null}}function r(){let e=n(),t=e?.displayName||e?.email||`Tomek`;return String(t).trim().slice(0,2).toUpperCase()||`TW`}function i(){return n()?.email||`konto lokalne`}function a(){return n()?`konto lokalne`:`nieuruchomione`}async function o({email:t,password:n}){let r=String(t||``).trim()||`lokalnie@telmor-praca`;if(!n)throw Error(`Podaj hasło lokalne albo użyj wejścia lokalnego.`);let i={uid:`local-user`,email:r,displayName:r.split(`@`)[0]||`Tomek`,mode:`local`,signedInAt:new Date().toISOString()};return localStorage.setItem(e,JSON.stringify(i)),f(),i}async function s({email:e,password:t}){return o({email:e,password:t})}async function c(){throw Error(`Aplikacja działa lokalnie. Nie ma serwera resetowania hasła.`)}function l(t=`lokalnie@telmor-praca`){let n={uid:`local-user`,email:t,displayName:`Tomek`,mode:`local`,signedInAt:new Date().toISOString()};return localStorage.setItem(e,JSON.stringify(n)),f(),n}function u(){localStorage.removeItem(e),f()}function d(e){return window.addEventListener(t,e),()=>window.removeEventListener(t,e)}function f(){window.dispatchEvent(new CustomEvent(t,{detail:n()}))}function p(){let e=r();return`
    <header class="app-header">
      <div class="mobile-header-row mobile-only">
        <a class="icon-button" href="#/search" aria-label="Szukaj">⌕</a>
        <a class="mobile-brand" href="#/dashboard">TELMOR PRACA</a>
        <a class="notification-button" href="#/notifications" aria-label="Powiadomienia">
          🔔
          <span class="badge">3</span>
        </a>
      </div>

      <form id="app-search-form" class="search-box" role="search" autocomplete="off">
        <span aria-hidden="true">⌕</span>
        <input id="app-search-input" type="search" value="${ne(te())}" placeholder="Szukaj zlecenia, klienta, telefonu, miasta..." />
        <kbd>Ctrl K</kbd>
      </form>

      <div class="header-status desktop-only">
        <span class="status-dot"></span>
        <span>PWA lokalne · GitHub Pages</span>
      </div>
      <a class="notification-button desktop-only" href="#/notifications" aria-label="Powiadomienia">
        🔔
        <span class="badge">3</span>
      </a>
      <a class="user-pill desktop-only" href="#/settings" aria-label="Ustawienia użytkownika">${e}</a>
    </header>
  `}function ee(){let e=document.querySelector(`#app-search-form`),t=document.querySelector(`#app-search-input`);!e||!t||(e.addEventListener(`submit`,e=>{e.preventDefault();let n=t.value.trim();window.location.hash=n?`#/search?q=${encodeURIComponent(n)}`:`#/search`}),t.addEventListener(`focus`,()=>{window.location.hash.startsWith(`#/search`)||(window.location.hash=`#/search`)}),document.addEventListener(`keydown`,e=>{(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`k`&&(e.preventDefault(),t.focus(),t.select())}))}function te(){return window.location.hash.startsWith(`#/search`)&&new URLSearchParams(window.location.hash.split(`?`)[1]||``).get(`q`)||``}function ne(e=``){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}var re=[[`#/dashboard`,`⌂`,`Dashboard`],[`#/search`,`⌕`,`Szukaj`],[`#/work`,`◈`,`Praca`],[`#/telmor-sync`,`⇄`,`Telmor`],[`#/sync`,`⟳`,`Sync`],[`#/orders-open`,`▣`,`Otwarte`],[`#/orders-closed`,`▤`,`Zamknięte`],[`#/customers`,`♙`,`Klienci`],[`#/history`,`↺`,`Historia`],[`#/notifications`,`🔔`,`Powiadomienia`],[`#/diagnostics`,`✓`,`Diagnostyka`],[`#/settings`,`⚙`,`Ustawienia`]];function ie(){return`
    <aside class="sidebar desktop-only">
      <a class="brand" href="#/dashboard" aria-label="Telmor Praca">
        <span class="brand-mark">✣</span>
        <span>TELMOR<br />PRACA</span>
      </a>
      <nav class="side-nav">
        ${re.map(([e,t,n])=>`
          <a href="${e}" data-route="${e}" class="nav-link">
            <span class="nav-icon">${t}</span>
            <span>${n}</span>
            ${n===`Powiadomienia`?`<em class="nav-badge">3</em>`:``}
          </a>
        `).join(``)}
      </nav>
      <section class="sync-card">
        <div><span class="status-dot"></span> Konto aplikacji</div>
        <strong>${a()}</strong>
        <small>Zalogowano jako: ${i()}. Wszystkie dane tej wersji zostają lokalnie w przeglądarce.</small>
      </section>
    </aside>
  `}var ae=[[`#/dashboard`,`⌂`,`Start`],[`#/orders-open`,`▣`,`Zlecenia`],[`#/search`,`⌕`,`Szukaj`],[`#/work`,`◈`,`Praca`],[`#/history`,`↺`,`Historia`]];function oe(){return`
    <nav class="bottom-nav mobile-only" aria-label="Dolne menu">
      ${ae.map(([e,t,n],r)=>`
        <a href="${e}" data-route="${e}" class="bottom-link ${r===2?`bottom-link-main`:``}">
          <span>${t}</span>
          <small>${n}</small>
        </a>
      `).join(``)}
    </nav>
  `}function se(e){e.innerHTML=`
    <div class="app-shell">
      ${ie()}
      <main class="main-area">
        ${p()}
        <section id="page-root" class="page-root" aria-live="polite"></section>
      </main>
      ${oe()}
    </div>
  `,ee()}function ce({label:e,value:t,note:n,tone:r=`blue`,icon:i=`▣`}){return`
    <article class="stat-card stat-${r}">
      <div>
        <span>${e}</span>
        <strong>${t}</strong>
        <small>${n}</small>
      </div>
      <i aria-hidden="true">${i}</i>
    </article>
  `}function le(e=`Ładowanie danych...`){return`
    <div class="page">
      <section class="panel state-panel">
        <div class="loader-dot" aria-hidden="true"></div>
        <div>
          <h2>${e}</h2>
          <p>Dane są pobierane z warstwy repozytoriów. W trybie demo aplikacja używa danych testowych.</p>
        </div>
      </section>
    </div>
  `}function ue(e){return`
    <div class="page">
      <section class="panel state-panel state-panel-error">
        <div class="error-icon" aria-hidden="true">!</div>
        <div>
          <h2>Nie udało się wczytać danych</h2>
          <p>${de(e?.message||`Nieznany błąd.`)}</p>
          <button class="secondary-button" type="button" onclick="window.location.reload()">Odśwież aplikację</button>
        </div>
      </section>
    </div>
  `}function m({title:e=`Brak danych`,text:t=`Dane pojawią się po synchronizacji.`}={}){return`
    <div class="empty-list-box">
      <strong>${e}</strong>
      <span>${t}</span>
    </div>
  `}function de(e){return String(e).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function fe({orders:e=[],mode:t=`open`,compact:n=!1}={}){return`
    <section class="panel order-panel">
      <div class="panel-header">
        <h2>${t===`closed`?`Zamknięte zlecenia`:`Moje otwarte zlecenia`}</h2>
        <a href="${t===`closed`?`#/orders-closed`:`#/orders-open`}">Wszystkie</a>
      </div>
      ${e.length?`
        <div class="order-list ${n?`order-list-compact`:``}">
          ${e.map(e=>pe(e)).join(``)}
        </div>
        <div class="panel-footer">
          <span>1–${e.length} z ${e.length}</span>
          <a href="${t===`closed`?`#/orders-closed`:`#/orders-open`}">Pokaż więcej</a>
        </div>
      `:m({title:`Brak zleceń`,text:`Lista zostanie uzupełniona po synchronizacji albo po wgraniu danych demo.`})}
    </section>
  `}function pe(e){let t=e.id||e.number;return`
    <a href="#/order/${t}" class="order-row">
      <strong>#${e.number||t}</strong>
      <span class="order-client">${e.customerName||e.clientName||`-`}</span>
      <span class="order-city">${e.location||e.city||`-`}</span>
      <span class="order-topic">${e.shortTopic||e.topic||`-`}</span>
      <span class="order-date">${he(e.createdAt||e.registeredAt)}</span>
      <em class="pill pill-${e.statusTone||`gray`}">${e.status||`-`}</em>
      <span class="row-arrow">›</span>
    </a>
  `}function me({orders:e=[],mode:t=`open`}={}){return e.length?`
    <div class="mobile-order-cards">
      ${e.map(e=>{let t=e.id||e.number;return`
          <a href="#/order/${t}" class="mobile-order-card">
            <div class="mobile-order-head">
              <strong>#${e.number||t}</strong>
              <em class="pill pill-${e.statusTone||`gray`}">${e.status||`-`}</em>
            </div>
            <h3>${e.shortTopic||e.topic||`-`}</h3>
            <p>${e.customerName||e.clientName||`-`} · ${e.location||e.city||`-`}</p>
            <div class="mobile-order-meta">
              <span>◷ ${he(e.createdAt||e.registeredAt)}</span>
              <span>${e.priority||`Standard`}</span>
            </div>
          </a>
        `}).join(``)}
    </div>
  `:m({title:`Brak zleceń`,text:`Dane pojawią się po synchronizacji albo po wgraniu danych demo.`})}function he(e){if(!e)return`-`;let t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleDateString(`pl-PL`,{day:`2-digit`,month:`2-digit`,year:`numeric`})}var h=Object.freeze({USERS:`users`,DEVICES:`devices`,ORDERS:`orders`,CUSTOMERS:`customers`,ORDER_HISTORY:`orderHistory`,ATTACHMENTS:`attachments`,NOTES:`notes`,NOTIFICATIONS:`notifications`,SYNC_STATE:`syncState`}),g=Object.freeze({NEW:`Nowe`,IN_PROGRESS:`W toku`,WAITING:`Oczekuje`,CLOSED:`Zamknięte`,CANCELLED:`Anulowane`}),ge=Object.freeze({[g.NEW]:`blue`,[g.IN_PROGRESS]:`orange`,[g.WAITING]:`purple`,[g.CLOSED]:`green`,[g.CANCELLED]:`gray`}),_e=`main`,ve=Object.freeze({TELMOR:`telmor`,MANUAL:`manual`,DEMO:`demo`}),_=[{id:`104750`,number:`104750`,status:`Nowe`,statusTone:`blue`,priority:`Voucher`,clientName:`Arkadiusz Mieszkowicz`,customerName:`Arkadiusz Mieszkowicz`,phone:`731 021 410`,city:`Mielec`,location:`Trzciana (Mielec)`,address:`39-304 Trzciana, ul. 21A`,house:`21A / -`,topic:`Instalacja / Voucher`,shortTopic:`Instalacja / Voucher`,registeredAt:`04.06.2024, 12:10`,createdAt:`2024-06-04T12:15:00.000Z`,modifiedAt:`2024-06-04T12:15:00.000Z`,updatedAt:`2024-06-07T15:32:00.000Z`,plannedAt:`Nie ustawiono`,doneAt:`07.06.2024, 15:32`,assignee:`Tomasz Wolak`,voucher:`3237572100-531767295`,hasVoucher:!0,attachmentCount:1,noteCount:1,isNew:!0,description:`Instalacja nowej usługi na podstawie vouchera. Dane demonstracyjne na bazie układu z portalu.`,history:[{id:`hist-104750-3`,date:`07.06.2024, 15:32`,title:`Korespondencja została dodana`,author:`Tomasz Wolak`,text:`Dodano zdjęcie vouchera.`,createdAt:`2024-06-07T15:32:00.000Z`},{id:`hist-104750-2`,date:`04.06.2024, 12:15`,title:`Zgłoszenie przekazane do realizacji`,author:`System`,text:`Status ustawiony na zlecone.`,createdAt:`2024-06-04T12:15:00.000Z`},{id:`hist-104750-1`,date:`04.06.2024, 12:10`,title:`Zgłoszenie utworzone`,author:`Marzena Raczyńska`,text:`Utworzono nowe zgłoszenie.`,createdAt:`2024-06-04T12:10:00.000Z`}],attachments:[{id:`att-104750-1`,name:`IMG_20240607_153130.jpg`,size:`4,9 MB`,type:`Voucher`}],notes:[{id:`note-104750-1`,text:`Sprawdzić, czy voucher jest czytelny po synchronizacji zdjęcia.`,createdBy:`Tomasz Wolak`,createdAt:`2024-06-07T15:40:00.000Z`}]},{id:`104749`,number:`104749`,status:`W toku`,statusTone:`orange`,priority:`Awaria`,clientName:`Klient testowy`,customerName:`Klient testowy`,phone:`600 100 200`,city:`Mielec`,location:`Mielec`,address:`Mielec, adres testowy`,house:`12 / 4`,topic:`Internet / Awaria`,shortTopic:`Brak sygnału`,registeredAt:`04.06.2024, 10:02`,createdAt:`2024-06-04T10:02:00.000Z`,modifiedAt:`2024-06-04T10:40:00.000Z`,updatedAt:`2024-06-04T10:40:00.000Z`,plannedAt:`Dzisiaj`,doneAt:`-`,assignee:`Tomasz Wolak`,voucher:`-`,hasVoucher:!1,attachmentCount:0,noteCount:1,isNew:!1,description:`Zgłoszenie awarii internetu. Wymaga kontaktu z klientem i sprawdzenia instalacji.`,history:[{id:`hist-104749-2`,date:`04.06.2024, 10:40`,title:`Dodano notatkę`,author:`Tomasz Wolak`,text:`Klient prosi o kontakt przed przyjazdem.`,createdAt:`2024-06-04T10:40:00.000Z`},{id:`hist-104749-1`,date:`04.06.2024, 10:02`,title:`Zgłoszenie utworzone`,author:`System`,text:`Przyjęto zgłoszenie awarii.`,createdAt:`2024-06-04T10:02:00.000Z`}],attachments:[],notes:[{id:`note-104749-1`,text:`Zadzwonić przed wyjazdem. Klient dostępny po 15:00.`,createdBy:`Tomasz Wolak`,createdAt:`2024-06-04T10:41:00.000Z`}]},{id:`104748`,number:`104748`,status:`Oczekuje`,statusTone:`purple`,priority:`Standard`,clientName:`Tomasz Wójak`,customerName:`Tomasz Wójak`,phone:`601 222 333`,city:`Trzciana`,location:`Trzciana`,address:`Trzciana, adres testowy`,house:`8 / -`,topic:`Telewizja / Instalacja`,shortTopic:`Telewizja / Instalacja`,registeredAt:`03.06.2024, 16:47`,createdAt:`2024-06-03T16:47:00.000Z`,modifiedAt:`2024-06-03T17:10:00.000Z`,updatedAt:`2024-06-03T17:10:00.000Z`,plannedAt:`Nie ustawiono`,doneAt:`-`,assignee:`Tomasz Wolak`,voucher:`-`,hasVoucher:!1,attachmentCount:0,noteCount:0,isNew:!1,description:`Instalacja telewizji. Oczekuje na ustalenie terminu.`,history:[{id:`hist-104748-1`,date:`03.06.2024, 17:10`,title:`Status zmieniony`,author:`System`,text:`Status ustawiony na oczekuje.`,createdAt:`2024-06-03T17:10:00.000Z`}],attachments:[],notes:[]},{id:`104747`,number:`104747`,status:`Nowe`,statusTone:`blue`,priority:`Internet`,clientName:`Władysław Górna`,customerName:`Władysław Górna`,phone:`602 333 444`,city:`Mielec`,location:`Wadowice Górne (Mielec)`,address:`Wadowice Górne, adres testowy`,house:`5 / -`,topic:`Internet`,shortTopic:`Internet`,registeredAt:`03.06.2024, 09:11`,createdAt:`2024-06-03T09:11:00.000Z`,modifiedAt:`2024-06-03T09:11:00.000Z`,updatedAt:`2024-06-03T09:11:00.000Z`,plannedAt:`Nie ustawiono`,doneAt:`-`,assignee:`Tomasz Wolak`,voucher:`Do sprawdzenia`,hasVoucher:!1,attachmentCount:0,noteCount:0,isNew:!0,description:`Nowe zgłoszenie internetowe. Wymaga uzupełnienia danych po kontakcie z klientem.`,history:[{id:`hist-104747-1`,date:`03.06.2024, 09:11`,title:`Zgłoszenie utworzone`,author:`System`,text:`Nowe zgłoszenie internetowe.`,createdAt:`2024-06-03T09:11:00.000Z`}],attachments:[],notes:[]},{id:`104746`,number:`104746`,status:`Zamknięte`,statusTone:`green`,priority:`Standard`,clientName:`Chrząst Kow`,customerName:`Chrząst Kow`,phone:`603 444 555`,city:`Mielec`,location:`Chorzelów`,address:`Chorzelów, adres testowy`,house:`2 / -`,topic:`Telewizja kablowa`,shortTopic:`Instalacja`,registeredAt:`01.06.2024, 14:20`,createdAt:`2024-06-01T14:20:00.000Z`,modifiedAt:`2024-06-02T11:03:00.000Z`,updatedAt:`2024-06-02T11:03:00.000Z`,plannedAt:`02.06.2024`,doneAt:`02.06.2024, 11:03`,assignee:`Tomasz Wolak`,voucher:`-`,hasVoucher:!1,attachmentCount:2,noteCount:1,isNew:!1,description:`Zlecenie zamknięte. Dane demonstracyjne.`,history:[{id:`hist-104746-1`,date:`02.06.2024, 11:03`,title:`Zlecenie zamknięte`,author:`Tomasz Wolak`,text:`Usługa wykonana.`,createdAt:`2024-06-02T11:03:00.000Z`}],attachments:[{id:`att-104746-1`,name:`protokol.pdf`,size:`240 KB`,type:`Protokół`},{id:`att-104746-2`,name:`zdjecie.jpg`,size:`2,1 MB`,type:`Zdjęcie`}],notes:[{id:`note-104746-1`,text:`Zlecenie przykładowe do sprawdzenia widoku zamkniętych usług.`,createdBy:`Tomasz Wolak`,createdAt:`2024-06-02T11:05:00.000Z`}]},{id:`104745`,number:`104745`,status:`Zamknięte`,statusTone:`green`,priority:`Standard`,clientName:`Anna Przykład`,customerName:`Anna Przykład`,phone:`604 555 666`,city:`Czermin`,location:`Czermin`,address:`Czermin, adres testowy`,house:`10 / -`,topic:`Internet / Aktywacja`,shortTopic:`Aktywacja internetu`,registeredAt:`29.05.2024, 08:21`,createdAt:`2024-05-29T08:21:00.000Z`,modifiedAt:`2024-05-30T16:10:00.000Z`,updatedAt:`2024-05-30T16:10:00.000Z`,plannedAt:`30.05.2024`,doneAt:`30.05.2024, 16:10`,assignee:`Tomasz Wolak`,voucher:`-`,hasVoucher:!1,attachmentCount:1,noteCount:0,isNew:!1,description:`Drugie zamknięte zlecenie do testowania historii klienta.`,history:[{id:`hist-104745-1`,date:`30.05.2024, 16:10`,title:`Zlecenie zamknięte`,author:`Tomasz Wolak`,text:`Aktywacja zakończona.`,createdAt:`2024-05-30T16:10:00.000Z`}],attachments:[{id:`att-104745-1`,name:`potwierdzenie.jpg`,size:`1,8 MB`,type:`Zdjęcie`}],notes:[]}],ye=[{id:`notification-1`,tone:`blue`,type:`order_changed`,title:`Zaktualizowano zlecenie #104750`,note:`Dodano załącznik przez Marzenę R.`,body:`Dodano załącznik przez Marzenę R.`,orderId:`104750`,createdAt:`2024-06-07T15:33:00.000Z`},{id:`notification-2`,tone:`orange`,type:`message`,title:`Nowa korespondencja do #104749`,note:`Odpowiedź od klienta testowego`,body:`Odpowiedź od klienta testowego`,orderId:`104749`,createdAt:`2024-06-04T10:45:00.000Z`},{id:`notification-3`,tone:`purple`,type:`status_changed`,title:`Zmieniono status zlecenia #104748`,note:`Status zmieniony na Oczekuje`,body:`Status zmieniony na Oczekuje`,orderId:`104748`,createdAt:`2024-06-03T17:10:00.000Z`}];function be(e){return _.find(t=>t.id===e||t.number===e)||_[0]}function xe(){return _.filter(e=>e.status!==`Zamknięte`)}function Se(){return _.filter(e=>e.status===`Zamknięte`)}function Ce(){let e=new Map;return _.forEach(t=>{let n=`${t.clientName}-${t.phone}`;if(!e.has(n))e.set(n,{id:t.customerId||n.toLowerCase().replaceAll(` `,`-`),name:t.clientName,phone:t.phone,city:t.city,address:t.address,houseNumber:t.house,ordersCount:1,notesCount:t.noteCount||0,lastOrder:t.id,lastOrderId:t.id,lastTopic:t.topic,updatedAt:t.updatedAt});else{let r=e.get(n);r.ordersCount+=1,r.notesCount+=t.noteCount||0}}),[...e.values()]}function we(){return _.flatMap(e=>(e.history||[]).map(t=>({...t,orderId:e.id,customerName:e.clientName,topic:e.topic}))).sort((e,t)=>String(t.createdAt||t.date).localeCompare(String(e.createdAt||e.date)))}function v(e=``){return String(e).toLowerCase().normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).replace(/ł/g,`l`).replace(/[^a-z0-9]+/g,` `).replace(/\s+/g,` `).trim()}function Te(e=``){return String(e).replace(/\D+/g,``)}function y(e=``){return v(e).replace(/\s+/g,``)}function b(e=[]){let t=new Set;return e.filter(e=>e!=null).map(e=>String(e)).forEach(e=>{let n=v(e),r=y(e),i=Te(e);n&&(t.add(n),n.split(` `).forEach(e=>Ee(t,e))),r&&Ee(t,r),i&&Ee(t,i)}),[...t].filter(e=>e.length>=2).slice(0,120)}function Ee(e,t){t&&(e.add(t),t.length>=4&&e.add(t.slice(0,4)),t.length>=6&&e.add(t.slice(0,6)),t.length>=8&&e.add(t.slice(0,8)))}function De(e,t=`item`){let n=y(e);return n?n.slice(0,80):`${t}-${Date.now()}`}function Oe(e){return De(e,`order`)}function ke({name:e=``,phone:t=``,city:n=``}={}){return De(y(t)||`${e}-${n}`,`customer`)}function Ae({orderId:e=``,fileName:t=``,createdAt:n=``}={}){return De(`${e}-${t}-${n||Date.now()}`,`attachment`)}function je(e={}){let t=String(e.number||e.id||e.orderNumber||``).trim(),n=e.status||g.NEW,r=e.customerName||e.clientName||``,i=e.phone||``,a=e.city||``,o=e.location||a,s=e.topic||e.shortTopic||``,c=e.customerId||ke({name:r,phone:i,city:a});return{id:e.id||Oe(t),userId:e.userId||``,number:t,sourceSystem:e.sourceSystem||ve.TELMOR,sourceId:e.sourceId||t,status:n,sourceStatus:e.sourceStatus||n,statusTone:e.statusTone||ge[n]||`gray`,priority:e.priority||`Standard`,workStatus:e.workStatus||`normalne`,isFavorite:!!e.isFavorite,nextActionAt:e.nextActionAt||``,lastOpenedAt:e.lastOpenedAt||``,customerId:c,customerName:r,phone:i,city:a,location:o,address:e.address||``,house:e.house||``,topic:s,shortTopic:e.shortTopic||s,description:e.description||``,voucher:e.voucher||``,hasVoucher:!!(e.hasVoucher??(e.voucher&&e.voucher!==`-`)),attachmentCount:Number(e.attachmentCount||0),noteCount:Number(e.noteCount||0),attachments:Array.isArray(e.attachments)?e.attachments:[],isNew:!!e.isNew,registeredAt:e.registeredAt||``,plannedAt:e.plannedAt||``,doneAt:e.doneAt||``,createdAt:e.createdAt||new Date().toISOString(),updatedAt:e.updatedAt||e.modifiedAt||new Date().toISOString(),lastSyncAt:e.lastSyncAt||``,assignee:e.assignee||``,searchTokens:e.searchTokens||b([t,r,i,a,o,e.address,s,n,e.voucher])}}function Me(e={}){let t=e.name||e.customerName||e.clientName||``,n=e.phone||``,r=e.city||``;return{id:e.id||e.customerId||ke({name:t,phone:n,city:r}),userId:e.userId||``,name:t,phone:n,city:r,address:e.address||``,postalCode:e.postalCode||``,street:e.street||``,houseNumber:e.houseNumber||e.house||``,ordersCount:Number(e.ordersCount||0),notesCount:Number(e.notesCount||0),lastOrderId:e.lastOrderId||e.lastOrder||``,lastTopic:e.lastTopic||``,createdAt:e.createdAt||new Date().toISOString(),updatedAt:e.updatedAt||new Date().toISOString(),searchTokens:e.searchTokens||b([t,n,r,e.address,e.street,e.houseNumber])}}function Ne(e={}){return{id:e.id||`${e.orderId||`order`}-${Date.now()}`,userId:e.userId||``,orderId:e.orderId||``,customerId:e.customerId||``,date:e.date||e.createdAt||new Date().toISOString(),title:e.title||e.type||`Wpis historii`,type:e.type||`info`,author:e.author||``,text:e.text||``,attachmentName:e.attachmentName||``,createdAt:e.createdAt||new Date().toISOString(),updatedAt:e.updatedAt||new Date().toISOString(),searchTokens:e.searchTokens||b([e.orderId,e.title,e.author,e.text,e.attachmentName])}}function Pe(e={}){let t=e.createdAt||new Date().toISOString(),n=e.fileName||e.name||`plik`,r=e.orderId||``,i=Number(e.sizeBytes||e.size||0),a=e.fileKind||e.type||Fe(n,e.mimeType),o=!!(e.isVoucher||/voucher|bon|kupon/i.test(`${a} ${n}`));return{id:e.id||Ae({orderId:r,fileName:n,createdAt:t}),userId:e.userId||``,orderId:r,customerId:e.customerId||``,fileName:n,displayName:e.displayName||n,mimeType:e.mimeType||e.contentType||``,sizeBytes:i,sizeLabel:e.sizeLabel||Ie(i),fileKind:a,isVoucher:o,description:e.description||``,source:e.source||`manual`,storagePath:e.storagePath||``,downloadUrl:e.downloadUrl||``,localBlobKey:e.localBlobKey||``,localOnly:!!e.localOnly,syncPending:!!e.syncPending,createdAt:t,updatedAt:e.updatedAt||t,searchTokens:e.searchTokens||b([r,e.customerId,n,a,e.description])}}function Fe(e=``,t=``){let n=`${e} ${t}`.toLowerCase();return/voucher|bon|kupon/.test(n)?`Voucher`:/pdf/.test(n)?`PDF`:/image|jpg|jpeg|png|webp/.test(n)?`Zdjęcie`:`Plik`}function Ie(e=0){let t=Number(e||0);return t?t<1024?`${t} B`:t<1024*1024?`${(t/1024).toFixed(1).replace(`.`,`,`)} KB`:`${(t/1024/1024).toFixed(1).replace(`.`,`,`)} MB`:`-`}function Le(e={}){return{id:e.id||`${e.orderId||e.customerId||`note`}-${Date.now()}`,userId:e.userId||``,orderId:e.orderId||``,customerId:e.customerId||``,text:e.text||``,pinned:!!e.pinned,createdBy:e.createdBy||``,createdAt:e.createdAt||new Date().toISOString(),updatedAt:e.updatedAt||new Date().toISOString(),searchTokens:e.searchTokens||b([e.orderId,e.customerId,e.text,e.createdBy])}}function Re(e={}){return{id:e.id||`notification-${Date.now()}`,userId:e.userId||``,type:e.type||`info`,title:e.title||``,body:e.body||e.note||``,orderId:e.orderId||``,customerId:e.customerId||``,read:!!e.read,createdAt:e.createdAt||new Date().toISOString(),updatedAt:e.updatedAt||new Date().toISOString()}}function ze(e={}){return{id:e.id||`main`,userId:e.userId||``,deviceId:e.deviceId||``,lastOpenOrdersSyncAt:e.lastOpenOrdersSyncAt||``,lastClosedOrdersSyncAt:e.lastClosedOrdersSyncAt||``,lastFullSyncAt:e.lastFullSyncAt||``,lastError:e.lastError||``,updatedAt:e.updatedAt||new Date().toISOString()}}var Be=`telmor_praca_local_db`,Ve=1,x=`key_value`,He=null;function Ue(){return typeof indexedDB<`u`}function We(){return Ue()?He||(He=new Promise((e,t)=>{let n=indexedDB.open(Be,Ve);n.onupgradeneeded=()=>{let e=n.result;e.objectStoreNames.contains(x)||e.createObjectStore(x,{keyPath:`key`})},n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error||Error(`Nie udało się otworzyć lokalnej bazy.`))}),He):Promise.reject(Error(`IndexedDB nie jest dostępne w tej przeglądarce.`))}async function S(e,t){let n=await We();return new Promise((r,i)=>{let a=n.transaction(x,`readwrite`);a.objectStore(x).put({key:e,value:t,updatedAt:new Date().toISOString()}),a.oncomplete=()=>r(!0),a.onerror=()=>i(a.error||Error(`Nie udało się zapisać danych lokalnych.`))})}async function C(e){let t=await We();return new Promise((n,r)=>{let i=t.transaction(x,`readonly`).objectStore(x).get(e);i.onsuccess=()=>n(i.result?.value??null),i.onerror=()=>r(i.error||Error(`Nie udało się odczytać danych lokalnych.`))})}async function Ge(e){let t=await We();return new Promise((n,r)=>{let i=t.transaction(x,`readwrite`);i.objectStore(x).delete(e),i.oncomplete=()=>n(!0),i.onerror=()=>r(i.error||Error(`Nie udało się usunąć danych lokalnych.`))})}var Ke=`sync:cache:v1:`,qe=`sync:cacheMeta:v1`;async function Je(e,t=[]){let n=Array.isArray(t)?t.filter(Boolean):[];return await S($e(e),n),await Qe(e,n.length),n}async function w(e){let t=await C($e(e));return Array.isArray(t)?t:[]}async function Ye(e,t){return(await w(e)).find(e=>String(e.id)===String(t))||null}async function Xe(e,t){if(!t?.id)return null;let n=await w(e),r=n.findIndex(e=>String(e.id)===String(t.id)),i={...t,updatedAt:t.updatedAt||new Date().toISOString()};return r>=0?n[r]={...n[r],...i}:n.unshift(i),await Je(e,n),i}async function Ze(e=[]){let t=await C(qe)||{},n=[];for(let r of e){let e=await w(r);n.push({collectionName:r,count:e.length,cachedAt:t[r]?.cachedAt||``,lastCount:t[r]?.count??e.length})}return n}async function Qe(e,t){let n=await C(qe)||{};n[e]={count:t,cachedAt:new Date().toISOString()},await S(qe,n)}function $e(e){return`${Ke}${e}`}function et(e,t,n){return{field:e,operator:t,value:n}}async function T(e,t={}){let n=await w(e);if(Array.isArray(t.where))for(let e of t.where)n=n.filter(t=>nt(t,e));if(t.orderByField){let e=String(t.direction||`ASCENDING`).toUpperCase();n=[...n].sort((e,n)=>rt(e?.[t.orderByField],n?.[t.orderByField])),e===`DESCENDING`&&n.reverse()}return t.limit&&(n=n.slice(0,Number(t.limit))),n}async function tt(e,t){let n=await Ye(e,t);if(!n)throw Error(`Nie znaleziono lokalnego dokumentu: ${e}/${t}.`);return n}async function E(e,t,n={}){let r={...n,id:n.id||t,updatedAt:new Date().toISOString()};return await Xe(e,r),r}function nt(e,t={}){let n=e?.[t.field];return t.operator===`EQUAL`?String(n)===String(t.value):t.operator===`ARRAY_CONTAINS`?Array.isArray(n)&&n.includes(t.value):!0}function rt(e,t){return e===t?0:e==null?-1:t==null?1:String(e).localeCompare(String(t),`pl`)}async function D({collectionName:e,loadDemo:t,modelFactory:n,filter:r}){let i=await w(e).catch(()=>[]);return i.length?at(i,n,r):at(t(),n,r)}async function it({collectionName:e,documentId:t,loadDemo:n,modelFactory:r}){let i=await Ye(e,t).catch(()=>null);if(i)return r?r(i):i;let a=n();return r?r(a):a}async function O({collectionName:e,data:t}){return{...await Xe(e,{...t,localOnly:!0,syncPending:!1,updatedAt:new Date().toISOString()}),localOnly:!0,syncPending:!1,syncMessage:`Zapisano lokalnie w tej przeglądarce.`}}function at(e,t,n){let r=Array.isArray(e)?e:[],i=t?r.map(t):r;return typeof n==`function`?i.filter(n):i}async function k({mode:e=`all`,limit:t=50}={}){return D({collectionName:h.ORDERS,loadFromLocalStore:async()=>T(h.ORDERS,{orderByField:`updatedAt`,limit:t}),loadDemo:()=>ct(e),modelFactory:je,filter:t=>e===`open`?t.status!==g.CLOSED:e===`closed`?t.status===g.CLOSED:!0})}async function ot(e){return it({collectionName:h.ORDERS,documentId:e,loadFromLocalStore:()=>tt(h.ORDERS,e),loadDemo:()=>be(e),modelFactory:je})}async function A(e){let t=je(e);return O({collectionName:h.ORDERS,documentId:t.id,data:t,saveDirect:()=>E(h.ORDERS,t.id,t)})}async function st(e){let t=[];for(let n of e)t.push(await A(n));return t}function ct(e){return e===`open`?xe():e===`closed`?Se():_}async function lt({limit:e=50}={}){return D({collectionName:h.NOTIFICATIONS,loadFromLocalStore:()=>T(h.NOTIFICATIONS,{orderByField:`createdAt`,direction:`DESCENDING`,limit:e}),loadDemo:()=>ye,modelFactory:Re})}async function ut(e){let t=Re(e);return O({collectionName:h.NOTIFICATIONS,documentId:t.id,data:t,saveDirect:()=>E(h.NOTIFICATIONS,t.id,t)})}async function dt(){let[e,t,n]=await Promise.all([k({mode:`open`,limit:20}),k({mode:`closed`,limit:20}),lt({limit:5})]),r=ft(e,t);return`
    <div class="page dashboard-page">
      <div class="page-title dashboard-title">
        <div>
          <h1>Dzień dobry, Tomasz!</h1>
          <p>Na tym etapie aplikacja pracuje już przez repozytoria danych. Gdy lokalna baza jest pusta, używa danych demo.</p>
        </div>
        <div class="desktop-only title-actions">
          <a href="#/orders-open" class="secondary-button">Zlecenia</a>
          <a href="#/settings" class="primary-button-link">Ustawienia</a>
        </div>
      </div>

      <section class="stats-grid">
        ${ce({label:`Otwarte`,value:r.open,note:`Do realizacji`,tone:`blue`,icon:`▣`})}
        ${ce({label:`Nowe`,value:r.newOrders,note:`Wymagają uwagi`,tone:`orange`,icon:`↺`})}
        ${ce({label:`Vouchery`,value:r.vouchers,note:`Do kontroli/obsługi`,tone:`purple`,icon:`◆`})}
        ${ce({label:`Zamknięte`,value:r.closed,note:`W danych lokalnych/demo`,tone:`green`,icon:`✓`})}
      </section>

      <section class="mobile-section-title mobile-only">
        <h2>Najważniejsze zlecenia</h2>
        <a href="#/orders-open">Wszystkie</a>
      </section>
      <div class="mobile-only">
        ${me({orders:e.slice(0,5),mode:`open`})}
      </div>

      <section class="content-grid desktop-only-grid">
        ${fe({orders:e.slice(0,8),mode:`open`})}
        <aside class="side-stack">
          <section class="panel notifications-panel">
            <div class="panel-header">
              <h2>Powiadomienia</h2>
              <a href="#/notifications">Wszystkie</a>
            </div>
            <div class="notification-list">
              ${n.map(e=>`
                <article>
                  <span class="dot ${e.tone||mt(e.type)}"></span>
                  <div><strong>${e.title}</strong><small>${e.body||e.note||``}</small></div>
                  <time>${pt(e.createdAt)}</time>
                </article>
              `).join(``)}
            </div>
          </section>

          <section class="panel quick-panel">
            <div class="panel-header"><h2>Szybkie filtry</h2></div>
            <div class="chip-row">
              <a class="chip active" href="#/orders-open">Wszystkie</a>
              <a class="chip" href="#/orders-open?status=Nowe">Nowe</a>
              <a class="chip" href="#/orders-open?status=W%20toku">W toku</a>
              <a class="chip" href="#/orders-open?status=Oczekuje">Oczekuje</a>
              <a class="chip green" href="#/orders-closed">Zamknięte</a>
            </div>
          </section>
        </aside>
      </section>
    </div>
  `}function ft(e,t){let n=[...e,...t];return{open:e.length,closed:t.length,newOrders:n.filter(e=>e.status===`Nowe`).length,vouchers:n.filter(e=>e.hasVoucher||String(e.voucher||``).toLowerCase().includes(`voucher`)).length}}function pt(e){if(!e)return`-`;let t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleDateString(`pl-PL`,{day:`2-digit`,month:`2-digit`})}function mt(e){return e===`message`?`orange`:e===`status_changed`?`purple`:`blue`}var ht=[[`all`,`Wszystkie`],[`Nowe`,`Nowe`],[`W toku`,`W toku`],[`Oczekuje`,`Oczekuje`],[`voucher`,`Voucher`],[`missingVoucher`,`Brak vouchera`],[`urgent`,`Pilne`],[`review`,`Do sprawdzenia`]];async function gt(e=`open`,t=`all`){let n=e===`open`,r=_t(await k({mode:n?`open`:`closed`,limit:100}),t);return`
    <div class="page orders-page">
      <div class="page-title compact-title">
        <div>
          <h1>${n?`Otwarte zlecenia`:`Zamknięte zlecenia`}</h1>
          <p>Lista pokazuje tylko najważniejsze dane. Pełne informacje są w szczegółach zlecenia.</p>
        </div>
      </div>

      <div class="filter-row">
        <a href="#/orders-open" class="filter ${n?`active`:``}">Otwarte</a>
        <a href="#/orders-closed" class="filter ${n?``:`active`}">Zamknięte</a>
        ${ht.map(([e,r])=>`
          <a class="filter ${t===e?`active-soft`:``}" href="#/${n?`orders-open`:`orders-closed`}?filter=${encodeURIComponent(e)}">${r}</a>
        `).join(``)}
      </div>

      <div class="list-summary-box">
        <strong>${r.length}</strong>
        <span>Widoczne zlecenia po filtrze: ${vt(t)}</span>
      </div>

      <div class="desktop-only-block">
        ${fe({orders:r,mode:n?`open`:`closed`})}
      </div>
      <div class="mobile-only">
        ${me({orders:r,mode:n?`open`:`closed`})}
      </div>
    </div>
  `}function _t(e,t){return!t||t===`all`?e:t===`voucher`?e.filter(e=>e.hasVoucher||String(e.voucher||``).toLowerCase().includes(`voucher`)):t===`missingVoucher`?e.filter(e=>!e.hasVoucher&&String(`${e.voucher||``} ${e.topic||``}`).toLowerCase().includes(`voucher`)):t===`urgent`?e.filter(e=>e.workStatus===`pilne`||e.priority===`Pilne`):t===`review`?e.filter(e=>e.workStatus===`do_sprawdzenia`||String(`${e.status||``} ${e.topic||``} ${e.description||``}`).toLowerCase().match(/sprawd|kontrol|brak|problem|oczekuje/)):e.filter(e=>e.status===t)}function vt(e){let t=ht.find(([t])=>t===e);return t?t[1]:`Wszystkie`}async function yt(e,{limit:t=100}={}){let n=_.find(t=>t.id===e)||_[0];return D({collectionName:h.ORDER_HISTORY,loadFromLocalStore:()=>T(h.ORDER_HISTORY,{orderByField:`createdAt`,direction:`DESCENDING`,limit:t,where:[et(`orderId`,`EQUAL`,e)]}),loadDemo:()=>(n.history||[]).map(e=>({...e,orderId:n.id})),modelFactory:Ne,filter:t=>t.orderId===e})}async function bt({limit:e=100}={}){return D({collectionName:h.ORDER_HISTORY,loadFromLocalStore:()=>T(h.ORDER_HISTORY,{orderByField:`createdAt`,direction:`DESCENDING`,limit:e}),loadDemo:()=>we().slice(0,e),modelFactory:Ne})}async function xt(e){let t=Ne(e);return O({collectionName:h.ORDER_HISTORY,documentId:t.id,data:t,saveDirect:()=>E(h.ORDER_HISTORY,t.id,t)})}async function St(e,{limit:t=50}={}){let n=_.find(t=>t.id===e)||_[0];return D({collectionName:h.NOTES,loadFromLocalStore:()=>T(h.NOTES,{orderByField:`updatedAt`,direction:`DESCENDING`,limit:t,where:[et(`orderId`,`EQUAL`,e)]}),loadDemo:()=>(n.notes||[]).map(e=>({...e,orderId:n.id,customerId:n.customerId||``})),modelFactory:Le,filter:t=>t.orderId===e})}async function Ct(e){let t=Le(e);return O({collectionName:h.NOTES,documentId:t.id,data:t,saveDirect:()=>E(h.NOTES,t.id,t)})}var wt=`attachment:file:v1:`;async function Tt(e,t){if(!e||!t)throw Error(`Brak identyfikatora załącznika albo pliku.`);let n=Dt(e);return await S(n,{attachmentId:e,name:t.name||`plik`,type:t.type||`application/octet-stream`,size:Number(t.size||0),blob:t,savedAt:new Date().toISOString()}),n}async function Et(e){return e?C(Dt(e)):null}function Dt(e){return`${wt}${e}`}function Ot(e=0){let t=Number(e||0);return t?t<1024?`${t} B`:t<1024*1024?`${(t/1024).toFixed(1).replace(`.`,`,`)} KB`:`${(t/1024/1024).toFixed(1).replace(`.`,`,`)} MB`:`-`}async function kt(e,{limit:t=200}={}){return D({collectionName:h.ATTACHMENTS,loadFromLocalStore:async()=>(await T(h.ATTACHMENTS,{orderByField:`updatedAt`,limit:t})).filter(t=>String(t.orderId)===String(e)),loadDemo:()=>Mt(e),modelFactory:Pe,filter:t=>String(t.orderId)===String(e)})}async function At(e){let t=Pe(e);return O({collectionName:h.ATTACHMENTS,documentId:t.id,data:t,saveDirect:()=>E(h.ATTACHMENTS,t.id,t)})}async function jt({order:e,file:t,fileKind:n=`Zdjęcie`,isVoucher:r=!1,description:i=``}){if(!e?.id)throw Error(`Brak zlecenia dla załącznika.`);if(!t)throw Error(`Nie wybrano pliku.`);let a=new Date().toISOString(),o=Pe({orderId:e.id,customerId:e.customerId||``,fileName:t.name||`zalacznik-${Date.now()}`,displayName:t.name||`zalacznik-${Date.now()}`,mimeType:t.type||``,sizeBytes:Number(t.size||0),sizeLabel:Ot(t.size),fileKind:n,isVoucher:r,description:i,source:`manual-device`,localOnly:!0,syncPending:!0,createdAt:a,updatedAt:a}),s=await Tt(o.id,t);return At({...o,localBlobKey:s})}function Mt(e){let t=be(e)||{};return(Array.isArray(t.attachments)?t.attachments:[]).map(n=>Pe({...n,orderId:t.id||e,customerId:t.customerId||``,fileName:n.fileName||n.name,fileKind:n.fileKind||n.type,sizeLabel:n.sizeLabel||n.size,source:`demo`}))}var Nt=`telmor_praca_work_preferences_v1`,Pt=`telmor_praca_recent_orders_v1`,Ft={savedFilters:[{id:`open`,label:`Otwarte`,route:`#/orders-open`},{id:`new`,label:`Nowe`,route:`#/orders-open?filter=Nowe`},{id:`waiting`,label:`Oczekuje`,route:`#/orders-open?filter=Oczekuje`},{id:`voucher`,label:`Brak/kwestia vouchera`,route:`#/orders-open?filter=missingVoucher`},{id:`review`,label:`Do sprawdzenia`,route:`#/orders-open?filter=review`}],dashboardMode:`compact`,updatedAt:new Date().toISOString()};function It(){let e=zt(Nt);return{...Ft,...e||{},savedFilters:Array.isArray(e?.savedFilters)&&e.savedFilters.length?e.savedFilters:Ft.savedFilters}}function Lt(e){if(!e?.id)return Rt();let t=Rt().filter(t=>t.id!==e.id),n=[{id:e.id,number:e.number||e.id,customerName:e.customerName||``,city:e.city||``,topic:e.topic||e.shortTopic||``,status:e.status||``,openedAt:new Date().toISOString()},...t].slice(0,12);return localStorage.setItem(Pt,JSON.stringify(n)),n}function Rt(){let e=zt(Pt);return Array.isArray(e)?e:[]}function zt(e){let t=localStorage.getItem(e);if(!t)return null;try{return JSON.parse(t)}catch{return localStorage.removeItem(e),null}}var j=Object.freeze({NORMAL:`normalne`,URGENT:`pilne`,REVIEW:`do_sprawdzenia`,READY:`gotowe`});function Bt(e){return e===j.URGENT?`Pilne`:e===j.REVIEW?`Do sprawdzenia`:e===j.READY?`Gotowe roboczo`:`Normalne`}async function Vt(e,t){return A({...e,workStatus:t,updatedAt:new Date().toISOString()})}async function Ht(e){return A({...e,isFavorite:!e.isFavorite,updatedAt:new Date().toISOString()})}var Ut=[[`details`,`Szczegóły`],[`client`,`Klient`],[`history`,`Historia`],[`attachments`,`Załączniki`],[`notes`,`Notatki`]];async function Wt(e,t=`details`){let n=await ot(e),[r,i,a]=await Promise.all([yt(n.id),St(n.id),kt(n.id)]);Lt(n),setTimeout(()=>Zt(n),0);let o=Ut.some(([e])=>e===t)?t:`details`,s=P(n.phone),c=n.address||n.location||n.city||``;return`
    <div class="page details-page">
      <div class="details-topbar">
        <a href="#/orders-open" class="back-link">‹ Powrót do listy</a>
        <div class="details-actions desktop-only-flex">
          <a class="action-button" href="tel:${s}">☎ Zadzwoń</a>
          <a class="action-button" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c)}" target="_blank" rel="noreferrer">⌖ Nawiguj</a>
          <button class="primary-button small" type="button" data-work-status="do_sprawdzenia">Do sprawdzenia</button>
        </div>
      </div>

      <section class="details-hero">
        <div>
          <h1>#${n.number||n.id}</h1>
          <p>${n.topic||`-`}</p>
        </div>
        <em class="pill pill-${n.statusTone||`gray`}">${n.status||`-`}</em>
      </section>

      <div class="mobile-action-grid mobile-only">
        <a href="tel:${s}">☎<small>Zadzwoń</small></a>
        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c)}" target="_blank" rel="noreferrer">⌖<small>Nawiguj</small></a>
        <button type="button" data-work-status="pilne">!<small>Pilne</small></button>
        <button type="button" data-work-status="do_sprawdzenia">↺<small>Sprawdź</small></button>
      </div>

      <nav class="details-tabs" aria-label="Zakładki zlecenia">
        ${Ut.map(([e,t])=>`
          <a class="${e===o?`active`:``}" href="#/order/${n.id}?tab=${e}">${t}${e===`attachments`?` (${a.length||n.attachmentCount||0})`:``}${e===`notes`?` (${i.length})`:``}</a>
        `).join(``)}
      </nav>

      ${Gt(n,o,r,i,a)}
    </div>
  `}function Gt(e,t,n,r,i){return t===`client`?qt(e):t===`history`?Jt(n):t===`attachments`?Yt(e,i):t===`notes`?Xt(e,r):Kt(e)}function Kt(e){return`
    <section class="details-grid">
      <article class="panel info-card main-info-card">
        <h2>Podstawowe informacje</h2>
        ${N(`Status`,`<em class="pill pill-${e.statusTone||`gray`}">${e.status||`-`}</em>`)}
        ${N(`Zarejestrowane`,$t(e.createdAt||e.registeredAt))}
        ${N(`Termin realizacji`,e.plannedAt||`-`)}
        ${N(`Miasto`,e.city||`-`)}
        ${N(`Temat`,e.topic||`-`)}
        ${N(`Wykonawca`,e.assignee||`-`)}
        <div class="hidden-details-note">Pełny opis, historia i załączniki są w osobnych zakładkach, żeby ekran nie był przeładowany.</div>
      </article>

      <article class="panel info-card">
        <h2>Adres i kontakt</h2>
        ${N(`Klient`,e.customerName||`-`)}
        ${N(`Telefon`,`<a href="tel:${P(e.phone)}">${e.phone||`-`}</a>`)}
        ${N(`Adres`,e.address||`-`)}
        ${N(`Nr domu / mieszkania`,e.house||`-`)}
      </article>

      <article class="panel info-card">
        <h2>Voucher i pliki</h2>
        ${N(`Voucher`,e.voucher||`-`)}
        ${N(`Voucher potwierdzony`,e.hasVoucher?`Tak`:`Nie`)}
        ${N(`Załączniki`,String(e.attachmentCount||0))}
        <a class="soft-button" href="#/order/${e.id}?tab=attachments">Wyświetl załączniki</a>
      </article>

      <article class="panel info-card">
        <h2>Status roboczy</h2>
        ${N(`Oznaczenie`,Bt(e.workStatus))}
        ${N(`Ulubione`,e.isFavorite?`Tak`:`Nie`)}
        <div class="work-action-row">
          <button class="soft-button" type="button" data-work-status="pilne">Oznacz jako pilne</button>
          <button class="soft-button" type="button" data-work-status="do_sprawdzenia">Do sprawdzenia</button>
          <button class="soft-button" type="button" data-work-status="gotowe">Gotowe roboczo</button>
          <button class="soft-button" type="button" data-toggle-favorite="1">${e.isFavorite?`Usuń z ulubionych`:`Dodaj do ulubionych`}</button>
        </div>
        <div id="work-action-message" class="settings-message" role="status"></div>
      </article>
    </section>
  `}function qt(e){return`
    <section class="details-grid two-columns">
      <article class="panel info-card">
        <h2>Dane klienta</h2>
        ${N(`Imię i nazwisko`,e.customerName||`-`)}
        ${N(`Telefon`,`<a href="tel:${P(e.phone)}">${e.phone||`-`}</a>`)}
        ${N(`Adres`,e.address||`-`)}
        ${N(`Nr domu / mieszkania`,e.house||`-`)}
      </article>
      <article class="panel info-card">
        <h2>Szybkie akcje</h2>
        <div class="action-stack">
          <a class="soft-button" href="tel:${P(e.phone)}">Zadzwoń do klienta</a>
          <a class="soft-button" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.address||``)}" target="_blank" rel="noreferrer">Otwórz nawigację</a>
          <button class="soft-button" type="button" disabled>Dodaj notatkę w kolejnym etapie</button>
        </div>
      </article>
    </section>
  `}function Jt(e){return`
    <section class="panel history-panel">
      <div class="panel-header"><h2>Historia zlecenia</h2><span>${e.length} wpisy</span></div>
      <div class="timeline">
        ${(e.length?e:[{date:`-`,title:`Brak historii`,author:`System`,text:`Dane pojawią się po synchronizacji.`}]).map(e=>`
          <article>
            <span class="timeline-dot"></span>
            <div>
              <strong>${e.title}</strong>
              <small>${e.date||$t(e.createdAt)} · ${e.author||`-`}</small>
              <p>${e.text||``}</p>
            </div>
          </article>
        `).join(``)}
      </div>
    </section>
  `}function Yt(e,t=[]){return`
    <section class="details-grid two-columns attachment-workspace">
      <article class="panel attachment-panel">
        <div class="panel-header"><h2>Załączniki</h2><span>${t.length} plików</span></div>
        ${t.length?`
          <div class="attachment-list">
            ${t.map(e=>`
              <article>
                <span class="file-icon">${Qt(e)}</span>
                <div>
                  <strong>${M(e.displayName||e.fileName||e.name)}</strong>
                  <small>${M(e.fileKind||e.type||`Plik`)} · ${M(e.sizeLabel||e.size||`-`)} ${e.localOnly?`· lokalnie`:``}</small>
                  ${e.description?`<small>${M(e.description)}</small>`:``}
                </div>
                <button class="icon-button" type="button" data-open-local-attachment="${M(e.id)}" ${e.localBlobKey?``:`disabled`} title="Otwórz lokalny plik">↗</button>
              </article>
            `).join(``)}
          </div>
        `:m({title:`Brak załączników`,text:`Dodaj zdjęcie, voucher albo dokument do tego zlecenia.`})}
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
  `}function Xt(e,t){return`
    <section class="panel notes-panel">
      <div class="panel-header"><h2>Notatki własne</h2><span>${t.length} notatek</span></div>
      ${t.length?`
        <div class="notes-list">
          ${t.map(e=>`
            <article>
              <strong>${M(e.createdBy||`Użytkownik`)}</strong>
              <small>${$t(e.createdAt)}</small>
              <p>${M(e.text)}</p>
            </article>
          `).join(``)}
        </div>
      `:m({title:`Brak notatek`,text:`Dodaj krótką notatkę roboczą do zlecenia. Zapis działa lokalnie i przez kolejkę synchronizacji.`})}
      <form id="note-form" class="note-form" data-order-id="${M(e.id)}">
        <textarea id="note-text" class="note-area" placeholder="Dodaj swoją notatkę do tego zlecenia..."></textarea>
        <button id="note-save-button" class="primary-button" type="submit">Zapisz notatkę</button>
        <div id="note-message" class="settings-message" role="status"></div>
      </form>
    </section>
  `}function Zt(e){let t=document.querySelector(`#attachment-form`),n=document.querySelector(`#attachment-file`),r=document.querySelector(`#attachment-kind`),a=document.querySelector(`#attachment-is-voucher`),o=document.querySelector(`#attachment-description`),s=document.querySelector(`#attachment-message`),c=(e,t=`info`)=>{s&&(s.textContent=e,s.dataset.tone=t)};r?.addEventListener(`change`,()=>{a&&(a.checked=/voucher/i.test(r.value||``))}),t?.addEventListener(`submit`,async t=>{t.preventDefault();let i=n?.files?.[0];if(!i){c(`Najpierw wybierz plik.`,`error`);return}let s=document.querySelector(`#attachment-save-button`);s&&(s.disabled=!0),c(`Zapisuję załącznik...`,`info`);try{let t=await jt({order:e,file:i,fileKind:r?.value||`Zdjęcie`,isVoucher:!!a?.checked,description:o?.value||``});await A({...e,hasVoucher:e.hasVoucher||t.isVoucher,attachmentCount:Number(e.attachmentCount||0)+1,updatedAt:new Date().toISOString()}),c(`Załącznik zapisany. Widok odświeży się za chwilę.`,`success`),setTimeout(()=>window.dispatchEvent(new HashChangeEvent(`hashchange`)),350)}catch(e){c(e.message,`error`)}finally{s&&(s.disabled=!1)}}),document.querySelectorAll(`[data-open-local-attachment]`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.dataset.openLocalAttachment,n=await Et(t);if(!n?.blob){window.alert(`Tego pliku nie ma lokalnie na tym urządzeniu.`);return}let r=URL.createObjectURL(n.blob);window.open(r,`_blank`,`noopener,noreferrer`),setTimeout(()=>URL.revokeObjectURL(r),6e4)})}),document.querySelectorAll(`[data-work-status]`).forEach(t=>{t.addEventListener(`click`,async()=>{let n=t.dataset.workStatus||j.NORMAL,r=document.querySelector(`#work-action-message`);try{t.disabled=!0,r&&(r.textContent=`Zapisuję status roboczy...`),await Vt(e,n),r&&(r.textContent=`Zapisano: ${Bt(n)}.`),setTimeout(()=>window.dispatchEvent(new HashChangeEvent(`hashchange`)),350)}catch(e){r&&(r.textContent=e.message)}finally{t.disabled=!1}})}),document.querySelector(`[data-toggle-favorite]`)?.addEventListener(`click`,async t=>{let n=document.querySelector(`#work-action-message`);try{t.currentTarget.disabled=!0,n&&(n.textContent=`Zapisuję oznaczenie ulubione...`),await Ht(e),n&&(n.textContent=`Zapisano oznaczenie.`),setTimeout(()=>window.dispatchEvent(new HashChangeEvent(`hashchange`)),350)}catch(e){n&&(n.textContent=e.message)}finally{t.currentTarget.disabled=!1}}),document.querySelector(`#note-form`)?.addEventListener(`submit`,async t=>{t.preventDefault();let n=document.querySelector(`#note-text`),r=document.querySelector(`#note-save-button`),a=document.querySelector(`#note-message`),o=n?.value?.trim()||``;if(!o){a&&(a.textContent=`Wpisz treść notatki.`);return}try{r&&(r.disabled=!0),a&&(a.textContent=`Zapisuję notatkę...`),await Ct({orderId:e.id,customerId:e.customerId||``,text:o,createdBy:i(),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}),await A({...e,noteCount:Number(e.noteCount||0)+1,updatedAt:new Date().toISOString()}),a&&(a.textContent=`Notatka zapisana.`),n&&(n.value=``),setTimeout(()=>window.dispatchEvent(new HashChangeEvent(`hashchange`)),350)}catch(e){a&&(a.textContent=e.message)}finally{r&&(r.disabled=!1)}})}function Qt(e={}){let t=`${e.fileKind||e.type||``} ${e.fileName||e.name||``}`.toLowerCase();return/voucher|bon|kupon/.test(t)?`▣`:/pdf/.test(t)?`▤`:/zdjęcie|zdjecie|image|jpg|jpeg|png|webp/.test(t)?`◫`:`▧`}function M(e=``){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}function N(e,t){return`<div class="info-row"><span>${e}</span><strong>${t}</strong></div>`}function P(e){return String(e||``).replaceAll(` `,``)}function $t(e){if(!e)return`-`;let t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleString(`pl-PL`,{day:`2-digit`,month:`2-digit`,year:`numeric`,hour:`2-digit`,minute:`2-digit`})}async function en({limit:e=100}={}){return D({collectionName:h.CUSTOMERS,loadFromLocalStore:()=>T(h.CUSTOMERS,{orderByField:`updatedAt`,limit:e}),loadDemo:()=>Ce(),modelFactory:Me})}async function tn(e){let t=Me(e);return O({collectionName:h.CUSTOMERS,documentId:t.id,data:t,saveDirect:()=>E(h.CUSTOMERS,t.id,t)})}async function nn(){let e=await en({limit:100});return`
    <div class="page">
      <div class="page-title compact-title">
        <div>
          <h1>Klienci</h1>
          <p>Widok klientów jest zasilany przez repozytorium. Pełna wyszukiwarka będzie w następnym etapie.</p>
        </div>
      </div>
      <section class="panel customer-panel">
        ${e.length?`
          <div class="customer-list">
            ${e.map(e=>`
              <article class="customer-card">
                <div>
                  <strong>${e.name}</strong>
                  <p>${e.address||e.city||`-`}</p>
                  <small>Ostatnie zlecenie #${e.lastOrderId||e.lastOrder||`-`} · ${e.lastTopic||`-`}</small>
                </div>
                <div class="customer-actions">
                  <a href="tel:${String(e.phone||``).replaceAll(` `,``)}">☎</a>
                  <span>${e.ordersCount||0} zlec.</span>
                </div>
              </article>
            `).join(``)}
          </div>
        `:m({title:`Brak klientów`,text:`Klienci pojawią się po synchronizacji zleceń albo po wgraniu danych demo lokalnie.`})}
      </section>
    </div>
  `}async function rn(){let e=await bt({limit:100});return`
    <div class="page">
      <div class="page-title compact-title">
        <div>
          <h1>Historia</h1>
          <p>Historia pokazuje zdarzenia zleceń w jednym wspólnym widoku.</p>
        </div>
      </div>
      <section class="panel history-panel">
        ${e.length?`
          <div class="timeline">
            ${e.map(e=>`
              <article>
                <span class="timeline-dot"></span>
                <div>
                  <strong>#${e.orderId} · ${e.title}</strong>
                  <small>${e.date||an(e.createdAt)} · ${e.author||`-`}</small>
                  <p>${e.text||``}</p>
                </div>
              </article>
            `).join(``)}
          </div>
        `:m({title:`Brak historii`,text:`Historia pojawi się po synchronizacji zleceń.`})}
      </section>
    </div>
  `}function an(e){if(!e)return`-`;let t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleString(`pl-PL`,{day:`2-digit`,month:`2-digit`,year:`numeric`,hour:`2-digit`,minute:`2-digit`})}var on=`telmor-local-notification`;async function sn(){let e=await ut({id:`local-test-${Date.now()}`,type:`local_test`,title:`Test lokalnego powiadomienia`,body:`To powiadomienie powstało tylko w otwartej aplikacji.`,read:!1,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});return ln(e),e}async function cn(){return sn()}function ln(e){typeof window>`u`||window.dispatchEvent(new CustomEvent(on,{detail:e}))}async function un(){let e=await lt({limit:50});return setTimeout(()=>dn(),0),`
    <div class="page">
      <div class="page-title compact-title">
        <div>
          <h1>Powiadomienia</h1>
          <p>Powiadomienia działają tylko w otwartej aplikacji i są zapisywane lokalnie.</p>
        </div>
        <button id="local-notification-test-button" class="primary-button" type="button">Test lokalny</button>
      </div>
      <section class="panel">
        ${e.length?`
          <div class="notification-list full">
            ${e.map(e=>`
              <article>
                <span class="dot ${e.tone||fn(e.type)}"></span>
                <div><strong>${mn(e.title)}</strong><small>${mn(e.body||e.note||``)}</small></div>
                <time>${pn(e.createdAt)}</time>
              </article>
            `).join(``)}
          </div>
        `:m({title:`Brak powiadomień`,text:`Powiadomienia pojawią się po lokalnym teście albo po zmianach wykonanych w otwartej aplikacji.`})}
        <div id="notifications-message" class="settings-message" role="status"></div>
      </section>
    </div>
  `}function dn(){let e=document.querySelector(`#local-notification-test-button`),t=document.querySelector(`#notifications-message`);e?.addEventListener(`click`,async()=>{e.disabled=!0,t&&(t.textContent=`Tworzenie lokalnego powiadomienia...`,t.dataset.tone=`info`);try{await cn(),t&&(t.textContent=`Dodano lokalne powiadomienie. Odświeżono listę.`,t.dataset.tone=`success`),setTimeout(()=>window.dispatchEvent(new HashChangeEvent(`hashchange`)),250)}catch(e){t&&(t.textContent=e.message,t.dataset.tone=`error`)}finally{e.disabled=!1}})}function fn(e){return e===`message`?`orange`:e===`status_changed`?`purple`:`blue`}function pn(e){if(!e)return`-`;let t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleDateString(`pl-PL`,{day:`2-digit`,month:`2-digit`})}function mn(e=``){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}var F={appName:`Telmor Praca`,versionLabel:`14.0 - 2006261708`,stageLabel:`Etap 14: diagnostyka, stabilizacja i przygotowanie PROD.`};async function hn(e){let t=ze(e);return O({collectionName:h.SYNC_STATE,documentId:t.id,data:t,saveDirect:()=>E(h.SYNC_STATE,t.id,t)})}async function gn(){let e=await st(_),t=[],n=[],r=[];for(let e of Ce())t.push(await tn(e));for(let e of we())n.push(await xt(e));for(let e of ye)r.push(await ut(e));return await hn({id:`main`,lastFullSyncAt:new Date().toISOString(),lastError:``}),{orders:e.length,customers:t.length,history:n.length,notifications:r.length}}var _n=`telmor_credentials_v1`,vn=`telmor_device_secret_v1`,yn=new TextEncoder,bn=new TextDecoder;function I(){return!!(window.crypto?.subtle&&window.crypto?.getRandomValues&&window.indexedDB)}async function xn({login:e,password:t,rememberSession:n=!0}){if(!I())throw Error(`Ta przeglądarka nie obsługuje wymaganego lokalnego sejfu.`);let r=String(e||``).trim(),i=String(t||``);if(!r)throw Error(`Podaj login Telmor.`);if(!i)throw Error(`Podaj hasło Telmor.`);let a=await En(),o=window.crypto.getRandomValues(new Uint8Array(12)),s=JSON.stringify({login:r,password:i,rememberSession:!!n,savedAt:new Date().toISOString()}),c=await window.crypto.subtle.encrypt({name:`AES-GCM`,iv:o},a,yn.encode(s)),l={version:1,algorithm:`AES-GCM`,iv:Dn(o),data:Dn(c),loginHint:r,rememberSession:!!n,savedAt:new Date().toISOString()};return await S(_n,l),{login:r,rememberSession:!!n,savedAt:l.savedAt}}async function Sn(){if(!I())throw Error(`Ta przeglądarka nie obsługuje wymaganego lokalnego sejfu.`);let e=await C(_n);if(!e)return null;let t=await En(),n=On(e.iv),r=On(e.data);try{let e=await window.crypto.subtle.decrypt({name:`AES-GCM`,iv:n},t,r);return JSON.parse(bn.decode(e))}catch{throw Error(`Nie udało się odszyfrować zapisanych danych Telmor na tym urządzeniu.`)}}async function Cn(){let e=await C(_n);return e?{exists:!0,supported:I(),loginHint:e.loginHint||``,savedAt:e.savedAt||null,rememberSession:!!e.rememberSession}:{exists:!1,supported:I(),loginHint:``,savedAt:null,rememberSession:!0}}async function wn(){return await Ge(_n),!0}async function Tn(){let e=await Sn();if(!e?.login||!e?.password)throw Error(`Brak kompletnych danych logowania Telmor.`);return{login:e.login,passwordLength:e.password.length,rememberSession:e.rememberSession,savedAt:e.savedAt}}async function En(){let e=localStorage.getItem(vn);if(e){let t=On(e);return window.crypto.subtle.importKey(`raw`,t,`AES-GCM`,!1,[`encrypt`,`decrypt`])}let t=window.crypto.getRandomValues(new Uint8Array(32));return localStorage.setItem(vn,Dn(t)),window.crypto.subtle.importKey(`raw`,t,`AES-GCM`,!1,[`encrypt`,`decrypt`])}function Dn(e){let t=e instanceof Uint8Array?e:new Uint8Array(e),n=``;return t.forEach(e=>{n+=String.fromCharCode(e)}),btoa(n)}function On(e){let t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;e+=1)n[e]=t.charCodeAt(e);return n}var kn=`telmor_session_state_v1`;function An(e){let t={loggedIn:!!e?.loggedIn,lastCheckAt:e?.lastCheckAt||new Date().toISOString(),message:e?.message||``};return sessionStorage.setItem(kn,JSON.stringify(t)),t}function jn(){let e=sessionStorage.getItem(kn);if(!e)return{loggedIn:!1,lastCheckAt:null,message:`Sesja Telmor nie była jeszcze sprawdzana.`};try{return JSON.parse(e)}catch{return sessionStorage.removeItem(kn),{loggedIn:!1,lastCheckAt:null,message:`Stan sesji był uszkodzony i został wyczyszczony.`}}}function Mn(){sessionStorage.removeItem(kn)}var Nn=`sync:conflicts:v1`;async function Pn(){let e=await C(Nn);return Array.isArray(e)?e:[]}async function Fn(e){await S(Nn,(await Pn()).filter(t=>t.conflictId!==e))}async function In(){await S(Nn,[])}var Ln=`sync:deviceIdentity:v1`;async function Rn(){let e=await C(Ln);if(e?.deviceId)return Bn(e);let t=Bn({deviceId:Vn(),name:Un(),platform:Hn(),createdAt:new Date().toISOString(),lastSeenAt:new Date().toISOString()});return await S(Ln,t),t}async function zn(e={}){let t=Bn({...await Rn(),...e,lastSeenAt:new Date().toISOString()});return await S(Ln,t),t}function Bn(e={}){return{deviceId:e.deviceId||Vn(),name:e.name||Un(),platform:e.platform||Hn(),createdAt:e.createdAt||new Date().toISOString(),lastSeenAt:e.lastSeenAt||new Date().toISOString()}}function Vn(){return`device-${crypto?.randomUUID?.()||Math.random().toString(36).slice(2)}`}function Hn(){let e=navigator.userAgent||``;return/Android/i.test(e)?`Android`:/iPhone|iPad/i.test(e)?`iOS`:/Windows/i.test(e)?`Windows`:/Macintosh/i.test(e)?`macOS`:/Linux/i.test(e)?`Linux`:`Web`}function Un(){let e=Hn();return e===`Android`||e===`iOS`?`Telefon ${e}`:e===`Windows`||e===`macOS`||e===`Linux`?`Komputer ${e}`:`Urządzenie web`}var Wn=`sync:pendingQueue:v1`;async function Gn(){let e=await C(Wn);return Array.isArray(e)?e:[]}async function Kn(e=[]){await S(Wn,Array.isArray(e)?e:[])}async function qn(){await Kn([])}async function Jn(){let e=await Gn();return{count:e.length,oldestAt:e[0]?.createdAt||``,newestAt:e[e.length-1]?.createdAt||``,lastError:e.find(e=>e.lastError)?.lastError||``}}var Yn=Object.freeze([h.ORDERS,h.CUSTOMERS,h.ORDER_HISTORY,h.ATTACHMENTS,h.NOTES,h.NOTIFICATIONS,h.SYNC_STATE]);async function Xn(){return{saved:!0,device:await zn({lastSeenAt:new Date().toISOString()}),message:`Urządzenie zapisane lokalnie w tej przeglądarce.`}}async function Zn(){return[{collectionName:`local`,count:0,message:`Brak zewnętrznej chmury. Dane są lokalne.`}]}async function Qn(){let e=await Jn();return await qn(),{attempted:e.count,sent:0,conflicts:0,left:0,message:`Wyczyszczono lokalną kolejkę. Ta wersja nie wysyła danych do zewnętrznej chmury.`}}async function $n(){let e=new Date().toISOString();await Xn();let t=await Qn(),n=await Zn(),r=new Date().toISOString();return await hn(ze({id:_e,deviceId:(await Rn()).deviceId,lastFullSyncAt:r,lastError:``})),{startedAt:e,endedAt:r,pushed:t,pulled:n}}async function er(e){let t=(await Pn()).find(t=>t.conflictId===e);if(!t)throw Error(`Nie znaleziono konfliktu.`);return await Fn(e),t.localDoc}async function tr(e){let t=(await Pn()).find(t=>t.conflictId===e);if(!t)throw Error(`Nie znaleziono konfliktu.`);return await Fn(e),t.remoteDoc||t.localDoc}async function nr(){let e=await Rn(),t=await Jn(),n=await Ze(Yn),r=await Pn();return{localStoreActive:!1,remoteActive:!1,localOnly:!0,online:typeof navigator>`u`?!0:navigator.onLine,device:e,queue:t,cache:n,conflicts:r,collections:Yn}}function rr(){return setTimeout(()=>{ir(),ar(),or(),sr()},0),`
    <div class="page">
      <div class="page-title compact-title">
        <div>
          <h1>Ustawienia</h1>
          <p>${F.stageLabel}</p>
        </div>
      </div>
      <section class="settings-grid">
        <article class="panel">
          <h2>Konto aplikacji</h2>
          <p><strong>Zalogowano jako:</strong> ${lr(i())}</p>
          <p><strong>Tryb:</strong> ${lr(a())}</p>
          <p class="muted">To konto istnieje tylko lokalnie w tej przeglądarce.</p>
          <button id="logout-button" class="danger-button" type="button">Wyjdź z aplikacji</button>
        </article>

        <article class="panel settings-wide-panel">
          <div class="panel-header settings-panel-header">
            <div>
              <h2>Lokalny sejf Telmor</h2>
              <p class="muted">Login i hasło Telmor są zapisywane tylko na tym urządzeniu.</p>
            </div>
            <span id="vault-status-badge" class="local-status-badge">Sprawdzanie</span>
          </div>

          <form id="telmor-credentials-form" class="settings-form">
            <label for="telmor-login">Login Telmor</label>
            <input id="telmor-login" name="login" type="text" autocomplete="username" />

            <label for="telmor-password">Hasło Telmor</label>
            <input id="telmor-password" name="password" type="password" autocomplete="current-password" />

            <label class="checkbox-row">
              <input id="remember-session" type="checkbox" checked />
              <span>Pamiętaj lokalny status sesji</span>
            </label>

            <div class="button-row">
              <button class="primary-button" type="submit">Zapisz lokalnie</button>
              <button id="load-telmor-credentials-button" class="secondary-button" type="button">Odczytaj</button>
              <button id="verify-telmor-credentials-button" class="secondary-button" type="button">Sprawdź sejf</button>
              <button id="delete-telmor-credentials-button" class="danger-button" type="button">Usuń dane</button>
            </div>
          </form>

          <div class="local-session-box">
            <p><strong>Status sesji:</strong> <span id="telmor-session-status">-</span></p>
            <div class="button-row">
              <button id="mark-session-active-button" class="secondary-button" type="button">Oznacz jako aktywną</button>
              <button id="clear-session-button" class="secondary-button" type="button">Wyczyść status sesji</button>
            </div>
          </div>
          <div id="telmor-vault-message" class="settings-message" role="status"></div>
        </article>

        <article class="panel">
          <h2>Synchronizacja</h2>
          <p class="muted">Ta wersja nie synchronizuje danych z zewnętrzną chmurą. Dane są lokalne.</p>
          <p><strong>Status:</strong> <span id="settings-sync-status">Sprawdzanie...</span></p>
          <p><strong>Kolejka:</strong> <span id="settings-sync-queue">-</span></p>
          <p><strong>Konflikty:</strong> <span id="settings-sync-conflicts">-</span></p>
          <a href="#/sync" class="secondary-button full-width text-center-link">Otwórz ekran lokalnych danych</a>
        </article>

        <article class="panel">
          <h2>Powiadomienia</h2>
          <p class="muted">Powiadomienia są tylko wpisami w aplikacji. Nie ma powiadomień w tle po zamknięciu programu.</p>
          <a href="#/notifications" class="secondary-button full-width text-center-link">Otwórz powiadomienia</a>
        </article>

        <article class="panel">
          <h2>Diagnostyka</h2>
          <p class="muted">Sprawdzenie gotowości PWA, lokalnej bazy, sejfu i konfiguracji pod GitHub Pages.</p>
          <a href="#/diagnostics" class="secondary-button full-width text-center-link">Otwórz diagnostykę</a>
        </article>

        <article class="panel demo-data-panel">
          <h2>Dane testowe</h2>
          <p class="muted">Wgrywa przykładowe zlecenia, klientów, historię i powiadomienia do lokalnej bazy przeglądarki.</p>
          <button id="seed-demo-data-button" class="primary-button" type="button">Wgraj dane demo lokalnie</button>
          <div id="demo-data-message" class="settings-message" role="status"></div>
        </article>

        <article class="panel">
          <h2>Informacje o aplikacji</h2>
          <p><strong>Wersja:</strong> ${F.versionLabel}</p>
          <p><strong>Status:</strong> PWA lokalne pod GitHub Pages.</p>
          <p class="muted">Do publikacji użyj <code>npm run build</code>, a katalog <code>dist</code> można opublikować na GitHub Pages.</p>
        </article>
      </section>
    </div>
  `}function ir(){document.querySelector(`#logout-button`)?.addEventListener(`click`,()=>{u()})}function ar(){let e=document.querySelector(`#telmor-credentials-form`),t=document.querySelector(`#telmor-login`),n=document.querySelector(`#telmor-password`),r=document.querySelector(`#remember-session`),i=document.querySelector(`#load-telmor-credentials-button`),a=document.querySelector(`#verify-telmor-credentials-button`),o=document.querySelector(`#delete-telmor-credentials-button`),s=document.querySelector(`#telmor-vault-message`),c=document.querySelector(`#vault-status-badge`),l=document.querySelector(`#telmor-session-status`),u=document.querySelector(`#mark-session-active-button`),d=document.querySelector(`#clear-session-button`),f=(e,t=`info`)=>{s&&(s.textContent=e,s.dataset.tone=t)},p=()=>{let e=jn();l&&(l.textContent=e.loggedIn?`aktywny lokalnie, ostatnio: ${cr(e.lastCheckAt)}`:e.message)},ee=async()=>{if(!I()){c.textContent=`Brak obsługi`,c.dataset.tone=`error`,f(`Ta przeglądarka nie obsługuje pełnego lokalnego sejfu.`,`error`);return}let e=await Cn();e.exists?(c.textContent=`Zapisane lokalnie`,c.dataset.tone=`success`,t.value=e.loginHint||``,n.value=``,r.checked=e.rememberSession,f(`Dane Telmor są zapisane lokalnie. Zapis: ${cr(e.savedAt)}.`,`success`)):(c.textContent=`Brak danych`,c.dataset.tone=`warning`,f(`Brak zapisanych danych Telmor na tym urządzeniu.`,`info`))};e?.addEventListener(`submit`,async e=>{e.preventDefault(),f(`Zapisywanie lokalne...`,`info`);try{await xn({login:t.value,password:n.value,rememberSession:r.checked}),n.value=``,await ee(),f(`Dane Telmor zapisane lokalnie na tym urządzeniu.`,`success`)}catch(e){f(e.message,`error`)}}),i?.addEventListener(`click`,async()=>{f(`Odczytywanie lokalne...`,`info`);try{let e=await Tn();t.value=e.login,r.checked=e.rememberSession,f(`Odczyt poprawny. Hasło istnieje lokalnie, długość: ${e.passwordLength} znaków.`,`success`)}catch(e){f(e.message,`error`)}}),a?.addEventListener(`click`,async()=>{f(`Sprawdzanie lokalnego sejfu...`,`info`);try{f(`Sejf działa. Zapisany login: ${(await Tn()).login}. Hasło nie jest pokazywane.`,`success`)}catch(e){f(e.message,`error`)}}),o?.addEventListener(`click`,async()=>{if(window.confirm(`Usunąć lokalnie zapisane dane logowania Telmor z tego urządzenia?`)){f(`Usuwanie...`,`info`);try{await wn(),t.value=``,n.value=``,r.checked=!0,await ee(),f(`Dane Telmor zostały usunięte z lokalnego sejfu.`,`success`)}catch(e){f(e.message,`error`)}}}),u?.addEventListener(`click`,()=>{An({loggedIn:!0,message:`Sesja oznaczona lokalnie jako aktywna.`}),p()}),d?.addEventListener(`click`,()=>{Mn(),p()}),p(),ee().catch(e=>f(e.message,`error`))}function or(){let e=document.querySelector(`#seed-demo-data-button`),t=document.querySelector(`#demo-data-message`),n=(e,n=`info`)=>{t&&(t.textContent=e,t.dataset.tone=n)};e?.addEventListener(`click`,async()=>{if(window.confirm(`Wgrać dane demonstracyjne do lokalnej bazy tej przeglądarki?`)){e.disabled=!0,n(`Zapisywanie danych demo lokalnie...`,`info`);try{let e=await gn();n(`Zapisano: ${e.orders} zleceń, ${e.customers} klientów, ${e.history} wpisów historii, ${e.notifications} powiadomienia.`,`success`)}catch(e){n(e.message,`error`)}finally{e.disabled=!1}}})}async function sr(){let e=document.querySelector(`#settings-sync-status`),t=document.querySelector(`#settings-sync-queue`),n=document.querySelector(`#settings-sync-conflicts`);if(!(!e||!t||!n))try{let r=await nr();e.textContent=r.localOnly?`tylko lokalnie`:`aktywny zapis zewnętrzny`,t.textContent=`${r.queue.count} zmian lokalnych`,n.textContent=`${r.conflicts.length} konfliktów`}catch(r){e.textContent=r.message,t.textContent=`-`,n.textContent=`-`}}function cr(e){if(!e)return`brak daty`;let t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleString(`pl-PL`,{year:`numeric`,month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`})}function lr(e=``){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}function ur(){return`
    <div class="page">
      <section class="empty-panel">
        <h1>Nie znaleziono ekranu</h1>
        <p>Wróć do dashboardu.</p>
        <a href="#/dashboard" class="primary-link">Dashboard</a>
      </section>
    </div>
  `}function L(e=``){let t=v(e),n=y(e),r=Te(e),i=t.split(` `).filter(Boolean);return{raw:String(e||``).trim(),normalized:t,compact:n,phone:r,words:i}}function dr(e={},t=``,n={}){let r=typeof t==`object`?t:L(t);if(!r.raw)return{score:0,reasons:[]};let i=0,a=[];Object.entries(n).forEach(([t,n])=>{let o=vr(e,t),s=v(o),c=y(o),l=Te(o);if(!s&&!c&&!l)return;if(r.normalized&&s===r.normalized){i+=n*12,a.push(`dokładnie: ${R(t)}`);return}if(r.compact&&c===r.compact){i+=n*10,a.push(`dokładnie: ${R(t)}`);return}if(r.phone&&l&&l.includes(r.phone)){i+=n*9,a.push(`telefon: ${R(t)}`);return}r.normalized&&s.includes(r.normalized)&&(i+=n*7,a.push(`zawiera: ${R(t)}`)),r.compact&&c.includes(r.compact)&&(i+=n*5,a.push(`skrót: ${R(t)}`));let u=pr(r.words,s);u>0&&(i+=n*u,a.push(`słowa: ${R(t)}`))});let o=mr(e.searchTokens,r);return o>0&&(i+=o,a.push(`indeks wyszukiwania`)),{score:i,reasons:[...new Set(a)].slice(0,3)}}function fr(e=[]){return e.filter(e=>e.score>0).sort((e,t)=>t.score===e.score?String(t.updatedAt||t.createdAt||``).localeCompare(String(e.updatedAt||e.createdAt||``)):t.score-e.score)}function pr(e=[],t=``){if(!e.length||!t)return 0;let n=0;return e.forEach(e=>{if(e){if(t.split(` `).includes(e)){n+=3;return}if(t.includes(e)){n+=2;return}e.length>=4&&hr(e,t)&&(n+=1)}}),n}function mr(e=[],t){if(!Array.isArray(e)||!e.length)return 0;let n=e.map(e=>v(e)).filter(Boolean),r=e.map(e=>y(e)).filter(Boolean);if(t.normalized&&n.includes(t.normalized))return 22;if(t.compact&&r.includes(t.compact))return 18;let i=0;return t.words.forEach(e=>{n.includes(e)?i+=8:n.some(t=>t.includes(e))?i+=4:e.length>=4&&n.some(t=>gr(e,t))&&(i+=2)}),i}function hr(e,t){return t.split(` `).filter(e=>e.length>=4).some(t=>gr(e,t))}function gr(e,t){let n=Math.max(e.length,t.length)>=7?2:1;return _r(e,t)<=n}function _r(e,t){if(e===t)return 0;if(!e)return t.length;if(!t)return e.length;let n=Array.from({length:t.length+1},(e,t)=>t),r=Array(t.length+1);for(let i=1;i<=e.length;i+=1){r[0]=i;for(let a=1;a<=t.length;a+=1){let o=e[i-1]===t[a-1]?0:1;r[a]=Math.min(r[a-1]+1,n[a]+1,n[a-1]+o)}n.splice(0,n.length,...r)}return n[t.length]}function vr(e,t){return t.split(`.`).reduce((e,t)=>e&&e[t]!==void 0?e[t]:``,e)}function R(e){return{number:`numer`,customerName:`klient`,clientName:`klient`,name:`klient`,phone:`telefon`,city:`miasto`,location:`lokalizacja`,address:`adres`,status:`status`,topic:`temat`,shortTopic:`temat`,voucher:`voucher`,title:`historia`,text:`treść`,author:`autor`}[e]||e}var yr={name:12,phone:12,city:8,address:8,street:7,houseNumber:4,lastOrderId:5,lastTopic:5};async function br(e,{limit:t=50}={}){let n=L(e),r=await en({limit:300});return n.raw?fr(r.map(e=>{let t=dr(e,n,yr);return{...e,...t}})).slice(0,t):r.slice(0,t).map(e=>({...e,score:0,reasons:[]}))}var xr={orderId:10,customerName:8,title:7,text:8,author:5,topic:5,attachmentName:5};async function Sr(e,{limit:t=50}={}){let n=L(e),r=await bt({limit:300});return n.raw?fr(r.map(e=>{let t=dr(e,n,xr);return{...e,...t}})).slice(0,t):r.slice(0,t).map(e=>({...e,score:0,reasons:[]}))}var Cr={orderId:6,fileName:8,displayName:8,fileKind:5,description:4,sourceUrl:2};async function wr(e,{limit:t=50}={}){let n=L(e);if(!n.raw)return[];let r=await k({mode:`all`,limit:250});return fr((await Promise.all(r.map(e=>kt(e.id)))).flat().map(e=>({...e,...dr(e,n,Cr)}))).slice(0,t)}var Tr={number:14,customerName:10,clientName:10,phone:11,city:7,location:7,address:6,status:5,topic:8,shortTopic:8,voucher:9,assignee:3,description:3};async function Er(e,{status:t=`all`,limit:n=60}={}){let r=L(e),i=(await k({mode:`all`,limit:300})).filter(e=>t===`open`?e.status!==g.CLOSED&&e.status!==`Zamknięte`:t===`closed`?e.status===g.CLOSED||e.status===`Zamknięte`:t===`voucher`?!!e.hasVoucher||String(e.voucher||``).trim().length>3:t===`needsVoucher`?!e.hasVoucher&&String(e.voucher||``).toLowerCase().includes(`sprawdzenia`):!0);return r.raw?fr(i.map(e=>{let t=dr(e,r,Tr);return{...e,...t}})).slice(0,n):i.slice(0,n).map(e=>({...e,score:0,reasons:[]}))}async function Dr(e,{type:t=`all`,status:n=`all`}={}){let[r,i,a,o]=await Promise.all([t===`all`||t===`orders`?Er(e,{status:n,limit:60}):Promise.resolve([]),t===`all`||t===`customers`?br(e,{limit:50}):Promise.resolve([]),t===`all`||t===`history`?Sr(e,{limit:50}):Promise.resolve([]),t===`all`||t===`attachments`?wr(e,{limit:50}):Promise.resolve([])]);return{orders:r,customers:i,history:a,attachments:o,total:r.length+i.length+a.length+o.length}}var Or=[[`all`,`Wszystko`],[`orders`,`Zlecenia`],[`customers`,`Klienci`],[`history`,`Historia`],[`attachments`,`Załączniki`]],kr=[[`all`,`Wszystkie`],[`open`,`Otwarte`],[`closed`,`Zamknięte`],[`voucher`,`Z voucherem`],[`needsVoucher`,`Voucher do sprawdzenia`]];async function Ar(e=new URLSearchParams){let t=e.get(`q`)||``,n=e.get(`type`)||`all`,r=e.get(`status`)||`all`,i=await Dr(t,{type:n,status:r});return`
    <div class="page search-page">
      <div class="page-title compact-title">
        <div>
          <h1>Wyszukiwarka</h1>
          <p>Jedno miejsce do szukania po numerze zlecenia, kliencie, telefonie, mieście, statusie, voucherze, historii i załącznikach.</p>
        </div>
      </div>

      <section class="panel search-main-panel">
        <form id="search-page-form" class="search-main-form" autocomplete="off">
          <span aria-hidden="true">⌕</span>
          <input id="search-page-input" name="q" type="search" value="${B(t)}" placeholder="Wpisz numer, klienta, telefon, miasto, temat, voucher..." autofocus />
          <button class="primary-button" type="submit">Szukaj</button>
        </form>

        <div class="search-filter-group">
          <span>Zakres:</span>
          <div class="chip-row no-margin">
            ${Or.map(([e,i])=>Br({q:t,type:e,status:r,active:e===n,label:i})).join(``)}
          </div>
        </div>

        <div class="search-filter-group">
          <span>Status zleceń:</span>
          <div class="chip-row no-margin">
            ${kr.map(([e,i])=>Br({q:t,type:n,status:e,active:e===r,label:i})).join(``)}
          </div>
        </div>
      </section>

      ${t?Mr(t,i):Nr()}

      ${t?Pr(i,n):``}
    </div>
  `}function jr(){let e=document.querySelector(`#search-page-form`),t=document.querySelector(`#search-page-input`);!e||!t||(t.focus({preventScroll:!0}),t.setSelectionRange(t.value.length,t.value.length),e.addEventListener(`submit`,e=>{e.preventDefault();let n=new URLSearchParams(window.location.hash.split(`?`)[1]||``),r=t.value.trim();r?n.set(`q`,r):n.delete(`q`),window.location.hash=`#/search?${n.toString()}`}))}function Mr(e,t){return`
    <section class="search-summary-grid">
      <article class="stat-card stat-blue">
        <div><span>Wyniki razem</span><strong>${t.total}</strong><small>${B(e)}</small></div><i>⌕</i>
      </article>
      <article class="stat-card stat-orange">
        <div><span>Zlecenia</span><strong>${t.orders.length}</strong><small>numery, statusy, vouchery</small></div><i>▣</i>
      </article>
      <article class="stat-card stat-purple">
        <div><span>Klienci</span><strong>${t.customers.length}</strong><small>nazwy, telefony, adresy</small></div><i>♙</i>
      </article>
      <article class="stat-card stat-green">
        <div><span>Pliki</span><strong>${t.attachments.length}</strong><small>vouchery i załączniki</small></div><i>▧</i>
      </article>
    </section>
  `}function Nr(){return`
    <section class="search-start-grid">
      <article class="panel">
        <h2>Co można wpisać?</h2>
        <div class="hint-grid">
          ${[`104750`,`Mielec`,`731021410`,`voucher`,`internet`,`Wolak`,`awaria`,`zamknięte`].map(e=>`
            <a href="#/search?q=${encodeURIComponent(e)}" class="hint-chip">${B(e)}</a>
          `).join(``)}
        </div>
      </article>
      <article class="panel">
        <h2>Jak działa etap 7?</h2>
        <p class="muted">Na razie wyszukiwarka działa po danych dostępnych w aplikacji: danych demo albo lokalnego cache. Szuka lokalnie po pobranych rekordach, z normalizacją polskich znaków, telefonu i prostą tolerancją literówek.</p>
      </article>
    </section>
  `}function Pr(e,t){return e.total?`
    <div class="search-results-stack">
      ${t===`all`||t===`orders`?Fr(e.orders):``}
      ${t===`all`||t===`customers`?Lr(e.customers):``}
      ${t===`all`||t===`history`?Rr(e.history):``}
      ${t===`all`||t===`attachments`?zr(e.attachments):``}
    </div>
  `:m({title:`Brak wyników`,text:`Zmień frazę, usuń filtr albo wpisz sam numer telefonu/zlecenia.`})}function Fr(e){return e.length?`
    <section class="panel search-result-panel">
      <div class="panel-header">
        <h2>Zlecenia</h2>
        <span class="result-count">${e.length}</span>
      </div>
      <div class="desktop-only-block order-list">
        ${e.map(e=>Ir(e)).join(``)}
      </div>
      <div class="mobile-only">
        ${me({orders:e,mode:`search`})}
      </div>
    </section>
  `:``}function Ir(e){return`
    <div class="search-result-row-wrap">
      ${pe(e)}
      ${z(e.reasons)}
    </div>
  `}function Lr(e){return e.length?`
    <section class="panel search-result-panel">
      <div class="panel-header">
        <h2>Klienci</h2>
        <span class="result-count">${e.length}</span>
      </div>
      <div class="customer-list">
        ${e.map(e=>`
          <article class="customer-card search-customer-card">
            <div>
              <strong>${B(e.name)}</strong>
              <p>${B(e.address||e.city||`-`)}</p>
              <small>Ostatnie zlecenie #${B(e.lastOrderId||e.lastOrder||`-`)} · ${B(e.lastTopic||`-`)}</small>
              ${z(e.reasons)}
            </div>
            <div class="customer-actions">
              <a href="tel:${String(e.phone||``).replaceAll(` `,``)}" aria-label="Zadzwoń">☎</a>
              <span>${B(e.phone||`-`)}</span>
            </div>
          </article>
        `).join(``)}
      </div>
    </section>
  `:``}function Rr(e){return e.length?`
    <section class="panel search-result-panel">
      <div class="panel-header">
        <h2>Historia</h2>
        <span class="result-count">${e.length}</span>
      </div>
      <div class="timeline search-timeline">
        ${e.map(e=>`
          <article>
            <span class="timeline-dot"></span>
            <div>
              <strong><a href="#/order/${Hr(e.orderId)}?tab=history">#${B(e.orderId)} · ${B(e.title||`Wpis historii`)}</a></strong>
              <small>${B(e.date||Vr(e.createdAt))} · ${B(e.author||`-`)}</small>
              <p>${B(e.text||``)}</p>
              ${z(e.reasons)}
            </div>
          </article>
        `).join(``)}
      </div>
    </section>
  `:``}function zr(e){return e.length?`
    <section class="panel search-result-panel">
      <div class="panel-header">
        <h2>Załączniki</h2>
        <span class="result-count">${e.length}</span>
      </div>
      <div class="attachment-list">
        ${e.map(e=>`
          <article>
            <span class="file-icon">▧</span>
            <div>
              <strong><a href="#/order/${Hr(e.orderId)}?tab=attachments">${B(e.displayName||e.fileName||`-`)}</a></strong>
              <small>#${B(e.orderId)} · ${B(e.fileKind||`Plik`)} · ${B(e.sizeLabel||`-`)}</small>
              ${z(e.reasons)}
            </div>
          </article>
        `).join(``)}
      </div>
    </section>
  `:``}function z(e=[]){return!Array.isArray(e)||!e.length?``:`<div class="match-reasons">${e.map(e=>`<span>${B(e)}</span>`).join(``)}</div>`}function Br({q:e,type:t,status:n,active:r,label:i}){let a=new URLSearchParams;return e&&a.set(`q`,e),t&&t!==`all`&&a.set(`type`,t),n&&n!==`all`&&a.set(`status`,n),`<a class="chip ${r?`active`:``}" href="#/search?${a.toString()}">${B(i)}</a>`}function Vr(e){if(!e)return`-`;let t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleString(`pl-PL`,{day:`2-digit`,month:`2-digit`,year:`numeric`,hour:`2-digit`,minute:`2-digit`})}function B(e=``){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}function Hr(e=``){return encodeURIComponent(String(e))}async function Ur(){let e=await Cn(),t=jn();return{vaultSupported:I(),credentialsSaved:!!e.exists,loginHint:e.loginHint||``,credentialsSavedAt:e.savedAt||``,rememberSession:!!e.rememberSession,sessionActive:!!t.loggedIn,sessionLastCheckAt:t.lastCheckAt||``,sessionMessage:t.message||``,readyForManualImport:!0,readyForLiveSync:!!e.exists}}async function Wr(){let e=await Tn();return{ok:!0,login:e.login,passwordLength:e.passwordLength,rememberSession:e.rememberSession,savedAt:e.savedAt}}var Gr={name:`play.telmor.pl SelfService`,baseUrl:`https://play.telmor.pl/SelfService/`,sourceSystem:`telmor-selfservice`},V={OPEN_ORDERS:`open-orders`,CLOSED_ORDERS:`closed-orders`,ORDER_DETAILS:`order-details`,AUTO:`auto`},Kr={[V.OPEN_ORDERS]:`Otwarte zlecenia`,[V.CLOSED_ORDERS]:`Zamknięte zlecenia`,[V.ORDER_DETAILS]:`Szczegóły zlecenia`,[V.AUTO]:`Automatyczne rozpoznanie`};function qr(e={},t={}){let n=H(e,[`number`,`nr`,`orderNumber`,`zlecenie`,`numerZlecenia`,`id`])||Zr(e),r=Xr(H(e,[`status`,`stan`])||t.defaultStatus||``),i=H(e,[`customerName`,`klient`,`abonent`,`name`,`nazwa`]),a=H(e,[`phone`,`telefon`,`tel`,`contact`]),o=H(e,[`city`,`miasto`,`miejscowosc`,`lokalizacja`]),s=H(e,[`address`,`adres`,`ulica`]),c=H(e,[`topic`,`temat`,`opis`,`usluga`,`sprawa`,`problem`])||t.defaultTopic||`Zlecenie Telmor`,l=H(e,[`voucher`,`bon`,`kod`,`kupon`]),u=Qr(H(e,[`registeredAt`,`createdAt`,`dataZlecenia`,`data`,`utworzono`])),d=Qr(H(e,[`plannedAt`,`termin`,`planowanaData`])),f=Qr(H(e,[`doneAt`,`dataWykonania`,`wykonano`,`zamknieto`])),p=ke({name:i,phone:a,city:o});return je({id:Oe(n),number:n,sourceSystem:Gr.sourceSystem,sourceId:n,sourceStatus:H(e,[`status`,`stan`])||r,status:r,customerId:p,customerName:i,phone:a,city:o,location:o,address:s,topic:c,shortTopic:c,voucher:l,hasVoucher:!!(l&&l!==`-`),registeredAt:u,plannedAt:d,doneAt:f,createdAt:u||new Date().toISOString(),updatedAt:new Date().toISOString(),lastSyncAt:new Date().toISOString()})}function Jr(e={}){return Me({id:e.customerId,name:e.customerName,phone:e.phone,city:e.city,address:e.address,ordersCount:1,lastOrderId:e.id,lastTopic:e.topic,updatedAt:new Date().toISOString()})}function Yr(e={},t={}){return Ne({id:e.id||`${t.id||`telmor`}-${ei(`${e.date||``}-${e.author||``}-${e.text||``}`)}`,orderId:t.id||e.orderId||``,customerId:t.customerId||e.customerId||``,date:Qr(e.date)||new Date().toISOString(),title:e.title||e.type||`Wpis Telmor`,type:e.type||`telmor`,author:e.author||``,text:e.text||``,attachmentName:e.attachmentName||``})}function Xr(e=``){let t=$r(e);return t?t.includes(`zamkn`)||t.includes(`wykon`)||t.includes(`zakoncz`)?g.CLOSED:t.includes(`w toku`)||t.includes(`realiz`)?g.IN_PROGRESS:t.includes(`piln`)||t.includes(`awaria`)?g.URGENT:g.NEW:g.NEW}function H(e,t){for(let n of t)if(e[n]!==void 0&&e[n]!==null&&String(e[n]).trim())return String(e[n]).trim();return``}function Zr(e){let t=Object.values(e).join(` `).match(/\b\d{5,}\b/);return t?t[0]:`TELMOR-${Date.now()}`}function Qr(e=``){let t=String(e||``).trim();if(!t)return``;let n=t.match(/(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{2,4})(?:\s+(\d{1,2}):(\d{2}))?/);if(n){let[,e,t,r,i=`00`,a=`00`]=n;return`${(r.length===2?`20${r}`:r).padStart(4,`0`)}-${t.padStart(2,`0`)}-${e.padStart(2,`0`)}T${i.padStart(2,`0`)}:${a.padStart(2,`0`)}:00.000`}let r=new Date(t);return Number.isNaN(r.getTime())?t:r.toISOString()}function $r(e=``){return String(e).toLowerCase().normalize(`NFD`).replace(/[\u0300-\u036f]/g,``)}function ei(e=``){let t=0;for(let n=0;n<e.length;n+=1)t=(t<<5)-t+e.charCodeAt(n),t|=0;return Math.abs(t).toString(36)}var ti=[[/^(nr|numer|zlecenie|nr zlecenia|numer zlecenia|id)$/i,`number`],[/status|stan/i,`status`],[/klient|abonent|nazwa/i,`customerName`],[/telefon|tel\.?|kontakt/i,`phone`],[/miasto|miejscowo/i,`city`],[/adres|ulica/i,`address`],[/temat|opis|sprawa|usługa|usluga|problem/i,`topic`],[/voucher|bon|kupon|kod/i,`voucher`],[/data zlecenia|utworzono|zgłoszono|zgloszono|data rejestracji/i,`registeredAt`],[/termin|planowana/i,`plannedAt`],[/data wykonania|wykonano|zamknięto|zamknieto/i,`doneAt`],[/data/i,`registeredAt`]];function ni(e=``,t={}){let n=t.sourceType||V.AUTO,r=String(e||``).trim();if(!r)return hi(`Nie podano HTML do analizy.`);if(typeof DOMParser>`u`)return hi(`DOMParser nie jest dostępny w tym środowisku. Parser działa w przeglądarce.`);let i=new DOMParser().parseFromString(r,`text/html`),a=ii(i,n),o=a.length?[]:ai(i,n),s=a.length?a:o,c=fi(s.map(e=>qr(e,{defaultStatus:si(n)}))),l=pi(c.map(Jr).filter(e=>e.name||e.phone)),u=oi(i,c[0]),d=[];return c.length||d.push(`Nie znaleziono zleceń. Wklej pełny HTML strony listy albo szczegółów zlecenia.`),{ok:c.length>0,sourceType:n,parsedAt:new Date().toISOString(),orders:c,customers:l,history:u,warnings:d,stats:{rawRows:s.length,orders:c.length,customers:l.length,history:u.length,tables:i.querySelectorAll(`table`).length}}}function ri(e=``,t={}){let n=String(e||``).trim();if(!n)return hi(`Nie podano tekstu do analizy.`);let r=n.split(/\r?\n/).map(e=>e.trim()).filter(Boolean),i=[];for(let e of r){let n=e.match(/\b\d{5,}\b/)?.[0]||``;n&&i.push({number:n,topic:e,status:t.defaultStatus||``,registeredAt:e.match(/\d{1,2}[.\-/]\d{1,2}[.\-/]\d{2,4}/)?.[0]||``})}let a=fi(i.map(e=>qr(e,t)));return{ok:a.length>0,sourceType:t.sourceType||V.AUTO,parsedAt:new Date().toISOString(),orders:a,customers:pi(a.map(Jr)),history:[],warnings:a.length?[]:[`Nie znaleziono numerów zleceń w tekście.`],stats:{rawRows:i.length,orders:a.length,customers:a.length,history:0,tables:0}}}function ii(e,t){let n=[];return e.querySelectorAll(`table`).forEach(e=>{let r=Array.from(e.querySelectorAll(`thead th`)),i=Array.from(e.querySelectorAll(`tr:first-child th, tr:first-child td`)),a=(r.length?r:i).map(e=>di(e.textContent)).map(li);(Array.from(e.querySelectorAll(`tbody tr`)).length?Array.from(e.querySelectorAll(`tbody tr`)):Array.from(e.querySelectorAll(`tr`)).slice(r.length||i.some(e=>e.tagName===`TH`)?1:0)).forEach(e=>{let r=Array.from(e.querySelectorAll(`td, th`)).map(e=>U(e.textContent));if(r.length<2)return;let i={};r.forEach((e,t)=>{let n=a[t]||ui(e,t);i[n]||(i[n]=e)}),i.sourceType=t,ci(i,r)&&n.push(i)})}),n}function ai(e,t){let n={},r=U(e.body?.textContent||``);return e.querySelectorAll(`dt, label, th, strong, b`).forEach(e=>{let t=li(di(e.textContent));if(!t)return;let r=U(e.nextElementSibling?.textContent||e.parentElement?.querySelector(`td:last-child, dd, span:last-child`)?.textContent||``).replace(U(e.textContent),``).trim();r&&!n[t]&&(n[t]=r)}),n.number||=r.match(/(?:nr|numer|zlecenie)\D{0,12}(\d{5,})/i)?.[1]||r.match(/\b\d{5,}\b/)?.[0]||``,n.phone||=r.match(/(?:\+48\s*)?(\d{3}[\s-]?\d{3}[\s-]?\d{3})/)?.[0]||``,n.topic||=r.slice(0,160),n.sourceType=t,n.number?[n]:[]}function oi(e,t){if(!t)return[];let n=[];return[`.history tr`,`.historia tr`,`.timeline li`,`.comment`,`.message`,`.korespondencja tr`].forEach(r=>{e.querySelectorAll(r).forEach((e,r)=>{let i=U(e.textContent);!i||i.length<8||n.push(Yr({id:`${t.id}-hist-${r}`,text:i,type:`telmor`,title:`Historia Telmor`},t))})}),mi(n)}function si(e){return e===V.CLOSED_ORDERS?`zamknięte`:``}function ci(e,t){return e.number&&/\d{5,}/.test(e.number)?!0:t.join(` `).match(/\b\d{5,}\b/)}function li(e=``){for(let[t,n]of ti)if(t.test(e))return n;return``}function ui(e,t){return/\b\d{5,}\b/.test(e)?`number`:/(?:\+48\s*)?\d{3}[\s-]?\d{3}[\s-]?\d{3}/.test(e)?`phone`:/\d{1,2}[.\-/]\d{1,2}[.\-/]\d{2,4}/.test(e)?t<2?`registeredAt`:`doneAt`:`col${t}`}function di(e=``){return U(e).toLowerCase().normalize(`NFD`).replace(/[\u0300-\u036f]/g,``)}function U(e=``){return String(e).replace(/\s+/g,` `).trim()}function fi(e){return Array.from(new Map(e.filter(e=>e.number).map(e=>[e.id,e])).values())}function pi(e){return Array.from(new Map(e.filter(e=>e.id).map(e=>[e.id,e])).values())}function mi(e){return Array.from(new Map(e.map(e=>[e.id,e])).values())}function hi(e){return{ok:!1,sourceType:V.AUTO,parsedAt:new Date().toISOString(),orders:[],customers:[],history:[],warnings:[e],stats:{rawRows:0,orders:0,customers:0,history:0,tables:0}}}var gi=`telmor_last_import_preview_v1`;async function _i({input:e,sourceType:t}){let n=String(e||``).trim(),r=/<\s*(html|table|div|tr|td|body|span|form)\b/i.test(n)?ni(n,{sourceType:t}):ri(n,{sourceType:t});return await S(gi,bi(r)),r}async function vi(e){if(!e?.orders?.length)throw Error(`Brak zleceń do zapisania. Najpierw przeanalizuj HTML lub tekst Telmor.`);let t=await st(e.orders);for(let t of e.customers||[])await tn(t);for(let t of e.history||[])await xt(t);return await hn({id:`telmor-import`,lastOpenOrdersSyncAt:new Date().toISOString(),lastClosedOrdersSyncAt:new Date().toISOString(),lastFullSyncAt:new Date().toISOString(),lastError:``}),await S(gi,bi(e,`local`)),{saved:!0,mode:`local`,orders:t.length,customers:e.customers?.length||0,history:e.history?.length||0,message:`Dane Telmor zapisane lokalnie w tej przeglądarce.`}}async function yi(){return C(gi)}function bi(e,t=`preview`){return{mode:t,parsedAt:e?.parsedAt||new Date().toISOString(),sourceType:e?.sourceType||`auto`,stats:e?.stats||{},warnings:e?.warnings||[]}}var W=null;function xi(){return setTimeout(()=>Si(),0),`
    <div class="page telmor-sync-page">
      <div class="page-title compact-title">
        <div>
          <h1>Moduł Telmor</h1>
          <p>Etap 8: przygotowanie importu, parsera i mapowania danych z portalu źródłowego.</p>
        </div>
        <a class="secondary-button" href="#/settings">Dane logowania</a>
      </div>

      <section class="telmor-grid">
        <article class="panel telmor-status-panel">
          <div class="panel-header settings-panel-header">
            <div>
              <h2>Status modułu</h2>
              <p class="muted">Hasło Telmor zostaje lokalnie na urządzeniu. Ta wersja nie wysyła danych do zewnętrznych usług.</p>
            </div>
            <span id="telmor-ready-badge" class="local-status-badge">Sprawdzanie</span>
          </div>
          <div id="telmor-status-list" class="status-list compact-status-list"></div>
          <div class="button-row">
            <button id="test-telmor-credentials-button" class="secondary-button" type="button">Sprawdź lokalny sejf</button>
          </div>
          <div id="telmor-status-message" class="settings-message" role="status"></div>
        </article>

        <article class="panel telmor-import-panel">
          <div class="panel-header settings-panel-header">
            <div>
              <h2>Ręczny import HTML / tekstu</h2>
              <p class="muted">Wklej źródło strony z Telmoru albo tekst skopiowany z listy. Parser spróbuje wyciągnąć zlecenia, klientów i historię.</p>
            </div>
          </div>

          <form id="telmor-import-form" class="settings-form telmor-import-form">
            <label for="telmor-import-type">Rodzaj danych</label>
            <select id="telmor-import-type" name="sourceType">
              ${Object.entries(Kr).map(([e,t])=>`<option value="${e}">${t}</option>`).join(``)}
            </select>

            <label for="telmor-html-input">HTML albo tekst z portalu Telmor</label>
            <textarea id="telmor-html-input" name="input" rows="12" placeholder="Tu wklej HTML strony, tabelę zleceń albo tekst skopiowany z portalu..."></textarea>

            <div class="button-row">
              <button class="primary-button" type="submit">Analizuj dane</button>
              <button id="load-sample-telmor-button" class="secondary-button" type="button">Wstaw przykład</button>
              <button id="clear-telmor-input-button" class="secondary-button" type="button">Wyczyść</button>
              <button id="save-telmor-import-button" class="secondary-button" type="button" disabled>Zapisz wynik</button>
            </div>
          </form>
          <div id="telmor-import-message" class="settings-message" role="status"></div>
        </article>
      </section>

      <section class="panel telmor-preview-panel">
        <div class="panel-header settings-panel-header">
          <div>
            <h2>Podgląd wyniku</h2>
            <p class="muted">Wynik importu jest zapisywany lokalnie w tej przeglądarce. Nie ma zewnętrznej synchronizacji ani zapisu na serwer.</p>
          </div>
        </div>
        <div id="telmor-preview-summary" class="preview-summary empty-preview">Brak przeanalizowanych danych.</div>
        <div id="telmor-preview-table" class="telmor-preview-table"></div>
      </section>
    </div>
  `}async function Si(){let e=document.querySelector(`#telmor-status-message`),t=document.querySelector(`#telmor-import-message`),n=document.querySelector(`#telmor-import-form`),r=document.querySelector(`#telmor-html-input`),i=document.querySelector(`#telmor-import-type`),a=document.querySelector(`#save-telmor-import-button`),o=document.querySelector(`#load-sample-telmor-button`),s=document.querySelector(`#clear-telmor-input-button`),c=document.querySelector(`#test-telmor-credentials-button`);await Ci(),await wi(),c?.addEventListener(`click`,async()=>{K(e,`Sprawdzanie lokalnego sejfu Telmor...`,`info`);try{K(e,`Sejf działa. Login: ${(await Wr()).login}. Hasło jest zapisane lokalnie i nie jest pokazywane.`,`success`),await Ci()}catch(t){K(e,t.message,`error`)}}),o?.addEventListener(`click`,()=>{r.value=Di(),i.value=V.OPEN_ORDERS,K(t,`Wstawiono przykładową tabelę do testu parsera.`,`info`)}),s?.addEventListener(`click`,()=>{r.value=``,W=null,a.disabled=!0,Ti(null),K(t,`Wyczyszczono pole importu.`,`info`)}),n?.addEventListener(`submit`,async e=>{e.preventDefault(),K(t,`Analizowanie danych Telmor...`,`info`);try{W=await _i({input:r.value,sourceType:i.value}),Ti(W),a.disabled=!W.orders.length;let e=W.orders.length?`success`:`warning`;K(t,`Analiza zakończona. Zlecenia: ${W.stats.orders}, klienci: ${W.stats.customers}, historia: ${W.stats.history}.`,e)}catch(e){a.disabled=!0,K(t,e.message,`error`)}}),a?.addEventListener(`click`,async()=>{if(W){a.disabled=!0,K(t,`Zapisywanie wyniku importu...`,`info`);try{let e=await vi(W);K(t,e.message,e.saved?`success`:`warning`),await wi()}catch(e){K(t,e.message,`error`)}finally{a.disabled=!1}}})}async function Ci(){let e=document.querySelector(`#telmor-ready-badge`),t=document.querySelector(`#telmor-status-list`);if(!e||!t)return;let n=await Ur();e.textContent=n.readyForLiveSync?`Gotowy lokalnie`:`Import ręczny`,e.dataset.tone=n.readyForLiveSync?`success`:`warning`,t.innerHTML=`
    ${G(`Sejf lokalny`,n.vaultSupported?`obsługiwany`:`brak obsługi`,n.vaultSupported)}
    ${G(`Dane Telmor`,n.credentialsSaved?`zapisane lokalnie: ${q(n.loginHint)}`:`brak zapisanych danych`,n.credentialsSaved)}
    ${G(`Sesja Telmor`,n.sessionActive?`aktywna lokalnie: ${Ei(n.sessionLastCheckAt)}`:`nieaktywna / niesprawdzona`,n.sessionActive)}
    ${G(`Import ręczny`,`aktywny`,!0)}
    ${G(`Pobieranie na żywo`,`jeszcze nieuruchomione`,!1)}
  `}async function wi(){let e=await yi();if(!e)return;let t=document.querySelector(`#telmor-preview-summary`);t&&(t.classList.remove(`empty-preview`),t.innerHTML=`
    <strong>Ostatni import:</strong>
    tryb: ${q(e.mode)},
    data: ${Ei(e.parsedAt)},
    zlecenia: ${Number(e.stats?.orders||0)},
    klienci: ${Number(e.stats?.customers||0)},
    historia: ${Number(e.stats?.history||0)}.
  `)}function Ti(e){let t=document.querySelector(`#telmor-preview-summary`),n=document.querySelector(`#telmor-preview-table`);if(!(!t||!n)){if(!e){t.classList.add(`empty-preview`),t.textContent=`Brak przeanalizowanych danych.`,n.innerHTML=``;return}if(t.classList.remove(`empty-preview`),t.innerHTML=`
    <div class="preview-stat-row">
      <span>Zlecenia: <strong>${e.stats.orders}</strong></span>
      <span>Klienci: <strong>${e.stats.customers}</strong></span>
      <span>Historia: <strong>${e.stats.history}</strong></span>
      <span>Tabele HTML: <strong>${e.stats.tables}</strong></span>
    </div>
    ${e.warnings.length?`<div class="preview-warnings">${e.warnings.map(q).join(`<br>`)}</div>`:``}
  `,!e.orders.length){n.innerHTML=`<p class="muted">Brak zleceń do pokazania.</p>`;return}n.innerHTML=`
    <div class="desktop-table-wrapper">
      <table class="orders-table compact-orders-table">
        <thead>
          <tr>
            <th>Nr</th>
            <th>Klient</th>
            <th>Miasto</th>
            <th>Telefon</th>
            <th>Status</th>
            <th>Temat</th>
          </tr>
        </thead>
        <tbody>
          ${e.orders.slice(0,20).map(e=>`
            <tr>
              <td>${q(e.number)}</td>
              <td>${q(e.customerName||`-`)}</td>
              <td>${q(e.city||`-`)}</td>
              <td>${q(e.phone||`-`)}</td>
              <td>${q(e.sourceStatus||e.status||`-`)}</td>
              <td>${q(e.topic||`-`)}</td>
            </tr>
          `).join(``)}
        </tbody>
      </table>
    </div>
  `}}function G(e,t,n){return`
    <div class="status-item">
      <span class="status-dot ${n?``:`status-dot-warning`}"></span>
      <div>
        <strong>${q(e)}</strong>
        <small>${q(t)}</small>
      </div>
    </div>
  `}function K(e,t,n=`info`){e&&(e.textContent=t,e.dataset.tone=n)}function Ei(e){if(!e)return`brak`;let t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleString(`pl-PL`,{year:`numeric`,month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`})}function q(e=``){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}function Di(){return`<table>
    <thead>
      <tr>
        <th>Nr zlecenia</th>
        <th>Status</th>
        <th>Data zlecenia</th>
        <th>Klient</th>
        <th>Telefon</th>
        <th>Miasto</th>
        <th>Adres</th>
        <th>Temat</th>
        <th>Voucher</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>104750</td>
        <td>Otwarte</td>
        <td>20.06.2026 08:30</td>
        <td>Jan Kowalski</td>
        <td>501 222 333</td>
        <td>Mielec</td>
        <td>ul. Testowa 12</td>
        <td>Internet - brak usługi</td>
        <td>VCH-2026-001</td>
      </tr>
      <tr>
        <td>104751</td>
        <td>W realizacji</td>
        <td>20.06.2026 09:15</td>
        <td>Anna Nowak</td>
        <td>502 333 444</td>
        <td>Czermin</td>
        <td>Czermin 10</td>
        <td>Telewizja - konfiguracja</td>
        <td>-</td>
      </tr>
    </tbody>
  </table>`}async function Oi(){let e=await nr();return setTimeout(()=>ki(),0),`
    <div class="page sync-page">
      <div class="page-title compact-title">
        <div>
          <h1>Synchronizacja</h1>
          <p>Ekran pokazuje lokalny cache urządzenia i dane zapisane w tej przeglądarce.</p>
        </div>
        <div class="desktop-only title-actions">
          <button id="sync-full-button" class="primary-button" type="button">Sprawdź lokalnie</button>
        </div>
      </div>

      <section class="sync-summary-grid">
        ${Mi(`Połączenie`,e.localOnly?`Tryb lokalny`:`Zapis zewnętrzny`,e.localOnly?`Dane zostają w tej przeglądarce.`:`Dane mogą być synchronizowane zewnętrznie.`,e.remoteActive?`green`:`orange`)}
        ${Mi(`Internet`,e.online?`Online`:`Offline`,e.online?`Aplikacja może działać online i offline.`:`Dane nadal zostają lokalnie.`,e.online?`green`:`orange`)}
        ${Mi(`Kolejka`,String(e.queue.count),e.queue.count?`Zmiany są zapisane lokalnie.`:`Brak oczekujących zmian.`,e.queue.count?`orange`:`green`)}
        ${Mi(`Konflikty`,String(e.conflicts.length),e.conflicts.length?`Wymagana decyzja użytkownika.`:`Brak konfliktów.`,e.conflicts.length?`red`:`green`)}
      </section>

      <section class="sync-grid">
        <article class="panel sync-device-panel">
          <div class="panel-header">
            <h2>To urządzenie</h2>
            <span class="local-status-badge" data-tone="${e.remoteActive?`success`:`warning`}">${e.remoteActive?`może synchronizować`:`tylko lokalnie`}</span>
          </div>
          <dl class="sync-definition-list">
            <div><dt>ID</dt><dd>${Y(e.device.deviceId)}</dd></div>
            <div><dt>Nazwa</dt><dd>${Y(e.device.name)}</dd></div>
            <div><dt>Platforma</dt><dd>${Y(e.device.platform)}</dd></div>
            <div><dt>Ostatnio</dt><dd>${J(e.device.lastSeenAt)}</dd></div>
          </dl>
          <div class="button-row">
            <button id="register-device-button" class="secondary-button" type="button">Zarejestruj urządzenie</button>
            <button id="pull-cloud-button" class="secondary-button" type="button">Odśwież lokalnie</button>
            <button id="push-queue-button" class="secondary-button" type="button">Wyczyść kolejkę</button>
          </div>
          <div id="sync-message" class="settings-message" role="status"></div>
        </article>

        <article class="panel">
          <div class="panel-header">
            <h2>Lokalny cache danych</h2>
            <small>Ostatnie dane trzymane na urządzeniu do pracy offline.</small>
          </div>
          <div class="cache-table-wrap">
            <table class="orders-table compact-orders-table sync-cache-table">
              <thead>
                <tr><th>Kolekcja</th><th>Rekordy</th><th>Ostatni zapis cache</th></tr>
              </thead>
              <tbody>
                ${e.cache.map(e=>`
                  <tr>
                    <td><strong>${Y(e.collectionName)}</strong></td>
                    <td>${e.count}</td>
                    <td>${J(e.cachedAt)}</td>
                  </tr>
                `).join(``)}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section class="sync-grid lower-sync-grid">
        <article class="panel">
          <div class="panel-header">
            <h2>Kolejka zmian lokalnych</h2>
            <span class="result-count">${e.queue.count}</span>
          </div>
          <div id="queue-list" class="sync-list muted">Ładowanie kolejki...</div>
          <div class="button-row">
            <button id="refresh-queue-button" class="secondary-button" type="button">Odśwież</button>
            <button id="clear-queue-button" class="danger-button" type="button">Wyczyść kolejkę</button>
          </div>
        </article>

        <article class="panel">
          <div class="panel-header">
            <h2>Konflikty lokalne</h2>
            <span class="result-count">${e.conflicts.length}</span>
          </div>
          <div id="conflict-list" class="sync-list">
            ${ji(e.conflicts)}
          </div>
          <div class="button-row">
            <button id="clear-conflicts-button" class="danger-button" type="button">Wyczyść konflikty</button>
          </div>
        </article>
      </section>
    </div>
  `}function ki(){let e=document.querySelector(`#sync-message`),t=(t,n=`info`)=>{e&&(e.textContent=t,e.dataset.tone=n)},n=async(e,n,r)=>{e&&(e.disabled=!0),t(`${n}...`,`info`);try{t(Ni(n,await r()),`success`),await Ai(),setTimeout(()=>window.dispatchEvent(new HashChangeEvent(`hashchange`)),350)}catch(e){t(e.message,`error`)}finally{e&&(e.disabled=!1)}};document.querySelector(`#sync-full-button`)?.addEventListener(`click`,e=>{n(e.currentTarget,`Sprawdź lokalnie`,$n)}),document.querySelector(`#register-device-button`)?.addEventListener(`click`,e=>{n(e.currentTarget,`Rejestracja urządzenia`,Xn)}),document.querySelector(`#pull-cloud-button`)?.addEventListener(`click`,e=>{n(e.currentTarget,`Odświeżanie lokalne`,Zn)}),document.querySelector(`#push-queue-button`)?.addEventListener(`click`,e=>{n(e.currentTarget,`Czyszczenie kolejki`,Qn)}),document.querySelector(`#refresh-queue-button`)?.addEventListener(`click`,()=>Ai()),document.querySelector(`#clear-queue-button`)?.addEventListener(`click`,async()=>{window.confirm(`Wyczyścić lokalną kolejkę zmian?`)&&(await qn(),await Ai(),t(`Kolejka lokalna została wyczyszczona.`,`success`))}),document.querySelector(`#clear-conflicts-button`)?.addEventListener(`click`,async()=>{window.confirm(`Wyczyścić listę konfliktów bez rozstrzygania?`)&&(await In(),t(`Konflikty zostały wyczyszczone lokalnie.`,`success`),setTimeout(()=>window.dispatchEvent(new HashChangeEvent(`hashchange`)),250))}),document.querySelectorAll(`[data-conflict-action]`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.dataset.conflictId,r=e.dataset.conflictAction;n(e,r===`local`?`Zapis lokalnej wersji`:`Zostawienie drugiej wersji`,()=>r===`local`?er(t):tr(t))})}),Ai()}async function Ai(){let e=document.querySelector(`#queue-list`);if(!e)return;let t=await Gn();if(!t.length){e.innerHTML=`<p class="muted">Brak zmian w kolejce lokalnej.</p>`;return}e.innerHTML=t.map(e=>`
    <article class="sync-list-item">
      <div>
        <strong>${Y(e.collectionName)} / ${Y(e.documentId)}</strong>
        <small>${Y(e.reason||`Zmiana zapisana lokalnie.`)}</small>
        ${e.lastError?`<small class="sync-error">${Y(e.lastError)}</small>`:``}
      </div>
      <time>${J(e.createdAt)}</time>
    </article>
  `).join(``)}function ji(e=[]){return e.length?e.map(e=>`
    <article class="sync-list-item conflict-item">
      <div>
        <strong>${Y(e.collectionName)} / ${Y(e.documentId)}</strong>
        <small>${Y(e.reason)}</small>
        <small>Lokalnie: ${J(e.localDoc?.updatedAt)} · Druga wersja: ${J(e.remoteDoc?.updatedAt)}</small>
      </div>
      <div class="conflict-actions">
        <button class="secondary-button" type="button" data-conflict-action="cloud" data-conflict-id="${Y(e.conflictId)}">Zostaw drugą wersję</button>
        <button class="primary-button" type="button" data-conflict-action="local" data-conflict-id="${Y(e.conflictId)}">Nadpisz lokalną</button>
      </div>
    </article>
  `).join(``):`<p class="muted">Brak konfliktów lokalnych.</p>`}function Mi(e,t,n,r){return`
    <article class="sync-summary-card ${r}">
      <span>${e}</span>
      <strong>${Y(t)}</strong>
      <small>${Y(n)}</small>
    </article>
  `}function Ni(e,t){return t?.message?t.message:Array.isArray(t)?`${e}: ${t.map(e=>`${e.collectionName}: ${e.count}`).join(`, `)}`:t?.pushed&&t?.pulled?`Sprawdź lokalnie zakończona. Wysłano: ${t.pushed.sent}/${t.pushed.attempted}, konflikty: ${t.pushed.conflicts}, pobrano kolekcji: ${t.pulled.length}.`:t?.attempted===void 0?`${e} zakończone.`:`Kolejka lokalna: ${t.attempted}. Konflikty: ${t.conflicts}. Pozostało: ${t.left}.`}function J(e){if(!e)return`-`;let t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleString(`pl-PL`,{day:`2-digit`,month:`2-digit`,year:`numeric`,hour:`2-digit`,minute:`2-digit`})}function Y(e=``){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}async function Pi(){let[e,t,n]=await Promise.all([k({mode:`open`,limit:200}),k({mode:`closed`,limit:80}),lt({limit:8})]);[...e,...t];let r=It(),i=Rt(),a=e.filter(e=>e.workStatus===j.URGENT||e.priority===`Pilne`),o=e.filter(e=>e.workStatus===j.REVIEW||Li(e)),s=e.filter(e=>Ri(e)),c=Fi(e);return`
    <div class="page work-page">
      <div class="page-title compact-title">
        <div>
          <h1>Praca dzienna</h1>
          <p>Jeden uporządkowany ekran do codziennej obsługi. Szczegóły dalej są schowane w zleceniu, żeby nie robić bałaganu.</p>
        </div>
        <div class="desktop-only title-actions">
          <a href="#/orders-open" class="secondary-button">Lista zleceń</a>
          <a href="#/search" class="primary-button-link">Szukaj</a>
        </div>
      </div>

      <section class="work-summary-grid">
        ${zi(`Dzisiaj`,c.length,`Najbliższe lub nowe sprawy`,`#/work`)}
        ${zi(`Pilne`,a.length,`Oznaczone roboczo`,`#/orders-open?filter=urgent`)}
        ${zi(`Do sprawdzenia`,o.length,`Wymagają kontroli`,`#/orders-open?filter=review`)}
        ${zi(`Vouchery`,s.length,`Brak albo do potwierdzenia`,`#/orders-open?filter=missingVoucher`)}
      </section>

      <section class="work-grid">
        <article class="panel work-main-panel">
          <div class="panel-header">
            <h2>Najpierw do zrobienia</h2>
            <span>${c.length} pozycji</span>
          </div>
          ${c.length?Bi(c):m({title:`Brak pilnych spraw na liście`,text:`Po synchronizacji pojawią się tu nowe, pilne i oczekujące zlecenia.`})}
        </article>

        <aside class="work-side-stack">
          <article class="panel">
            <div class="panel-header"><h2>Szybkie filtry</h2></div>
            <div class="saved-filter-grid">
              ${r.savedFilters.map(e=>`<a class="saved-filter" href="${e.route}">${e.label}<span>›</span></a>`).join(``)}
            </div>
          </article>

          <article class="panel">
            <div class="panel-header"><h2>Ostatnio otwarte</h2></div>
            ${i.length?Vi(i):`<p class="muted">Po wejściu w szczegóły zlecenia pojawi się tu krótka historia ostatnio otwieranych spraw.</p>`}
          </article>

          <article class="panel">
            <div class="panel-header"><h2>Ostatnie powiadomienia</h2><a href="#/notifications">Wszystkie</a></div>
            <div class="mini-notification-list">
              ${n.slice(0,5).map(e=>`
                <a href="${e.orderId?`#/order/${e.orderId}`:`#/notifications`}">
                  <strong>${X(e.title||`Powiadomienie`)}</strong>
                  <small>${X(e.body||e.note||``)}</small>
                </a>
              `).join(``)||`<p class="muted">Brak powiadomień.</p>`}
            </div>
          </article>
        </aside>
      </section>
    </div>
  `}function Fi(e){return[...e].sort((e,t)=>Ii(t)-Ii(e)).slice(0,12)}function Ii(e){let t=0;return e.status===`Nowe`&&(t+=50),(e.workStatus===j.URGENT||e.priority===`Pilne`)&&(t+=40),(e.workStatus===j.REVIEW||Li(e))&&(t+=25),Ri(e)&&(t+=20),e.status===`Oczekuje`&&(t+=10),t}function Li(e){let t=`${e.status||``} ${e.topic||``} ${e.description||``}`.toLowerCase();return/sprawd|kontrol|brak|problem|oczekuje/.test(t)}function Ri(e){let t=`${e.voucher||``} ${e.topic||``}`.toLowerCase();return!e.hasVoucher&&/voucher|bon|kupon/.test(t)}function zi(e,t,n,r){return`
    <a class="work-summary-card" href="${r}">
      <span>${e}</span>
      <strong>${t}</strong>
      <small>${n}</small>
    </a>
  `}function Bi(e){return`
    <div class="work-order-list">
      ${e.map(e=>`
        <a class="work-order-item" href="#/order/${e.id}">
          <div>
            <strong>#${X(e.number||e.id)}</strong>
            <span>${X(e.customerName||`-`)}</span>
            <small>${X([e.city,e.topic].filter(Boolean).join(` · `))}</small>
          </div>
          <div class="work-order-badges">
            <em class="pill pill-${e.statusTone||`gray`}">${X(e.status||`-`)}</em>
            ${e.workStatus&&e.workStatus!==j.NORMAL?`<small>${Bt(e.workStatus)}</small>`:``}
          </div>
        </a>
      `).join(``)}
    </div>
  `}function Vi(e){return`
    <div class="recent-list">
      ${e.slice(0,6).map(e=>`
        <a href="#/order/${e.id}">
          <strong>#${X(e.number||e.id)}</strong>
          <span>${X(e.customerName||`-`)}</span>
          <small>${Hi(e.openedAt)}</small>
        </a>
      `).join(``)}
    </div>
  `}function Hi(e){let t=new Date(e);return Number.isNaN(t.getTime())?``:t.toLocaleDateString(`pl-PL`,{day:`2-digit`,month:`2-digit`})}function X(e=``){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}var Ui=`diagnostic_probe`;async function Wi(){let e=new Date().toISOString(),t=[];t.push(qi()),t.push(Ji()),t.push(await ea(`Lokalna baza IndexedDB`,Yi)),t.push(await ea(`Lokalny sejf Telmor`,Xi)),t.push(Zi()),t.push(await ea(`Dane lokalne`,Qi)),t.push($i());let n=ta(t),r={appName:F.appName,version:F.versionLabel,stage:F.stageLabel,userEmail:i(),authMode:a(),startedAt:e,endedAt:new Date().toISOString(),summary:n,tests:t};return localStorage.setItem(`telmor_last_diagnostic_report_v1`,JSON.stringify(r)),r}function Gi(){let e=localStorage.getItem(`telmor_last_diagnostic_report_v1`);if(!e)return null;try{return JSON.parse(e)}catch{return localStorage.removeItem(`telmor_last_diagnostic_report_v1`),null}}function Ki(e){if(!e)return`Brak raportu diagnostycznego.`;let t=[`Telmor Praca - raport diagnostyczny`,`Wersja: ${e.version}`,`Etap: ${e.stage}`,`Konto: ${e.userEmail}`,`Tryb: ${e.authMode}`,`Start: ${e.startedAt}`,`Koniec: ${e.endedAt}`,`Wynik: OK ${e.summary.ok}, ostrzeżenia ${e.summary.warning}, błędy ${e.summary.error}, pominięte ${e.summary.skipped}`,``,`TESTY:`];for(let n of e.tests){t.push(`- [${n.status.toUpperCase()}] ${n.name}: ${n.message}`);for(let e of n.details||[])t.push(`  * ${e.label}: ${e.value}`)}return t.join(`
`)}function qi(){return Z(`ok`,`Informacje aplikacji`,`Aplikacja działa i może wykonać diagnostykę.`,[Q(`Nazwa`,F.appName),Q(`Wersja`,F.versionLabel),Q(`Etap`,F.stageLabel),Q(`Adres`,typeof window>`u`?`brak`:window.location.href),Q(`Online`,typeof navigator>`u`?`nieznane`:navigator.onLine?`tak`:`nie`)])}function Ji(){let e=n();return e?Z(`ok`,`Konto aplikacji`,`Działa lokalna sesja aplikacji.`,[Q(`Konto`,e.email||`lokalne`),Q(`Tryb`,e.mode||`local`),Q(`Sesja od`,e.signedInAt||`brak`)]):Z(`warning`,`Konto aplikacji`,`Aplikacja nie ma jeszcze aktywnej sesji lokalnej.`,[Q(`Tryb`,`brak sesji`)])}async function Yi(){if(!Ue())return Z(`error`,`Lokalna baza IndexedDB`,`IndexedDB nie jest dostępne w tej przeglądarce.`,[]);await S(Ui,{ok:!0,at:new Date().toISOString()});let e=await C(Ui);return await Ge(Ui),e?.ok?Z(`ok`,`Lokalna baza IndexedDB`,`Zapis, odczyt i usunięcie testowego rekordu działa.`,[Q(`Obsługa`,`tak`)]):Z(`error`,`Lokalna baza IndexedDB`,`Zapis testowy nie został poprawnie odczytany.`,[])}async function Xi(){if(!I())return Z(`warning`,`Lokalny sejf Telmor`,`Przeglądarka nie obsługuje pełnego lokalnego sejfu.`,[]);let e=await Cn();return Z(e.exists?`ok`:`warning`,`Lokalny sejf Telmor`,e.exists?`Dane Telmor są zapisane lokalnie na tym urządzeniu.`:`Brak lokalnie zapisanych danych Telmor na tym urządzeniu.`,[Q(`Zapis istnieje`,e.exists?`tak`:`nie`),Q(`Login`,e.loginHint||`brak`),Q(`Zapamiętaj sesję`,e.rememberSession?`tak`:`nie`),Q(`Zapisano`,e.savedAt||`brak`)])}function Zi(){let e=typeof navigator<`u`&&`serviceWorker`in navigator,t=typeof Notification<`u`,n=typeof window>`u`?!1:window.isSecureContext,r=[];return e||r.push(`serviceWorker`),t||r.push(`Notification`),n||r.push(`HTTPS/secure context`),Z(r.length?`warning`:`ok`,`Możliwości PWA/przeglądarki`,r.length?`Braki: ${r.join(`, `)}.`:`Przeglądarka ma podstawowe mechanizmy PWA.`,[Q(`Service Worker`,e?`tak`:`nie`),Q(`Notification`,t?`tak`:`nie`),Q(`Secure context`,n?`tak`:`nie`),Q(`Zgoda na powiadomienia`,t?Notification.permission:`brak obsługi`)])}async function Qi(){let e=await nr();return Z(`ok`,`Dane lokalne`,`Odczytano lokalny stan urządzenia i cache.`,[Q(`Tryb lokalny`,e.localOnly?`tak`:`nie`),Q(`Online`,e.online?`tak`:`nie`),Q(`Urządzenie`,`${e.device.name} / ${e.device.deviceId}`),Q(`Kolejka`,`${e.queue.count} zmian`),Q(`Konflikty`,`${e.conflicts.length}`),Q(`Kolekcje cache`,e.cache.map(e=>`${e.collectionName}:${e.count}`).join(`, `))])}function $i(){return Z(`ok`,`GitHub Pages / PWA`,`Projekt jest przygotowany jako statyczne PWA.`,[Q(`Build`,`npm run build`),Q(`Katalog publikacji`,`dist`),Q(`Service Worker`,`/service-worker.js`),Q(`Zewnętrzna baza`,`brak`),Q(`Powiadomienia w tle`,`brak`)])}async function ea(e,t){try{return await t()}catch(t){return Z(`error`,e,t.message||`Nieznany błąd diagnostyki.`,[Q(`Typ błędu`,t.name||`Error`)])}}function ta(e){return e.reduce((e,t)=>(e[t.status]=(e[t.status]||0)+1,e),{ok:0,warning:0,error:0,skipped:0})}function Z(e,t,n,r=[]){return{status:e,name:t,message:n,details:r,checkedAt:new Date().toISOString()}}function Q(e,t){return{label:e,value:String(t??``)}}function na(){let e=Gi();return setTimeout(()=>ra(),0),`
    <div class="page diagnostics-page">
      <div class="page-title compact-title">
        <div>
          <h1>Diagnostyka</h1>
          <p>Diagnostyka lokalnego PWA: baza przeglądarki, sejf Telmor, service worker i gotowość pod GitHub Pages.</p>
        </div>
        <div class="desktop-only title-actions">
          <button id="run-diagnostics-button-top" class="primary-button" type="button">Uruchom testy</button>
        </div>
      </div>

      <section class="diagnostics-grid">
        <article class="panel diagnostics-control-panel">
          <h2>Centrum testów</h2>
          <p class="muted">Ten ekran nie zmienia danych roboczych. Sprawdza konfigurację aplikacji i pokazuje, co trzeba poprawić przed publikacją na GitHub Pages.</p>
          <div class="button-row">
            <button id="run-diagnostics-button" class="primary-button" type="button">Uruchom testy</button>
            <button id="export-diagnostics-button" class="secondary-button" type="button">Eksport TXT</button>
            <button id="copy-diagnostics-button" class="secondary-button" type="button">Kopiuj raport</button>
          </div>
          <div id="diagnostics-message" class="settings-message" role="status"></div>
        </article>

        <article class="panel">
          <h2>Wynik ogólny</h2>
          <div id="diagnostics-summary" class="diagnostics-summary">
            ${e?ia(e.summary):aa()}
          </div>
        </article>
      </section>

      <section class="panel diagnostics-results-panel">
        <div class="panel-header">
          <h2>Lista testów</h2>
          <small id="diagnostics-date">${e?`Ostatni test: ${la(e.endedAt)}`:`Brak wykonanego testu`}</small>
        </div>
        <div id="diagnostics-results" class="diagnostics-results">
          ${e?sa(e.tests):`<p class="muted">Uruchom testy, żeby zobaczyć szczegóły.</p>`}
        </div>
      </section>
    </div>
  `}function ra(){let e=[document.querySelector(`#run-diagnostics-button`),document.querySelector(`#run-diagnostics-button-top`)].filter(Boolean),t=document.querySelector(`#export-diagnostics-button`),n=document.querySelector(`#copy-diagnostics-button`),r=document.querySelector(`#diagnostics-message`),i=document.querySelector(`#diagnostics-summary`),a=document.querySelector(`#diagnostics-results`),o=document.querySelector(`#diagnostics-date`),s=(e,t=`info`)=>{r&&(r.textContent=e,r.dataset.tone=t)},c=r=>{e.forEach(e=>{e.disabled=r}),t&&(t.disabled=r),n&&(n.disabled=r)},l=e=>{i&&(i.innerHTML=ia(e.summary)),a&&(a.innerHTML=sa(e.tests)),o&&(o.textContent=`Ostatni test: ${la(e.endedAt)}`)},u=async()=>{c(!0),s(`Wykonywanie diagnostyki...`,`info`);try{let e=await Wi();l(e);let t=e.summary.error?`error`:e.summary.warning?`warning`:`success`;s(`Gotowe. OK: ${e.summary.ok}, ostrzeżenia: ${e.summary.warning}, błędy: ${e.summary.error}.`,t)}catch(e){s(e.message,`error`)}finally{c(!1)}};e.forEach(e=>e.addEventListener(`click`,u)),t?.addEventListener(`click`,()=>{let e=Gi();if(!e){s(`Najpierw uruchom diagnostykę.`,`warning`);return}let t=Ki(e),n=new Blob([t],{type:`text/plain;charset=utf-8`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=`telmor-diagnostyka-${new Date().toISOString().slice(0,19).replace(/[:T]/g,`-`)}.txt`,document.body.appendChild(i),i.click(),i.remove(),URL.revokeObjectURL(r),s(`Raport TXT został przygotowany.`,`success`)}),n?.addEventListener(`click`,async()=>{let e=Gi();if(!e){s(`Najpierw uruchom diagnostykę.`,`warning`);return}try{await navigator.clipboard.writeText(Ki(e)),s(`Raport skopiowany do schowka.`,`success`)}catch{s(`Nie udało się skopiować raportu. Użyj eksportu TXT.`,`error`)}})}function ia(e={}){return`
    <div class="diagnostics-summary-grid">
      ${oa(`OK`,e.ok||0,`success`)}
      ${oa(`Ostrzeżenia`,e.warning||0,`warning`)}
      ${oa(`Błędy`,e.error||0,`error`)}
      ${oa(`Pominięte`,e.skipped||0,`neutral`)}
    </div>
  `}function aa(){return`<p class="muted">Brak raportu. Uruchom diagnostykę.</p>`}function oa(e,t,n){return`<div class="diagnostics-summary-box" data-tone="${n}"><strong>${t}</strong><span>${e}</span></div>`}function sa(e=[]){return e.length?e.map(e=>`
    <article class="diagnostic-test-card" data-status="${$(e.status)}">
      <div class="diagnostic-test-head">
        <div>
          <strong>${$(e.name)}</strong>
          <p>${$(e.message)}</p>
        </div>
        <span>${ca(e.status)}</span>
      </div>
      ${(e.details||[]).length?`
        <dl class="diagnostic-detail-list">
          ${e.details.map(e=>`<div><dt>${$(e.label)}</dt><dd>${$(e.value)}</dd></div>`).join(``)}
        </dl>
      `:``}
    </article>
  `).join(``):`<p class="muted">Brak wyników testów.</p>`}function ca(e){return e===`ok`?`OK`:e===`warning`?`UWAGA`:e===`error`?`BŁĄD`:e===`skipped`?`POMINIĘTO`:e}function la(e){if(!e)return`brak daty`;let t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleString(`pl-PL`,{year:`numeric`,month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`})}function $(e=``){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}var ua={"#/":dt,"#/dashboard":dt,"#/search":Ar,"#/work":Pi,"#/telmor-sync":xi,"#/sync":Oi,"#/customers":nn,"#/history":rn,"#/notifications":un,"#/diagnostics":na,"#/settings":rr},da=!1,fa=0;function pa(){da||=(window.addEventListener(`hashchange`,ma),!0),ma()}async function ma(){let e=document.querySelector(`#page-root`);if(!e)return;let t=++fa,n=window.location.hash||`#/dashboard`;e.innerHTML=le();try{let r=await ha(n);if(t!==fa)return;e.innerHTML=r,ya(n),va(n),window.scrollTo({top:0,behavior:`instant`})}catch(n){if(console.error(n),t!==fa)return;e.innerHTML=ue(n)}}async function ha(e){let t=ga(e),n=_a(e);if(t.startsWith(`#/order/`))return Wt(t.replace(`#/order/`,``)||`104750`,n.get(`tab`)||`details`);if(t===`#/orders-open`)return gt(`open`,n.get(`filter`)||n.get(`status`)||`all`);if(t===`#/orders-closed`)return gt(`closed`,n.get(`filter`)||n.get(`status`)||`all`);let r=ua[t]||ur;return t===`#/search`?r(n):r()}function ga(e){return e.split(`?`)[0]||`#/dashboard`}function _a(e){let t=e.split(`?`)[1]||``;return new URLSearchParams(t)}function va(e){ga(e)===`#/search`&&jr()}function ya(e){let t=ga(e);document.querySelectorAll(`[data-route]`).forEach(e=>{let n=e.dataset.route,r=n===`#/orders-open`&&t.startsWith(`#/order/`);e.classList.toggle(`active`,n===t||r)})}function ba(){return`
    <main class="auth-page">
      <section class="auth-card">
        <div class="auth-brand">
          <span class="brand-mark">✣</span>
          <div>
            <h1>Telmor Praca</h1>
            <p>Lokalna aplikacja PWA uruchamiana z GitHub Pages.</p>
          </div>
        </div>

        <div class="auth-notice success">
          <strong>Tryb lokalny</strong>
          <span>Dane są zapisywane w tej przeglądarce. Program nie używa zewnętrznej bazy ani usług chmurowych.</span>
        </div>

        <form id="login-form" class="auth-form">
          <label for="login-email">Nazwa konta lokalnego</label>
          <input id="login-email" name="email" type="text" autocomplete="username" placeholder="np. Tomek" />

          <label for="login-password">Hasło lokalne</label>
          <input id="login-password" name="password" type="password" autocomplete="current-password" placeholder="Hasło tylko do tej przeglądarki" />

          <button class="primary-button" type="submit">Wejdź</button>
          <button id="local-login-button" class="secondary-button full-width" type="button">Wejdź lokalnie bez konfiguracji</button>
          <button id="register-button" class="text-button" type="button">Zapisz jako konto lokalne</button>
          <button id="reset-password-button" class="text-button" type="button">Informacja o haśle</button>
        </form>

        <div id="auth-message" class="auth-message" role="status"></div>
      </section>

      <aside class="auth-side desktop-only-block">
        <h2>Założenia tej wersji</h2>
        <ul>
          <li>Aplikacja jest zwykłym PWA pod GitHub Pages.</li>
          <li>Powiadomienia są tylko wpisami widocznymi w otwartej aplikacji.</li>
          <li>Dane robocze i dane Telmor zostają lokalnie w przeglądarce.</li>
        </ul>
      </aside>
    </main>
  `}function xa({onAuthenticated:e}){let t=document.querySelector(`#login-form`),n=document.querySelector(`#register-button`),r=document.querySelector(`#reset-password-button`),i=document.querySelector(`#local-login-button`),a=document.querySelector(`#auth-message`),u=(e,t=`info`)=>{a&&(a.textContent=e,a.dataset.tone=t)},d=()=>{let e=new FormData(t);return{email:String(e.get(`email`)||`lokalnie@telmor-praca`).trim(),password:String(e.get(`password`)||``)}};t?.addEventListener(`submit`,async t=>{t.preventDefault(),u(`Uruchamianie...`,`info`);try{let t=d();t.password?await o(t):l(t.email||`lokalnie@telmor-praca`),u(`Aplikacja uruchomiona lokalnie.`,`success`),e?.()}catch(e){u(e.message,`error`)}}),i?.addEventListener(`click`,()=>{try{l(),u(`Aplikacja uruchomiona lokalnie.`,`success`),e?.()}catch(e){u(e.message,`error`)}}),n?.addEventListener(`click`,async()=>{u(`Zapisywanie konta lokalnego...`,`info`);try{let t=d();t.password?await s(t):l(t.email||`lokalnie@telmor-praca`),u(`Konto lokalne zapisane.`,`success`),e?.()}catch(e){u(e.message,`error`)}}),r?.addEventListener(`click`,async()=>{try{await c()}catch(e){u(e.message,`info`)}})}async function Sa(){if(!(`serviceWorker`in navigator))return null;try{let e=await navigator.serviceWorker.register(`./service-worker.js`);return await navigator.serviceWorker.ready,e}catch(e){return console.warn(`Nie udało się zarejestrować service workera:`,e),null}}var Ca=document.querySelector(`#app`);function wa(){if(!n()){Ca.innerHTML=ba(),xa({onAuthenticated:()=>{window.location.hash=`#/dashboard`,wa()}});return}se(Ca),pa()}wa(),d(wa),Sa();