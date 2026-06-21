# Publikacja na GitHub Pages

Projekt ma gotowy workflow:

```text
.github/workflows/pages.yml
```

## Kroki

1. Wyślij projekt na GitHub.
2. Wejdź w **Settings** → **Pages**.
3. Ustaw **Source** na **GitHub Actions**.
4. W zakładce **Actions** sprawdź workflow `Deploy PWA to GitHub Pages`.

Workflow wykonuje:

```powershell
npm ci
npm run build
```

Następnie publikuje katalog `dist` jako stronę GitHub Pages.

Konfiguracja Vite ma `base: './'`, więc aplikacja może działać także z podkatalogu repozytorium.
