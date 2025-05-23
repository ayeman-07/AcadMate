
import SubjectAssignment from "@/models/exams/subjectassignment.model";
import Student from "@/models/student/student.model";
import Result from "@/models/exams/result.model";
import SemesterResult from "@/models/exams/semesterResult.model";
import Subject from "@/models/exams/subject.model";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";

export const calculateSemesterResult = async (
  studentId: string,
  semester: number,
  session: string
) => {
  const student = await Student.findById(studentId);
  if (!student) throw new Error("Student not found");

  const assignment = await SubjectAssignment.findOne({
    batchCode: student.batchCode,
    currSem: semester,
  }).populate("subjects");
  if (!assignment) throw new Error("Subject assignment not found");

  const results = await Result.find({
    student: student._id,
    examType: { $in: ["quiz1", "midsem", "quiz2", "endsem"] },
  }).populate("subject");

  const subjectMap = new Map<string, { marks: number; credit: number }>();

  for (const subject of assignment.subjects as any[]) {
    const subjectResults = results.filter((r) =>
      r.subject._id.equals(subject._id)
    );

    const quiz1 =
      subjectResults.find((r) => r.exam === "quiz1")?.marksObtained || 0;
    const midsem =
      subjectResults.find((r) => r.exam === "midsem")?.marksObtained || 0;
    const quiz2 =
      subjectResults.find((r) => r.exam === "quiz2")?.marksObtained || 0;
    const endsem =
      subjectResults.find((r) => r.exam === "endsem")?.marksObtained || 0;

    const total = quiz1 + midsem + quiz2 + endsem / 2; 
    const credit = subject.credits;

    subjectMap.set(subject._id.toString(), { marks: total, credit });
  }

  const totalMarks = Array.from(subjectMap.values()).reduce(
    (sum, v) => sum + v.marks,
    0
  );
  const totalCredits = assignment.totalCredits;

  const earnedCredits = Array.from(subjectMap.values()).reduce(
    (sum, v) => sum + (v.marks >= 40 ? v.credit : 0),
    0
  );

  const sgpa = parseFloat(((earnedCredits / totalCredits) * 10).toFixed(2));

  // Corrected Grade Mapping
  const grade =
    sgpa * 10 >= 81
      ? "AA"
      : sgpa * 10 >= 71
      ? "AB"
      : sgpa * 10 >= 61
      ? "BB"
      : sgpa * 10 >= 53
      ? "BC"
      : sgpa * 10 >= 47
      ? "CC"
      : sgpa * 10 >= 40
      ? "PASS"
      : "XX";

  const semResult = await SemesterResult.findOneAndUpdate(
    { student: student._id, semester, session },
    {
      student: student._id,
      semester,
      session,
      totalMarks,
      totalCredits,
      sgpa,
      grade,
    },
    { upsert: true, new: true }
  );

  return semResult;
};