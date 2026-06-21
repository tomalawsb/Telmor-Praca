# Architektura — Telmor Praca PWA

Ta wersja jest statycznym PWA przeznaczonym do publikacji na GitHub Pages.

## Założenia

- brak zewnętrznej bazy danych,
- brak backendu,
- brak usług chmurowych,
- dane robocze są przechowywane lokalnie w przeglądarce,
- dane logowania Telmor są zapisywane wyłącznie lokalnie w sejfie przeglądarki,
- powiadomienia działają tylko jako wpisy w otwartej aplikacji.

## Główne katalogi

- `src/local/` — lokalna sesja, sejf, baza IndexedDB,
- `src/data/` — repozytoria danych aplikacji,
- `src/sync/` — lokalny cache i stan urządzenia,
- `src/telmor/` — parser i import danych Telmor,
- `public/service-worker.js` — podstawowy service worker PWA/offline.
