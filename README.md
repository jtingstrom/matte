# Mattekluringen 🧮

Kluriga matteuppgifter för årskurs 4–7 i olympiadstil, på svenska och engelska.

- **Föräldrakonto** (e-post + lösenord) med valfritt antal **barnprofiler**
- **Quiz** med 10 uppgifter: blandat, per område eller "träna på det svåra" (viktat mot uppgifter barnet ofta svarar fel på)
- Direkt rätt/fel med **förklaring** efter varje svar
- **Statistik** per barn: andel rätt per område, aktivitet per dag, senaste quizen
- 39 uppgiftsgeneratorer som skapar nya varianter varje gång. Svaren räknas fram i koden och testas automatiskt.

## Teknik

Ren HTML/CSS/JS utan byggsteg, hostas på GitHub Pages. Data i Supabase (tabeller `matte_children`, `matte_sessions`, `matte_answers` med Row Level Security, så att varje förälder bara ser sina egna barn).

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

## Supabase-inställningar

Under **Authentication → URL Configuration** i Supabase måste sidans adress
(t.ex. `https://jtingstrom.github.io/matte/`) finnas under *Redirect URLs*.
Annars fungerar inte länkarna i bekräftelse- och återställningsmejlen.
