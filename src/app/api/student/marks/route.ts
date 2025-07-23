import { NextRequest, NextResponse } from "next/server";
import { calculateSemesterResult } from "@/lib/calculateSemesterResult";

export async function POST(req: NextRequest) {
  try {
    const { studentId, semester, session } = await req.json();
    const result = await calculateSemesterResult(studentId, semester, session);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const errorMessage = typeof error === "object" && error !== null && "message" in error
      ? (error as { message: string }).message
      : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}