import { NextRequest, NextResponse } from "next/server";


import { connectToDB } from "@/lib/db";
import TeachingAssignment from "@/models/professor/teachingassignment.model";
import Professor from "@/models/professor/professor.model";
import Subject from "@/models/exams/subject.model";

export async function GET(
  req: NextRequest,
  { params }: { params: { professorId: string } }
) {
  try {
    await connectToDB();

    const { professorId } = params;

    const assignments = await TeachingAssignment.find({
      professor: professorId,
    })
      .populate("professor", "name email")
      .populate("subject", "subjectCode subjectName")
      .lean();

    if (!assignments.length) {
      return NextResponse.json(
        { message: "No assignments found." },
        { status: 404 }
      );
    }

    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error("[TeachingAssignment GET ERROR]:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
