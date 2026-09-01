# iknowball Milestone Tracker

Use this document as the project checklist. Complete and commit one milestone at a time. The goal is not to rush; each milestone should leave the app in a working or testable state.

## Git workflow

Keep `main` as the stable branch. New features, experiments and larger fixes should use their own branches:

```bash
git switch -c feature/short-description
```

Commit work on that feature branch, push it to GitHub, review it, and merge it into `main` when complete. Do not make all future development commits directly on `main`.

Suggested branch names include `feature/match-events`, `feature/predictions`, `feature/lineups` and `fix/fixture-status`.

## Status key

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete

---

## Milestone 1 — Project foundation

**Status:** `[x] Complete`

**Goal:** Create a working Next.js application connected to GitHub.

### Achieve

- [x] Create the Next.js app.
- [x] Add TypeScript, ESLint, Tailwind CSS and App Router.
- [x] Run the app successfully at `http://localhost:3000`.
- [x] Confirm GitHub remote works.
- [x] Create a project README describing iknowball.
- [x] Add `.env.local` to `.gitignore`.

**Suggested commit:**

```text
chore: complete initial project foundation
```

---

## Milestone 2 — Connect football data

**Status:** `[x] Complete`

**Goal:** Retrieve real Premier League fixtures securely from football-data.org.

### Create

- [x] Create `.env.example` containing `FOOTBALL_DATA_API_KEY=`.
- [x] Confirm `.env.local` contains the real key and is ignored by Git.
- [x] Create `app/api/fixtures/route.ts`.
- [x] Send the API key only from the server.
- [x] Request Premier League fixtures.
- [x] Add friendly error handling.
- [x] Add Footballdata.io as a current-season enrichment provider.
- [x] Match provider fixtures using teams and kickoff time, not vendor IDs alone.
- [x] Fall back to football-data.org when Footballdata.io is unavailable.
- [x] Test `/api/fixtures` in the browser.

### Complete when

- The browser returns real fixture data.
- The API key does not appear in the browser address, page source or Git status.
- Missing-key and failed-request states return understandable errors.

**Suggested commit:**

```text
feat: connect premier league fixture data
```

---

## Milestone 3 — Display real fixtures

**Status:** `[x] Complete`

**Goal:** Replace the default homepage with an initial iknowball fixture experience.

### Create

- [x] Create a fixture data type.
- [x] Add a fixture card component.
- [x] Display home team, away team, date and status.
- [x] Display score when available.
- [x] Show goal scorers and scoring minutes for completed matches.
- [x] Show missed penalties for completed matches.
- [x] Show red cards and dismissal minutes for completed matches.
- [x] Add loading and error states.
- [x] Add an empty-state message.
- [x] Make the page responsive on mobile.

### Complete when

- Real Premier League fixtures appear at the homepage.
- The page remains usable if the API is slow or unavailable.
- Event details are shown only for completed matches and display an unavailable state when the provider does not supply them.
- Substitutions show the team, player coming on, player coming off and available substitution time.

**Suggested commit:**

```text
feat: display premier league fixtures
```

---

## Milestone 4 — Build the visual identity

**Status:** `[x] Complete`

**Goal:** Make iknowball look like a clean football analytics product.

### Create

- [x] Choose final colours and typography.
- [x] Create a reusable header.
- [x] Create club cards.
- [x] Create match cards.
- [x] Create status and freshness badges.
- [x] Add consistent spacing and responsive layouts.
- [x] Remove generic Next.js branding.

### Complete when

- The homepage clearly looks like iknowball.
- The design works on desktop and mobile.
- Components use a consistent visual system.

**Suggested commit:**

```text
style: establish iknowball visual identity
```

---

## Milestone 5 — Team selection and team pages

**Status:** `[x] Complete`

**Goal:** Allow users to select a Premier League team and see its fixtures.

### Create

- [x] Display the 20 Premier League teams.
- [x] Add team slugs and dynamic routes.
- [x] Create `/teams/[slug]`.
- [x] Show the selected team’s next fixture.
- [x] Show upcoming fixtures.
- [x] Show recent results where available.
- [x] Add a not-found state for invalid teams.

### Complete when

- A user can select any team and reach its team page.
- The team page shows the correct next fixture.

**Suggested commit:**

```text
feat: add premier league team pages
```

---

## Milestone 6 — Store football data

**Status:** `[ ] Not started`

**Goal:** Save provider data so visitors do not consume API requests directly.

### Create

- [ ] Create a free Neon or Supabase PostgreSQL database.
- [ ] Add Prisma.
- [ ] Create team and fixture tables.
- [ ] Add `DATABASE_URL` locally and in Vercel later.
- [ ] Create a sync script.
- [ ] Upsert fixtures without duplicates.
- [ ] Record when data was last updated.

### Complete when

- Fixture pages read from your database.
- Running the sync twice does not create duplicates.
- The app can still show previously saved data if the provider is temporarily unavailable.

**Suggested commit:**

```text
feat: store football fixtures in postgres
```

---

## Milestone 7 — Add the prediction baseline

