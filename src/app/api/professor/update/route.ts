import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { connectToDB } from "@/lib/db";
import Professor from "@/models/professor/professor.model";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    await connectToDB();

    const updated = await Professor.findByIdAndUpdate(
      session.user.id,
      {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        avatar: data.avatar,
      },
      { new: true }
    );

    return Response.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}
