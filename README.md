# iknowball

iknowball is a public English Premier League prediction web app. Users can choose a Premier League team, view its next fixture, see predicted lineups for both teams, and explore a model forecast for the scoreline and match outcome probabilities.

## Planned features

- Premier League team and fixture selection
- Predicted scorelines and home/draw/away probabilities
- Team form and relevant football statistics
- Predicted and confirmed starting lineups
- Forecast updates when confirmed lineups are released
- Historical fixtures, results and saved forecast snapshots
- No login required for the public app

## Tech stack

- Next.js
- TypeScript
- Tailwind CSS
- PostgreSQL and Prisma
- football-data.org and Footballdata.io providers
- Vercel deployment

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create a `.env.local` file for local secrets. Never commit it to GitHub.

```env
FOOTBALL_DATA_API_KEY=your_api_key_here
FOOTBALLDATA_IO_API_KEY=your_footballdata_io_key_here
DATABASE_URL=your_database_url_here
```

## Project status

iknowball is currently in the initial application setup phase. The next milestone is connecting football fixture data and displaying real Premier League teams and fixtures.

Forecasts are informational estimates and are not guarantees or betting advice.
