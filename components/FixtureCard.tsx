import MatchEvents from "@/components/MatchEvents";

export type Fixture = {
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

type FixtureCardProps = {
  fixture: Fixture;
};

export default function FixtureCard({ fixture }: FixtureCardProps) {
  const score = fixture.score?.fullTime;
  const hasScore = score?.home != null && score?.away != null;

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400">
        {new Date(fixture.utcDate).toLocaleString()}
      </p>

      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="font-medium">{fixture.homeTeam.name}</span>

        <span className="text-lg font-bold">
          {hasScore ? `${score.home} – ${score.away}` : "vs"}
        </span>

        <span className="text-right font-medium">{fixture.awayTeam.name}</span>
      </div>

      <p className="mt-5 text-sm text-lime-400">
        {formatFixtureStatus(fixture.status)}
      </p>

      {fixture.status === "FINISHED" && fixture.footballdata?.match_id && (
        <MatchEvents
          matchId={fixture.footballdata.match_id}
          homeTeamName={fixture.homeTeam.name}
          awayTeamName={fixture.awayTeam.name}
        />
      )}
    </article>
  );
}
