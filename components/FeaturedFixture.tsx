import type { Fixture } from "@/components/FixtureCard";

type FeaturedFixtureProps = {
  fixture: Fixture;
};

export default function FeaturedFixture({
  fixture,
}: FeaturedFixtureProps) {
  const score = fixture.score?.fullTime;
  const hasScore = score?.home != null && score?.away != null;

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
        Selected fixture
      </p>

      <div className="mt-8 flex items-center justify-between gap-6">
        <h2 className="text-2xl font-bold">{fixture.homeTeam.name}</h2>

        <p className="text-5xl font-bold">
          {hasScore ? `${score.home}–${score.away}` : "vs"}
        </p>

        <h2 className="text-right text-2xl font-bold">
          {fixture.awayTeam.name}
        </h2>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Lineups will be connected in Milestone 9
      </p>
    </section>
  );
}