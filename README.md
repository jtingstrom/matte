# Mattekluringen 🧮

Problemlösning i matematik för årskurs 4–7, på svenska och engelska. Uppgifterna liknar dem i matematiktävlingar (olympiadstil).

- **Samma konton som cyberdyne.se**: barnen loggar in med namn och lösenord, ingen e-post behövs
- **Vuxen/lärare** loggar in med cyberdynes lärarlösenord: statistik för alla elever och möjlighet att sätta nytt lösenord åt den som glömt
- **Quiz** med 10 uppgifter: blandat, per område eller "träna på det svåra" (viktat mot uppgifter barnet ofta svarar fel på)
- Direkt rätt/fel med **förklaring** efter varje svar
- **Gästläge**: räkna direkt utan konto (inget sparas i databasen)
- **Statistik** för varje barn (egen vy) och för alla (lärarvyn)
- 39 uppgiftsgeneratorer som skapar nya varianter varje gång. Svaren räknas fram i koden och testas automatiskt.

## Teknik

Ren HTML/CSS/JS utan byggsteg, hostas på GitHub Pages. Data i Supabase, i samma projekt som cyberdyne.se. Tabellerna `matte_sessions` och `matte_answers` kopplas till `konton` och kan bara nås via databasfunktionerna `matte_start`, `matte_answer`, `matte_finish`, `matte_me` och `matte_teacher_stats`, som kontrollerar inloggningstoken. Inloggningen använder cyberdynes `register_player`, `login_player`, `teacher_login` och `teacher_reset_password`.

| Fil | Innehåll |
|---|---|
| `index.html` | Sidan |
| `css/style.css` | Utseende |
| `js/app.js` | Inloggning, profiler, quiz, statistik |
| `js/questions.js` | Alla uppgiftsgeneratorer |
| `js/i18n.js` | Texter på svenska och engelska |
| `js/config.js` | Supabase-adress och publik nyckel |

## Köra lokalt

```bash
python3 -m http.server 8000
# öppna http://localhost:8000
```
