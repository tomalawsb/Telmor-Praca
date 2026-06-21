# Raport poprawek 15.3 - 2106262148

## Cel
Naprawa pustej strony po publikacji na GitHub Pages.

## Zmiany
- zmieniono manifest PWA na sciezki wzgledne: `start_url: ./`, `scope: ./`, ikony `./icons/...`;
- zmieniono linki w `index.html` na sciezki wzgledne;
- dodano `public/.nojekyll`;
- dodano `public/404.html`;
- przygotowano nowy `upload_to_github.ps1`, ktory synchronizuje kod na `main` i gotowa aplikacje na branch `gh-pages`;
- usuwanie starych plikow z GitHuba odbywa sie przez czyszczenie brancha `gh-pages` i ponowne skopiowanie aktualnego `dist`.

## Wazne ustawienie na GitHub
Po wyslaniu projektu ustaw GitHub Pages na:
`Settings -> Pages -> Deploy from a branch -> gh-pages -> / (root)`

## Firebase
Nie dodano Firebase. Projekt zostaje lokalnym PWA.
