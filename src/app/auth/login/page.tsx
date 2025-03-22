import { Metadata } from "next";
import { StudentLoginForm } from "@/components/auth/StudentLoginForm";
import { ProfessorLoginForm } from "@/components/auth/ProfessorLoginForm";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import { GlassBackground } from "@/components/ui/GlassBackground";
import { LoginFormContainer } from "@/components/auth/LoginFormContainer";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login - AcadMate",
  description: "Login to your AcadMate account",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const role = searchParams.role?.toLowerCase();

  // Redirect to home if no role specified
  if (!role) {
    redirect("/");
  }

  // Validate role
  if (!["student", "professor", "admin"].includes(role)) {
    redirect("/");
  }

  return (
    <>
      <GlassBackground />
      <div className="min-h-screen flex items-center justify-center p-4">
        <LoginFormContainer role={role}>
          {role === "student" && <StudentLoginForm />}
          {role === "professor" && <ProfessorLoginForm />}
          {role === "admin" && <AdminLoginForm />}
        </LoginFormContainer>
      </div>
    </>
  );
}
