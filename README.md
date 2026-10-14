# NewsHub

A React + Tailwind news reader with category pages, infinite scroll and a light/dark toggle, built on [NewsAPI](https://newsapi.org).

## Run

```bash
npm install
npm start
```

Without configuration the app shows **20 bundled sample articles** (paginated like the real API) so it works offline. To load live headlines:

```bash
echo "REACT_APP_NEWS_API=your_newsapi_key" > .env.local
npm start
```

> `REACT_APP_*` variables are compiled into the public JavaScript bundle, so anyone who opens the site can read the key. Fine for local use; for a public deployment put a small proxy in front of NewsAPI. NewsAPI's free developer plan also only answers requests from `localhost`.

## Scripts

| | |
|---|---|
| `npm start` | dev server |
| `npm test` | unit tests (Jest + Testing Library) |
| `npm run build` | production build (uses relative paths, so it works on any sub-path) |
| `npm run deploy` | publish `build/` to GitHub Pages with `gh-pages` |

Routing uses `HashRouter` (`/#/sports`), so deep links keep working on static hosting such as GitHub Pages.

## Project structure

```
src/
├── api.js                   fetchHeadlines(): NewsAPI or bundled samples
├── App.js                   routes + theme state
└── Component/
    ├── Navbar.js  News.js  NewsSection.js  Spinner.js
    └── assets/general.json  sample articles
```
