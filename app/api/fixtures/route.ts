import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type FootballDataMatch = {
  id: number;
  utcDate: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
};

type FootballdataMatch = {
  match_id: number;
  match_date: string;
  home_team?: { team_name?: string; team_logo?: string };
  away_team?: { team_name?: string; team_logo?: string };
  score?: {
    home: number | null;
    away: number | null;
  };
  probabilities?: {
    home_win: number;
    draw: number;
    away_win: number;
  };
};

function cleanTeamName(name = "") {
  return name
    .toLowerCase()
    .replace(/\b(fc|afc)\b/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export async function GET() {
  const storedFixtures = await prisma.fixture.findMany({
  include: {
    homeTeam: true,
    awayTeam: true,
  },
  orderBy: {
    utcDate: "asc",
  },
});

if (storedFixtures.length > 0) {
  return NextResponse.json({
    matches: storedFixtures.map((fixture) => ({
      id: fixture.id,
      utcDate: fixture.utcDate.toISOString(),
      status: fixture.status,
      matchday: fixture.matchday,
      lastUpdated: fixture.lastUpdated?.toISOString(),
      homeTeam: {
        id: fixture.homeTeam.id,
        name: fixture.homeTeam.name,
        crest: fixture.homeTeam.crest,
      },
      awayTeam: {
        id: fixture.awayTeam.id,
        name: fixture.awayTeam.name,
        crest: fixture.awayTeam.crest,
      },
      score: {
        fullTime: {
          home: fixture.homeScore,
          away: fixture.awayScore,
        },
      },
      footballdata: fixture.footballdataMatchId
        ? { match_id: fixture.footballdataMatchId }
        : null,
    })),
    sources: {
      footballData: "database",
      footballdata: "database",
    },
  });
}
  const footballDataKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!footballDataKey) {
    return NextResponse.json(
      { error: "Football-data.org API key is missing" },
      { status: 500 }
    );
  }

  const footballDataResponse = await fetch(
    "https://api.football-data.org/v4/competitions/PL/matches?season=2026",
    {
      headers: {
        "X-Auth-Token": footballDataKey,
      },
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!footballDataResponse.ok) {
    return NextResponse.json(
      { error: "Unable to fetch football-data.org fixtures" },
      { status: footballDataResponse.status }
    );
  }

  const footballData = await footballDataResponse.json();
  const footballdataKey = process.env.FOOTBALLDATA_IO_API_KEY;

  let enrichmentMatches: FootballdataMatch[] = [];
  let enrichmentStatus = "not_configured";

  if (footballdataKey) {
    try {
      const today = new Date().toISOString().slice(0, 10);

      const enrichmentResponse = await fetch(
        `https://footballdata.io/api/v1/fixtures/upcoming?from=${today}&to=2027-05-30&league_id=15&page=1&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${footballdataKey}`,
          },
          next: {
            revalidate: 900,
          },
        }
      );

      if (enrichmentResponse.ok) {
        const enrichmentData = await enrichmentResponse.json();

        enrichmentMatches = enrichmentData.data?.matches ?? [];
        enrichmentStatus = "available";
      } else {
        enrichmentStatus = "unavailable";
      }
    } catch {
      enrichmentStatus = "unavailable";
    }
  }

  const matches = (footballData.matches as FootballDataMatch[]).map(
    (match) => {
      const matchingEnrichment = enrichmentMatches.find((candidate) => {
        const sameDate = candidate.match_date.startsWith(
          match.utcDate.slice(0, 10)
        );

        const sameTeams =
          cleanTeamName(candidate.home_team?.team_name) ===
            cleanTeamName(match.homeTeam.name) &&
          cleanTeamName(candidate.away_team?.team_name) ===
            cleanTeamName(match.awayTeam.name);

        return sameDate && sameTeams;
      });

      return {
        ...match,
        footballdata: matchingEnrichment ?? null,
      };
    }
  );

  return NextResponse.json({
    ...footballData,
    matches,
    sources: {
      footballData: "available",
      footballdata: enrichmentStatus,
    },
  });
}