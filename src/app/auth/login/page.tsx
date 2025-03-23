import { Metadata } from "next";
import StudentLoginForm from "@/components/auth/StudentLoginForm";
import ProfessorLoginForm from "@/components/auth/ProfessorLoginForm";
import AdminLoginForm from "@/components/auth/AdminLoginForm";
import OTPForm from "@/components/auth/OTPForm";
import GlassBackground from "@/components/ui/GlassBackground";
import LoginFormContainer from "@/components/auth/LoginFormContainer";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login - AcadMate",
  description: "Login to your AcadMate account",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    role?: string;
    otpRequired?: string;
    email?: string;
  }>;
}) {
  const { role, otpRequired, email } = await searchParams;
  const normalizedRole = role?.toLowerCase();

  if (
    !normalizedRole ||
    !["student", "professor", "admin"].includes(normalizedRole)
  ) {
    redirect("/");
  }

  if (otpRequired === "true" && !email) {
    redirect("/");
  }

  return (
    <>
      <GlassBackground />
      <div className="min-h-screen flex items-center justify-center p-4">
        <LoginFormContainer role={normalizedRole}>
          {normalizedRole === "student" && <StudentLoginForm />}
          {normalizedRole === "professor" && !otpRequired && (
            <ProfessorLoginForm />
          )}
          {normalizedRole === "admin" && !otpRequired && <AdminLoginForm />}
          {otpRequired === "true" && email && (
            <OTPForm email={email} role={normalizedRole} />
          )}
        </LoginFormContainer>
      </div>
    </>
  );
}
