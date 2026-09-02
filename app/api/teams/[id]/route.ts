import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const teamId = Number(id);

  if (!Number.isInteger(teamId)) {
    return NextResponse.json(
      { error: "Invalid team ID" },
      { status: 400 }
    );
  }

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      players: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  if (!team) {
    return NextResponse.json(
      { error: "Team not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(team);
}