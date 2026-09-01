import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const apiKey = process.env.FOOTBALLDATA_IO_API_KEY;
  const { matchId } = await params;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Footballdata.io API key is missing" },
      { status: 500 }
    );
  }

  if (!/^\d+$/.test(matchId)) {
    return NextResponse.json(
      { error: "Invalid match ID" },
      { status: 400 }
    );
  }

  const response = await fetch(
    `https://footballdata.io/api/v1/matches/${matchId}/events`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      next: {
        revalidate: 900,
      },
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Unable to fetch match events" },
      { status: response.status }
    );
  }

  const data = await response.json();

  return NextResponse.json(data);
}