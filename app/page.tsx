"use client";

import { useEffect, useState } from "react";

type Fixture = {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: {
    name: string;
  };
  awayTeam: {
    name: string;
  };
  score?: {
    fullTime?: {
      home: number | null;
      away: number | null;
    };
  };
};

export default function Home() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/fixtures")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load fixtures");
        }

        return response.json();
      })
      .then((data) => {
        setFixtures(data.matches ?? []);
      })
      .catch(() => {
        setError("Fixtures could not be loaded.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-lime-400">
          Premier League 2026/27
        </p>

        <h1 className="text-5xl font-bold tracking-tight">iknowball</h1>

        <p className="mt-4 max-w-xl text-slate-400">
          Football forecasts, fixture data and lineup intelligence.
        </p>

        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-semibold">Fixtures</h2>

          {loading && <p className="text-slate-400">Loading fixtures...</p>}

          {error && <p className="text-red-400">{error}</p>}

          {!loading && !error && fixtures.length === 0 && (
            <p className="text-slate-400">No fixtures available yet.</p>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {fixtures.map((fixture) => (
              <article
                key={fixture.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <p className="text-sm text-slate-400">
                  {new Date(fixture.utcDate).toLocaleString()}
                </p>

                <div className="mt-5 flex items-center justify-between gap-4">
                  <span className="font-medium">{fixture.homeTeam.name}</span>
                  <span className="text-sm text-slate-500">vs</span>
                  <span className="text-right font-medium">
                    {fixture.awayTeam.name}
                  </span>
                </div>

                <p className="mt-5 text-sm text-lime-400">
                  {fixture.status}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}