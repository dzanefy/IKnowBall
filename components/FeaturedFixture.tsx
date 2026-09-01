import type { Fixture } from "@/components/FixtureCard";
import StatusBadge from "@/components/StatusBadge";
import ClubCard from "@/components/ClubCard";

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
        <ClubCard
          name={fixture.homeTeam.name}
          crest={fixture.homeTeam.crest}
          badgeSize="large"
        />

        <p className="whitespace-nowrap text-5xl font-bold">
          {hasScore ? `${homeScore}–${awayScore}` : "vs"}
        </p>

        <ClubCard
          name={fixture.awayTeam.name}
          crest={fixture.awayTeam.crest}
          align="right"
          badgeSize="large"
        />
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        Lineups will be connected in Milestone 9
      </p>
    </section>
  );
}
