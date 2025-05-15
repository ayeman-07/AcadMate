import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { connectToDB } from "@/lib/db";
import TeachingAssignment from "@/models/professor/teachingassignment.model";
import Professor from "@/models/professor/professor.model";
import Subject from "@/models/exams/subject.model";

// Log the models to ensure they are registered
console.log("Professor model loaded:", Professor);
console.log("Subject model loaded:", Subject);

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.sub) {
      return NextResponse.json(
        { message: "Unauthorized or invalid token" },
        { status: 401 }
      );
    }

    const professorId = token.sub;

    const assignments = await TeachingAssignment.find({
      professor: professorId,
    })
      .populate("professor", "name email")
      .populate("subject", "code name")
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
