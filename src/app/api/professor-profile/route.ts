import { connectToDB } from "@/lib/db";
import { NextResponse } from "next/server";
import Professor from "@/models/professor/professor.model";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";

export async function GET(req: Request) {
  await connectToDB();

  try {
    const session = await getServerSession(authOptions);
    console.log("Session:", session);
    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("Session user ID:", session.user.id);
    
    const professor = await Professor.findById(session.user.id);

    if (!professor) {
      return new NextResponse("Professor not found", { status: 404 });
    }

    return NextResponse.json(professor);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to fetch professor", { status: 500 });
  }
}
