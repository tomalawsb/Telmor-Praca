# Raport poprawek projektu

## Co zostało poprawione

1. Projekt został uproszczony pod założenie: PWA na GitHub Pages, bez Firebase i bez backendu.
2. Usunięto katalog `src/sync`, który sugerował zewnętrzną synchronizację.
3. Usunięto stare strony:
   - `src/pages/SyncPage.js`,
   - `src/pages/TelmorSyncPage.js`.
4. Dodano nowe strony:
   - `src/pages/LocalDataPage.js`,
   - `src/pages/TelmorImportPage.js`.
5. Dodano lokalną warstwę danych:
   - `src/local/localStore.js`,
   - `src/local/localStoreStatus.js`.
6. Repozytoria danych korzystają teraz z `repositoryLocalHelpers.js`, a nie z helperów synchronizacji.
7. Dodano gotowy workflow GitHub Pages:
   - `.github/workflows/pages.yml`.
8. Usunięto zbędną zależność `@vitejs/plugin-basic-ssl`.
9. Zaktualizowano dokumentację.

## Sprawdzenie techniczne

Wykonano:

```powershell
npm ci
npm run build
```

Wynik: build przechodzi poprawnie.

## Jak publikować

1. Wrzuć projekt na GitHub.
2. Wejdź w `Settings` → `Pages`.
3. Ustaw `Source` na `GitHub Actions`.
4. Po pushu workflow zbuduje i opublikuje aplikację.
