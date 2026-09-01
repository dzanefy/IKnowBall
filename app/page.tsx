"use client";

import { useEffect, useState } from "react";
import MatchEvents from "@/components/MatchEvents";

type Fixture = {
  id: number;
  utcDate: string;
  status: string;
  matchday: number | null;
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
  footballdata?: {
    match_id: number;
  } | null;
};

function formatFixtureStatus(status: string) {
  const labels: Record<string, string> = {
    TIMED: "Upcoming",
    SCHEDULED: "Upcoming",
    IN_PLAY: "Live",
    PAUSED: "Half-time",
    FINISHED: "Finished",
    POSTPONED: "Postponed",
    CANCELLED: "Cancelled",
    SUSPENDED: "Suspended",
  };

  return labels[status] ?? status.replaceAll("_", " ");
}

export default function Home() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
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

               <div className="grid gap-4 md:grid-cols-2">
  {matchdayFixtures.map((fixture) => {
    const score = fixture.score?.fullTime;
    const hasScore = score?.home != null && score?.away != null;

    return (
      <article
        key={fixture.id}
        className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
      >
        <p className="text-sm text-slate-400">
          {new Date(fixture.utcDate).toLocaleString()}
        </p>

        <div className="mt-5 flex items-center justify-between gap-4">
          <span className="font-medium">
            {fixture.homeTeam.name}
          </span>

          <span className="text-lg font-bold">
            {hasScore ? `${score.home} – ${score.away}` : "vs"}
          </span>

          <span className="text-right font-medium">
            {fixture.awayTeam.name}
          </span>
        </div>

                      <p className="mt-5 text-sm text-lime-400">
                        {formatFixtureStatus(fixture.status)}
                      </p>
                      {fixture.status === "FINISHED" &&
                        fixture.footballdata?.match_id && (
                          <MatchEvents
                            matchId={fixture.footballdata.match_id}
                            homeTeamName={fixture.homeTeam.name}
                            awayTeamName={fixture.awayTeam.name}
                          />
                      )}
      </article>
    );
  })}
</div>
              </div>
            ))}
        </section>
      </div>
    </main>
  );
} 
