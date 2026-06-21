# Architektura

Projekt jest statycznym PWA pod GitHub Pages.

## Główne katalogi

- `src/components/` — wspólne elementy interfejsu,
- `src/pages/` — ekrany aplikacji,
- `src/data/` — modele i repozytoria danych,
- `src/local/` — lokalna baza, sejf danych i usługi przeglądarki,
- `src/telmor/` — parser oraz ręczny import danych Telmor,
- `src/search/` — wyszukiwanie lokalne,
- `src/styles/` — style CSS,
- `public/` — manifest PWA, ikony, service worker,
- `.github/workflows/` — publikacja na GitHub Pages.

## Zasada działania

Aplikacja nie używa Firebase, Firestore, FCM ani Functions. Dane są zapisywane lokalnie w przeglądarce przy użyciu IndexedDB/localStorage. Powiadomienia są tylko wpisami widocznymi w otwartej aplikacji.
