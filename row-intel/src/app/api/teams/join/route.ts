import { NextRequest, NextResponse } from "next/server";
import { joinTeam } from "@/lib/teamHelpers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, joinCode } = body;
    if (!userId || !joinCode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await joinTeam(userId, joinCode);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Successfully joined team", teamId: result.teamId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error joining team:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