**Status:** `[ ] Not started`

**Goal:** Generate an explainable first forecast.

### Create

- [ ] Calculate recent goals scored and conceded.
- [ ] Calculate home and away performance.
- [ ] Add a home-advantage value.
- [ ] Calculate expected goals for both teams.
- [ ] Use Poisson probabilities to calculate possible scores.
- [ ] Display the most likely score.
- [ ] Display home win, draw and away win probabilities.

### Complete when

- Every eligible upcoming fixture has a forecast.
- Probabilities add up to 100%.
- The forecast shows its timestamp and model version.

**Suggested commit:**

```text
feat: add explainable forecast baseline
```

---

## Milestone 8 — Preserve forecast history

**Status:** `[ ] Not started`

**Goal:** Record how predictions change and compare them with actual results.

### Create

- [ ] Add forecast snapshot storage.
- [ ] Save pre-lineup forecasts.
- [ ] Save later revised forecasts.
- [ ] Save final match results.
- [ ] Show forecast history on the fixture page.
- [ ] Show forecast versus actual result.

### Complete when

- Old forecasts are never silently overwritten.
- A completed fixture shows both forecast and actual result.

**Suggested commit:**

```text
feat: preserve versioned forecast history
```

---

## Milestone 9 — Add lineups and player availability

**Status:** `[ ] Not started`

**Goal:** Show predicted and confirmed starting lineups for both teams.

### Create

- [ ] Confirm the provider supplies lineup data under your plan.
- [ ] Normalize player and lineup responses.
- [ ] Display formations.
- [ ] Render 11 starters per team on a pitch.
- [ ] Show predicted, partially confirmed and confirmed states.
- [ ] Show unavailable players where data exists.
- [ ] Recalculate the forecast after confirmed lineups arrive.

### Complete when

- Both teams’ lineups render correctly.
- Confirmed lineups visibly replace predicted lineups.
- A new forecast snapshot is saved after confirmation.

**Suggested commit:**

```text
feat: add lineup forecasts and confirmed lineup updates
```

---

## Milestone 10 — Automate updates

**Status:** `[ ] Not started`

**Goal:** Keep data fresh without manually running scripts.

### Create

- [ ] Add daily fixture sync.
- [ ] Add matchday refreshes.
- [ ] Poll only important upcoming fixtures on the free plan.
- [ ] Add retries and backoff.
- [ ] Add job logs.
- [ ] Add quota tracking.
- [ ] Add stale-data warnings.

### Complete when

- Fixtures update automatically.
- Failed jobs do not break the public website.
- API usage stays within the free quota.

**Suggested commit:**

```text
feat: automate quota-aware football data updates
```

---

## Milestone 11 — Security and reliability

**Status:** `[ ] Not started`

**Goal:** Protect the app, API key and database.

### Create

- [ ] Keep all provider requests server-side.
- [ ] Add public API rate limiting.
- [ ] Validate query parameters and provider responses.
- [ ] Protect admin and sync routes.
- [ ] Add secure HTTP headers.
- [ ] Remove secrets from logs.
- [ ] Add database backups.
- [ ] Add error monitoring and uptime monitoring.

### Complete when

- Secrets are absent from GitHub and browser bundles.
- Invalid requests are safely rejected.
- Provider failures produce graceful UI states.

**Suggested commit:**

```text
security: harden iknowball data access
```

---

## Milestone 12 — Deploy the personal beta

**Status:** `[ ] Not started`

**Goal:** Publish a stable personal version on Vercel.

### Create

- [ ] Connect the GitHub repository to Vercel.
- [ ] Add production environment variables.
- [ ] Confirm database access from Vercel.
- [ ] Add a production health check.
- [ ] Test mobile and desktop layouts.
- [ ] Add methodology and data-attribution pages.
- [ ] Add the informational forecast disclaimer.

### Complete when

- The production URL loads successfully.
- Real fixtures and forecasts appear in production.
- A GitHub push creates a new deployment.
- No secret appears in client-side code.

**Suggested commit:**

```text
release: publish iknowball personal beta
```

---

## Optional Milestone 13 — Scale when necessary

**Status:** `[ ] Optional`

Only begin this milestone when measurements show that the free setup is insufficient.

### Upgrade triggers

- API quota is regularly exhausted.
- Confirmed-lineup polling is too infrequent.
- More seasons or competitions are needed.
- Website traffic increases.
- Database storage or connection limits are reached.

### Possible upgrades

- API-Football Pro: currently listed at $19/month and 7,500 requests/day.
- API-Football Ultra: currently listed at $29/month and 75,000 requests/day.
- API-Football Mega: currently listed at $39/month and 150,000 requests/day.
- Paid database tier with connection pooling.
- Redis/CDN caching.
- Dedicated background worker or queue.
- Second licensed football-data provider for resilience.

**Suggested commit:**

```text
chore: scale data infrastructure for increased usage
```

---

## Current next action

Complete Milestone 2 by creating and testing:

```text
app/api/fixtures/route.ts
```

Do not begin predictions, databases or lineups until the basic fixture API connection works.
