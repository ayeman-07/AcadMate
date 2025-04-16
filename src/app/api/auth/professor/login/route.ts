import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // For now, just return success with mock professor data
    return NextResponse.json({
      message: "Login successful",
      professor: {
        id: "1",
        name: "Test Professor",
        email: email,
        department: "CSE",
        designation: "Assistant Professor",
      },
    });
  } catch (error) {
    console.error("[PROFESSOR_LOGIN]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 