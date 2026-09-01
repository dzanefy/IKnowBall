import Link from "next/link";
import { premierLeagueTeams } from "@/lib/teams";
import ClubBadge from "@/components/ClubBadge";

export default function TeamGrid() {
  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-semibold">Teams</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {premierLeagueTeams.map((team) => (
          <Link
            key={team.slug}
            href={`/teams/${team.slug}`}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-[#00E5A0] hover:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              <ClubBadge name={team.name} crest={team.crest} size="large" />
              <p className="font-semibold">{team.name}</p>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              View team
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
