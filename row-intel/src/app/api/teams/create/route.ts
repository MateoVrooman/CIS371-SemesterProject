import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { createTeam } from "@/lib/teamHelpers";

export default async function POST(req: NextRequest) {
  try {
    const { teamName, userId } = await req.json();
    if (!teamName || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const teamId = await createTeam(teamName, userId);
    return NextResponse.json(
      { message: "Team created successfully", teamId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
