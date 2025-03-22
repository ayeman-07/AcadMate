import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/lib/db";
import Student from "@/models/student/student.model";
import Professor from "@/models/professor/professor.model";
import Admin from "@/models/admin/admin.model";

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

          let user;

          switch (role) {
            case "student":
              if (!roll) throw new Error("Roll number is required");
              console.log(
                "Searching for student with roll:",
                roll.toUpperCase()
              );
              try {
                user = await Student.findOne({
                  roll: roll.toUpperCase(),
                }).select("+password");
              } catch (dbError) {
                console.error("Database query error:", dbError);
                throw dbError;
              }
              break;

            case "professor":
              if (!email) throw new Error("Email is required");
              user = await Professor.findOne({
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

          // const isPasswordValid = await user.comparePassword(password);
          const isPasswordValid = user.password == password;
          if (!isPasswordValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user._id.toString(),
            role,
            name: user.name,
            email: user.email,
            roll: role === "student" ? user.roll : "NA",
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
