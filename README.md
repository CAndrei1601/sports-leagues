# Sports Leagues

A single-page app that consumes [TheSportsDB](https://www.thesportsdb.com/free_sports_api) All Leagues API, lists sports leagues with search + sport filtering, and reveals a season badge on click.

Built with **Vue 3 (`<script setup>`) + TypeScript + Vite + SCSS**.

## Getting started

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # type-check + production build
npm run preview  # preview the production build
npm run lint     # eslint (eslint-plugin-vue + typescript) with --fix
npm run format   # prettier --write on src/
```

Formatting is owned by **Prettier** and code-quality by **ESLint** (`eslint-plugin-vue`), with `@vue/eslint-config-prettier` disabling any conflicting stylistic rules so the two never fight. Editor defaults (format-on-save + Prettier) are committed in `.vscode/settings.json` so formatting is deterministic across machines.

Requires Node 18+.

## Features

- Fetches and lists leagues showing `strLeague`, `strSport`, and `strLeagueAlternate` (when present).
- **Search bar** — filters by league name (and alternate name), debounced (250ms) so typing stays responsive on large lists.
- **Sport dropdown** — options are derived from the data (unique `strSport` values), never hardcoded.
- **Click a league** → calls the Season Badge API and displays the first available badge. Click again to hide.
- **Caching** — the league list is fetched once (deduped in-flight promise); badges are cached per league id in memory **and** `sessionStorage`, so repeat clicks and page refreshes never re-hit the network.
- Loading / error (with retry) / empty states throughout.
- Responsive layout: card grid collapses to a single column on mobile; controls stack.
- Keyboard accessible cards (Enter / Space to toggle a badge).

## Architecture

```
src/
├── api/leaguesApi.ts        # fetch + caching (leagues + badges, sessionStorage)
├── composables/
│   ├── useLeagues.ts        # loads leagues → { data, pending, error, refresh }
│   ├── useLeagueFilters.ts  # search + sport filtering (computed, data-driven options)
│   ├── useBadge.ts          # per-league badge loader + toggle
│   └── useDebounce.ts       # debounced mirror of a source ref
├── components/
│   ├── LeagueList.vue       # container: wires state + filters to presentation
│   ├── SearchBar.vue        # v-model input
│   ├── SportFilter.vue      # v-model <select>
│   ├── LeagueCard.vue       # one league + badge toggle
│   ├── BadgeImage.vue       # badge with loading / missing / error states
│   └── ui/StateMessage.vue  # reusable loading / error / empty block
├── types/league.ts          # API model interfaces
└── styles/                  # SCSS tokens + global reset
```

**Design principle:** components are presentational (props in, events out); all data-fetching, caching, and filtering logic lives in the API layer and composables. This keeps the parts that the assignment is really testing — state management and API integration — isolated and easy to reason about.

## Design decisions

- **Vite + Vue 3 over Nuxt.** The brief asks for an SPA, so a plain Vite build avoids the SSR/routing overhead of Nuxt. Instead of Nuxt's `useAsyncData`, `useLeagues` gives the same `{ data, pending, error, refresh }` ergonomics with full control over caching.
- **No Pinia / no UI library.** State is small enough to live in composables; hand-written SCSS shows more of the frontend work the assignment evaluates.
- **Sport options derived from data.** Robust to whatever the API returns rather than assuming a fixed sport list.
- **`customRef`-free debounce.** A debounced *mirror* ref keeps the input instant while throttling the filter work — the input never lags behind the user's keystrokes.

## Known constraint: the free API tier

The public key `3` at `all_leagues.php` currently returns only **10 leagues (all Soccer, all with a `null` alternate name)**. That's a limitation of the free API tier, not the app — the UI is fully data-driven, so with a richer dataset the sport dropdown would populate with multiple sports and alternate names would render automatically. The badge lookup (`search_all_seasons.php`) returns full data and is unaffected.

## AI tools used

- **Claude (Anthropic)** — used for project scaffolding, writing the composables/components, SCSS styling, and this README. All architecture and design decisions were reviewed and directed rather than accepted blindly; the app was verified running in a browser (list renders, filtering works, badges load and cache, no console errors).

## Possible next steps (out of scope for the time-box)

- List virtualization (`vue-virtual-scroller`) if the API returned thousands of rows.
- Unit tests (Vitest) on `useLeagueFilters` (filtering) and `leaguesApi` (caching).
- Deep-linkable filters via URL query params.
