import { NextResponse, NextRequest } from "next/server";
import { connectToDB } from "@/lib/db";
import OTP from "@/models/otp.model";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

  
    const storedOtp = await OTP.findOne({ email, otp });
    if (!storedOtp) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

 
    await OTP.deleteOne({ email });

    return NextResponse.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}