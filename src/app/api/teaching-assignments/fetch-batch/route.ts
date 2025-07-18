// pages/api/teaching-assignments/fetch-batch.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Student from "@/models/student/student.model";
import Subject from "@/models/exams/subject.model";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const { batchCode, semester, subjectName } = await req.json();

    if (!batchCode || !semester || !subjectName) {
      return NextResponse.json(
        { error: "Missing batchCode, semester, or subjectName" },
        { status: 400 }
      );
    }

    const [branch, section] = batchCode.split("-");

    if (!branch || !section) {
      return NextResponse.json(
        { error: "Invalid batchCode format" },
        { status: 400 }
      );
    }

    // Fetch all students from the correct batch
    const students = await Student.find({
      branch,
      section,
      currSem: Number(semester),
    }).lean();

    // Fetch subject by name
    const subject = await Subject.findOne({ name: subjectName }).lean();

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