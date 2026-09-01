"use client";

import { useEffect, useMemo, useState } from "react";
import FixtureCard, { type Fixture } from "@/components/FixtureCard";
import AppHeader from "@/components/AppHeader";
import FeaturedFixture from "@/components/FeaturedFixture";
import TeamGrid from "@/components/TeamGrid";
import FixtureFilters from "@/components/FixtureFilters";
import { premierLeagueTeams } from "@/lib/teams";
import type { FormEntry, FormResult } from "@/components/ClubCard";

function normalizeTeamName(name: string) {
  return name
    .toLowerCase()
    .replace(/\b(fc|afc)\b/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export default function Home() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedGameweeks, setSelectedGameweeks] = useState<number[]>([]);

  const gameweeks = useMemo(
    () =>
      [...new Set(
        fixtures
          .map((fixture) => fixture.matchday)
          .filter((matchday): matchday is number => matchday != null)
      )].sort((a, b) => a - b),
    [fixtures]
  );

  const filteredFixtures = useMemo(
    () =>
      fixtures.filter((fixture) => {
        const teamMatches =
          selectedTeams.length === 0 ||
          selectedTeams.some((team) => {
            const normalizedTeam = normalizeTeamName(team);

            return (
              normalizedTeam === normalizeTeamName(fixture.homeTeam.name) ||
              normalizedTeam === normalizeTeamName(fixture.awayTeam.name)
            );
          });

        const gameweekMatches =
          selectedGameweeks.length === 0 ||
          (fixture.matchday != null &&
            selectedGameweeks.includes(fixture.matchday));

        return teamMatches && gameweekMatches;
      }),
    [fixtures, selectedGameweeks, selectedTeams]
  );

  const formByTeam = fixtures.reduce<Record<string, FormEntry[]>>(
    (forms, fixture) => {
      const score = fixture.score?.fullTime;

      if (
        fixture.status !== "FINISHED" ||
        score?.home == null ||
        score.away == null
      ) {
        return forms;
      }

      const homeResult: FormResult =
        score.home > score.away ? "W" : score.home < score.away ? "L" : "D";

      const awayResult: FormResult =
        score.away > score.home ? "W" : score.away < score.home ? "L" : "D";

      const homeKey = normalizeTeamName(fixture.homeTeam.name);
      const awayKey = normalizeTeamName(fixture.awayTeam.name);

      forms[homeKey] ??= [];
      forms[awayKey] ??= [];

      forms[homeKey].push({
        fixtureId: fixture.id,
        date: fixture.utcDate,
        result: homeResult,
      });

      forms[awayKey].push({
        fixtureId: fixture.id,
        date: fixture.utcDate,
        result: awayResult,
      });

      return forms;
    },
    {}
  );

  const fixturesByMatchday = filteredFixtures.reduce<
    Record<string, Fixture[]>
  >((groups, fixture) => {
    const matchday = fixture.matchday ?? "Unknown";

    if (!groups[matchday]) {
      groups[matchday] = [];
    }

    groups[matchday].push(fixture);

    return groups;
  }, {});
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
        <TeamGrid />
        <FixtureFilters
          teams={premierLeagueTeams}
          gameweeks={gameweeks}
          selectedTeams={selectedTeams}
          selectedGameweeks={selectedGameweeks}
          onToggleTeam={(teamName) =>
            setSelectedTeams((current) =>
              current.includes(teamName)
                ? current.filter((team) => team !== teamName)
                : [...current, teamName]
            )
          }
          onToggleGameweek={(gameweek) =>
            setSelectedGameweeks((current) =>
              current.includes(gameweek)
                ? current.filter((value) => value !== gameweek)
                : [...current, gameweek]
            )
          }
          onClear={() => {
            setSelectedTeams([]);
            setSelectedGameweeks([]);
          }}
        />
        {selectedFixture && (
          <div className="mt-10">
            <FeaturedFixture fixture={selectedFixture} />
          </div>
          )}

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
                  {matchdayFixtures.map((fixture) => (
                    <FixtureCard
                      key={fixture.id}
                      fixture={fixture}
                      formByTeam={formByTeam}
                    />
                  ))}
                </div>
              </div>
            ))}
        </section>
      </div>
    </main>
  </>
);
}
