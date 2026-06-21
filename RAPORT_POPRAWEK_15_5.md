# Telmor Praca PWA 15.5 - poprawka npm / GitHub Pages

Poprawki:
- naprawiono `package-lock.json`, który zawierał wewnętrzne adresy rejestru npm z paczki testowej;
- ustawiono publiczny rejestr `https://registry.npmjs.org/` w skrypcie wysyłającym;
- dodano automatyczną naprawę `package-lock.json` przed instalacją zależności;
- dodano awaryjne przejście z `npm ci` na `npm install`, gdy `node_modules` jest zablokowany przez Dropbox, edytor albo antywirusa;
- pozostawiono publikację gotowej aplikacji na branch `gh-pages`.
