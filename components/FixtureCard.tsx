import MatchEvents from "@/components/MatchEvents";
import GoalScorerPreview from "@/components/GoalScorerPreview";
import ClubBadge from "@/components/ClubBadge";

export type Fixture = {
  id: number;
  utcDate: string;
  status: string;
  matchday: number | null;
  homeTeam: {
  name: string;
    crest?: string;
  };
  awayTeam: {
    name: string;
    crest?: string;
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
  const homeScore = score?.home;
  const awayScore = score?.away;
  const hasScore = homeScore != null && awayScore != null;

  const winner =
  hasScore && homeScore !== awayScore
    ? homeScore > awayScore
      ? fixture.homeTeam.name
      : fixture.awayTeam.name
    : hasScore
      ? "Draw"
      : null;

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400">
        {new Date(fixture.utcDate).toLocaleString()}
      </p>

      <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
  <span className="flex min-w-0 items-center gap-3 font-semibold">
  <ClubBadge
  name={fixture.homeTeam.name}
  crest={fixture.homeTeam.crest}
/>

  <span className="min-w-0 break-words">
    {fixture.homeTeam.name}
  </span>
</span>

  <span className="whitespace-nowrap text-center text-xl font-bold">
    {hasScore ? `${homeScore} – ${awayScore}` : "vs"}
  </span>

  <span className="flex min-w-0 flex-row-reverse items-center gap-3 text-right font-semibold">
  <ClubBadge
  name={fixture.awayTeam.name}
  crest={fixture.awayTeam.crest}
/>

  <span className="min-w-0 break-words">
    {fixture.awayTeam.name}
  </span>
</span>
</div>

{winner && (
  <p className="mt-4 text-center text-sm font-semibold text-lime-400">
    {winner === "Draw" ? "Draw" : `${winner} won`}
  </p>
)}

      <p
        className={`mt-5 text-sm ${
          fixture.status === "TIMED" || fixture.status === "SCHEDULED"
            ? "text-orange-400"
            : "text-lime-400"
        }`}
      >
        {formatFixtureStatus(fixture.status)}
      </p>
      {fixture.status === "FINISHED" && fixture.footballdata?.match_id && (
  <GoalScorerPreview
    matchId={fixture.footballdata.match_id}
    homeTeamName={fixture.homeTeam.name}
    awayTeamName={fixture.awayTeam.name}
  />
)}

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
