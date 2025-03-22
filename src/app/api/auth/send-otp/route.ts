import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import OTP from "@/models/otp.model";
import { connectToDB } from "@/lib/db";
import Professor from "@/models/professor/professor.model";
import Admin from "@/models/admin/admin.model";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { email, role } = await req.json();
    if (!email || !role) {
      return NextResponse.json(
        { message: "Email and role are required" },
        { status: 400 }
      );
    }

    // Check if the user exists
    let user;
    if (role === "professor") {
      user = await Professor.findOne({ email: email.toLowerCase() });
    } else if (role === "admin") {
      user = await Admin.findOne({ email: email.toLowerCase() });
    } else {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in database
    await OTP.create({ userId: user._id, userType: role, email, otp });

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: `"AcadMate" <${process.env.EMAIL}>`,
      to: email,
      subject: "🔐 Your AcadMate OTP Code",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9; text-align: center;">
      <h2 style="color: #007bff;">🔐 AcadMate OTP Verification</h2>
      <p style="font-size: 16px; color: #333;">Hello,</p>
      <p style="font-size: 16px; color: #333;">
        Your one-time password (OTP) for login is:
      </p>
      <div style="display: inline-block; font-size: 24px; font-weight: bold; border-radius: 50px; color: #007bff; margin: 15px auto;">
        ${otp}
      </div>
      <p style="font-size: 16px; color: #333;">
        This OTP will expire in <b>5 minutes</b>.
      </p>
      <p style="font-size: 14px; color: #777;">
        If you did not request this OTP, please ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="text-align: center; font-size: 14px; color: #555;">
        Regards,<br>
        <strong>AcadMate Team</strong>
      </p>
    </div>
  `,
    });



    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}