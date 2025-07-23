import { connectToDB } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import Semester from "@/models/semester.model";
import Student from "@/models/student/student.model";

function normalizeSemesterName(name: string | number): string {
  const num =
    typeof name === "string" && name.startsWith("Sem ")
      ? name.replace("Sem ", "")
      : String(name);
  return `Sem ${num}`;
}

function mapBranchToDepartment(branch: string): string {
  const branchMap: Record<string, string> = {
    CSE: "COMPUTER SCIENCE",
    IT: "INFORMATION TECHNOLOGY",
    ECE: "ELECTRONICS & COMMUNICATION",
    // Add other mappings here
  };
  return branchMap[branch] || branch;
}


export async function GET() {
  try {
    await connectToDB();

    const semesterDocs = await Semester.find().sort({ department: 1, name: 1 });

    const semesterMap = new Map<
      string,
      { name: string; department: string; studentCount: number }
    >();

    // Step 1: Add all defined semesters (normalize names)
    for (const sem of semesterDocs) {
      const normalizedName = normalizeSemesterName(sem.name);
      const key = `${normalizedName}-${sem.department}`;
      semesterMap.set(key, {
        name: normalizedName,
        department: sem.department,
        studentCount: 0,
      });
    }

    // Step 2: Count students grouped by currSem and branch
    const studentSemCounts = await Student.aggregate([
      {
        $group: {
          _id: { currSem: "$currSem", branch: "$branch" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Step 3: Merge counts into semesterMap or add new entries
    for (const item of studentSemCounts) {
      const { currSem, branch } = item._id;
      const normalizedName = normalizeSemesterName(currSem);
      const department = mapBranchToDepartment(branch);
      const key = `${normalizedName}-${department}`;

      if (semesterMap.has(key)) {
        semesterMap.get(key)!.studentCount = item.count;
      } else {
        // Orphan semester found
        semesterMap.set(key, {
          name: normalizedName,
          department,
          studentCount: item.count,
        });
      }
    }

    const finalResult = Array.from(semesterMap.values()).sort((a, b) => {
      if (a.department === b.department) {
        const aNum = Number(a.name.replace("Sem ", ""));
        const bNum = Number(b.name.replace("Sem ", ""));
        return aNum - bNum;
      }
      return a.department.localeCompare(b.department);
    });

    console.log("Final enriched semesters:", finalResult);

    return NextResponse.json(finalResult);
  } catch (err) {
    console.error("Error fetching enriched semesters:", err);
    return NextResponse.json(
      { error: "Failed to fetch semesters with student counts" },
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
