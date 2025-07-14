import Link from "next/link";
import { RoleCard } from "@/components/Home/RoleCard";
import { roles } from "@/constants/constants";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col font-monteserrat items-center justify-center px-8 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-slate-800 dark:text-slate-100 mb-6 font-montserrat tracking-tight">
          Welcome to{" "}
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">
            AcadMate
          </span>
        </h1>
      </div>

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
    </main>
  );
}
