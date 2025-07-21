import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { connectToDB } from "@/lib/db";
import Professor from "@/models/professor/professor.model";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await connectToDB();
    const professor = await Professor.findById(session.user.id);
    if (!professor) {
      return new Response("Professor not found", { status: 404 });
    }
    return Response.json(professor);
  } catch (err) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
