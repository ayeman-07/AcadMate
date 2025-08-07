import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { connectToDB } from "@/lib/db";
import Exam from "@/models/exams/exam.model";

// GET /api/exam or /api/exam?id=<examId>
export async function GET(req: NextRequest) {
  await connectToDB();

  const searchParams = req.nextUrl.searchParams;
  const examId = searchParams.get("id");
  try {
    if (examId) {
      const exam = await Exam.findById(examId).populate("subjects.professor");
      if (!exam) {
        return NextResponse.json(
          { message: "Exam not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ exam }, { status: 200 });
    } else {
      const exams = await Exam.find()
        .sort({ createdAt: -1 })
        .populate("subjects.professor");
      return NextResponse.json({ exams }, { status: 200 });
    }
  } catch (error) {
    console.error("GET Exam Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/exam
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  await connectToDB();

  try {
    const body = await req.json();

    const {
      examType,
      semester,
      departments,
      maxMarks,
      startDate,
      endDate,
      duration,
      subjects, 
    } = body;
 
    if (
      !examType ||
      !semester ||
      !departments ||
      !maxMarks ||
      !startDate ||
      !endDate ||
      !duration ||
      !subjects?.length
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newExam = await Exam.create({
      examType,
      semester,
      departments,
      maxMarks,
      startDate,
      endDate,
      duration,
      subjects,
    });

    return NextResponse.json(
      { message: "Exam created", exam: newExam },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Exam Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
