import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { connectToDB } from "@/lib/db";
import Student from "@/models/student/student.model";

interface QueryParams {
  branch?: string;
  currSem?: number;
  $or?: Array<{
    name?: { $regex: string; $options: string };
    roll?: { $regex: string; $options: string };
  }>;
  section?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, email, password, roll, branch, semester, section } = body;

    if (
      !name ||
      !email ||
      !password ||
      !roll ||
      !branch ||
      !semester ||
      !section
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await connectToDB();

    const existingStudent = await Student.findOne({
      $or: [{ email }, { roll: roll.toUpperCase() }],
    });
    if (existingStudent) {
      return new NextResponse("Student already exists", { status: 400 });
    }

    await Student.create({
      name,
      email,
      password,
      roll: roll.toUpperCase(),
      branch,
      semester,
      section,
    });

    return NextResponse.json({ message: "Student created successfully" });
  } catch (error) {
    console.error("[STUDENT_MANAGEMENT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const department = searchParams.get("department"); // maps to branch
    const sem = searchParams.get("sem"); // maps to currSem
    const section = searchParams.get("section"); // maps to section
    const search = searchParams.get("search");

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    await connectToDB();

    
    const query: QueryParams = {};

    if (department && department !== "ALL") query.branch = department;
    if (sem) query.currSem = parseInt(sem[3]);
    if (section) query.section = section;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { roll: { $regex: search, $options: "i" } },
      ];
    }

    const students = await Student.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments(query);

    return NextResponse.json({
      students,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[STUDENT_MANAGEMENT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id, name, email, roll, department, semester, section } = body;

    if (!id) {
      return new NextResponse("Student ID is required", { status: 400 });
    }

    await connectToDB();

    // Check if student exists
    const student = await Student.findById(id);
    if (!student) {
      return new NextResponse("Student not found", { status: 404 });
    }

    // Check if roll number is already taken by another student
    if (roll && roll !== student.roll) {
      const existingStudent = await Student.findOne({
        roll: roll.toUpperCase(),
      });
      if (existingStudent) {
        return new NextResponse("Roll number already taken", { status: 400 });
      }
    }

    // Update student
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        name,
        email,
        roll: roll?.toUpperCase(),
        department,
        semester,
        section,
        updatedAt: new Date(),
      },
      { new: true }
    ).select("-password");

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error("[STUDENT_MANAGEMENT_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Student ID is required", { status: 400 });
    }

    await connectToDB();

    // Check if student exists
    const student = await Student.findById(id);
    if (!student) {
      return new NextResponse("Student not found", { status: 404 });
    }

    // Delete student
    await Student.findByIdAndDelete(id);

    return new NextResponse("Student deleted successfully");
  } catch (error) {
    console.error("[STUDENT_MANAGEMENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}