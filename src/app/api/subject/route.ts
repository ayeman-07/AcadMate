import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { connectToDB } from "@/lib/db";
import SubjectModel from "@/models/exams/subject.model";

// GET /api/subject - fetch all subjects
export async function GET() {
  try {
    await connectToDB();

    const subjects = await SubjectModel.find({});
    return NextResponse.json(subjects, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch subjects", error },
      { status: 500 }
    );
  }
}

// POST /api/subject - only accessible to admins
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    await connectToDB();

    const body = await req.json();
    const { name, code, credits, isPractical = false, dept } = body;

    if (!name || !code || !credits || !dept) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const subject = await SubjectModel.create({
      name,
      code,
      credits,
      isPractical,
      dept,
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create subject", error },
      { status: 500 }
    );
  }
}