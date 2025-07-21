import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { connectToDB } from "@/lib/db";
import Professor, { IProfessor } from "@/models/professor/professor.model";
import Subject from "@/models/exams/subject.model";

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

    const professor = await Professor.findById(token.sub)
      .select("_id name email subjectAllotment")
      .lean<IProfessor>();

    if (!professor || !professor.subjectAllotment?.length) {
      return NextResponse.json(
        { message: "No subject allotment found for this professor." },
        { status: 404 }
      );
    }

    const filters = professor.subjectAllotment.map((subj) => ({
      name: subj.subjectName,
      dept: subj.branch,
    }));

    const matchedSubjects = await Subject.find({ $or: filters })
      .select("_id name code dept")
      .lean();

    const teachingAssignments = professor.subjectAllotment.map(
      (allotment, index) => {
        const subject = matchedSubjects.find(
          (subj) =>
            subj.name === allotment.subjectName &&
            subj.dept === allotment.branch
        );
        const semester = subject?.code ? parseInt(subject.code[3]) : 1;

        const year =
          semester <= 2
            ? "1st year"
            : semester <= 4
            ? "2nd year"
            : semester <= 6
            ? "3rd year"
            : "4th year";

        return {
          _id: professor._id?.toString(), 
          professor: {
            _id: professor._id?.toString(),
            name: professor.name,
            email: professor.email,
          },
          subject: {
            _id: subject?._id?.toString() || "unknown",
            name: subject?.name || allotment.subjectName,
            code: subject?.code || "",
          },
          batchCode: `${allotment.branch}-${allotment.section}`,
          semester,
          year,
        };
      }
    );

    return NextResponse.json(teachingAssignments, { status: 200 });
  } catch (error) {
    console.error("[GET /api/professor/subjects] Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}

