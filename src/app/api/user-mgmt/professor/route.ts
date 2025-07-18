import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { connectToDB } from "@/lib/db";
import Professor, { IProfessor } from "@/models/professor/professor.model";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, email, password, department, designation } = body;

    if (!name || !email || !password || !department || !designation) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await connectToDB();

    // Check if professor already exists
    const existingProfessor = await Professor.findOne({ email });
    if (existingProfessor) {
      return new NextResponse("Professor already exists", { status: 400 });
    }

    // Create new professor
    await Professor.create({
      name,
      email,
      password,
      department,
      designation,
    });

    return NextResponse.json({ message: "Professor created successfully" });
  } catch (error) {
    console.error("[PROFESSOR_MANAGEMENT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

interface ProfessorQuery {
  department?: string;
  designation?: string;
  name?: { $regex: string; $options: string };
  "subjectAllotment.subjectName"?: { $regex: string; $options: string };
  "subjectAllotment.branch"?: string;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const department = searchParams.get("department");
    const designation = searchParams.get("designation");
    const search = searchParams.get("search");
    const subject = searchParams.get("subject");
    const branch = searchParams.get("branch");

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    await connectToDB();

    const query: ProfessorQuery = {};

    if (department && department !== "ALL") {
      query.department = department;
    }

    if (designation && designation !== "ALL") {
      query.designation = designation;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (subject) {
      query["subjectAllotment.subjectName"] = {
        $regex: subject,
        $options: "i",
      };
    }

    if (branch) {
      query["subjectAllotment.branch"] = branch;
    }

    const professors: Partial<IProfessor>[] = await Professor.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Professor.countDocuments(query);

    return NextResponse.json({
      professors,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[PROFESSOR_GET_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id, name, email, department, designation } = body;

    if (!id) {
      return new NextResponse("Professor ID is required", { status: 400 });
    }

    await connectToDB();

    // Check if professor exists
    const professor = await Professor.findById(id);
    if (!professor) {
      return new NextResponse("Professor not found", { status: 404 });
    }

    // Update professor
    const updatedProfessor = await Professor.findByIdAndUpdate(
      id,
      {
        name,
        email,
        department,
        designation,
        updatedAt: new Date(),
      },
      { new: true }
    ).select("-password");

    return NextResponse.json(updatedProfessor);
  } catch (error) {
    console.error("[PROFESSOR_MANAGEMENT_PUT]", error);
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
      return new NextResponse("Professor ID is required", { status: 400 });
    }

    await connectToDB();

    // Check if professor exists
    const professor = await Professor.findById(id);
    if (!professor) {
      return new NextResponse("Professor not found", { status: 404 });
    }

    // Delete professor
    await Professor.findByIdAndDelete(id);

    return new NextResponse("Professor deleted successfully");
  } catch (error) {
    console.error("[PROFESSOR_MANAGEMENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
