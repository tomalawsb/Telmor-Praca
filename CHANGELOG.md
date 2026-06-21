# Changelog

## 15.1 - 2106262116

- Usunięto warstwę synchronizacji zewnętrznej z kodu projektu.
- Usunięto katalog `src/sync`.
- Usunięto stare ekrany `SyncPage` i `TelmorSyncPage`.
- Dodano ekran `LocalDataPage` do kontroli lokalnej bazy.
- Zmieniono moduł Telmor na ręczny import: `TelmorImportPage` i `telmorImportService`.
- Zmieniono repozytoria danych na lokalne helpery: `repositoryLocalHelpers`.
- Dodano `src/local/localStore.js` i `src/local/localStoreStatus.js`.
- Dodano workflow `.github/workflows/pages.yml` do publikacji na GitHub Pages.
- Usunięto zbędną zależność `@vitejs/plugin-basic-ssl`.
- Zaktualizowano README, START_TUTAJ i dokumentację.
- Sprawdzono `npm ci` oraz `npm run build`.

## 15.0

- Wersja lokalna PWA po usunięciu Firebase.
