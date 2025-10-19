# Portfolio Fotograficzne (klient-side)

Prosty, nowoczesny szablon portfolio fotograficznego działający w całości po stronie klienta.

Jak to działa

- Strona działa z plikami znajdującymi się w `public/`.
- Galeria ładuje dane z `images.json` (lista obiektów: {src, title, category}).
- Aby użyć lokalnych obrazów, zmień `src` w `images.json` na ścieżki względne (np. `./images/1.jpg`) i umieść pliki w `public/images/`.

Uruchomienie lokalnie
Możesz otworzyć `index.html` bez serwera, ale niektóre przeglądarki blokują fetch lokalnych plików. Zalecane uruchomienie prostego serwera, np. w PowerShell:

```powershell
# Uruchom w katalogu public
python -m http.server 8000; Start-Process "http://localhost:8000"
```

Dostosowanie

- Edytuj `styles.css` aby zmienić kolory i animacje.
- Zmodyfikuj `images.json` aby dodać zdjęcia lub kategorie.

Licencja
Wszystko demo — zdjęcia pochodzą z Unsplash. Podmień własnymi plikami kiedy chcesz.
