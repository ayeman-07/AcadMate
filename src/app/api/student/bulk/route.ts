import { NextRequest, NextResponse } from "next/server";
import Student from "@/models/student/student.model";
import { connectToDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const students = await req.json();

    if (!Array.isArray(students) || students.length === 0) {
      return NextResponse.json(
        { message: "No student data provided" },
        { status: 400 }
      );
    }

    const uniqueStudents = students.filter(
      (student, index, self) =>
        student.roll && index === self.findIndex((s) => s.roll === student.roll)
    );

    const operations = uniqueStudents.map((student) => ({
      updateOne: {
        filter: { roll: student.roll },
        update: { $set: student },
        upsert: true,
      },
    }));

    await Student.bulkWrite(operations);

    return NextResponse.json(
      { message: "Students saved successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error saving students:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
