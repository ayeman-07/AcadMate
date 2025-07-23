import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { connectToDB } from "@/lib/db";
import Attendance from "@/models/attendance.model";
import Student from "@/models/student/student.model";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    console.log("session:", session);

    if (!session?.user || session.user.role !== "professor") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const { studentId, subjectName, subjectCode, date, isPresent, sem } =
      await req.json();

    if (
      !studentId ||
      !subjectName ||
      !subjectCode ||
      !date ||
      typeof isPresent !== "boolean" ||
      !sem
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    } 

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await Attendance.findOne({
      studentId,
      subjectCode,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    let attendance;
    if (existing) {
      // Update existing record
      existing.isPresent = isPresent;
      existing.sem = sem;
      existing.subjectName = subjectName;
      await existing.save();
      attendance = existing;
    } else {
      // Create new record
      attendance = await Attendance.create({
        studentId,
        professor: session.user.id,
        subjectName,
        subjectCode,
        date,
        isPresent,
        sem,
      });
    }

    return NextResponse.json({ success: true, attendance }, { status: 201 });
  } catch (err) {
    console.error("Error marking attendance:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}



export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    console.log("session:", session);

    if (
      !session?.user ||
      (session.user.role !== "professor" && session.user.role !== "admin")
    ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const batchCode = searchParams.get("batchCode");
    const semester = searchParams.get("semester");
    const date = searchParams.get("date"); 


    if (!batchCode || !semester || !date) {
      return NextResponse.json(
        { error: "Missing batchCode, semester, or date" },
        { status: 400 }
      );
    }

    const branch = batchCode.slice(0, 3).toUpperCase();
    if (!branch) {
      return NextResponse.json(
        { error: "Invalid batchCode format" },
        { status: 400 }
      );
    }


    const students = await Student.find({
      branch,
      currSem: Number(semester),
    }).lean();

    const studentIds = students.map((s) => s._id);

    if (studentIds.length === 0) {
      return NextResponse.json({ error: "No students found" }, { status: 404 });
    }

    const targetDate = new Date(date);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1); 

    const attendanceRecords = await Attendance.find({
      studentId: { $in: studentIds },
      date: { $gte: targetDate, $lt: nextDate }, 
    })
      .populate("studentId", "name rollNo") 
      .lean();

    return NextResponse.json({
      success: true,
      attendance: attendanceRecords,
    });
  } catch (err) {
    console.error("Fetch Attendance Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
