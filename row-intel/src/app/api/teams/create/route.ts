import { NextRequest, NextResponse } from "next/server";
import { createTeam } from "@/lib/teamHelpers";

export async function POST(req: NextRequest) {
  try {
    const { teamName, userId } = await req.json();
    if (!teamName || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { teamId, joinCode } = await createTeam(teamName, userId);
    return NextResponse.json(
      { message: "Team created successfully", teamId, joinCode },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
