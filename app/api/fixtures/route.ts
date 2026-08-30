import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Football API key is missing" },
      { status: 500 }
    );
  }

  const response = await fetch(
    "https://api.football-data.org/v4/competitions/PL/matches?season=2026",
    {
      headers: {
        "X-Auth-Token": apiKey,
      },
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Unable to fetch football data" },
      { status: response.status }
    );
  }

  const data = await response.json();

  return NextResponse.json(data);
}