"use client";

import { useState } from "react";
import MatchEvents from "@/components/MatchEvents";
import GoalScorerPreview from "@/components/GoalScorerPreview";
import ClubCard, {
  type FormEntry,
  type FormResult,
} from "@/components/ClubCard";
import StatusBadge from "@/components/StatusBadge";
import { createForecast } from "@/lib/forecast";

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
  forecast?: ReturnType<typeof createForecast>;
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

export default function FixtureCard({ fixture, formByTeam, forecast }: FixtureCardProps) {
  const [showForecastInfo, setShowForecastInfo] = useState(false);
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

{forecast && (
  <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950/50 p-4">
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
        {fixture.status === "FINISHED" ? "Prediction vs actual" : "Forecast"}
      </p>

      <button
        type="button"
        aria-label="Explain forecast probabilities"
        aria-expanded={showForecastInfo}
        onClick={() => setShowForecastInfo((current) => !current)}
        className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-600 text-xs font-bold text-slate-300 transition hover:border-lime-400 hover:text-lime-400"
      >
        i
      </button>
    </div>

    {showForecastInfo && (
      <p className="mt-3 rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs leading-5 text-slate-400">
        The predicted scoreline is the single most likely exact result. The
        win percentages combine every possible scoreline where that team
        wins, so a team can have the highest win probability even when the
        most likely exact score is a draw.
      </p>
    )}

    <p className="mt-2 text-lg font-bold">
      Predicted score:{" "}
      {forecast.mostLikelyScore.homeGoals} –{" "}
      {forecast.mostLikelyScore.awayGoals}
    </p>

    {fixture.status === "FINISHED" && hasScore && (
      <p className="mt-2 text-sm text-slate-400">
        Actual score: {homeScore} – {awayScore}
      </p>
    )}

    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
      <span>
        Home
        <strong className="block text-lime-400">
          {(forecast.homeWin * 100).toFixed(0)}%
        </strong>
      </span>

      <span>
        Draw
        <strong className="block text-slate-300">
          {(forecast.draw * 100).toFixed(0)}%
        </strong>
      </span>

      <span>
        Away
        <strong className="block text-purple-400">
          {(forecast.awayWin * 100).toFixed(0)}%
        </strong>
      </span>
    </div>

    <p className="mt-4 text-xs text-slate-500">
      {forecast.modelVersion} · Updated{" "}
      {new Date(forecast.generatedAt).toLocaleString()}
    </p>
  </div>
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
