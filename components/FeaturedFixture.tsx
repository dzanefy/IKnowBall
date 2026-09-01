import Image from "next/image";
import type { Fixture } from "@/components/FixtureCard";
import StatusBadge from "@/components/StatusBadge";

type FeaturedFixtureProps = {
  fixture: Fixture;
};

export default function FeaturedFixture({
  fixture,
}: FeaturedFixtureProps) {
  const score = fixture.score?.fullTime;
  const homeScore = score?.home;
  const awayScore = score?.away;
  const hasScore = homeScore != null && awayScore != null;

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
          Selected fixture
        </p>

        <StatusBadge status={fixture.status} />
      </div>

      <p className="mt-3 text-sm text-slate-400">
        Gameweek {fixture.matchday ?? "Unknown"} ·{" "}
        {new Date(fixture.utcDate).toLocaleString()}
      </p>

      {fixture.lastUpdated && (
        <p className="mt-2 text-xs text-slate-500">
          Data updated {new Date(fixture.lastUpdated).toLocaleString()}
        </p>
      )}

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
        <div className="flex min-w-0 items-center gap-4">
          {fixture.homeTeam.crest && (
            <Image
              src={fixture.homeTeam.crest}
              alt={`${fixture.homeTeam.name} crest`}
              width={64}
              height={64}
              className="h-16 w-16 shrink-0 object-contain"
            />
          )}

          <h2 className="min-w-0 break-words text-xl font-bold">
            {fixture.homeTeam.name}
          </h2>
        </div>

        <p className="whitespace-nowrap text-5xl font-bold">
          {hasScore ? `${homeScore}–${awayScore}` : "vs"}
        </p>

        <div className="flex min-w-0 flex-row-reverse items-center gap-4 text-right">
          {fixture.awayTeam.crest && (
            <Image
              src={fixture.awayTeam.crest}
              alt={`${fixture.awayTeam.name} crest`}
              width={64}
              height={64}
              className="h-16 w-16 shrink-0 object-contain"
            />
          )}

          <h2 className="min-w-0 break-words text-xl font-bold">
            {fixture.awayTeam.name}
          </h2>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        Lineups will be connected in Milestone 9
      </p>
    </section>
  );
}
