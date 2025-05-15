import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Maps actual roles to their route folders
const roleRoutes = {
  student: "student",
  professor: "prof",
  admin: "admin",
};

const roleDashboards = {
  student: "/student",
  professor: "/prof",
  admin: "/admin",
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === "/" || pathname === "/auth/login";
  const isProtectedPath =
    pathname.startsWith("/student") ||
    pathname.startsWith("/prof") ||
    pathname.startsWith("/admin");

  const pathRole = pathname.split("/")[1]; // e.g., "prof", "student", "admin"

  // Case 1: Unauthenticated user trying to access protected route
  if (!token && isProtectedPath) {
    const redirectTo = `/auth/login?role=${pathRole}`;
    if (pathname !== redirectTo) {
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
  }

  // Case 2: Authenticated user trying to access login/home
  if (token && isAuthPage) {
    const dashboard = roleDashboards[token.role as keyof typeof roleDashboards];
    if (pathname !== dashboard) {
      return NextResponse.redirect(new URL(dashboard, req.url));
    }
  }

  // Case 3: Authenticated user accessing a different role's route
  const userRolePath = roleRoutes[token?.role as keyof typeof roleRoutes]; // "prof", "student", etc.
  if (token && isProtectedPath && pathRole !== userRolePath) {
    const correctPath =
      roleDashboards[token.role as keyof typeof roleDashboards];
    if (pathname !== correctPath) {
      return NextResponse.redirect(new URL(correctPath, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth/login",
    "/student/:path*",
    "/prof/:path*",
    "/admin/:path*",
  ],
};
