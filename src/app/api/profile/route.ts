import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session:", session);
    if (!session || !session.user?.name) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      {
        user: session.user,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error generating marksheet:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
