// app/api/students/fetch-batch/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Student from "@/models/student/student.model";
import Subject from "@/models/exams/subject.model";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const { batchCode, subjectId } = await req.json();

    if (!batchCode || !subjectId) {
      return NextResponse.json(
        { error: "Missing batchCode or subjectId" },
        { status: 400 }
      );
    }

    // Fetch all students in the batch
    const students = await Student.find({ batchCode }).lean();

    // Fetch subject info
    const subject = await Subject.findById(subjectId).lean();

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      students,
      subject,
    });
  } catch (err) {
    console.error("Fetch Batch API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
