import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Professor from "@/models/professor/professor.model";
import Subject from "@/models/exams/subject.model";

type SubjectAllotment = {
  subjectName: string;
  branch: string;
};

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const branch = searchParams.get("branch")?.toUpperCase(); // e.g. "CSE"
  const semester = searchParams.get("semester"); // e.g. "4"

  if (!branch || !semester) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    await connectToDB();

    // Get all subject names from all professors who teach this branch
    const professors = await Professor.find({
      "subjectAllotment.branch": branch,
    });


    const subjectNamesSet = new Set<string>();
    professors.forEach((prof) => {
      prof.subjectAllotment?.forEach((allotment: SubjectAllotment) => {
        if (allotment.branch === branch) {
          subjectNamesSet.add(allotment.subjectName);
        }
      });
    });


    // Fetch all matching subjects by name and validate semester by code
    const subjects = await Subject.find({
      name: { $in: Array.from(subjectNamesSet) },
    });

    const filteredSubjects = subjects.filter((subject) => {
      const code = subject.code;
      const semesterDigit = code[3]; // E.g., '4' in CSE401
      return semesterDigit === semester;
    });


    return NextResponse.json({ subjects: filteredSubjects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};