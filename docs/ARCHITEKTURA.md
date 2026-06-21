# Architektura

Aplikacja jest statycznym PWA.

## Warstwa plików

- `index.html` - punkt startowy,
- `app.js` - cała logika aplikacji,
- `styles.css` - cały wygląd,
- `manifest.webmanifest` - instalacja PWA,
- `service-worker.js` - cache offline,
- `icons/` - ikony aplikacji.

## Dane

Dane są zapisane w `localStorage` pod kluczem:

```text
telmor_praca_pwa_v16_data
```

Ustawienia są zapisane pod kluczem:

```text
telmor_praca_pwa_v16_settings
```

## Powiadomienia

Nie ma Firebase Cloud Messaging. Powiadomienia działają wyłącznie lokalnie, gdy aplikacja jest otwarta.
