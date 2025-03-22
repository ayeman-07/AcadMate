import { Metadata } from "next";
import { StudentLoginForm } from "@/components/auth/StudentLoginForm";
import { TeacherLoginForm } from "@/components/auth/TeacherLoginForm";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
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
  if (!["student", "teacher", "admin"].includes(role)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-medium text-slate-900 dark:text-slate-100 mb-2 font-montserrat tracking-tight">
            Welcome back
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Sign in to your {role} account
          </p>
        </div>

        {role === "student" && <StudentLoginForm />}
        {role === "teacher" && <TeacherLoginForm />}
        {role === "admin" && <AdminLoginForm />}

        <div className="mt-6 text-center">
          <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}
