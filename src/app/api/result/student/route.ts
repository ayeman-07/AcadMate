import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Result from "@/models/exams/result.model";
// import SubjectAssignment from "@/models/exams/subjectassignment.model";
import Student from "@/models/student/student.model";
import Subject from "@/models/exams/subject.model";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";

console.log("Subject", Subject);

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.name) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const studentName = session.user.roll;

        await connectToDB();

        const { sem } = await req.json();

        if (!sem || !studentName) {
            return NextResponse.json(
                { error: "Semester and studentId are required" },
                { status: 400 }
            );
        }

        const student = await Student.findOne({ roll: studentName });
        if (!student)
            return NextResponse.json(
                { error: "Student not found" },
                { status: 404 }
            );

        const batchCode = student.batchCode;

        // Fetch results
        const results = await Result.find({
            student: student._id,
            sem,
        }).populate("subject");

        return NextResponse.json(
            { results, student, batchCode },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error generating marksheet:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
