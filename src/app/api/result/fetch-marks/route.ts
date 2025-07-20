// src/app/api/result/fetch-marks/route.ts

import { connectToDB } from "@/lib/db";
import Result from "@/models/exams/result.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subjectName, batchCode, sem } = body;
   

    console.log("📥 Received request:", { subjectName, batchCode, sem });

    if (!subjectName || !batchCode || !sem) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    await connectToDB();

    const results = await Result.find({ batchCode, sem })
      .populate("student")
      .populate("subject");

      console.log(batchCode, sem);

      console.log("📤 Fetched results:", results.length, "results found");

    return NextResponse.json({ success: true, results }, { status: 200 });
  } catch (error) {
    console.error("❌ API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
