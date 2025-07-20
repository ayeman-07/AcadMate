import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Result from "@/models/exams/result.model";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const { subjectId, batchCode, sem } = await req.json();
    if (!batchCode || !sem) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const query: any = { batchCode, sem };
    if (subjectId) query.subject = subjectId;
    const results = await Result.find(query).lean();
    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error("[FETCH_MARKS_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 