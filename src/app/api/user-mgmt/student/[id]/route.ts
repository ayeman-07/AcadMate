import { connectToDB } from "@/lib/db";
import Student from "@/models/student/student.model";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch student by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDB();

  const student = await Student.findById(params.id).lean();

  if (!student) {
    return NextResponse.json({ message: "Student not found" }, { status: 404 });
  }

  return NextResponse.json({ student });
}

// PUT: Update student data, including avatar as base64
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();

    const updatedData = await req.json(); // ✅ read JSON instead of formData

    const student = await Student.findById(params.id);
    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // ✅ Update fields
    Object.assign(student, updatedData);

    // ✅ Handle delete avatar (sent as undefined or null)
    if (updatedData.avatar === null || updatedData.avatar === undefined) {
      student.avatar = undefined;
    }

    await student.save();
    return NextResponse.json({ message: "Student updated successfully", student });

  } catch (error) {
    console.error("PUT /student/:id failed:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
