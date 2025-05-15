import { connectToDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Result from "@/models/exams/result.model";

export async function POST(req: NextRequest) {
  await connectToDB();

  try {
    const body = await req.json();
    const { exam, sem, subjectId, batchCode, entries } = body;

    if (!exam || !sem || !subjectId || !batchCode || !entries?.length) {
      console.error("Invalid payload:", body);
      return NextResponse.json(
        { success: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    const anyResultExists = await Result.exists({ exam, sem, batchCode });

    if (!anyResultExists) {
      // First time insert: Insert all entries, with isUpdated = false
      const newResults = entries.map((entry: any) => ({
        student: entry.studentId,
        exam,
        subject: subjectId,
        marksObtained: entry.marks || 0,
        sem,
        batchCode,
        isUpdated: false, // default false on insert
      }));

      await Result.insertMany(newResults);

      return NextResponse.json({ success: true, created: true });
    }

    // Subsequent updates: Only update entries where isUpdated === true
    const updates = entries.map(async (entry: any) => {
      if (!entry.isUpdated) {
        // Skip updates for entries where isUpdated is false
        return null;
      }

      const result = await Result.findOne({
        student: entry.studentId,
        subject: subjectId,
        exam,
        sem,
        batchCode,
      });

      if (!result) return null;

      // Update marks only if different
      if (result.marksObtained !== entry.marks) {
        result.marksObtained = entry.marks;
        result.isUpdated = false; // reset flag after update
        return result.save();
      }
      return null;
    });

    await Promise.all(updates);

    return NextResponse.json({ success: true, updated: true });
  } catch (error) {
    console.error("Result marks POST error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
