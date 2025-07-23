import { connectToDB } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import Professor from "@/models/professor/professor.model";

export async function GET(
  req: NextRequest,
) {
  const pathname = req.nextUrl.pathname;
  const id = pathname.split("/").pop();
  await connectToDB();

  try {

    console.log("Fetching professor with ID:", id);
    const professor = await Professor.findById(id);
    if (!professor) {
      return new NextResponse("Professor not found", { status: 404 });
    }

    return NextResponse.json(professor);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to fetch professor", { status: 500 });
  }
}
