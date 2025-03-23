import { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/lib/db";
import Student from "@/models/student/student.model";
import Professor from "@/models/professor/professor.model";
import Admin from "@/models/admin/admin.model";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      roll?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    roll?: string;
  }
}

const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        role: { type: "text" },
        email: { type: "text" },
        roll: { type: "text" },
        password: { type: "password" },
        otp: { type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("No credentials provided");

        const { role, email, roll, password, otp } = credentials;
        try {
          await connectToDB();
          let user;

          switch (role) {
            case "student":
              if (!roll) throw new Error("Roll number is required");
              user = await Student.findOne({ roll: roll.toUpperCase() }).select(
                "+password"
              );
              break;
            case "professor":
            case "admin":
              if (!email) throw new Error("Email is required");
              user = await (role === "professor" ? Professor : Admin)
                .findOne({
                  email: email.toLowerCase(),
                })
                .select("+password");
              break;
            default:
              throw new Error("Invalid role");
          }

          if (!user || !user.password) throw new Error("Invalid credentials");

          const isPasswordValid = user.password === password;
          if (!isPasswordValid && !otp) throw new Error("Invalid credentials");

          if (role === "student") {
            return {
              id: user._id.toString(),
              role,
              name: user.name,
              email: user.email,
              roll: user.roll,
            };
          }

          if (
            !otp &&
            (role === "professor" || role === "admin") &&
            isPasswordValid
          ) {
            throw new Error("OTP required");
          }
          if (otp) {
            const otpVerification = await fetch(
              `${process.env.NEXTAUTH_URL}/api/auth/verify-otp`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
              }
            );

            const data = await otpVerification.json();
            console.log(data);
            const isOtpValid = data.message === "OTP verified successfully";
            if (!isOtpValid) throw new Error("Invalid or expired OTP");
          }

          return {
            id: user._id.toString(),
            role,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : "Authentication failed"
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.roll = user.roll;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        if (token.roll) {
          session.user.roll = token.roll as string;
        }
      }
      return session;
    },
  },
};

export default authOptions;
