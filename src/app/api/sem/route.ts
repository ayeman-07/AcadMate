import { connectToDB } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import Semester from "@/models/semester.model";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const semesters = await Semester.find().sort({ department: 1, name: 1 });

    return NextResponse.json(semesters);
  } catch (err) {
    console.error("Error fetching semesters:", err);
    return NextResponse.json(
      { error: "Failed to fetch semesters" },
      { status: 500 }
    );
  }
}


// POST: Create new semester
export async function POST(request: NextRequest) {
  try {
    await connectToDB();
    const { name, department } = await request.json();

    if (!name || !department) {
      return NextResponse.json(
        { error: "Semester name and department are required" },
        { status: 400 }
      );
    }

    const existingSemester = await Semester.findOne({
      name: { $regex: `^${name}$`, $options: "i" }, // Case-insensitive match
      department,
    });

    if (existingSemester) {
      return NextResponse.json(
        { error: "Semester already exists in this department" },
        { status: 409 }
      );
    }

    const newSemester = new Semester({ name, department });
    await newSemester.save();

    return NextResponse.json(newSemester, { status: 201 });
  } catch (err) {
    console.error("Error creating semester:", err);
    return NextResponse.json(
      { error: "Failed to create semester" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a semester by name and department
export async function DELETE(request: NextRequest) {
  try {
    await connectToDB();
    const { name, department } = await request.json();

    if (!name || !department) {
      return NextResponse.json(
        { error: "Semester name and department are required" },
        { status: 400 }
      );
    }

    const deleted = await Semester.findOneAndDelete({
      name: { $regex: `^${name}$`, $options: "i" }, // Case-insensitive
      department,
    });

    if (!deleted) {
      return NextResponse.json(
        { error: "Semester not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Semester deleted successfully" });
  } catch (err) {
    console.error("Error deleting semester:", err);
    return NextResponse.json(
      { error: "Failed to delete semester" },
      { status: 500 }
    );
  }
}
