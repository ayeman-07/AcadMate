import { connectToDB } from "@/lib/db";
import { NextResponse } from "next/server";
import Professor from "@/models/professor/professor.model";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectToDB();

  try {
    const professor = await Professor.findById(params.id);
    if (!professor) {
      return new NextResponse("Professor not found", { status: 404 });
    }

    return NextResponse.json(professor);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to fetch professor", { status: 500 });
  }
}
