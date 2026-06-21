# Telmor Praca PWA

Statyczna aplikacja PWA przygotowana pod GitHub Pages.

## Założenia tej wersji

- program działa jako PWA z GitHub Pages,
- brak Firebase, Firestore, FCM i Functions,
- brak backendu i brak zewnętrznej bazy,
- dane są lokalne w przeglądarce,
- powiadomienia działają tylko w otwartej aplikacji jako wpisy w module „Powiadomienia”,
- dane logowania Telmor są zapisywane tylko lokalnie na urządzeniu,
- publikacja odbywa się przez GitHub Actions.

## Uruchomienie lokalne

```powershell
npm install
npm run dev
```

## Build

```powershell
npm run build
```

Gotowe pliki powstają w katalogu `dist`.

## Publikacja na GitHub Pages

W repozytorium ustaw:

1. **Settings** → **Pages**.
2. **Build and deployment** → **Source** → **GitHub Actions**.
3. Wypchnij projekt na GitHub.

Workflow z pliku `.github/workflows/pages.yml` zbuduje aplikację i opublikuje katalog `dist`.
