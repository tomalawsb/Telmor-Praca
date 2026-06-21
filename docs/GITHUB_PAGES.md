# Publikacja na GitHub Pages

1. Zainstaluj zależności:

```powershell
npm install
```

2. Zbuduj aplikację:

```powershell
npm run build
```

3. Opublikuj katalog `dist` przez GitHub Pages albo workflow GitHub Actions.

Konfiguracja Vite ma `base: './'`, więc aplikacja może działać także z podkatalogu repozytorium.
