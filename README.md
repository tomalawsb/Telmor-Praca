# Telmor Praca PWA

Statyczna aplikacja PWA przygotowana do publikacji na GitHub Pages.

## Założenia tej wersji

- program działa jako PWA z GitHub Pages,
- brak backendu i brak zewnętrznej bazy,
- dane są lokalne w przeglądarce,
- powiadomienia działają tylko w otwartej aplikacji jako wpisy w module „Powiadomienia”,
- dane logowania Telmor są zapisywane tylko lokalnie na urządzeniu.

## Uruchomienie lokalne

```powershell
npm install
npm run dev
```

## Build

```powershell
npm run build
```

Gotowe pliki będą w katalogu `dist`.

## Publikacja

Projekt jest ustawiony pod statyczny hosting. Katalog `dist` można opublikować na GitHub Pages.
