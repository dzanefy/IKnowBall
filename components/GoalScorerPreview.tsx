"use client";

import { useEffect, useState } from "react";

type GoalEvent = {
  minute: number | null;
  extra_minute: number | null;
  team_side: "home" | "away" | string;
  event_type: string;
  player?: {
    player_name?: string;
  };
};

type GoalScorerPreviewProps = {
  matchId: number;
  homeTeamName: string;
  awayTeamName: string;
};

function formatMinute(goal: GoalEvent) {
  if (goal.minute == null) {
    return "?";
  }

  return `${goal.minute}${
    goal.extra_minute ? `+${goal.extra_minute}` : ""
  }'`;
}

export default function GoalScorerPreview({
  matchId,
  homeTeamName,
  awayTeamName,
}: GoalScorerPreviewProps) {
  const [goals, setGoals] = useState<GoalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/events/${matchId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load goals");
        }

        return response.json();
      })
      .then((data) => {
        const matchGoals = (data.data?.events ?? []).filter(
          (event: GoalEvent) => event.event_type === "goal"
        );

        setGoals(matchGoals);
      })
      .catch(() => {
        setGoals([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [matchId]);

  if (loading) {
    return (
      <p className="mt-4 text-sm text-slate-500">
        Loading goals...
      </p>
    );
  }

  const homeGoals = goals.filter((goal) => goal.team_side === "home");
  const awayGoals = goals.filter((goal) => goal.team_side === "away");

  return (
    <div className="mt-5 grid gap-3 border-t border-slate-800 pt-4 text-sm sm:grid-cols-2">
      <div>
        <p className="font-semibold text-slate-300">{homeTeamName}</p>

        {homeGoals.length === 0 ? (
          <p className="mt-1 text-slate-500">No goals</p>
        ) : (
          homeGoals.map((goal, index) => (
            <p key={`${goal.minute}-${index}`} className="mt-1 text-slate-400">
              ⚽ {goal.player?.player_name ?? "Player unavailable"}{" "}
              <span className="text-slate-500">{formatMinute(goal)}</span>
            </p>
          ))
        )}
      </div>

      <div>
        <p className="font-semibold text-slate-300">{awayTeamName}</p>

        {awayGoals.length === 0 ? (
          <p className="mt-1 text-slate-500">No goals</p>
        ) : (
          awayGoals.map((goal, index) => (
            <p key={`${goal.minute}-${index}`} className="mt-1 text-slate-400">
              ⚽ {goal.player?.player_name ?? "Player unavailable"}{" "}
              <span className="text-slate-500">{formatMinute(goal)}</span>
            </p>
          ))
        )}
      </div>
    </div>
  );
}