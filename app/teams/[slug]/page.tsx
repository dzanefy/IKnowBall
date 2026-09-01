"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import FixtureCard, { type Fixture } from "@/components/FixtureCard";
import ClubBadge from "@/components/ClubBadge";
import { premierLeagueTeams } from "@/lib/teams";

function normalizeTeamName(name: string) {
  return name
    .toLowerCase()
    .replace(/\b(fc|afc)\b/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export default function TeamPage() {
  const { slug } = useParams<{ slug: string }>();
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const team = premierLeagueTeams.find((item) => item.slug === slug);

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

  if (!team) {
    return (
      <main className="min-h-screen bg-[#06060F] px-6 py-12 text-white">
        <h1 className="text-3xl font-bold">Team not found</h1>
        <Link href="/" className="mt-4 block text-[#00E5A0]">
          Return home
        </Link>
      </main>
    );
  }

  const teamFixtures = fixtures
    .filter(
      (fixture) =>
        normalizeTeamName(fixture.homeTeam.name) ===
          normalizeTeamName(team.name) ||
        normalizeTeamName(fixture.awayTeam.name) ===
          normalizeTeamName(team.name)
    )
    .sort(
      (a, b) =>
        new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
    );

  const upcomingFixtures = teamFixtures.filter(
    (fixture) => fixture.status !== "FINISHED"
  );

  const recentResults = teamFixtures
    .filter((fixture) => fixture.status === "FINISHED")
    .reverse();

  return (
    <main className="min-h-screen bg-[#06060F] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm text-[#00E5A0]">
          ← Back to fixtures
        </Link>

        <div className="mt-8 flex items-center gap-4">
          <ClubBadge name={team.name} crest={team.crest} size="large" />
          <div>
            <h1 className="text-4xl font-bold">{team.name}</h1>
            <p className="mt-2 text-slate-400">Team fixtures and results</p>
          </div>
        </div>

        {loading && (
          <p className="mt-10 text-slate-400">Loading fixtures...</p>
        )}

        {error && <p className="mt-10 text-red-400">{error}</p>}

        {!loading && !error && (
          <>
            <section className="mt-12">
              <h2 className="mb-6 text-2xl font-semibold">
                Next fixtures
              </h2>

              {upcomingFixtures.length === 0 ? (
                <p className="text-slate-400">
                  No upcoming fixtures available.
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {upcomingFixtures.map((fixture) => (
                    <FixtureCard key={fixture.id} fixture={fixture} />
                  ))}
                </div>
              )}
            </section>

            <section className="mt-12">
              <h2 className="mb-6 text-2xl font-semibold">
                Recent results
              </h2>

              {recentResults.length === 0 ? (
                <p className="text-slate-400">
                  No recent results available.
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {recentResults.map((fixture) => (
                    <FixtureCard key={fixture.id} fixture={fixture} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}