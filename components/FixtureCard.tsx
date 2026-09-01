import MatchEvents from "@/components/MatchEvents";
import GoalScorerPreview from "@/components/GoalScorerPreview";
import ClubCard, {
  type FormEntry,
  type FormResult,
} from "@/components/ClubCard";
import StatusBadge from "@/components/StatusBadge";

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

  lastUpdated?: string;
};

type FixtureCardProps = {
  fixture: Fixture;
  formByTeam?: Record<string, FormEntry[]>;
};

function normalizeTeamName(name: string) {
  return name
    .toLowerCase()
    .replace(/\b(fc|afc)\b/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function getRecentForm(
  entries: FormEntry[] | undefined,
  fixtureDate: string,
  fixtureId: number
): FormResult[] | undefined {
  return entries
    ?.filter(
      (entry) => entry.date < fixtureDate || entry.fixtureId === fixtureId
    )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)
    .map((entry) => entry.result);
}

export default function FixtureCard({ fixture, formByTeam }: FixtureCardProps) {
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
  <ClubCard
    name={fixture.homeTeam.name}
    crest={fixture.homeTeam.crest}
    form={getRecentForm(
      formByTeam?.[normalizeTeamName(fixture.homeTeam.name)],
      fixture.utcDate,
      fixture.id
    )}
  />

  <span className="whitespace-nowrap text-center text-xl font-bold">
    {hasScore ? `${homeScore} – ${awayScore}` : "vs"}
  </span>

  <ClubCard
    name={fixture.awayTeam.name}
    crest={fixture.awayTeam.crest}
    align="right"
    form={getRecentForm(
      formByTeam?.[normalizeTeamName(fixture.awayTeam.name)],
      fixture.utcDate,
      fixture.id
    )}
  />
</div>

{winner && (
  <p className="mt-4 text-center text-sm font-semibold text-lime-400">
    {winner === "Draw" ? "Draw" : `${winner} won`}
  </p>
)}

      <div className="mt-5">
        <StatusBadge status={fixture.status} />
      </div>
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
