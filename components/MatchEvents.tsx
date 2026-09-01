"use client";

import { useState } from "react";

type MatchEvent = {
  minute: number | null;
  extra_minute: number | null;
  team_side: "home" | "away" | string;
  event_type: string;
  player?: {
    player_name?: string;
  };
  player_in?: {
    player_name?: string;
  };
  player_out?: {
    player_name?: string;
  };
  raw?: {
    player_out_time?: string | null;
  };
  detail?: string;
};

type MatchEventsProps = {
  matchId: number;
  homeTeamName: string;
  awayTeamName: string;
};

function formatEventMinute(event: MatchEvent) {
  if (event.minute != null) {
    return `${event.minute}${event.extra_minute ? `+${event.extra_minute}` : ""}'`;
  }

  const providerTime = event.raw?.player_out_time?.trim();
  return providerTime || "Time unavailable";
}

export default function MatchEvents({
  matchId,
  homeTeamName,
  awayTeamName,
}: MatchEventsProps) {
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [opened, setOpened] = useState(false);

  async function loadEvents() {
    if (opened) {
      setOpened(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/events/${matchId}`);

      if (!response.ok) {
        throw new Error("Unable to load match events");
      }

      const data = await response.json();
      setEvents(data.data?.events ?? []);
      setOpened(true);
    } catch {
      setError("Match events are unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={loadEvents}
        className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-lime-400 hover:text-lime-400"
      >
        {loading
          ? "Loading events..."
          : opened
            ? "Hide match events"
            : "View match events"}
      </button>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {opened && !loading && !error && (
        <div className="mt-4 space-y-2 border-t border-slate-800 pt-4">
          {events.length === 0 ? (
            <p className="text-sm text-slate-500">
              No match events available.
            </p>
          ) : (
            events.map((event, index) => {
              const isSubstitution = event.event_type === "substitution";
              const isGoal = event.event_type === "goal";
              const isYellowCard = event.event_type === "yellow_card";
              const isRedCard = event.event_type === "red_card";
              const teamName =
                event.team_side === "home"
                  ? homeTeamName
                  : event.team_side === "away"
                    ? awayTeamName
                    : "Team unavailable";

              return (
                <div
                  key={`${event.event_type}-${event.minute}-${index}`}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm"
                >
                  {isSubstitution ? (
                    <div className="grid gap-2 sm:grid-cols-[auto_1fr] sm:items-center">
                      <span className="font-semibold text-lime-400">
                        {formatEventMinute(event)}
                      </span>
                      <div>
                        <p className="font-medium text-slate-200">
                          {teamName} substitution
                        </p>
                        <p className="mt-1 text-slate-400">
                          <span className="text-lime-400">On:</span>{" "}
                          {event.player_in?.player_name ??
                            event.player?.player_name ??
                            "Unknown player"}
                          <span className="mx-2 text-slate-600">•</span>
                          <span className="text-red-400">Off:</span>{" "}
                          {event.player_out?.player_name ?? "Unknown player"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-2 sm:grid-cols-[auto_auto_1fr] sm:items-center sm:gap-4">
                      <span className="text-slate-400">
                        {formatEventMinute(event)}
                      </span>
                      <span
                        className={
                          isGoal
                            ? "font-bold text-lime-400"
                            : isYellowCard
                              ? "font-semibold text-yellow-300"
                              : isRedCard
                                ? "font-semibold text-red-400"
                                : "capitalize text-slate-200"
                        }
                      >
                        {isGoal
                          ? "GOAL"
                          : isYellowCard
                            ? "Yellow card"
                            : isRedCard
                              ? "Red card"
                              : event.event_type.replaceAll("_", " ")}
                      </span>
                      <span className="text-slate-400 sm:text-right">
                        {isGoal && (
                          <span className="mr-2 text-slate-500">
                            {teamName}:
                          </span>
                        )}
                        {event.player?.player_name ?? event.detail ?? "Player data unavailable"}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
