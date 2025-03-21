import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName, role } = await req.json();
    const result = await registerUser(
      email,
      password,
      firstName,
      lastName,
      role
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ userId: result.userId }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
