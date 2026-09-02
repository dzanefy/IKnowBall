import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: false });

let prisma: (typeof import("../lib/prisma"))["prisma"] | undefined;

type ApiTeam = {
  id: number;
  name: string;
  crest?: string;
};

type ApiPlayer = {
  id: number;
  name: string;
  position?: string | null;
  nationality?: string | null;
  dateOfBirth?: string | null;
  shirtNumber?: number | null;
};

type ApiTeamDetails = ApiTeam & {
  squad?: ApiPlayer[];
};

type ApiMatch = {
  id: number;
  utcDate: string;
  status: string;
  matchday: number | null;
  lastUpdated?: string;
  homeTeam: ApiTeam;
  awayTeam: ApiTeam;
  score?: {
    fullTime?: {
      home: number | null;
      away: number | null;
    };
  };
};

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function createSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/\b(fc|afc)\b/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
    const prismaModule = await import("../lib/prisma");
    prisma = prismaModule.prisma;
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    throw new Error("FOOTBALL_DATA_API_KEY is missing");
  }

  const response = await fetch(
    "https://api.football-data.org/v4/competitions/PL/matches?season=2026",
    {
      headers: {
        "X-Auth-Token": apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Football-data request failed: ${response.status}`);
  }

  const data = await response.json();
  const matches = data.matches as ApiMatch[];

  for (const match of matches) {
    await prisma.team.upsert({
      where: { id: match.homeTeam.id },
      update: {
        name: match.homeTeam.name,
        slug: createSlug(match.homeTeam.name),
        crest: match.homeTeam.crest,
      },
      create: {
        id: match.homeTeam.id,
        name: match.homeTeam.name,
        slug: createSlug(match.homeTeam.name),
        crest: match.homeTeam.crest,
      },
    });

    await prisma.team.upsert({
      where: { id: match.awayTeam.id },
      update: {
        name: match.awayTeam.name,
        slug: createSlug(match.awayTeam.name),
        crest: match.awayTeam.crest,
      },
      create: {
        id: match.awayTeam.id,
        name: match.awayTeam.name,
        slug: createSlug(match.awayTeam.name),
        crest: match.awayTeam.crest,
      },
    });

    await prisma.fixture.upsert({
      where: { id: match.id },
      update: {
        utcDate: new Date(match.utcDate),
        status: match.status,
        matchday: match.matchday,
        homeScore: match.score?.fullTime?.home ?? null,
        awayScore: match.score?.fullTime?.away ?? null,
        lastUpdated: match.lastUpdated
          ? new Date(match.lastUpdated)
          : null,
        homeTeamId: match.homeTeam.id,
        awayTeamId: match.awayTeam.id,
      },
      create: {
        id: match.id,
        utcDate: new Date(match.utcDate),
        status: match.status,
        matchday: match.matchday,
        homeScore: match.score?.fullTime?.home ?? null,
        awayScore: match.score?.fullTime?.away ?? null,
        lastUpdated: match.lastUpdated
          ? new Date(match.lastUpdated)
          : null,
        homeTeamId: match.homeTeam.id,
        awayTeamId: match.awayTeam.id,
      },
    });
  }
  const teamIds = [
  ...new Set(
    matches.flatMap((match) => [
      match.homeTeam.id,
      match.awayTeam.id,
    ])
  ),
];

for (const teamId of teamIds) {
await wait(7000);
  const teamResponse = await fetch(
    `https://api.football-data.org/v4/teams/${teamId}`,
    {
      headers: {
        "X-Auth-Token": apiKey,
      },
    }
  );

  if (!teamResponse.ok) {
    console.warn(`Could not load squad for team ${teamId}`);
    continue;
  }

  const teamDetails = (await teamResponse.json()) as ApiTeamDetails;

  for (const player of teamDetails.squad ?? []) {
    await prisma!.player.upsert({
      where: { id: player.id },
      update: {
        name: player.name,
        position: player.position ?? null,
        nationality: player.nationality ?? null,
        dateOfBirth: player.dateOfBirth
          ? new Date(player.dateOfBirth)
          : null,
        shirtNumber: player.shirtNumber ?? null,
        teamId,
      },
      create: {
        id: player.id,
        name: player.name,
        position: player.position ?? null,
        nationality: player.nationality ?? null,
        dateOfBirth: player.dateOfBirth
          ? new Date(player.dateOfBirth)
          : null,
        shirtNumber: player.shirtNumber ?? null,
        teamId,
      },
    });
  }

  console.log(`Synced squad for ${teamDetails.name}.`);
}

  console.log(`Synced ${matches.length} fixtures.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (prisma) {
  await prisma.$disconnect();
}
  });