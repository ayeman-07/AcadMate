import { connectToDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Result from "@/models/exams/result.model";

export async function POST(req: NextRequest) {
  console.log("[POST] Connecting to DB...");
  await connectToDB();
  console.log("[POST] Connected to DB");

  try {
    console.log("[POST] Parsing request body...");
    const body = await req.json();
    console.log("[POST] Request body:", body);
    // btachId
    const { exam, sem, subjectName, batchCode, entries  } = body;

    if (!exam || !sem || !subjectName || !batchCode || !entries?.length) {
      console.error("[POST] Invalid payload:", body);
      return NextResponse.json(
        { success: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    const anyResultExists = await Result.exists({ exam, sem, batchCode });

    if (!anyResultExists) {
      console.log("[POST] No existing results found. Inserting new entries...");
      const newResults = entries.map((entry: any) => ({
        student: entry.studentId,
        exam,
        subject: subjectName,
        marksObtained: entry.marks || 0,
        sem,
        batchCode,
        isUpdated: false,
      }));

      console.log("[POST] New results to insert:", newResults);
      await Result.insertMany(newResults);
      console.log("[POST] Inserted new results successfully.");

      return NextResponse.json({ success: true, created: true });
    }

    console.log("[POST] Existing results found. Processing updates...");
    const updates = entries.map(async (entry: any) => {
      console.log(
        `[POST] Processing entry for studentId=${entry.studentId}, isUpdated=${entry.isUpdated}`
      );

      if (!entry.isUpdated) {
        console.log(
          `[POST] Skipping update for studentId=${entry.studentId} because isUpdated is false`
        );
        return null;
      }

      const result = await Result.findOne({
        student: entry.studentId,
        subject: subjectName,
        exam,
        sem,
        batchCode,
      });

      if (!result) {
        console.warn(
          `[POST] No existing result found for studentId=${entry.studentId}, skipping.`
        );
        return null;
      }

      console.log(
        `[POST] Found existing result for studentId=${entry.studentId}, marksObtained=${result.marksObtained}, new marks=${entry.marks}`
      );

      if (result.marksObtained !== entry.marks) {
        console.log(
          `[POST] Updating marks for studentId=${entry.studentId} from ${result.marksObtained} to ${entry.marks}`
        );
        result.marksObtained = entry.marks;
        result.isUpdated = false;
        await result.save();
        console.log(
          `[POST] Updated result saved for studentId=${entry.studentId}`
        );
        return result;
      }

      console.log(
        `[POST] No update needed for studentId=${entry.studentId} as marks are the same.`
      );
      return null;
    });

    await Promise.all(updates);
    console.log("[POST] All updates processed.");

    return NextResponse.json({ success: true, updated: true });
  } catch (error) {
    console.error("[POST] Result marks POST error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
