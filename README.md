# Telmor Praca PWA

Wersja: **16.0 - 2106262222**

To jest przepisana od zera, czysta wersja PWA pod GitHub Pages.

## Najważniejsze cechy

- brak Firebase,
- brak npm,
- brak Vite,
- brak `package-lock.json`,
- brak `node_modules`,
- brak kompilacji,
- działa jako statyczna strona z GitHub Pages,
- zapis danych lokalnie w przeglądarce przez `localStorage`,
- powiadomienia tylko w otwartej aplikacji,
- tryb offline po pierwszym uruchomieniu dzięki `service-worker.js`.

## Pliki aplikacji

```text
index.html
app.js
styles.css
manifest.webmanifest
service-worker.js
offline.html
404.html
.nojekyll
icons/
upload_to_github.ps1
```

## Publikacja

Uruchom w PowerShellu z głównego katalogu projektu:

```powershell
.\upload_to_github.ps1
```

Skrypt:

1. klonuje repozytorium `https://github.com/tomalawsb/Telmor-Praca.git`,
2. czyści stare pliki na branchu `main`,
3. kopiuje aktualną aplikację,
4. robi commit i push,
5. tworzy czysty branch `gh-pages`,
6. kopiuje tylko pliki potrzebne do działania strony,
7. wymusza aktualizację brancha `gh-pages`.

## Ustawienie GitHub Pages

Na GitHubie ustaw:

```text
Settings -> Pages -> Build and deployment
Source: Deploy from a branch
Branch: gh-pages
Folder: /root
```

Adres aplikacji:

```text
https://tomalawsb.github.io/Telmor-Praca/
```
