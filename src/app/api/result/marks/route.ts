import { connectToDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Result from "@/models/exams/result.model";

export async function POST(req: NextRequest) {
    await connectToDB();

    try {
        const body = await req.json();
        const { exam, sem, subjectName, batchCode, entries } = body;

        if (!exam || !sem || !subjectName || !batchCode || !entries?.length) {
            return NextResponse.json(
                { success: false, error: "Invalid payload" },
                { status: 400 }
            );
        }

        const anyResultExists = await Result.exists({ exam, sem, batchCode });

        if (!anyResultExists) {
            type NewResultEntry = {
                student: string;
                exam: string;
                subject: string;
                marksObtained: number;
                sem: string;
                batchCode: string;
                isUpdated: boolean;
            };
            type Entry = {
                studentId: string;
                marks: number;
            };

            const newResults: NewResultEntry[] = (entries as Entry[]).map(
                (entry) => ({
                    student: entry.studentId,
                    exam,
                    subject: subjectName,
                    marksObtained: entry.marks ?? 0,
                    sem,
                    batchCode,
                    isUpdated: false,
                })
            );

            await Result.insertMany(newResults);

            return NextResponse.json({ success: true, created: true });
        }

        interface Entry {
            studentId: string;
            marks: number;
            isUpdated: boolean;
        }

        interface ResultDocument {
            student: string;
            subject: string;
            exam: string;
            sem: string;
            batchCode: string;
            marksObtained: number;
            isUpdated: boolean;
            save: () => Promise<ResultDocument>;
        }

        const updates: Promise<ResultDocument | null>[] = (
            entries as Entry[]
        ).map(async (entry: Entry): Promise<ResultDocument | null> => {
            if (!entry.isUpdated) {
                return null;
            }

            const result: ResultDocument | null = await Result.findOne({
                student: entry.studentId,
                subject: subjectName,
                exam,
                sem,
                batchCode,
            });

            if (!result) {
                return null;
            }

            if (result.marksObtained !== entry.marks) {
                result.marksObtained = entry.marks;
                result.isUpdated = false;
                await result.save();

                return result;
            }

            return null;
        });

        await Promise.all(updates);

        return NextResponse.json({ success: true, updated: true });
    } catch (error) {
        console.error("[POST] Result marks POST error:", error);
        return NextResponse.json(
            { success: false, error: "Server error" },
            { status: 500 }
        );
    }
}
