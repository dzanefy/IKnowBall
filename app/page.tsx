"use client";

import { useEffect, useState } from "react";
import FixtureCard, { type Fixture } from "@/components/FixtureCard";
import AppHeader from "@/components/AppHeader";
import FeaturedFixture from "@/components/FeaturedFixture";

export default function Home() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    const fixturesByMatchday = fixtures.reduce<Record<string, Fixture[]>>(
    (groups, fixture) => {
      const matchday = fixture.matchday ?? "Unknown";

      if (!groups[matchday]) {
        groups[matchday] = [];
      }

      groups[matchday].push(fixture);

      return groups;
    },
    {}
  );

  useEffect(() => {
    fetch("/api/fixtures")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load fixtures");
        }

        return response.json();
      })
      .then((data) => {
        const loadedFixtures = data.matches ?? [];
        setFixtures(loadedFixtures);
        setSelectedFixture(loadedFixtures[0] ?? null);
      })
      .catch(() => {
        setError("Fixtures could not be loaded.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
  <>
    <AppHeader />

    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-lime-400">
          Premier League 2026/27
        </p>

        <h1 className="text-5xl font-bold tracking-tight">iknowball</h1>

        <p className="mt-4 max-w-xl text-slate-400">
          Football forecasts, fixture data and lineup intelligence.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-start">
          <section>
          <h2 className="mb-6 text-2xl font-semibold">Fixtures</h2>

          {loading && <p className="text-slate-400">Loading fixtures...</p>}

          {error && <p className="text-red-400">{error}</p>}

          {!loading && !error && fixtures.length === 0 && (
            <p className="text-slate-400">No fixtures available yet.</p>
          )}

          {Object.entries(fixturesByMatchday)
            .sort(([a], [b]) => {
              if (a === "Unknown") return 1;
              if (b === "Unknown") return -1;

              return Number(a) - Number(b);
            })
            .map(([matchday, matchdayFixtures]) => (
              <div key={matchday} className="mb-8">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {matchday === "Unknown" ? "Matchday Unknown" : `Gameweek ${matchday}`}
                </h3>

                <div className="grid gap-4">
                  {matchdayFixtures.map((fixture) => (
                    <FixtureCard key={fixture.id} fixture={fixture} />
                  ))}
                </div>
              </div>
            ))}
        </section>

        {selectedFixture && (
          <div className="lg:sticky lg:top-6">
            <FeaturedFixture fixture={selectedFixture} />
          </div>
        )}
        </div>
      </div>
    </main>
  </>
);
}
