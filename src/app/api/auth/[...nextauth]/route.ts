import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/db";
import Student from "@/models/student/student.model";
import Teacher from "@/models/teacher/teacher.model";
import Admin from "@/models/admin/admin.model";
import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;

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

export const authOptions: NextAuthOptions = {
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
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        const { role, email, roll, password } = credentials;

        try {
          await connectToDB();
          console.log("Database connected successfully");
          console.log("MongoDB URI:", DB_URI);

          let user;

          switch (role) {
            case "student":
              if (!roll) throw new Error("Roll number is required");
              console.log(
                "Searching for student with roll:",
                roll.toUpperCase()
              );
              try {
                const allStudents = await Student.find({});
                console.log("All students count:", allStudents.length);
                console.log(
                  "Connection state:",
                  mongoose.connection.readyState
                );
                if (mongoose.connection.db) {
                  console.log(
                    "Current database:",
                    mongoose.connection.db.databaseName
                  );
                }

                user = await Student.findOne({
                  roll: roll.toUpperCase(),
                }).select("+password");
                console.log("Found student:", user ? "Yes" : "No");
              } catch (dbError) {
                console.error("Database query error:", dbError);
                throw dbError;
              }
              break;

            case "teacher":
              if (!email) throw new Error("Email is required");
              user = await Teacher.findOne({
                email: email.toLowerCase(),
              }).select("+password");
              break;

            case "admin":
              if (!email) throw new Error("Email is required");
              user = await Admin.findOne({ email: email.toLowerCase() }).select(
                "+password"
              );
              break;

            default:
              throw new Error("Invalid role");
          }

          if (!user || !user.password) {
            throw new Error("Invalid credentials");
          }

          // const isPasswordValid = await bcrypt.compare(password, user.password);
          const isPasswordValid = password === user.password;
          console.log(password, user.password, isPasswordValid);
          if (!isPasswordValid) {
            throw new Error("Invalid credentials");
          }

          // Update last login
          user.lastLogin = new Date();
          await user.save();

          return {
            id: user._id.toString(),
            role,
            name: user.name,
            email: user.email,
            roll: role === "student" ? user.roll : undefined,
          };
        } catch (error: any) {
          throw new Error(error.message || "Authentication failed");
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
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        if (token.roll) {
          session.user.roll = token.roll as string;
        }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
