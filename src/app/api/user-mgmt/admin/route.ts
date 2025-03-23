import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { connectToDB } from "@/lib/db";
import Admin from "@/models/admin/admin.model";

interface QueryParams {
  role?: string;
  $or?: Array<{
    name?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  }>;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await connectToDB();

    // Check if user already exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 });
    }

    // Create new user
    await Admin.create({
      name,
      email,
      password,
    });

    return NextResponse.json({ message: "User created successfully" });
  } catch (error) {
    console.error("[USER_MANAGEMENT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    await connectToDB();

    // Build query
    const query: QueryParams = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Get users with pagination
    const users = await Admin.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count
    const total = await Admin.countDocuments(query);

    return NextResponse.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[USER_MANAGEMENT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id, name, email, role } = body;

    if (!id) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    await connectToDB();

    // Check if user exists
    const user = await Admin.findById(id);
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Update user
    const updatedUser = await Admin.findByIdAndUpdate(
      id,
      {
        name,
        email,
        role,
        updatedAt: new Date(),
      },
      { new: true }
    ).select("-password");

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_MANAGEMENT_PUT]", error);
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
      return new NextResponse("User ID is required", { status: 400 });
    }

    await connectToDB();

    // Check if user exists
    const user = await Admin.findById(id);
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Prevent self-deletion
    if (user._id.toString() === session.user.id) {
      return new NextResponse("Cannot delete your own account", {
        status: 400,
      });
    }

    // Delete user
    await Admin.findByIdAndDelete(id);

    return new NextResponse("User deleted successfully");
  } catch (error) {
    console.error("[USER_MANAGEMENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
