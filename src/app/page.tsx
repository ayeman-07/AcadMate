import Link from "next/link";
import { AnimatedContainer } from "@/components/Home/AnimatedContainer";
import { AnimatedHeader } from "@/components/Home/AnimatedHeader";
import { RoleCard } from "@/components/Home/RoleCard";

const roles = [
  {
    title: "Student Portal",
    description:
      "Access your courses, assignments, and track your academic progress",
    iconName: "BookOpen",
    href: "/auth/login?role=student",
    color: "bg-indigo-500",
    delay: 0.2,
  },
  {
    title: "Professor Portal",
    description:
      "Manage courses, track attendance, and evaluate student performance",
    iconName: "GraduationCap",
    href: "/auth/login?role=professor",
    color: "bg-emerald-600",
    delay: 0.4,
  },
  {
    title: "Admin Portal",
    description: "Oversee institution operations and manage system settings",
    iconName: "Building2",
    href: "/auth/login?role=admin",
    color: "bg-violet-600",
    delay: 0.6,
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-gray-50/80 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 py-20 px-4 sm:px-6 lg:px-8">
      <AnimatedContainer>
        <AnimatedHeader />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {roles.map((role) => (
            <RoleCard key={role.title} {...role} />
          ))}
        </div>

        <div className="mt-16 text-slate-600 dark:text-slate-400 font-montserrat">
          <p>
            Need help?{" "}
            <Link
              href="/contact"
              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
            >
              Contact support
            </Link>
          </p>
        </div>
      </AnimatedContainer>
    </main>
  );
}
