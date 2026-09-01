"use client";

import type { Team } from "@/lib/teams";

type FixtureFiltersProps = {
  teams: Team[];
  gameweeks: number[];
  selectedTeams: string[];
  selectedGameweeks: number[];
  onToggleTeam: (teamName: string) => void;
  onToggleGameweek: (gameweek: number) => void;
  onClear: () => void;
};

const buttonClass =
  "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition";

export default function FixtureFilters({
  teams,
  gameweeks,
  selectedTeams,
  selectedGameweeks,
  onToggleTeam,
  onToggleGameweek,
  onClear,
}: FixtureFiltersProps) {
  const hasFilters = selectedTeams.length > 0 || selectedGameweeks.length > 0;

  return (
    <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Filter fixtures</h2>
        {hasFilters && (
          <button type="button" onClick={onClear} className="text-sm text-[#00E5A0] hover:text-white">
            Clear all
          </button>
        )}
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Teams · choose one or more
      </p>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={onClear}
          className={`${buttonClass} ${selectedTeams.length === 0 ? "border-[#00E5A0] bg-[#00E5A0]/15 text-[#00E5A0]" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}
        >
          All teams
        </button>
        {teams.map((team) => (
          <button
            key={team.slug}
            type="button"
            onClick={() => onToggleTeam(team.name)}
            className={`${buttonClass} ${selectedTeams.includes(team.name) ? "border-[#00E5A0] bg-[#00E5A0]/15 text-[#00E5A0]" : "border-slate-700 text-slate-300 hover:border-slate-500"}`}
          >
            {team.name}
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Gameweeks · choose one or more
      </p>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={onClear}
          className={`${buttonClass} ${selectedGameweeks.length === 0 ? "border-[#6C47FF] bg-[#6C47FF]/15 text-violet-300" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}
        >
          All gameweeks
        </button>
        {gameweeks.map((gameweek) => (
          <button
            key={gameweek}
            type="button"
            onClick={() => onToggleGameweek(gameweek)}
            className={`${buttonClass} ${selectedGameweeks.includes(gameweek) ? "border-[#6C47FF] bg-[#6C47FF]/15 text-violet-300" : "border-slate-700 text-slate-300 hover:border-slate-500"}`}
          >
            Gameweek {gameweek}
          </button>
        ))}
      </div>
    </section>
  );
}
