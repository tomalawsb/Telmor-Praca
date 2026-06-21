# Start tutaj

Ta paczka to uproszczona wersja PWA pod GitHub Pages.

## Uruchomienie lokalne

```powershell
npm install
npm run dev
```

## Przygotowanie do publikacji

```powershell
npm run build
```

Katalog wynikowy: `dist`.

## Publikacja

Najprościej użyć gotowego workflow:

```text
.github/workflows/pages.yml
```

Na GitHubie włącz Pages z opcją **GitHub Actions**.

## Ważne

- nie konfigurujesz Firebase,
- nie podajesz żadnych kluczy serwerowych,
- nie ma powiadomień w tle po zamknięciu aplikacji,
- dane zostają lokalnie w przeglądarce.
